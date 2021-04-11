# puppeteer-extra-plugin-session

<img src="https://www.vkf-renzel.com/out/pictures/generated/product/1/650_650_75/r12044336-01/general-warning-sign-10836-1.jpg" width="100" height="100" alt="warning sign"/>

## ⚠️ This is a WIP: not usable yet ⚠️

TODO: SHORT introduction and behaviour explanation

## Dev notes

The API should look like this:

```typescript
const session = await page.dumpSession()
// we get an object that we can edit (important)
await page.restoreSession(session)
```

How to do this: [puppeteer-extra-plugin-recaptcha example](https://github.com/berstend/puppeteer-extra/blob/cfebb86e9ea2e328d4ba14432781ec34f55491ca/packages/puppeteer-extra-plugin-recaptcha/src/types.ts#L30)

## Installation

```bash
yarn add puppeteer-extra-plugin-session
# or
npm install puppeteer-extra-plugin-session
```

## Usage

First of all, you have to register the plugin with `puppeteer-extra`.

JavaScript:

```js
puppeteer.use(require('puppeteer-extra-plugin-session')())
```

TypeScript:

```ts
import SessionPlugin from 'puppeteer-extra-plugin-session';
puppeteer.use(SessionPlugin())
```

TODO: in the field usage demonstration

## Testing

TODO: testing guide

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
