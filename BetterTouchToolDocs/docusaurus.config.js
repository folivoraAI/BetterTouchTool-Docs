// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BetterTouchTool Documentation',
  tagline: 'Official documentation for BetterTouchTool',
  favicon: 'img/favicon.ico',

  url: 'https://docs.folivora.ai',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  markdown: {
    format: 'mdx',
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'BetterTouchTool',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://community.folivora.ai',
            label: 'Community Forum',
            position: 'right',
          },
          {
            href: 'https://folivora.ai',
            label: 'BetterTouchTool Website',
            position: 'right',
          },
          {
            href: 'https://github.com/folivoraAI/BetterTouchTool-Docs',
            label: 'Docs GitHub',
            position: 'right',
          },
        ],
      },
      algolia: {
        appId: '2BILMUIHFB',
        apiKey: '9891ca28095193cbaba083d15c7200d3',
        indexName: 'BetterTouchTool Documentation',
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      prism: {
        theme: prismThemes.dracula,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['applescript', 'bash', 'json'],
      },
      footer: {
        style: 'dark',
        links: [
          
          {
            title: 'Community',
            items: [
              {
                label: 'Forum',
                href: 'https://community.folivora.ai',
              },
            ],
          },
        
          {
            title: 'More',
            items: [
              {
                label: 'Privacy Policy',
                href: 'https://folivora.ai/privacy',
              },
              {
                label: 'Website',
                href: 'https://folivora.ai',
              },
              {
                label: 'Documentation GitHub',
                href: 'https://github.com/folivoraAI/BetterTouchTool-Docs',
              },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} folivora.AI GmbH.`,
      },
    }),
};

export default config;
