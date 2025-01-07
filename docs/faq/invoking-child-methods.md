# How do I call a method of a child component?

Calling a child method is rarely something that you should need to do in Vue. We often see this question asked on Vue Land, but once we dig a bit further it usually transpires that invoking a child component's method isn't actually the best way to solve the underlying problem. This is known as an [XY problem](https://xyproblem.info/).

If you're trying to call a child method, you should first consider whether the problem would be better solved via props instead, or by moving the relevant responsibility out of the child component altogether.

But there are valid use cases for invoking a child method. In the examples below we'll use a method to focus an element within the child.

## Examples

Here are 3 Playgrounds that show a child method being invoked. They are essentially the same example but written using different APIs:

- [Playground with `<script setup>`](https://play.vuejs.org/#eNqdkj9PwzAQxb+K5aVFQskAEwoIqIoEAyBg9FLcSzE4Z8t/SlHV787ZSUNbSge2+O6d3zvnt+RX1hbzCPyMV146ZQPzEKK9EKgaa1xgSxY9vEBj9STAE9RsxWpnGjagqUGvGr0pPR0ZOiBg6BRFuV1ORjQiUBr0gcnUTDee71gMB81XnhwcJXUdUQZlkBm8jiEYHGklP4ZHbCmQ9bcU84mOUNRGRn+LNoYhDa8EVmW7F21Eh9C50Imxaie1g/pc8M5bcFa2qtdsyi5lsiXBVgzBL26SZVW2Mhqpyt6FH/PgadtazYp3b5CeOYcWXJKr0uAebFrNC37WrpN6E63N512uBRfheF2XbyA/9tTf/SLVBH904MHNQfC+FyZuBqFtj5/vYUHffbMx06hJfaD5BN7omDK2suuIU4q9octpbzMGCmcvfrwIgH69VAqalKusF5wQSA/+1+o/cU+K0zxHP5Fe8TdI/yZ2jR/oPeCpRM5Y74C3CVWbFfQmbx1qAqdQK4TxwhoPwyz8GSUJyQ7hmM07CrsghNc2UKtvsRtKKQ==)
- [Playground with `setup` function](https://play.vuejs.org/#eNqdU01P4zAQ/SuWLy0SSg67JxTQLlVXYg+7K5ajL8GdFINjR/4oRaj/nRnnqy0BBFISxeM3b55nnp/5z6bJNhH4GS+8dKoJF8KourEusGcWPdxA3egywDVUbMcqZ2s2Q/xsQC3ulF4tLC4MmNAhsvwwTCUwRRjYpqQVVGXUWEIYxmSP8mdtgB2RUmx3Sl96PYTYzE96qLTGByYpgTSeH4mez+qnxDY7ofqUUUUjg7KGWXMZQ7BmoZV8GBmRs2PLNqWOkFVWRn9lmhjmSEKAXc/lUIwzY+YB5YBNH3yKfOgxLkKnEleMFUd9dFCdC95pF5zlLeo2sbMfkvgRcFiPX/wiqUXewjClyIcq/JQHj92q1Dq799bgyJNswWkASoP721BbvODDHAQvtbaPv1MsuAhpCinnDuTDRPzebykm+D8HHtwGBB/2QunWENrt5f8/sMX/YbO2q6gR/c7mNXirI2lsYZfRrFD2Hi6pvUrGVGZ945fbAMb3hyKhe17iaEpq+FtHH+V+y773Q8Quvrb2F27P9FWY9DboCVcrsuNST7h6362jMUHvm/lDH48knzJxUtV5t1OIpjy04e4F6ZGCOw==)
- [Playground with the Options API](https://play.vuejs.org/#eNqVUlFPwjAQ/itNYwIkZHvQJzKJQjDBBzXqY19wu0Gha5f2ijOE/27bscEQTUy2Zffdd9fvrt+O3pdltLVARzQxqeYljpnkRak0kumKi2yqXCBBIsm1KkgviruwL+4xySRUoSiDfGEFkh2ThKQNy4xqgJw19dh+6L/+LQBXKjtylZxYRCWngqeb/qCBCcEVN9GVhtxExVfoGOUqtWYuS4v9QU3bh+ZMuieJ29lcgFCUYoHgIkKSsyld01tGD10ZJXHN+ghCyF3qpThCRxqj4wd/fBLXNFeSxO0pdEjRpErmfBmtjZJu1WEQRv16uAD9XCJX0jDaTs7oQgj1+Rgw1BbCjkLNCtLNBXxtKo8x+qLBgN4Co20OF3oJWKdnb09Quf82WajMCsf+I/kKRgnrNda0iZWZk33CC2rnwTZcLt/NrEKQphnKCz25aeos4xf+2+hHudfRTXOJbos/jddx7SUDnjvq1CUX7cR9biZqO/3TSaH2YKBDH+eMrhf238IOKkA=)

You can see the full code for those examples in the Playgrounds, but just in case you can't access the Playgrounds, here's the code for the `<script setup>` example:

::: code-group

```vue [App.vue]
<script setup>
import { useTemplateRef } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = useTemplateRef('myChild')

function onButtonClick() {
  childRef.value.focusInput()
}
</script>

<template>
  <ChildComponent ref="myChild" />
  <button @click="onButtonClick">Focus</button>
</template>
```

```vue [ChildComponent.vue]
<script setup>
import { useTemplateRef } from 'vue'

const el = useTemplateRef('inputEl')

function focusInput() {
  el.value.focus()
}

defineExpose({
  focusInput
})
</script>

<template>
  <input ref="inputEl">
</template>
```
:::

We'll explain those examples shortly, but we aren't going to repeat everything that's in the documentation. The relevant page in the official documentation is here:

- <https://vuejs.org/guide/essentials/template-refs.html>

If you're struggling to get this working in your own code then you should start by reading that page carefully.

We also have a separate FAQ entry that might be helpful:

- [Why are my template refs not working?](template-refs)

## Template refs

The main concept that we use is known as a *template ref*.

The examples above actually use two template refs, one in the parent and one in the child. In the child, we use a template ref to grab a reference to the `<input>` element. In the parent, we use a template ref to get a reference to the child component instance. These two template refs are independent of each other, but we need both to implement the focus functionality.

To create a template ref, we first need to add a `ref` attribute in the template:

```vue-html
<ChildComponent ref="myChild" />
```

Here, `myChild` is an arbitrary name that we've given the template ref.

With the Composition API, we then use `useTemplateRef` to access the ref:

```js
const childRef = useTemplateRef('myChild')
```

With the Options API, the template ref is accessible via `this.$refs`:

```js
this.$refs.myChild
```

Template refs won't be populated until after rendering. In the example above this doesn't matter, as the button can't be clicked until everything is rendered.

## Exposing child methods

Using a template ref gives us a reference to the child component instance, but that doesn't necessarily allow us to invoke its methods:

- If the child is using `<script setup>`, methods are not exposed by default. You need to use the [`defineExpose`](https://vuejs.org/api/sfc-script-setup.html#defineexpose) macro to expose any methods in the child that you want to access externally.
- If you're using an explicit `setup` function, you'll need to return the method from `setup`, even if it isn't used in the child's own template. Anything returned from `setup` will be accessible via the template ref, unless you explicitly opt out by using the [`expose`](https://vuejs.org/api/options-state.html#expose) option.
- If the child is using the Options API, any method in the child's `methods` section will be accessible via the template ref, unless you're using the [`expose`](https://vuejs.org/api/options-state.html#expose) option to opt out.

## Debugging problems

- See also [Why are my template refs not working?](template-refs)

If something isn't working, it can be helpful to use console logging to check the value of the template ref. But any logging needs to be interpreted carefully.

If you're using the Composition API, make sure you log the ref's value, not the ref itself:

```js
// This isn't reliable:
console.log(childRef)

// Do this instead:
console.log(childRef.value)
```

The problem with using `console.log(childRef)` is that the value of the ref could change after it's logged. When you expand the ref in the console you'll see the current value of the ref, not the value it had at the point it was logged. In some cases it might be useful to log both and compare them.

Similarly, with the Options API, it's better to log a specific ref, rather than the whole of `this.$refs`:

```js
// This is more reliable
console.log(this.$refs.myChild)

// But logging both is fine if you understand the problems
console.log(this.$refs)
```

Again, when you expand `this.$refs` in the console you'll see the current properties of that object, not the properties it had when it was logged.

Once you've logged the value, you should see a `Proxy` object, which is used to represent the component instance. You can dig down further into the `[[Target]]` property (and any nested proxies) to see what methods the instance exposes.

If the logged value is `undefined`, the template ref is not being populated. There are two likely causes: either the name doesn't match, or you're trying to access the ref too soon. It won't be populated until after rendering is complete.

Also check that the logged value isn't an array. If you use a template ref inside a `v-for` then the value will be wrapped in an array, even if there's only one instance of the component. You'll need to use `childRef.value[0]` or `this.$refs.myChild[0]` in that case to read out the first entry.

That array can also lead to misleading logging. Like with the earlier examples, expanding the array in the console will show the items currently in the array, which may differ from the items that were present when it was logged. The template ref will update the same array when the component re-renders, it doesn't create a new array each time.
