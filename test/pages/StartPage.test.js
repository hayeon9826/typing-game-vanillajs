import { routeChange } from '../../src/utils/router';

const data = [
  {
    second: 3,
    text: 'hello',
  },
  {
    second: 10,
    text: 'world',
  },
  {
    second: 8,
    text: 'this',
  },
];
let $button;
let $input;
let $current;
let start = false;
let words = data;
let score = data.length;
let time = 0;
let count = 0;

const defaultHTML = `<main class="App">
  <div class="start-page"
    <div class="flex-div">
      <div>
        <b>남은 시간: <span class="current_count">${time}</span>초</b>
      </div>
      <div>
        <b>점수: <span class="current-score">${data.length}</span>점</b>
      </div>
    </div>
    <div class="word-div">
      <h1 class="current-word"></h1>
    </div>
    <input class="start-input disable-input" placeholder="입력" disabled="">
    <button class="start-button">시작</button>
  </div>
</main>`;

// '시작' 버튼 눌렀을 때
const setStart = () => {
  start = !start;
  if (start) {
    startGame();
  } else {
    reset();
  }
};
// 게임 리셋 시켰을 때
const reset = () => {
  // 변수 초기화
  count = 0;
  time = 0;
  score = words.length;
  start = false;
  time = 0;
  // timer 초기화
  // css 초기화
  $input.disabled = true;
  $input.classList.add('disable-input');
  // element 초기화
  document.querySelector('.start-input').value = '';
  document.querySelector('.current-word').innerHTML = '';
  document.querySelector('.current_count').innerHTML = time;
  document.querySelector('.current-score').innerHTML = score;
};
// 게임 시작했을 때
const startGame = () => {
  words = data;
  score = words.length;
  time = words[count].second;
  $input.disabled = false;
  $input.classList.remove('disable-input');
  document.querySelector('.current-word').innerHTML = words[count].text;
  document.querySelector('.current-score').innerHTML = score;
  document.querySelector('.current_count').innerHTML = words[count].second;
};
// 게임 시작, 초기화 버튼 클릭시 동작
const handleClick = (e) => {
  $button.innerHTML = !start ? '초기화' : '시작';
  if (start) {
    $button.classList.remove('disable');
  } else {
    $button.classList.add('disable');
  }
  setStart();
};

// 단어 성공 시, 다음 단어 준비
const nextGame = async () => {
  time = words[count].second;
  timerId && clearTimeout(timerId);
  document.querySelector('.start-input').value = '';
  document.querySelector('.current-word').innerHTML = words[count].text;
  document.querySelector('.current-score').innerHTML = score;
};
let timerId;
// 남은 시간 타이머
const timer = () => {
  // 타이머 호출 시 우선 현재 시간 화면에 표시
  document.querySelector('.current_count').innerHTML = time;
  timerId = setInterval(() => {
    // setInterval 함수를 변수에 담아 사용.
    // 0초 이상일 때 1초씩 감소. 변화한 time 값을 화면에 노출
    if (time > 1) {
      time--;
      document.querySelector('.current_count').innerHTML = time;
    } else {
      // 만약 남은 시간이 없다면 timer 리셋시키고, 점수 차감. 다음 단어 진행
      timerId && clearTimeout(timerId);
      score = score - 1;
      count = count + 1;
      nextGame();
    }
  }, 1000);
};

const handleInput = (e) => {
  // 만약 엔터를 눌렀을 때 input 값과 현재 단어 비교 후 처리
  if (e.key === 'Enter') {
    if (document.querySelector('.start-input').value === words[count].text) {
      // 단어를 맞추면 사용한 시간 total time에 추가
      time = time + (words[count].second - time);
      // 마지막 단어일 때, 타이버 초기화 및 complete 페이지로 라우팅
      if (words.length === count + 1) {
        timerId && clearTimeout(timerId);
        routeChange('/complete', `?score=${score}&total=${time}`);
      } else {
        // 단어 순서, 점수, 남은 시간, input창 업데이트 시키고, nextGame 호출
        count = count + 1;
        time = words[count].second;
        $input.value = '';
        nextGame();
      }
    } else {
      // 단어가 맞지 않다면 input 초기화
      document.querySelector('.start-input').value = '';
    }
  }
};

describe('게임 페이지 테스트', () => {
  beforeEach(() => {
    document.body.innerHTML = defaultHTML;
    $button = document.querySelector('.start-button');
    $input = document.querySelector('.start-input');
    $current = document.querySelector('.current-word');
    $button.addEventListener('click', handleClick);
    $input.addEventListener('keydown', handleInput);
    reset();
  });

  test('초기 점수 세팅. 문제의 갯수로 초기화', () => {
    expect(document.querySelector('.current-score').innerHTML).toBe(
      `${data.length}`
    );
  });

  test('초기 시간 세팅. 0으로 초기화', () => {
    expect(document.querySelector('.current_count').innerHTML).toBe('0');
  });

  test('시작 페이지에서는 input 필드 css 비활성화', () => {
    expect(document.querySelector('.start-input').classList).toContain(
      'disable-input'
    );
  });

  test('시작 페이지에서는 input 필드 입력 비활성화', () => {
    expect(document.querySelector('.start-input').disabled).toEqual(true);
  });

  test('시작 버튼을 누르면 게임이 시작된다. (버튼 비활성화, 인풋 활성화)', () => {
    $button.click();
    // 버튼 비활성화
    expect($button.innerHTML).toBe('초기화');
    expect($button.classList).toContain('disable');
    expect($input.disabled).toEqual(false);
    // 인풋 활성화
    expect($input.classList).not.toContain('disable-input');
    expect($input.disabled).toEqual(false);
    expect($input.classList).not.toContain('disable-input');
  });

  test('게임이 시작되면 현재 단어가 표시된다.', () => {
    $button.click();
    expect($current.innerHTML).toBe(words[count].text);
  });

  test('게임이 시작되면 현재 단어의 남은 시간이 표시된다.', () => {
    $button.click();
    expect(document.querySelector('.current_count').innerHTML).toBe(
      `${words[count].second}`
    );
  });

  test('게임 중 정답 입력 후 Enter 키를 누르면 input을 초기화 시킨 후, 다음 단어를 보여준다.', () => {
    $button.click();
    $input.value = words[count].text;

    var event = document.createEvent('Events');
    event.initEvent('keydown', true, true);
    event.key = 'Enter';
    $input.dispatchEvent(event);

    expect($input.value).toBe('');
    expect(count).toBe(1);
  });

  test('게임 중 오답 입력 후 Enter 키를 누르면 인풋창을 초기화 한다.', () => {
    $button.click();
    $input.value = 'wrong answer';

    var event = document.createEvent('Events');
    event.initEvent('keydown', true, true);
    event.key = 'Enter';
    $input.dispatchEvent(event);

    expect($input.value).toBe('');
    expect(count).toBe(0);
  });

  test('[timer 함수] 게임 중 남은 시간이 0초가 되면 점수가 감소된다', async () => {
    $button.click();
    await timer();
    if (time == 0) {
      expect($score).toBe(words.length - 1);
    }
    timerId && clearTimeout(timerId);
  });

  test('[timer 함수] 1초마다 남은시간이 1초씩 감소된다', async () => {
    $button.click();
    let currentTime = words[count].second;
    await timer();
    let intervalId = setInterval(() => {
      expect(time).toBe(currentTime - 1);
      currentTime--;
    }, 1000);
    intervalId && clearTimeout(intervalId);
    timerId && clearTimeout(timerId);
  });

  test('초기화 버튼을 누르면 게임이 리셋된다.', () => {
    start = true;
    $button.click();
    expect(document.querySelector('.current-score').innerHTML).toBe(
      `${data.length}`
    );
    expect(document.querySelector('.current_count').innerHTML).toBe('0');
    expect(document.querySelector('.start-input').classList).toContain(
      'disable-input'
    );
    expect(document.querySelector('.start-input').disabled).toEqual(true);
  });

  test('모든 단어를 입력하면 결과 화면으로 이동한다.', () => {
    $button.click();
    count = 2;
    $input.value = 'this';

    var event = document.createEvent('Events');
    event.initEvent('keydown', true, true);
    event.key = 'Enter';
    $input.dispatchEvent(event);

    expect(window.location.pathname).toBe('/complete');
  });
});
