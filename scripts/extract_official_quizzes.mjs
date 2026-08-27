import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'official-source', 'huggingface-agents-course', 'units', 'zh-CN');
const manifestPath = path.join(root, 'learning-site', 'app', 'official', 'generated-manifest.json');
const outputPath = path.join(root, 'learning-site', 'app', 'official', 'generated-quizzes.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function readString(objectBody, field) {
  const match = objectBody.match(new RegExp(`${field}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  return match ? JSON.parse(`"${match[1]}"`) : '';
}

const quizzes = {};
for (const filePath of walk(sourceRoot).filter((file) => file.endsWith('.mdx'))) {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.includes('<Question')) continue;

  const relative = path.relative(sourceRoot, filePath).replaceAll('\\', '/');
  const sourcePath = `units/zh-CN/${relative}`;
  const page = manifest.pages.find((item) => item.sourcePath === sourcePath);
  if (!page) throw new Error(`清单中找不到测验页面：${sourcePath}`);

  const questions = [];
  const questionPattern = /<Question\s+choices=\{\[([\s\S]*?)\]\}\s*\/>/g;
  let questionMatch;
  while ((questionMatch = questionPattern.exec(raw))) {
    const prefix = raw.slice(0, questionMatch.index);
    const headingMatches = [...prefix.matchAll(/^###\s+(.+)$/gm)];
    const heading = headingMatches.at(-1);
    const title = heading ? heading[1].trim() : `问题 ${questions.length + 1}`;
    const promptStart = heading ? heading.index + heading[0].length : questionMatch.index;
    const prompt = raw.slice(promptStart, questionMatch.index).trim();
    const choices = [...questionMatch[1].matchAll(/\{([\s\S]*?)\}/g)].map((choiceMatch) => ({
      text: readString(choiceMatch[1], 'text'),
      explanation: readString(choiceMatch[1], 'explain'),
      correct: /correct:\s*true/.test(choiceMatch[1]),
    }));

    if (choices.length < 2 || choices.filter((choice) => choice.correct).length !== 1) {
      throw new Error(`${page.id} / ${title}: 选项解析异常`);
    }
    questions.push({ id: `${page.id}#${questions.length + 1}`, title, prompt, choices });
  }

  quizzes[page.id] = { sourcePath, questions };
}

fs.writeFileSync(outputPath, `${JSON.stringify(quizzes, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(root, 'learning-site', 'public', 'official-quizzes.json'), `${JSON.stringify(quizzes, null, 2)}\n`, 'utf8');
const questionCount = Object.values(quizzes).reduce((total, quiz) => total + quiz.questions.length, 0);
console.log(`已从官方 MDX 提取 ${Object.keys(quizzes).length} 个测验页、${questionCount} 道题：${path.relative(root, outputPath)}`);
