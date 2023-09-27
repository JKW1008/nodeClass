const locationMap = document.querySelector("#location-map");
let map; 
let markers = [];
let isMapDrawn = false;
let userLatitude;
let userLongtitude;

// console.log(locationMap);
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
const addCourseMarker = () => {
    let markerImage = "/file/map_not_done.png";
    let markerSize = new kakao.maps.Size(24, 35);

    const image = new kakao.maps.MarkerImage(markerImage, markerSize);
    const position = new kakao.maps.LatLng(35.87562072321663, 128.6814977729706);
    new kakao.maps.Marker({
        map : map,
        position : position,
        title : "영진",
        image : image
    })
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
                addCourseMarker();
                            
                isMapDrawn = true;
            }
            //  유저 마커 그리기
            addUserMarker();
            panTo(userLatitude, userLongtitude);
        })
    }
}

configurationLocationWatch();