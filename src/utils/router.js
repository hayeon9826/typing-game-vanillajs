const CHANGE_ROUTE = 'ROUTE_CHANGE';

// App.js에서 router 초기화.
// Custom Event를 사용해 CHANGE_ROUTE 이벤트 발생 시 onRouteChange 콜백 함수 호출하도록 이벤트 바인딩
export const init = (onRouteChange) => {
  window.addEventListener(CHANGE_ROUTE, () => {
    onRouteChange();
  });
};

// 해당 함수 호출시마다 pushState로 URL 업데이트 하고 Custom Event 발생시킴
export const routeChange = (url, query = '') => {
  window.history.pushState({}, url, window.location.origin + url + query);
  window.dispatchEvent(new CustomEvent(CHANGE_ROUTE));
};
