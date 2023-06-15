# How do I check which version I'm using?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

You'll need to know whether you're using Vue 2 or Vue 3 so you can post in the appropriate channel, `#vue-2` or `#vue-3`.

There are a few ways to tell from the code. The entrypoint code for your application (usually in a file called `main.js` or `main.ts`) is a good place to start:

```js
// This is Vue 2
import Vue from 'vue'

new Vue({
  // ...
})
```

```js
// This is Vue 3
import { createApp } from 'vue'

createApp(/* ... */)
```

Be careful with `@vue/composition-api`. If you're using that package then you're using Vue 2, but a lot of the code will look like Vue 3. Check the import for `createApp`.

You can also check the `package.json` file, as that should also show whether you're using Vue 2 or Vue 3.

However, the `package.json` file is generally not a good way to figure out the exact version, beyond the major version number. For that you've got a number of options:

- Check the lock file.
- `npm list` or `yarn list` or `pnpm list`, depending on which package manager you're using.
- Check the version property. In Vue 2 that'll be in `Vue.version`. In Vue 3 you'd typically access it via `import { version } from 'vue`, or via `app.version`.
