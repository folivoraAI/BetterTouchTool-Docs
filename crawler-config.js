new Crawler({
  appId: "2BILMUIHFB",
  indexPrefix: "",
  rateLimit: 8,
  maxDepth: 10,
  maxUrls: null,
  schedule: "on the 10 day of the month",
  startUrls: ["https://docs.folivora.ai"],
  renderJavaScript: false,
  sitemaps: ["https://docs.folivora.ai/sitemap.xml"],
  ignoreCanonicalTo: true,
  discoveryPatterns: ["https://docs.folivora.ai/**"],
  actions: [
    {
      indexName: "BetterTouchTool Documentation",
      pathsToMatch: ["https://docs.folivora.ai/**"],
      recordExtractor: ({ $, helpers }) => {
        const lvl0 =
          $(
            ".menu__link.menu__link--sublist.menu__link--active, .navbar__item.navbar__link--active",
          )
            .last()
            .text() || "Documentation";

        const records = helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: "",
              defaultValue: lvl0,
            },
            lvl1: ["header h1", "article h1"],
            lvl2: "article h2",
            lvl3: "article h3",
            lvl4: "article h4",
            lvl5: "article h5, article td:first-child",
            lvl6: "article h6",
            content: "article p, article li, article td:last-child",
          },
          aggregateContent: true,
          recordVersion: "v3",
        });

        // Detect the section landing / overview page: the sidebar's active
        // *category* link carries aria-current="page" only when we're actually on
        // that category's own landing page. This is independent of URL depth or
        // slug, so it also covers overview pages that don't sit at the section
        // root (e.g. /docs/ai-assistants/overview) as well as those that do
        // (e.g. /docs/launcher).
        const isSectionLanding =
          $(
            ".menu__link.menu__link--sublist.menu__link--active[aria-current='page']",
          ).length > 0;

        // Boost only the page-level (lvl1) record, so landing pages outrank their
        // sibling sub-pages. The landing page's own sub-headings (lvl2+/content)
        // stay at pageRank 0, otherwise they would jump above other pages'
        // titles (pageRank is compared before weight.level in customRanking).
        const pageRank = isSectionLanding ? 80 : 70;
        for (const r of records) {
          if (r.type === "lvl1") {
            r.weight = { ...r.weight, pageRank };
          }
        }

        return records;
      },
    },
  ],
  safetyChecks: { beforeIndexPublishing: { maxLostRecordsPercentage: 30 } },
  initialIndexSettings: {
    "BetterTouchTool Documentation": {
      attributesForFaceting: [
        "type",
        "lang",
        "language",
        "version",
        "docusaurus_tag",
      ],
      attributesToRetrieve: [
        "hierarchy",
        "content",
        "anchor",
        "url",
        "url_without_anchor",
        "type",
      ],
      attributesToHighlight: ["hierarchy", "content"],
      attributesToSnippet: ["content:10"],
      camelCaseAttributes: ["hierarchy", "content"],
      searchableAttributes: [
        "unordered(hierarchy.lvl0)",
        "unordered(hierarchy.lvl1)",
        "unordered(hierarchy.lvl2)",
        "unordered(hierarchy.lvl3)",
        "unordered(hierarchy.lvl4)",
        "unordered(hierarchy.lvl5)",
        "unordered(hierarchy.lvl6)",
        "content",
      ],
      distinct: true,
      attributeForDistinct: "url",
      customRanking: [
        "desc(weight.pageRank)",
        "desc(weight.level)",
        "asc(weight.position)",
      ],
      ranking: [
        "words",
        "filters",
        "typo",
        "attribute",
        "proximity",
        "exact",
        "custom",
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: "</span>",
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: "allOptional",
    },
  },
  apiKey: "6bf343d3523cec1eadf3fefa71e27aed",
});
