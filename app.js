const container = document.getElementById('root') // root태그가 반복되어 변수로 선언
let ajax = new XMLHttpRequest(); //ajax 객체 호출
const content = document.createElement('div');

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'
const store = {
  currentPage: 1,
};



function getData(url) {
  // ajax 호출
  ajax.open('get', url, false);
  ajax.send();

// ajax 리스폰스
  return JSON.parse(ajax.response);
}


/*데이터를 표현할 태그 생성*/
// ul 태그 생성
const ul = document.createElement('ul');


function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];
  newsList.push('<ul>');

  /*데이터를 생성된 태그 안에 넣음*/
// li태그 갯수대로 반복
  for (let i = (store.currentPage - 1)  * 10; i < store.currentPage * 10; i++) {
    /*DOM API를 사용하면 구조를 명확하게 파악할 수 없어서 innerHTML과 문자열 템플릿을 이용하여 가시성이 좋게 만듬.*/
    newsList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
  `);
  }
// 완성된 컨텐츠를 root 태그 밑에 붙임
  newsList.push('</ul>');
  newsList.push(`
    <div>
      <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
      <a href="#/page/${store.currentPage < 3 ? store.currentPage + 1 : 3}">다음 페이지</a>
  </div>
`);
  container.innerHTML = newsList.join(''); //join 을 하게 되면 배열을 문자열로 쭉 붙여줌, 디폴트는 콤마로 연결. 파라미터를 통해 변경가능
}


function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');

  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  <div>
    <a href="#/page/${store.currentPage}">목록으로</a>
  </div>
`;
}

/*브라우저 API를 이용하여 hashchange가 일어나면 함수호출*/
window.addEventListener('hashchange',router);

function router() {
  const routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if(routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substring(7));
    newsFeed();
  } else {
    newsDetail();
  }
}



router();
