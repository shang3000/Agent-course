'use client';

import type { ComponentProps } from 'react';
import { useState } from 'react';

export default function LearningCodeBlock({ children, ...props }: ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false);
  const text = extractText(children);
  const language = String((children as { props?: { className?: string } })?.props?.className || '').replace('language-', '') || '代码';

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return <div className="learning-code"><header><span>{language}</span><button type="button" onClick={copy}>{copied ? '已复制' : '复制代码'}</button></header><pre {...props}>{children}</pre><details><summary>运行与学习检查</summary><ul><li>先确认本页安装命令、Python 版本、环境变量和 Token 要求。</li><li>运行前预测输出；运行后保存真实输出和报错，不要只看代码。</li><li>修改一个参数或工具，观察 Action、Observation 或状态怎样变化。</li><li>常见故障：依赖未安装、解释器选错、密钥缺失、网络失败、API 版本变化。</li></ul></details></div>;
}

function extractText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(extractText).join('');
  if (value && typeof value === 'object' && 'props' in value) return extractText((value as { props: { children?: unknown } }).props.children);
  return '';
}
