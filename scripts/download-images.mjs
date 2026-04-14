// scripts/download-images.mjs
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public', 'images');

const LOGO = 'https://pdgindustrial.com/wp-content/uploads/2020/01/logo.jpg';

const PROJECTS = [
  {
    slug: 'base-para-tanque-de-butano',
    url:  'https://pdgindustrial.com/wp-content/uploads/2016/09/4.jpg',
  },
  {
    slug: 'instalacion-mecanica-para-glp',
    url:  'https://pdgindustrial.com/wp-content/uploads/2019/10/IMG_20170601_165933-min_1050x786.jpg',
  },
  {
    slug: 'lavanderia-bahia-principe',
    url:  'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141832-min.jpg',
  },
  {
    slug: 'nave-metalica',
    url:  'https://pdgindustrial.com/wp-content/uploads/2014/10/IMG-20120102-00181.jpg',
  },
  {
    slug: 'skids-con-compresor-de-descarga',
    url:  'https://pdgindustrial.com/wp-content/uploads/2019/09/20190925_152243-min.jpg',
  },
  {
    slug: 'tanque-3mil-metros-cubicos',
    url:  'https://pdgindustrial.com/wp-content/uploads/2014/10/1546040_10202695589328358_1919066873_n.jpg',
  },
  {
    slug: 'tanque-y-estacion-de-bombeo',
    url:  'https://pdgindustrial.com/wp-content/uploads/2014/10/IMAG0006.jpg',
  },
];

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  const buf = await res.arrayBuffer();
  await writeFile(dest, Buffer.from(buf));
  console.log('  ✓', dest.split('public/images/')[1] ?? dest);
}

async function main() {
  await mkdir(join(PUBLIC, 'projects'), { recursive: true });

  console.log('Downloading logo...');
  await download(LOGO, join(PUBLIC, 'logo.jpg'));

  console.log('Downloading project images...');
  for (const { slug, url } of PROJECTS) {
    await download(url, join(PUBLIC, 'projects', `${slug}.jpg`));
  }

  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
