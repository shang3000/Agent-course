import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'learning-site');
const manifest = JSON.parse(fs.readFileSync(path.join(siteRoot, 'app', 'official', 'generated-manifest.json'), 'utf8'));
const guidePath = path.join(siteRoot, 'app', 'official', 'learning-guides.json');
const guides = JSON.parse(fs.readFileSync(guidePath, 'utf8'));

function clean(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\[[^\]]+\]\([^\)]+\)/g, ' ').replace(/[#*_`>|{}]/g, ' ').replace(/\s+/g, ' ').trim();
}

for (const page of manifest.pages) {
  if (guides[page.id]) continue;
  const content = JSON.parse(fs.readFileSync(path.join(siteRoot, 'public', 'official-content', `${page.id}.json`), 'utf8'));
  const headings = [...content.readable.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => clean(match[1])).filter(Boolean).slice(0, 5);
  const paragraphs = content.readable.split(/\r?\n\r?\n/).map(clean).filter((item) => item.length > 45 && !item.startsWith('官方测验选项')).slice(0, 2);
  const concepts = headings.length ? headings : [page.title];
  const hasCode = page.stats.codeBlocks > 0;
  guides[page.id] = {
    objectives: [`理解“${page.title}”在 ${page.group} 中解决的核心问题`, ...concepts.slice(0, 2).map((heading) => `能用自己的话解释“${heading}”`)],
    prerequisites: [`先理解本单元在完整 Agent 数据流中的位置`, hasCode ? '能够阅读基础 Python，并准备在本地复现代码' : '能够区分概念定义、示例与实际系统行为'],
    plain: `这一页的重点是把“${page.title}”放回完整 Agent 系统中理解。${paragraphs.join(' ').slice(0, 330)}`,
    keyConcepts: concepts.slice(0, 4).map((term) => ({ term, explanation: `这是本页官方正文的核心小节；阅读时要能说明它与“${page.title}”以及前后步骤的关系。` })),
    misconceptions: [`不要只记住“${page.title}”这个名称，而忽略它的输入、输出和适用边界。`, hasCode ? `代码块能读懂不等于能够运行；依赖、输入、输出和失败路径都必须验证。` : `官方示例用于解释概念，不代表所有真实项目都应采用完全相同的设计。`],
    practice: [hasCode ? `选择本页 ${page.stats.codeBlocks} 个代码块中的一个，在本地标出依赖、输入、输出和可能失败的位置。` : `画出“${page.title}”与 ${concepts.slice(0, 3).join('、')} 的关系。`, `把官方案例替换成你自己的学习或校园场景，检查概念是否仍然成立。`],
    recall: [`不看正文，“${page.title}”解决什么问题？`, ...concepts.slice(0, 2).map((heading) => `“${heading}”在系统中接收什么、产生什么？`)],
    mastery: [`能在不照抄正文的情况下解释“${page.title}”`, hasCode ? '能运行或手工追踪至少一个代码示例，并解释失败结果' : '能将本页概念迁移到一个新案例', `能指出本页内容与前后课程页面的连接`],
  };
}

fs.writeFileSync(guidePath, `${JSON.stringify(guides, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(siteRoot, 'public', 'learning-guides.json'), `${JSON.stringify(guides, null, 2)}\n`, 'utf8');
console.log(`学习层已生成：${Object.keys(guides).length}/${manifest.pages.length} 页。原有人工 Unit 1 学习层保持不变。`);
