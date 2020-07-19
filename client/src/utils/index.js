import DOMPurify from 'dompurify';
import marked from 'marked';

const renderer = new marked.Renderer();

// Customize the output for links when rendering HTML from Markdown.
renderer.link = (href, title, text) =>
  // prettier-ignore
  `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title ?? ''}">${text}</a>`;

function renderHtmlFromMarkdown(markdown) {
  // Render HTML from markdown text.
  const html = marked(markdown, { renderer });
  // Sanitize the HTML, but keep the `target` attribute for links.
  return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
}

// eslint-disable-next-line import/prefer-default-export
export { renderHtmlFromMarkdown };
