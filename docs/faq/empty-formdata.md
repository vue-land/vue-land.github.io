# Why is my `FormData` empty?

## The problem

Let's imagine you've created a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object:

```js
const formData = new FormData()
formData.append('product', 'id-1234')
```

The specifics don't matter too much, but clearly `formData` should not be empty, it should contain an entry for `product`.

If you try to check the contents of `formData` in the console:

```js
console.log(formData)
```

You'll likely see something like this:

```
▼ FormData {}
  ▶ [[Prototype]]: FormData
```

It appears to be empty.

Using `JSON.stringify()` doesn't help either:

```js
console.log(JSON.stringify(formData))
```

Output:

```
{}
```

You could try outputting the object in a component template using <code v-pre>{{ formData }}</code>, but that still doesn't show the `product`.

## The solution

The `formData` object isn't empty, but none of the techniques we've used so far will show that.

`FormData` exposes the methods [`keys()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/keys), [`values()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/values) and [`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries) that we can use to inspect its contents. For example:

```js
console.log(Object.fromEntries(formData.entries()))
```

Now we'll get the output we wanted:

```
{product: 'id-1234'}
```

Here's a Playground example to demonstrate this in action:

- [Playground example](https://play.vuejs.org/#eNqNks1uwjAQhF/F8iUgUaMWTihF6g+VygGq0qMvabIJoYlt2RugivLutQ2BtGpRb9mZb1ez3tT0Tim2rYBOaGhinSskBrBSUy5iKQySVOryMcKI3BIBO/J0LHt9LrhoTRYpBSLpBUrLpIoxGJAgT66ub0bjwINuliyAFTLrtU3W6Mrz1XLBDOpcZHn6eaZ+YMv3DcTIUi3LmbA0mBPK4Cj0XVM4POxjN7EFQqmKCMFWhIRKw7Suz7s1TTh0mjfX+hv0V66LTf9L2RkRDjsJ6YCisUunecY2Rgp7nNpN5zSWpcoL0EuFuX0UTifEO86LikLu5l5DXcGg1eM1xB+/6BuzdxqnLxoM6C1wevIw0hngwZ6tFrC33yeztDcuLH3BfAV7sMplPGD3lUhs7A7n0z6XSmq0L/tmZnsEYdqlXFBHNp7n1P6hDxdWP8cdsbHv46KhzRf2Fvlu)

## Nope, still doesn't work

If you're still getting an empty object, then perhaps your `FormData` object really is empty.

If you're creating the `FormData` object by passing in a `<form>`, the first thing to try is appending a hardcoded dummy field, just to check that it shows up in the logging. For example:

```js
const formData = new FormData(myForm.value)

formData.append('dummy', 'foo')

console.log(Object.fromEntries(formData.entries()))
```

In the example above, `myForm` is a [template ref](https://vuejs.org/guide/essentials/template-refs.html), so we pass `myForm.value` to the `FormData` constructor.

- [Playground example](https://play.vuejs.org/#eNp9Ustu2zAQ/JUFL5IBQz60p8Ap+nKL9tAUaY68KPRKlcMXyKXjwPC/d0k6ahIE0UncmR3OzvIoPnnf7ROKC7GOKkyeICIlD7q346UUFKX4IO1kvAsER0gRb9B43RNe4wAnGIIz0LBCI620ytlIYB6+uWDg8gW7bSrQLDJ1SFbR5CyogIxn4GtPfbuAo7QAVWk4V1nL4j3MpCrU7XudsKjBTO1679Fu22abjHloltAMztUrq6rT2Gk3tle3O1TU5QE2lsKEsZ018FxYLLjxJO16VcPhKPhA55n4BLDOTRBw4LSqLSlgVaHbRMQTflR6UneMPx+1JAv8fXeFvap0Lq5XT64QS94CGx+msdtFZ3lVJSGWc8ZPGsOVz0Hypi5qdhnrtXb3P0uNQsLlY139RXX3Sn0XD7kmxe+AEcMepZgx6sOIVOHNn1944P8ZNG6bNLPfAK+RQ0/ZY6V9TnbLtp/witsf5ZFNdryJmwOhjY9DZaOZeSp8Kfi1fXlj9P9233XvSx/vUJz+AcVD/ZA=)

If we can see the dummy field in the console logging then we know the problem isn't with the logging. The `FormData` really was empty.

The `FormData` constructor will usually throw an error if you pass in an invalid value, but it allows `undefined` to be passed. Try console logging the value you're passing to `FormData`, to confirm it's an `HTMLFormElement` and not `undefined`:

```js
console.log(myForm.value) // Check it isn't undefined
const formData = new FormData(myForm.value)
```

Let's assume the form passed to the constructor isn't `undefined`, what else could be going wrong?

If possible, use the **Elements** tab in your browser developer tools to inspect the `<form>` (or inspect the logged value in the console). Check that it actually contains valid fields, such as `<input>` elements. Then:

1. Ensure each element has a `name`. This is used as the key to populate the `FormData`. An `id` isn't sufficient, it needs a `name`.
2. Check the element isn't disabled. Disabled elements will be ignored.
3. For an `<input>` with `type="checkbox"`, it will only be included if the checkbox is checked.

Reference: <https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData>
