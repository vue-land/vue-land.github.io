# Why am I getting an error about 'no active Pinia'?

This is the error message from Pinia:

> [🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
>
> See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
>
> This will fail in production.
> {.quote-code-error}

While this probably goes without saying, you should start by reading the page linked in the error message.

## Quick fixes

Before we do a deep dive into what might be going wrong here, let's briefly cover some common problems that have quick fixes.

### Quick fix 1 - Call `app.use(pinia)` as early as possible

As implied by the error message, you might need to move the call to `app.use(pinia)` to an earlier point in your code.

In general, calls to `app.use(plugin)` need to happen before `app.mount(el)`, so the following example is unlikely to work for any plugin, not just Pinia:

```js
const pinia = createPinia()
const app = createApp(App)

// This is the wrong order, it won't work
app.mount('#app') // [!code error]
app.use(pinia) // [!code error]
```

The order plugins are used also matters, depending on what each plugin does. This example is using Pinia and Vue Router:

```js
const pinia = createPinia()
const app = createApp(App)

// These are in the wrong order
app.use(router) // [!code error]
app.use(pinia) // [!code error]

app.mount('#app')
```

That example is calling `app.use(router)` before `app.use(pinia)`. Most of the time that won't matter, but if something in the router tries to use the store it can fail.

In particular, the call to `app.use(router)` will immediately try to resolve any redirects. e.g.:

```js
export default createRouter({
  // ...
  routes: [
    {
      path: '/',
      redirect() {
        const authStore = useAuthStore() // [!code highlight]
        return authStore.user ? '/home' : '/login'
      }
    },
    // ...
  ]
})
```

The `redirect` function will be called as part of `app.use(router)`, before the call to `app.use(pinia)`. As a result, the call to `useAuthStore()` will fail.

Here's a Playground that shows this failing:

- [Broken Playground example](https://play.vuejs.org/#eNqNVE1P20AQ/Ssjt5IdKbGBphysQEMrpLZSWwSol7oHYw/xgr1r7a5JUJT/3tld23FCQD3kwzNvZt7Me8naq1LGwwflxR6raiE1rCGTmGq8qGvYwL0UFfhPDfoJ3wNcMc7SHlKbpy1IikajbHNh5B63adO8y6V1HboBCc8EVxpsLzgbzglGXZLgfYraBPSiXMKjCG4LVAipRGAcdIGwlIIvQMgcZcLNnEZh4LhQTRew42wPE6lEw3Xgv6Pv/sgbe2mji70D5XjPON5oQZP29084rizMsaX+F9TAYc+GlYFvOvtjWCccQGlaJ4ZgBGfnLgIgUTeS0zxqImPgTVnCxqTobWOpucsRtZnKJKs1KCqpzwdSXdtlfzNcDsWc9HrMIldJNfSgsapLIkJPALNBbUSRWdSnabbrcNA5P7AS8vkrU7Tm87gNumaHSfT1O9fqoOQQJ8EWeZkVwvLqEF2gN1IrAt07bUoSY8AhsOctHL34EOdgNDYQy0/F8MfJ0aoCUKe6iMGPfItySuVMYqZJvh4FrQMM+U7+4X7G0R2yVbqHGltK+EQzClGhD2ZaKRaM026uwvqAPlr7DGnZkp5aJuhkHLmO+6u9Xupm/Eet+fjbunB4e2PFHROt1/De3jE0M2BDlbs+copOqrQmhQWnBpZV0iZU4sUdz8Sb04goxyctRKkmac1MNvEKrWsVR1HD68dFSKyjF8D5aXgaTqOS3UWoqojxHFc0MPHaZRPP/oBf62eT85PwJPwY5WQSFwip1eROiiWptdvM2DvH6lV+XX5+FB5Pw+MjS8yRql40cr+Tt1o5xHwaTjt+2+gLkt0/CB1fK/LoPVvsnd7ozkqUv2rNyMM7EqRlKZbfbUzLBnuiWYHZ44H4g1o55leS/pzlEw6W06lcoHbpy5ufuKLvfbISeVMS+o3kNSpRNoajg31ueE60BzjL9pt1EuOLW3W50shVt5Qhaq9h8fbYX95YfUv3Qzjtr7j5B4vzcGA=)

The same applies if you're using other Vue plugins, not just Vue Router.

### Quick fix 2 - Missing `setup` attribute

If you're trying to use the store in a component with `<script setup>`, make sure haven't forgotten the `setup` attribute. If you just write `<script>` it'll run too soon.

For example:

```vue
<!-- This is wrong -->
<script> // [!code error]
import { ref } from 'vue'
import { useProductsStore } from './products-store'

const products = useProductsStore()
const id = ref(123)
</script>

<template>
  <div>
    <button @click="products.fetch(id)">
      Load
    </button>
  </div>
</template>
```

Here it is in a Playground:

- [Broken Playground example](https://play.vuejs.org/#eNp9VMGO2jAQ/RUrrZQgLc7Coj0gqGirPbSqWtTtMYcNyQS8JLZlOywSyr93bCchsGIPIHve85t5Y09OQZUyTl91MA9YJYUy5EQyBamBr1KShhRKVCQ81BAm/IqwZpylPUXa3ZlkT3uAxqmU1CskPBNcG4IRsjznifA36jAn1KMuSYSgFak1RA7GvY9UouYmCj/hOhwFd62HcZVK9CQ4ujolnJCkBXQSzImL2NgKi4pzOBghSj1OJbNoEuyMkXoexzWX+y3NRBW/I64e6SOdxSXbxKCrmPEcjpgwCe46bVfmLT0HrqZ0iho508YHKEqNN0q8aVCXYph+nEN1s74OX93TyYxO7l1hvqjKClmdJuENNsho7HLBtlftQRXJSlB/pGF4CxdtSstSvP10MaNq6KvKdpDtfbxIS30GXvXRV7pWgF4OMLBiUrUF4+Gn599wxHUPViKvS2R/AP4FLcraFulp32qeY90Dniv3h7tuxrf/9NPRANedK+vAtcPxXWu/f+D9XO4DnQ3a2D5pbOBCZ4pJ82UwHgqKW5ODL3it0Ehm9LMRCnoejWUbH2sLDIalA3Amro/bwfAkliOMiaPJ9AGDi7gvCzcGKlniMOGOkEXODm6By01tjOBklZUs2y/x1bbitACT7SKWj5Kg5RLyS6R5ey72B70ePmEruIgHabBFl36uPjE5FIzDZQu6L0jC4eho3tm7li2Hp6OwyxPe+WtLM3eN/SX2VroAccKiBFqKbfRibeFDIZ9PLG9esHeWgdeMf/gCeDMKmv+R47yg)

Change `<script>` to `<script setup>` and everything works fine.

### Quick fix 3 - Invoking the store by mistake

This example is using the Options API. The mistake is the line `...mapStores(useProductsStore())`. That should be `...mapStores(useProductsStore)` instead, without the parentheses. We need to pass in the function, not the store:

```vue
<script>
import { mapStores } from 'pinia'
import { useProductsStore } from './products-store'

export default {
  data() {
    return {
      id: 123
    }
  },
  computed: {
    // This is wrong...
    ...mapStores(useProductsStore()) // [!code error]
  }
}
</script>

<template>
  <div>
    <button @click="productsStore.fetch(id)">
      Load
    </button>
  </div>
</template>
```

- [Broken Playground example](https://play.vuejs.org/#eNp9VF1v2jAU/StWNokgFadf6gOiE9vUh03TVq17zEPd+AIujm3ZDkVC/Pdd20kIVPQBKb7n+vicY192Wc2Eoq8um2aiNtp6siOVBebhqzFkTxZW12S0aWBUqpOGR6EE61tMWB2awu4E0IIZQxNDqSqtnCdYIfeHc3L8jTssEvVoPCRHMJA0DvII4zpVat0on48+4fdonF20HiY1M+hJK3S1KxUhZQu4MpuSWAm1OYoqOGy81tJNmBEBLbOV98ZNi6JRZr2kla6Ld43zO3pHbwspXgpwdSEUhy0eWGYXHXeUeY4vgvNreo0cXDifChSpJi9Wvzmwx2R4/IRDfVZfh88v6dUtvbqMwpKoOhAFnn2p9hiQd5jyQixP4kEWIyTYP8YLvIWjmJiU+u1nrHnbQK+qWkG1TvUFk+4AvLptUvpoAb1sYGDFM7sEn+CHp9+wxe8erDVvJHZ/AP4Fp2UTRKa2b43iqHvQF+X+iNct1PKfe9h6UK5zFRzEOGJ/jPb7B94Pcm/o7SDG9kljgDNXWWH8l8F44Ot78hq9nxuOHcGX/GjRUOVdbO07aWHa+sQFIA4NbOM2DgvWSNwehHDmcS46pRZ8Y1W3IkTwKbm6vklL1NwZDvfceEC0baWU9nLzU1X5GActeS7VrOid4sJDbSTOJ64ImXGxiR/4+dJ4rxWZV1JU63schCEhXYCvVrng4zJrNxDySzPebi7S7kSKoxFYZ8XgLIz+OJ+Tvy6MSCg4jrQLv88x/c+8u4L74e581J0zukhZsSo+jz653soh9UCsJVCpl/lzsIUPkHzeCb5/jkF2V4EvS+3H2f4/xF7YQQ==)

### Quick fix 4 - Put it in a function

If the store call is outside a component, or in a component that isn't using `<script setup>`, make sure the call is inside a function. If it's in top-level code it will run too soon.

Here's an example using Vue Router:

```js
// This won't work, because the call is at the top level
const authStore = useAuthStore() // [!code error]

router.beforeEach((to) => {
  // Do something involving authStore
})
```

We can fix this by moving the store call inside the `beforeEach()` callback:

```js
router.beforeEach((to) => {
  // This should work
  const authStore = useAuthStore() // [!code highlight]

  // Do something involving authStore
})
```

This kind of fix is the most common, but it can also be the most difficult to apply in practice. It isn't always that easy to move the call to a suitable function.

The rest of this page goes into the details of what's going wrong, why, and some ways you might fix it.

## The basics

There are 3 steps to creating a store with Pinia:

```js
// Step 1. Defining the store
const useProductsStore = defineStore('products', { /* ... */ })

// Step 2. Creating and registering the Pinia instance
const pinia = createPinia()
app.use(pinia)

// Step 3. Using the store
const products = useProductsStore()
```

The first two steps could happen in either order, but the third step has to happen last.

The error is shown when step 3 occurs before step 2. The Pinia instance must be created and registered with the application before the store can be used. We can see the error with this example:

- [Playground example](https://play.vuejs.org/#eNp9kUtvwjAQhP+KlQtpBXYfqAekSrRVD+2hRW2PuYRkCYb4IdsBJJT/3rVDwqOFW7Qz+2V2vI1EyiVd2GgUcaGVcWRLMgOpgyetSU1mRgnSW1XQS+SJYcIlT/skhxmX8O2Ugc6vvYQbicyUtI5UFiZG5VXmbGN8PFyLe3on9vpIZ9eEUkquGamv9ojWgquntPjAlmLqx/0F8dYzdgQfqhNDer+JGxSJcZA7kiqBlqqI29+iEPV3FQ1EqrEyJbG0bSIJSXaCTaIRCRM/G2NrLIeVU6q0g1RzrybR3DltR4xVUi8LminB/hjHD/SBDlnJpwysYFzmsMEfJlG/ZYew53hBHN/RO2Tk3LpmQBE1mBq1tmCOYfj7QQ7ibL5WH9/Q2yG9vQnBmlDCgzynTmSNBTmL5c14cVIPUjQvwXxqx7Hco5rSslTr9zBzpoIuVTaHbPnPfGE3TdCJATxlBQeXuNQU4Br59fsDNvjdiQJfskT3BfEL8OErn7GxPVcyx9gHvpD2Lbw2l8WPfd04kLY9ygcNbQR/aPblwun7uPd02LVY/wJpITTr)

But, in practice, it probably isn't that simple. In a real application, those 3 steps usually don't sit in the same file. More likely, they're in 3 separate files, something like this:

```js [useProductsStore.js]
export const useProductsStore = defineStore('products', {
  // ...
})
```

```js [main.js]
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from 'App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
```

```js
// Some other file
const products = useProductsStore()
```

So the key question is, when does the code in that final file run relative to the code in `main.js`?

To understand that, we first need to understand `import`, and specifically how JavaScript decides what code to run when.

## Understanding `import`

Let's start with a plain `.js` example. It works much the same way with `.ts` and we'll stick to `.js` throughout this page. It's a bit more complicated with `.vue` files, but we'll cover those later.

```js [main.js]
import { data } from './store.js'

console.log('main.js', data)
```

```js [store.js]
const data = { name: 'Vue' }

console.log('store.js', data)

export { data }
```

You can see this code running in the Playground:

- [Playground example](https://play.vuejs.org/#eNp9UbtOxDAQ/BXLjUE6hQKqSDSgK6AABIjKjZXsBR/2OvLjiBTl31k7JDx0um41M7uanRm5VRqrfeA117Z3PrKRtSoqNrGdd5aJ6iJE54EkQqLExmFwBirjujPxvSs2ZeVcIt/wGEiy0x3hDunqKJExyRtne23AP/ZR0wnJa1aYzClj3Od9waJPsFnw5h2ajyP4PgwZk/zJQwB/AMlXLirfQZzp7csDDDSvpHVtMqQ+QT4DvZeyx1l2k7Al2790xe1dyUpj9xq2QwQMy1PZaFZORS/5IcHtidd/7F5WV2VP4kQpLplTgDnxOHdyTeWgslAz8ZZAZPG/Rtau1kokwvCnV2pp+gIuW6Wf)

The console logging in `store.js` happens first, then the logging from `main.js`.

More generally, there are 3 keys things to understand about the order code runs with `import`:

1. If a file imports another file, the top-level code in the imported file runs first.
2. If multiple files are imported, they'll run in the order they're imported.
3. Imports are [hoisted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#hoisting). You can't delay an `import` just by moving it down below other code in the same file.

Here's a Playground that demonstrates these 3 points:

- [Playground example](https://play.vuejs.org/#eNp9kTFPwzAQhf+K5SUgVWGAqSOoAwyAgNFLmlyDi30X2ZcSqcp/5+zQQqu2W/Ted/G7e1vtK4vlOuq5rgkjOSgdtVcFU6dopX7d4tqg9R0FVkV5UyXF4AHvbdM4ODuyPDGyJGbyRyN6pjkKtrKtKISSa2tQKSPxfGcdhJeOrfzG6LnKTvIq5+j7KWscepjt9PoT6q8T+joOSTP6NUCEsAGj9x5XoQWe7MX7MwzyvTc9Nb0T+oL5BrJinzJO2H2Pcpnwj8tpH/NtLLYfcTEwYNwtlYImcsy80ZseHi6s/hf3trzLcwZHuWIq6bhUK680oHJ/061TL2eoXFmixh+DMbQL)

::: code-group

```js [main.js]
console.log('top of main.js')
import './a.js'
console.log('middle of main.js')
import './b.js'
console.log('bottom of main.js')
```

```js [a.js]
console.log('inside a.js')
```

```js [b.js]
console.log('inside b.js')
```

:::

We see the logging from `a.js` first, then `b.js`. The 3 log lines in `main.js` come at the end. Due to the hoisting, that code is equivalent to:

```js
import './a.js'
import './b.js'
console.log('top of main.js')
console.log('middle of main.js')
console.log('bottom of main.js')
```

::: warning
The Playground isn't a totally reliable way to experiment with `import`. It works fine for the examples we've included here, but if you want to explore the handling of more complicated edge cases you may find it behaves slightly differently from bundlers.
:::

If we import a file that also contains imports then it works much the same way, running the imported files first then working its way up the tree until it eventually runs the original file. For example:

- [Playground example](https://play.vuejs.org/#eNp9kb1Ow0AQhF/ltI2JFJkCqpSgFFAAAsptjL2YC+c9634SS5HfPXuXfylyZ898u5qd20JXaS5XHhagu966oIryvhKhQEauLXtrqDS2vSs0e92QOgwUM5hD8EL86lb+LcuKLbJSCLXtem3IvfdBywaEhcpO8ipj7OY1a8FFmh/1+o/q/xv6yg9JQ/hw5MmtCeHkhcq1FPb28uuNBvk+mZ1tohF6wvwkuS6mjHvsKXIjsS+4nPYlF6O5/fbLIZDUcDgqBU3kmHmEdaTnidPPcR/KxzyHPEqLqe6r/n+m+s+PM0OWwcTJ4C0qr0jUuAN6gJzj)

::: code-group

```js [main.js]
import './a.js'

console.log('inside main.js')
```

```js [a.js]
import './b.js'

console.log('inside a.js')
```

```js [b.js]
console.log('inside b.js')
```

:::

Here we'll see the logging from `b.js` first, then `a.js`, then `main.js`.

In a real application, you might have the same file imported in multiple places. In that scenario, it'll only run the top-level code the first time it's imported and reuse the exports for subsequent imports.

It's also possible to have circular dependencies, where two (or more) files import each other. We won't go into detail about that here because it isn't relevant to solving the original Pinia error, but it can cause problems as it isn't necessarily clear which file should run first.

### What is 'top-level code'?

In the explanation above, we repeatedly talked about running the *'top-level code'* in an imported file. But what exactly does that mean?

In this context, it means code that isn't inside a function.

Consider this code:

```js
const a = 1
const b = 2
const c = a + b
const d = { count: 1 }

function add() {
  return a + b
}
```

The first 4 lines, creating `a`, `b`, `c` and `d` are all top-level code.

As for the function, that's a bit of both. The declaration (i.e. creation) of the function is top-level code. But the code inside the function, `return a + b`, is not top-level code. That will only run if something invokes the function.

So, if we imported a file that contained the code above, all of that code would run, apart from the body of the function.

### How does this work with `.vue` files?

`.vue` files are compiled to `.js` files behind the scenes.

If the `.vue` file has a `<script>` section (not `<script setup>`), then you can think of the contents of that section as being just like a `.js` file. `import`, `export`, running top-level code... it all works the same way.

With `<script setup>` there's a bit more going on. Imagine you have a `<script setup>` section like this:

```vue
<script setup>
import { ref } from 'vue'

const msg = ref('')
// ... other stuff
</script>
```

When Vue compiles this to `.js` it'll become something like this:

```js
import { ref } from 'vue'

export default {
  setup() {
    const msg = ref('')
    // ... other stuff
  }
}
```

Most of the code inside `<script setup>` is wrapped in a `setup` function. But there are a few exceptions, such as `import`, which need to be kept outside `setup`.

Code that gets wrapped in the `setup` function is not top-level code. So if you import a `.vue` file, that code won't run immediately, it'll only run when something (usually Vue) calls the `setup` function. But if the `.vue` file contains any imports, those will happen immediately, as soon as the `.vue` file is imported.

## Accessing the store in top-level code

Generally speaking, you shouldn't be trying to access the store in top-level code.

Let's say we have some code like this:

```js [product-utils.js]
import { useProductsStore } from '@/stores/products'

const products = useProductsStore()

export function fetchProduct(id) {
  return products.fetch(id)
}
```

Here we're calling `useProductsStore()` in top-level code, so that'll happen as soon as `product-utils.js` is imported.

When exactly this happens will depend on exactly where this file is imported. If it's imported into `main.js`, either directly or via other imports, then it'll run before the code in `main.js`, which include the creation of the Pinia instance.

### Wrapping the store call in a function

In the example above, we might fix it by moving the call to `useProductsStore()` inside `fetchProduct()`:

```js [product-utils.js]
import { useProductsStore } from '@/stores/products'

export function fetchProduct(id) {
  const products = useProductsStore()
  return products.fetch(id)
}
```

With this revised version of the code, `useProductsStore()` is no longer top-level code, so it won't run immediately when the file is imported. Exactly when it does run will depend on when `fetchProduct()` is called, but typically that's easier to control, and it's much more likely to be after the Pinia instance is created.

If moving the code to a function doesn't fix the problem, then it might be because something is calling that function too soon. You'll need to check where the function is called.

There are still some caveats around this kind of usage, which we'll discuss [later](#why-does-pinia-work-this-way), but they're separate to the original error we're trying to solve.

### An example with navigation guards

It's common to use a navigation guard to check whether a user is allowed to access a route. Details about the current user might be stored in a store.

```js
// This won't work, because the call is at the top level
const authStore = useAuthStore() // [!code error]

router.beforeEach((to) => {
  if (to.name !== 'login' && !authStore.isLoggedIn) {
    return { name: 'login' }
  }
})
```

Grabbing the store outside the callback seems like a good idea, as it avoids calling the function over and over again on each navigation. But because it's top-level code, it'll run straight away, before the Pinia instance is ready. Moving it inside the callback will delay the call to `useAuthStore()` long enough for it work:

```js
router.beforeEach((to) => {
  // This will work, as the call is now inside the callback
  const authStore = useAuthStore() // [!code highlight]

  if (to.name !== 'login' && !authStore.isLoggedIn) {
    return { name: 'login' }
  }
})
```

Even if timing weren't an issue, there are other reasons why `useAuthStore()` should be called inside the navigation guard. Again, we'll discuss those [later](#why-does-pinia-work-this-way).

### Using a property getter

[Property getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) are declared using functions, so in some cases they can be used to defer the store call.

Consider this example:

```js
import { useHistoryStore } from './history-store'

export default {
  menuItems: [
    {
      text: 'Save',
      data: useHistoryStore().history // This won't work // [!code error]
    },
    // ...
  ]
}
```

The call to `useHistoryStore()` is in top-level code, so we need to move it to a function. One way to achieve that would be to use a property getter:

```js
export default {
  menuItems: [
    {
      text: 'Save',
      get data() { // [!code highlight]
        return useHistoryStore().history // [!code highlight]
      } // [!code highlight]
    },
    // ...
  ]
}
```

Note the use of the `get` keyword to declare the property. The function will be called automatically when someone tries to access the `data` property, so the consuming code won't need to worry about the function call.

### Using `computed()` or `toRef()`

In the previous example we were working with non-reactive data, so we used a property getter.

For properties inside reactive objects we can use `computed()` or `toRef()` to achieve a similar result. For example:

```js
export default reactive({
  menuItems: [
    {
      text: 'Save',
      data: computed(() => useHistoryStore().history) // [!code highlight]
      // Alternatively:
      //   data: toRef(() => useHistoryStore().history)
    },
    // ...
  ]
})
```

The `computed` ref will be automatically unwrapped by the proxy created by `reactive()`, so the consuming code doesn't need to use `.value` to access the value. We could also have used `ref()` instead of `reactive()`, the unwrapping of the nested ref would work the same way.

### An example with a component

This component is using an explicit `setup` function. Again, it might seem reasonable to put the call to `useProductsStore()` outside `setup`. But that makes it top-level code, so it'll run too soon:

```vue
<script>
import { ref } from 'vue'
import { useProductsStore } from './products-store'

const products = useProductsStore() // [!code error]

export default {
  setup() {
    const id = ref(123)

    function load() {
      products.fetch(id.value)
    }

    return {
      load
    }
  }
}
</script>

<template>
  <div>
    <button @click="load">
      Load
    </button>
  </div>
</template>
```

- [Broken Playground example](https://play.vuejs.org/#eNp9VMtu2zAQ/BVCLWAZiKm8kEPgFG6LHFoUbdD0qEMYaeUwpkiCD8eA4X/vkrQeduAcbJA7y9nZIVfbrGVc0leb3Wa81co4siWVAebgq9ZkRxqjWjJZe5iU8ijhgUvO+hQddkNSOJ0AWjCtaWIoZaWkdQQj5G6ok+Nv2mGRqEdjkRzBQOIt5BHGfYq0ykuXTz7hejLNzvY9zFqmsSclsattKQkp94Ats1sSIyG2QFFFDWunlLAzpnlAy+zFOW1vi8JLvVrSSrXFu8TFDb2h14XgzwXYtuCyhg0WLLOzjjvKPMUXwcUlvUSOmluXAhSpZs9GvVkwh2RYflZDe1Jfhy/O6cU1vTiPwpKoNhAFnl0pd2iQs+hyw5dH9iCL5gLMH+043sKBTUwI9fYzxpzx0KuqXqBapXjDhB2AV7tJSh8MYC9rGLXimFmCS/D942/Y4LoHW1V7gdkfgH/BKuGDyJT2zcsadY/yotwf8bq5XP6z9xsH0nZdhQ6iHTE/Wvv9g94HuVf0emTj/kmjgXNbGa7dl9F4GGhOTQ6+4AeDjVTOPjploM+jhd7HZzYAo2HpAJyJ4+NhMEoJm8heQ8O8wCpBpwXndT7tOklMvEYOVJdfXF7FkwFqvKxC40QoVg8nSF+XNuCql5zXdM2EBzwYUDQiLQxWMnI4Fmj6lGRYKedFbxNuHLRa4HDjjpB5zddxgctn7xwqWVSCV6u7Motc2R4l5FdPPS9SamLAIQoU82JEjJd06OjRRw7d4hIOL6H7hvWWJtveXdrd+HQ+6epMzpILLPpp+2fU+TfyNhArAVSoZf4U2sKnSj5veb17GvzFP3yDcjfNdv8BeRfljQ==)

We can easily fix this example by moving the `const products = useProductsStore()` line inside `setup` instead.

## `import()` and lazy loading

So far we've only considered static `import` statements, but what about `import()`?

The most common use of `import()` in Vue applications is for lazy-loaded route components. e.g.:

```js
export default createRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue')
    },
    // ...
  ]
})
```

`import()` returns a Promise that resolves once the file is loaded. By using `import()`, we delay the importing of `HomeView.vue`, as well as any other files imported by `HomeView.vue`. The top-level code in those files won't run until they're loaded.

While those files are loading, other code will continue to run, including the code in `main.js` that creates the Pinia instance. If one of the loaded files tries to use a store in top-level code it won't trigger the 'no active Pinia' error, as the Pinia instance will have already been created by that point.

This can cause a lot of confusion, as top-level code can appear to work in some cases and then break for no apparent reason in other cases.

Let's revisit an example we saw earlier:

```js [product-utils.js]
import { useProductsStore } from '@/stores/products'

const products = useProductsStore()

export function fetchProduct(id) {
  return products.fetch(id)
}
```

Inside our `HomeView.vue` we then have:

```js
import { fetchProduct } from './product-utils'
```

This will seem to work fine, as `HomeView.vue` is a lazy-loaded route component and won't load until after the Pinia instance is created.

Then we try to add that same import into another file, e.g. `App.vue`. Suddenly it blows up, 'no active Pinia'.

As `App.vue` is imported directly into `main.js` using `import`, we now have a static import chain from `main.js` to `App.vue` to `product-utils.js`. The result is that the top-level code in `product-utils.js` is now running before the code in `main.js`.

## Why does my code only work with HMR?

You may find that everything seems to be working fine while you're working on your code, but it all suddenly stops working when you do a full page refresh.

If you're working with a dev server like Vite that supports HMR (hot module replacement), it'll try to make small, incremental updates to the page, only updating the files you've edited.

The Pinia instance will be created when the page first loads. If you edit one of your files to try to access a store it'll only reload that one file. As the Pinia instance already exists, no error is thrown. It's only when you reload the whole page that the code runs in the normal order, leading to the error.

## The 'import app' hack

Let's imagine we have code like this in our `main.js`:

```js [main.js]
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')
```

It's all pretty normal stuff, much like what you'd get with `npm create vue@latest`.

Now let's assume that we're getting the 'no active Pinia' error. The router isn't using lazy loading, so something is getting pulled in that uses a store in top-level code.

But if imported code runs first, can't we move code into an import to solve the problem?

Yes, we can. This almost certainly isn't a good idea, but it can work.

For example, let's move some of the code above into a file called `app-create.js`:

```js [app-create.js]
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())

export { app }
```

Then, we could change our `main.js` to this:

```js [main.js]
import { app } from './app-create'
import router from './router'

app.use(router)

app.mount('#app')
```

The imports in `main.js` are processed in order, so the code in `app-create.js` runs first, before the router is imported. As a result, the line `app.use(createPinia())` runs before any code pulled in by the router, allowing stores to be used in top-level code.

To reiterate, working around the problem like this is not recommended. It's a useful example from the perspective of understanding the theory, but if you find yourself using this as a real solution then you're probably in trouble. Relying on the side effects of importing a module is generally frowned upon, but it's doubly frowned upon when imports have to be used in a particular order. Hopefully it's clear that solving the problem this way is incredibly brittle.

## Why does Pinia work this way?

Pinia is used for global state management. But what do we mean by *global*?

In the case of Pinia, it aims to be global in the same way that [`app.config.globalProperties`](https://vuejs.org/api/application.html#app-config-globalproperties) is global. They're only global within the context of a specific Vue application instance.

Let's imagine you choose not to use Pinia and instead do something like this:

```js [store.js]
import { reactive } from 'vue'

export const state = reactive({})
```

You could implement global state this way, but the state here would be shared between all instances of the application within a particular JavaScript environment.

Why does this matter? Wouldn't each user be running the application in their own browser? Different browser, different JavaScript environment.

But that's not necessarily the case.

If you're using SSR then multiple requests will share the same Node process. That'll lead to the state being shared between those requests. If one request modifies the state then those changes will impact all subsequent requests.

So when you make a call to `useProductsStore()`, you might be thinking that means *'give me my products store'*. But it's maybe a better mental model to think of it as *'give me the products store for the current application'*.

That's where the Pinia instance comes in. When you write `app.use(createPinia())`, you're tying a Pinia instance to a specific application. That Pinia instance is then passed down to the components within the application using `app.provide()` and `app.config.globalProperties`. The Pinia instance is where it actually stores the state.

Calling `useProductsStore()` will return a store that is bound to a specific Pinia instance. There are 3 ways it attempts to identify which Pinia instance to use:

1. It can be passed in. e.g. `useProductsStore(pinia)`.
2. If it isn't passed in, the store will try to access the Pinia instance using `inject()`.
3. If neither of those are available, it tries to use the last active Pinia instance, hoping it'll be the right one.

If you're using the Options API with helpers like `mapStores()` and `mapState()`, those make internal calls like `useProductsStore(this.$pinia)`. The `this.$pinia` part is the Pinia instance, coming from `globalProperties`. That explicitly tells the store which Pinia instance to use, rather than using `inject()`.

If you're using the Composition API for your components, the store will typically use `inject()` to find the Pinia instance. That'll only work in places that support `inject()` calls, e.g. at the top level inside `<script setup>`, but in practice that should be all we need.

If you try to access a store in a router navigation guard then that will also use `inject()`:

```js
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // ...
})
```

The router is tied to an application when we call `app.use(router)` in our `main.js`.  It then uses [`app.runWithContext()`](https://vuejs.org/api/application.html#app-runwithcontext) to wrap the callbacks, which allows them to use `inject()` for anything provided at the application level. For a store, that's exactly what we need.

If you're working with other libraries that support callbacks then they might be using `app.runWithContext()` too. If they do then the stores can use `inject()` there too.

But if all else fails, it guesses. A store will just try to use the last active Pinia instance, and hope it's the right one. If you only have one at once, then this strategy works fine. If you have multiple, you could be in trouble.

When you try to use a store in top-level code within a module, there is no context it can use to grab the correct Pinia instance. It relies on just grabbing the last active Pinia instance. As we saw earlier, that will throw an error if it doesn't exist yet.

While we've discussed various ways to fix that error by changing the order the code runs, that doesn't address the problem that the store is guessing about which Pinia instance to use. Even if it works, it suggests there may be something wrong with how you've structured your code, which may come back to bite you in other ways later.

It's beyond the scope of this page to try to address all the ways that code structure could be improved, but in many cases we can solve this problem by writing a suitable composable.

### Writing a wrapper composable

Let's consider this component:

```vue
<script setup>
import { loadProducts } from './products'
</script>

<template>
  <button @click="loadProducts">Load</button>
</template>
```

So far, no store. Now let's take a look at `products.js`:

```js [products.js]
import { useProductsStore } from '@/stores/products'

export async function loadProducts() {
  const store = useProductsStore()

  // The specifics here don't really matter
  if (!store.products) {
    await store.loadAll()
  }

  return store.products
}
```

The exact details of how `loadProducts()` uses the store don't really matter, what's important for this example is just that it needs access to the store.

The store's inside a function, so we won't get the 'no active Pinia' error. But we still have the problem that the store isn't tied to the relevant application. `loadProducts()` is called from a click handler, so it can't use `inject()` to grab the Pinia instance. Instead, it'll rely on just grabbing the last active instance.

As the code runs in a click handler it shouldn't cause a problem for SSR. The code will probably work just fine. But maybe we can do better.

The relevant Vue pattern here involves introducing a composable. Specifically, a composable that splits the code into two phases that run at different times:

```js
import { useProductsStore } from '@/stores/products'

export function useProducts() {
  const store = useProductsStore()

  async function loadProducts() {
    if (!store.products) {
      await store.loadAll()
    }

    return store.products
  }

  return {
    loadProducts
  }
}
```

Inside our component we'd then use it something like this:

```vue
<script setup>
import { useProducts } from './products'

const { loadProducts } = useProducts()
</script>

<template>
  <button @click="loadProducts">Load</button>
</template>
```

Your first reaction might be that this just makes the code more complicated. But the pattern we've used here can be applied more generally.

The key thing to appreciate is that the old `loadProducts()` is now split into two steps. The call to `useProductsStore()` happens upfront, during the component's setup phase. That allows it to use `inject()` to grab the Pinia instance. Anything returned by the `useProducts()` composable can then use that store, without needing to worry about ensuring it's bound to the appropriate Pinia instance.

This is a common pattern for working with composables, not just stores. Composables often need to be called during the synchronous execution of `setup()`, so they can call `inject()`, lifecycle hooks, or other composables. That allows them to grab whatever context they need, based on the current component. They can then return functions for anything that needs to be triggered later.

This composable pattern, with code split across two phases, is much more flexible than trying to do everything in a single function call. It often leads to more maintainable code, as the implementation can change significantly without needing to change the components that consume the composable.

Whether it's right for your application is something you'll need to decide for yourself.
