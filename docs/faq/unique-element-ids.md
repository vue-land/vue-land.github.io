# How do I create unique element ids with Vue?

The `id` attribute for an element needs to be unique across the entire page. Hardcoding an element `id` within a component could lead to clashes, and will make it difficult to reuse that component. It's also rarely necessary, as styling should use classes instead.

But there are legitimate use cases for an `id`, such as ARIA attributes or tying together a `<label>` and `<input>`. In those scenarios you would need to generate a dynamic value for the `id`.

While it is possible to use a library to generate a UUID, that is usually unnecessary. A counter is usually sufficient.

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

An element `id` beginning with a digit would be considered invalid, so we put a prefix before the count.
