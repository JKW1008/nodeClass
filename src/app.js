import express from "express";

const app = express();

/**
 * node는 middleware 시스템으로 이루어져있음
 */

/**
 * ejs 템플릿 엔진
 * 구멍이 있는 페이지 -> 구멍에 데이터를 넣을 수 있는 것
 * node ejs
 * npm install ejs
 */

/**
 * express야 나 ejs 쓸거야
 */
app.set("view engine", "ejs");
/**
 * ejs의 파일의 위치는 이프로젝트의 src 폴더에 client 폴더에 html 폴더 안에 있어
 */
app.set("views", process.cwd() + "/src/client/html");

app.get("/", (request, response) => {
  const homeData = {
    data: [{ name: "철수" }, { name: "영희" }, { name: "민수" }],
  };
  response.render("home", homeData);
});

app.get("/introduce", (request, response) => {
  response.render("introduce");
});

app.listen(8080, () => {
  console.info("8080 포트 서버 열림 http://localhost:8080");
});
