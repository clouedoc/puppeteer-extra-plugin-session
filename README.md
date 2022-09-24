# puppeteer-extra-plugin-session

> A puppeteer-extra plugin to export and import session data (cookies, localStorage, sessionStorage, indexedDb)

## Introduction

Dump and restore session data from your puppeteer pages.

This plugin supports:

- cookies
- localStorage
- sessionStorage
- IndexedDB _(currently, only the securityOrigin of the current page will get dumped)_

## Installation

```bash
yarn add puppeteer-extra-plugin-session
# or
npm install puppeteer-extra-plugin-session
```

## Usage

### Basic usage

First of all, you have to register the plugin with `puppeteer-extra`.

JavaScript:

```js
puppeteer.use(require('puppeteer-extra-plugin-session').default());
```

TypeScript:

```ts
import SessionPlugin from 'puppeteer-extra-plugin-session';
puppeteer.use(SessionPlugin());
```

Then, you'll have access to session data helpers:

```ts
const sessionData = await page.session.dump(); // or page.session.dumpString()

// [...]

await page.session.restore(sessionData); // or page.session.restoreString(sessionData)
```

### Selecting storage backends

You may wish to exclude certain storage backends from being dumped or restored.
This can be done by passing an options object to the `dump` and `restore` methods:

```ts
import { StorageProviderName } from 'puppeteer-extra-plugin-session';

const sessionData = await page.session.dump({
  storageProviders: [
    StorageProviderName.Cookie,
    StorageProviderName.LocalStorage,
  ], // only dump cookies and LocalStorage
});

// Here is the list of StorageProviderName:
//  * StorageProviderName.Cookie
//  * StorageProviderName.LocalStorage
//  * StorageProviderName.SessionStorage
//  * StorageProviderName.IndexedDB

// You can also filter what gets restored:
await page.session.restore(sessionData, {
  storageProviders: [StorageProviderName.Cookie], // only restore cookies (the previous dump also contained LocalStorage)
});
```

## Testing

Tests are defined in `*.spec.ts` files.

You can run the tests watcher using `yarn test` or `npm run test`

## Debugging

You can see the package's logs by setting the `DEBUG=puppeteer-extra-plugin:session` env variable.

Example: `DEBUG=puppeteer-extra-plugin:session npm test`

### Base Puppeteer-Extra Plugin System

See the core Puppeteer-Extra Plugin docs for additional information:
<https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin>

## Contributing

We appreciate all contributions.

See [TODO.md](/TODO.md)

## License

MIT

## Resources

- [Puppeteer documentation](https://pptr.dev)
- [Puppeteer-Extra plugin documentation](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin)
- [CDP documentation](https://chromedevtools.github.io/devtools-protocol/)
