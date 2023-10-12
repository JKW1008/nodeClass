//  apiRouter.js
import express, { response } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'
import { getCourseList, qrCheck } from "../controller/courseController";
import { authMe, join, login } from "../controller/userController";
import { handleKakaoLogin, isAuth } from "../middleware/auth";

import { Strategy as KakaoStrategy } from "passport-kakao";

const apiRouter = express.Router();

//  코스
apiRouter.get("/courses", isAuth, getCourseList);
apiRouter.post("/courses", isAuth, qrCheck);

//  회원가입
apiRouter.post("/join", join);
apiRouter.post("/login", login);

//  카카오 로그인
const clientId = process.env.CLIENT_ID;
const callback = "/api/kakao/callback";

passport.use(new KakaoStrategy({ clientID : clientId, callbackURL : callback }, handleKakaoLogin))

apiRouter.get("/kakao", passport.authenticate("kakao", { session : false }))
apiRouter.get("/kakao/callback", (request, response, next) => {
    passport.authenticate("kakao", { session : false}, async (err, user, info) => {

        //  info로 들어오면
        if (info) {
            console.error(info);
            return response.redirect("/login?error=" + info);
        } else if (!user) {
            console.error("유저를 찾을수 없습니다.");
            return response.redirect("/login?error=sns_login_fail");
        } else {
            // console.log("======================")
            // console.log(user);
            const accessToken = jwt.sign({ id: user.user_id }, process.env.SECRET_KEY , { expiresIn: process.env.JWT_EXPIRE } );  // 3개 넣을 값, 시크릿 값, 만료일
            // console.log(accessToken);
            return response.redirect("/login/callback?accessToken=" + accessToken);
            //  TODO 정상처리 해야함
        }
    })(request, response);
})

apiRouter.post("/token/check", isAuth, authMe);

export default apiRouter;
