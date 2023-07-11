# Why are my template refs not working?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

It is usually better to use other forms of inter-component communication, rather than template refs. We won't go into detail about that here, we'll assume that a template ref is the appropriate way to solve your current problem.

Template refs only work within a single component. If you add the attribute `ref="foo"` in a template, it will only populate the `foo` ref for that component. They aren't global, like `document.getElementById('foo')`, nor are they inherited by ancestors or descendants. In the rare cases where you need to grab elements from within descendants, you may need to use `el.querySelector()` instead.

If you're using an explicit `setup` function, have you remembered to return the ref from `setup`?

Template refs aren't populated until after rendering, so it's common to put them inside `onMounted()`.

Using `onMounted()` still assumes that the ref is populated during the first render. If there's a `v-if`, maybe waiting on some remote data, then the ref won't be populated until later. A `watch()` on the ref is often a better choice than `onMounted()`.

In other scenarios, it might make sense to use `nextTick()` or a `flush: 'post'` watcher to wait for re-rendering to occur after a data change.

If a template ref is used on a component it will refer to the public component instance, not the element. If you need the element, use `$el`, or expose a suitable method from inside the component.

`<script setup>` is closed by default, so you won't be able to invoke any methods of a child component through the ref unless you use `defineExpose()` to expose them.

A common mistake is to use `:ref="foo"`, with a `:` prefix. If `foo` is the name of a `ref()` then you should use `ref="foo"` instead. Using `:ref="foo"` will still apply the automatic unwrapping of refs, so it won't work. If the ref is nested in a plain JS object, then `:foo="wrapper.foo"` should work fine. If `wrapper` is a reactive object then it will also apply automatic unwrapping, which will also fail.

If a `ref` attribute appears inside a `v-for`, it will populate the corresponding ref with an array. However, the order of that array may not match the DOM order of the elements/components.

Trying to use a dynamic name, such as ``:ref="`child${index}`"`` probably won't do what you want. With the Options API, it will populate `$refs`, but if `index` is coming from a `v-for` then you'll also need to account for the value being an array. With the Composition API, it just won't work at all. Instead, you can bind a function for the `ref` attribute, e.g. `:ref="el => fn(el, index)"`, where `el` will be the element or component, or `null` when it is being removed.
