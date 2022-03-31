import tmi from 'tmi.js';

export type ChatMessage = {
  tags: tmi.ChatUserstate;
  message: string;
};

type InitProps = {
  username: string;
  password?: string;
};

export const emitter = document.createElement('div');

let client: tmi.Client;

export default function InitService({ username, password }: InitProps) {
  if (!password) {
    console.warn(
      'Starting Overlay in Anonymous mode...' +
        '\n\nTo enable outbound chat from the overlay, provide the username/password as described in the readme:' +
        '\n\thttps://github.com/nerdfoundry/brb-fitb'
    );
  }

  client = new tmi.Client({
    options: { debug: true },
    identity: { username: password ? username : undefined, password },
    channels: [username]
  });

  client.connect();

  client.on('message', (_channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    emitter.dispatchEvent(new CustomEvent<ChatMessage>('message', { detail: { tags, message } }));
  });
}
