import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const manifestPath = path.join(root, 'learning-site', 'app', 'official', 'generated-manifest.json');
const sourceRoot = path.join(root, 'official-source', 'huggingface-agents-course');
const publicRoot = path.join(root, 'learning-site', 'public');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const ids = new Set();
let sourceCharacters = 0;
let codeBlocks = 0;

if (manifest.pageCount !== 75 || manifest.pages.length !== 75) {
  throw new Error(`Expected 75 indexed pages, received ${manifest.pages.length}.`);
}

for (const page of manifest.pages) {
  if (ids.has(page.id)) throw new Error(`Duplicate page id: ${page.id}`);
  ids.add(page.id);

  const source = await readFile(path.join(sourceRoot, page.sourcePath), 'utf8');
  const content = JSON.parse(await readFile(path.join(publicRoot, page.contentUrl), 'utf8'));
  if (content.raw !== source) throw new Error(`Raw source mismatch: ${page.id}`);
  if (!content.readable.trim()) throw new Error(`Empty reading view: ${page.id}`);
  if (page.stats.characters !== source.length) throw new Error(`Character count mismatch: ${page.id}`);
  sourceCharacters += source.length;
  codeBlocks += page.stats.codeBlocks;
}

console.log(`Verified ${manifest.pages.length}/${manifest.pageCount} official pages.`);
console.log(`Exact raw-source matches: ${manifest.pages.length}`);
console.log(`Official source characters: ${sourceCharacters}`);
console.log(`Official fenced code blocks: ${codeBlocks}`);
