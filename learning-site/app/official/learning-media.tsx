'use client';

import { useState, type ComponentPropsWithoutRef } from 'react';

export function LearningImage({ src = '', alt = '', ...props }: ComponentPropsWithoutRef<'img'>) {
  const [failed, setFailed] = useState(false);
  const source = String(src);
  if (failed || !source) {
    return (
      <span className="media-fallback" role="note">
        <strong>教学图片暂时无法加载</strong>
        <span>{alt || '该图片没有提供替代文字，请在联网后重试。'}</span>
        {source.startsWith('http') && <a href={source} target="_blank" rel="noreferrer">在官方网站打开原图 ↗</a>}
      </span>
    );
  }
  // Markdown 会同时渲染官方外链和本地缓存图，不能在构建时预知尺寸。
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} src={source} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

export function LearningIframe({ src = '', title = '官方互动内容', ...props }: ComponentPropsWithoutRef<'iframe'>) {
  const source = String(src);
  return (
    <span className="external-embed">
      <iframe {...props} src={source} title={title} loading="lazy" />
      <span>这是需要联网的官方互动内容。{source && <a href={source} target="_blank" rel="noreferrer">若页面空白，点此单独打开 ↗</a>}</span>
    </span>
  );
}
