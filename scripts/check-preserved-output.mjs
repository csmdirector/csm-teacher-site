import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const preservedDirectories = [
  'about',
  'css',
  'facilities',
  'images',
  'js',
  'music-teacher-jobs-cincinnati',
  'teaching-opportunities',
  'why-csm'
];

async function digest(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

async function assertSameFile(relativePath) {
  const source = path.join(root, relativePath);
  const output = path.join(dist, relativePath);

  if ((await digest(source)) !== (await digest(output))) {
    throw new Error(`${relativePath} changed during build output preservation.`);
  }
}

async function listFiles(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name);
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

await stat(dist);

const rootEntries = await readdir(root, { withFileTypes: true });
const rootHtmlFiles = rootEntries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => entry.name);

for (const file of rootHtmlFiles) {
  await assertSameFile(file);
}

let preservedFileCount = rootHtmlFiles.length;

for (const directory of preservedDirectories) {
  const directoryFiles = await listFiles(path.join(root, directory), directory);

  for (const file of directoryFiles) {
    await assertSameFile(file);
  }

  preservedFileCount += directoryFiles.length;
}

console.log(`Verified preserved output: ${preservedFileCount} existing files match source.`);
