document.querySelectorAll(".to-do__top").forEach(element => {
    element.onclick = ()=>{
        if (element.querySelector(".shide-btn").getAttribute("data-open") == 0){
            element.querySelector(".shide-btn").style = "transform:rotate(0deg)"
            element.parentElement.querySelector(".to-do__content").style = "transform:scaleY(1);"
            element.parentElement.querySelector(".to-do__content__wrapper").style = "transition:.3s; grid-template-rows: 1fr"
            element.querySelector(".shide-btn").setAttribute("data-open",1)
        }else{
            element.querySelector(".shide-btn").style = "transform:rotate(180deg)"
            element.parentElement.querySelector(".to-do__content").style = "transform:scaleY(0);"
            element.parentElement.querySelector(".to-do__content__wrapper").style = "transition:.3s; grid-template-rows: 0fr"
            element.querySelector(".shide-btn").setAttribute("data-open",0)
        }
    }
});

document.querySelector("#logout").onclick = ()=>{
    setCookie("token","")
    window.location.reload()
}


fetch(server+"nickname",{
    headers:{
        "Content-type":"application/json"
    },
    method:"post",
    body:JSON.stringify({
        "token":getCookie("token")
    })
}).then(r=>r.json())
.then(data=>{
    if (data.success){
        document.querySelector("#nickname-text").textContent = data.nickname
    }else if (data.success == false){
        setCookie("token","")
        window.location.reload()
    }
})