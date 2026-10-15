import {readFile,writeFile} from 'node:fs/promises';

const fragment=await readFile(new URL('../src/challenge.html',import.meta.url),'utf8');
const title='Tucker Vana — Phase Play | Double-Slit Optics';
const description="Tucker Vana's double-slit optics experiment. Runs offline in one HTML file, with fixed-scale comparisons, numerical checks, and documented model limits.";
const publicUrl='https://tuckeefro.github.io/phase-play/';
const structuredData={
  '@context':'https://schema.org',
  '@type':'SoftwareSourceCode',
  name:'Phase Play',
  description,
  url:publicUrl,
  codeRepository:'https://github.com/tuckeefro/phase-play',
  programmingLanguage:['JavaScript','HTML','CSS'],
  runtimePlatform:'Web browser',
  author:{'@type':'Person',name:'Tucker Vana',url:'https://github.com/tuckeefro'}
};
const prefix=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="author" content="Tucker Vana">
<link rel="canonical" href="${publicUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${publicUrl}">
<meta property="og:image" content="${publicUrl}docs/browser/desktop-covered.png">
<meta property="og:image:alt" content="Phase Play by Tucker Vana: covering one slit brightens the marked dark spot while dimming the center.">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(structuredData)}</script>
<style>body{margin:0;padding:clamp(8px,2vw,24px);background:#ddd7c8}button,summary{-webkit-tap-highlight-color:transparent}</style>
</head>
<body>
<main>
`;
const standalone=prefix+fragment+'\n</main>\n</body>\n</html>\n';
await writeFile(new URL('../index.html',import.meta.url),standalone,'utf8');
console.log('Built index.html from src/challenge.html.');
