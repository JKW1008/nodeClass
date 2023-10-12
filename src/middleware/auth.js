import jwt from "jsonwebtoken";
import db from "../config/db";

export const isAuth = async (request, response, next) => {
    //  헤더의 key 값의 Authorization value를 가져온다
    //  { Authorization : "Bearer accessToken 값"}
    const authHeader = request.get("Authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //  인증이 필요한데 인증안함 (401)
        return response.status(401).json({ status : "인증 실패" })
    }

    //  정상 응답
    //  ["Bearer", "accessToken"];
    //      0           1
    const token = authHeader.split(" ")[1];
    // console.log("=========================================")
    // console.log(token);
    
    //  jwt 토큰 풀기
    jwt.verify(
        token,
        process.env.SECRET_KEY,
        async (error, decoded) => {
            if (error) {
                return response.status(401).json({ status : "인증실패"});
            }
            const id = decoded.id;  // 7

            const QUERY = `SELECT * FROM people WHERE user_id = ?`;
            const user = await db.execute(QUERY, [id]).then((result) => result[0][0]);

            // console.log(user);

            if (!user) {
                return response.status(401).json({ status : "인증 실패"});
            }

            request.user = user;
            next();
        }
    )
}

export const handleKakaoLogin = async (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    console.log("==========================");
    const provider = profile.provider;
    const id = profile.id;
    const username = profile.username;
    const profileImage = profile._json.properties.profile_image;
    // console.log(provider);  //  kakao
    // console.log(id);    //  kakao 고유 numbering
    // console.log(username);  //  이름
    // console.log(profileImage);    //  프로필 사진

    const QUERY1 = "SELECT * FROM people WHERE user_email = ? AND user_provider = ?";

    // 첫접속 확인
    let user = await db.execute(QUERY1, [id, provider]).then((result) => result[0][0]);
    console.log(user);  

    //  첫 접속 -> 회원가입 -> 로그인
    //  회원가입
    if (!user){
        const QUERY2 = `INSERT INTO people (user_email, user_name, user_image, user_provider) VALUES (?, ?, ?, ?)`;

        const data = await db.execute(QUERY2, [id, username, profileImage, provider])
            .then((result) => result[0]);
        console.log(data);
        user = { user_id : data.insertId };
    }
    //  이후 접속 -> 로그인(회원가입 완료상태)
    //  로그인 완료
    return done(null, user);
}