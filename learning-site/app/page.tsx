'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const steps = [
  { key: '01', name: '思考 Thought', short: '先判断自己缺少什么信息', example: '“用户想知道巴黎现在是否需要带伞，我还不知道实时天气。”', color: 'blue' },
  { key: '02', name: '行动 Action', short: '选择并调用合适的工具', example: '调用 weather(city="Paris")，而不是凭记忆猜测。', color: 'orange' },
  { key: '03', name: '观察 Observation', short: '读取工具返回的真实结果', example: '工具返回：“18℃，小雨，降水概率 70%。”', color: 'green' },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCompleted(localStorage.getItem('agent-unit1-lesson1') === 'done'), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function finishLesson() {
    localStorage.setItem('agent-unit1-lesson1', 'done');
    setCompleted(true);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">A</span><div><strong>Agent 伴读</strong><small>Hinata × 泉</small></div></div>
        <div className="progress-card">
          <div className="progress-label"><span>Unit 1 · 第一课</span><strong>{completed ? '100%' : '学习中'}</strong></div>
          <div className="progress-track"><span style={{ width: completed ? '100%' : '28%' }} /></div>
          <p>今天先弄懂：智能体为什么不只是聊天机器人</p>
        </div>
        <nav aria-label="课程章节">
          <p className="nav-heading">第 1 单元 · 智能体基础</p>
          <Link className="nav-item active" href="/"><span>01</span>什么是智能体？</Link>
          <Link className="nav-item" href="/unit1/llm"><span>02</span>LLM、Token 与消息</Link>
          <Link className="nav-item" href="/course#unit1-tools"><span>03</span>工具与行动</Link>
          <a className="nav-item" href="#loop"><span>04</span>Agent 工作循环</a>
          <Link className="nav-item" href="/course#unit1-first-agent"><span>05</span>第一个智能体</Link>
        </nav>
        <div className="sidebar-note"><span>本节目标</span><p>能用自己的话解释 Agent、LLM 和工具之间的关系。</p></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <span className="eyebrow">HUGGING FACE AGENTS COURSE · 中文伴读</span>
          <div className="top-actions"><span className="status-dot" />本地学习模式　<Link href="/course">完整课程中心 →</Link></div>
        </header>

        <article>
          <section className="hero" id="story">
            <div className="hero-copy">
              <span className="chapter-pill">UNIT 1 · 第一课</span>
              <h1>智能体，到底比<br />聊天机器人多了什么？</h1>
              <p className="lead">先别背定义。想象你在雨天出门前，问一个 AI：“我今天需要带伞吗？”</p>
              <div className="definition"><span>一句人话</span><p><strong>LLM 负责想，工具负责做，Agent 负责把两者组织起来完成目标。</strong></p></div>
              <a className="primary-button" href="#loop">沿着故事往下看 <span>↓</span></a>
            </div>

            <div className="scene-card" aria-label="普通聊天模型和智能体的对比场景">
              <div className="weather-orb"><span>?</span></div>
              <div className="message user-message">今天出门要带伞吗？</div>
              <div className="split-answer">
                <div className="answer-box plain"><span className="answer-label">只有 LLM</span><p>“秋天有时会下雨，建议查看天气预报。”</p><small>能说，但没有获取实时信息</small></div>
                <div className="answer-box agent"><span className="answer-label">Agent</span><p>“查到今天 18℃、小雨，带一把伞更稳妥。”</p><small>主动调用天气工具后再回答</small></div>
              </div>
            </div>
          </section>

          <section className="lesson-section" id="loop">
            <div className="section-heading"><span className="section-number">02</span><div><p>核心机制</p><h2>它是怎么完成任务的？</h2></div></div>
            <p className="section-intro">Agent 不会一次把答案“憋出来”，而是重复一个小循环。点击下面三个步骤，看看每一步脑子里发生了什么。</p>
            <div className="loop-grid">
              <div className="step-tabs" role="tablist" aria-label="Agent 工作循环">
                {steps.map((step, index) => (
                  <button key={step.key} className={`step-tab ${index === activeStep ? 'selected' : ''}`} onClick={() => setActiveStep(index)} role="tab" aria-selected={index === activeStep}>
                    <span className={`step-dot ${step.color}`}>{step.key}</span><span><strong>{step.name}</strong><small>{step.short}</small></span>
                  </button>
                ))}
              </div>
              <div className={`step-detail detail-${steps[activeStep].color}`}>
                <span className="detail-kicker">第 {activeStep + 1} 步正在发生</span>
                <h3>{steps[activeStep].name}</h3><p>{steps[activeStep].example}</p>
                <div className="code-thought"><span>agent_trace</span><code>{activeStep === 0 ? 'need_info = "实时天气"' : activeStep === 1 ? 'result = weather("Paris")' : 'observation = result.read()'}</code></div>
                <button onClick={() => setActiveStep((activeStep + 1) % steps.length)}>{activeStep === 2 ? '重新播放循环' : '看下一步'} →</button>
              </div>
            </div>
          </section>

          <section className="parts-section" id="compare">
            <div className="section-heading"><span className="section-number warm">03</span><div><p>拆开来看</p><h2>一个 Agent 有四个关键零件</h2></div></div>
            <p className="section-intro">课程把模型比作“大脑”、工具比作“身体”。再补上目标和循环，完整结构就清楚了。</p>
            <div className="parts-map">
              <div className="part-card goal"><span>01 · 目标</span><h3>要完成什么？</h3><p>来自用户的要求，决定整个过程往哪里走。</p><code>“判断今天是否要带伞”</code></div>
              <div className="part-connector">→</div>
              <div className="part-card brain"><span>02 · 模型</span><h3>下一步做什么？</h3><p>LLM 理解任务、规划步骤，并选择合适工具。</p><code>需要先获取实时天气</code></div>
              <div className="part-connector">→</div>
              <div className="part-card tool"><span>03 · 工具</span><h3>怎样影响环境？</h3><p>真正执行搜索、计算、读文件或调用 API。</p><code>{'weather(city="Dalian")'}</code></div>
              <div className="part-connector down">↙</div>
              <div className="part-card loop"><span>04 · 循环</span><h3>结果够不够？</h3><p>把观察送回模型；不够就继续，够了才回答。</p><code>while not solved: next_step()</code></div>
            </div>
            <div className="note-strip"><strong>容易误会</strong><p>LLM 本身通常只生成文字。真正执行工具的是 Agent 框架中的程序代码；它解析模型给出的调用请求，运行函数，再把结果放回对话。</p></div>
          </section>

          <section className="lab-section" id="lab">
            <div className="lab-copy">
              <span className="lab-label">PYTHON 微型实验</span>
              <h2>不用任何 AI 库，先看懂 Agent 的骨架</h2>
              <p>右边这段代码故意很简单：规则函数暂时代替 LLM，但“选择工具 → 执行 → 观察 → 回答”的骨架已经完整。</p>
              <ul>
                <li><span>1</span><p><strong>模型决定行动</strong>：此处用固定规则模拟。</p></li>
                <li><span>2</span><p><strong>工具返回事实</strong>：函数给出天气数据。</p></li>
                <li><span>3</span><p><strong>观察进入下一轮</strong>：程序据此形成答案。</p></li>
              </ul>
              <button className="run-button" onClick={() => { setDemoRunning(false); setTimeout(() => setDemoRunning(true), 80); }}>运行一次演示 <span>▶</span></button>
            </div>
            <div className="code-panel">
              <div className="code-top"><span>exercises/unit1/agent_loop.py</span><i /><i /><i /></div>
              <pre><code><span className="kw">def</span> <span className="fn">weather</span>(city: str) -&gt; dict:{'\n'}    <span className="kw">return</span> {'{' }<span className="str">&quot;rain&quot;</span>: <span className="kw">True</span>, <span className="str">&quot;temp&quot;</span>: <span className="num">18</span>{'}'}{'\n\n'}<span className="kw">def</span> <span className="fn">run_agent</span>(question: str):{'\n'}    thought = <span className="str">&quot;需要查询实时天气&quot;</span>{'\n'}    action = weather(<span className="str">&quot;大连&quot;</span>){'\n'}    observation = action{'\n'}    <span className="kw">return</span> <span className="str">&quot;建议带伞&quot;</span> <span className="kw">if</span> observation[<span className="str">&quot;rain&quot;</span>] <span className="kw">else</span> <span className="str">&quot;不用带伞&quot;</span></code></pre>
              <div className={`terminal-output ${demoRunning ? 'visible' : ''}`}><span>运行轨迹</span><p>THOUGHT　需要查询实时天气</p><p>ACTION　 weather(&quot;大连&quot;)</p><p>OBSERVE　{`{'rain': True, 'temp': 18}`}</p><strong>FINAL　　建议带伞</strong></div>
            </div>
          </section>

          <section className="quiz-section" id="quiz">
            <div className="quiz-header"><div><span>理解检查 · 1/1</span><h2>下面哪一项最能称为 Agent？</h2></div><div className="quiz-score">即时反馈</div></div>
            <div className="answers">
              {[
                '输入一句话后，只生成一段文字的语言模型',
                '能理解目标、选择工具、观察结果并继续调整的系统',
                '把所有可能回答预先写好的规则菜单',
              ].map((answer, index) => (
                <button key={answer} onClick={() => setQuizAnswer(index)} className={`${quizAnswer === index ? 'chosen' : ''} ${quizAnswer !== null && index === 1 ? 'correct' : ''} ${quizAnswer === index && index !== 1 ? 'wrong' : ''}`}>
                  <span>{String.fromCharCode(65 + index)}</span><p>{answer}</p><i>{quizAnswer !== null && index === 1 ? '正确' : ''}</i>
                </button>
              ))}
            </div>
            {quizAnswer !== null && <div className={`feedback ${quizAnswer === 1 ? 'success' : ''}`}><strong>{quizAnswer === 1 ? '答对了。' : '再看一眼“行动”这件事。'}</strong><p>{quizAnswer === 1 ? '关键不在于说得像人，而在于它能根据目标决定行动、调用工具，并利用观察结果继续推进。' : '只生成文本或执行固定菜单，都缺少“模型根据观察动态决定下一步”的循环。'}</p></div>}
          </section>

          <section className="lesson-end">
            <div><span>本节通关句</span><h2>“Agent = 会规划的模型 + 能行动的工具 + 根据结果继续调整的循环。”</h2><p>如果你能不看页面复述这句话，并解释“带伞”的例子，这一课就真的懂了。</p></div>
            <button onClick={finishLesson} className={completed ? 'completed' : ''}>{completed ? '已完成 · 进度已保存' : '我已看懂，完成本节'}</button>
          </section>

          <Link className="coming-next" href="/unit1/llm"><span>下一课</span><div><h2>LLM 为什么能当 Agent 的“大脑”？</h2><p>从“预测下一个 token”开始，拆解消息、角色和聊天模板。</p></div><span className="arrow">→</span></Link>
        </article>
      </section>
    </main>
  );
}
