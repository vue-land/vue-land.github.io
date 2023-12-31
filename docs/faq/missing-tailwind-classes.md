# Why are my dynamic Tailwind classes not working?

## How Tailwind works

Tailwind will only include the CSS for a class if it finds that class somewhere in your code. You can read more about how it does that here:

<https://tailwindcss.com/docs/content-configuration#class-detection-in-depth>

This happens as part of the build, using static analysis of the source code. It can't detect classes created at runtime.

Tailwind isn't tied to a particular language or framework. It doesn't need to know whether you're using JavaScript or TypeScript, HTML or Vue SFCs. It processes all text in the file the same way, scanning for anything that looks like a Tailwind class name.

## Dynamic class names

Tailwind can't detect classes that are created dynamically using string manipulation. So it won't understand if you do something like this:

```js
const textColor = `text-${color}-500`
```

A dynamic class like this may still work, but only if something else adds the same class to the build. Dynamic classes can appear temperamental, with some values working while others don't. That's because the values that work are used elsewhere, which pulls them into the build.

```js
// Tailwind finds this and includes the CSS for
// text-red-500 in the build.
const headingColor = 'text-red-500'

// Tailwind can't understand this, but it will still work
// if `color` is 'red' because the CSS for text-red-500
// has already been included by the previous code.
const textColor = `text-${color}-500`
```

Tailwind recommends using a mapping for this kind of scenario:

```js
const themeColors = {
  red: 'text-red-500',
  green: 'text-green-500',
  blue: 'text-blue-500'
}

const textColor = themeColors[color]
```

See <https://tailwindcss.com/docs/content-configuration#dynamic-class-names> for more details.

You can also force Tailwind to include specific classes in the build using the `safelist` configuration option. See <https://tailwindcss.com/docs/content-configuration#safelisting-classes> for details.

## Tailwind and Vue

As Tailwind treats all code as just text, it has no problem understanding classes bound using `:class`, or classes coming from the `<script>` section of an SFC. The following will all work fine:

```vue-html
<p :class="{ 'text-blue-500': condition }">...</p>
```

```vue-html
<p :class="condition ? 'text-blue-500' : 'text-red-500'">...</p>
```

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps(['theme'])

const textColor = computed(() => {
  return {
    dark: 'text-cyan-500',
    light: 'text-indigo-500'
  }[props.theme] || 'text-violet-500'
})
</script>

<template>
  <p :class="textColor">...</p>
</template>
```

But as noted earlier, it can't handle class names that are constructed dynamically. If Tailwind encounters the following code, it won't be able to tell what classes it needs to include in the CSS:

```vue-html
<p :class="`text-${color}-500`">...</p>
```

As we've already discussed, code like this might still work if those classes are included elsewhere, or if they have been safelisted, but you are creating an implicit dependency on that other code.

Tailwind supports using arbitrary values, such as `text-[#669900]`, but those still can't be created dynamically.

For example, the following won't work (unless something else adds the class to the build):

```vue-html
<!-- Won't work -->
<p :class="`text-[${color}]`">...</p>
```

Instead, you can write this using a dynamic `style`:

```vue-html
<p :style="{ color }">...</p>
```

If you need to use modifier prefixes, such as `dark`, `md` or `hover`, then you can use CSS variables in your Tailwind classes. For example:

```vue-html
<p
  class="dark:md:hover:text-[color:var(--text-color)]"
  :style="{ '--text-color': color }"
>...</p>
```

See <https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values> if you're unfamiliar with the Tailwind syntax in the example above.
