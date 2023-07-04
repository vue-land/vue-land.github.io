# FAQ

This FAQ aims to answer some of the most common programming questions that we get on the [Vue Land Discord server](https://chat.vuejs.org/).

It is not a substitute for the official Vue documentation, available at <https://vuejs.org/>. Those docs include an FAQ for Vue itself at <https://vuejs.org/about/faq.html>.

::: warning Work in progress
We've only just started work on this FAQ and most of the answers will be incomplete. Some questions don't really have an answer yet, they're just placeholders.
:::

---

<!-- Learning -->

- [How should I learn Vue?](learning-vue)
- [Can you show me a large, open-source Vue project that I can study?](large-example-applications)

---

<!-- New project decisions -->

- [Which Vue component library should I use?](component-library)
- [What folder structure should I use for my Vue project?](folder-structure)
- [Can I use Nuxt features without using Nuxt?](nuxt-features)
- [Do Vue 2 components work with Vue 3?](vue-2-components-in-vue-3)
- [I need users to stay logged in if they refresh the page. Should I use cookies or local storage?](cookies-local-storage)

---

<!-- Working with npm -->

- [How do I check which Vue version something is using?](checking-versions)
- [How do I run an old project?](running-old-projects)

---

<!-- Deployment -->

- [Why does my page fail to load when I refresh in production?](production-page-refresh)
- [How do I deploy to GitHub Pages?](github-pages)
- [In my SPA, how to add og tags and why doesn't Twitter/Facebook see them when I add them dynamically?](og-tags)

---

<!-- Vue code patterns -->

- [How should my components communicate?](component-communication)
- [How can I pass all slots through to a child component?](forwarding-slots)
- [How can I make Vue 'wait' for the data before rendering?](delaying-rendering)
- [Why isn't `v-html` rendering my components?](components-in-v-html)
- Can I create a local variable in my template? <!-- scoped slot or v-for trick -->
- Why does selecting one item select them all?
- Why are my template refs not working? <!-- `v-for="i in foo" :ref="`xxx${i}`"` and `ref.value.foo()` failing due to `v-for`. -->

---

<!-- Debugging -->

- [Why does my logging show an empty/missing value after I've loaded the data?](logging-after-loading)
- [Why can I see my data in console logging, but if I try to access it in my code I get `undefined` or an error?](logging-is-live)

---

<!-- Common Vue misunderstandings -->

- [When to use `reactive()` and `ref()`?](reactive-ref)
- [Why are the new value and old value the same in my watcher?](deep-watcher-values)

---

<!-- Common tooling problems -->

- [Why do my dynamic images not work?](dynamic-images)
- [Why are my dynamic Tailwind classes not working?](missing-tailwind-classes)
