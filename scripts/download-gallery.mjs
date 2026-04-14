// scripts/download-gallery.mjs
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public', 'images', 'projects', 'gallery');

const GALLERY = {
  'base-para-tanque-de-butano': [
    'https://pdgindustrial.com/wp-content/uploads/2016/09/1.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2016/09/2.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2016/09/3.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2016/09/4.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2016/09/6.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2016/09/7.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2016/09/8.jpg',
  ],
  'instalacion-mecanica-para-glp': [
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20170125_094123-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20170130_141119-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20170201_094128-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20170204_104740-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20170221_175417-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20170311_084926-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/IMG_20170601_165919-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/IMG_20170601_165933-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/IMG_20170729_121947-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/IMG_20171020_155914-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/IMG_20171020_205305-min.jpg',
  ],
  'lavanderia-bahia-principe': [
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20180625_143911-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141110-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141134-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141144-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141207-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141738-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141832-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141842-min.jpg',
  ],
  'nave-metalica': [
    'https://pdgindustrial.com/wp-content/uploads/2013/02/IMG-20111102-00030.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/383201_2690887908898_779166671_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/428777_4129769760045_1131743946_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/564330_3864536449378_926696384_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMG-20111108-00071.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMG-20120102-00181.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMG-20120102-00185.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/12/IMG_0692.jpg',
  ],
  'skids-con-compresor-de-descarga': [
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190925_152236-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190925_152243-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190925_170348-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190925_170350-min.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2019/09/20190925_170401-min.jpg',
  ],
  'tanque-3mil-metros-cubicos': [
    'https://pdgindustrial.com/wp-content/uploads/2014/10/1151062_10201649588258985_544766938_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/1234185_10201847546407815_246229143_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/1239958_10201918646785280_103805014_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/1546040_10202695589328358_1919066873_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMG_1103.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMG_1105.jpg',
  ],
  'tanque-y-estacion-de-bombeo': [
    'https://pdgindustrial.com/wp-content/uploads/2014/10/995173_10201994387598753_1229618016_n.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMAG0006.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMAGE_053.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMAGE_062.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/10/IMAGE_066.jpg',
    'https://pdgindustrial.com/wp-content/uploads/2014/11/IMGP6403-470x352-2.jpg',
  ],
};

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  const buf = await res.arrayBuffer();
  await writeFile(dest, Buffer.from(buf));
  console.log('  ✓', dest.split('public/images/')[1] ?? dest);
}

async function main() {
  for (const [slug, urls] of Object.entries(GALLERY)) {
    const dir = join(PUBLIC, slug);
    await mkdir(dir, { recursive: true });
    console.log(`\n${slug}:`);
    for (let i = 0; i < urls.length; i++) {
      await download(urls[i], join(dir, `${i + 1}.jpg`));
    }
  }
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
