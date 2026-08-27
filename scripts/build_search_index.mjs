import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'learning-site');
const manifest = JSON.parse(fs.readFileSync(path.join(siteRoot, 'app', 'official', 'generated-manifest.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(siteRoot, 'app', 'official', 'learning-guides.json'), 'utf8'));
const quizzes = JSON.parse(fs.readFileSync(path.join(siteRoot, 'app', 'official', 'generated-quizzes.json'), 'utf8'));

function flatten(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(flatten).join('\n');
  if (value && typeof value === 'object') return Object.values(value).map(flatten).join('\n');
  return '';
}

function readTree(directory, extensions) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return readTree(full, extensions);
    return extensions.some((extension) => entry.name.endsWith(extension)) ? [{ path: path.relative(root, full).replaceAll('\\', '/'), text: fs.readFileSync(full, 'utf8') }] : [];
  });
}

const experiments = readTree(path.join(root, 'exercises'), ['.py', '.md']);
const notes = readTree(path.join(root, 'notes'), ['.md']);
const index = manifest.pages.map((page) => {
  const content = JSON.parse(fs.readFileSync(path.join(siteRoot, 'public', 'official-content', `${page.id}.json`), 'utf8'));
  const unitPrefix = page.id.split('/')[0];
  const relevantExperiments = experiments.filter((item) => item.path.includes(`/${unitPrefix}/`) || (unitPrefix === 'unit1' && item.path.includes('/unit1/')));
  const relevantNotes = notes.filter((item) => item.path.includes(`/${unitPrefix}/`));
  return {
    id: page.id,
    title: page.title,
    sections: [
      { kind: '官方正文', text: content.readable },
      ...(guides[page.id] ? [{ kind: 'Hinata 学习层', text: flatten(guides[page.id]) }] : []),
      ...(quizzes[page.id] ? [{ kind: '官方测验', text: flatten(quizzes[page.id]) }] : []),
      ...(relevantExperiments.length ? [{ kind: '本地实验', text: relevantExperiments.map((item) => `${item.path}\n${item.text}`).join('\n') }] : []),
      ...(relevantNotes.length ? [{ kind: '本地项目笔记', text: relevantNotes.map((item) => `${item.path}\n${item.text}`).join('\n') }] : []),
    ],
  };
});

fs.writeFileSync(path.join(siteRoot, 'public', 'search-index.json'), `${JSON.stringify(index)}\n`, 'utf8');
console.log(`全文搜索索引已生成：${index.length} 页，覆盖正文、学习层、测验、实验与项目笔记。`);
