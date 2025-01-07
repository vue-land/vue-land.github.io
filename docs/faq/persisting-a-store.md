# Why is my store cleared when I reload the page?

The data in a store, such as [Pinia](https://pinia.vuejs.org/), is only held in memory. There isn't any built-in persistence.

The role of a store is to provide a central place to hold global or application-wide state, rather than keeping it in a specific component. Persisting that state is a separate concern.

But they are often related concerns. If you're persisting data then it typically is 'global', at least in some sense.

We'll discuss various approaches below for persisting data, with or without a store.

## Types of persistence

The first thing to consider is where you want to persist the data. The main options are:

1. On the server, e.g. in a database. This allows the data to be shared between devices or users.
2. Cookies. While cookies are stored in the client, they are automatically sent as headers on HTTP requests, allowing the server to see the persisted data when handling requests.
3. Client-side storage, e.g. via the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (`localStorage`/`sessionStorage`). These won't automatically be included in HTTP requests and have much more generous size limits than cookies. If you're using SSR then you may need to consider how you'll handle rendering on the server, as it won't have access to the persisted data in the user's browser.

Another alternative to consider is 'persisting' the data in the URL. This has other ramifications, such as impacting the browser Back button, but if the requirement is for state to be retained across a browser reload then maybe it should be stored in the page URL? It's usually fairly clear whether this approach is a good fit or not.

For the remainder of this page we're going to focus on client-side persistence, e.g. using cookies, `localStorage` or `sessionStorage`.

## Pinia plugins

There are various Pinia plugins that will handle persistence automatically. The most commonly used is:

- [`pinia-plugin-persistedstate`](https://prazdevs.github.io/pinia-plugin-persistedstate/)

It uses `localStorage` by default, or cookies if used with Nuxt (for SSR). It also supports `sessionStorage`.

You can find several similar libraries in the npm registry.

## Doing it yourself

If you only want to persist a small amount of data then it may be possible to do it yourself, without needing any extra libraries. For example:

```js
import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useModeStore = defineStore('mode', () => {
  const mode = ref(sessionStorage.getItem('mode') === 'dark' ? 'dark' : 'light')

  watch(mode, (value) => sessionStorage.setItem('mode', value))

  function toggleMode() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return { mode, toggleMode }
})
```

- [See it in a Playground](https://play.vuejs.org/#eNp9k99v2jAQx/8VK3tIkMBpu64PCDq2qQ+dtK1a+5iXNDmCi2Nb/gFIiP99ZztAoKMPSNj3ve997s7ZJm3JBH0zyThhrZLaki2pNJQWvilFdmSuZUvSlYO0EGeCJyZYeZAofzqKfHYM0LxUikaHQhy8M/wNCkEIdQaynmM2iNetdMJm6SfMTgfJMGllDWegGuZDsi5ttbhEWsOcCXi2UsM70kLAJsgqKYwliPELS0TttJ+Zpb52OiTZgEzvydbjxRx/j1rkyAwYw6TwCWUDtAH7aKHtUjFvOiVpXeplSr7u/4xJylmzsCk27D1DJ5lPwFKrkjsI9c6czYnzkERhZzF3orIoJlY2DQ8NIXQgJoGWBjky9w8nbBHJw4Urn7qL5hqs0wKnGhGPJbxghwS4pW7XuKWJqTRTFvGtU4SXopkWiTVFct/bz8nQ9wuiebfr+GLCpE23ln5ChiUneSyDpnjAuSiODwlPhGy3MQtfkkdERkImr85aHM+s4qxaIlBU9KeFgC/hOMmjGM0mec8Zu4z8o7ZUSCkFdhtGXHQBbHK8H3qRzHAeeQ0rKyU3o1IxHy2ShbXKjPPcCbVsaCXb/J1wdkfv6G3O2WsOps2ZqGGDBYtkuPcOb/mSXwjObugN/ZLXzNh4QdFq9Krl2oA+NcPyoxrai3z7+OyKXt/S66sAFqFab9Q9lR0OyBpc25w1Z+NBF8U46D/KP9LTMZWcy/XPcGe1gwNVtYBq+Z/7N7OJoE8asJUV9DqxpcYPMIYfnn/DBv8fgvgcHEf1B8G/YCR3njHKvjtRI3ZPF2gfw7aZaF7Mw8aC8J/pATRMI+jDZH980PoR9zO9PUxx9w9yiOKn)

A similar approach can be used to persist a ref, without using Pinia at all:

```js
import { ref, watch } from 'vue'

export const mode = ref(sessionStorage.getItem('mode') === 'dark' ? 'dark' : 'light')

watch(mode, (value) => sessionStorage.setItem('mode', value))

export function toggleMode() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
```

- [See it in a Playground](https://play.vuejs.org/#eNp9UktP4zAQ/isjX5JKUXrYPVUJ+xIHVtoFAUdfQjpNQx07sselUpX/ztimIUiI2zy++eabx1n8Gsfy6FFsROVa248EDsmPoBrd1VKQk+JK6n4YjSU4w2C2WACZrlP4j22YYGfNAFm5Dqny2WVSV+tExYXsEA6jagjZAzgnCpim4FVPnsho+Nmqvj2EdjNxvuLGj9Gt1gnGBNV6wSYKltcaves77ms0z3AOrFK0Zhh7hfZ2pN5oHmEDMRNyjVLm5W+MkfVYXOLtHtvDJ/FndwoxKe4sOrRHlGLOUWM7pJS+fviPJ7bnJM/pFaO/SN6jM8oHjQn22+sty17gotqbuP1ed4/u+kSo3WWoIDQgp4iXgg/554vR3+V+K7/HOqkn3uLb5Xh/850t7gp4aajdzxdmcr6t1HiKGF68o3TMOsBzhy4IeyBjmw5L7nTDx8qzAMlWUNc1ZNvGHjL4cTE2kKm+21O2CsSxXZ4+LD82yiNXXfE/fuDl91zwFpCAkeBN2c7rNgy/eNN8lbYQJ40VLHrpfBCXNAV1McRL4mebXgHGRQ/Y)

A few notes on these examples:

1. Neither example will work with SSR as they're using `sessionStorage`, which won't be available on the server.
2. Instead of using `watch`, the call to `setItem` could be made inside `toggleMode`. With that approach, it may also be beneficial to make the exposed ref readonly, so it can only be modified via `toggleMode`.
3. `sessionStorage` only accepts string values, which is fine in this example, but may need more work if your data isn't already a string.

## VueUse

While [VueUse](https://vueuse.org/) doesn't have a specific persistence plugin for Pinia, it does provide some reactive helpers for working with `localStorage` and `sessionStore`. Much like in the previous examples, these can be used with or without Pinia:

```js
import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core'

export const useModeStore = defineStore('mode', () => {
  const mode = useSessionStorage('mode', 'dark')

  function toggleMode() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return { mode, toggleMode }
})
```

- [See it in a Playground](https://play.vuejs.org/#eNqFlF1v2jAUhv+KlV0kSOCUrusFgo5t6sUmbavWXubGTQ7BxbEt26FIiP++YzsNKR3dBRL2ec/j93zAPmkYl/TJJrOEN1oZR/akNMAcfNGaHMjKqIak2xbSQp4I7rjkrJdofzqKfHYM0JxpTSOhkD07w8+okITQ1kI2IGajeN2oVros/YDZ6SgZJ42q4MRoBSsu4d4pA+d87Ani78FarqQXsvooXaIpjOYl5gdzsAs5pZLW+byf+GSkL4ZvZan3ko5JNiKLG7L3dmOOv0ftmyf7jLRiZpNigT5n1crSoYg4VdcivIbEgCMBRbdMtB44PCwWHYV8Jqng9dqlZNZd+dRDhBtwrZFYv88dD57wggM6wJZ2g8GWzm1puHbEYpYmgsl6USTOFsnN604eO/LSRJp3g4njDW2wXc+GCRk+Oc/jMwjFg4NGC5w6ngjZ72MWjt1bRI+EzB9b57A9y1LwcoOGomLYLTT4EI7zPIoRNs8HZKwy+p80TKNLJbHa0OKiC2CRs5emF8lwJ3ygSNbOaTvL81bqTU1L1eRDzXI6pZf0Iueygh1tnpA2PmXZNTNQ/Y8WVe/xUDipoOHnSC/x5QWdXtHpRS7441ljeQVbp5SwE6bPEt8Il9f0ml4FMNimg79ih9/fOV4ILi+xwk95xa2LFxRRk0ejni2YAOvW+IDDcxZXasXrk9EhTHMB5rf2P6DXI2RCqOcf4c6ZFnpn5RrKzT/un+wu+r0zgA62OPc+5pipwcXw7f0v2OH3Poir2opuS84E/4BVovUeo+xrKyu0PdAFt9/DJnJZP9jbnQPp/zp6o6EbQR9W4Ns7pR/tfqRXfRcPfwGeIvyL)

The VueUse helpers support various options. For example, `initOnMounted: true` can be used when working with SSR. It defers loading the persisted value until after components are mounted, allowing client-side hydration to match the server-generated HTML. e.g.:

```js
const mode = useSessionStorage('mode', 'dark', {
  initOnMounted: true
})
```

Documentation:

- [`useStorage`](https://vueuse.org/core/useStorage/)
- [`useLocalStorage`](https://vueuse.org/core/useLocalStorage/)
- [`useSessionStorage`](https://vueuse.org/core/useSessionStorage/)
