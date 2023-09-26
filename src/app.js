import express from "express";

const app = express();

// 노드는 middleware 시스템으로 이루어져있음

// express에게 ejs를 사용할 것이라고 선언
app.set("view engine", "ejs");
// 위치는 절대 주소를 지정하고 파일 위치를 잡는다.
app.set("views", process.cwd() + "/src/client/html");

app.get("/", (req, res) => {
  const homeData = {
    data: [{ name: "철수" }, { name: "영희" }, { name: "민수" }],
  };
  res.render("home", homeData);
});

app.get("/abc", (req, res) => {
  res.send("abc로 들어왔습니다!!!");
});

app.listen(8080, () => {
  console.info("8080 포트 서버 열림 http://localhost:8080 👍");
});
