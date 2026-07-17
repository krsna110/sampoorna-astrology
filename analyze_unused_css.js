const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const selectors = new Set();
for (const match of css.matchAll(/([^{}]+)\{/g)) {
  const selectorText = match[1];
  for (const part of selectorText.split(',')) {
    const cleaned = part.trim();
    const simple = cleaned.match(/[#.][A-Za-z0-9_-]+/g);
    if (simple) {
      for (const s of simple) selectors.add(s);
    }
  }
}
const used = new Set();
for (const sel of selectors) {
  const name = sel.slice(1);
  if (sel.startsWith('.')) {
    if (new RegExp('\\b' + name + '\\b').test(html) || new RegExp('\\b' + name + '\\b').test(js)) {
      used.add(sel);
    }
  } else {
    if (new RegExp('id=["\' + name + '\"').test(html) || new RegExp('\\b' + name + '\\b').test(js)) {
      used.add(sel);
    }
  }
}
const unused = [...selectors].filter(x => !used.has(x)).sort();
console.log('total selectors', selectors.size, 'used', used.size, 'unused', unused.length);
console.log(unused.join('\n'));
