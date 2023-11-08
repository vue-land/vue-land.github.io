# How do I call a method in a child component?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

You can invoke methods on child components using template refs. See <https://vuejs.org/guide/essentials/template-refs.html>.

If the child component is using `<script setup>`, it'll need to expose any methods explicitly, using [`defineExpose()`](https://vuejs.org/api/sfc-script-setup.html#defineexpose).

See also [Why are my template refs not working?](template-refs).

However, template refs are a feature you should rarely need. Usually there's a better way, but it depends on the specifics of what exactly you're trying to do. It's common for newcomers to Vue to overuse template refs, often because they're trying to use patterns they've used in other types of programming. The premise of the question, that the parent needs to call a method on the child, is precisely the line of reasoning that leads to template refs being misused. There's usually a better alternative to implement the underlying requirements.
