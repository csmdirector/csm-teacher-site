import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const preservedDirectories = [
  'about',
  'css',
  'facilities',
  'js',
  'music-teacher-jobs-cincinnati',
  'teaching-opportunities',
  'why-csm'
];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

await mkdir(dist, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });
const rootHtmlFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => entry.name);

for (const file of rootHtmlFiles) {
  await cp(path.join(root, file), path.join(dist, file));
}

for (const directory of preservedDirectories) {
  const source = path.join(root, directory);
  if (await exists(source)) {
    await cp(source, path.join(dist, directory), {
      recursive: true,
      force: true
    });
  }
}

console.log(
  `Preserved ${rootHtmlFiles.length} root HTML pages and ${preservedDirectories.length} static directories in dist.`
);
