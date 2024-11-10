import { bootstrap } from '@easylayer/bitcoin-wallet';

bootstrap({
  appName: 'easylayer',
}).catch((error: Error) => console.error(error));