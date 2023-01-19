let ajax = new XMLHttpRequest(); //ajax 객체 호출
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'

// ajax 호출
ajax.open('get', NEWS_URL, false);
ajax.send();

// ajax 리스폰스
let newsFeed = JSON.parse(ajax.response);

console.log(newsFeed);

// ul 태그 생성
const ul = document.createElement('ul');

// li태그 갯수대로 반복
for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement('li');
  li.innerHTML = newsFeed[i].title;
  ul.appendChild(li); // ul태그 밑에 li를 붙임
}
// 완성된 ul을 root 태그 밑에 붙임
document.getElementById('root').appendChild(ul);

