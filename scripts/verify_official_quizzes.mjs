import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const quizzes = JSON.parse(fs.readFileSync(path.join(root, 'learning-site', 'app', 'official', 'generated-quizzes.json'), 'utf8'));
const errors = [];
let sourceQuestionCount = 0;
let generatedQuestionCount = 0;

for (const [pageId, quiz] of Object.entries(quizzes)) {
  const sourcePath = path.join(root, 'official-source', 'huggingface-agents-course', quiz.sourcePath);
  if (!fs.existsSync(sourcePath)) {
    errors.push(`${pageId}: 官方源文件不存在`);
    continue;
  }
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const sourceCount = (raw.match(/<Question/g) || []).length;
  sourceQuestionCount += sourceCount;
  generatedQuestionCount += quiz.questions.length;
  if (sourceCount !== quiz.questions.length) errors.push(`${pageId}: 官方 ${sourceCount} 题，生成 ${quiz.questions.length} 题`);

  quiz.questions.forEach((question, questionIndex) => {
    if (!question.title?.trim() || question.choices.length < 2) errors.push(`${pageId} 第 ${questionIndex + 1} 题结构不完整`);
    if (question.choices.filter((choice) => choice.correct).length !== 1) errors.push(`${pageId} 第 ${questionIndex + 1} 题正确答案数量异常`);
    if (question.choices.some((choice) => !choice.text?.trim())) errors.push(`${pageId} 第 ${questionIndex + 1} 题存在空选项`);
  });
}

if (errors.length) {
  console.error(`官方测验校验失败（${errors.length} 项）：`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`官方测验校验通过：${Object.keys(quizzes).length} 页，${generatedQuestionCount}/${sourceQuestionCount} 道题已提取，且每题仅有一个正确答案。`);
