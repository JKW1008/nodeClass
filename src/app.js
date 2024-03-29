import "dotenv/config";
import "regenerator-runtime";

import express from "express";
import viewRouter from "./router/viewRouter";
import apiRouter from "./router/apiRouter";

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
/**
 * 주소 : /**,   view 만 전달해주는 router viewRouter -> ejs 파일만 전달해주는 router
 * 주소 : /api/**  api 만 전달해주는 router apiRouter -> 데이터만 전달해주는 router
 */

// json 데이터  parse midle ware
app.use(express.json());

app.use("/css", express.static("src/client/css"));
app.use("/js", express.static("src/client/js"));
app.use("/file", express.static("src/client/file"));

app.use("/api", apiRouter);
app.use("/", viewRouter);

app.listen(8080, () => {
  console.info("8080 포트 서버 열림 http://localhost:8080");
});
