const container = document.getElementById('root') // root태그가 반복되어 변수로 선언
let ajax = new XMLHttpRequest(); //ajax 객체 호출
const content = document.createElement('div');

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

// ajax 호출
ajax.open('get', NEWS_URL, false);
ajax.send();

// ajax 리스폰스
let newsFeed = JSON.parse(ajax.response);

console.log(newsFeed);
/*데이터 가져오기 완료*/


/*데이터를 표현할 태그 생성*/
// ul 태그 생성
const ul = document.createElement('ul');


/*브라우저 API를 이용하여 hashchange가 일어나면 함수호출*/
window.addEventListener('hashchange', () => {

  const id = location.hash.substring(1);
  ajax.open('GET', CONTENT_URL.replace('@id', id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title
  content.appendChild(title);
})

/*데이터를 생성된 태그 안에 넣음*/
// li태그 갯수대로 반복
for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement('li');
  const a = document.createElement('a');

  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;
  a.addEventListener('click', () => {})

  li.appendChild(a);
  ul.appendChild(li); // ul태그 밑에 li를 붙임
}


// 완성된 컨텐츠를 root 태그 밑에 붙임
container.appendChild(ul);
container.appendChild(content);

