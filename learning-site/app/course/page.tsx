'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { courseLessons, units } from './course-data';

const existingLessons = [
  { id: 'lesson-1', number: '01', title: '什么是智能体？', href: '/', storage: 'agent-unit1-lesson1' },
  { id: 'lesson-2', number: '02', title: 'LLM、Token 与消息', href: '/unit1/llm', storage: 'agent-unit1-lesson2' },
];

export default function CourseHub() {
  const [activeId, setActiveId] = useState(courseLessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hashId = window.location.hash.replace('#', '');
      if (courseLessons.some((lesson) => lesson.id === hashId)) setActiveId(hashId);
      const saved = courseLessons.filter((lesson) => localStorage.getItem(`agent-course-${lesson.id}`) === 'done').map((lesson) => lesson.id);
      const existing = existingLessons.filter((lesson) => localStorage.getItem(lesson.storage) === 'done').map((lesson) => lesson.id);
      setCompleted([...existing, ...saved]);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHistory = () => {
      const id = window.location.hash.replace('#', '');
      if (courseLessons.some((item) => item.id === id)) {
        setActiveId(id);
        setQuizChoice(null);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('popstate', handleHistory);
    return () => window.removeEventListener('popstate', handleHistory);
  }, []);

  const lesson = useMemo(() => courseLessons.find((item) => item.id === activeId) || courseLessons[0], [activeId]);
  const currentIndex = courseLessons.findIndex((item) => item.id === lesson.id);
  const totalDone = completed.length;
  const totalLessons = courseLessons.length + existingLessons.length;

  function selectLesson(id: string) {
    if (id === activeId) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    setActiveId(id);
    setQuizChoice(null);
    window.history.pushState(null, '', `/course#${id}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function toggleComplete() {
    const key = `agent-course-${lesson.id}`;
    const isDone = completed.includes(lesson.id);
    if (isDone) {
      localStorage.removeItem(key);
      setCompleted((items) => items.filter((id) => id !== lesson.id));
    } else {
      localStorage.setItem(key, 'done');
      setCompleted((items) => [...items, lesson.id]);
    }
  }

  return (
    <main className="course-hub">
      <aside className="course-nav">
        <Link className="brand" href="/"><span className="brand-mark">A</span><div><strong>Agent 伴读</strong><small>完整课程中心</small></div></Link>
        <select className="mobile-course-select" value={activeId} aria-label="选择课程主题" onChange={(event) => {
          const id = event.target.value;
          if (id === 'lesson-1') window.location.href = '/';
          else if (id === 'lesson-2') window.location.href = '/unit1/llm';
          else selectLesson(id);
        }}>
          <option value="lesson-1">01 · 什么是智能体？</option>
          <option value="lesson-2">02 · LLM、Token 与消息</option>
          {courseLessons.map((item) => <option key={item.id} value={item.id}>{item.number} · {item.title}</option>)}
        </select>
        <div className="hub-progress">
          <div><span>全课程进度</span><strong>{totalDone}/{totalLessons}</strong></div>
          <i><b style={{ width: `${(totalDone / totalLessons) * 100}%` }} /></i>
          <p>完成状态只保存在当前浏览器</p>
        </div>
        <nav>
          <p className="course-nav-title">深度精讲</p>
          {existingLessons.map((item) => <Link key={item.id} href={item.href} className="course-link"><span>{item.number}</span><p>{item.title}</p><i>{completed.includes(item.id) ? '✓' : ''}</i></Link>)}
          {units.map((unit) => <div className="course-unit" key={unit.label}>
            <p className="course-nav-title">{unit.label}</p>
            {unit.lessons.map((id) => {
              const item = courseLessons.find((entry) => entry.id === id)!;
              return <button key={id} className={activeId === id ? 'active' : ''} onClick={() => selectLesson(id)}><span>{item.number}</span><p>{item.title}</p><i>{completed.includes(id) ? '✓' : ''}</i></button>;
            })}
          </div>)}
        </nav>
      </aside>

      <section className="course-reader">
        <header className="course-topbar">
          <div><span className="live-dot" />官方中文课程伴读 · 完整版</div>
          <div className="course-toplinks"><Link href="/">第一课</Link><Link href="/unit1/llm">第二课</Link><a href="https://huggingface.co/learn/agents-course/zh-CN" target="_blank" rel="noreferrer">官方课程 ↗</a></div>
        </header>

        <article className={`course-article accent-${lesson.accent}`} aria-live="polite">
          <section className="course-hero">
            <div className="course-breadcrumb"><span>{lesson.unit}</span><i>/</i><b>{lesson.number}</b></div>
            <h1>{lesson.title}</h1>
            <p>{lesson.subtitle}</p>
            <div className="coverage"><span>覆盖官方章节</span>{lesson.officialSections.map((name) => <i key={name}>{name}</i>)}</div>
          </section>

          <section className="plain-card"><span>先说人话</span><p>{lesson.plain}</p></section>

          <section className="course-block">
            <div className="block-title"><span>01</span><div><p>核心概念</p><h2>先抓住这三件事</h2></div></div>
            <div className="concept-cards">{lesson.concepts.map((concept, index) => <div key={concept.title}><span>0{index + 1}</span><h3>{concept.title}</h3><p>{concept.body}</p></div>)}</div>
          </section>

          <section className="course-block">
            <div className="block-title"><span>02</span><div><p>工作流程</p><h2>把过程连起来</h2></div></div>
            <div className="lesson-flow">{lesson.flow.map((step, index) => <div key={step.label}><span>{index + 1}</span><h3>{step.label}</h3><p>{step.body}</p>{index < lesson.flow.length - 1 && <i>→</i>}</div>)}</div>
          </section>

          <section className="course-code">
            <div className="course-code-copy"><span>03 · 代码骨架</span><h2>先读结构，不急着背 API</h2><p>{lesson.codeNote}</p></div>
            <div className="course-code-panel"><div><span>concept.py</span><i /><i /><i /></div><pre><code>{lesson.code}</code></pre></div>
          </section>

          <section className="pitfall-section">
            <div><span>04 · 易踩坑</span><h2>知道哪里会翻车</h2></div>
            <ul>{lesson.pitfalls.map((pitfall, index) => <li key={pitfall}><span>0{index + 1}</span><p>{pitfall}</p></li>)}</ul>
          </section>

          <section className="hub-quiz">
            <span>05 · 理解检查</span><h2>{lesson.quiz.question}</h2>
            <div>{lesson.quiz.options.map((option, index) => <button key={option} onClick={() => setQuizChoice(index)} className={`${quizChoice === index ? 'chosen' : ''} ${quizChoice !== null && index === lesson.quiz.correct ? 'correct' : ''} ${quizChoice === index && index !== lesson.quiz.correct ? 'wrong' : ''}`}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p>{quizChoice !== null && index === lesson.quiz.correct && <i>正确</i>}</button>)}</div>
            {quizChoice !== null && <aside className={quizChoice === lesson.quiz.correct ? 'right' : ''}><strong>{quizChoice === lesson.quiz.correct ? '答对了。' : '还差一点。'}</strong><p>{lesson.quiz.explain}</p></aside>}
          </section>

          <section className="course-finish">
            <div><span>本课完成条件</span><p>能复述“先说人话”，解释四步流程，并答对理解检查。</p><a href={lesson.source} target="_blank" rel="noreferrer">查看对应官方原文 ↗</a></div>
            <button onClick={toggleComplete} className={completed.includes(lesson.id) ? 'done' : ''}>{completed.includes(lesson.id) ? '已完成 · 点击撤销' : '标记为已完成'}</button>
          </section>

          <footer className="course-pager">
            <button disabled={currentIndex === 0} onClick={() => selectLesson(courseLessons[currentIndex - 1]?.id)}>← 上一主题</button>
            <span>{currentIndex + 1} / {courseLessons.length}</span>
            <button disabled={currentIndex === courseLessons.length - 1} onClick={() => selectLesson(courseLessons[currentIndex + 1]?.id)}>下一主题 →</button>
          </footer>
        </article>
      </section>
    </main>
  );
}
