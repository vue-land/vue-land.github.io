# Can I use JavaScript classes for my reactive data?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

You should avoid using JavaScript classes for reactive data.

Built-in classes such as `Array`, `Set` and `Map` will work fine, but Vue has specific code to handle those classes. It won't know how to handle classes that you've written yourself.

It is possible to use JS classes, but they have to be written carefully to avoid breaking reactivity.

There are two common reasons for using classes:

1. You're used to working with classes in other frameworks or languages. In that case, you should probably just not use them with Vue.
2. They're coming from a third-party library. In this scenario, you may want to keep the class non-reactive and instead create a separate object that exposes a reactive copy of the data. The original class will likely provide some mechanism, e.g. callbacks or events, that you can use to keep the objects in sync.
