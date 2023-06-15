# Why does my logging show an empty/missing value after I've loaded the data?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

The scenario we're considering here typically looks something like this:

```vue
<script setup>
import { onBeforeMount, ref } from 'vue'

const data = ref(null)

onBeforeMount(async () => {
  data.value = await fetch(/* ... */)
})

console.log(data.value)
</script>
```

While the code for the console logging appears to be after the data has loaded, it actually runs before the data loads. There are several reasons for that:

1. The `onBeforeMount` hook will run just before the component mounts, not immediately. Mounting occurs just after `setup` has completed.
2. The `fetch` request is asynchronous. It returns a promise and that promise won't resolve until the data comes back from the server.
3. Using `await` is equivalent to using `then()` on the promise. The `then()` callback is never called immediately, even if the promise has already resolved. It is deferred using something known as a microtask.

The console logging will run before any of those things have happened.
