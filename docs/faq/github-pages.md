# How do I deploy to GitHub Pages?

Most of the steps you need to take are not specific to Vue or Vite. The suggestions on this page should also work with tools such as Vue CLI or webpack.

The relevant documentation:

- The official documentation for GitHub Pages is at <https://pages.github.com/>.
- The Vite guide to deploying on GitHub Pages: <https://vitejs.dev/guide/static-deploy.html#github-pages>.
- The VitePress guide to deploying on GitHub Pages: <https://vitepress.dev/guide/deploy#github-pages>.

GitHub Pages doesn't provide a way to generate server-side content on-the-fly. It can only be used for static sites. There's no way to configure a backend or even a proxy. CORS may be an option if you need to fetch data from another server.

We'll cover two approaches, [deploying with branches](#deploying-with-branches) and [deploying with GitHub Actions](#deploying-with-github-actions).

- With **branches**, GitHub Pages will just deploy the files from a branch in your repo. It's up to you to commit the built version of your application to that branch.
- With **GitHub Actions**, you only commit your source code to GitHub, which will then automatically run a build using Node. This is typically what you'd want for a Vue/Vite application or a VitePress site. This option is relatively new, so you may find older guides don't mention it.

## Naming your GitHub repo

The domain for your site will be a subdomain of `github.io`, prefixed with your username or organization name. So, for example, this site is deployed at <https://vue-land.github.io/>, where `vue-land` is the organization name for the repo on GitHub.

The name of the repository determines the path used to deploy the site. For example, if you have a repository at `https://github.com/vue-land/abc`, then that'll be deployed as a site at `https://vue-land.github.io/abc`.

```
https://github.com/vue-land/abc
                   ******** ^^^

https://vue-land.github.io/abc
        ********           ^^^
```

This path, `/abc`, is known as the ***base path***. It's an important concept and one we'll come back to throughout this page.

But what about if you don't want a base path? How do you deploy to the root path? You can't just use an empty string or a `/` as a repository name.

For that you'd name your repo with the same name as the subdomain. So, for example, this site is in a repository called `vue-land.github.io`. See <https://github.com/vue-land/vue-land.github.io>.

The page you're reading right now has a URL beginning `https://vue-land.github.io/faq/`. From that URL, you can't tell whether the site is deployed with a base path of `/` or `/faq`. It's entirely possible that it could be coming from a repository at `https://github.com/vue-land/faq`. It isn't, but it could be. Both options would work.

You can use a custom domain name, which also impacts the path, but we'll cover that [later](#configuring-custom-domains).

## Configuring your build

If you're intending to deploy to a base path of `/`, then your build will probably be fine by default.

However, if you want to deploy to a specific base path, then you'll need to configure that.

- If you're using **Vite**, the setting you need is called [`base`](https://vitejs.dev/guide/build.html#public-base-path), and it needs to be added to `vite.config.js` (or `.ts`). Here's an example: <https://github.com/skirtles-code/vue-numbers-game/blob/main/vite.config.js>.
- If you're building a **VitePress** site, the setting is also called [`base`](https://vitepress.dev/reference/site-config#base) but it needs to go in your `.vitepress/config.js` (or `.ts`). Here's an example: <https://github.com/skirtles-code/vue-examples/blob/main/docs/.vitepress/config.js>.
- If you're using **Vue CLI**, the setting is called [`publicPath`](https://cli.vuejs.org/config/#publicpath) and needs to be in your `vue.config.js` (you may need to create that file).
- If you're using **webpack**, without Vue CLI, then you'll need to set [`output.publicPath`](https://webpack.js.org/configuration/output/#outputpublicpath) in your `webpack.config.js`.

These settings all serve a similar purpose, they're used as a prefix when requesting the built assets. If the base path is misconfigured then you'll see requests failing with 404 errors in the Network tab of your browser after you deploy your site.

## Deploying with branches

This is the old way to use GitHub Pages. It still works, but it isn't the approach we'd recommend. We'll cover it here for completeness.

This approach won't automatically run your build for you. Instead, you commit the build output (artifacts) to a specific branch and GitHub then deploys that branch.

If you're deploying to a root base path, with a repository following the `<name>.github.io` naming convention, then GitHub will automatically enable GitHub Pages for the default branch.

If you're using a different base path, then you'll need to enable GitHub Pages yourself.

To access the settings for GitHub Pages, click on the **Settings** tab in your repository, then look for a section called **Pages**. In there you'll be able to enable GitHub Pages and tell it which branch you want to deploy. Historically, this branch had to be called `gh-pages`, but you can now choose any branch you want.

### Jekyll

Pages deployed from branches will be processed by Jekyll as part of the deployment process. Jekyll is a static site generator, like VitePress. Chances are you don't want Jekyll to process your files if you're deploying a Vue/Vite site. In practice, you may not notice, as it'll pass most files along unchanged.

Jekyll can cause some files to disappear. For example, files beginning with `_` or `.` will be discarded.

You can disable Jekyll by adding an empty file called `.nojekyll` to the branch you're deploying.

## Deploying with GitHub Actions

This is usually the option you'd want, as it allows you to run your build and deploy the build artifacts.

Click on the **Settings** tab in your repository, then look for a section called **Pages**. There should be a dropdown for selecting the **Source**, which you should set to **GitHub Actions**. It'll show you some options to help you create a workflow, but you can just ignore those.

To create the workflow, you need to put a YAML file in the directory `.github/workflows` (note the `.` at the start). You can call the file whatever you like, but `deploy.yml` or `pages.yml` would be obvious choices.

There are examples for what should be in that file in the docs for:

- Vite: <https://vitejs.dev/guide/static-deploy.html#github-pages>
- VitePress: <https://vitepress.dev/guide/deploy#github-pages>

It's pretty much the same idea in both cases, and you can use the same config for other tools, such as Vue CLI or webpack.

There are a few bits you may need to change to match your build:

- The branch on GitHub to build. The examples use `main`, which is likely what you'd want. If you aren't deploying from your default branch then you'll also need to go into **Settings** / **Environment** / **github-pages** and configure the **Deployment branches**.
- The build command. The examples above use `npm run build` and `npm run docs:build` respectively, but you can change that to run the relevant target from the `scripts` section of your `package.json`.
- The path of the build artifacts created by your build. The examples above use `./dist` and `docs/.vitepress/dist` respectively. If your build puts the built files somewhere else then you'll need to change that path.
- The Node version.
- If you're using yarn or pnpm instead of npm, then you'll need to adjust that too, to ensure the dependencies get installed correctly. There are examples using pnpm below.

Some complete examples:

- <https://github.com/vue-land/vue-land.github.io/blob/main/.github/workflows/pages.yml> - This site, using VitePress and pnpm.
- <https://github.com/skirtles-code/vue-numbers-game/blob/main/.github/workflows/pages.yml> - A Vue/Vite application, also using pnpm.
- <https://github.com/skirtles-code/vue-vnode-utils/blob/main/.github/workflows/pages.yml> - VitePress docs for a library, sitting alongside the library in the same repo and branch.

Once you push that file to the relevant branch it should automatically trigger a build. Take a look at the **Actions** tab in your repo to see whether the workflow ran. If it failed then there should be a log indicating what went wrong.

## Vue Router

If you're using [HTML5 history mode with Vue Router](https://router.vuejs.org/guide/essentials/history-mode.html#html5-mode) then you're likely to have problems. That's the history mode you get with `createWebHistory()`.

The initial load for the root route, `/`, should be OK, as that will just load the `index.html`. As you navigate around it will update the path in your browser, but that all gets handled client-side, without contacting the server. If you then refresh the page it will send a request to GitHub Pages asking for that path. But GitHub Pages won't know what to do with that path, so it'll just return a 404. There isn't a direct way to configure which paths should return `index.html`.

To give a more specific example, let's imagine this site is using Vue Router (it isn't, but let's pretend). Let's assume we have routes for `/` and `/user`.

1. First we load the site at `https://vue-land.github.io/`. That sends an HTTP request to GitHub, which will return the `index.html`.
2. `index.html` will send further HTTP requests to the server to load assets such as the `.js` and `.css` files.
3. The `.js` files include code to initiate Vue Router. It sees that we are at `/`, identifies the corresponding route and shows the appropriate component in the `<RouterView>`.
4. Then the user clicks on a `<RouterLink>` to navigate to `/user`. That's fine, Vue Router updates the browser URL to `https://vue-land.github.io/user` and shows the relevant component in the `<RouterView>`. The browser won't make a request to the server to load the new URL, it all gets handled client-side by the router.
5. Now the user hits refresh. The browser now sends an HTTP request to the server asking for `https://vue-land.github.io/user`. But GitHub Pages has no idea what `/user` is, so it returns a 404.

If you've only got a fixed set of routes, without any `params`, then you could configure your build to make copies of the `index.html` in all the relevant folders. For example, if we copied `index.html` to `user/index.html`, then GitHub Pages would have been able to serve it up in response to the request from the example above. If you need different `<meta>` tags for each page then see [How do I add dynamic `<meta>` tags to my application?](./dynamic-meta-tags) for more discussion of that topic.

Another option is to use `index.html` as your 404 page. GitHub Pages serves up the file `404.html` for missing files, so you could use your `index.html` as `404.html`. The problem is you'll still get a 404 status code, so any crawlers will still think that the page wasn't found. The pages are unlikely to end up in search engines if the search engine thinks they're a 404 page. Some other hosting providers solve this problem by supporting a `200.html` file instead, but GitHub Pages doesn't support this: see <https://github.com/orgs/community/discussions/27676>.

The final option is to use [hash mode routing](https://router.vuejs.org/guide/essentials/history-mode.html#hash-mode) instead, with `createWebHashHistory()`. Revisiting our earlier example, that would translate the `/user` route into a URL of `https://vue-land.github.io/#/user`. The bit after the `#` doesn't get sent to the server by the browser, so refreshing will just load `index.html`.

If you do decide to stick with `createWebHistory()`, you'll also need to ensure that it's configured to use your base path. The router needs to know that the base path is not part of the route path. This is only a problem if the base path is not `/`, as that's the default used by `createWebHistory()`.

We don't need to copy the setting from the config file, it's exposed by the bundler. For example, with Vite:

```js
const router = createRouter({
  // Vite exposes the `base` setting using `BASE_URL`
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
  ]
})
```

For Vue CLI, you'd use `createWebHistory(process.env.BASE_URL)` instead.

## Configuring custom domains

The official documentation for configuring a custom domain is at <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/>, and we're not going to repeat it all here.

The key detail for a custom domain is the base path, which will be just `/`, irrespective of what name your repository has.

So let's say we have the repo `https://github.com/vue-land/abc` and we've successfully deployed it at `https://vue-land.github.io/abc`. Now let's imagine we configure GitHub Pages to use a custom domain of `vue-land.vuejs.org`. The resulting URL will be just `https://vue-land.vuejs.org/`, without the `/abc` path on the end. This will break the site, as we configured the base path to be `/abc`. We'll need to set it back to the default value of `/` for it to work with the new domain.

## My site deploys but it doesn't work. Why?

First, check you're going to the right URL. If you open **Settings** / **Pages** you should see a link to your site. Click on that to make sure you have the correct URL.

Next, open the browser developer tools and have a look to see whether you're getting any errors or warnings.

If you're getting 404 errors for missing files, the next step is to jump to the Network tab and check exactly what files it is trying to load. Check the paths are correct, including the base path. If it's failing to load all of the `.js` and `.css` files then you've probably got the wrong base path.

If most of the files are loading correctly, but a few aren't, then try to identify what makes those files different. For example, if the file names start with a `.` or `_` then they might be being filtered out by [Jekyll](#jekyll).

If all the files seem to be loading correctly, it might be a problem with Vue Router. Are you using `createWebHistory()`? If so, have a read through the advice in the [Vue Router](#vue-router) section above.

If it still isn't obvious what the problem is, trying running a production build locally. It might not be a problem with GitHub Pages at all, it might just be that your production build doesn't work. Both Vite and VitePress have a `preview` command that you can run after a `build` to see a preview of your built site. Make sure you run both commands, `build` and `preview`.

If you still can't figure out what the problem is, despite reading through this page and trying to debug the problem yourself, then feel free to ask on the Vue Land Discord server. Make sure you provide all the information we'll need to understand the problem. Sharing the URL for the repository you're deploying is usually the quickest way for us to see what the problem is.
