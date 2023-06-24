---
outline: [2, 3]
---
# How can I pass slots through to a child component?

This is a problem that arises when trying to write a wrapper component around another component. The underlying component exposes some slots, and you'd like your wrapper to expose those same slots.

## Passing individual slots

### Default slot

Let's start with the simplest case, where we're only interested in the `default` slot. For that we can use:

```vue-html
<ChildComponent>
  <slot />
</ChildComponent>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqNkL1OAzEQhF9lZIo06O5ogxUJpeIJaNKY2ARL/lnZTgSK8u6szwhxd4mUcmfH3874LF6IutPRiLWQeZ8sFWRTjrTZBesppoK3pIhM2kYegwkFHyl6rLp+vqiY1S7IvnGYwEMxnpwqhidAzp+MKvAK5WEDFLKLpRutCzx7Zf+HE4/i2v3bNbaf1ullial8R4Xpg98CsuZG3xwz5iL38mRNPb2i7ekquun/eGPCXL6dQd5HMpoVNuFc/e8xaZPWeKIv5OisxsMwDM915VU62MCrgXdNIqW1DYemsXIZP6KiN+LyA2WSwTs=).

The following is equivalent, but it is more explicit about the use of `v-slot`:

```vue-html
<ChildComponent>
  <template v-slot:default>
    <slot />
  </template>
</ChildComponent>
```

Behind the scenes, Vue compiles templates into [render functions](https://vuejs.org/guide/extras/render-function.html). It's also possible to use render functions directly to write components. Render functions are plain JavaScript, so they allow us to see how slots work without any Vue template magic.

Slots also compile down to functions, very similar to render functions. In the example above, the `<template v-slot:default>` creates a slot function, called `default`, to pass down to `ChildComponent`. The `<slot />` is used to invoke the parent's `default` slot function. We're effectively wrapping one function in another function to pass it down:

```js
h(ChildComponent, null, {
  default() {                // <template v-slot:default>
    return slots.default?.() //   <slot />
  }                          // </template>
})
```

You can see a running example of this on the [SFC Playground](https://play.vuejs.org/#eNptkd1qwyAYhm/lJTtYCiXJTrusY/RoV7CTwnDVtoJRUVM6Su59n5r0dxCCPu/n+/2dig9rq0MvikXR+o2TNsCL0NvlWsvOGhfw5Zi1wq0MXbXQAVtnOjxX9b0QbZ7Xuq2zDznQJYjOKhYE3YD2/kmiwCdYB6nB4JUJVQp9sKfYtj7bFfPiv/yXNi4NnLDHMFadSxyF1V4q/tjXLR67WmtxTI+42LJekWusMo2q/J5Tjli5xzDLAuBIchrlDG/LiZ3pvrxNMofulSKbKQ5THnp/Bc8GKVs1xrxX5ewSM0zHYYQJ0I++q93QAB8bjeO73RiXh3FJbcyJOuM686uFpG378KsE/MZYwYlQUK7+xzgu3AIv9ghvlOR4aprmNUodczupSWpIy8gyzqXeZUYkFx6tl8XwBzHh6FQ=).

The code above could potentially be simplified to pass on the function directly, e.g.:

```js
h(ChildComponent, null, {
  default: slots.default
})
```

While this does work, it's perhaps less clear how this maps back onto the template, so we'll use the longer version for render function examples on this page. To reiterate:

- Slots are functions passed down from the parent to the child.
- `<template v-slot>` is used to create a slot function to pass down.
- `<slot />` is used to invoke a slot function passed in from the parent.

### Default scoped slot

If the slot is a scoped slot then we'll need to pass on the slot props too:

```vue-html
<ChildComponent v-slot="{ value }">
  <slot :value="value" />
</ChildComponent>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqNkEFLxDAUhP/KEA970baehFoXZE/eBS+9xE3cDaRJSNKilP53X1JZdttVPIU3M3zvTUb27Fwx9JLVrAl7r1xEkLF329aozlkf8ea5c9LvLI1GmogPbztsinJpJMymNU05c4hAQ5Sd0zxKmoBmxRrugrbxqWUjBq57iallOQq8gHdQBhwpUuD1KH8yKmA85acik1fXEKUpT9vZLbt27u+td0elxbrzpfyPxgvOH32b5KDOMgXy2zKUM2exedVufVjqdnmLUMP1XQ9ne+bQGTyXCvFLS4S9dVKQQiGMKf9uvZC+xr37RLBaCdxUVfWYrI77gzJkVeTNkuNCKHOYNVKm/HcJvWXTN8h14io=).

Rather than passing on the slot props individually, we can pass them all in one go by using `v-bind` with an object:

```vue-html
<ChildComponent v-slot="slotProps">
  <slot v-bind="slotProps ?? {}" />
</ChildComponent>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqNkE9LxDAUxL/KEA970baehFp3kT158yB46SW7ibuBNglJWpTS7+5LK6V/FDyFzBt+b+Z17NnapG0ky1nhz07ZAC9DY/elVrU1LuDdcWulOxr6aqkDPpypsUvS9SBidqUu0pFDBPoEWduKB0k/oNiw2jtfmfBUsg4trxqJvmSDFXgBr6E0OKIlwdtV/niURzf5+2Qgb9IQpUin7eyW/Rb379bHq6rEtvNS/kfjFWfqG59XZ6yf+hZRIsNJaTE34HBAR2dBOhJXGTY9txFjy2UqodrF1nw4Jm19mO0ZTTP4UM+Hr0rCn42VghQyoYv+k3FCuhz39hPeVErgJsuyxziqubsoTaOMZqNkuRBKX0aNlH64YkTvWf8NRgnmAw==).

You might have noticed the `?? {}` part. That's to avoid errors if `slotProps` is `undefined`. If `ChildComponent` is using a template then that shouldn't happen, but if it's using a render function then it could be `undefined`. `v-bind` will throw an error if the argument is `undefined`, so we need to defend against that. [Example](https://play.vuejs.org/#eNqNUEFqwzAQ/MqiHmxDarvX1EkoOfXWWy+GokRKLLAlIckmxfjvXVlu0tgtFITEzszO7qgnL1qnXcvJmhT2aIR2YLlr9baUotHKOHg3VGtu9gpLyaWDk1ENRGk2J7xNVMoiCz7ogIXjja6p41gBFPOWEQV4BdqAkEDB1sqlo3Rhj9oiu9qRFflt/t8x9pWo2TLEPfyPCDOf7tGvvCmJf96M0rYkU6rCQyg4CMl+CmC3g34oCWTBcbbDIudyxVvKW74eKhimWCFFKfllpBg/0bZGiR83fkv8scIGv5GFIQkEgEHKSIgT2Gy/sStaxRETXbQKXbt0Mo2TJAgH/+CF5/77rPusOdij0pwhgibB+6AM42YNT/oCVtWCwUOe58+eaqg5C4lUjlyANGVMyHPAEAljvPWWDF/jJ/Z+).

### Named slots

In this example we have 3 slots. The `body` slot is a scoped slot, passing on a slot prop. As with the earlier examples, it could pass along the whole `slotProps` object instead:

```vue-html
<ChildComponent>
  <template #header>
    <slot name="header" />
  </template>
  <template #body="{ value }">
    <slot name="body" :value="value" />
  </template>
  <template #footer>
    <slot name="footer" />
  </template>
</ChildComponent>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqNUrFuwjAQ/ZWTGVhokk6VUhepYupeqUsWgw1YSmLLNlFRlH/nHAOKk4CYknt379n3nlvyrXXSnATJCbU7I7UDK9xJr4taVloZB3+GaS3MRmFZi9rB3qgKlkk6bniZZVHTNOigAhZOVLpkTmAFQMeUHkX8NgXNmy2Vy4+CcWGuXYAfYBW4o4CAJ1dWGonPyGwVP38VpIWGlScBXUGmkn4mgV/8C0PSQnsndC8ftVfKzd044PMydGIhwoMZsiJzHj+OanOUJZ8GFcMvxBQTJisvRvFQ7wDUrBJodugVBNIb77F3iycBRaJ+DiXzfgzr/vviGaNkIt3QeyxER95N8pla69OJNSK3nnlF08Eo5bKZ44yt+BjQbxQ62Llwzzam6X00Wh1L686lALtTWnBEwtVWgGesrq8aWi+xVQYbObzrf7CqlBwWWZZ9+lbFzEHW2MqwFyDNOJf1IWCIdP1L9EetSXcBSNqFwg==).

The equivalent render function would be:

```js
h(ChildComponent, null, {
  header() {                      // <template #header>
    return slots?.header()        //   <slot name="header" />
  },                              // </template>

  body({ value }) {               // <template #body="{ value }">
    return slots?.body({ value }) //   <slot name="body" :value="value" />
  },                              // </template>

  footer() {                      // <template #footer>
    return slots?.footer()        //   <slot name="footer" />
  }                               // </template>
})
```

There are more concise ways to write this render function, but the way we've shown it here allows us to illustrate how each line maps back to the template.

See it on the [SFC Playground](https://play.vuejs.org/#eNqNU1FrwjAQ/itH9qBCV93TwFXH8Gnvg70URjTRFtIkpKko0v++S9PUVjsZlNL77r7vkvuuF/KhdXysOFmSpNyZXFsoua30OpV5oZWx8G2o1txsFIaSSwt7owqYxPPbhJOZpDKZex1UwMDyQgtqOUYAyS2lQREPVXB8LoWyy4xTxk2bBfgEWoDNOHg8blnzgfiIzFax8yolFzhSUXGoU3Iv6Wpi+MIvX5SXcOkI9b9b7ZWyYyf2+LhMcjdChHs1JCJjM75adTXpAhnUrTPehjaxyXLB7r0bwq1zqeSnhsT4nlYCVd0pm3WY/kTYw920hHrmEwAGU0bCdAardcA6NJsOm0QgKyFQJtRBayfSe1jHb5q9x6HmWlFH7qghcv5NO8MeSt2U/qXoLXt8qlDT0wifQbgB8IVP90ugo/eTd34O92Kw/olrCZIWHFfZZ1IC83aDeqUJy49jHHdtZCybe2P82qMHStLb39QO6D7T43Slg3XGsLRnwaHcKc0ZIv5oEWCPqB2qH+lWGUws4UWfoFQiZ/C0WCzeXKqg5pBLTC0w5yFNGcvlwWOI+Hm6VmtS/wI2H4xa).

## Passing all slots

To pass through all slots you'd use:

```vue-html
<ChildComponent>
  <template
    v-for="(_, slotName) in $slots"
    v-slot:[slotName]="slotProps"
  >
    <slot :name="slotName" v-bind="slotProps ?? {}" />
  </template>
</ChildComponent>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqNUl1LwzAU/SuXKKiwtfVJqHVD9uSL+CD4YEW6JdsCbRLSrDhK/7s3TVv7Jewt99xzTm5ObkmelfKKEyMhifKd5spAzsxJrWLBMyW1gQ+dKMX0RmIpmDCw1zKDG88fN6zNTSwi3/mgAxaGZSpNDMMKIBpLahTxlgXFMk+lCY8soUw3XYAXSDIwRwYO9xqVPzCfsdlKen6KSQlFkp4YVDGZWlqOB+94ciSeQ9kJqouv2ktp5iZ2+LxNNIkQ4R6HLMhcxv9/1ebIUzr9qCF8wTcNBeMnt28slnupMd7b7wXYDF6TjN0BF3Btqzwmf8Q6os+W9IUie37TUnW0LrrItiAUSGx4VhMTtNlyQftaWK+hxF8Fv51xHPDkJcN4p8nYcIceg110wzWzuU53feT3qBHlxZzGrhsqwnrBsH7oyVtJ1Fum2AzkrtPTdNTB07HMzTllkO+kYhQRN9oC8I5Fs5RQWout1NgI4V79QC5TTuEqCIJH28oSfeACWwH2HKQSSrk4OAyRql4ke9WKVL8yk3HR).

If you find the code above a bit overwhelming, that's normal.

You may want to take a look at the earlier examples for [passing individual slots](#passing-individual-slots) first, as the ideas from those examples are reused here.

### `$slots`

`$slots` is an object containing the slot functions. We saw this same object in some of the render function examples from earlier, though it was referred to as `slots` in those examples. In the template this object is exposed with the name `$slots` instead.

This object contains the slot functions passed in by the parent component. If you're familiar with `$props` or `$attrs` then it's a similar idea. These objects each contain things passed in from the parent template. However, for `$slots` there's no direct equivalent of `v-bind="$props"` or `v-bind="$attrs"` to allow us to pass along all of the slots from `$slots` in one go.

Instead, we need to iterate over `$slots` using `v-for`. For each of the slot functions that have been passed in, we want to pass down a slot function of our own to `ChildComponent`.

### `v-for`

We're using `v-for` to iterate over an object, so the general form is:

```
v-for="(propertyValue, propertyName, index) in object"
```

In our case, the property value is the slot function, but we don't actually need that. All we need is the slot name. So we write it as `v-for="(_, slotName) in $slots"`. Using `_` is a common naming convention for unused positional arguments.

If you prefer, the `v-for` could have been written as:

```
v-for="slotName in Object.keys($slots)"
```

You might notice that there isn't a `key` attribute on the `<template>` tag, which would usually be expected for the `v-for`. That isn't a mistake, it's a special case. Using a `key` when iterating over a `<template v-slot>` won't do anything. Roughly speaking, this is because the iteration is creating slot functions, not VNodes, so there's nowhere to put the key. Effectively the name of the slot is performing the same role as a key.

### `v-slot`

The `v-slot:[slotName]` creates a slot function to pass down to the child, using the name `slotName`. The `[...]` part is needed to give the slot a dynamic name. It's just like `v-slot:header` or `#header`, but with a dynamic value instead of a fixed name like `header`. You could use `#[slotName]` instead, if you prefer. The official documentation for dynamic slots names is at <https://vuejs.org/guide/components/slots.html#dynamic-slot-names>.

We then need to handle the slot props for [scoped slots](https://vuejs.org/guide/components/slots.html#scoped-slots). This is similar to the [earlier examples](#default-scoped-slot), and we use the name `slotProps` for that object.

### `<slot>`

The `<slot>` is used to invoke the slot function that was passed in from the parent.

The `:name="slotName"` determines the name of the slot function to invoke.

The `v-bind="slotProps ?? {}"` is the same as in the earlier examples for a [default scoped slot](#default-scoped-slot).

### With a render function

If we wanted to write this same example as a render function it would actually be a lot easier. We can pass along all the slots in one go, no looping required:

```js
h(ChildComponent, null, slots)
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqNUkFuwjAQ/MrIPRSkFOipEk2Rqp56r9RLLgYbEsmxLdtBIJS/d40DJJBDJQR4ZmfW3tkT+7R2tm8kW7Lcb1xlA7wMjV0VuqqtcQG/jlsr3Zeho5Y6YOtMjefZ/J6INs+FzufJhxzoEGRtFQ+STkB+LzmjhF+qsH/xyoRlKbmQrmOBb/AaoZRI+KxTzQfmIzZrI44fBTthz1Uj0Rbs0TLWzPBD/1JR5XG6Ctp/t9oaE8ZunPBxm/xhhAT3aljGxmZ8i+oW0gkl2i6ZFENHfJWVEo/ZDeEuOaDQ8nCWCbnljSLfiJ4XYmKdsT6jTvG9Hu00kYAj2mlMpvhYXbArWk6GrTLoRqksmUxTcRt/6Is+veWh1z/eMr59OMPBquTRFprXkmJPTMEw76bdK81FtR/TxG0gxfKcP53fevKLJO9lXYSBPDE9zbV0ED0dfTgqCb8xVgpC0tUyUI+s25k0yrVxRCzxag/wRlUCT4vF4j1SNXe7ShO1IC5BlgtR6V3CCEkTja1WrP0DXd1S3A==).
