import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'official-source', 'huggingface-agents-course');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'learning-site', 'app', 'official', 'generated-manifest.json'), 'utf8'));
const ids = new Set(manifest.pages.map((page) => page.id));
const aliases = { 'unit2/llama-index/02_components': 'unit2/llama-index/components', 'unit2/langgraph/quizz1': 'unit2/langgraph/quiz1' };
const broken = [];
let checked = 0;

for (const page of manifest.pages) {
  const raw = fs.readFileSync(path.join(sourceRoot, page.sourcePath), 'utf8');
  for (const match of raw.matchAll(/\]\(([^)]+)\)/g)) {
    const href = match[1].trim().split(/\s+["']/)[0];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    checked += 1;
    const clean = href.split('#')[0].replace(/\.mdx?$/, '');
    const base = page.id.split('/').slice(0, -1);
    const parts = clean.startsWith('/') ? clean.split('/').filter(Boolean) : [...base, ...clean.split('/')];
    const resolved = [];
    for (const part of parts) { if (part === '..') resolved.pop(); else if (part !== '.') resolved.push(part); }
    const id = resolved.join('/').replace(/^units\/zh-CN\//, '');
    const fileTarget = path.resolve(path.dirname(path.join(sourceRoot, page.sourcePath)), href.split('#')[0]);
    if (!ids.has(aliases[id] || id) && !fs.existsSync(fileTarget) && !fs.existsSync(`${fileTarget}.mdx`)) broken.push(`${page.id} -> ${href}`);
  }
}

if (broken.length) {
  console.error(`发现 ${broken.length} 个无法解析的官方相对链接：`);
  broken.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`内部链接校验通过：${checked} 个官方相对链接均可解析。`);
