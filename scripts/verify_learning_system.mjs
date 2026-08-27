import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'learning-site', 'app', 'official', 'generated-manifest.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(root, 'learning-site', 'app', 'official', 'learning-guides.json'), 'utf8'));
const search = JSON.parse(fs.readFileSync(path.join(root, 'learning-site', 'public', 'search-index.json'), 'utf8'));
const errors = [];
if (manifest.pages.length !== 75) errors.push('官方页面不是 75 页');
if (Object.keys(guides).length !== manifest.pages.length) errors.push('学习层未覆盖全部页面');
if (search.length !== manifest.pages.length) errors.push('搜索索引未覆盖全部页面');
for (const item of search) {
  if (!item.sections.some((section) => section.kind === '官方正文')) errors.push(`${item.id} 搜索索引缺官方正文`);
  if (!item.sections.some((section) => section.kind === 'Hinata 学习层')) errors.push(`${item.id} 搜索索引缺学习层`);
}
const formalLabs = ['lab01_messages', 'lab02_tools', 'lab03_agent_loop', 'lab04_smolagents'];
for (const lab of formalLabs) for (const file of ['README.md', 'starter.py', 'solution.py', 'test_lab.py']) if (!fs.existsSync(path.join(root, 'exercises', 'unit1', lab, file))) errors.push(`${lab} 缺少 ${file}`);
for (const [directory, files] of [
  ['exercises/unit2/lab04b_codeagent', ['README.md', 'starter.py', 'solution.py', 'test_lab.py']],
  ['exercises/unit2/lab05_llamaindex', ['README.md', 'starter.py', 'solution.py', 'test_lab.py']],
  ['exercises/unit2/lab06_langgraph', ['README.md', 'starter.py', 'solution.py', 'test_lab.py']],
  ['exercises/unit3', ['README.md', 'starter.py', 'solution.py', 'test_agentic_rag.py']],
  ['exercises/unit4', ['README.md', 'starter.py', 'solution.py', 'test_evaluation.py']],
  ['exercises/bonus/function_calling_finetune', ['README.md', 'starter.py', 'solution.py', 'test_lab.py']],
  ['exercises/bonus/observability', ['README.md', 'starter.py', 'solution.py', 'test_lab.py']],
  ['exercises/bonus/pokemon_agent', ['README.md', 'starter.py', 'solution.py', 'test_lab.py']],
  ['exercises/capstone', ['README.md', 'starter.py', 'solution.py', 'test_capstone.py']],
]) for (const file of files) if (!fs.existsSync(path.join(root, directory, file))) errors.push(`${directory} 缺少 ${file}`);
const supportSource = fs.readFileSync(path.join(root, 'learning-site', 'app', 'official', 'learning-support.tsx'), 'utf8');
for (const concept of ['Agent', 'LLM', 'Tool', 'Action', 'Message', 'Token', 'Chat Template', 'ReAct', 'RAG', 'State', 'Node', 'Edge', 'Trace', 'Span', 'Evaluation']) if (!supportSource.includes(`['${concept}'`)) errors.push(`概念词典缺少 ${concept}`);
for (const file of ['打开课程.bat', 'scripts/cache_official_assets.mjs', 'scripts/check_official_updates.mjs']) if (!fs.existsSync(path.join(root, file))) errors.push(`可靠性工具缺少 ${file}`);
if (errors.length) { errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log('学习系统总体验证通过：75页、学习层、搜索、15个核心概念、分阶段实验和维护工具齐全。');
