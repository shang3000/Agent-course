'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import course from './generated-manifest.json';
import learningGuides from './learning-guides.json';
import generatedQuizzes from './generated-quizzes.json';
import OfficialQuiz, { type OfficialQuizData } from './official-quiz';

type LearningGuide = (typeof learningGuides)[keyof typeof learningGuides];

type CoursePage = (typeof course.pages)[number];

export default function OfficialCourseReader() {
  const [activeId, setActiveId] = useState(course.pages[0].id);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'read' | 'source'>('read');
  const [completed, setCompleted] = useState<string[]>([]);
  const [contentState, setContentState] = useState<
    { pageId: string; status: 'ready'; readable: string; raw: string } |
    { pageId: string; status: 'error' } |
    null
  >(null);

  useEffect(() => {
    const load = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (course.pages.some((page) => page.id === hash)) setActiveId(hash);
      try {
        const saved = JSON.parse(localStorage.getItem('official-agent-course-progress') || '[]');
        if (Array.isArray(saved)) setCompleted(saved);
      } catch {
        setCompleted([]);
      }
    };
    const timer = window.setTimeout(load, 0);
    window.addEventListener('popstate', load);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('popstate', load);
    };
  }, []);

  const page = course.pages.find((item) => item.id === activeId) || course.pages[0];
  const pageIndex = course.pages.findIndex((item) => item.id === page.id);
  const guide = (learningGuides as Record<string, LearningGuide>)[page.id];
  const quiz = (generatedQuizzes as Record<string, OfficialQuizData>)[page.id];
  const reviewPage = course.pages[Math.max(0, pageIndex - 1)];

  useEffect(() => {
    let cancelled = false;
    fetch(page.contentUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((value) => { if (!cancelled) setContentState({ pageId: page.id, status: 'ready', ...value }); })
      .catch(() => { if (!cancelled) setContentState({ pageId: page.id, status: 'error' }); });
    return () => { cancelled = true; };
  }, [page.contentUrl, page.id]);

  useEffect(() => {
    document.title = `${page.title} · Agent 伴读`;
  }, [page.title]);

  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return course.groups.map((group) => ({
      ...group,
      pages: group.pageIds
        .map((id) => course.pages.find((item) => item.id === id)!)
        .filter((item) => !needle || `${item.title} ${item.group} ${item.sourcePath}`.toLowerCase().includes(needle)),
    })).filter((group) => group.pages.length > 0);
  }, [query]);

  function selectPage(next: CoursePage) {
    setActiveId(next.id);
    setMode('read');
    const base = window.location.pathname === '/official' ? '/official' : '/';
    window.history.pushState(null, '', `${base}#${next.id}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function toggleComplete() {
    const next = completed.includes(page.id)
      ? completed.filter((id) => id !== page.id)
      : [...completed, page.id];
    setCompleted(next);
    localStorage.setItem('official-agent-course-progress', JSON.stringify(next));
  }

  return (
    <main className="official-shell">
      <aside className="official-sidebar">
        <Link className="brand official-brand" href="/"><span className="brand-mark">A</span><div><strong>Agent 伴读</strong><small>官方完整内容模式</small></div></Link>

        <div className="source-lock">
          <div><span>官方源码覆盖</span><strong>{course.pageCount}/{course.pageCount}</strong></div>
          <i><b /></i>
          <p>固定版本 <code>{course.source.commit.slice(0, 8)}</code></p>
        </div>

        <label className="official-search">
          <span>搜索 75 页课程</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：工具、RAG、LangGraph" />
        </label>

        <nav className="official-toc" aria-label="官方课程完整目录">
          {filteredGroups.map((group) => (
            <details key={group.title} open={!query || group.pageIds.includes(page.id)}>
              <summary><span>{group.title}</span><i>{group.pages.length}</i></summary>
              {group.pages.map((item) => (
                <button key={item.id} className={item.id === page.id ? 'active' : ''} onClick={() => selectPage(item)}>
                  <span>{String(item.index + 1).padStart(2, '0')}</span>
                  <p>{item.title}</p>
                  <i>{completed.includes(item.id) ? '✓' : ''}</i>
                </button>
              ))}
            </details>
          ))}
        </nav>
      </aside>

      <section className="official-reader">
        <header className="official-topbar">
          <div className="official-mobile-title"><strong>官方完整课程</strong><span>{pageIndex + 1}/{course.pageCount}</span></div>
          <div className="official-status"><span className="live-dot" />官方中文源码 · 未删减</div>
          <div className="official-toplinks">
            <Link href="/course">14 主题速览</Link>
            <a href={course.source.repository} target="_blank" rel="noreferrer">官方 GitHub ↗</a>
          </div>
        </header>

        <div className="official-mobile-picker">
          <select value={page.id} onChange={(event) => selectPage(course.pages.find((item) => item.id === event.target.value)!)} aria-label="选择官方课程页面">
            {course.pages.map((item) => <option key={item.id} value={item.id}>{item.index + 1}. {item.title}</option>)}
          </select>
        </div>

        <article className="official-article">
          <header className="official-page-head">
            <div className="source-badges"><span>官方原文</span><i>第 {pageIndex + 1} / {course.pageCount} 页</i><i>{page.stats.characters.toLocaleString()} 字符</i><i>{page.stats.codeBlocks} 个代码块</i></div>
            <p>{page.group}</p>
            <h1>{page.title}</h1>
            <div className="source-actions">
              <a href={page.officialUrl} target="_blank" rel="noreferrer">官网对应页面 ↗</a>
              <a href={page.githubUrl} target="_blank" rel="noreferrer">固定版本源码 ↗</a>
              <code>{page.sourcePath}</code>
            </div>
          </header>

          <aside className="integrity-note">
            <strong>内容完整性说明</strong>
            <p>下面的“格式化阅读”来自项目内保存的官方 MDX，只调整显示方式；切换“原始 MDX”可以逐字符核对。Hinata 的解释单独放在批注卡中，不会替换官方正文。</p>
          </aside>

          <div className="reading-toolbar" role="tablist" aria-label="正文显示模式">
            <button className={mode === 'read' ? 'active' : ''} onClick={() => setMode('read')} role="tab" aria-selected={mode === 'read'}>格式化阅读</button>
            <button className={mode === 'source' ? 'active' : ''} onClick={() => setMode('source')} role="tab" aria-selected={mode === 'source'}>原始 MDX</button>
          </div>

          {guide && mode === 'read' && (
            <section className="learning-guide" aria-labelledby="learning-guide-title">
              <header>
                <span>HINATA 学习层 · 不替代官方正文</span>
                <h2 id="learning-guide-title">先学会，再往下翻</h2>
                <p>{guide.plain}</p>
              </header>

              <div className="learning-guide-overview">
                <GuideList title="本页目标" items={guide.objectives} />
                <GuideList title="开始前应会" items={guide.prerequisites} />
              </div>

              <div className="learning-concepts">
                <h3>关键概念</h3>
                <div>
                  {guide.keyConcepts.map((concept) => (
                    <article key={concept.term}><strong>{concept.term}</strong><p>{concept.explanation}</p></article>
                  ))}
                </div>
              </div>

              <div className="learning-guide-grid">
                <GuideList title="容易误解" items={guide.misconceptions} tone="warning" />
                <GuideList title="动手任务" items={guide.practice} tone="action" />
                <GuideList title="合上正文后回答" items={guide.recall} tone="recall" />
                <GuideList title="做到这些才算掌握" items={guide.mastery} tone="mastery" />
              </div>
            </section>
          )}

          {contentState?.pageId === page.id && contentState.status === 'error' ? (
            <div className="official-load-state error"><strong>正文加载失败</strong><p>请确认本地服务仍在运行，然后刷新页面。</p></div>
          ) : contentState?.pageId !== page.id || contentState.status !== 'ready' ? (
            <div className="official-load-state"><strong>正在读取官方原文…</strong><p>目录已经就绪，正文文件正在从本地载入。</p></div>
          ) : mode === 'read' ? quiz ? (
            <OfficialQuizReading
              readable={contentState.readable}
              pageId={page.id}
              quiz={quiz}
              reviewLabel={reviewPage.title}
              onReview={() => selectPage(reviewPage)}
            />
          ) : (
            <div className="official-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{contentState.readable}</ReactMarkdown>
            </div>
          ) : (
            <pre className="official-source-code"><code>{contentState.raw}</code></pre>
          )}

          <section className="official-complete">
            <div><span>本地学习进度</span><strong>{completed.length}/{course.pageCount} 页完成</strong><p>完成状态只保存在当前浏览器，不会修改官方原文。</p></div>
            <button className={completed.includes(page.id) ? 'done' : ''} onClick={toggleComplete}>{completed.includes(page.id) ? '已完成 · 点击撤销' : '完成本页'}</button>
          </section>

          <footer className="official-pager">
            <button disabled={pageIndex === 0} onClick={() => selectPage(course.pages[pageIndex - 1])}>← 上一页</button>
            <span>{pageIndex + 1} / {course.pageCount}</span>
            <button disabled={pageIndex === course.pageCount - 1} onClick={() => selectPage(course.pages[pageIndex + 1])}>下一页 →</button>
          </footer>
        </article>
      </section>
    </main>
  );
}

function GuideList({ title, items, tone = 'default' }: { title: string; items: readonly string[]; tone?: 'default' | 'warning' | 'action' | 'recall' | 'mastery' }) {
  return (
    <section className={`guide-list ${tone}`}>
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

function OfficialQuizReading({ readable, pageId, quiz, reviewLabel, onReview }: { readable: string; pageId: string; quiz: OfficialQuizData; reviewLabel: string; onReview: () => void }) {
  const firstQuestion = readable.search(/^###\s+/m);
  const lastAnswers = readable.lastIndexOf('#### 官方测验选项与解析');
  const tailMatch = lastAnswers >= 0 ? readable.slice(lastAnswers).match(/\r?\n---\r?\n/) : null;
  const tailStart = tailMatch?.index === undefined ? readable.length : lastAnswers + tailMatch.index + tailMatch[0].length;
  const intro = firstQuestion >= 0 ? readable.slice(0, firstQuestion) : readable;
  const outro = readable.slice(tailStart);

  return (
    <>
      <div className="official-markdown quiz-fragment"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{intro}</ReactMarkdown></div>
      <OfficialQuiz key={pageId} pageId={pageId} data={quiz} reviewLabel={reviewLabel} onReview={onReview} />
      {outro.trim() && <div className="official-markdown quiz-fragment outro"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{outro}</ReactMarkdown></div>}
    </>
  );
}
