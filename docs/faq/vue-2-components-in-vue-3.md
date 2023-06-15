# Do Vue 2 components work with Vue 3?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

If the components are coming from a library, then probably not.

Components are typically compiled. In particular, the template needs to be compiled down into a render function.

The format used for render functions changed between Vue 2 and Vue 3, so a component that has been compiled for one won't work with the other.

It is often possible to compile the same component for both versions, but if the library you're using hasn't done that then it will only work with one version and not the other.

If you're trying to migrate your own code from Vue 2 to Vue 3, then it's entirely possible that a specific component might not need any changes. See the migration guide at <https://v3-migration.vuejs.org/>.
