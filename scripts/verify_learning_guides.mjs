import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'learning-site', 'app', 'official', 'generated-manifest.json');
const guidesPath = path.join(root, 'learning-site', 'app', 'official', 'learning-guides.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));
const requiredArrays = ['objectives', 'prerequisites', 'keyConcepts', 'misconceptions', 'practice', 'recall', 'mastery'];
const unitOnePages = manifest.pages.filter((page) => page.id.startsWith('unit1/'));
const errors = [];

for (const page of unitOnePages) {
  const guide = guides[page.id];
  if (!guide) {
    errors.push(`${page.id}: 缺少学习层`);
    continue;
  }

  if (typeof guide.plain !== 'string' || !guide.plain.trim()) {
    errors.push(`${page.id}: 缺少人话解释`);
  }

  for (const field of requiredArrays) {
    if (!Array.isArray(guide[field]) || guide[field].length === 0) {
      errors.push(`${page.id}: ${field} 必须是非空数组`);
    }
  }

  if (Array.isArray(guide.keyConcepts)) {
    guide.keyConcepts.forEach((concept, index) => {
      if (!concept?.term?.trim() || !concept?.explanation?.trim()) {
        errors.push(`${page.id}: keyConcepts[${index}] 缺少术语或解释`);
      }
    });
  }

  for (const field of requiredArrays.filter((field) => field !== 'keyConcepts')) {
    if (Array.isArray(guide[field]) && guide[field].some((item) => typeof item !== 'string' || !item.trim())) {
      errors.push(`${page.id}: ${field} 包含空白项`);
    }
  }
}

const unknownIds = Object.keys(guides).filter((id) => !manifest.pages.some((page) => page.id === id));
if (unknownIds.length) errors.push(`学习层包含不存在的页面：${unknownIds.join(', ')}`);

if (errors.length) {
  console.error(`学习层校验失败（${errors.length} 项）：`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`学习层校验通过：Unit 1 ${unitOnePages.length}/${unitOnePages.length} 页，8 类学习字段全部非空。`);
