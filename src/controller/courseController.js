import db from "../config/db";
import { getCourseListToService } from "../service/courseService";

export const getCourseList = async (requset, response) => {

    // 로그인 여부 판단
    const userId = requset.user ? requset.user.user_id : null;

    // 서비스 호출
    const courseList = await getCourseListToService(userId); 

    // console.log(courseList);
    response.json(courseList);
}

// controller -> service (중요한 처리들) -> repository