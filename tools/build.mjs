import {readFile,writeFile} from 'node:fs/promises';

const fragment=await readFile(new URL('../src/challenge.html',import.meta.url),'utf8');
const prefix='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="color-scheme" content="light">\n<title>Cover a slit — double-slit review sketch</title>\n<style>body{margin:0;padding:clamp(8px,2vw,24px);background:#e6ece6}button,summary{-webkit-tap-highlight-color:transparent}</style>\n</head>\n<body>\n';
const standalone=prefix+fragment+'\n</body>\n</html>\n';
await writeFile(new URL('../index.html',import.meta.url),standalone,'utf8');
console.log('Built index.html from src/challenge.html.');
