# Styling Notes

This note documents the current styling cleanup so future edits do not accidentally break page-specific styles or reintroduce theme-level inline styling unnecessarily.

## Layout Hook

- [`_layouts/page.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_layouts/page.liquid) intentionally applies `page.page_class` to the page `<article>`.
- This hook is required for the page-scoped selectors in [`_sass/_pages-custom.scss`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_sass/_pages-custom.scss).
- If `page_class` is removed from `page.liquid`, styles for the following pages may stop applying:
  - [`_pages/about.md`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_pages/about.md)
  - [`_pages/join_us.md`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_pages/join_us.md)
  - [`_pages/profiles.md`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_pages/profiles.md)
  - [`_pages/brand.md`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_pages/brand.md)
  - [`_pages/research.md`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_pages/research.md)
  - [`_pages/blog.md`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_pages/blog.md)

## Page-Scoped Styles

- [`_sass/_pages-custom.scss`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_sass/_pages-custom.scss) exists to hold styles that used to live inline inside page Markdown.
- Most selectors in that file are intended to preserve the previous appearance rather than redesign it.
- One intentional visual tweak remains there:
  - the homepage news sidebar has a subtle bordered/card treatment

## Shared Include Cleanup

These files were converted from inline styles or local `<style>` blocks to class-based styling:

- [`_includes/news.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_includes/news.liquid)
- [`_includes/latest_posts.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_includes/latest_posts.liquid)
- [`_includes/newsletter.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_includes/newsletter.liquid)
- [`_includes/disqus.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_includes/disqus.liquid)
- [`_includes/giscus.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_includes/giscus.liquid)
- CV partials under [`_includes/cv`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_includes/cv)

Supporting styles live in:

- [`_sass/_components.scss`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_sass/_components.scss)
- [`_sass/_utilities.scss`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_sass/_utilities.scss)
- [`_sass/_cv.scss`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_sass/_cv.scss)

## Behavior-Sensitive Area

- [`_includes/calendar.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_includes/calendar.liquid) and [`assets/js/calendar-setup.js`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/assets/js/calendar-setup.js) are slightly more sensitive than the other cleanup.
- Calendar visibility is now controlled by the `calendar-wrapper-hidden` class instead of inline `style.display`.
- If calendar toggling stops working, check both the include and the JS together.

## Safe Revert Boundaries

- Reverting page content files without reverting the related Sass may remove the matching classes.
- Reverting [`_layouts/page.liquid`](/Users/hrishikesh/git/sambhashana/sambhashana.github.io/_layouts/page.liquid) without keeping the `page_class` hook may disable page-scoped styles.
- Reverting other `_layouts/*` files is lower-risk and mostly affects specialized theme layouts rather than the main research-group pages.
