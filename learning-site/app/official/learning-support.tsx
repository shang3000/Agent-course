'use client';

import { useEffect, useMemo, useState } from 'react';

const concepts = [
  ['Agent', '以目标为导向，利用模型观察环境并通过工具行动。', 'LLM · Tool · Memory'],
  ['LLM', '根据消息上下文生成 token、计划或工具调用。', 'Token · Message · Chat Template'],
  ['Tool', '带名称、说明、参数和返回值的受控外部能力。', 'Action · Schema · Observation'],
  ['Action', 'Agent 选择执行的一次环境交互；一个 Action 可以组合多个 Tool。', 'Agent → Action → Tool'],
  ['Message', '用 role 和 content 表示对话上下文、工具请求与观察。', 'System · User · Assistant · Tool'],
  ['Token', '模型实际读取和生成的基本序列单位，影响上下文长度与成本。', 'Text ⇄ Token IDs → Generation'],
  ['Chat Template', '把结构化消息编码成模型训练时期待的 token 格式。', 'Messages → Template → Tokens'],
  ['ReAct', '让推理、行动和环境反馈交替发生。', 'Thought → Action → Observation'],
  ['RAG', '先检索外部资料，再基于证据生成答案。', 'Document → Index → Retriever → Answer'],
  ['State', '工作流当前保存的数据，是节点之间的共享事实。', 'Node · Edge · Checkpoint'],
  ['Node', '读取 State、执行一个可解释步骤，并返回状态更新。', 'State in → Work → State update'],
  ['Edge', '把节点连成图；条件边根据 State 决定下一步。', 'Node → condition → Node / END'],
  ['Trace', '一次完整运行的可观测记录，由多个 Span 组成。', 'Span · Latency · Cost · Error'],
  ['Span', '一次模型、工具、检索或节点操作的开始、结束与结果记录。', 'Trace ⊃ Span · Input · Output · Duration'],
  ['Evaluation', '用数据和标准判断 Agent 是否正确、稳定和高效。', 'Dataset · Metric · Failure Type'],
] as const;

type ReviewItem = { rating: 'forgot' | 'fuzzy' | 'mastered'; nextReview: string; updatedAt: string };
const storageKey = 'official-agent-course-review-v1';

export default function LearningSupport({ pageId, pageTitle, titles, onNavigate }: { pageId: string; pageTitle: string; titles: Record<string, string>; onNavigate: (id: string) => void }) {
  const [reviews, setReviews] = useState<Record<string, ReviewItem>>({});
  const [conceptQuery, setConceptQuery] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setReviews(JSON.parse(localStorage.getItem(storageKey) || '{}')); } catch { setReviews({}); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const dueItems = useMemo(() => Object.entries(reviews).filter(([, item]) => item.nextReview <= new Date().toISOString().slice(0, 10)).sort((a, b) => a[1].nextReview.localeCompare(b[1].nextReview)), [reviews]);
  const filteredConcepts = concepts.filter((concept) => concept.join(' ').toLowerCase().includes(conceptQuery.toLowerCase()));

  function rate(rating: ReviewItem['rating']) {
    const days = rating === 'forgot' ? 1 : rating === 'fuzzy' ? 3 : 7;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const next = { ...reviews, [pageId]: { rating, nextReview: date.toISOString().slice(0, 10), updatedAt: new Date().toISOString() } };
    setReviews(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  return (
    <details className="learning-support">
      <summary><span>复习与概念工具</span><strong>{reviews[pageId] ? `本页：${reviews[pageId].rating === 'forgot' ? '没想起来' : reviews[pageId].rating === 'fuzzy' ? '模糊' : '掌握'}` : '尚未自评'}</strong><i>{dueItems.length} 页待复习</i></summary>
      <div className="learning-support-body">
        <section className="recall-rating"><span>合上正文，用自己的话复述：{pageTitle}</span><div><button onClick={() => rate('forgot')}>没想起来 · 明天</button><button onClick={() => rate('fuzzy')}>有点模糊 · 3天后</button><button onClick={() => rate('mastered')}>能够讲清 · 7天后</button></div></section>
        {dueItems.length > 0 && <section className="review-queue"><h3>今天需要复习</h3>{dueItems.slice(0, 8).map(([id, item]) => <button key={id} onClick={() => onNavigate(id)}><strong>{titles[id] || id}</strong><span>{item.rating === 'forgot' ? '上次没想起来' : item.rating === 'fuzzy' ? '上次比较模糊' : '巩固复习'}</span></button>)}</section>}
        <section className="concept-map"><header><div><span>核心概念关系</span><h3>先看连接，再背定义</h3></div><input value={conceptQuery} onChange={(event) => setConceptQuery(event.target.value)} placeholder="搜索概念" /></header><div>{filteredConcepts.map(([term, explanation, relation]) => <article key={term}><strong>{term}</strong><p>{explanation}</p><code>{relation}</code></article>)}</div></section>
      </div>
    </details>
  );
}
