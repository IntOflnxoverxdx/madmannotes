let auth_option = 0 //0 - логин 1 - регистрация
document.querySelector("#login-option").onclick = ()=>{
    auth_option = 0
    setOption()
}
document.querySelector("#register-option").onclick = ()=>{
    auth_option = 1
    setOption()
}
setOption()


function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


function setOption(){
    document.querySelector("#option-value").style.transform = `translateX(${100*auth_option}%)`
    if (auth_option){
        document.querySelector(".auth__bottom").innerHTML = 
        `
        <label for="">Почта</label>
        <input id="email-input" type="email" placeholder="Example@gmail.com">
        <label for="">Ник</label>
        <input id="nick-input" type="text" placeholder="Вася2008 разрушитель">
        <label for="">Пароль</label>
        <input id="password-input" type="password" placeholder="••••••••">
        <label for="">Подтверждение пароля</label>
        <input id="passwordconfirm-input" type="password" placeholder="••••••••">
        <button class="btn" id="register-btn">Региистрация</button>
        `
        document.querySelector("#register-btn").onclick = () =>{
            email = document.querySelector("#email-input").value
            nickname = document.querySelector("#nick-input").value
            password = document.querySelector("#password-input").value
            password_val = document.querySelector("#passwordconfirm-input").value
            if (!validateEmail(email)){
                alert("Неверный адрес электронной почты")
            }else if (nickname == ""){
                alert("Имя не может быть пустым")
            } else if (password == ""){
                alert("Пароль не может быть пустым")
            }else if (password_val != password){
                alert("Пароли не совпадают")
            }else{
                fetch(server+"register",{
                    method:"POST",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body:JSON.stringify({
                        "nickname":nickname,
                        "password":password,
                        "email":email
                    })
                }).then(r=>r.json())
                .then(data=>{
                    if (!data.success){
                        alert(data.message)
                    }else{
                        setCookie("token",data.token)
                        window.location.href = "index.html"
                    }
                })
            }
        }
    }else{
        document.querySelector(".auth__bottom").innerHTML = 
        `
        <label for="">Почта</label>
        <input id="email-input" type="email" placeholder="Example@gmail.com">
        <label for="">Пароль</label>
        <input id="password-input" type="password" placeholder="••••••••">
        <button class="btn" id="login-btn">Вход</button>
        `
        document.querySelector("#login-btn").onclick = () =>{
            let passes = true
            email = document.querySelector("#email-input").value
            password = document.querySelector("#password-input").value
            if (!validateEmail(email)){
                alert("Неверный адрес электронной почты")
                passes = false
            }else if (password == ""){
                alert("Пароль не может быть пустым")
                passes = false
            }
            if (passes){
                fetch(server+"login",{
                    method:"POST",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body:JSON.stringify({
                        "password":password,
                        "email":email
                    })
                }).then(r=>r.json())
                .then(data=>{
                    if (!data.success){
                        alert(data.message)
                    }else{
                        setCookie("token",data.token)
                        window.location.href = "index.html"
                    }
                })
            }
        }
    }
}

