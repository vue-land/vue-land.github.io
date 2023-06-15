# Why are my dynamic Tailwind classes not working?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

Because Tailwind can't tell that you're creating those classes dynamically.

If you can't rewrite the code in such a way that Tailwind can detect them automatically then you'll need to add them to the safelist instead, <https://tailwindcss.com/docs/content-configuration#safelisting-classes>.
