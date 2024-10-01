# How do I create unique element ids with Vue?

The `id` attribute for an element needs to be unique across the entire page. Hardcoding an element `id` within a component could lead to clashes, and will make it difficult to reuse that component. It's also rarely necessary, as styling should use classes instead.

But there are legitimate use cases for an `id`, such as ARIA attributes or tying together a `<label>` and `<input>`. In those scenarios you would need to generate a dynamic value for the `id`.

While it is possible to use a library to generate a UUID or native [Crypto.randomUUID()](https://github.com/vue-land/vue-land.github.io/blob/main/docs/faq/unique-element-ids.md) available in modern browsers, that is usually unnecessary. A counter is usually sufficient.

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

## `useId()` helper

Vue 3.5 introduced [useId() helper](https://vuejs.org/api/composition-api-helpers.html#useid) that allows you to creating unique identifiers even in SSR applications

```vue
<script setup>
import { useId } from 'vue'

const id = newId()
</script>
```

See it on the [SFC Playground]([https://play.vuejs.org/#eNqVU99P2zAQ/ldOFlJhpQ0T2ksWKm2MSeyBIeAxD2TxpTU4tmU7bVGU/31nuy1Fgk6LFMm+++7X95179s2Y6bJDlrPC1VYYDw59Z2alEq3R1sMDrv1PgZJDY3ULo2m2s4TAUamKLEVSDF08tkZWHukGUIREQN+lFPUzaAUVyOoPSvAaGl13DvwCQSjT+YjPUkDBxRJqWTl3UbKVrUzJNomK135iIvLfVC2WDLKPEXda/gPxA9MMQqsdsMioCzoV2d5MdHX+RSK4WhvkZJmG/qAPEVw4wr3kNJAUCieNxPXX4AiHCRcW61Ahh1rLrlXkGkLGlGEGn2BMf8zUVnYu1MRrk8MXE5IQkogOpWfslL3R4GPxelC4uuYw7MQTfPrkSLRScWyox1urjTuONSMXOdx7K9ScCp4EVK2V8yA4XKRUx2Q9JHiiLLKchM4bbYlgwUnCvt+oPwxFFk9bbNwAyAXfQv9DgLArb+nf8B7JTQWjP5hz+BwVMRXnNObEivnCk/HsHZIjV0SuRE+KdcoTCWchJ64ju02nop4bZowlRteEGQk+GZ2kmpYEsQoej/rkHo768TgmGx6pHlXxNIhqxJxqaUXVYljJat0aIdH+jkvpSpanhMFXSalXv6LN2w5Pt/Z6gfXzO/Yntw62kt1adGiX9Bh2Pk+bhj65r+5vaK/2nK3mXXg6B5x36GiZ08MJsO+d4tT2Hi52ex0Xkhh/cFdrj8pthwqNBuQQ8SWjfb48MPpru+fT8xgXWBz+AnDCnEI=](https://play.vuejs.org/#eNqVUlFP2zAQ/isnv8A2mmxCe8lCpY0xiT0wBDzmJbMvrcGxLdspRVH++852W4oEnahUKb777ru777uRfbe2WA3IKlZ77qQN4DEMdt5o2VvjAtzhOvySqAR0zvRwVJS7SCw8anRd5kqqoUfA3qo2IL0A6kgE9DtXkj+A0dCCav+igmCgM3zwEJYIUtshJHyZC2ohV8BV6/1Zwx5daxu2Iaqf50lElL9qe2wYlG8jboz6D+In5h2k0TtgXdIU9FWXezvR04cnheC5sSgoUsT5YIwVQnrCPVW0kJIaZ53C9beYiB8zIR3y2KECbtTQa0pNkTEzzOEjfKJ/Yupbt5B6Foyt4KuNJIQkoWPrOTthLzx427wRBo+XAqaNedmwRgvsaL5rZ6w/Tv2SDhXcBif1gpp9iChutA8gBZxlmmOKHjI7y5UUziZXnXEkrhRk3zhunJ+mukxfW2xyHyopttB3iB/v5KX0G82TsLlhysdwBV+SG7YVgtacOblYBgp+fkXgQC10JxfFvTeaBE4kDeOmt1Kh+5NOxTesyvQx1yplHn+nWHADnmzjfIn84ZX4vV/HWMOuHXp0KzrRXS6Q/xhy+uL2itzeS/ZGDPGgDyRv0NOJ5XOOsB+DFjT2Hi5Ne5nOhLS48xfrgNpvl4qDRuSU8A2jwzk/sPrzuKfFaaojPdn0D59zeDo=)).
