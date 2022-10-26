import { routeChange } from '../utils/router';
import { getQuery } from '../utils/api';

export default function CompletePage({ $target }) {
  // query로 점수 & 걸린 시간 가져오기
  const score = getQuery('score');
  const totalTime = getQuery('total');

  // html element 추가
  const $page = document.createElement('div');
  const $button = document.createElement('button');
  const $message = document.createElement('div');
  // html element 속성 추가
  $page.className = 'complete-page';
  $button.className = 'restart-button';
  $message.className = 'final-message';
  $button.innerHTML = '다시 시작';
  $message.innerHTML = `<h2 class="title">Mission Complete!</h2>
  <h1 class="final-score">당신의 점수는 ${score}점 입니다.</h1>
  <b class="final-time">단어당 평균 답변 시간은 ${(
    parseFloat(totalTime) / parseFloat(score)
  ).toFixed(2)}초 입니다.</b>`;

  // 페이지에 element append
  $page.appendChild($message);
  $page.appendChild($button);

  // '다시 시작' 버튼에 click 리스너 추가 (메인으로 라우팅)
  $button.addEventListener('click', (e) => {
    routeChange('/', '');
  });

  // 렌더링 실행
  this.render = () => {
    $target.appendChild($page);
  };
}
