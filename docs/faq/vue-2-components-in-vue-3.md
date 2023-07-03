# Do Vue 2 components work with Vue 3?

## Libraries

If the components are coming from a library, then probably not.

While Vue template syntax is mostly the same between versions, libraries are usually published with compiled render functions rather than the original templates. The way render functions are written changed significantly between Vue 2 and Vue 3, so a component that has been compiled for one won't work with the other.

It is sometimes possible to compile the same component for both versions, but if the library you're using hasn't done that then it will only work with one version and not the other.

Many Vue 2 libraries have a Vue 3 equivalent, but you may have to do a bit of digging to find it. It might be using a `next` tag on npm, with the code on a separate branch on GitHub. If a library is being actively maintained then it will probably have a Vue 3 version by now. If it doesn't then it may be that no-one is actively maintaining the library.

If you're unsure which version of Vue a library is using, see [How do I check which version I'm using?](./checking-versions) for some tips.

## Application code

If you're trying to migrate your own code from Vue 2 to Vue 3, then it's possible that a specific component might not need any changes, but you should consult the migration guide at <https://v3-migration.vuejs.org/> for a more detailed explanation of what changes you might need to make.
