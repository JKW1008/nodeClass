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
    //  TODO 임의로 유저 데이터 만듬
    const userId = request.user.user_id;
    

    const qrInfoData = request.body;

    //  검증코드 1 : 들어온 qr코드에 해당하는 코스가 있는지 여부
    const QUERY1 = `SELECT * FROM course WHERE course_qr = ?`

    const course = await db.execute(QUERY1, [qrInfoData.qrCode]).then((result) => result[0][0]);

    if (!course) return response.status(400).json({status : "not qrCode"});

    //  검증코드 2 : 해당유저 이 코스에 방문한적이 있는지
    const QUERY2 = `SELECT * FROM people_course WHERE user_id = ? AND course_id = ?`;
    const userVisited = await db.execute(QUERY2, [userId, course.course_id]).then((result) => result[0][0]);

    if (userVisited) return response.status(400).json({ status : "already visitied"});

    console.log("성공");

    //  검증코드 3 (수학) : 반경 100m내에 있을때만 qr코드 찍을 수 있음  (선택)
    const dist = calculateDistance(qrInfoData.latitude, qrInfoData.longitude, course.latitude, course.latitude);

    if (dist > 500000) return response.status(400).json({ status : "distance over"});

    //  방문완료 - 데이터베이스에 추가
    const QUERY3 = `INSERT INTO people_course (user_id, course_id) VALUES (?, ?)`;
    await db.execute(QUERY3, [userId, course.course_id]);
    return response.status(201).json({status : "success"});
}

/* 질문 2 : 왜 경도에 코사인을 적용하는가?
* - 지구는 구 모양이므로, 위도가 변함에 따라 경도 1도의 거리도 변합니다. 적도 근처에서는 거리가 길지만,
* - 극 점으로 갈수록 그 거리는 줄어듭니다.
* - 위도에 따른 이 거리의 변화를 반영하기 위해 코사인 값을 적용합니다.
*/

const calculateDistance = (currentLat, currentLon, targetLat, targetLon) => {
    //  문자 -> 실수
    currentLat = parseFloat(currentLat);
    currentLon = parseFloat(currentLon);
    targetLat = parseFloat(targetLat);
    targetLon = parseFloat(targetLon);

    
    const dLat = (targetLat - currentLat) * 111000; //  111km
    const dLon = (targetLon - currentLon) * 111000 * Math.cos(currentLat * (Math.PI / 180));

    return Math.sqrt(dLat * dLat + dLon * dLon);
}
// controller -> service (중요한 처리들) -> repository