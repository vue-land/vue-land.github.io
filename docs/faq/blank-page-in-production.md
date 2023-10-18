# Why do I get a blank page in production?

Here we're assuming that your application works fine during development, but you get a 'blank page' or '404 page' when you try to deploy to production.

There are various reasons this can happen and we can't possibly cover all of them in detail. Instead, we'll explore various ways to investigate the problem, and try to provide some guidance on what the underlying cause might be in each case. We can't necessarily tell you how to fix the problem, but hopefully you'll end up closer to understanding what the problem is.

If your page works fine during normal navigation but fails when you try to refresh or navigate to a route path directly, that's a different problem. See [Why does my page fail to load when I refresh in production?](production-page-refresh) instead.

If you're just having a problem loading assets (e.g. images) in production then see [Why do my dynamic assets paths not work?](dynamic-images) instead.

If you're using GitHub Pages for your production deployment then you may also want to read [How do I deploy to GitHub Pages?](github-pages).

## Test in other browsers

You should test in other browsers and Incognito/Private mode.

Test both production and dev to confirm that you're consistently seeing the same thing across multiple browsers.

Here we're trying to rule out various factors. Browser plugins, such as ad blockers, might be interfering with your page. Or it might be a problem with something that's cached or in cookies or local storage. While it's possible the problem is with production, it's also possible that your development environment is misleading you and only works because of old data in cookies or local storage, so you should check both environments in multiple browsers.

## Check for console errors and warnings

You should check the browser console for both your production and dev environments.

Even if your application is working in development, there may still be warnings. Any warnings during dev need to be fixed, as they may lead to failures in production.

If you're seeing JavaScript errors in production then those likely have the same underlying cause as the blank page. Those need to be investigated and debugged. The section [Run the production build locally](#run-the-production-build-locally) below is probably the most relevant in that scenario.

If you're seeing `404` errors for loading files then see the section [Check your `base` path](#check-your-base-path).

If you're seeing `404` errors for loading data then you should start by checking that the URLs are correct. If they are then the problem is likely with your backend server, not the frontend.

## Check the Network tab

Check what requests are shown in the **Network** tab of your browser developer tools. Make sure you open the developer tools before loading the page, otherwise the requests won't be shown.

You should see the HTML file load, then various `.js` and `.css` files.

### `.js` and `.css` requests

Still using the **Network** tab, check the contents of the `.js` and `.css` files, make sure they do contain the code you're expecting. If your server is misconfigured then they might contain the HTML from your `index.html` instead, or a `404` page. The content may also be wrong if the `base` path is set incorrectly in Vite, see [Check your `base` path](#check-your-base-path) for more details.

### `index.html`

It's also worth checking that the HTML file contains the correct HTML, though that can be a little tricky if you aren't sure what you're doing.

The `index.html` file should be returned by the first request listed in the **Network** tab. That's the request with the same URL as the browser address bar. While the file itself is called `index.html`, the URL usually won't include that name explicitly.

The **Network** tabs in both Chrome and Firefox allow you to see both the raw HTML and a preview of the page. The preview is usually not very helpful, what you want is the raw HTML. Click on the relevant request in the list and you should see a further set of tabs. In Chrome, you can see the raw HTML by clicking on the **Response** tab (next to the **Preview** tab). In Firefox, they are both in the **Response** tab, but you need to set the toggle switch to **Raw** to see the raw HTML.

But what should the raw HTML look like? Run the Vite build locally and check the contents of the file `dist/index.html`. That's the built `index.html` and that's what you should be seeing in the **Network** tab. Contrast that with the `index.html` in your project root, which is the source code used to generate the file in `dist`. One common mistake is to deploy the project source code, rather than the `dist` folder, so you should double-check that the HTML you see in the **Network** tab is coming from the correct `index.html`.

Also check that you **don't** have `index.html` in your `public` folder. With the old Vue CLI that was the correct place for it, but with Vite it will break everything if you put it in `public`. The source `index.html` should be in the project root, alongside `package.json` and `vite.config.js`, one directory up from `src` and `public`.

In the source `index.html`, there'll typically be a line like this that pulls in the JavaScript code:

```html
<script type="module" src="/src/main.ts"></script>
```

In the built version of `index.html` in `dist`, that should look something like this:

```html
<script type="module" src="/assets/index-94c19c52.js"></script>
```

This is assuming the default configuration for Vite. The main differences are:

1. The source file might be `.ts` or `.js`, but the file in `dist` will always be `.js`.
2. The source file uses a path of `/src`, whereas the built file uses `/assets`.
3. The production file name will contain a hash, such as the `94c19c52` in the example above.
4. If you have a `base` path configured, you should also see that at the start of the path for the file in `dist` (the example above doesn't have that configured).

These same differences should also apply to any other `.js` and `.css` files you see loading in the **Network** tab.

### Data requests

Depending on your application, you might also see requests to load data from the backend server. If you see those requests, check the responses are correct. It might be that there's an authentication problem, or your backend server might just be returning the wrong data. Checking the response should help to identify that problem.

## Build warnings

Typically, you'll be running `vite build` via a command like `npm run build`. That'll output various details about the build and you should check them carefully to ensure that everything appears to be what you're expecting. In particular, pay attention to any warnings, as those may indicate a problem that is causing the application to fail in production.

## Run the production build locally

The `vite preview` command allows you to test a production build locally. You need to run `vite build` first, as `vite preview` will not run the build for you. If you used `create-vue` to scaffold your project (e.g. via `npm create vue@latest`) then you can run these commands using `npm run build` and `npm run preview`.

There are a lot of things that can go wrong with a production environment. Running a production build locally can help to reduce the number of factors in play. If you're using environment variables to set things like the location of a backend server then you might want to temporarily change those to allow for local testing.

Debugging a 'production' problem is much easier if you can reproduce it using a local production build.

## Check your `base` path

If you're getting a `404` status code in your browser for the `.js` files then it may be that you haven't set the `base` path correctly. Depending on your production server configuration, it's also possible that the status code won't be `404`, but nevertheless the files won't contain the correct content.

Check the URLs carefully, in particular the bit at the start of the path.

Vite has a setting called `base`, see <https://vitejs.dev/guide/build.html#public-base-path>. It is important that this is set correctly. Usually you'd configure this in your `vite.config.js`/`vite.config.ts`, but it can also be passed in from the command-line.

:::info
If you're using the old Vue CLI instead of Vite then there's a similar setting called `publicPath`. See <https://cli.vuejs.org/config/#publicpath>.
:::

The default value for `base` is `/`. During development, it's common to run an application at the root path, meaning that you access your application using a URL like `http://localhost:5173/`, with just a `/` after the port number.

If you're also using the root path in production then that's fine, a `base` of `/` will give you what you need.

But if your production environment uses some other path then you'll need to configure that. e.g. If your site is deployed to `https://example.com/my-app/` then you'll need to set the `base` to `/my-app/`. While it is possible to use different paths for development and production, it's usually easier just to use the same path for both.

Vite supports using a relative path like `./` for the `base`, but it should usually be avoided as it will clash with [HTML5 history mode routing](https://router.vuejs.org/guide/essentials/history-mode.html). The router changes the path in the browser's address bar, so any relative paths will be treated as being relative to the route path, which is likely not what you'd want.

It's usually relatively simple to check whether the `base` is working correctly. Check the contents of the `index.html` in your `dist` folder. Any paths to other files, such as the `.js` or `.css` files for your application, should be prefixed with the `base` value. When you load your application in production you can check the URLs for those files in the **Network** tab and confirm that their paths begin with the correct prefix.

## Confirm whether routing is failing

If an application is using Vue Router and the route cannot be resolved then no warnings or errors will be shown in production, it'll just fail silently.

Usually it's fairly obvious when this is happening, as the rest of the page renders correctly but the `<RouterView>` just renders as a comment node.

However, it can be tricky to tell whether routing is the problem if `App.vue` doesn't contain anything else. For example, imagine that `App.vue` just contains this:

```vue
<template>
  <RouterView />
</template>
```

As `App.vue` only renders `<RouterView />`, we can't easily tell whether the problem is with the routing or a more general problem with rendering `App.vue`.

To help isolate the source of the problem, it is worth adding some extra temporary code to `App.vue`, to confirm that it is rendering correctly. For example:

```vue
<template>
  <h1>Hello world!</h1>
  <RouterView />
</template>
```

If you see the `Hello world!` rendered in production then it suggests that `App.vue` is rendering correctly and the problem is most likely related to the routing.

If routing is failing then you should double-check that you don't have any warnings in your browser console during development. Routing will often fail completely in production if you ignore those warnings, even if everything appears to work correctly in development.

Some other possible causes of routing problems are covered in the next couple of sections.

## Check Vue Router's `history` setting

If you're using `createWebHistory()`, Vue Router needs to know if you're using a custom `base` path, so that it can resolve the routes correctly. For example, if your site is deployed to `https://example.com/my-app/`, Vue Router needs to ignore the `/my-app/` part of the path, as it isn't part of the route path.

This problem can lead to the `<RouterView>` just rendering as a comment node, but depending on your `routes` configuration, it may be that the path incorrectly matches one of your other routes. If you have a catch-all route configured for handling unknown paths then it will probably match that.

If you're using Vite then you can access the `base` path using `import.meta.env.BASE_URL`:

```js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // ...
})
```

For projects scaffolded using `create-vue` (e.g. `npm create vue@latest`) this should be done for you.

:::info
If you're using the old Vue CLI instead of Vite then you can access the `publicPath` using `process.env.BASE_URL`.
:::

## Check router navigation guards

[Navigation guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) can prevent a route from being resolved. For example:

```js
router.beforeEach(async (to, from) => {
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```

This guard is awaiting the promise returned by `canUserAccess(to)`, but it will get stuck if the promise never settles.

In practice, promises that remain pending indefinitely are rare, so this kind of problem is more likely to occur if you're using the `next` function. This is one reasons why using `next` is discouraged. It's quite easy to forget to call `next()` in one of the branches of your code.

Problems with guards should impact development and production equally, but there can be subtle differences between the environments that lead to the code going down different branches. For example, the timing of the requests might be different. Or differences caused by old cookies or data in local storage.

A bit of console logging in the guard is usually sufficient to confirm whether this is the problem.
