const locationMap = document.querySelector("#location-map");
let map; 
let markers = [];
let isMapDrawn = false;
let userLatitude;
let userLongtitude;

//  TODO 추후 사라질 수 있음
let courseListInfo = [];
let clickCourseId = 0;

//  지도 그리는 함수
const drawMap = (latitude, longtitude) => {
    const options = {
        center: new kakao.maps.LatLng(latitude, longtitude),
        level : 2
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(false);
}

//  마커를 초기화 하는 함수 (유저 마커가 새로생길때 기존 마커를 초기화)
const deleteMarkers = () => {
    for(let i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
    markers = [];
}

//  해당 위치로 지도를 이동하는 함수
const panTo = (latitude, longitude) => {
    map.panTo(new kakao.maps.LatLng(latitude, longitude));
}

// 유저 마커 그리기 함수
const addUserMarker = () => {

    let marker = new kakao.maps.Marker({
        map : map,
        position : new kakao.maps.LatLng(userLatitude, userLongtitude),
        title : '내 현재 위치',
    });
    markers.push(marker);
}

//  코스 마커 그리기 함수
const addCourseMarker = (course) => {
    let markerImage = "/file/map_not_done.png";
    let markerSize = new kakao.maps.Size(24, 35);

    if(course.user_course_id){
        markerImage = "/file/map_complete.jpg"
        markerSize = new kakao.maps.Size(40, 50);
    }
    const image = new kakao.maps.MarkerImage(markerImage, markerSize);
    const position = new kakao.maps.LatLng(course.course_latitude, course.course_longitude);
    new kakao.maps.Marker({
        map : map,
        position : position,
        title : course.course_name,
        image : image
    })
}

//  모든 코스를 돌면서 마커를 그리기위한 함수
const allCoursMarker = () => {
    for(let i = 0; i < courseListInfo.length; i++){
        addCourseMarker(courseListInfo[i]);
    }
}

const clickCourseList = (e, courseId) => {
    if (clickCourseId !== courseId) {
        const courseWrap = document.querySelectorAll(".course");
        for(let i = 0; i < courseWrap.length; i++){
            courseWrap[i].classList.remove("on")
        }
        e.currentTarget.classList.add("on")

        let courseLatitude;
        let courseLongtitude;

        if(courseId === 0){
            courseLatitude = userLatitude;
            courseLongtitude = userLongtitude;
        }else{
            let matchedCourse = courseListInfo.find(course => course.course_id === courseId);
            courseLatitude = matchedCourse.course_latitude;
            courseLongtitude = matchedCourse.course_longitude;
        }
        panTo(courseLatitude, courseLongtitude);
        clickCourseId = courseId;
    }
}

//  현재 위치 감시 함수 -> 위치정보를 가져오는데에 동의하면 위치정보가 갱신될때 마다 계성 정보를 가지고 함수를 실행
const configurationLocationWatch = () => {
    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position) => {
            deleteMarkers();

            userLatitude = position.coords.latitude;
            userLongtitude = position.coords.longitude;

            if(!isMapDrawn){    //  !false; => true;
                drawMap(userLatitude, userLongtitude);
                allCoursMarker();
                isMapDrawn = true;
            }
            //  유저 마커 그리기
            addUserMarker();
            if(clickCourseId === 0){
                panTo(userLatitude, userLongtitude);
            }
        })
    }
}

const makeNaviagtionHtml = () => {
    const courseWrap = document.getElementById("course-wrap");
    // console.log(courseWrap);
    let html = "";
    for(let i = 0; i < courseListInfo.length; i++){
        html += `<li class="course" onclick="clickCourseList(event, ${courseListInfo[i].course_id})">`;
        if(courseListInfo[i].user_course_id){
            html += `<div class="mark-wrap"><img src="/file/complete.png"/></div>`
        }
        html += `   <p>${courseListInfo[i].course_name}</p>`;
        html += `</li>`;
    }

    html += `<li id="myPosition" class="course on" onclick="clickCourseList(event, 0)">나의 위치</li>`

    // console.log(html);
    courseWrap.innerHTML = html;
}

//  코스 정보 받아온 다음에 할일
const afterGetCourseList = () => {
    configurationLocationWatch();
}

//  백엔드 서버로 코스정보 요청
const getCourseListFetch = async () => {
    const response = await fetch("/api/courses")
    console.log(response);

    const result = await response.json();
    courseListInfo = result;
    // console.log(courseListInfo);
    // console.log(result);
    afterGetCourseList();
    makeNaviagtionHtml();
}

getCourseListFetch();