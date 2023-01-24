type Store = {
    currentPage: number;
    feeds: NewsFeed[];

}

type NewsFeed = {
    id: number;
    url: string;
    user: string;
    time_ago: string;
    points: number;
    title: string;
    read?: boolean;

}
const container: HTMLElement | null = document.getElementById('root') // root태그가 반복되어 변수로 선언
let ajax: XMLHttpRequest = new XMLHttpRequest(); //ajax 객체 호출
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'
const store: Store = {
    currentPage: 1,
    feeds: [],
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

function makeFeed(feeds) {
    for (let i = 0; i < feeds.length; i++) {
        feeds[i].read = false;
    }
    return feeds;
}

function updateView(html) {
    // container가 null을 허용하는 타입이므로 널체크를 해줘야 에러가 안남.
    if (container) {
        container.innerHTML = html;
    } else {
        console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
    }
    ;
}

function newsFeed() {
    let newsFeed: NewsFeed[] = store.feeds;
    const newsList = [];
    let template = `
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

    if (newsFeed.length === 0) {
        newsFeed = store.feeds = makeFeed(getData(NEWS_URL));
    }
    /*데이터를 생성된 태그 안에 넣음*/
// li태그 갯수대로 반복
    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
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


    updateView(template);
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

    for (let i = 0; i < store.feeds.length; i++) {
        if (store.feeds[i].id === Number(id)) {
            store.feeds[i].read = true;
            break;
        }
    }

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

    updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));

}

/*브라우저 API를 이용하여 hashchange가 일어나면 함수호출*/
window.addEventListener('hashchange', router);

function router() {
    const routePath = location.hash;

    if (routePath === '') {
        newsFeed();
    } else if (routePath.indexOf('#/page/') >= 0) {
        store.currentPage = Number(routePath.substring(7));
        newsFeed();
    } else {
        newsDetail();
    }
}


router();