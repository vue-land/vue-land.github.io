# Which Vue component library should I use?

Different libraries have different strengths, so the best choice for one project isn't necessarily the best choice for another. You're going to need to judge for yourself what works best for you and your project.

You'll find lists of libraries for Vue 3 at:

- https://ui-libs.vercel.app/
- https://skirtles-code.github.io/vue-examples/component-libraries.html

GitHub stars or npm download statistics can be useful when assessing the popularity of a library, but they need to be interpreted carefully. Newer libraries are at a massive disadvantage in those counts. Some libraries are particularly strong in a specific area, which may make them more suitable for your project than they would be for a more general audience.

It's unlikely that anyone on Vue Land has enough personal experience to make a detailed assessment of more than two or three libraries. It takes months of use on a real project to properly understand the pros and cons of a library, and even then those experiences won't necessarily carry across to other projects.

However, if there's a specific library that you're considering, somebody might be able to share their own experiences of using it.

## Assessing the options

First you should consider whether you really need a component library. Would you be better off doing it yourself?

Writing a component library from scratch is a lot of work, but if you don't need many components then it might be worth considering.

Even if you do decide to do it yourself, it is well worth studying some existing libraries to see how they do things.

It's also not an all-or-nothing decision. Some libraries will give you fully styled components that you can just use, but others provide tools to help you create your own components. For example:

- [Tailwind CSS](https://tailwindcss.com/) is a popular choice for working with CSS.
- [daisyUI](https://daisyui.com/) extends Tailwind CSS to add component-specific utility classes.
- Libraries like [Headless UI](https://headlessui.com/) and [Radix Vue](https://www.radix-vue.com/) provide unstyled components that can be used to build your own.
- [Tailwind UI](https://tailwindui.com/) and [shadcn-vue](https://www.shadcn-vue.com/) are large collections of example components that you can copy.

## Core features

You might be able to rule out some of the options based on the features they provide. For example:

- Custom styling/theming.
- Accessibility.
- SSR.
- Mobile support, e.g. responsiveness, touch screens, gestures.
- Internationalization.
- RTL support.
- Level of TypeScript support.
- Tooling requirements. e.g. Build tools, testing tools, IDEs.

## Explore the components

Have a browse through the docs to see the components each library provides.

Make a list of the components you think will be the most important for your application and have a look at the features those components have. You don't need to go through all of them, just reading through the documentation for a few components will likely give you a sense of whether you'll be comfortable using a particular library.

Don't put too much emphasis on a specific component. For example, if you need a chart component then you may well need to use a separate library for that.

Almost all libraries should support tree-shaking, so components you don't use won't be included in the build. But some libraries may be better at it than others, so you may want to investigate that early on if bundle size is a major concern.

## Other considerations

- Have you, or anyone on your team, used one of these libraries before?
- Do you find the docs clear and easy to follow?
- Does the library provide any kind of support if you have problems? Do you need that?
- How often do they make releases? Was the last release relatively recent?
- Take a look at the GitHub repo. Does it seem to be actively maintained?
