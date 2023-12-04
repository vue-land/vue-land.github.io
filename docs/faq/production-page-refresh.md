# Why does my page fail to load when I refresh in production?

The short answer is you probably haven't configured your production webserver correctly to work with `createWebHistory()`. See <https://router.vuejs.org/guide/essentials/history-mode.html> for details and example server configurations.

Another possibility is that you've configured Vite's `base` setting incorrectly. If you use a relative path, such as `base: './'`, it won't work correctly with `createWebHistory()`.

If you need more help understanding the problem and how to fix it, read on!

## Introduction

First, let's clarify the exact symptoms of the problem we're trying to fix:

1. You're using Vue Router with `createWebHistory`. If you're using an older version of Vue Router then the equivalent is `mode: 'history'`.
2. You can access a route of `/` successfully.
3. Navigating between routes works correctly.
4. Trying to refresh the page on a route other than `/` fails. Likewise, it fails trying to access those routes directly via the browser address bar. Alternatively, you might find that a path with a single `/` works, e.g. `/home`, but deeper paths don't, like `/home/settings`.
5. The problem only occurs in production. Everything works fine during development.

If this doesn't sound like the same problem you're having, you might be better off trying one of the other FAQ entries:

- [Why do I get a blank page in production?](./blank-page-in-production)
- [How do I deploy to GitHub Pages?](./github-pages)

## Vue Router history modes

There are two main types of client-side routing. These are common to all client-side routing, not just Vue Router:

1. The older approach is to use the URL hash for the route. For a long time this was the only way to implement client-side routing.
2. In recent years, browsers have added the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API). That allows for client-side routing without using a hash.

If you're new to client-side routing and would like to learn more about it, you'll find more details at:

- [Why is there a `#` before my route path? - A brief history of client-side routing](./hash-before-route-path#a-brief-history-of-client-side-routing)

The two types of client-side routing described above are both supported by Vue Router.

To use hash-based routing, you need to use `createWebHashHistory()` when creating the router:

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ]
})
```

If you'd prefer to avoid the hash and update the URL path instead, you can use `createWebHistory()`:

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ]
})
```

The official documentation for this is at:

- https://router.vuejs.org/guide/essentials/history-mode.html

If you're still using Vue 2 and Vue Router 3 then the relevant settings are `mode: 'hash'` and `mode: 'history'`, with `hash` being the default. The documentation for that is at:

- https://v3.router.vuejs.org/guide/essentials/history-mode.html

## Webserver configuration

The main advantage of hash-based routing is that the server is not involved at all. The route path doesn't even get sent to the server, so there's no need to configure anything on the server to get it to work.

Using the History API to avoid the hash leads to cleaner URLs, but the advantages go way beyond aesthetics. Avoiding the hash is also better for SEO and SSR.

The downside is that the request URLs being sent to your production webserver will include the route path, so the server needs to understand how to respond to that.

:::info
To simplify this explanation, we're going to ignore server-side rendering.

We also have a separate FAQ entry for [How do I add dynamic &lt;meta&gt; tags to my application?](./dynamic-meta-tags), but you should make sure you understand how things work in the simpler case described here before trying to attempt more advanced configurations.
:::

For a typical Vue application, you'll have a single HTML entry point called `index.html`. The server needs to return the contents of that file for all route URLs.

So, for example, let's say you have three route URLs:

```
http://example.com/
http://example.com/products
http://example.com/products/search
```

The server should return the same file for each of those three URLs.

During development, the Vite (or webpack) dev server handles that for you. But in production, you need to configure the webserver yourself.

After you run your build, there should be a built copy of `index.html` at `dist/index.html`. Your production webserver would need to return the contents of that file in response to all three of the requests above.

In addition, you also need to take care to ensure that the webserver still returns other files correctly. There'll be various other files in `dist`, such as the built `.js` files. When the browser requests those files they need to be returned, not the contents of `index.html`.

The documentation for Vue Router includes examples for configuring various popular webservers and hosting providers:

- https://router.vuejs.org/guide/essentials/history-mode.html#Example-Server-Configurations

You can verify whether your server is configured correctly by checking the responses you receive in the **Network** tab of your browser's developer tools. There's much more detail about how to do that here:

- [Why do I get a blank page in production? - Check the network tab](./blank-page-in-production#check-the-network-tab)

Some hosting providers, such as GitHub Pages, don't offer a direct way to configure the webserver to return `index.html` for all routes. That makes working with `createWebHistory()` difficult, or even impossible, depending on what exactly you need. We have a separate guide that suggests some approaches that will work with GitHub Pages, and those should also carry across to other hosting providers that don't offer this kind of configuration:

- [How do I deploy to GitHub Pages? - Vue Router](./github-pages#vue-router)

Some hosting providers let you provide a catch-all file that will be returned instead of a 404. For example, [Surge](https://surge.sh/help/adding-a-200-page-for-client-side-routing) uses a file called `200.html` for that purpose. If you're using a hosting provider that works that way, you could rename `index.html` to `200.html` as part of the build.

## Using a relative path for `base`

A misconfigured production server is easily the most common cause of the symptoms described above, but they can also be caused by using a relative path for Vite's `base` setting.

The `base` is used as the starting point for all URLs in the built application. By default, it is set to `/`, but it can be changed if you want to deploy your application to a specific path.

For example, by default you'll have a line similar to this in `dist/index.html`:

```html
<script type="module" src="/assets/index-94c19c52.js"></script>
```

That path starts with `/`, which is the `base`.

But say you want to deploy your application to `http://example.com/my-app/`. The `my-app` here isn't part of the route path, it's the base path. The contents of the built `dist` folder are being served up from that path.

To get this to work you'd need to configure `base: '/my-app/'` in your Vite configuration. This will then be used as a prefix for URLs. For example, in `dist/index.html` there should be a line like this:

```html
<script type="module" src="/my-app/assets/index-94c19c52.js"></script>
```

You might think that you could solve the problem using a relative path instead, like `base: './'`. This can be very tempting, as at first glance it seems to allow the application to run at any path, without needing to know the deployment path at build-time.

Vite does support using a relative path, but in practice this is where things can go wrong if you're also using `createWebHistory()`.

Let's consider the same route paths from the earlier example:

```
http://example.com/
http://example.com/products
http://example.com/products/search
```

The first two URLs will likely work fine, but the third one will explode.

Why? Because `dist/index.html` is trying to use a path relative to the route path:

```html
<script type="module" src="./assets/index-94c19c52.js"></script>
```

The browser doesn't know that this line is in `dist/index.html`. As far as the browser is concerned, that's just a line in the page `http://example.com/products/search`. It'll resolve that relative path to `http://example.com/products/assets/index-94c19c52.js`, with the extra `/products` part still in the URL. That'll fail, as it isn't the correct location for that file.

While it is theoretically possible to configure the server to handle this, it's usually better just to avoid using a relative path for `base`.

If you're using the old Vue CLI, the equivalent of `base` is [`publicPath`](https://cli.vuejs.org/config/#publicpath). This also supports using a relative path, with much the same problems.
