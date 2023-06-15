# Why do my dynamic assets paths not work?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

A static asset path is something like this:

```vue-html
<img src="../assets/image.png">
```

This will typically stop working if you try to replace it with a dynamic path, e.g.:

```vue-html
<img :src="`../assets/${name}.png`">
```

For an explanation, see <https://skirtles-code.github.io/vue-examples/guides/working-with-image-assets.html>.

The same principle carries over to other types of assets, not just images.
