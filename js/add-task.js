document.querySelector(".add-task__overlay").onclick = (e)=>{
    document.querySelector(".add-task__wrapper").style = "display:none;"
}

document.querySelector("#add-task-btn").onclick = ()=>{
    document.querySelector(".add-task__wrapper").style = "display:block;"
}

function addtask(name,deadline,status){
    console.log(deadline);
    deadline = new Date(deadline)
    days = (deadline - new Date(today.split(".").reverse().join("-")))/86400000
    code =
    `
    <div class="task">
        <div class="task__name">
            ${name}
        </div>
        ${status == "active" && days>=0?`
        <div class="task__deadline">
            До: ${deadline.toLocaleString("ru-RU").split(",")[0]}
        </div>
        <div class="task__actions">
            <img src="img/icons/reject.svg" alt="" class="action__reject">
            <img src="img/icons/done.svg" alt="" class="action__done">
        </div>`:`
        <div class="task__actions">
            <img src="img/icons/delete.svg" alt="" class="action__delete">
        </div>`}
    </div>
    `
    if (status == "active"){
        if (days < 0){
            document.querySelector(".rejected .to-do__content").innerHTML += code
            fetch(server+"setstatus",{
                method:"post",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({
                    "name":name,
                    "status":"rejected",
                    "token":getCookie("token")
                })
            }).then(r=>r.json())
            .then(data=>{
                console.log(data);
            })
        }else if (days <= 2){
            document.querySelector(".quickly .to-do__content").innerHTML += code
        }else if (days <= 7){
            document.querySelector(".soon .to-do__content").innerHTML += code
        }else{
            document.querySelector(".later .to-do__content").innerHTML += code
        }
    }else if (status=="done"){
        document.querySelector(".done .to-do__content").innerHTML += code
    }
    else{
        document.querySelector(".rejected .to-do__content").innerHTML += code
    }
}


document.querySelector("#send-task-btn").onclick = ()=>{
    taskname = document.querySelector("#task-name").value
    deadline = document.querySelector("#deadline-input").value
    document.querySelector("#task-name").value = ""
    document.querySelector("#deadline-input").value = ''
    document.querySelector(".add-task__wrapper").style = "display:none;"
    if (taskname == ""){
        alert("У задачи должно быть название")
    } else if (deadline == ""){
        alert("Укажите дедлайн")
    } else{
        fetch(server+"addtask",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                "taskname":taskname,
                "token":getCookie("token"),
                "deadline":deadline
            })
        }).then(r=>r.json())
        .then(data=>{
            if (!data.success){
                alert(data.message)
            }else{
                addtask(taskname,deadline,"active")
            }
        })
    }
}



fetch(server+"gettasks",{
    method:"post",
    headers:{
        "Content-type":"application/json"
    },
    body:JSON.stringify({
        "token":getCookie("token")
    })
}).then(r=>r.json())
.then(data=>{

    data.tasks.forEach(task => {
        addtask(task.name,task.deadline,task.status)
    });
    document.querySelectorAll(".action__reject").forEach(button => {
        button.onclick = ()=>{
            if (confirm(`Отказаться от выполнения задачи ${button.parentElement.parentElement.querySelector(".task__name").textContent.trim()}?`))
            fetch(server+"setstatus",{
                method:"post",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({
                    "name":button.parentElement.parentElement.querySelector(".task__name").textContent.trim(),
                    "status":"rejected",
                    "token":getCookie("token")
                })
            }).then(r=>r.json())
            .then(data=>{
                el = button.parentElement.parentElement
                document.querySelector(".rejected").querySelector(".to-do__content").appendChild(el);
            })
        }
    });
    document.querySelectorAll(".action__done").forEach(button => {
        button.onclick = ()=>{
            if (confirm(`Отметить выполненной задачу ${button.parentElement.parentElement.querySelector(".task__name").textContent.trim()}?`))
            fetch(server+"setstatus",{
                method:"post",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({
                    "name":button.parentElement.parentElement.querySelector(".task__name").textContent.trim(),
                    "status":"done",
                    "token":getCookie("token")
                })
            }).then(r=>r.json())
            .then(data=>{
                el = button.parentElement.parentElement
                document.querySelector(".done").querySelector(".to-do__content").appendChild(el);
            })
        }
    });
    document.querySelectorAll(".action__delete").forEach(button => {
        button.onclick = ()=>{
            if (confirm(`Удалить задачу ${button.parentElement.parentElement.querySelector(".task__name").textContent.trim()}?`))
            fetch(server+"delete",{
                method:"post",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({
                    "name":button.parentElement.parentElement.querySelector(".task__name").textContent.trim(),
                    "status":"done",
                    "token":getCookie("token")
                })
            }).then(r=>r.json())
            .then(data=>{
                button.parentElement.parentElement.remove()
            })
        }
    });
})

interval = setInterval(() => {
    if ("Notification" in window){
        if (Notification.permission === "granted"){
            clearInterval(interval)
            startNotifications()
        }else{
            Notification.requestPermission().then((res)=>{
                if (res === "granted"){
                    clearInterval(interval)
                    startNotifications()
                }
            })
        }
    }
    
}, 500);



function notify(){
    document.querySelector(".quickly").querySelectorAll(".task").forEach(task => {
        deadline = new Date(task.querySelector(".task__deadline").innerHTML.trim().split(" ")[1].split(".").reverse().join("-"))
        days = (deadline - new Date(today.split(".").reverse().join("-")))/86400000
        if (days == 0){
            new Notification("Дедлайн близко",{
                body:`Скорее, нужно ${task.querySelector(".task__name").innerHTML.trim()}`
            });
        }
    });
}

function startNotifications(){
    notify()
    setInterval(() => {
        notify()
    }, 3600000);
}