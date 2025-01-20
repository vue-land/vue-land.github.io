# Is `emit` synchronous?

:::tip TLDR
Events are synchronous, prop updates are not.
:::

## Events and listeners

Emitting a [component event](https://vuejs.org/guide/components/events.html) is synchronous. Any listeners will be called immediately, before any code that follows the `emit` call.

For example:

```js
emit('close')
console.log('event emitted')
```

Any listeners for this event will run before the console logging occurs. Here's a Playground to demonstrate that:

- [Playground](https://play.vuejs.org/#eNqFUs1O8zAQfJWVLykSSg7fd0IFAVUPIPEj4IY5pM6mGBzbsjelCPXdWTttKaKCm3dn7J31zIc4875c9CiOxDiqoD1BROr9ibS68y4QXL1PnrVpoA2ug6Ks1nW6VEgrbdtbRdpZcHZiXMTRAXxIC6Ccjc5gadx8VKiEAC7QEgRUqBfYwOwdfB24VRxIu5J2XA0KeDYXhJ03NSFXAOONitP80rEU62lSQMWMcbVDF4eCIo9v9bx8ic7yblmRFMp1XhsMNz4pjlIcDVoTVhvj3i5zj0KPh5u+ekb1uqf/EpepJ8VtwIhhwVK2GNVhjjTA0/trXPJ5C3au6Q2zfwHvkL+uTxoH2nlvG5a9w8tqL7JD2s4f4nRJaONmqSQ0MVeZLwV7Nfll9S+5/8r/+R77wb+4Y/WefCSDCbDTBMfQYKstTrmIo8fB7uKJbf2Wj/OeKPmm1evelMywdYFjwq+kSEA+rcMzNL7R65YwbNl/BGiWZ6f88PScnx01UmQSwJCpxK+GCz+ytfoEB8kWsg==)

The same applies if you're using `$emit` to emit the event.

`v-model` and `defineModel` are implemented using component events. Assigning a value to the ref created by `defineModel` will synchronously emit the corresponding event. The listener created by `v-model` will also update the parent data synchronously.

Here's a Playground showing this synchronicity with `v-model`:

- [Playground](https://play.vuejs.org/#eNp9U01v2zAM/SuELnHRzB6wnYJ02Br00AHdhm3ALr64Mh2rlSVBH0mKwP99lPyxdClyk8THx0fy6ci+GJPvArIVWztuhfHg0AfzqVSiM9p6OALXnQke6yVYbKCHxuoOFpS0mEEPL5tWyHoM5cV4j8wEKhXXynkwlUXlNzooDzeRLHt/FaNFAX8QgkOo5mLQokVwGvYIvFKkCgEPFffyJSXsW1TgW0ozdeURNOfBOtgL31JWhyD1divUdqrNx6oTf3YsFcAWfXYF6QgkyAerTlXmu0oGjNF+GYVCHE6WHuesSK8l5lQvWyQxVHUkWVB7EXNGSUJm6v8oFO6H2AoWcH2emij7UvV0WBfDzmhbdPHYGUmzoBvAelrJ7l2na5Q3JUsjKBkUBFgXJ2i2ZN6RiEZs8yenFZkhNRdTOiMk2u/GCxJZstXUdskqKfX+a3rzNiANaHjnLfLnN96f3CG+leyHRYd2hyWbY76ytIohfPfrGx7oPAdJf5CEvhD8iTTAEDUOsNugapJ9gktq75NbaT+/3d3Bo3JTU1HotOaIJt9uLrT+T+6H/OO0D5riie3f+FCDEdM2aP81NkLhQ7xl6Rc0QfFYCrS6Dd5rtZGCP0/2fOWRR2w0/Q7sxGixRDr44/r6DF41Hu2MJq0XfHM8jgp7wpGNHpMU+MyjGDLRK3ElSzkA94pb7MioKacYks5s1v8FT+OElw==)

But while events are synchronous, prop updates are not, which can make it appear as though the event is deferred in some way.

## Prop updates

A component's props are updated when its parent re-renders.

While the event and data update shown above are synchronous, the rendering update is not. Rendering updates are batched (using a microtask), meaning that they don't occur synchronously when reactive data is modified.

Consider this code for parent and child components:

::: code-group

```vue [App.vue]
<script setup>
import { ref } from 'vue'
import MyChild from './MyChild.vue'

const parentCount = ref(0)

function onIncrement() {
  parentCount.value++
  console.log('parent count is now ' + parentCount.value)
}
</script>

<template>
  <MyChild :count="parentCount" @increment="onIncrement" />
</template>
```

```vue{6-7} [MyChild.vue]
<script setup>
const props = defineProps({ count: Number })
const emit = defineEmits(['increment'])

function onButtonClick() {
  emit('increment')
  console.log('props.count: ' + props.count)
}
</script>

<template>
  {{ count }}
  <button @click="onButtonClick">
    Increment
  </button>
</template>
```
:::

- [Playground - Complete example](https://play.vuejs.org/#eNqFUstu2zAQ/JUFL1LgQCrQngynSGP4kAJNg7a3sgdFXjlMKJLgw3Eh6N+zpCRbSILkpt2ZHc1yp2PfjCn2AdmSrVxthfHg0AfzlSvRGm09dGCxgR4aq1vIiJodoR//1/dCbkeoKMc66hGJq1or58FUFpVf66A8XESx/NNZRJugai+0Aq2uVW2xJVZ+Bh1XMJ8p9pUMuFjEdhTUEgupd3k2cKgXhYUDpZ8gg8XrWfpbz9WqHPajzajw2BpZeaQKYDUtskxiF5zNNDiDSzH5I2jmlqCSBFblTI2dM+/IZyN2xYPTih42bcRZrVsjJNqfJm7tOFsOu0asklI/fU89bwOeT/36HuvHN/oP7hB7nN1adGj3yNkR85XdIXmL8Ob3DR7o+wi2ehsksd8BfyG9cYgeB9pVUFuyPeMlt9cpA0Lt/rjNwaNy01LRaGT2ic8ZpWH9zuonu5+LL2mOzkWvOAvTG+Eco2W1cRSqLTZC4W2s8m5IxBJuQnuHFno6/8DGVsQEDuQNFS7/mx1Pm/17mcqr4L1WaynqxymXUSKfzdDIy1RGE8VoIcXx1PgwiN1oHnriUS7vkgO4rKOHlL2ZJ87SDMApj3GmHIZe5bJ/BpPnWps=)

In particular, note these two lines in the child:

```js
emit('increment')
console.log('props.count: ' + props.count)
```

The first line emits an event and the listener in the parent updates `parentCount`. All synchronous. Modifying the reactive data triggers the re-rendering of the parent component, but that doesn't happen immediately, it just gets added to a queue. That queue won't be processed until other code has finished, so `props.count` won't be updated yet and the console logging will show the old value.

If you need to use the new value of the prop, you can wait using [`nextTick`](https://vuejs.org/api/general.html#nexttick):

```js
emit('increment')
await nextTick()
console.log('props.count: ' + props.count)
```

The promise returned by `nextTick` will resolve after rendering is complete, so the props will all be updated to their new values.

- [See it in a Playground](https://play.vuejs.org/#eNqFUstu2zAQ/JUFL1LgQC7QngynSGP4kAJNgza3sgdFXjlMKJLgw3Yg6N+7pCRbbQrn5t2ZHc9Q07IvxhS7gGzBlq6ywnhw6IP5zJVojLYeWrBYQwe11Q1kRM2O0LfX1ZOQmwEq5sMc9YjEVaWV82BKi8qvdFAerqJY/uEionVQlRdagVa3qrLYECu/gJYrmN4Uu1IGnM3iOgpqiYXU2zzrObSLwsKB0nvIYPb2lv6t42o57/NRMho8NkaWHmkCWI5BFknsirOJBmdwLUZ/BE3cEjQngeV8osYumXfksxbb4tlpRQ+bEnFW6cYIifa7iakdZ4s+a8RKKfX+a9p5G/By3FdPWL38Z//sDnHH2b1Fh3aHnB0xX9otkrcIr3/e4YF+H8FGb4Ik9hnwB9Ibh+ixp90EtSHbE15ye5s6INT2wa0PHpUbQ0WjkdklPmfUhtWZ6Ce7H4tP6Y4+F73ipEznyqkowoOoXv5p6FA9q42j0m2wFgrv45S3fWMWcBeaR7TQUT16NjYiNrQnr2lw+a/s+Omz36m1pXtVFUy6exO812olycPY3iiUTy7pEKDclyQ/2s3T7u8+R3vFYC4V+bR4t8LtEAs64lGjH5MruK6ir9TaiU/O0g3AqcnxZt4fvWl09we4t29N)

Alternatively, you may be able to use a [watcher](https://vuejs.org/guide/essentials/watchers.html) on the prop to react when the prop's value changes, but that will be triggered by all changes to the prop's value, not just changes resulting from the `emit` call.

## `v-model`/`defineModel` updates

We see the same thing with `v-model` and `defineModel`:

```js
const model = defineModel()
model.value = 7
console.log(model.value)
```

While you might expect this to log `7`, it'll actually log the old value of the prop, assuming one exists. In cases where the parent doesn't use `v-model` (or equivalent), `defineModel` will fallback to 'local mode', where it manages the value itself. In that case it will update immediately.

Here are some Playgrounds that demonstrate this:

- [Playground - with `v-model`, delayed update](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6RIZw/YTkE6bA166IBuw7ajLq5Cp2plSZCoLIPhfx8lJ5mLtrmJfO+RjyJ78cX7apdQLMUqqqA9QURK/pO0uvMuEPQQsIUB2uA6mDF1doLu/q4ftNkcoKo+xLkek6RVzkYC3wS0tHbJElzlYvP3F9Ku6rEdN+KAsPOmIeQIYHWsu3vXuQ2aKykmNaSAmmmreqIRl4Iid2v1tnqMzvI0fa4khXKd1wbDd0+a3UixhIJkrDHG/flachQSXh7z6gHV0yv5x7jPOSl+BIwYdijFCaMmbJG9Zfjm1zfc8/sE8hTJMPsM+BOjMyl7HGnXyW7Y9oRX3N6Wj9d2+zve7AltPA6VjWbmUPhS8ArWZ0b/b/dD9bHopB34FycbfOUixn2WnfAmN9hqi3c5mvNCpW2TVbkVOHudiJxdG62e5hdj2yx2BivjtvPZPbYuIGCnaQkzWIxFq11jEnItmMaLxQt50xKGN9U8y5nr6vvDBAPz+Njui1X4rLJZPrVn5qUoGoBbqwJ2fINFU4+iF2c4/ANY1iA0)
- [Playground - local mode, immediate update](https://play.vuejs.org/#eNp9UstOwzAQ/JWVLy0qSpDgVBUEVBxA4iHg6EtwN8Xg2JG9LkVR/p21Q6EI6M2zM2PPrrcTZ21brCKKqZgF5XVLEJBieyKtblrnCa7f58/aLKD2roFRUX7iZBpJOysHF+sZEDatqQgZAcw2zpLhrNzixL6goJyt9bJ4Cc7y411ySKFc02qD/rYl7WyQYgqZSVxljHu7yjXyEfc3dfWM6vWP+ktYp5oUdx4D+hVK8cVR5ZdIA33xcINrPn+RjVtEw+od5D0GZ2LKOMjOo11w7C1dTnuZR6jt8jFcrAlt2DSVgiZln/VS8DDnO1r/jntYHGWftD1Pcesv/vhAnnAg4MBo4BgWWGuL1wmNu4SqaGgKB9Dvpb+ro1XpYXD2PBI5OzdavY73hhDpKmewMG45Hj1h7TwCNpr9I5gMTxSrykTku2AbTya/7FVN6P91c2c7dqrrPvvpWccr9pSjwqlKYY+l+BFeiuwBuLTKY4OWsqccTL+Wsv8AdKsIBg==)

While it may appear unintuitive that the `model.value` property doesn't update synchronously, it's important to keep the underlying mechanism in mind when working with `defineModel`/`v-model`. It's a shorthand for working with a prop/event pair and props don't update synchronously.

While `defineModel` *could* be implemented to always update the child's local ref synchronously, that leads to other problems. The child is not the owner of the data, it's being passed in by the parent. When the child emits an event, it's asking the parent to update the prop to some new value. It's for the parent to decide how to react to that event. It might choose to reject the update, or to use a different value. In general, the child shouldn't assume that the value it emits will be respected by the parent.

As with other props, we could use `nextTick` or a watcher to wait for the model to update.
