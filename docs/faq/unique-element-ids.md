# How do I create unique element ids with Vue?

The `id` attribute for an element needs to be unique across the entire page. Hardcoding an element `id` within a component could lead to clashes, and will make it difficult to reuse that component. It's also rarely necessary, as styling should use classes instead.

But there are legitimate use cases for an `id`, such as ARIA attributes or tying together a `<label>` and `<input>`. In those scenarios you would need to generate a dynamic value for the `id`.

## Using a counter

In many cases, it's sufficient to use a simple counter to generate a suitable `id`.

Put something like this in a `.js` file:

```js
let count = 0

export function newId(prefix = 'id-') {
  return `${prefix}${++count}`
}
```

You can then use it in your components like this:

```vue
<script setup>
// Update the path to match the file you created
import { newId } from '@/utils/id.js'

const id = newId()
</script>
```

See it on the [SFC Playground](https://play.vuejs.org/#eNqVU99P2zAQ/ldOFlJhpQ0T2ksWKm2MSeyBIeAxD2TxpTU4tmU7bVGU/31nuy1Fgk6LFMm+++7X95179s2Y6bJDlrPC1VYYDw59Z2alEq3R1sMDrv1PgZJDY3ULo2m2s4TAUamKLEVSDF08tkZWHukGUIREQN+lFPUzaAUVyOoPSvAaGl13DvwCQSjT+YjPUkDBxRJqWTl3UbKVrUzJNomK135iIvLfVC2WDLKPEXda/gPxA9MMQqsdsMioCzoV2d5MdHX+RSK4WhvkZJmG/qAPEVw4wr3kNJAUCieNxPXX4AiHCRcW61Ahh1rLrlXkGkLGlGEGn2BMf8zUVnYu1MRrk8MXE5IQkogOpWfslL3R4GPxelC4uuYw7MQTfPrkSLRScWyox1urjTuONSMXOdx7K9ScCp4EVK2V8yA4XKRUx2Q9JHiiLLKchM4bbYlgwUnCvt+oPwxFFk9bbNwAyAXfQv9DgLArb+nf8B7JTQWjP5hz+BwVMRXnNObEivnCk/HsHZIjV0SuRE+KdcoTCWchJ64ju02nop4bZowlRteEGQk+GZ2kmpYEsQoej/rkHo768TgmGx6pHlXxNIhqxJxqaUXVYljJat0aIdH+jkvpSpanhMFXSalXv6LN2w5Pt/Z6gfXzO/Yntw62kt1adGiX9Bh2Pk+bhj65r+5vaK/2nK3mXXg6B5x36GiZ08MJsO+d4tT2Hi52ex0Xkhh/cFdrj8pthwqNBuQQ8SWjfb48MPpru+fT8xgXWBz+AnDCnEI=).

An element `id` beginning with a digit [can cause problems](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id), so we put a prefix before the count.

## Using `useId()`

The simple counter outlined above is typically sufficient for client-side applications, but it doesn't work well with SSR (server-side rendering).

With SSR, the `id` attributes in the server-generated HTML need to match the equivalent client-side attributes. There are several reasons this is difficult, but the two biggest problems are:

1. If the counter is global on the server, it will be shared between requests. It needs to be scoped to the application instance instead, to ensure it starts back at 0 when a new request comes in.
2. The calls to the counter must happen in exactly the same order on both the server and client. While this is usually the case, it breaks down for async components.

Vue 3.5 introduced the [`useId()` helper](https://vuejs.org/api/composition-api-helpers.html#useid), which aims to solve this problem. Prior to that, Nuxt and Quasar both implemented their own `useId()` helpers. The approaches they took were very different, so it can be interesting to compare those alternatives:

* The Quasar [`useId()` helper](https://quasar.dev/vue-composables/use-id) returns a ref. That ref initially has a value of `null`. The value is only changed to a meaningful ID on the client-side after hydration has completed. Vue won't render attributes with `null` values, so any attribute bound to the ref won't be rendered until after hydration.
* The Nuxt [`useId()` helper](https://nuxt.com/docs/api/composables/use-id) is now just an alias for Vue's own `useId()`, but prior to Vue 3.5 it took a very different approach. Nuxt would generate an ID on the server and then pass that to the client using a special `data-n-ids` attribute in the generated HTML. This could then be checked immediately prior to hydration, allowing the client to use the same ID. A major downside of this approach was that it relied on having a suitable element node to hold the `data-n-ids` attribute.

If you're using Vue 3.5+ then you'll likely want to use the built-in `useId()` helper to generate `id` attributes for SSR. It uses multiple counters, taking account of the component tree and the positions of async components. These counters are concatenated to generate the final value.

```vue
<script setup>
import { useId } from 'vue'

const id = useId()
</script>
```

See it on the [SFC Playground](https://play.vuejs.org/#__SSR__eNqVUlFP2zAQ/isnv8A2mmxCe8lCpY0xiT0wBDzmJbMvrcGxLdspRVH++852W4oEnahUKb777ru777uRfbe2WA3IKlZ77qQN4DEMdt5o2VvjAtzhOvySqAR0zvRwVJS7SCw8anRd5kqqoUfA3qo2IL0A6kgE9DtXkj+A0dCCav+igmCgM3zwEJYIUtshJHyZC2ohV8BV6/1Zwx5daxu2Iaqf50lElL9qe2wYlG8jboz6D+In5h2k0TtgXdIU9FWXezvR04cnheC5sSgoUsT5YIwVQnrCPVW0kJIaZ53C9beYiB8zIR3y2KECbtTQa0pNkTEzzOEjfKJ/Yupbt5B6Foyt4KuNJIQkoWPrOTthLzx427wRBo+XAqaNedmwRgvsaL5rZ6w/Tv2SDhXcBif1gpp9iChutA8gBZxlmmOKHjI7y5UUziZXnXEkrhRk3zhunJ+mukxfW2xyHyopttB3iB/v5KX0G82TsLlhysdwBV+SG7YVgtacOblYBgp+fkXgQC10JxfFvTeaBE4kDeOmt1Kh+5NOxTesyvQx1yplHn+nWHADnmzjfIn84ZX4vV/HWMOuHXp0KzrRXS6Q/xhy+uL2itzeS/ZGDPGgDyRv0NOJ5XOOsB+DFjT2Hi5Ne5nOhLS48xfrgNpvl4qDRuSU8A2jwzk/sPrzuKfFaaojPdn0D59zeDo=).

## Other types of ID

The `useId()` helper is only intended to solve the problem of generating attribute values, as described above. It is not a general-purpose way of generating IDs for other uses. For example, if you need to generate unique IDs for use in your data, then `useId()` likely isn't what you want. In many cases you'll be able to use the counter approach [described earlier](#using-a-counter). If you want a UUID instead then consider using the native [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) method or the [`uuid` package](https://www.npmjs.com/package/uuid) available on npm.
