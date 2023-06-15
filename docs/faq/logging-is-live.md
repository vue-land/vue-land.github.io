# Why can I see my data in console logging, but if I try to access it in my code I get `undefined` or an error?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

Logging is live.

When you log an object (including arrays, reactive proxies and refs) to the console, the browser just stores a reference to that object. It doesn't take a copy.

When you subsequently expand that object by clicking in the console, you will see the properties that the object has now, not the properties it had at the point you logged it.
