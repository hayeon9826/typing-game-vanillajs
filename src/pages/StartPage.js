import { request } from '../utils/api.js';
import { routeChange } from '../utils/router';
export default function StartPage({ $target }) {
  // 변수 선언
  let start = false;
  let words = [];
  let time = 0;
  let totalTime = 0;
  let count = 0;
  let score = 0;

  // 함수 선언
  // api로 단어 목록 가져오기
  const fetchWords = async () => {
    words = await request();
    time = words[0].second;
    score = words.length;
  };

  // html element 추가
  const $page = document.createElement('div');
  const $flex = document.createElement('div');
  const $timerDiv = document.createElement('div');
  const $scoreDiv = document.createElement('div');
  const $div = document.createElement('div');
  const $input = document.createElement('input');
  const $button = document.createElement('button');
  // html element 속성 추가
  $page.className = 'start-page';
  $flex.className = 'flex-div';
  $timerDiv.innerHTML = `<b>남은 시간 : <span class="current_count">${time}</span>초</b>`;
  $scoreDiv.innerHTML = `<b>점수 : <span class="current-score">${score}</span>점</b>`;
  $div.className = 'word-div';
  $div.innerHTML = `<h1 class="current-word"></h1>`;
  $input.className = 'start-input disable-input';
  $input.disabled = true;
  $input.placeholder = '입력';
  $button.className = 'start-button';
  $button.innerHTML = start ? '초기화' : '시작';

  // 페이지에 element append
  $flex.appendChild($timerDiv);
  $flex.appendChild($scoreDiv);
  $page.appendChild($flex);
  $page.appendChild($div);
  $page.appendChild($input);
  $page.appendChild($button);

  // 게임 리셋 시켰을 때
  const reset = () => {
    // 변수 초기화
    count = 0;
    totalTime = 0;
    score = words.length;
    start = false;
    time = words[0].second;
    // timer 초기화
    this.timerId && clearTimeout(this.timerId);
    // css 초기화
    $input.disabled = true;
    $input.classList.add('disable-input');
    // element 초기화
    document.querySelector('.start-input').value = '';
    document.querySelector('.current-word').innerHTML = words[0].text;
    document.querySelector('.current_count').innerHTML = time;
    document.querySelector('.current-score').innerHTML = score;
  };

  // 게임 시작했을 때
  const startGame = () => {
    // 변수 세팅
    words = words;
    score = words.length;
    time = words[count].second;
    // 타이머 시작
    timer();
    // html 속성 변경 (active)
    $input.disabled = false;
    $input.classList.remove('disable-input');
    // 화면에 현재 단어 및 스코어 표시
    document.querySelector('.current-word').innerHTML = words[count].text;
    document.querySelector('.current-score').innerHTML = score;
  };

  // 단어 성공 시, 다음 단어 준비
  const nextGame = async () => {
    // 만약 마지막 스테이지라면 완료 페이지로 이동
    // timer에서 시간 만료 시 count + 1를 하기 때문에 단어 길이와 count를 비교
    if (words.length === count) {
      this.timerId && clearTimeout(this.timerId);
      routeChange('/complete', `?score=${score}&total=${totalTime}`);
    } else {
      // 다음 stage 단어로 준비
      time = words[count].second;
      // 기존 타이머 삭제 후 현재 시간으로 다시 시작
      this.timerId && clearTimeout(this.timerId);
      await timer();
      // input 초기화 후, 현재 단어 및 스코어로 업데이트
      document.querySelector('.start-input').value = '';
      document.querySelector('.current-word').innerHTML = words[count].text;
      document.querySelector('.current-score').innerHTML = score;
    }
  };

  // '시작' 버튼 눌렀을 때
  const setStart = () => {
    // start 상태 반대로 변경
    start = !start;
    // 만약 시작이면 게임 시작.
    if (start) {
      startGame();
    } else {
      // 아니라면 초기화
      reset();
    }
  };

  // input창 변동 시 작동
  const handleInput = (e) => {
    // 만약 엔터를 눌렀을 때 input 값과 현재 단어 비교 후 처리
    if (e.key === 'Enter') {
      if (document.querySelector('.start-input').value === words[count].text) {
        // 에러 박스 없애기
        // 단어를 맞추면 사용한 시간 total time에 추가
        totalTime = totalTime + (words[count].second - time);
        // 마지막 단어일 때, 타이머 초기화 및 complete 페이지로 라우팅
        if (words.length === count + 1) {
          this.timerId && clearTimeout(this.timerId);
          routeChange('/complete', `?score=${score}&total=${totalTime}`);
        } else {
          // 단어 순서, 점수, 남은 시간, input창 업데이트 시키고, nextGame 호출
          count = count + 1;
          time = words[count].second;
          document.querySelector('.start-input').value = '';
          nextGame();
        }
      } else {
        // 단어가 맞지 않다면 인풋 초기화
        document.querySelector('.start-input').value = '';
      }
    }
  };

  // 게임 시작, 초기화 버튼 클릭시 동작
  const handleClick = (e) => {
    $button.innerHTML = !start ? '초기화' : '시작';
    if (start) {
      $button.classList.remove('disable');
    } else {
      $button.classList.add('disable');
    }
    // start 변수에 따라서 초기화인지(reset) 시작인지 (startGame) 구분
    setStart();
  };

  // 남은 시간 타이머
  const timer = () => {
    // 타이머 호출 시 우선 현재 시간 화면에 표시
    document.querySelector('.current_count').innerHTML = time;
    this.timerId = setInterval(() => {
      // setInterval 함수를 변수에 담아 사용.
      // 0초 이상일 때 1초씩 감소. 변화한 time 값을 화면에 노출
      if (time > 1) {
        time--;
        document.querySelector('.current_count').innerHTML = time;
      } else {
        // 만약 남은 시간이 없다면 timer 리셋시키고, 점수 차감. 다음 단어 진행
        this.timerId && clearTimeout(this.timerId);
        score = score - 1;
        count = count + 1;
        nextGame();
      }
    }, 1000);
  };

  // 렌더링 함수
  const render = () => {
    $target.appendChild($page);
    // input에 keydown 리스너 추가 (인풋 변경시 확인)
    $input.addEventListener('keydown', handleInput);
    // 시작/초기화 버튼에 click 리스너 추가
    $button.addEventListener('click', handleClick);
    reset();
  };

  this.render = async () => {
    // 우선 단어 가져오고 렌더링 시작
    await fetchWords();
    render();
  };
}
