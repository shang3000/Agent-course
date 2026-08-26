export type CourseLesson = {
  id: string;
  unit: string;
  number: string;
  title: string;
  subtitle: string;
  plain: string;
  officialSections: string[];
  concepts: { title: string; body: string }[];
  flow: { label: string; body: string }[];
  code: string;
  codeNote: string;
  pitfalls: string[];
  quiz: { question: string; options: string[]; correct: number; explain: string };
  source: string;
  accent: 'blue' | 'green' | 'orange' | 'purple';
};

export const courseLessons: CourseLesson[] = [
  {
    id: 'unit1-tools', unit: 'Unit 1 · 基础', number: '03', title: '工具：让模型真正做事',
    subtitle: '从“知道工具存在”到生成一次可执行的函数调用',
    plain: '工具就是 Agent 可以调用的函数。模型并不会亲手运行函数：它只生成工具名称和参数，框架负责校验、执行，再把结果作为新消息交还模型。',
    officialSections: ['什么是工具？', '快速测验 2'],
    concepts: [
      { title: '描述比代码更先被模型看见', body: '模型通常看到名称、用途、参数和返回类型组成的 schema，而不是函数内部实现。' },
      { title: '工具弥补模型能力边界', body: '搜索带来最新信息，计算器保证精确运算，数据库和 API 让 Agent 能访问外部世界。' },
      { title: '好工具要窄而清晰', body: '名称明确、参数有类型、docstring 解释用途；一个工具最好只负责一件可验证的事。' },
    ],
    flow: [
      { label: '注册', body: '把函数及其 schema 放进 Agent 的工具箱。' },
      { label: '选择', body: 'LLM 根据任务决定工具名称和参数。' },
      { label: '执行', body: '框架解析输出并真正运行 Python 函数。' },
      { label: '回传', body: '函数结果成为 Observation，进入下一轮推理。' },
    ],
    code: `def get_weather(city: str) -> str:\n    """Get current weather for a city.\n\n    Args:\n        city: City name to query.\n    """\n    return f"{city}: 18°C, light rain"`,
    codeNote: '真实框架通常能从类型注解和 docstring 自动生成 JSON Schema。',
    pitfalls: ['把 API 密钥硬编码进工具', '工具描述含糊，导致模型选错', '工具权限过大且没有参数校验'],
    quiz: { question: 'LLM “调用工具”时，真正发生了什么？', options: ['模型直接进入服务器执行代码', '模型生成调用意图，框架解析并执行函数', '工具把全部源代码写入模型参数'], correct: 1, explain: '模型负责决策，应用或 Agent 框架负责执行，这是理解工具调用最关键的边界。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit1/tools', accent: 'green',
  },
  {
    id: 'unit1-react', unit: 'Unit 1 · 基础', number: '04', title: 'ReAct：边想、边做、边修正',
    subtitle: '把 Thought、Action、Observation 变成可持续推进的循环',
    plain: 'ReAct 把推理与行动交替进行。Agent 不必一开始就拥有完美计划；它可以先做一步，读取现实反馈，再决定下一步。',
    officialSections: ['思考-行动-观察循环', '思考与 ReAct', '行动', '观察'],
    concepts: [
      { title: 'Thought', body: '结合目标和当前观察，判断下一步；它可以包含规划、分析和纠错。' },
      { title: 'Action', body: '输出工具调用、代码或最终答案。Action 是意图，Tool 是实现意图的具体能力。' },
      { title: 'Observation', body: '来自环境的反馈，包括数据、成功信息、错误、状态变化和工具日志。' },
    ],
    flow: [
      { label: '思考', body: '当前缺什么？下一步最有信息量的行动是什么？' },
      { label: '行动', body: '调用工具或执行代码，而不是继续凭空猜测。' },
      { label: '观察', body: '把真实结果追加到上下文。' },
      { label: '停止判断', body: '目标已满足就回答，否则带着新信息继续循环。' },
    ],
    code: `while not task_finished:\n    thought = model.decide(context)\n    action = parse_action(thought)\n    observation = execute(action)\n    context.append(observation)`,
    codeNote: '这是概念伪代码。真实框架还会加入最大步数、错误恢复、日志和权限控制。',
    pitfalls: ['无限循环，没有 max_steps', '把内部推理原样暴露给用户', '工具报错后反复用同样参数重试'],
    quiz: { question: 'Observation 的主要作用是什么？', options: ['装饰输出格式', '为下一轮决策提供环境反馈', '永久修改模型权重'], correct: 1, explain: 'Observation 更新的是当前上下文，不是模型参数；它让下一轮决策基于现实结果。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit1/agent-steps-and-structure', accent: 'orange',
  },
  {
    id: 'unit1-first-agent', unit: 'Unit 1 · 基础', number: '05', title: '从零循环到第一个 smolagents Agent',
    subtitle: '先手写最小框架，再理解成熟库替你做了什么',
    plain: '“简单智能体库”把模型、工具、提示、解析和循环串起来；smolagents 则进一步提供现成的 CodeAgent、模型接入、工具装饰器和界面。',
    officialSections: ['简单智能体库', '使用 smolagents 创建第一个智能体', '最终测验与结论'],
    concepts: [
      { title: '模型适配器', body: '把不同服务商的输入输出统一成 Agent 能使用的接口。' },
      { title: '工具注册表', body: '保存可用工具及 schema，并根据模型输出分派调用。' },
      { title: '运行器', body: '维护消息、步数、Observation、错误和最终答案。' },
    ],
    flow: [
      { label: '定义工具', body: '写好类型注解与清晰 docstring。' },
      { label: '选择模型', body: '本地或 API 模型都通过统一接口接入。' },
      { label: '创建 Agent', body: '传入 tools、model、max_steps 等配置。' },
      { label: '运行与检查', body: '先用简单任务观察日志，再逐步增加能力。' },
    ],
    code: `from smolagents import CodeAgent, InferenceClientModel\n\nmodel = InferenceClientModel()\nagent = CodeAgent(tools=[get_weather], model=model)\nanswer = agent.run("大连今天需要带伞吗？")`,
    codeNote: '课程中的云端模型和模板可能更新；运行前应对照当前 smolagents 官方文档。',
    pitfalls: ['一开始塞入过多工具', '忽略模型是否支持所需调用格式', '把模型生成的任意代码放进无限制环境'],
    quiz: { question: 'Agent 框架最核心的价值是什么？', options: ['让模型参数自动变多', '封装模型、工具、消息和循环的繁重连接工作', '保证所有回答绝对正确'], correct: 1, explain: '框架减少编排样板，但不能消除模型不确定性，仍需验证、权限和评估。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit1/tutorial', accent: 'blue',
  },
  {
    id: 'unit2-overview', unit: 'Unit 2 · 框架', number: '06', title: '框架选型：先看任务，再选抽象',
    subtitle: 'smolagents、LlamaIndex 与 LangGraph 分别擅长什么',
    plain: '框架不是 Agent 的必要条件，而是复用常见模式的工具箱。简单任务可以用 Python；当工具、状态、检索和流程变复杂时，框架才开始真正省力。',
    officialSections: ['AI 智能体框架介绍'],
    concepts: [
      { title: 'smolagents', body: '轻量、代码行动优先，适合快速构建会使用工具的多步 Agent。' },
      { title: 'LlamaIndex', body: '数据与检索优先，擅长把私有知识、索引、Query Engine 和 Agent 组合起来。' },
      { title: 'LangGraph', body: '状态图与控制流优先，适合需要分支、循环、持久化和人工审批的工作流。' },
    ],
    flow: [
      { label: '先写需求', body: '列出数据源、工具、状态、分支和失败恢复。' },
      { label: '找最小抽象', body: '普通函数能解决就先不用复杂框架。' },
      { label: '做纵向切片', body: '用一个真实任务验证最关键能力。' },
      { label: '再扩展', body: '根据日志和评估结果增加记忆、多 Agent 或持久化。' },
    ],
    code: `# 经验性选择，不是硬规则\nif retrieval_is_core:\n    choice = "LlamaIndex"\nelif workflow_needs_strict_control:\n    choice = "LangGraph"\nelse:\n    choice = "smolagents or plain Python"`,
    codeNote: '三个框架可以互相集成。选型应看主矛盾，不要按热度选择。',
    pitfalls: ['为了“Agent”而 Agent', '同时引入多个框架却没有清晰边界', '只看演示成功，不测失败路径'],
    quiz: { question: '需要精确控制分支、状态与人工审批时，优先考虑什么？', options: ['LangGraph', '只写一个超长 Prompt', '图像生成模型'], correct: 0, explain: 'LangGraph 的核心就是用 State、Nodes 和 Edges 明确表达并控制流程。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit2/introduction', accent: 'purple',
  },
  {
    id: 'unit2-smolagents', unit: 'Unit 2.1 · smolagents', number: '07', title: 'smolagents：让行动直接写成代码',
    subtitle: 'CodeAgent、ToolCallingAgent、检索、多 Agent 与视觉能力',
    plain: 'smolagents 的鲜明特点是 CodeAgent：模型生成 Python 片段来组合工具、循环和计算。另一条路线 ToolCallingAgent 则生成 JSON 风格调用。',
    officialSections: ['为何使用 smolagents', '代码智能体', '工具调用智能体', '工具', '检索智能体', '多智能体', '视觉与浏览器智能体'],
    concepts: [
      { title: 'CodeAgent', body: '用代码表达行动，擅长组合多个结果和中间计算；执行环境必须受到限制。' },
      { title: 'ToolCallingAgent', body: '使用结构化工具调用，更符合常见函数调用模型和受控执行场景。' },
      { title: 'Managed Agents', body: '主 Agent 可以把子任务委派给有名称、描述和专用工具的受管 Agent。' },
    ],
    flow: [
      { label: 'Model', body: 'InferenceClientModel 或其他模型适配器负责生成行动。' },
      { label: 'Tools', body: '装饰器、Tool 子类、Hub 或其他生态工具提供能力。' },
      { label: 'Memory', body: '每个步骤的思考、调用和结果构成运行记忆。' },
      { label: 'Executor', body: '本地或沙箱执行代码，并限制导入与权限。' },
    ],
    code: `from smolagents import CodeAgent, InferenceClientModel\n\nagent = CodeAgent(\n    tools=[search_tool],\n    model=InferenceClientModel(),\n    max_steps=6,\n)\nagent.run("比较三个活动地点并给出理由")`,
    codeNote: '当前官方文档仍以 CodeAgent 和 ToolCallingAgent 为两种主要 Agent。执行代码时优先使用沙箱。',
    pitfalls: ['给 CodeAgent 开放不必要的 import', '多 Agent 角色描述重叠', '检索结果没有来源或相关性检查'],
    quiz: { question: 'CodeAgent 与 ToolCallingAgent 的主要区别是什么？', options: ['是否能够使用模型', '行动表示为 Python 代码还是结构化工具调用', '是否必须联网'], correct: 1, explain: '两者都可多步运行并使用工具，主要区别在模型表达行动的格式与执行方式。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit2/smolagents/introduction', accent: 'blue',
  },
  {
    id: 'unit2-llamaindex', unit: 'Unit 2.2 · LlamaIndex', number: '08', title: 'LlamaIndex：让 Agent 读懂你的数据',
    subtitle: 'Documents、Nodes、Indexes、Query Engines、Tools 与 Workflows',
    plain: 'LlamaIndex 从“怎样把数据交给 LLM”出发。它把原始数据拆成节点，建立索引和检索接口，再把 Query Engine 包装成 Agent 可选择的工具。',
    officialSections: ['LlamaHub', '核心组件', '工具', 'Agents', 'Workflows'],
    concepts: [
      { title: '数据管道', body: 'Reader 加载 Document，Node Parser 切块，Embedding 和 Index 让内容可检索。' },
      { title: 'Query Engine Tool', body: '把针对某个知识库的查询能力包装成带名称和描述的工具。' },
      { title: 'AgentWorkflow', body: '组织单 Agent 或多 Agent 的事件、状态、移交和循环。' },
    ],
    flow: [
      { label: 'Ingest', body: '从文件、网页或数据库加载数据。' },
      { label: 'Index', body: '切块、表示并建立检索结构。' },
      { label: 'Retrieve', body: '根据问题找到相关 Nodes。' },
      { label: 'Synthesize', body: '让 LLM 基于证据组织答案，或交给 Agent 继续调用。' },
    ],
    code: `from llama_index.core.tools import FunctionTool\nfrom llama_index.core.agent.workflow import FunctionAgent\n\nweather_tool = FunctionTool.from_defaults(fn=get_weather)\nagent = FunctionAgent(tools=[weather_tool], llm=llm)\nresponse = await agent.run("大连天气如何？")`,
    codeNote: 'LlamaIndex API 演进较快，课程示例与当前版本可能有差异；安装后以当前官方文档为准。',
    pitfalls: ['切块策略与文档结构不匹配', '检索不到证据仍让模型强答', '把所有数据塞进同一个无描述工具'],
    quiz: { question: 'QueryEngineTool 的价值是什么？', options: ['把检索/问答能力包装成 Agent 可选工具', '替代所有向量数据库', '训练新的 tokenizer'], correct: 0, explain: '它给查询引擎增加工具接口和语义描述，使 Agent 能判断何时查询哪个知识源。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit2/llama-index/introduction', accent: 'green',
  },
  {
    id: 'unit2-langgraph', unit: 'Unit 2.3 · LangGraph', number: '09', title: 'LangGraph：把工作流画成可执行的图',
    subtitle: 'State、Nodes、Edges、条件路由、持久化与人工介入',
    plain: 'LangGraph 用共享 State 保存当前快照，用 Nodes 做工作，用 Edges 决定下一步。它适合“有一部分必须确定、有一部分交给模型判断”的长流程。',
    officialSections: ['何时使用 LangGraph', '构建模块', '第一个图', '文档分析 Agent'],
    concepts: [
      { title: 'State', body: '所有节点共享的数据契约；节点返回的是状态更新，而不是随意修改全局变量。' },
      { title: 'Nodes', body: '普通同步或异步函数，负责分类、调用模型、运行工具或请求人工输入。' },
      { title: 'Edges', body: '固定边表达顺序，条件边根据状态选择分支；循环由边回到先前节点。' },
    ],
    flow: [
      { label: '定义 State', body: '只保存流程真正需要的信息。' },
      { label: '添加 Nodes', body: '每个节点职责单一、输入输出明确。' },
      { label: '连接 Edges', body: '显式表达顺序、条件、循环与结束。' },
      { label: 'Compile', body: '编译检查结构，并挂载 checkpointer 等运行能力。' },
    ],
    code: `from langgraph.graph import StateGraph, START, END\n\nbuilder = StateGraph(MyState)\nbuilder.add_node("classify", classify_email)\nbuilder.add_conditional_edges("classify", route_email)\nbuilder.add_edge(START, "classify")\ngraph = builder.compile()`,
    codeNote: '当前 LangGraph 官方仍以 State、Nodes、Edges 和编译后的 StateGraph 为核心。',
    pitfalls: ['State 塞入无法序列化的大对象', '条件路由漏掉兜底分支', '节点既做决策又做多个副作用，难以重试'],
    quiz: { question: 'LangGraph 中谁负责决定下一个节点？', options: ['State 本身', 'Edges 或条件路由函数', 'Tokenizer'], correct: 1, explain: 'State 保存数据，Node 执行逻辑，Edge 决定控制流。三者职责要分开。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit2/langgraph/when_to_use_langgraph', accent: 'purple',
  },
  {
    id: 'unit3-rag', unit: 'Unit 3 · 实战', number: '10', title: 'Agentic RAG：让 Agent 自己决定查什么',
    subtitle: '宾客数据、BM25 检索、网络搜索、天气和 Hub 统计的完整组合',
    plain: '传统 RAG 通常每次都先检索再回答；Agentic RAG 把检索变成工具之一，让 Agent 判断是否检索、查询哪个来源、是否还需要实时工具。',
    officialSections: ['Agentic RAG 简介', '宾客 RAG 工具', '构建与集成工具', '创建 Gala Agent'],
    concepts: [
      { title: '私有知识', body: '宾客名单不在模型训练数据中，必须从受控数据集准确检索。' },
      { title: '实时信息', body: '天气、网络和 Hub 统计变化频繁，应该按需调用外部工具。' },
      { title: '路由与融合', body: 'Agent 根据问题选择一个或多个来源，再把证据融合成有依据的回答。' },
    ],
    flow: [
      { label: '准备文档', body: '加载数据并转换成结构清楚、带 metadata 的 Document。' },
      { label: '创建 Retriever', body: '先用 BM25 建立可靠基线，再考虑 Embedding。' },
      { label: '包装为 Tool', body: '描述适用范围、输入和返回内容。' },
      { label: '端到端验证', body: '分别测试单工具、组合工具、无结果和错误场景。' },
    ],
    code: `def answer(question: str):\n    if asks_about_guest(question):\n        evidence = guest_retriever(question)\n    elif asks_realtime(question):\n        evidence = web_or_weather(question)\n    return model.answer(question, evidence=evidence)`,
    codeNote: '这是框架无关的核心逻辑。课程分别给出 smolagents、LlamaIndex 和 LangGraph 实现。',
    pitfalls: ['检索结果没有携带来源', '把用户输入直接拼进危险查询', '没有测试“检索不到”和来源冲突'],
    quiz: { question: 'Agentic RAG 比固定 RAG 多出的关键能力是什么？', options: ['自动训练更大的模型', '由 Agent 决定何时检索及使用哪个工具', '不再需要任何数据源'], correct: 1, explain: '检索从固定前置步骤变为可选择行动，Agent 还能组合检索、搜索和其他工具。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit3/agentic-rag/agentic-rag', accent: 'green',
  },
  {
    id: 'unit4-gaia', unit: 'Unit 4 · 最终项目', number: '11', title: 'GAIA：让 Agent 接受真实世界考试',
    subtitle: '理解基准、建立基线、分析失败并提交最终 Agent',
    plain: 'GAIA 用需要推理、工具、网页、多模态和文件处理的真实问题评估通用助手。最终项目重点不是堆功能，而是做出可重复、可诊断的答题管线。',
    officialSections: ['什么是 GAIA', '动手实践', '领取证书', '后续阅读'],
    concepts: [
      { title: 'Level 1—3', body: '任务从少步骤工具使用逐渐上升到复杂规划、多来源和更强推理。' },
      { title: '严格答案格式', body: '即使推理正确，单位、日期、名称或额外废话也可能使最终答案判错。' },
      { title: '错误分类', body: '区分检索失败、工具失败、规划失败、解析失败和最终格式失败。' },
    ],
    flow: [
      { label: '建立基线', body: '先跑最小 Agent，记录每道题的完整轨迹。' },
      { label: '分类失败', body: '不要只看总分，要定位失败发生在哪一层。' },
      { label: '针对性改进', body: '一次只改工具、提示、路由或格式中的一个变量。' },
      { label: '再评估', body: '用相同题集复跑，防止优化一类题却破坏另一类。' },
    ],
    code: `def solve(item):\n    trace = agent.run(item.question, attachments=item.files)\n    answer = normalize_final_answer(trace.final)\n    save_trace(item.id, trace, answer)\n    return answer`,
    codeNote: '评测或排行榜规则可能变化，正式提交前必须回到 Unit 4 当前页面核对。',
    pitfalls: ['在评测题上人工逐题硬编码', '只保存最终答案，不保存轨迹', '忽略附件、时区、单位和输出格式'],
    quiz: { question: '提升 GAIA Agent 最可靠的第一步是什么？', options: ['盲目增加更多工具', '保存轨迹并对失败原因分类', '把 temperature 调到最大'], correct: 1, explain: '只有知道失败在哪一层，改进才有针对性，也才能判断新版本是否真正更好。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/unit4/what-is-gaia', accent: 'orange',
  },
  {
    id: 'bonus-function', unit: 'Bonus 1 · 进阶', number: 'B1', title: '为函数调用微调模型',
    subtitle: '从工具 schema、训练样本到 LoRA 微调与验证',
    plain: '提示模型使用工具依赖通用能力；函数调用微调则用大量“任务—工具调用—观察—回答”样本，让模型更稳定地生成正确工具名和参数。',
    officialSections: ['什么是函数调用', 'LoRA', '函数调用微调'],
    concepts: [
      { title: '训练格式', body: '训练数据必须与推理时的聊天模板、特殊 Token 和工具 schema 对齐。' },
      { title: 'LoRA', body: '冻结大部分基础权重，只训练低秩适配器，以较低资源完成领域适配。' },
      { title: '结构化评估', body: '不仅看文字相似度，还要比较工具名、参数类型、必填字段和执行成功率。' },
    ],
    flow: [
      { label: '构造样本', body: '覆盖正常、缺参、歧义、多工具和无需工具的任务。' },
      { label: '套用模板', body: '确保训练与推理使用同一 chat template。' },
      { label: 'LoRA 训练', body: '记录配置、随机种子和验证集表现。' },
      { label: '执行评测', body: '解析生成调用并在安全工具环境中验证。' },
    ],
    code: `# 概念结构\nexample = {\n  "messages": [...],\n  "tools": [weather_schema],\n  "expected_call": {"name": "weather", "arguments": {"city": "大连"}}\n}`,
    codeNote: '微调需要显存、数据和版本匹配，先用提示和少量评测确认确实有微调必要。',
    pitfalls: ['训练和推理聊天模板不一致', '训练集只含成功调用', '只看 loss，不执行生成的参数'],
    quiz: { question: '函数调用微调最怕哪种不一致？', options: ['训练与推理使用不同消息/工具格式', '训练样本使用 JSON', '使用验证集'], correct: 0, explain: '格式错位会让模型学到一种边界和结构，推理时却收到另一种输入。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/bonus-unit1/fine-tuning', accent: 'purple',
  },
  {
    id: 'bonus-observe', unit: 'Bonus 2 · 进阶', number: 'B2', title: '可观测性与评估',
    subtitle: 'Trace、Span、在线指标、离线数据集和回归测试',
    plain: 'Agent 是多步骤系统，最终答案无法解释中间哪里出错。可观测性记录每个模型调用、工具、耗时和错误；评估则把“看见”转化成可比较的质量指标。',
    officialSections: ['什么是可观测性与评估', '监控和评估 Agent', '测验'],
    concepts: [
      { title: 'Trace / Span', body: '一次任务是 Trace，模型调用、工具执行和检索等子步骤是 Span。' },
      { title: '在线评估', body: '在真实流量中关注成功率、延迟、成本、错误、毒性和用户反馈。' },
      { title: '离线评估', body: '在固定数据集上重复运行，比较版本并防止回归。' },
    ],
    flow: [
      { label: 'Instrument', body: '为模型和工具调用添加结构化追踪。' },
      { label: 'Collect', body: '记录输入、输出、耗时、错误、Token 与版本。' },
      { label: 'Evaluate', body: '规则、标准答案、LLM Judge 与人工审核组合使用。' },
      { label: 'Improve', body: '把失败样本加入回归集，再验证修复。' },
    ],
    code: `with tracer.start_as_current_span("agent.run") as span:\n    result = agent.run(task)\n    span.set_attribute("agent.success", result.ok)\n    span.set_attribute("agent.steps", result.steps)`,
    codeNote: '课程使用 OpenTelemetry 与 Langfuse 展示追踪；敏感数据进入平台前应脱敏。',
    pitfalls: ['记录了日志却没有版本和任务 ID', '只看平均分，忽略长尾失败', '把密钥、用户隐私和完整文档写入 Trace'],
    quiz: { question: '为什么只保存最终答案不够？', options: ['因为文件会太小', '无法定位是规划、检索、工具还是格式环节失败', '因为模型不支持文本'], correct: 1, explain: '多步骤系统必须保留中间轨迹，才能诊断、复现和建立有意义的评估。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/bonus_unit2/what-is-agent-observability-and-evaluation', accent: 'blue',
  },
  {
    id: 'bonus-pokemon', unit: 'Bonus 3 · 游戏', number: 'B3', title: '宝可梦对战 Agent',
    subtitle: '从会聊天的 NPC 到能感知状态、规划行动的游戏 Agent',
    plain: 'LLM NPC 只会生成自然对话；游戏 Agent 还要读取战局状态、从合法行动中选择招式或换人，并根据回合结果持续调整策略。',
    officialSections: ['游戏中的 LLM', '从 LLM 到 Agent', '构建对战 Agent', '启动战斗'],
    concepts: [
      { title: '环境', body: 'Pokémon Showdown 提供对战规则和回合结果，poke-env 把环境状态暴露给 Python。' },
      { title: '合法行动约束', body: '模型必须从当前可用招式和可换入宝可梦中选择，不能自由生成不存在的动作。' },
      { title: '状态压缩', body: '把血量、属性、速度、场地和历史回合压缩成模型能稳定理解的表示。' },
    ],
    flow: [
      { label: 'Observe', body: '读取双方队伍、当前宝可梦、状态和合法动作。' },
      { label: 'Plan', body: '判断伤害、克制、速度、换人收益和风险。' },
      { label: 'Act', body: '输出严格受限的招式或换人选择。' },
      { label: 'Learn', body: '记录胜率、非法动作、回合长度和典型失败。' },
    ],
    code: `async def choose_move(battle):\n    state = summarize_battle(battle)\n    legal = list_legal_actions(battle)\n    choice = model.choose(state, legal)\n    return validate_or_fallback(choice, legal)`,
    codeNote: '启动真实对战涉及 poke-env、Pokémon Showdown 和网络账户，先离线验证合法行动解析。',
    pitfalls: ['让模型生成任意文本作为动作', '提示中塞入冗长原始日志', '只看单场胜负，不做多局统计'],
    quiz: { question: '游戏 Agent 与普通 LLM NPC 的本质差别是什么？', options: ['Agent 的台词更长', 'Agent 能读取环境并执行影响游戏状态的行动', 'Agent 必须使用更大的模型'], correct: 1, explain: '能动性来自感知—决策—行动—反馈循环，而不是模型尺寸或对话文采。' },
    source: 'https://huggingface.co/learn/agents-course/zh-CN/bonus-unit3/from-llm-to-agents', accent: 'orange',
  },
];

export const units = [
  { label: 'Unit 1 · 智能体基础', lessons: ['unit1-tools', 'unit1-react', 'unit1-first-agent'] },
  { label: 'Unit 2 · 框架选型', lessons: ['unit2-overview', 'unit2-smolagents', 'unit2-llamaindex', 'unit2-langgraph'] },
  { label: 'Unit 3—4 · 实战与认证', lessons: ['unit3-rag', 'unit4-gaia'] },
  { label: '附加单元 · 进阶', lessons: ['bonus-function', 'bonus-observe', 'bonus-pokemon'] },
];
