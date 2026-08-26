import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, 'official-source', 'huggingface-agents-course', 'units', 'zh-CN');
const outputDir = path.join(projectRoot, 'learning-site', 'app', 'official');
const outputFile = path.join(outputDir, 'generated-manifest.json');
const publicContentDir = path.join(projectRoot, 'learning-site', 'public', 'official-content');
const coverageFile = path.join(projectRoot, 'OFFICIAL_COVERAGE.md');
const commit = '8c0832eae634ebb34541c65265caa6da4c5d2c57';

function decodeQuoted(value) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value.replaceAll('\\"', '"');
  }
}

function readProperty(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  return match ? decodeQuoted(match[1]) : '';
}

function renderQuestion(match) {
  const bodyMatch = match.match(/choices=\{\[([\s\S]*?)\]\}/);
  if (!bodyMatch) return `\n> 官方交互测验组件（完整源码可在“原始 MDX”中查看）\n`;

  const choices = [...bodyMatch[1].matchAll(/\{([\s\S]*?)\}/g)].map((entry) => {
    const block = entry[1];
    return {
      text: readProperty(block, 'text'),
      explain: readProperty(block, 'explain'),
      correct: /correct:\s*true/.test(block),
    };
  }).filter((choice) => choice.text);

  const lines = ['\n#### 官方测验选项与解析\n'];
  choices.forEach((choice, index) => {
    lines.push(`${index + 1}. ${choice.text}${choice.correct ? ' **（官方正确答案）**' : ''}`);
    if (choice.explain) lines.push(`   - 官方解析：${choice.explain}`);
  });
  return `${lines.join('\n')}\n`;
}

function makeReadableMdx(raw) {
  let value = raw;
  value = value.replace(/<CourseFloatingBanner[\s\S]*?\/>/g, '\n> 官方课程浮动导航组件已转为本地目录导航；原始组件源码仍完整保留。\n');
  value = value.replace(/<Question[\s\S]*?\/>/g, renderQuestion);
  value = value.replace(/<iframe[\s\S]*?<\/iframe>/gi, (block) => {
    const src = block.match(/src=["']([^"']+)["']/i)?.[1];
    const title = block.match(/title=["']([^"']+)["']/i)?.[1] || '官方嵌入内容';
    return src ? `\n[${title}](${src})\n` : '\n> 官方嵌入内容：请切换到“原始 MDX”查看完整标签。\n';
  });
  return value;
}

function parseToc(toc) {
  const pages = [];
  let group = '';
  let local = '';

  for (const line of toc.split(/\r?\n/)) {
    const groupMatch = line.match(/^- title:\s*(.+)$/);
    if (groupMatch) {
      group = groupMatch[1].trim();
      continue;
    }
    const localMatch = line.match(/^\s{4}- local:\s*(.+)$/);
    if (localMatch) {
      local = localMatch[1].trim();
      continue;
    }
    const titleMatch = line.match(/^\s{6}title:\s*(.+)$/);
    if (titleMatch && local) {
      pages.push({ id: local, group, title: titleMatch[1].trim() });
      local = '';
    }
  }
  return pages;
}

const toc = await readFile(path.join(sourceRoot, '_toctree.yml'), 'utf8');
const entries = parseToc(toc);
const pages = [];

for (const [index, entry] of entries.entries()) {
  const sourcePath = `${entry.id}.mdx`;
  const raw = await readFile(path.join(sourceRoot, sourcePath), 'utf8');
  pages.push({
    ...entry,
    index,
    sourcePath: `units/zh-CN/${sourcePath}`,
    officialUrl: `https://huggingface.co/learn/agents-course/zh-CN/${entry.id}`,
    githubUrl: `https://github.com/huggingface/agents-course/blob/${commit}/units/zh-CN/${sourcePath}`,
    readable: makeReadableMdx(raw),
    raw,
    stats: {
      characters: raw.length,
      headings: (raw.match(/^#{1,6}\s/gm) || []).length,
      codeBlocks: Math.floor((raw.match(/^```/gm) || []).length / 2),
      images: (raw.match(/!\[[^\]]*\]\([^)]*\)|<img\b/gi) || []).length,
    },
  });
}

for (const page of pages) {
  const contentPath = path.join(publicContentDir, `${page.id}.json`);
  await mkdir(path.dirname(contentPath), { recursive: true });
  await writeFile(contentPath, `${JSON.stringify({ readable: page.readable, raw: page.raw })}\n`, 'utf8');
}

const manifestPages = pages.map(({ readable, raw, ...page }) => ({
  ...page,
  contentUrl: `/official-content/${page.id}.json`,
}));

const groups = [...new Set(pages.map((page) => page.group))].map((title) => ({
  title,
  pageIds: pages.filter((page) => page.group === title).map((page) => page.id),
}));

const generated = {
  source: {
    repository: 'https://github.com/huggingface/agents-course',
    language: 'zh-CN',
    commit,
    commitDate: '2026-06-28T19:06:12+02:00',
    license: 'Apache-2.0',
  },
  pageCount: pages.length,
  groups,
  pages: manifestPages,
};

const coverage = [
  '# 官方课程覆盖清单',
  '',
  `- 官方仓库：${generated.source.repository}`,
  `- 固定版本：\`${commit}\``,
  `- 中文目录页数：${pages.length}`,
  '- 官方原始 MDX：100% 已纳入项目',
  '- 阅读视图：100% 已生成（原始 MDX 可随时切换核对）',
  '- Hinata 批注：独立维护，不替换官方正文',
  '',
];

for (const group of groups) {
  coverage.push(`## ${group.title}`, '');
  for (const id of group.pageIds) {
    const page = pages.find((item) => item.id === id);
    coverage.push(`- [x] [${page.title}](${page.officialUrl}) — \`${page.sourcePath}\``);
  }
  coverage.push('');
}

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(generated, null, 2)}\n`, 'utf8');
await writeFile(coverageFile, `${coverage.join('\n')}\n`, 'utf8');

console.log(`Generated ${pages.length} official pages across ${groups.length} groups.`);
console.log(`Course data: ${outputFile}`);
console.log(`Coverage: ${coverageFile}`);
