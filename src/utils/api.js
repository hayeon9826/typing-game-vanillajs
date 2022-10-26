export const API_URL =
  'https://json-server-ffl2whhxk-hayeon9826.vercel.app/words';

// 단어 목록 호출 api
export const request = async () => {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error('API 호출 실패');
  } catch (e) {
    console.log(e.message);
  }
};

// 쿼리 가져오는 함수
export const getQuery = (name) => {
  const queryString = new URLSearchParams(location.search);
  return queryString.get(name);
};

// 쿼리 가져오는 함수 test
export const getQueryTest = (name, urlString = '') => {
  const url = new URL(urlString);
  const queryString = new URLSearchParams(url.search);
  return queryString.get(name);
};
