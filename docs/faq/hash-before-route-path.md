# Why is there a `#` before my route path?

Vue Router will insert a `#` before the route path if you're using `createWebHashHistory()`:

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      // ...
    }
  ]
})
```

If you're still using Vue 2, with Vue Router 3, then the equivalent is `mode: 'hash'`, which is the default.

The example above will lead to a path like:

```
http://example.com/#/home
```

To avoid the hash you would use `createWebHistory()` instead, or `mode: 'history'` for old versions of Vue Router:

::: code-group

```js [Vue 3 / Vue Router 4]
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      // ...
    }
  ]
})
```

```js [Vue 2 / Vue Router 3]
import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/home',
      // ...
    }
  ]
})
```

:::

The URL will now be:

```
http://example.com/home
```

The official documentation for this is at:

- Vue 3 / Vue Router 4 - https://router.vuejs.org/guide/essentials/history-mode.html
- Vue 2 / Vue Router 3 - https://v3.router.vuejs.org/guide/essentials/history-mode.html

There are various pros and cons for the two different history modes. It is important to choose carefully between them. The use of a hash for routing is not unique to Vue Router, it is a common technique used by various client-side routers. The rest of this page goes into detail about the history of client-side routing and why the hash is used.

## A brief history of client-side routing

Some aspects of client-side routing can seem bizarre. It can help to understand how browsers behaved historically, leading to where we are now. This section isn't specifically about Vue Router, but it should help you to understand what Vue Router does and why.

A long time ago, before JavaScript was a thing, browsers implemented a feature that allowed a page to scroll down to a specific section of the page. It used a `#` symbol in the URL.

For example, if you had the URL `http://example.com/index.html#main` in your address bar, the browser would send an HTTP request to the server for the page `http://example.com/index.html`. The `#main` part, known as the *hash*, wouldn't be sent to the server. Once the HTML was loaded, the browser would search the page for an element `<a name="main"></a>` and scroll down to that.

Later versions of HTML extended support to any element with an `id` attribute. So `#main` can be used to scroll to an element with `id="main"`. The usage with `<a name="main">"` is now deprecated, but using a `#` and `id` to jump to a section on a page is still a commonly used feature of HTML.

When linking to a section on the same page, you can use a link like this:

```html
<a href="#main">Jump to main</a>
```

Clicking this link will jump to the element with that `id`. The URL will be updated to include `#main` on the end, replacing any existing hash. But changing the hash won't send a new request to the server, as requests to the server don't take the hash into account.

Changing the hash will also add an entry to the browser's navigation history. This allows the user to navigate back and forth between sections using the Back and Forward buttons in their browser.

The hash can also be changed via JavaScript. For example:

```js
window.location.hash = '#main'
```

Setting the hash in JavaScript behaves much like clicking on `<a href="#main">`.

Other parts of the URL can also be changed via JavaScript. For example, you could change the search query using something like this:

```js
window.location.search = '?id=1'
```

If we were previously at `http://example.com/index.html`, this will change the URL to `http://example.com/index.html?id=1`. Importantly, **this will cause the browser to load a new page from the server**.

The rise of single-page applications (SPAs) began, more or less, with the introduction of AJAX. While SPAs brought many benefits, they also broke one of the key features of the web: the URL for an SPA was no longer tied to the content being shown to the user. URLs could no longer be shared and the Back/Forward buttons became meaningless.

This led to a need for client-side routing.

At the time, the only way to update the URL without triggering a request to the server was to change the hash. The browser would try to jump to an element with that `id`, but preventing that scrolling was a solvable problem. Using the hash became the standard way of implementing client-side routing.

Hash-based routing leads to URLs like this:

```
http://example.com/#/products/search
```

The page `http://example.com/` would be loaded from the server, while the hash of `#/products/search` would be interpreted by the router. The exact format used for the hash varies, but using a slash-separated path like this is a relatively common approach.

For a while, this was the only way to implement client-side routing. The server is completely cut from the process and only ever sees the start of the URL, without the hash. This has its advantages, as the server doesn't need to know anything about the routing.

But using the hash has its problems:

1. There's no way to implement SSR (server-side rendering) on the server, as it has no idea what route is being accessed.
2. Search engines and other crawlers struggled to work with client-side routing, both because pages needed JavaScript and because the crawlers needed to understand the significance of the hashes when indexing the pages.
3. Using the hash for routing meant it couldn't be used for its original purpose of jumping to content within a page.
4. The `referer` header also doesn't include the hash, greatly limiting its usefulness.

Google struggled so much with hash-based routing that it introduced a special convention to allow pages to be indexed correctly. That convention is no longer used, but you may still encounter routes that begin with `#!`, which was part of the convention.

To try to remove the reliance on hashes for routing, browsers introduced the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API). This allows JavaScript to interact with the navigation history for the current page. That includes the ability to update the URL in the address bar without triggering a request to the server.

This is generally a better approach, as we get back to traditional URLs that represent whatever page or resource is shown in the browser. The route might look something like this, without the need for a `#`:

```
http://example.com/products/search
```

The URL sent to the server includes the route path, allowing for SSR and improved SEO.

But this approach also has its drawbacks.

Sending the route path to the server means that the server must be configured to interpret that path correctly. Even if you aren't using SSR, you still need the server to return the correct HTML to load the rest of the page.

It also complicates the use of relative paths. If the browser encounters any paths that begin with `./` or `../` then those will be interpreted as being relative to the current page URL. So if `<img src="./pic.png">` appears in the HTML, that will be loaded relative to the current route path, which might not be what you were expecting.

To be clear, this is only a problem if the relative path makes it to the HTML in the browser. Bundlers such as Vite or webpack will try to rewrite relative URLs in the code and replace them with absolute URLs as part of the build. However, if you misconfigure your bundler you can still end up with broken relative paths.

For more discussion of these problems, see [Why does my page fail to load when I refresh in production?](production-page-refresh).
