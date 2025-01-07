<script setup>
import { h, resolveComponent } from 'vue'
const Badge = resolveComponent('Badge')
const Stub = () => h(
  Badge,
  {
    text: 'stub',
    title: 'Stub: The answer to this question is currently incomplete',
    type: 'warning'
  }
)
</script>

# FAQ

This FAQ aims to answer some of the most common programming questions that we get on the [Vue Land Discord server](https://chat.vuejs.org/).

It is not a substitute for the official Vue documentation, available at <https://vuejs.org/>. Those docs include an FAQ for Vue itself at <https://vuejs.org/about/faq.html>.

::: warning Work in progress
Only about half the questions have complete answers. Those questions are listed in the sidebar on the left. The other answers are just stubs.
:::

---

<!-- Learning -->

- [How should I learn Vue?](learning-vue)
- [Can you show me a large, open-source Vue project that I can study?](large-example-applications){.stub} <Stub />

---

<!-- New project decisions -->

- [Which Vue component library should I use?](component-library)
- [What folder structure should I use for my Vue project?](folder-structure)
- [Can I use Nuxt features without using Nuxt?](nuxt-features){.stub} <Stub />
- [Do Vue 2 components work with Vue 3?](vue-2-components-in-vue-3)
- [I need users to stay logged in if they refresh the page. Should I use cookies or local storage?](cookies-local-storage){.stub} <Stub />

---

<!-- Working with npm -->

- [How do I check which Vue version something is using?](checking-versions)
- [How do I run an old project?](running-old-projects)

---

<!-- Deployment -->

- [Why is there a `#` before my route path?](hash-before-route-path)
- [Why does my page fail to load when I refresh in production?](production-page-refresh)
- [Why do I get a blank page in production?](blank-page-in-production)
- [How do I deploy to GitHub Pages?](github-pages)
- [How do I add dynamic `<meta>` tags to my application?](dynamic-meta-tags)

---

<!-- Vue code patterns -->

- [How should my components communicate?](component-communication){.stub} <Stub />
- [How do I call a method of a child component?](invoking-child-methods)
- [Why are my template refs not working?](template-refs){.stub} <Stub />
- [How can I share state with a composable?](sharing-state){.stub} <Stub />
- [How can I pass all slots through to a child component?](forwarding-slots)
- [How can I make Vue 'wait' for the data before rendering?](delaying-rendering){.stub} <Stub />
- [Why isn't `v-html` rendering my components?](components-in-v-html){.stub} <Stub />
- [Can I create a local variable in my template?](template-local-variables)
- [Can I use JavaScript classes for my reactive data?](reactivity-and-classes){.stub} <Stub />
- [Why does selecting one item select them all?](independent-selections){.stub} <Stub />
- [How do I create unique element ids with Vue?](unique-element-ids)
- [Why can't I use the current route in `App.vue`?](accessing-the-route)

---

<!-- Pinia -->

- [Why am I getting an error about 'no active Pinia'?](no-active-pinia)

---

<!-- Debugging -->

- [Why does my logging show an empty/missing value after I've loaded the data?](logging-after-loading){.stub} <Stub />
- [Why can I see my data in console logging, but if I try to access it in my code I get `undefined` or an error?](logging-is-live){.stub} <Stub />
- [Why is my `FormData` empty?](empty-formdata)

---

<!-- Common Vue misunderstandings -->

- [When to use `reactive()` and `ref()`?](reactive-ref){.stub} <Stub />
- [Why are the new value and old value the same in my watcher?](deep-watcher-values){.stub} <Stub />

---

<!-- Common tooling problems -->

- [Why do my dynamic images not work?](dynamic-images){.stub} <Stub />
- [Why are my dynamic Tailwind classes not working?](missing-tailwind-classes)

<style scoped>
.stub {
  opacity: 0.6;
}

.stub:hover {
  opacity: 1;
}
</style>
