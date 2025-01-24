import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue Land FAQ',
  description: 'An FAQ for Vue Land',
  base: '/',
  outDir: '../dist',
  cleanUrls: true,

  sitemap: {
    hostname: 'https://vue-land.github.io'
  },

  transformHead({ page}) {
    if (page !== '404.md') {
      const canonicalUrl = `https://vue-land.github.io/${page}`
        .replace(/index\.md$/, '')
        .replace(/\.md$/, '')

      return [['link', { rel: 'canonical', href: canonicalUrl }]]
    }
  },

  themeConfig: {
    logo: '/logo.svg',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'FAQ', link: '/faq/' }
    ],

    socialLinks: [
      { icon: 'discord', link: 'https://chat.vuejs.org/' },
      { icon: 'github', link: 'https://github.com/vue-land/vue-land.github.io' }
    ],

    sidebar: [
      {
        text: 'FAQ Home',
        link: '/faq/'
      },
      {
        text: 'Learning',
        items: [
          {
            text: 'How should I learn Vue?',
            link: '/faq/learning-vue'
          }
          // {
          //   text: 'Can you show me a large, open-source Vue project that I can study?',
          //   link: '/faq/large-example-applications'
          // }
        ]
      },
      {
        text: 'New project decisions',
        items: [
          {
            text: 'Which Vue component library should I use?',
            link: '/faq/component-library'
          },
          {
            text: 'What folder structure should I use for my Vue project?',
            link: '/faq/folder-structure'
          },
          // {
          //   text: 'Can I use Nuxt features without using Nuxt?',
          //   link: '/faq/nuxt-features'
          // },
          {
            text: 'Do Vue 2 components work with Vue 3?',
            link: '/faq/vue-2-components-in-vue-3'
          },
          // {
          //   text: 'I need users to stay logged in if they refresh the page. Should I use cookies or local storage?',
          //   link: '/faq/cookies-local-storage'
          // }
        ]
      },
      {
        text: 'Working with npm',
        items: [
          {
            text: `How do I check which Vue version something is using?`,
            link: '/faq/checking-versions'
          },
          {
            text: 'How do I run an old project?',
            link: '/faq/running-old-projects'
          }
        ]
      },
      {
        text: 'Deployment',
        items: [
          {
            text: 'Why is there a <code>#</code> before my route path?',
            link: '/faq/hash-before-route-path'
          },
          {
            text: 'Why does my page fail to load when I refresh in production?',
            link: '/faq/production-page-refresh'
          },
          {
            text: 'Why do I get a blank page in production?',
            link: '/faq/blank-page-in-production'
          },
          {
            text: 'How do I deploy to GitHub Pages?',
            link: '/faq/github-pages'
          },
          {
            text: 'How do I add dynamic <code>&lt;meta&gt;</code> tags to my application?',
            link: '/faq/dynamic-meta-tags'
          }
        ]
      },
      {
        text: 'Vue code patterns',
        items: [
          // {
          //   text: 'How should my components communicate?',
          //   link: '/faq/component-communication'
          // },
          {
            text: 'How do I call a method of a child component?',
            link: '/faq/invoking-child-methods'
          },
          // {
          //   text: 'Why are my template refs not working?',
          //   link: '/faq/template-refs'
          // },
          // {
          //   text: 'How can I share state with a composable?',
          //   link: '/faq/sharing-state'
          // },
          {
            text: 'How can I pass slots through to a child component?',
            link: '/faq/forwarding-slots'
          },
          // {
          //   text: `How can I make Vue 'wait' for the data before rendering?`,
          //   link: '/faq/delaying-rendering'
          // },
          // {
          //   text: "Why isn't v-html rendering my components?",
          //   link: '/faq/components-in-v-html'
          // },
          {
            text: 'Can I create a local variable in my template?',
            link: '/faq/template-local-variables'
          },
          // {
          //   text: 'Can I use JavaScript classes for my reactive data?',
          //   link: '/faq/reactivity-and-classes'
          // },
          // {
          //   text: 'Why does selecting one item select them all?',
          //   link: '/faq/independent-selections'
          // },
          {
            text: 'How do I create unique element ids with Vue?',
            link: '/faq/unique-element-ids'
          },
          {
            text: `Why can't I use the current route in <code>App.vue</code>?`,
            link: '/faq/accessing-the-route'
          }
        ]
      },
      {
        text: 'Pinia',
        items: [
          {
            text: `Why am I getting an error about 'no active Pinia'?`,
            link: '/faq/no-active-pinia'
          }, {
            text: 'Why is my store cleared when I reload the page?',
            link: '/faq/persisting-a-store'
          }
        ]
      },
      {
        text: 'Debugging',
        items: [
      //     {
      //       text: `Why does my logging show an empty/missing value after I've loaded the data?`,
      //       link: '/faq/logging-after-loading'
      //     },
      //     {
      //       text: 'Why can I see my data in console logging, but if I try to access it I get undefined or an error?',
      //       link: '/faq/logging-is-live'
      //     }
          {
            text: 'Why is my <code>FormData</code> empty?',
            link: '/faq/empty-formdata'
          }
        ]
      },
      {
        text: 'Common misunderstandings',
        items: [
      //     {
      //       text: 'When to use reactive() and ref()?',
      //       link: '/faq/reactive-ref'
      //     },
      //     {
      //       text: 'Why are the new value and old value the same in my watcher?',
      //       link: '/faq/deep-watcher-values'
      //     }
          {
            text: 'Is <code>emit</code> synchronous?',
            link: '/faq/emit-synchronous'
          }
        ]
      },
      {
        text: 'Common tooling problems',
        items: [
          // {
          //   text: 'Why do my dynamic images not work?',
          //   link: '/faq/dynamic-images'
          // },
          {
            text: 'Why are my dynamic Tailwind classes not working?',
            link: '/faq/missing-tailwind-classes'
          }
        ]
      }
    ]
  }
})
