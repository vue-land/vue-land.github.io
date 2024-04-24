# Why isn't `v-html` rendering my components?

Vue converts *template* input into *html* output. The `v-html="xyz"` directive is used to set the *html*. To render components, they need to be in the *template*. [Enable the runtime compiler](https://vuejs.org/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation), and then use this:

```vue-html
<component :is="{ template: xyz }" />
```
