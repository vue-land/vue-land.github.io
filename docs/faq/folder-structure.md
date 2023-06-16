# What folder structure should I use for my Vue project?

Vue gets used in a lot of different ways, for both small and large applications, and even sites that aren't really 'applications' at all. What works for one case doesn't necessarily translate to another, and a lot of people like that flexibility. Of course, a lack of 'rules' is a problem if you're just beginning.

New projects are often scaffolded using `npm init vue@latest`, which runs [`create-vue`](https://github.com/vuejs/create-vue/) to create a default project structure based on the answers you give to a few questions. It only creates a minimal starter application, so it doesn't really give you a sense of the bigger picture. The folder structure it uses puts Pinia stores in a `stores` folder, router configuration in a `router` folder, and components get split between two folders: `views` and `components`. The `views`, roughly speaking, would be the entry points for your routes, whereas the `components` are reusable, individual pieces.

One advantage of structuring things like that is that it allows automated tools to understand the structure. For example, Nuxt has stricter rules about its folder structure, and it uses that structure to deduce the significance of the files and automatically generates a lot of the boilerplate (e.g. route configuration) just based off that. [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) uses a similar idea.

That kind of structure groups files by *type* rather than *feature*. If you're working on a specific feature then it can certainly be argued that it makes more sense for the components and stores for that feature to all be together in the same folder. That folder layout is known as 'feature folders' or 'folder by feature' and it isn't specific to Vue. You should be able to find articles about that elsewhere.

It's also common to have shared, base components that are used throughout an application. Those often live in the same folder. Sometimes the `components` folder is just used for these base components, or they might have their own subfolder within `components`. It could be called something like `base`, `common`, or `shared`. Or the base components could be split off into a separate component library.

Folders called `composables` and `utilities` or `utils` are also pretty common.

There are some example applications in the FAQ entry for [Can you show me a large, open-source Vue project that I can study?](/faq/large-example-applications.html), though some of those are using Nuxt, which places extra restrictions on their folder structure.
