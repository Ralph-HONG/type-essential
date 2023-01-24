const container = document.getElementById('root') // root태그가 반복되어 변수로 선언
let ajax = new XMLHttpRequest(); //ajax 객체 호출
const content = document.createElement('div');

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'


const newsFeed = getData(NEWS_URL);

function getData (url) {
  // ajax 호출
  ajax.open('get', url, false);
  ajax.send();

// ajax 리스폰스
  return JSON.parse(ajax.response);
}


/*데이터를 표현할 태그 생성*/
// ul 태그 생성
const ul = document.createElement('ul');


/*브라우저 API를 이용하여 hashchange가 일어나면 함수호출*/
window.addEventListener('hashchange', () => {

  const id = location.hash.substring(1);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title
  content.appendChild(title);
})

/*데이터를 생성된 태그 안에 넣음*/
// li태그 갯수대로 반복
for (let i = 0; i < newsFeed.length; i++) {
  const div = document.createElement('div');

  /*DOM API를 사용하면 구조를 명확하게 파악할 수 없어서 innerHTML과 문자열 템플릿을 이용하여 가시성이 좋게 만듬.*/
  div.innerHTML = `
    <li>
      <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
    `;

  ul.appendChild(div.firstElementChild);
}


// 완성된 컨텐츠를 root 태그 밑에 붙임
container.appendChild(ul);
container.appendChild(content);

