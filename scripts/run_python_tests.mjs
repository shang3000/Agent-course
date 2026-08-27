import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const candidates = process.platform === 'win32'
  ? [
      process.env.AGENT_COURSE_PYTHON && [process.env.AGENT_COURSE_PYTHON, []],
      [path.join(root, '.venv', 'Scripts', 'python.exe'), []],
      ['py', ['-3.12']],
      ['py', ['-3.11']],
      ['python', []],
    ]
  : [
      process.env.AGENT_COURSE_PYTHON && [process.env.AGENT_COURSE_PYTHON, []],
      [path.join(root, '.venv', 'bin', 'python'), []],
      ['python3', []],
      ['python', []],
    ];

let selected;
for (const candidate of candidates.filter(Boolean)) {
  const [command, prefix] = candidate;
  if (path.isAbsolute(command) && !existsSync(command)) continue;
  const probe = spawnSync(command, [...prefix, '--version'], { cwd: root, encoding: 'utf8' });
  if (probe.status === 0) { selected = { command, prefix }; break; }
}

if (!selected) {
  console.error('没有找到可用的 Python 3.11/3.12。请先按 PYTHON_SETUP.md 重建 .venv，然后重试。');
  process.exitCode = 1;
} else {
  console.log(`Python 测试解释器：${selected.command} ${selected.prefix.join(' ')}`.trim());
  const suites = [
    ['-m', 'unittest', 'discover', '-s', 'tests', '-v'],
    ['-m', 'unittest', 'discover', '-s', 'exercises', '-p', 'test_*.py', '-t', '.', '-v'],
  ];
  for (const args of suites) {
    const result = spawnSync(selected.command, [...selected.prefix, ...args], { cwd: root, stdio: 'inherit' });
    if (result.status !== 0) { process.exitCode = result.status || 1; break; }
  }
}
