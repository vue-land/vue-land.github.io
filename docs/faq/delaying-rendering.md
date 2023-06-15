# How can I make Vue 'wait' for the data before rendering?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

Generally speaking, you can't.

Instead, you put a `v-if` in your template, surrounding the region that depends on the loading data. You can use a `v-else` to show some alternative content while the data is loading.

Loading data using `onBeforeMount` won't help you. That hook is called prior to rendering, so it will initiate loading before anything is rendered, but Vue won't wait for any asynchronous requests to complete before it renders the component.
