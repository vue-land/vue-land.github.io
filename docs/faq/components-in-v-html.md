# Why isn't `v-html` rendering my components?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

`v-html` just sets the `innerHTML` property of an element. Vue won't attempt to interpret the string as a template, it will just pass it on as is to the browser.

If you have the runtime template compiler enabled then you can do something like this instead:

```vue-html
<component :is="{ template: str }" />
```
