# How can I pass all slots through to a child component?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

```vue-html
<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
  <slot :name="slotName" v-bind="slotProps ?? {}" />
</template>
```
