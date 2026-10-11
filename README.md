# qu3b411 research blog

Source for [blog.jacobmohrbutter.com](https://blog.jacobmohrbutter.com), published with Jekyll on GitHub Pages.

## Local preview

Ruby and Bundler are required.

```sh
bundle install
bundle exec jekyll build
bundle exec jekyll serve --livereload
```

Open `http://127.0.0.1:4000/`. The generated site is in `_site/`. GitHub Pages builds from `master`; review branches do not publish to the custom domain.

## Site structure

- `_layouts/default.html` supplies the shared page shell.
- `_layouts/post.html` and `_layouts/page.html` use that shell for articles and pages.
- `_layouts/clickfix.html` uses the same head, header, footer, and base CSS while keeping the case study's section index.
- `_includes/` contains shared navigation, metadata, and footer markup.
- `_sass/base.scss` defines the dark palette and typography; `css/clickfix.css` contains only case-study components.
- `_posts/` contains published writing. `published: false` posts are intentionally excluded from the public build.

The permalink configuration and existing article anchors are part of the published URL surface. Preserve them when editing layouts or headings. The ClickFix article's technical claims, evidence boundaries, commands, indicators, and lab instructions are editorial content; design changes should not alter them.
