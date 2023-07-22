# How do I add dynamic `<meta>` tags to my application?

When you share a URL on Facebook, Twitter, Discord, etc., those sites will try to generate a summary of the page to show along with the URL.

A basic title and description can be set using `<title>` and `<meta>` tags:

```html
<title>Vue Land FAQ</title>
<meta name="description" content="An FAQ for the Vue Land Discord">
```

Much more detail can be shared using Open Graph tags:

```html
<meta property="og:title" content="Vue Land FAQ">
<meta property="og:type" content="website">
<meta property="og:url" content="https://vue-land.github.io/faq/">
<meta property="og:image" content="https://vue-land.github.io/logo.svg">
```

- [The Open Graph protocol](https://ogp.me/)
- [Facebook webmaster guidelines](https://developers.facebook.com/docs/sharing/webmasters/)

Twitter uses Open Graph, but also supports its own set of tags for generating cards:

```html
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://vue-land.github.io/faq/">
<meta property="twitter:title" content="Vue Land FAQ">
<meta property="twitter:description" content="An FAQ for the Vue Land Discord">
<meta property="twitter:image" content="https://vue-land.github.io/logo.svg">
```

- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

Importantly, the bots these sites use to collect this information will only download the HTML for the URL, without running any JavaScript. This is where things get difficult, because we can't just add these tags dynamically from within our Vue code.

Full Vue SSR (server-side rendering) solutions such as [Nuxt](https://nuxt.com/docs/getting-started/seo-meta) and [Quasar](https://quasar.dev/quasar-plugins/meta) have built-in support for handling this. Those frameworks need to generate dynamic HTML for the entire page, so including the `<meta>` tags is a relatively simple addition. If you're using Vue SSR without a framework then you might consider using [`unhead`](https://unhead.harlanzw.com/), which is what Nuxt uses behind the scenes.

But what about if you aren't using Vue SSR? What options do you have for a typical client-side Vue application?

There are a couple of simpler cases that we should consider first:

1. If you aren't concerned with bots and just want client-side updates for the `<title>`, you could use [`useTitle()` from VueUse](https://vueuse.org/core/useTitle/).
2. If you want fixed `<meta>` tags that don't vary by page/route, you can add those directly to your application's `index.html`.

From now on we'll assume that we want different `<meta>` tags for each page.

First let's consider how VitePress solves this problem.

## VitePress

VitePress is a static site generator, so all pages are static from the perspective of the server. This allows VitePress sites to be deployed on hosting platforms that only provide basic web servers, without needing any application code to run on the server.

To achieve this, VitePress generates a separate HTML file for every page. Each file can have its own `<title>` and `<meta>` tags configured. While these tags can't be fully dynamic, having static tags configurable on a per-page basis is usually good enough.

See <https://vitepress.dev/reference/site-config#head> for details of how to configure custom `<meta>` tags.

## Vue applications

Assuming you're using Vue Router, chances are the tags will depend on the route path. For that work, you'll need to be using [HTML5 history mode](https://router.vuejs.org/guide/essentials/history-mode.html#html5-mode), i.e. `createWebHistory()`. Hash mode and memory mode don't update the URL path, so there's no way to identify the current route on the server.

To use HTML5 history mode in production, you'd typically configure the webserver to serve up the same `index.html` for all routes. There are [examples in the Vue Router docs](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations) that show how to do this.

However, for the purposes of `<meta>` tags, we want each route to have a slightly different `index.html` in production. Just configuring the server to serve up the same `index.html` for all routes won't give us what we need.

Depending on exactly what `<meta>` tags we need, it may be sufficient to generate multiple `index.html` files as part of the build. Similar to the approach VitePress uses, we wouldn't generate any `<meta>` tags at runtime, we'd just serve up a different version of `index.html` depending on the route path. During development we'd still just have a single `index.html`, but we'd add an extra step to the end of the production build to make multiple copies with the extra `<meta>` tags injected. As this happens during the build, it might not require any special handling by the server used to host the application, though that would depend on how exactly the route paths map to the copies of `index.html`.

Here's an example application that uses this approach:

<https://github.com/skirtles-code/vue-3-meta-tags-example/tree/build>

It is deployed to GitHub Pages here:

<https://skirtles-code.github.io/vue-3-meta-tags-example/>

But if you need fully dynamic `<meta>` tags, e.g. with content determined by a runtime database query, then you're going to need server-side support for that. How exactly you configure that will depend on your server-side technology stack and what data you need to populate the `<meta>` tags.

Full Vue SSR is not required, but as we noted earlier, if you are using Vue SSR with frameworks such as [Nuxt](https://nuxt.com/docs/getting-started/seo-meta) or [Quasar](https://quasar.dev/quasar-plugins/meta), then they will handle some of the details for you.

Vue SSR will render the entire page on the server, including all the Vue components. We don't need that, we just need to render the `<meta>` tags on the server.

Here's an example that uses Express to populate the `<meta>` tags in the `index.html` of a basic Vue/Vite application:

<https://github.com/skirtles-code/vue-3-meta-tags-example/tree/runtime>

There is nothing special about the choice of Express in this example, you can use whatever you want, but you'll need to pick something that is compatible with how you intend to deploy and host your application in your production environment.
