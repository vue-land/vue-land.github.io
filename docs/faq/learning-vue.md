# How should I learn Vue?

## Preliminaries

A good grasp of JavaScript, HTML and CSS is important before you start learning Vue. In particular, you will really struggle if you don't have a solid understanding of JavaScript syntax. TypeScript is optional, but if you intend to use it then you'll need to have a good grasp of the basics.

Most guides/tutorials/courses/etc. will assume that you have familiarity with JavaScript package managers such as npm, yarn or pnpm. Vue can be used without using a package manager, e.g. by including it directly from a CDN via a `<script>` tag, but the vast majority of applications use a package manager. It's effectively the industry standard by this point, so most JavaScript developers would find it strange if a Vue guide didn't use a package manager.

## Learning resources

For Vue itself, start with the official docs, <https://vuejs.org/>. In particular, the **Essentials** and **Components In-Depth** sections of the guide are really important material that everybody needs to read. It won't all sink in the first time, but don't let that put you off. There's also a **Tutorial**, which is a bit more hands-on and which covers the most important points in less depth than the main guide. You might want to try the **Tutorial** first to get an overview and then use the guide to fill in the gaps.

The later sections of the official guide are also worth reading, but you may want to jump around or just get the gist rather than trying to study them carefully. So long as you know they exist, you can always go back to them when you think they'll be relevant.

<https://vueschool.io/> and <https://www.vuemastery.com/> both provide video courses for learning Vue. <https://www.udemy.com/> also has a range of Vue courses. Videos can be a good way to learn high-level concepts, but they aren't a replacement for reading the documentation. Watching videos is easier than reading documentation, but that doesn't necessarily equate to better learning.

## Practice

Practice is essential. For most people its *doing* rather than *reading* or *watching* that really makes the knowledge stick.

Try writing code as you read through the official docs, to check that you've understood things. Several pages include interactive examples on the [Vue SFC Playground](https://play.vuejs.org/), which you can edit and experiment with as you go.

There are also some examples at <https://vuejs.org/examples/>. You may want to try modifying those, or even re-creating one of them for yourself.

Don't try to write a real application until you've finished going through the docs. Even then, try to write something really simple, just to reinforce your knowledge, going back and re-reading sections when you get stuck. It's easy to get over-ambitious when writing your first few applications, especially if you're used to writing complex applications with a different framework.

A quick bit of Googling will throw up plenty of suggestions for toy applications you could write to sharpen your skills. Creating a 'To Do' list, or a weather app are two classics. You'll find a few more ideas, plus reference solutions, at <https://skirtles-code.github.io/vue-examples/exercises/>. Creating something you personally find fun to write is usually better than an arbitrary exercise, so pick something that sounds interesting.

## Other ways to learn

Working with other developers is a really good way to learn more about Vue. But what about if you don't have anyone to learn from?

Spend some time on Vue Land. You don't have to say anything, just watch the conversations. Get used to how people talk about Vue. Pick up the jargon, learn about which libraries people are using, see how people are using Vue. Then, when someone asks how to learn Vue, you can send them a link to this page.

## Vue 2 or Vue 3?

In most cases, start with Vue 3.

However, if you already know that you're going to be working on a Vue 2 project then you should focus on learning the version you'll actually be using. The Vue 2 documentation is at <https://v2.vuejs.org/>.

Note that some features from Vue 3 were backported to Vue 2.7. The Vue 2 guide was written before those features were added, but you can find more information about those additions at <https://v2.vuejs.org/v2/guide/migration-vue-2-7.html>.

## Does knowing another framework help?

Overall, it should be an advantage if you already know another framework, but it can be frustrating going back to being a beginner when you're used to knowing things.

Underlying knowledge of JavaScript, HTML and CSS should all transfer across. You'll likely also be used to thinking in terms of components, which can help compared to someone who has only experienced jQuery-style applications.

Vue shares a lot of concepts with other frameworks, but it can sometimes be deceptive. It can be tempting to try to understand Vue features in terms of features that you already know from another framework, but you may get caught out when they don't behave the same way.

You'll also find yourself tempted to start using familiar patterns, even though those patterns aren't used with Vue. There's a certain amount of unlearning that you'll need to do to write idiomatic Vue code. The Vue docs will generally show you the right way to do things, but they won't necessarily be explicit about avoiding other approaches.

In particular, if you've come from React, have a read of <https://vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks>.

## Should I learn the Composition API or the Options API?

Initially, you should pick whichever one you find easier to understand and learn that. Many of the core ideas transfer across, it isn't as big a difference as some people think.

You'll find a brief introduction to the two APIs at <https://vuejs.org/guide/introduction.html#api-styles>.

Try looking at the examples at <https://vuejs.org/examples/>. There's a toggle switch above the left sidebar that allows you to change the examples between the Options API and Composition API, so you can see the same examples written in both styles.

You should also be aware that the Composition API is usually used in conjunction with `<script setup>`, but they are not the same thing.

Beginners often find the Options API easier to understand, but it depends on your previous programming experiences. If you've worked with something similar to the Composition API before then that might feel more natural to you.

Vue 3 has full support for both APIs. You may sometimes see the Options API described as the 'Vue 2 API' or 'legacy API', but labels like those are misleading and unhelpful. New features are still being added to both APIs in Vue 3.

The Options API is the older API, and it's what you'll find in the Vue 2 documentation. It is now possible to use the Composition API with Vue 2, as it was backported from Vue 3 to Vue 2.7. However, the documentation for Vue 2 hasn't been updated to fully document the backported features. You'll find a summary at <https://v2.vuejs.org/v2/guide/migration-vue-2-7.html>.

The Composition API is more flexible and more powerful than the Options API, so it tends to be preferred by advanced users. But that shouldn't discourage you from learning it as a beginner. It isn't necessarily more complicated, but the extra freedom does lead to more ways you can go wrong. When it's used correctly, the code often ends up looking simpler with the Composition API.

## How should I create my first project?

For a quick way to play with Vue, try the [Vue SFC Playground](https://play.vuejs.org/).

To create something a bit more real, you can use [create-vue](https://github.com/vuejs/create-vue). That's the recommended way to scaffold a new project with Vue and Vite. The command to run is:

```sh
npm init vue@latest
```

Note that the command is `init`, not `install`. Using `init` will run the `create-vue` helper to scaffold your project, whereas `install` would just add the `vue` package to an existing application.

## What else do I need to learn?

There are two official libraries you should learn once you're happy with the basics of Vue:

- [Pinia](https://pinia.vuejs.org/) for state management.
- [Vue Router](https://router.vuejs.org/) for client-side routing.

While they aren't used in every application, people will generally assume that you are familiar with these two libraries if you claim to know Vue.

You should also take a look at [VueUse](https://vueuse.org/). You don't need to study it in depth, but you should be aware of what it is and the kinds of things it can do.

## Things to avoid

* [Vue Class Components](https://class-component.vuejs.org/). These are an old way to create Vue components, primarily with Vue 2 and TypeScript. Unless you're going to be working on a project that uses Vue Class Components, it isn't something you need to learn.
* [Vue CLI](https://cli.vuejs.org/). Even though this sounds like something you would want to use, it isn't. It is an old tool for scaffolding a Vue project using webpack. If you need to use webpack then using Vue CLI is still the easiest way to do it, but otherwise you should stick to `npm init vue@latest` and use Vite.
* [Vuex](https://vuex.vuejs.org/). This is an old state management tool, primarily used with Vue 2. It has been replaced by Pinia.
* `npm init vite@latest`. This should not be confused with `npm init vue@latest`. Both commands can be used to scaffold a project using Vue and Vite, but you will get a much better starting point using `npm init vue@latest`, which is the command you'll find recommended in the Vue docs. The command `npm init vite@latest` supports various frameworks, not just Vue, but only up to a very basic level. It's much easier to start with `npm init vue@latest` and then take out anything you don't need.

If you're trying to learn Vue from an online course then be careful to check which version of Vue it is teaching. If the course uses Vue CLI or Vuex then those may be red flags that it isn't up-to-date. That doesn't mean there isn't value in doing the course, but be aware that you may be learning old ways of doing things and some of the code, commands or configuration shown in the course may be incompatible with current versions of some packages.

## I've been hired to work on a Vue project. How do I learn fast?

For the most part, the advice on the rest of this page still applies.

However, if you're learning Vue for a specific project, then it makes sense to tailor your initial learning to that project.

You should try to find out as much as possible about the project, so that you can focus your learning on the specific skills you'll need. In particular:

- Is the project using JavaScript or TypeScript?
- Is it using Vue 2 or Vue 3? If it's Vue 2, you may want to check whether they've upgraded to Vue 2.7, as that has some features backported from Vue 3.
- Is it using the Options API or Composition API? If it's the latter, are they using `<script setup>`?
- Do they use Pinia or Vuex for state management?
- Are they using Vue Router?
- What other libraries are they using?

The main focus of your learning should be on Vue fundamentals rather than the other libraries, as everything else depends on understanding Vue itself. But some familiarity with the other libraries will make it a bit easier to orient yourself with your new codebase.
