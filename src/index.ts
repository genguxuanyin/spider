const axios = require('axios').default;
const cheerio = require('cheerio');

/**
 * 获取豆瓣读书网页的源代码
 */
async function getBooksHTML() {
  const resp = await axios.get("https://book.douban.com/latest");
  return resp.data;
}

/**
 * 从豆瓣读书中得到一个完整的网页，并从网页中分析出书籍的基本信息，然后得到一个书籍的详情页链接数组
 */
async function getBookLinks() {
  const html = await getBooksHTML()
  const $ = cheerio.load(html)

  const archorElements = $('#content .grid-16-8 .chart-dashed-list .media__img a')

  const links = archorElements.map((index, ele) => {
    return ele.attribs.href
  }).get();
  return links;
}


async function getBookDetail(detailUrl: string){
  const resp = await axios.get(detailUrl);
  const $ = cheerio.load(resp.data);
  const name = $("h1").text().trim();
  const imgurl = $("#mainpic .nbg img").attr("src");
  const spans = $("#info span.pl");
  const authorSpan = spans.filter((i, ele) => {
    return $(ele).text().includes("作者");
  });
  const author = authorSpan.next("a").text();
  const publishSpan = spans.filter((i, ele) => {
    return $(ele).text().includes("出版年");
  });
  const publishDate = publishSpan[0].nextSibling.nodeValue.trim();
  return {
    name,
    imgurl,
    publishDate,
    author,
  };
}

async function fetchAll(){
  const links = await getBookLinks()
  const promiseArray = links.map((link) => {
    return getBookDetail(link)
  })
  return Promise.all(promiseArray)
}

fetchAll().then(console.log)


