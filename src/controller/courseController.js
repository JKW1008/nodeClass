import db from "../config/db";
import { getCourseListToService } from "../service/courseService";

export const getCourseList = async (request, response) => {

    // 로그인 여부 판단
    const userId = request.user ? request.user.user_id : null;

    // 서비스 호출
    const courseList = await getCourseListToService(userId); 

    // console.log(courseList);
    response.json(courseList);
}

export const qrCheck = async (request, response) => {
    const qrInfoData = request.body;

    //  검증코드 1 : 들어온 qr코드에 해당하는 코스가 있는지 여부
    const QUERY1 = `SELECT * FROM course WHERE course_qr = ?`

    const course = await db.execute(QUERY1, [request.body.qrCode]).then((result) => result[0][0]);

    if (!course) return response.status(400).json({status : "fail"});

    console.log("성공");
}

// controller -> service (중요한 처리들) -> repository