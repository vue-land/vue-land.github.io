# Why can't I use the current route in `App.vue`?

The short answer is *timing*. You can use the current route in `App.vue`, but the initial render will usually occur before the route is resolved.

## Understanding the problem

Let's imagine we have an application structured like this:

```
App
+- RouterView
   +- HomePage
```

Here, `HomePage` is the route component for the current route, shown by the `RouterView`.

Inside `HomePage` we might want to access the current route, maybe so we can access `params` or `query`. That's no problem, we can just use `useRoute()`:

::: code-group

```vue [Composition API]
<!-- HomePage.vue -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.params.id)
</script>
```

```vue [Options API]
<!-- HomePage.vue -->
<script>
export default {
  created() {
    console.log(this.$route.params.id)
  }
}
</script>
```

:::

If you're using the Options API then you'd use `this.$route` instead, but it works out much the same.

If `HomePage` has child components then we can also use `useRoute()` or `this.$route` to access the current route in those components.

But it gets a bit trickier if we're outside the route component, e.g. in `App.vue`.

Resolving the route is not a synchronous process. [Navigation guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) and [lazy-loaded components](https://router.vuejs.org/guide/advanced/lazy-loading.html) can be asynchronous, so the route won't be resolved until they are complete. Even if you aren't using those features, Vue Router uses promises internally, so the route still won't be resolved synchronously.

When you first mount the application, `App` will render, but the route won't be resolved yet, so the `RouterView` will be empty.

It is still possible to access `useRoute()` or `this.$route` during that initial render, but the route object will just be a placeholder. It won't yet contain the resolved values for the route.

## A realistic example

Consider the following example. It tries to use the current route in `App.vue` to decide which layout to wrap around the `RouterView`:

```vue [App.vue]
<script setup>
import DefaultLayout from './layouts/DefaultLayout.vue'
</script>

<template>
  <component :is="$route.meta.layout || DefaultLayout">
    <RouterView />
  </component>
</template>
```

During the initial render, the `$route.meta` won't be populated yet, so `layout` will just be `undefined`. It'll use the `DefaultLayout` for that initial render, no matter which route was accessed. This can lead to the page flashing, as it renders `DefaultLayout` and then jumps to an alternative layout once the route is resolved.

There are a few ways we might fix this problem.

## Deferring mounting

Vue Router provides the method [`isReady()`](https://router.vuejs.org/api/interfaces/Router.html#isReady), which can be used to wait until it has resolved the route. We could use it to defer mounting the application until the route is ready:

```js [main.js]
const app = createApp(App)

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
```

This approach is often used in SSR (server-side rendering), where both the server and client need to render the route component as part of the initial render. But it can also be used in applications without SSR.

The potential problem with this approach is that it delays all rendering until the router is ready. If you're using SSR then this isn't likely to be a problem, as the user will see the server-generated content straight away and won't notice the small delay in hydration. But if you aren't using SSR, the Vue portion of your page will just be missing until it resolves. Most likely, your users will just see an empty page.

Depending on your application, that might not matter. A brief pause before the page shows might be good enough, especially if the alternative is a page that flashes between layouts.

## Extra handling in `App.vue`

With a bit of extra effort, we could show a loading indicator if the route isn't resolved yet. There are a few ways we might implement this. One approach would be to use `router.isReady()` inside `App.vue` to track when the router is ready. e.g.:

```vue [App.vue]
<script setup>
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'

const router = useRouter()

const fallback = shallowRef(LoadingIndicator)

router.isReady().then(() => fallback.value = DefaultLayout)
</script>

<template>
  <component :is="$route.meta.layout || fallback">
    <RouterView />
  </component>
</template>
```

Here we're using the `LoadingIndicator` component in place of the layout. The `LoadingIndicator` will ignore the slot content.

We could also implement this using the slot of `RouterView`:

```vue [App.vue]
<script setup>
import DefaultLayout from './layouts/DefaultLayout.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component v-if="Component" :is="$route.meta.layout || DefaultLayout">
      <component :is="Component" />
    </component>
    <LoadingIndicator v-else />
  </RouterView>
</template>
```

The trick here is that the `Component` in the slot props will be `undefined` if the route hasn't resolved yet.

## Using `location` instead

The examples above used `meta`, which is tied to the route. But sometimes we might not need the route itself, we only need information that is present in the URL. Rather than waiting for Vue Router to resolve the route, we could parse the URL ourselves.

Let's imagine we have a URL like `http://example.com/users?page=1`. We could parse that using something like this:

```js
const path = location.pathname                       // '/users'
const search = location.search                       // '?page=1'
const page = new URLSearchParams(search).get('page') // '1'
```

Reference: <https://developer.mozilla.org/en-US/docs/Web/API/Location>
