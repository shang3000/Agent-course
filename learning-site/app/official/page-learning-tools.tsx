'use client';

import { useEffect, useMemo, useState } from 'react';

type PageRecord = {
  note: string;
  confusion: string;
  bookmarked: boolean;
  updatedAt: string;
};

type LearningRecords = {
  version: 1;
  pages: Record<string, PageRecord>;
};

const storageKey = 'official-agent-course-learning-records-v1';
const emptyRecord: PageRecord = { note: '', confusion: '', bookmarked: false, updatedAt: '' };

export default function PageLearningTools({ pageId, pageTitle, pages, onNavigate }: { pageId: string; pageTitle: string; pages: Array<{ id: string; title: string }>; onNavigate: (pageId: string) => void }) {
  const [records, setRecords] = useState<LearningRecords>({ version: 1, pages: {} });
  const [draft, setDraft] = useState<PageRecord>(emptyRecord);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const parsed = JSON.parse(localStorage.getItem(storageKey) || '{"version":1,"pages":{}}') as LearningRecords;
        const next = parsed?.version === 1 && parsed.pages ? parsed : { version: 1 as const, pages: {} };
        setRecords(next);
        setDraft(next.pages[pageId] || emptyRecord);
      } catch {
        setRecords({ version: 1, pages: {} });
        setDraft(emptyRecord);
      }
      setSaved(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pageId]);

  const recordedPages = useMemo(() => Object.entries(records.pages).filter(([, record]) => record.note || record.confusion || record.bookmarked), [records.pages]);
  const titleById = useMemo(() => new Map(pages.map((page) => [page.id, page.title])), [pages]);

  function persist(nextRecord: PageRecord) {
    const next: LearningRecords = { version: 1, pages: { ...records.pages, [pageId]: nextRecord } };
    setRecords(next);
    setDraft(nextRecord);
    localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event('agent-course-progress-changed'));
  }

  function saveText() {
    persist({ ...draft, updatedAt: new Date().toISOString() });
    setSaved(true);
  }

  function toggleBookmark() {
    persist({ ...draft, bookmarked: !draft.bookmarked, updatedAt: new Date().toISOString() });
    setSaved(true);
  }

  function exportMarkdown() {
    const sections = recordedPages.map(([id, record]) => {
      const lines = [`## ${titleById.get(id) || id}`, '', `- 页面：${id}`, `- 收藏：${record.bookmarked ? '是' : '否'}`];
      if (record.confusion) lines.push('', '### 没看懂 / 待解决', '', record.confusion);
      if (record.note) lines.push('', '### 我的笔记', '', record.note);
      return lines.join('\n');
    });
    const markdown = ['# Agent 课程本地学习记录', '', ...sections].join('\n\n');
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'agent-course-learning-records.md';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <details className="page-learning-tools">
      <summary>
        <span>我的学习记录</span>
        <strong>{draft.bookmarked ? '已收藏' : '笔记 · 收藏 · 疑问'}</strong>
        <i>{recordedPages.length} 页有记录</i>
      </summary>
      <div className="learning-tools-body">
        <header><div><span>当前页面</span><h2>{pageTitle}</h2></div><button type="button" className={draft.bookmarked ? 'active' : ''} onClick={toggleBookmark}>{draft.bookmarked ? '★ 已收藏' : '☆ 收藏本页'}</button></header>
        <label><span>没看懂的原句、段落或问题</span><textarea value={draft.confusion} onChange={(event) => { setDraft({ ...draft, confusion: event.target.value }); setSaved(false); }} placeholder="复制原句并写下：具体卡在哪里？" rows={3} /></label>
        <label><span>我的笔记</span><textarea value={draft.note} onChange={(event) => { setDraft({ ...draft, note: event.target.value }); setSaved(false); }} placeholder="用自己的话复述，不要只复制正文。" rows={5} /></label>
        <div className="learning-record-actions"><button type="button" onClick={saveText}>保存当前记录</button><span>{saved ? '已保存在当前浏览器' : '尚有未保存修改'}</span><button type="button" className="export" onClick={exportMarkdown} disabled={recordedPages.length === 0}>导出全部 Markdown</button></div>

        {recordedPages.length > 0 && <section className="record-index"><h3>全部本地记录</h3>{recordedPages.map(([id, record]) => <button type="button" key={id} onClick={() => onNavigate(id)}><span>{record.bookmarked ? '★' : record.confusion ? '?' : 'N'}</span><div><strong>{titleById.get(id) || id}</strong><p>{record.confusion || record.note || '已收藏'}</p></div></button>)}</section>}
      </div>
    </details>
  );
}
