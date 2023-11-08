# Why can't I use the current route inside `App.vue`?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

The short answer is *timing*. You can use the current route inside `App.vue`, but it won't be available in time for the initial render.
