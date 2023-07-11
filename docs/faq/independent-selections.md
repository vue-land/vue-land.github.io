# Why does selecting one item select them all?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

When you have a list, clicking to select an item or check a checkbox should just affect that item. If implemented incorrectly, it can select all of them instead.

This is usually because the data bound to the item is the same for all items, rather having separate selection/checked state for each item.

There is a similar problem where only the first item gets selected/checked, no matter which one is clicked. While this could also be because of a data binding problem, it is more likely to be caused by items sharing an `id`, e.g. for a `<label for>` and `<input type="checkbox">`. All labels will check the first checkbox in that scenario.

A `<label>` can also cause a problem if you fail to take account of the two `click` events, one on the `<label>` and the other on the `<input>`. If you listen for those on an ancestor, you can end up toggling the state on and off again for a single click.

A similar issue can occur when toggling elements that are nested inside each other. e.g. a checkbox inside a table row, or a modal close button that is nested inside the open button. It appears that a click does nothing, because the state gets toggled twice.
