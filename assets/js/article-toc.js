/* Build section links for ordinary posts without requiring per-post navigation data. */
(() => {
  const nav = document.querySelector('[data-auto-toc]');
  const article = document.querySelector('.article-content');
  if (!nav || !article) return;
  const headings = [...article.querySelectorAll(':scope > h1[id], :scope > h2[id], :scope > h3[id]')];
  if (!headings.length) return;
  nav.replaceChildren(...headings.map((heading) => {
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    if (heading.tagName === 'H3') link.className = 'nested';
    return link;
  }));
})();
