# How can I share state with a composable?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

Composables are JavaScript functions. Vue doesn't have any specific support for composables, it's just a name given to a common usage pattern. Normal JavaScript rules still apply.

So if a ref is created inside the composable, you'll get a new ref each time the composable is called:

```js
export function useSidebar() {
  const isOpen = ref(false)

  return { isOpen }
}
```

Every component that calls `useSidebar()` will get a different ref, so this composable can't be used to shared state.

If we move the creation of the ref outside the function, it'll be shared instead:

```js
const isOpen = ref(false)

export function useSidebar() {
  return { isOpen }
}
```

Now, every call to `useSidebar()` will return the same `ref`, allowing that state to be shared.

In the example above, where we're just returning a ref, it probably isn't necessary to use a composable at all. We could just share the ref directly:

```js
export const isOpen = ref(false)
```
