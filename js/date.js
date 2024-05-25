today = new Date().toLocaleString("ru-RU").split(",")[0]
document.querySelector(".date").innerHTML = today;
document.querySelector("#deadline-input").setAttribute("min",today.split(".").reverse().join("-"))