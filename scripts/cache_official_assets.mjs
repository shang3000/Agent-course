import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'learning-site', 'public', 'official-content');
const assetRoot = path.join(root, 'learning-site', 'public', 'official-assets');
const mapPath = path.join(assetRoot, 'asset-map.json');
const mediaPattern = /https:\/\/huggingface\.co\/datasets\/[^\s"'<>]+?\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s"'<>]*)?/gi;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : target;
  }));
  return files.flat().filter((file) => file.endsWith('.json'));
}

function extensionFor(url, contentType = '') {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).toLowerCase();
  if (/^\.(png|jpe?g|gif|webp|svg)$/.test(ext)) return ext === '.jpeg' ? '.jpg' : ext;
  if (contentType.includes('svg')) return '.svg';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('png')) return '.png';
  return '.jpg';
}

async function download(url) {
  const response = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 AgentCourseOfflineCache/1.0', Referer: 'https://huggingface.co/learn/agents-course/zh-CN' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const type = response.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`非图片响应: ${type || '未知'}`);
  const name = `${createHash('sha256').update(url).digest('hex').slice(0, 20)}${extensionFor(url, type)}`;
  await writeFile(path.join(assetRoot, name), Buffer.from(await response.arrayBuffer()));
  return `/official-assets/${name}`;
}

await mkdir(assetRoot, { recursive: true });
const files = await walk(contentRoot);
const documents = await Promise.all(files.map(async (file) => ({ file, json: JSON.parse(await readFile(file, 'utf8')) })));
const urls = [...new Set(documents.flatMap(({ json }) => [...String(json.readable || '').matchAll(mediaPattern)].map((match) => match[0])))];
const assetMap = {};
const failures = [];

for (let index = 0; index < urls.length; index += 6) {
  const batch = urls.slice(index, index + 6);
  await Promise.all(batch.map(async (url) => {
    try { assetMap[url] = await download(url); }
    catch (error) { failures.push({ url, error: String(error) }); }
  }));
  process.stdout.write(`\r已处理 ${Math.min(index + batch.length, urls.length)}/${urls.length} 个教学资源`);
}

for (const { file, json } of documents) {
  let readable = String(json.readable || '');
  for (const [url, localUrl] of Object.entries(assetMap)) readable = readable.split(url).join(localUrl);
  if (readable !== json.readable) await writeFile(file, `${JSON.stringify({ ...json, readable }, null, 2)}\n`);
}

await writeFile(mapPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), cached: assetMap, failures }, null, 2)}\n`);
process.stdout.write('\n');
console.log(`离线资源：${Object.keys(assetMap).length}/${urls.length} 个已缓存，${failures.length} 个保留外链。`);
if (failures.length) process.exitCode = 2;
