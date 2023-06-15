# I need users to stay logged in if they refresh the page. Should I use cookies or local storage?

::: warning This answer is a stub.
We are still working on writing the answers to the FAQ questions. The answer below is incomplete, but you may still find it useful.
:::

This really isn't a Vue question, but it comes up so often we've included it anyway.

Firstly, as with most security questions, you should be very wary about taking advice from strangers on the internet, including us. You need to *understand* the advice, not just blindly follow it.

Whichever approach you use you'll be introducing a security risk into your application, but that needs to be put into context. Security risks are an inevitable part of writing useful software. Those risks need to be assessed and understood. They can then be weighed up against the features they provide and steps taken to mitigate the potential harm.

You'll find endless articles online explaining why one approach is better than the other. Used correctly, either can be made to work.

If you're considering using `localStorage` then you should also take a look at `sessionStorage`. That will allow data to be preserved across refreshes but only within the same browser tab.
