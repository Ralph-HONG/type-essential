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
  let  template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  /*데이터를 생성된 태그 안에 넣음*/
// li태그 갯수대로 반복
  for (let i = (store.currentPage - 1)  * 10; i < store.currentPage * 10; i++) {
    /*DOM API를 사용하면 구조를 명확하게 파악할 수 없어서 innerHTML과 문자열 템플릿을 이용하여 가시성이 좋게 만듬.*/
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>    
  `);
  }

template = template.replace('{{__news_feed__}}', newsList.join(''));
template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
template = template.replace('{{__next_page__}}', store.currentPage + 1);
// 완성된 컨텐츠를 root 태그 밑에 붙임
  container.innerHTML = template;//join 을 하게 되면 배열을 문자열로 쭉 붙여줌, 디폴트는 콤마로 연결. 파라미터를 통해 변경가능
}


function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  function makeComment(comments, called = 0) {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>      
      `);

      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }

    return commentString.join('')
  }

  container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
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
