'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const candidates = [
  { token: '巴黎', score: 82, tone: 'best' },
  { token: '法国', score: 9, tone: 'mid' },
  { token: '一座', score: 6, tone: 'low' },
  { token: '香蕉', score: 3, tone: 'low' },
];

const messages = [
  { role: 'system', label: '系统消息', content: '你是一位耐心的 Python 助教。' },
  { role: 'user', label: '用户消息', content: '用一句话解释列表推导式。' },
  { role: 'assistant', label: '助手消息', content: '列表推导式是用简洁语法创建列表的方法。' },
];

export default function LLMLesson() {
  const [picked, setPicked] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'raw'>('chat');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCompleted(localStorage.getItem('agent-unit1-lesson2') === 'done'), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function finishLesson() {
    localStorage.setItem('agent-unit1-lesson2', 'done');
    setCompleted(true);
  }

  return (
    <main className="app-shell llm-page">
      <aside className="sidebar">
        <Link className="brand" href="/"><span className="brand-mark">A</span><div><strong>Agent 伴读</strong><small>Hinata × 泉</small></div></Link>
        <div className="progress-card">
          <div className="progress-label"><span>Unit 1 · 第二课</span><strong>{completed ? '100%' : '学习中'}</strong></div>
          <div className="progress-track"><span style={{ width: completed ? '100%' : '45%' }} /></div>
          <p>今天弄懂：模型眼中的文字和聊天，与你看到的并不一样</p>
        </div>
        <nav aria-label="课程章节">
          <p className="nav-heading">第 1 单元 · 智能体基础</p>
          <Link className="nav-item" href="/unit1/agent"><span>01</span>什么是智能体？</Link>
          <Link className="nav-item active" href="/unit1/llm"><span>02</span>LLM、Token 与消息</Link>
          <Link className="nav-item" href="/#unit1-tools"><span>03</span>工具与行动</Link>
          <Link className="nav-item" href="/unit1/agent#loop"><span>04</span>Agent 工作循环</Link>
          <Link className="nav-item" href="/#unit1-first-agent"><span>05</span>第一个智能体</Link>
        </nav>
        <div className="sidebar-note blue-note"><span>本节目标</span><p>能解释 Token、下一个 Token 预测、消息角色和聊天模板。</p></div>
      </aside>

      <section className="content">
        <header className="topbar"><span className="eyebrow">UNIT 1 · LLM、TOKEN 与消息</span><div className="top-actions"><Link className="back-link" href="/unit1/agent">← 第一课</Link><Link className="back-link" href="/">完整课程中心 →</Link></div></header>
        <article>
          <section className="llm-hero">
            <div className="llm-title"><span className="chapter-pill">UNIT 1 · 第二课</span><h1>LLM 看见的世界，<br />其实是一串 Token</h1><p>你看到的是一句完整的话；模型看到的是编号序列。它每次只做一件看似简单、实际很强大的事：<strong>猜下一个 Token。</strong></p></div>
            <div className="token-stage" aria-label="文本变成 token 的示意图">
              <div className="human-view"><span>你看到</span><p>The agent is <mark>interesting</mark>.</p></div>
              <div className="transform-arrow"><span>Tokenizer</span>↓</div>
              <div className="model-view"><span>模型看到</span><div><i>The</i><i> agent</i><i> is</i><i className="accent"> interest</i><i className="accent-two">ing</i><i>.</i></div><small>示意拆分；真实结果取决于具体模型的 tokenizer</small></div>
            </div>
          </section>

          <section className="prediction-section">
            <div className="section-heading"><span className="section-number">01</span><div><p>核心任务</p><h2>所谓“生成”，就是连续猜下去</h2></div></div>
            <p className="section-intro">模型读取前面的所有 Token，为下一个位置计算一组可能性。点一个候选词，看看选错和选对分别意味着什么。</p>
            <div className="prediction-lab">
              <div className="prompt-line"><span>输入序列</span><p>法国的首都是 <b className={picked ? 'filled' : ''}>{picked || '____'}</b></p></div>
              <div className="candidate-list">
                {candidates.map((item) => <button key={item.token} onClick={() => setPicked(item.token)} className={picked === item.token ? 'picked' : ''}><span>{item.token}</span><div><i style={{ width: `${item.score}%` }} className={item.tone} /></div><strong>{item.score}%</strong></button>)}
              </div>
              <div className={`prediction-result ${picked ? 'show' : ''}`}><strong>{picked === '巴黎' ? '这次选择很合理。' : '概率低不等于绝对不可能。'}</strong><p>{picked === '巴黎' ? '生成“巴黎”后，它会把这个新 Token 接到输入末尾，再预测下一个 Token，直到遇到结束标记。' : '模型可以按最高概率选择，也可以采样出其他结果；解码策略决定最终走哪条路。'}</p></div>
            </div>
            <div className="concept-row"><div><span>Token ≠ 单词</span><p>它可能是一个词、词的一部分、标点，甚至是字符片段。</p></div><div><span>参数 ≠ 知识条目</span><p>参数是训练中学到的数值权重，不是可以逐条翻阅的百科全书。</p></div><div><span>上下文长度</span><p>模型一次能够读取并关注的 Token 数量有上限。</p></div></div>
          </section>

          <section className="message-section">
            <div className="section-heading"><span className="section-number warm">02</span><div><p>第二个反直觉点</p><h2>模型并没有看到聊天气泡</h2></div></div>
            <p className="section-intro">聊天界面只是给人看的。发送给模型前，系统、用户和助手消息会被聊天模板拼成一条带特殊标记的长文本。</p>
            <div className="view-switch"><button className={view === 'chat' ? 'active' : ''} onClick={() => setView('chat')}>人类聊天视图</button><button className={view === 'raw' ? 'active' : ''} onClick={() => setView('raw')}>模型提示视图</button></div>
            <div className="message-demo">
              {view === 'chat' ? <div className="chat-view">{messages.map((message) => <div key={message.role} className={`chat-message ${message.role}`}><span>{message.label}</span><p>{message.content}</p></div>)}</div> : <div className="raw-view"><span>一个经过聊天模板格式化的提示示意</span><pre><code><b>&lt;|im_start|&gt;system</b>{'\n'}你是一位耐心的 Python 助教。<em>&lt;|im_end|&gt;</em>{'\n'}<b>&lt;|im_start|&gt;user</b>{'\n'}用一句话解释列表推导式。<em>&lt;|im_end|&gt;</em>{'\n'}<b>&lt;|im_start|&gt;assistant</b>{'\n'}列表推导式是用简洁语法创建列表的方法。<em>&lt;|im_end|&gt;</em></code></pre></div>}
              <div className="template-caption"><span>Chat Template</span><p>负责把通用的 <code>{`{role, content}`}</code> 消息，转换成当前模型训练时熟悉的格式。</p></div>
            </div>
            <div className="role-grid"><div className="system-role"><span>SYSTEM</span><h3>定规则</h3><p>定义身份、行为边界和长期指令。</p></div><div className="user-role"><span>USER</span><h3>提要求</h3><p>表达当前任务、问题或补充信息。</p></div><div className="assistant-role"><span>ASSISTANT</span><h3>给回应</h3><p>记录模型已经生成的回复。</p></div></div>
            <div className="note-strip"><strong>别死记符号</strong><p><code>&lt;|im_end|&gt;</code> 只是某些模型使用的格式。不同模型可能采用完全不同的特殊 Token；应使用该模型自己的 tokenizer 和 chat template。</p></div>
          </section>

          <section className="memory-section">
            <div><span>第三个反直觉点</span><h2>聊天应用的“记忆”，通常是把历史消息再次发送</h2><p>模型每次生成时并不会自动记得上一轮。应用需要保存历史消息，在下一次请求时把相关内容重新放进上下文。</p></div>
            <div className="memory-flow"><span>第 1 轮消息</span><i>+</i><span>第 2 轮消息</span><i>+</i><span>新问题</span><b>→ 完整提示</b></div>
          </section>

          <section className="quiz-section">
            <div className="quiz-header"><div><span>理解检查 · 1/1</span><h2>为什么需要聊天模板？</h2></div><div className="quiz-score">即时反馈</div></div>
            <div className="answers">{[
              '为了让网页中的聊天气泡更加美观',
              '为了永久保存模型的聊天记忆',
              '为了把角色消息转换成特定模型认识的 Token 格式',
            ].map((answer, index) => <button key={answer} onClick={() => setQuizAnswer(index)} className={`${quizAnswer === index ? 'chosen' : ''} ${quizAnswer !== null && index === 2 ? 'correct' : ''} ${quizAnswer === index && index !== 2 ? 'wrong' : ''}`}><span>{String.fromCharCode(65 + index)}</span><p>{answer}</p><i>{quizAnswer !== null && index === 2 ? '正确' : ''}</i></button>)}</div>
            {quizAnswer !== null && <div className={`feedback ${quizAnswer === 2 ? 'success' : ''}`}><strong>{quizAnswer === 2 ? '答对了。' : '聊天模板工作在界面背后。'}</strong><p>{quizAnswer === 2 ? '它是通用消息结构与模型专用输入格式之间的翻译层。' : '它既不负责界面样式，也不会赋予模型永久记忆；它负责正确标记每条消息的角色和边界。'}</p></div>}
          </section>

          <section className="lesson-end llm-end"><div><span>本节通关句</span><h2>“LLM 连续预测 Token；聊天模板把角色消息翻译成模型认识的提示序列。”</h2><p>能解释这句话，就已经抓住了 Agent“大脑”的输入输出机制。</p></div><button onClick={finishLesson} className={completed ? 'completed' : ''}>{completed ? '已完成 · 进度已保存' : '我已看懂，完成本节'}</button></section>
          <div className="lesson-pager"><Link href="/unit1/agent">← 第一课：什么是智能体</Link><Link href="/#unit1-tools">第三课：工具与行动 →</Link></div>
        </article>
      </section>
    </main>
  );
}
