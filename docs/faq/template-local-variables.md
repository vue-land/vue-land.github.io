---
outline: [2, 3]
---
# Can I create a local variable in my template?

The code below has some problems. In particular, `user.roles.includes('admin')` appears three times:

```vue-html
<div
  v-for="user in users"
  class="user"
  :class="{ admin: user.roles.includes('admin') }"
>
  <span>{{ user.name }}</span>
  <button :disabled="user.roles.includes('admin')">
    Reset username
  </button>
  <span>Join date: {{ user.joinDate }}</span>
  <button :disabled="user.roles.includes('admin')">
    Ban user
  </button>
</div>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqtVE2P2jAQ/SuWe2BXggCLODSlK+22HLpSP9Tubb0HE5tg1rEj24EglP/esR0CVYFeKiVSPPP85vnNOHv8UJbJpuI4xTObGVE6ZLmrynuiRFFq41BlubFoaXSBeskwrJK11apH1GwYtwAYFo4XpaSOwwqhGRMbtBkstflIsN+EhIpUBKNMUmvbOCzTw3qPKCuESgMwMVpymwiVyYpxe9MLud4taggOJaCILam63+8jXtGCo6YBUT7aIhaVc1qhlAlLF5Kztuol8o4aoZ8cjAjMnrilG0a+P+o/aTgag4On6CBlDaHPEPmPch5p9O+MkNkQzIav2bBrAe5jZzOtliIPzYL27j2U4EwXpZDcfC+d0Aq6AaojJ8FUSr19CjFnKt4/xLMVz97OxNe29jGCfxgwy2w4wV3OUZNzF9PzX994Dd9dstCskoC+kgT7tay8xgh7rBQD2Se4oPZLGFKh8mc7rx1X9nAoL9Qjm4AnGGb805WjH+VOkknYR1QDLh7nHSx88YluSxiLoO2B0eJEWGimz7yASN9Igl+PnrWjEXfejcZ3BB91niH/qqXcXWAHq7ihTntbIGUdXS6vFnv/j2JzI7KztS5xPmtGQV3r2Cs4Zt3Oz3JmLTiWhKsfCi1o9pYbDW1M0TvO+YcQ1AZOMDCUicqmaFrWbbge2BVlepuicVmHdwKvyRf0ZtRH7ZNMbwMcbhOM/S5FS8kjQQHt9D+S8ahlLCljMCVdBMQSlYTu/C0v15J1mHACf4cjbiuYWwHN9JQnYNq7HVCx/sCIfOVSRCunIxY3vwEGRsRh).

Ideally there'd be a directive to handle this for us. Maybe something like:

```vue-html
<!-- This doesn't exist -->
<div v-const="isAdmin = user.roles.includes('admin')">
```

Sadly, that isn't currently a thing.

If we just want to reduce the length of the property paths, we could use destructuring on the `v-for`. For example:

```vue-html
<div v-for="{ name, joinDate, roles } in users">
```

This would then allow us to use just `roles` instead of `user.roles`. But it doesn't help with avoiding the repeated calls to `includes()`.

## `computed()`

If we weren't inside a loop then we could just use `computed()`:

```js
const isAdmin = computed(() => user.roles.includes('admin'))
```

But that doesn't work in our example because of the `v-for`.

An alternative might be to create a helper function:

```js
const isAdmin = (user) => user.roles.includes('admin')
```

We could then use `isAdmin(user)` in our template.

See it on the [SFC Playground](https://play.vuejs.org/#eNqlVE1v4jAQ/Ssj74FWKqEt4rBZQKK7HLbSfmi3t7oHE5tg6tiR7fAhxH/fsRMC1VL2sFIixTPPb57fjLMjk7JMVpUgKRm6zMrSgxO+KsdUy6I01kPlhHUwt6aATtKLq2TpjO5QTXVmtPMg3YQXUsMIrkL+GkbjuC2xRgmXSJ2pigt31WEB1rmmetiri2EZXHhRlIp5gSuAIZcrWHXnxo4oCSyAzLEsJZAp5lwTx2V6WO8gUqcHKY2OPSWRE1ldyfR4t6t1aVYI2O9RRYg2iFnlvdGQcunYTAmOtG/YWi6AXwJNilSBqdnfqwneFHw0KJ7j0VI41F5i6AtG/qf+A6stOVN52EP/8GvYa10lN8Q77NRc5rFz2OtdgFKSmaKUStgfpZfYSUpQZs1JCVPKrB9jzNtK3Bzi2UJkr2fiS7cJMUp+WnTHrgQlbc4zmwtfp6e/v4sNfrfJwvBKIfpCEv02qgoaa9hDpTnKPsFFtV/jxEqdP7npxgvtDocKQgNyH/GU4MB/vnD0o9x+0o/7qN6ji8fhRwufQ6LdEucgaptwVpwIi1cgZJ5RZGgmJS9Hz5pZqHfe397dU3LUeYb8m1Fq+w47WiUs8ybYginn2Xx+sdjHfxSbWpmdrfUe55PhDNU1jr2gY85vwx8gcw4dS+JtjoVmLHvNrcE2pvBBCPEpBo3FE3Qt47JyKQzKTRPedN2CcbNO4a7cxLePr81n7Or2BponGVxHOF4fHPttCnMlaoIC2xn+DXe3DWPJOMcpaSMoluokdudveblRvMXEE4RLW+PWkvsF0gxOeSKmucwRVdfvWpkvfAqs8qbGkv0fSFPISg==).

But we still need to call it three times, with the overhead of an `includes()` call.

### Compute the whole array

Rather than trying to use a separate `computed()` for each user, we could use `computed()` to reshape our data, so that it's in the form we need.

```js
const improvedUsers = computed(() => {
  return users.map((user) => {
    return {
      ...user,
      isAdmin: user.roles.includes('admin')
    }
  })
})
```

This adds the `isAdmin` property to each item in our data. We can then iterate over this new array with `v-for`.

See it on the [SFC Playground](https://play.vuejs.org/#eNqlVEtPGzEQ/isj95AgkQ0Pceg2IEHLoUh9qKUnloOzdjYGr23Z3hAU5b93/MgG1JAekLLKzsznb755eFfk0phi0XFSkomrrTAeHPeduaiUaI22HlZQ69Z0njNYw8zqFgaIH/TxznHrcqAYR6t4cFoholK1Vs4DIq1ecPYnQs97wuHwAM4vYFUpAItZrUpsRUvNcBhet/EekS2AoigC5HBjC3fJWqHKyFFYLbkrhKplx7gbDmiIDQ4SeB3+1miEZzJOhWPJaHjeGkk9RwtgwsQCFqOZtucVCbQg1OtqKgK1pM7lOJrlxl5BzJn1ZHWYmkRqJHeGqovVKsUVbTms1ygmeDNi2nmvFZRMODqVnOUsG7KeCuAXx7FFpkCUj4/T+Vf5bjSKYFhgCZvUD+j6gp53pL+iaXQ7Ek/G2ER8m4z71pJD4h2uxkw0cVVw+eJUKxI2Q0hufxgvcHUqgioTZ0WolPrpJvq87XieO56Z8/pxh//BLYOvIj8tNscueEX6mKe24T6Fr39/50t874OtZp1E9J4gtlvLLmhMsKtOMZT9AhfVfo1XRKjm1l0vPVduU1QQGncw4iuCN+rzntK3ck+L03gOVxe7uL1t2MK7EOiPxDWI2i4ZbV8IixcjRO5QZBrj/bZneRXSyZOj45OKbHXuIP+mpXx+gx1bxS31OrQFQ87T2Wxvso//SXZtRb0z11uct5pRVJc7do8dc/45fBdq57Bj8fuREk1p/dhYjWMs4QPn/FN0aosVjCxlonMlnJlldi9Hbk6Zfirh2Czjc4qPbaZ0eHQI+VecHUQ43h5c++cSZpInghbHGT4Mx0eZ0VDGcEt6D4qtVBGn86+8RkvWY2IF4c4m3JNgfo40Zy95Iibf5YhK+UdWNHNfAu28Tliy/gtdSPi5)

### Introduce a component

Whenever you find yourself using `v-for` around some non-trivial content, it's worth considering whether you should extract a separate component for that section. One advantage of extracting a component is that you can use `computed()` inside that component, something like this:

```js
import { computed } from 'vue'

const props = defineProps({
  user: Object
})

const isAdmin = computed(() => props.user.roles.includes('admin'))
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqdVFFP2zAQ/itW9tBWoikM8bCsRYLBw5A20MaeCA9ufE1dHNuynVJU5b/vbIekG6WTJrVSfffd951933WbXGidrmtIsmRqC8O1IxZcrc9zySutjCO/LJgrcJQLSxZGVWSQTnZivnjQgWtM9LBwSldWSURMJ5EfmfHgoNKCOsATIdNdjfV4ocwsT3wx4TJS5gnJ/I82jscJVk4nHU1ylDhbKLngZRDE+2w9dZ4UqtJcgLnVjiuJTBkJGZ+jQqjnmxBzpoaj13ixhOJpT3xlNz6WJ3cGsI015EmXc9SU4GL6+ud32ODvLlkpVgtEH0j+AKtE7XuMsMtaMmx7Bxe6/Roemsvy3l5vHEj7einfqEc2AZ8nOJcvB67et3uanoa6XDb4in+N9n1fbIl/2doBI0078WiFXOIcrCPaKG3JjDBYcAl3/jQM8n6CGbmdr6BwKDrqS7i9YBXOfNZxD4cjMjuPXKkvTI0SYFMuC1EzsMMB9RWDEbIcchjja1IIam3voOz1vCWBI+vkmzwJVVhnNZXn223oOZW0AtI0qOOjLWJeO6ckyRi3dC6AIWHL07EQgsOFuB2eo62cxNI/pG4U6jNsG0fVqq4wdIWR/1O+pHGF9mhOJ/gqb9aoX1qc/YPHdZ4JvQdzXjBa7TgzzMRnHtClsYHHfmna/mPlx+OTj3nSG3UP+TclxMs77LgrYKhTfi8wZR1dLA6KffqH2LXhxV6t9zjvFaPYXbsyj/hi1r14SxbW4osFk0ahOS2eSqNwjzPyAQA+h6AyeIOxoYzXNiNnetOGN2O7pEw9Z+REb8L3FL+mnNPh8RFpP+nZKMBx5Diwl4wsBESCCvfZe/jkuGXUlDH8m+gi2Gwu0zCdt+2VSrAOE27gjRZxz5y5JdKc7fIETGvAgIr6Y8PLpcsIrZ2K2KT5DYEQGu0=).

## The `v-for` hack

Even without a dedicated directive, there are already a couple of ways to introduce a local variable within a Vue template.

One way to do it is with `v-for`. We can exploit that to introduce the local variable we need:

```vue-html
<div v-for="isAdmin in [user.roles.includes('admin')]">
```

We're creating a temporary array with a single item, then iterating over that array to get the value we need for `isAdmin`.

See it on the [SFC Playground](https://play.vuejs.org/#eNqdVE2P2jAQ/SuWe2BXWgIs4tCUrsS2HLpSP9TuDXMwsQlmHTuyHT6E+O8d2yFELVCpUiJlZt7MPL8Z54AnZZlsKo5TPLaZEaVDlruqfCJKFKU2DlWWG4uWRheok/SClaytVh2ixr2YAmAwHC9KSR0HC6HGQpvuUpuPBPtMJFSsR3BAAY6JTQMRdsIKgMAz87DEaMltIlQmK8btXYf6cOd+TjDKJLW2LgtmerIPKIBSdCp2bHpBN1tS9XQ4BBKJogVHxyOcwnsbzKJyTiuUMmHpQnJ2JtaqhNBPDkKFQr5Ok92L6X+0fNHAhIEcKTp1X4Prsxfovxk806jmld7jHmgbh9FrzaZl4AfsbKbVUuRhpLAEB48nONNFKSQ330sntIJxAe9YlWAqpd6+BJ8zFX84+bMVz94u+Nd2530E/zAgmdlwgpuYoybnLoanv77xHXw3wUKzSgL6RhCGoGXlOUbYc6UY0G7hAtsvYZWFyl/tdOe4sqdDeaIeeQx4guEmfLpx9DPdYTIMeUQdQcXzrQAJZz7QpITlCNwmjBYtYmG3fWQGJONs52fN6uWImY/9wSPBZ54Xin/VUu6vVAepuKFOe1kgZB1dLm82e/+PZlMjsou9rtV81YwCu1qxOShm3d5f7cxaUCwJ/4bQaEGzt9xoGGOK3nHOPwSnNnCCrqFMVDZFo3JXu3ddu6JMb1M0KHfhHcJr8gW96z+g+klG9wEOtwnWfp+ipeSxQAHj9L+KQb+uWFLGYEsaD5AlKgnT+ZteriVrMOEE/hZH3FYwt4Iyo3adgKnvdkDF/l0j8pVLEa2cjlh8/A0mMsx4).

## Using a scoped slot

The other way to introduce a local variable inside a Vue template is to use a scoped slot.

To use this approach, we need to introduce a separate component. There are various ways to write that component. For example, we might use a [functional component](https://vuejs.org/guide/extras/render-function.html#functional-components), like this:

```js
function GetValue(props, { slots }) {
  return slots?.default(props.value)
}
```

We can then use it something like:

```vue-html
<GetValue :value="user.roles.includes('admin')" v-slot="isAdmin">
  <!-- isAdmin is now available here -->
</GetValue>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqdVFtr2zAU/itCe0gDidMLfZiXdbRbGSvswlb2UvVBsWRHrSwJXdKU4P++I8lxypZ20BCDdc53vvPpXLzB58YUq8BxieeussJ45LgP5owo0RptPQqOW4dqq1s0KmbpVNw5rUZEEVUHVXmhFfrM/W8qAz8wVhs3QRvkpPYOdWO0IQohC6RWZeOHgvGaBukzuFjFwDFRHVHzWRYB6eHgeWsk9RxOCM23KdBqWmv7nuCoBQmVFRKMykTUOwqrJXeFUJUMjLuDEWWtUKMx4FbTKANwwp1HI8EpAaRgYoUqSZ3rSSLp9rxBiaFEfRTqhjiIdIaqs80maSkUbTnqOrhMtA6YRfAeSlUy4ehCcrZHQfz95NCBRBR5huhZDv8r5ZUGJQxqVKJt9jswfQLL6xVc0FzUZ3LPZ1Cn3JPZtilwnM+GfuEJ9q7SqhZNmhWYrjQFBFe6NUJy+93EsYGuge7MSjCVUj9cJZu3gU+29mrJq/s99ju3jjaCf1gomV1xggefp7bhPrsvf33ja3gfnK1mQQL6BSc0QcsQNWbYRVAMZD/BJbVf0o4I1Vy7y7Xnym0vFYVGZJfwBMOKfXzh6ju5J8VJioN1gCru1g1KeBMdQ0gajqTtnNH2ibA0+NFzAyJzb293NeuHI0ceHx4dE7zTuYf8q5by8Rl2KBW31OtYFnA5T+v6xWRv/5Ps0opqb67nOK81o6Cur9gtVMz5x7j3lXNQsSJ9IlKiBa3uG6uhjSV6wzl/l4zawg2mljIRXIlOzbo3r6duSZl+KNGRWafnBB7bLOjB4QT1/+J0nOCwTTD2jyWqJc8ELbQzfiqODntGQxmDKRksIJaoInXnX3mNlmzApBvELc64B8H8EmhOn/IkTL/bCZXzT61olr5ENHidsbj7A3K37M4=).
