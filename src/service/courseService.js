import { findCourseListWithUser } from "../repository/courseRepository"


export const getCourseListToService = async (userId) => {
    //  비즈니스 로직 처리
    return await findCourseListWithUser(userId);
}