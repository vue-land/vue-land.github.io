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

If we just want to reduce the length of the property path, we could use destructuring on the `v-for`. For example:

```vue-html
<div v-for="{ name, joinDate, roles } in users">
```

This would then allow us to use just `roles` instead of `user.roles`. But it doesn't help with avoiding the repeated calls to `includes()`.

Are repeated calls to `includes()` actually a problem? In this example, probably not. More generally, there are two problems we might be trying to solve: duplicated logic (DRY) and performance.

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

### Compute a lookup

Rather than reshaping the data to form a single array with all the values, we could instead compute a separate array that just contains the derived values. Something like:

```js
const isAdmin = computed(() =>
  users.map(user => user.roles.includes('admin'))
)
```

This would give us the array `[true, false, false]`. We can then adjust our `v-for` to give us the index with `v-for="(user, index)"`, allowing us to access `isAdmin[index]` in the template.

See it on the [SFC Playground](https://play.vuejs.org/#eNqlVE1vGyEQ/SsjerAt2et8KIdunUhJm0Mj9UNtbiEHvOA1CQsrYJ2NrP3vHWC9TlQnPVTyyjDzePN4A2zJZV1nm0aQnCxcYWXtwQnf1BdUy6o21sMWClPVjRccOlhZU8EI8aMh3zhhXZ/I5nGWPTijEUF1YbTzIN0lr6SG84FqPJ7A+UVam1WsHofRLpJZo4TLpC5Uw4Ubj1hYPZpMJlQv5kkl6sOJF1WtmBc4A1hwuYHNbGXsOSWRcApSc9FO8C+VogQKxZxDQJjjNN/NtxCr5Duxd3HpPXSURHbkdzXTF9tt0qhZJaDrUE+I9ohl473RkHPp2FIJjryv6QYygF8CjY5cgaonmCeGVxVvDMrnuMscdsUfMPQFI/8l4IolVw6UXszRSxwt5oPDZEq8w3auZBnbiwdmG6CUhJ5KJeyP2ktsNyWoM3FSwpQyTzcx5m0jprt4sRbF44H4g2tDjJKfFu2xG0HJkPPMlsKn9PXv76LF8ZCsDG8Uot9JouFGNUFjgl01mqPsF7io9ms81lKXt+669UK73aaC0IDsIp4SvAWf39n6Xu5pdhrXUd2hi/sbghbehcSwJB6EqO2Ss+qFsHghQuYORYZuUnK/96w/DGnlydHxCSV7nQfIvxmlnt9gR6uEZd4EWzDlPFut3i328R/Frq0sDtZ6i/PWcIbqesfu0THnn8N7UDiHjmXxpYiFlqx4LK3BNubwQQjxKQaNxR3MLOOycTmc1W0fbmduzbh5yuG4buN3ip8tl2x8NIX+l51NIhzvDx775xxWSiSCCtsZnofjo56xZpzjKRkiKJbqLHbnb3mlUXzAxB2EW5twT5L7NdKcveSJmP42R1SqP7OyXPscWONNwpLuDyX74Us=)

The computed data structure doesn't have to be an array. In some cases it might make more sense for it to be a mapping. For example, we might want to create a mapping structure like this:

```json
{
  "Adam": true,
  "Molly": false,
  "Eric": false
}
```

Here we're assuming that the `name` field is a unique identifier that we can use to look up the value we want.

We could create a lookup map using something like this:

```js
const isAdmin = computed(() => {
  const map = {} // or Object.create(null)

  for (const user of users) {
    map[user.name] = user.roles.includes('admin')
  }

  return map
})
```

We'd then use `isAdmin[user.name]` in the template.

See it on the [SFC Playground](https://play.vuejs.org/#eNqlVE1v2zAM/SuEdkgCNE4/0MO8tEC79bACW4ett6oHxVISpbJkSHKawvB/HyU5Toam3aGADVgk9fj4SLohV1WVrWtBcjJ1hZWVByd8XV1SLcvKWA8NFKasai84tDC3poQBxg96f+2EdZ0jm8RTtnJGYwTVhdHOg3RXvJQaLnqo4XAEF5fQUA1oCzElq9DftDCZgLFwN1uJwmeFFcyLoa6VGgU8gDk6h+lKyAVmnhiMEhgEoIdgyTQrxSNixoM1SrhM6kLVXLjhgAVCA8QEaBOwxbKtDtepbtExnSQ9UAk8eFFWCqngCWDK5RrWY6RyQUlkgcVFFpRAoZhznR2P+fbcQMyZb9XYJ9lSEoER2lVMXzZNYh280LZIJVi7iFntvdGQc+nYTAmO2K8he0CA3wI7GvGCpwOZJJR/st4aLINjkTlsCazQ9A0tHyZxzZJCB9JPJygnfk0nvcjkiHiHTZ7LRZwlnM7YXUrCAEkl7F3lJQ4BJcg1YVLClDLPt9HmbS2OtvZiKYqnA/aV2wQbJb8sSmTXgpLe55ldCJ/cN39+ig1+987S8Fph9DtOFN2oOnBMYde15kh7Ly6y/R53SOrFvbvZeKHdtqhANA5njKcEV+7rO6Xv6J5lZ91Qt6jibh1Rwofg6K/EYYjcrjgr94jFVQmeByQZOkrJ406zbiDSzdPjk1NKdjwPgP8wSr28gY5SCcu8CbKgy3k2n7+b7PN/kt1YWRzM9RbmveEM2XWKPaJizr+EP0XhHCqWxeWOiWaseFpYg23M4ZMQ4ks0GosVjC3jsnY5nFebzrwZuyXj5jmHk2oT3zN87WLGhsdH0D3Z+SiG4w7h2L/kMFciAZTYzvCrODnuECvGOU5Jb4n/rCx25zW9hVG8j4kVhM1Ncc+S+yXCnO/jxJhuo2NUyj+2crH0ObDamxRL2r/MXwcg)

The code above uses a `for`/`of` loop to create the mapping object, but there are various other ways you could write it. For example, with `map()` and `Object.fromEntries()`:

```js
const isAdmin = computed(() => Object.fromEntries(users.map(user => [
  user.name,
  user.roles.includes('admin')
])))
```

## Introduce a component

Whenever you find yourself using `v-for` around some non-trivial content, it's worth considering whether you should extract a separate component for that repeated section. You can think of repeating content with `v-for` as a form of reuse, and that makes components a natural fit.

In the case of our example, a new component can focus on just rendering a single user, without needing to worry about the loop. There are a couple of ways we might approach this in practice, making `isAdmin` either a `computed()` or a prop.

If you're specifically interested in performance, then introducing a component is a trade off. It will make the initial render slower, as there is an overhead incurred to create each component instance. But the extra components help to split up rendering into smaller pieces, so they can potentially improve the performance of rendering updates. See https://vuejs.org/guide/best-practices/performance.html#update-optimizations for more details on squeezing performance out of component updates.

### Child `computed()`

The first approach is to pass the `user` object as a prop, and then use `computed()` to derive the value we need:

```js
import { computed } from 'vue'

const props = defineProps({
  user: Object
})

const isAdmin = computed(() => props.user.roles.includes('admin'))
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqdVFFP2zAQ/itW9tBWoikM8bCsRYLBw5A20MaeCA9ufE1dHNuynVJU5b/vbIekG6WTJrVSfffd951933WbXGidrmtIsmRqC8O1IxZcrc9zySutjCO/LJgrcJQLSxZGVWSQTnZivnjQgWtM9LBwSldWSURMJ5EfmfHgoNKCOsATIdNdjfV4ocwsT3wx4TJS5gnJ/I82jscJVk4nHU1ylDhbKLngZRDE+2w9dZ4UqtJcgLnVjiuJTBkJGZ+jQqjnmxBzpoaj13ixhOJpT3xlNz6WJ3cGsI015EmXc9SU4GL6+ud32ODvLlkpVgtEH0j+AKtE7XuMsMtaMmx7Bxe6/Roemsvy3l5vHEj7einfqEc2AZ8nOJcvB67et3uanoa6XDb4in+N9n1fbIl/2doBI0078WiFXOIcrCPaKG3JjDBYcAl3/jQM8n6CGbmdr6BwKDrqS7i9YBXOfNZxD4cjMjuPXKkvTI0SYFMuC1EzsMMB9RWDEbIcchjja1IIam3voOz1vCWBI+vkmzwJVVhnNZXn223oOZW0AtI0qOOjLWJeO6ckyRi3dC6AIWHL07EQgsOFuB2eo62cxNI/pG4U6jNsG0fVqq4wdIWR/1O+pHGF9mhOJ/gqb9aoX1qc/YPHdZ4JvQdzXjBa7TgzzMRnHtClsYHHfmna/mPlx+OTj3nSG3UP+TclxMs77LgrYKhTfi8wZR1dLA6KffqH2LXhxV6t9zjvFaPYXbsyj/hi1r14SxbW4osFk0ahOS2eSqNwjzPyAQA+h6AyeIOxoYzXNiNnetOGN2O7pEw9Z+REb8L3FL+mnNPh8RFpP+nZKMBx5Diwl4wsBESCCvfZe/jkuGXUlDH8m+gi2Gwu0zCdt+2VSrAOE27gjRZxz5y5JdKc7fIETGvAgIr6Y8PLpcsIrZ2K2KT5DYEQGu0=).

### Child prop

The other way we could approach it is to introduce a prop for `isAdmin`. While we could pass `user` and `isAdmin` as props, it might be cleaner in this example to have props for `isAdmin`, `joinDate` and `name` instead:

```js
defineProps({
  isAdmin: Boolean,
  joinDate: String,
  name: String
})
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqdVE1vGyEQ/Stoe3Aixet8KIdSN1LS5NBIbaMmPWVzwAu7xmEBAesPWf7vHWAXu43jSpVsycy8efNg3nidXWudz1uW4WxsS8O1Q5a5Vl8VkjdaGYd+WWZumSNcWFQZ1aBBPtqJ+eJBAreQ2MLCKZ9ZJQExHkV+YIaDY40WxDE4ITTe4fNnhObDSpnPReYZEJeRt8hiEnM7JLThsgPkRglmcy5L0VJmjwYhOThO+JnickihW1/gA7dwTghJmpT0v2NiBOrGoyQ1O8mcLZWseB0uBW+29rAiK1WjuWDmh3ZcSRCKUcj4HBFCLe5DzJmWnfTxcsrK1z3xmV36WJE9GAZy5qAl5RwxNXMxfff4nS3hd0o2irYC0AeSP5lVovUaI+ymlRRk7+CC2q9hmFzWT/Zu6Zi0/aW8UI/cBHyRwey/HLj6Vu5FfhHqCrmBV/zLPnu8R1nFJXswStujQMfttR8qRjcKhk1kENCPEaNHZ0BuCPrx9QFod3zYeZTPUSmItd30iwzh/rxGwUi4bw7ys1AFdVYTebVeh25os4EWPtAlJ61zSiJMuSUTwShwdRSJACGYBYsLEwwXK0ex9I8u93BL5N0LL7tOd/6/pjck7tKeduMRvMUbw29XGKb07HFpunFPvI2uKWl2PBTW0WeewU9RwMvW3mn1fOX56dl53LVoqT3k35QQq3fYwdXMEKe8gyFlHamqg80+/qPZneHl3l7vcT4pSkBdZ+4XeDHrVv7fqLQWXiwPf2Ch0YSUr7VRsHEYfWCMfQpBZeAGQ0Moby1Gl3rZhZdDOyVULTA608vwvYCvqSfk6PQEdZ/88jjAYeQwsBVGlWCRoIHN8849O+0YNaEUFiJFQGwh8zCdt/JqJWjChBt4o0XcglM3BZrLXZ6A6QwYULH/0PB66jAirVMRm21+A+L8G8E=).

The value of `isAdmin` is calculated in the parent template. That calculation will be repeated each time the parent component re-renders. However, it only happens once per iteration (rather than 3 times), and the children won't be re-rendered unless one of the props changes.

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

Alternatively, we could use the attribute name as the variable name, allowing for multiple variables to be introduced at the same time:

```js
function GetValue(props, { slots }) {
  return slots?.default(props)
}
```

With:

```vue-html
<GetValue :isAdmin="user.roles.includes('admin')" v-slot="{ isAdmin }">
  <!-- isAdmin is now available here -->
</GetValue>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqdVF1r2zAU/SsX7SENJE670od5WUe7lbHCPtjKXqo+KJacqJUlI8lpivF/35XkOGFLOxjYYN177rlH98MtuajrbN0IkpO5K6ysPTjhm/qcalnVxnponLAOSmsqGGWzeMrundEjqqkuG114aTR8Ev4XU404qq2p3QRacMp4B90YWqoBLJJanYzvMy5K1iifwGOqO6rns5QeE+PBi6pWzAs8Acy35LCelsa+oySoAKmTNkogl+6CV1L3rswaJVwmdaEaLtzRiAXnaIzI9TRIQFwLfQx0lMQ0mIjLNRSKOdcTBertuYXIkh+Iw0hXM33etlFRplkloOvwSsE6YBaN91iqnEvHFkpwJO259pgAfgjsQCQKPEP0LIX/kfLaoBKOlcphm/0eTR/R8v8KLlkq7TO55zOsU+rMbNsaPM5nQ9fIhHhXGF3KZZwVnK44BZQUpqqlEvZbHcYGe4e6EyslTCnzeB1t3jZisrUXK1E8HLDfu02wUfLdYsnsWlAy+DyzS+GT++rnV7HB78FZGd4oRL/gxCYY1QSNCXbZaI6y93BR7ee4I1Ivb9zVxgvttpcKQgOyi3hKcMU+vHD1ndzT7DTG4VJgFXfrhiW8DY4hJA5H1HbBWbUnLA5/8NyiyNTbu13N+uFIka+PT15TstN5gPyLUerpGXYslbDMm1AWdDnPyvLFZG/+kezKyuJgruc4bwxnqK6v2B1WzPmnsPuFc1ixLP4oYqIFKx6W1mAbc3glhHgbjcbiDaaWcdm4HM7qTW/eTN2KcfOYw0m9ie8pvna5YEfHE+if7Gwc4bhNOPZPOZRKJIIK2xl+FSfHPWPNOMcpGSwoluosdudveUuj+ICJNwhbnHCPkvsV0pzt80RMv9sRlfJPrVyufA6s8SZhSfcbSgvsYw==)
