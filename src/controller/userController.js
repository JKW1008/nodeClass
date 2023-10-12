import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import db from "../config/db";


export const join = async (requset, response) => {
    const joinData = requset.body;

    // id 중복검사 (duplicate id);
    const QUERY1 = `SELECT * FROM people WHERE user_email=?`;
    const user = await db.execute(QUERY1, [joinData.userId]).then((result) => result[0][0])

    if (user) {
        return response.status(400).json({ status : "중복된 ID입니다."});
    }

    //  비밀번호 암호와
    //  8번 최소, 12번은 좀 많음
    //  높일수록 암호화 높음, 시간 많이듬.
    const hashPassword = await bcrypt.hash(joinData.userPassword, 8);
    console.log(hashPassword);

    const QUERY2 = `INSERT INTO people (user_email, user_password, user_name) VALUES (?, ?, ?)`;

    db.execute(QUERY2, [joinData.userId, hashPassword, joinData.userName])

    response.status(201).json({ status : "success" });
};

export const login = async (requset, response) => {
    const loginData = requset.body; // userId, userPssword

    //  1. 들어온 이메일에 해당하는 유저가 있는지 확인
    const QUERY1 = `SELECT * FROM people WHERE user_email = ?`;
    const user = await db.execute(QUERY1, [loginData.userId]).then((result) => result[0][0]);
    
    if (!user) {
        return response.status(400).json({ status : "아이디, 비밀번호 확인" });
    }

    //  2. 비밀번호 매칭 - DB비밀번호(암호화된 값), 프론트에서 보낸 비밀번호(1234)

    const isPsswordRight = await bcrypt.compare(loginData.userPassword, user.user_password);    //  true, false

    if (!isPsswordRight) {
        return response.status(400).json({ status : "아이디, 비밀번호 확인" });
    }

    //  3. json web Token 토큰을 만들어야함 -> 로그인 유지
    const accessToken = jwt.sign({ id: user.user_id }, process.env.SECRET_KEY , { expiresIn: process.env.JWT_EXPIRE } );  // 3개 넣을 값, 시크릿 값, 만료일

    return response.status(200).json({ accessToken: accessToken });
}

export const authMe = async (request, response) => {
    const user = request.user;
    return response.status(200).json(user);
}
