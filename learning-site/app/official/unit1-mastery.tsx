'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const unitOnePageIds = [
  'unit1/introduction',
  'unit1/what-are-agents',
  'unit1/quiz1',
  'unit1/what-are-llms',
  'unit1/messages-and-special-tokens',
  'unit1/tools',
  'unit1/quiz2',
  'unit1/agent-steps-and-structure',
  'unit1/thoughts',
  'unit1/actions',
  'unit1/observations',
  'unit1/dummy-agent-library',
  'unit1/tutorial',
  'unit1/final-quiz',
  'unit1/conclusion',
];

const evidenceItems = [
  { id: 'lab01', group: '实验', label: '完成消息与聊天模板实验，并通过测试' },
  { id: 'lab02', group: '实验', label: '完成工具 schema 与安全执行器实验，并通过测试' },
  { id: 'lab03', group: '实验', label: '完成纯 Python Agent 循环实验，并通过测试' },
  { id: 'lab04', group: '实验', label: '运行真实 smolagents ToolCallingAgent，并看懂事件记录' },
  { id: 'recall-agent', group: '复述', label: '不看正文，用自己的话解释 Agent 与普通聊天模型的区别' },
  { id: 'recall-loop', group: '复述', label: '不看正文画出 Thought → Action → Observation 循环' },
  { id: 'recall-failure', group: '复述', label: '能解释未知工具、参数错误和最大步数三种失败' },
] as const;

const evidenceStorageKey = 'official-agent-course-unit1-evidence-v1';
const quizStorageKey = 'official-agent-course-quiz-progress-v1';

type QuizRecord = { submitted?: boolean; bestScore?: number };

export default function Unit1Mastery({ completedPageIds }: { completedPageIds: string[] }) {
  const [evidence, setEvidence] = useState<string[]>([]);
  const [quizRecords, setQuizRecords] = useState<Record<string, QuizRecord>>({});

  const loadLocalEvidence = useCallback(() => {
    try {
      const savedEvidence = JSON.parse(localStorage.getItem(evidenceStorageKey) || '[]');
      const savedQuizzes = JSON.parse(localStorage.getItem(quizStorageKey) || '{}');
      setEvidence(Array.isArray(savedEvidence) ? savedEvidence : []);
      setQuizRecords(savedQuizzes && typeof savedQuizzes === 'object' ? savedQuizzes : {});
    } catch {
      setEvidence([]);
      setQuizRecords({});
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadLocalEvidence, 0);
    window.addEventListener('focus', loadLocalEvidence);
    window.addEventListener('storage', loadLocalEvidence);
    window.addEventListener('agent-course-progress-changed', loadLocalEvidence);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('focus', loadLocalEvidence);
      window.removeEventListener('storage', loadLocalEvidence);
      window.removeEventListener('agent-course-progress-changed', loadLocalEvidence);
    };
  }, [loadLocalEvidence]);

  const readingCount = unitOnePageIds.filter((id) => completedPageIds.includes(id)).length;
  const quizOne = quizRecords['unit1/quiz1'];
  const quizTwo = quizRecords['unit1/quiz2'];
  const quizOnePassed = Boolean(quizOne?.submitted && (quizOne.bestScore ?? 0) >= 5);
  const quizTwoPassed = Boolean(quizTwo?.submitted && (quizTwo.bestScore ?? 0) >= 4);
  const quizPassedCount = Number(quizOnePassed) + Number(quizTwoPassed);
  const labsCompleted = evidenceItems.filter((item) => item.group === '实验' && evidence.includes(item.id)).length;
  const recallCompleted = evidenceItems.filter((item) => item.group === '复述' && evidence.includes(item.id)).length;
  const anyQuizAttempted = Boolean(quizOne?.submitted || quizTwo?.submitted);

  const masteryState = useMemo(() => {
    if (readingCount === 15 && quizPassedCount === 2 && labsCompleted === 4 && recallCompleted === 3) return { label: '已掌握', tone: 'mastered' };
    if (anyQuizAttempted && quizPassedCount < 2) return { label: '需要复习', tone: 'review' };
    if (labsCompleted === 4) return { label: '实验完成', tone: 'lab' };
    if (quizPassedCount === 2) return { label: '测验通过', tone: 'quiz' };
    if (readingCount === 15) return { label: '已阅读', tone: 'read' };
    if (readingCount > 0 || evidence.length > 0) return { label: '阅读中', tone: 'reading' };
    return { label: '未开始', tone: 'not-started' };
  }, [anyQuizAttempted, evidence.length, labsCompleted, quizPassedCount, readingCount, recallCompleted]);

  function toggleEvidence(id: string) {
    const next = evidence.includes(id) ? evidence.filter((item) => item !== id) : [...evidence, id];
    setEvidence(next);
    localStorage.setItem(evidenceStorageKey, JSON.stringify(next));
  }

  return (
    <section className="unit1-mastery" aria-labelledby="unit1-mastery-title">
      <header>
        <div><span>UNIT 1 掌握度验收</span><h2 id="unit1-mastery-title">不是“看完”，而是拿证据说话</h2></div>
        <strong className={`mastery-state ${masteryState.tone}`}>{masteryState.label}</strong>
      </header>

      <div className="mastery-metrics">
        <MasteryMetric label="官方页面" value={readingCount} total={15} note="需全部标记已阅读" />
        <MasteryMetric label="本地测验" value={quizPassedCount} total={2} note="quiz1 ≥ 5/6，quiz2 ≥ 4/5" />
        <MasteryMetric label="动手实验" value={labsCompleted} total={4} note="包含真实 smolagents" />
        <MasteryMetric label="闭卷复述" value={recallCompleted} total={3} note="能讲清概念和失败" />
      </div>

      <div className="mastery-evidence">
        <h3>完成后再勾选实验与复述证据</h3>
        {evidenceItems.map((item) => (
          <label key={item.id}>
            <input type="checkbox" checked={evidence.includes(item.id)} onChange={() => toggleEvidence(item.id)} />
            <span><i>{item.group}</i>{item.label}</span>
          </label>
        ))}
      </div>

      <p className="mastery-rule">只有 15 页阅读、两次测验、四个实验和三项闭卷复述全部达标，状态才会变成“已掌握”。记录仅保存在当前浏览器。</p>
    </section>
  );
}

function MasteryMetric({ label, value, total, note }: { label: string; value: number; total: number; note: string }) {
  return (
    <article>
      <div><span>{label}</span><strong>{value}/{total}</strong></div>
      <i><b style={{ width: `${Math.min(100, value / total * 100)}%` }} /></i>
      <p>{note}</p>
    </article>
  );
}
