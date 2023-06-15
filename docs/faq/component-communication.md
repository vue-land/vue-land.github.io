# How should my components communicate?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

- Props
- Events
- v-model (props & events)
- Slots
- Provide/inject
- Global reactive state, e.g. a Pinia store
- Don't use a global event bus

To communicate with siblings, you'd typically emit an event up to the parent, which would then pass a prop down to the sibling.
