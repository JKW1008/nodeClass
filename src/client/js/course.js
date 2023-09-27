const locationMap = document.querySelector("#location-map");
let map; 
let markers = [];
let isMapDrawn = false;
let userLatitude;
let userLongtitude;

console.log(locationMap);

const drawMap = (latitude, longtitude) => {
    const options = {
        center: new kakao.maps.LatLng(latitude, longtitude),
        level : 2
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(false);
}

const addUserMarker = () => {
    let markerImage = "/file/map_not_done.png";
    let markerSize = new kakao.maps.Size(24, 35);

    // const image = new kakao.maps.MarkerImage(markerImage, markerSize);
    let marker = new kakao.maps.Marker({
        map : map,
        position : new kakao.maps.LatLng(userLatitude, userLongtitude),
        // image : image
    });
    markers.push(marker);
}

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

const configurationLocationWatch = () => {
    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position) => {
            userLatitude = position.coords.latitude;
            userLongtitude = position.coords.longitude;

            if(!isMapDrawn){    //  !false; => true;
                drawMap(userLatitude, userLongtitude);
                addCourseMarker();
                            
                isMapDrawn = true;
            }
            //  유저 마커 그리기
            addUserMarker();
        })
    }
}

configurationLocationWatch();