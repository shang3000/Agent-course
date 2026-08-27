import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'learning-site', 'app', 'official', 'generated-manifest.json'), 'utf8'));
const headers = { 'User-Agent': 'agent-course-local-update-check', Accept: 'application/vnd.github+json' };
const response = await fetch('https://api.github.com/repos/huggingface/agents-course/commits/main', { headers });
if (!response.ok) throw new Error(`GitHub 更新检查失败：HTTP ${response.status}`);
const latest = await response.json();
console.log(`本地固定提交：${manifest.source.commit}`);
console.log(`官方最新提交：${latest.sha}`);
if (latest.sha === manifest.source.commit) {
  console.log('当前已是固定分支最新版本。');
} else {
  const comparisonResponse = await fetch(`https://api.github.com/repos/huggingface/agents-course/compare/${manifest.source.commit}...main`, { headers });
  if (!comparisonResponse.ok) throw new Error(`GitHub 差异检查失败：HTTP ${comparisonResponse.status}`);
  const comparison = await comparisonResponse.json();
  const changedPages = (comparison.files || [])
    .filter((file) => file.filename.startsWith('units/zh-CN/') && /\.mdx?$/.test(file.filename))
    .map((file) => ({ path: file.filename, status: file.status, additions: file.additions, deletions: file.deletions, patch: file.patch || '差异过大，GitHub API 未返回行级 patch' }));
  const report = {
    checkedAt: new Date().toISOString(), baseCommit: manifest.source.commit, latestCommit: latest.sha,
    aheadBy: comparison.ahead_by, changedPages,
    safety: '本报告只读。同步前先审查差异；官方 raw 与本地学习层分开存储，浏览器学习记录不会被同步脚本覆盖。',
  };
  const reportDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'official-update-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`发现 ${comparison.ahead_by} 个新提交，其中 ${changedPages.length} 个中文课程文件变化。`);
  for (const page of changedPages) console.log(`- ${page.status}: ${page.path} (+${page.additions}/-${page.deletions})`);
  console.log('完整行级差异已写入 reports/official-update-report.json；本命令不会执行同步。');
}
