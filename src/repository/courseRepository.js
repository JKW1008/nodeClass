import db from "../config/db.js";

export const findCourseListWithUser = async (userId) => {
    // 데이터 베이스에서 각 두테이블의 데이터 값을가져온다.
    // 두 테이블간 course_id가 일치해야한다. 
    //people_course 테이블의 user_id 컬럼은 어떤 값(여기서는 물음표 ?로 표시)과 일치해야 하는 추가적인 조건이 있습니다.
    // 결과로 반환되는 데이터에는 course 테이블의 모든 열과 people_course 테이블의 user_course_id 열이 포함됩니다.
    // 이 쿼리는 LEFT JOIN을 사용하여 course 테이블의 모든 레코드를 유지한 채로, people_course 테이블과 조인하며, 추가적인 조건에 일치하는 레코드만을 결과로 반환합니다.
    const  QUERY = `
    SELECT c.*, pc.user_course_id FROM course c LEFT JOIN people_course pc 
    ON c.course_id = pc.course_id AND pc.user_id = ?`;
    
    return db.execute(QUERY, [1]).then((result) => result[0]);
}