import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue Land FAQ',
  description: 'An FAQ for Vue Land',
  base: '/',
  outDir: '../dist',

  themeConfig: {
    logo: '/logo.svg',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'FAQ', link: '/faq/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vue-land/vue-land.github.io' }
    ],

    sidebar: [
      {
        text: 'FAQ',
        link: '/faq/',
        items: [
          {
            text: 'How should I learn Vue?',
            link: '/faq/learning-vue'
          },
          {
            text: 'Can you show me a large, open-source Vue project that I can study?',
            link: '/faq/large-example-applications'
          },
          {
            text: 'Which Vue component library should I use?',
            link: '/faq/component-library'
          },
          {
            text: 'What folder structure should I use for my Vue project?',
            link: '/faq/folder-structure'
          },
          {
            text: 'Can I use Nuxt features without using Nuxt?',
            link: '/faq/nuxt-features'
          },
          {
            text: 'Do Vue 2 components work with Vue 3?',
            link: '/faq/vue-2-components-in-vue-3'
          },
          {
            text: 'I need users to stay logged in if they refresh the page. Should I use cookies or local storage?',
            link: '/faq/cookies-local-storage'
          },
          {
            text: `How do I check which version I'm using?`,
            link: '/faq/checking-versions'
          },
          {
            text: 'How do I run an old project?',
            link: '/faq/running-old-projects'
          },
          {
            text: 'Why does my page fail to load when I refresh in production?',
            link: '/faq/production-page-refresh'
          },
          {
            text: 'How do I deploy to GitHub Pages?',
            link: '/faq/github-pages'
          },
          {
            text: `In my SPA, how to add og tags and why doesn't Twitter/Facebook see them when I add them dynamically?`,
            link: '/faq/og-tags'
          },
          {
            text: 'How should my components communicate?',
            link: '/faq/component-communication'
          },
          {
            text: 'How can I pass slots through to a child component?',
            link: '/faq/forwarding-slots'
          },
          {
            text: `How can I make Vue 'wait' for the data before rendering?`,
            link: '/faq/delaying-rendering'
          },
          {
            text: "Why isn't v-html rendering my components?",
            link: '/faq/components-in-v-html'
          },
          {
            text: `Why does my logging show an empty/missing value after I've loaded the data?`,
            link: '/faq/logging-after-loading'
          },
          {
            text: 'Why can I see my data in console logging, but if I try to access it I get undefined or an error?',
            link: '/faq/logging-is-live'
          },
          {
            text: 'When to use reactive() and ref()?',
            link: '/faq/reactive-ref'
          },
          {
            text: 'Why are the new value and old value the same in my watcher?',
            link: '/faq/deep-watcher-values'
          },
          {
            text: 'Why do my dynamic images not work?',
            link: '/faq/dynamic-images'
          },
          {
            text: 'Why are my dynamic Tailwind classes not working?',
            link: '/faq/missing-tailwind-classes'
          }
        ]
      }
    ]
  }
})
