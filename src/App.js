import StartPage from './pages/StartPage.js';
import CompletePage from './pages/CompletePage.js';
import { init } from './utils/router.js';

export default function App({ $target }) {
  this.route = () => {
    const { pathname } = window.location;
    $target.innerHTML = '';

    // pathname을 통해서 화면 routing
    if (pathname === '/') {
      new StartPage({ $target }).render();
    } else if (pathname === '/complete') {
      new CompletePage({ $target }).render();
    }
  };

  // CHANGE_ROUTE 이벤트 발생시 App의 this.route 함수가 호출되도록 설정
  init(this.route);
  this.route();
  // (뒤로가기, 앞으로 가기 눌렀을 때) popstate 이벤트 발생하도록 적용
  window.addEventListener('popstate', this.route);
}
