---
outline: [2, 3]
---
# How do I check which version I'm using?

## Identifying Vue 2 and Vue 3

It usually isn't necessary to know exactly which version of Vue you're using, but it is important to know whether it's Vue 2 or Vue 3.

### Based on the code

If you've encountered some Vue code written by someone else, it is usually possible to figure out which version it is using.

If it's an application, rather than a library, then start by looking at the entrypoint code. This is usually in a file called `main.js` or `main.ts`:

```js
// This is Vue 2
import Vue from 'vue'

// Also Vue 2
new Vue({
  // ...
})
```

```js
// This is Vue 3
import { createApp } from 'vue'

createApp(/* ... */)
```

Anything that uses `import Vue from 'vue'` will be Vue 2.

Libraries often export plugins, which are used like this:

```js
import Vue from 'vue'

// Plugin registration with Vue.use() is Vue 2
Vue.use(plugin)
```

Registration functions such as `use()` and `component()` have been moved to the `app` object in Vue 3:

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

// Plugin registration with Vue 3
app.use(plugin)
```

Other ways to identify the version:

- Vue 2 has lifecycle hooks called `beforeDestroy` and `destroyed`. In Vue 3 those are called `beforeUnmount` and `unmounted`.
- Component `v-model` in Vue 3 uses the `modelValue` prop and `update:modelValue` event. In Vue 2 it was configurable, but it defaulted to `value` and `input`.
- `$listeners`, `$children` and `$scopedSlots` are Vue 2 only.
- The `.sync` and `.native` modifiers are both Vue 2 only.

The Options API and Composition API can be used with either Vue 2 or Vue 3, so it isn't a reliable way to identify the version. However, if you're looking at the documentation for a library and it only shows the Options API, then it is more likely to be Vue 2.

### Using `package.json`

If you have access to the `package.json` file for a project, the `vue` package should be listed. It usually won't tell you the exact version, but it should be enough to differentiate between Vue 2 and Vue 3.

If you see something like this:

```json
{
  "vue": "^2.6.8"
}
```

That tells you that it is using `2.6.8` or above. The installed version must match the first number (the `2`), but `^` indicates that the other two numbers (the `6.8` part) should be treated as a minimum version. So the installed version might be `2.7.14`, but it can't be Vue 3.

## Checking the exact version

While the `package.json` will typically tell you the minimum version number, it usually won't be much help in identifying the exact version that is installed. If you need that then you've got a few options:

- Check the `version` property in your code. In Vue 2 that'll be in `Vue.version`. In Vue 3 you'd typically access it using `import { version } from 'vue'`, or via `app.version`.
- Check the lock file. That'll be `package-lock.json`, `yarn.lock` or `pnpm-lock.yaml`, depending on which package manager the project uses.
- `npm list` or `yarn list` or `pnpm list`, depending on which package manager you're using.

::: code-group

```sh [npm]
npm list vue
```

```sh [yarn]
yarn list --pattern vue
```

```sh [pnpm]
pnpm list vue --depth 100
```

:::

You will need to install the dependencies before running the `list` command.

The `why` command can also be used to check the version, as well as to explain why a particular dependency is installed:

::: code-group

```sh [npm]
npm why vue
```

```sh [yarn]
yarn why vue
```

```sh [pnpm]
pnpm why vue
```

:::

## Vue CLI

[Vue CLI](https://cli.vuejs.org/) is a common source of confusion among beginners when it comes to checking their Vue version.

Vue CLI is an old build tool for Vue. It is still sometimes used for projects that need webpack, but most new projects use Vite instead. Vite can be used with Vue 2 and Vue 3, but most Vue 2 projects were created before Vite existed, so it's still common for them to be using Vue CLI.

Vue CLI includes a global package that can be run via the command line using the `vue` command. This is where the confusion can occur. To clarify:

- Vue is a JavaScript framework. It uses the `vue` package name on npm.
- If you're running the `vue` command from the command line, that is Vue CLI. You don't need Vue CLI to use the Vue JavaScript framework.

If somebody asks you what version of Vue you are using, they almost certainly mean the Vue JavaScript framework, not the Vue CLI version.

If you have Vue CLI installed, running the command:

```sh
vue --version
```

will output something like:

```
@vue/cli 5.0.8
```

That is the version of the globally installed Vue CLI package, not the version of Vue.

If your project was created using Vue CLI then there will also be a local dependency on the *Vue CLI service*. You'll find that under the package name `@vue/cli-service` in your `package.json`. The version of `@vue/cli-service` for a project may be different from the version of the globally installed Vue CLI.

Vue CLI version 4 uses webpack 4. Vue CLI 5 uses webpack 5.
