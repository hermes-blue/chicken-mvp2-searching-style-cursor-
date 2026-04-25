import fs from 'node:fs/promises';
import path from 'node:path';

const clientId = process.env.NAVER_CLIENT_ID;
const clientSecret = process.env.NAVER_CLIENT_SECRET;
const outputJsonPath = path.join(process.cwd(), 'src', 'auto-kyochon-news.json');
const outputCsvPath = path.join(process.cwd(), 'src', 'auto-kyochon-news.csv');

function cleanText(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSummaryPreview(value = '', maxLength = 100) {
  const text = cleanText(value);
  return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text;
}

function escapeCsv(value = '') {
  return '"' + String(value).replace(/"/g, '""') + '"';
}

if (!clientId || !clientSecret) {
  throw new Error('NAVER_CLIENT_ID and NAVER_CLIENT_SECRET GitHub Secrets are required.');
}

const url = new URL('https://openapi.naver.com/v1/search/news.json');
url.searchParams.set('query', '교촌치킨');
url.searchParams.set('display', '10');
url.searchParams.set('start', '1');
url.searchParams.set('sort', 'date');

const response = await fetch(url, {
  headers: {
    'X-Naver-Client-Id': clientId,
    'X-Naver-Client-Secret': clientSecret,
  },
});

if (!response.ok) {
  throw new Error('Naver API failed: ' + response.status + ' ' + await response.text());
}

const data = await response.json();
const items = data.items || [];
const first = items[0] || {};
const updatedAt = new Date().toISOString();
const title = cleanText(first.title || '교촌치킨 뉴스 없음');
const summaryPreview = makeSummaryPreview(first.description || '뉴스 검색 결과가 없습니다.');

const output = {
  updatedAt,
  runId: updatedAt,
  brand: '교촌치킨',
  title,
  summaryPreview,
  displayLine: title + ' · ' + updatedAt.slice(11, 16) + ' 자동 갱신',
  link: first.link || '',
  pubDate: first.pubDate || '',
  itemCount: items.length,
};

const csvRows = [
  ['updatedAt', 'title', 'summaryPreview', 'link', 'pubDate'],
  ...items.map((item) => [
    updatedAt,
    cleanText(item.title),
    makeSummaryPreview(item.description),
    item.link || '',
    item.pubDate || '',
  ]),
];

await fs.writeFile(outputJsonPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
await fs.writeFile(outputCsvPath, '\ufeff' + csvRows.map((row) => row.map(escapeCsv).join(',')).join('\r\n') + '\r\n', 'utf8');

console.log('Updated ' + outputJsonPath);
console.log('Updated ' + outputCsvPath);
console.log(output.displayLine);
