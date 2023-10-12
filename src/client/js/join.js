const msgAlert = (position, message, type) => {
    const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: 2000,
    });

    Toast.fire({ title: message, icon: type });
}

const userId = document.querySelector("#userId");
const userPassword = document.querySelector("#userPassword");
const userName = document.querySelector("#userName");
const joinBtn = document.querySelector("#joinBtn");

const joinFetch = async () => {
    const id = userId.value;
    const password = userPassword.value;
    const name = userName.value;
    // console.log(id);
    // console.log(password);
    // console.log(name);

    //  TODO : 서버 전송, 비밀번호 암호화 , 데이터베이스 저장

    if (!userId || !userPassword || !userName){
        msgAlert("bottom", "모든 필드를 채워주세요.", "error");
    }

    const response = await fetch("/api/join", {
        method : 'POST',
        headers : {
            "Content-Type" : "application/json",
            Accept : "application/json",
        },
        body : JSON.stringify({
            userId : id,
            userPassword : password,
            userName : name,
        })
    });
    // console.log(response);
    const result = await response.json();
    // console.log(result);

    if (response.status === 201) {
        msgAlert("center", "회원가입 성공", "success");
        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);
    }else {
        msgAlert("bottom", result.status, "error");
    }
}

joinBtn.addEventListener("click", joinFetch);