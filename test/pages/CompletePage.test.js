import { routeChange } from "../../src/utils/router";

const score = 12;
const time = 12;

const defaultHTML = `<h2 class="title">Mission Complete!</h2>
  <h1 class="final-score">당신의 점수는 ${score}점 입니다.</h1>
  <b class="final-time">단어당 평균 답변 시간은 ${(
    parseFloat(time) / parseFloat(score)
  ).toFixed(2)}초 입니다.</b>`;

describe("게임 완료 페이지 테스트", () => {
  beforeEach(() => {
    document.body.innerHTML = defaultHTML;
  });
  test("query로 전달한 점수 & 평균 시간 화면에 표시", () => {
    expect(document.querySelector(".final-score").innerHTML).toBe(
      "당신의 점수는 12점 입니다."
    );
    expect(document.querySelector(".final-time").innerHTML).toBe(
      "단어당 평균 답변 시간은 1.00초 입니다."
    );
  });

  test("다시 시작 버튼 클릭시 게임화면으로 라우팅", () => {
    document.body.innerHTML = `
    <button class="restart-button">다시 시작</button>
  `;

    const $button = document.querySelector(".restart-button");
    $button.addEventListener("click", (e) => {
      routeChange("/", "");
    });
    $button.click();

    expect(window.location.pathname).toEqual("/");
  });
});
