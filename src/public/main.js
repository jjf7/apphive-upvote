const socket = io();

const container = document.querySelector("#container");

  
socket.on("block", (data) => {

  const div = document.createElement("div");

  div.classList = "card p-3";

  const p = document.createElement("div");

  p.classList = "card";

  
  if (data.parentUser === "") {
    
    p.innerHTML = `<div>El usuario <b>${data.tag}</b> ha publicado</div> <div class='alert alert-info'>${data.result}</div>`
  
  } else {

    p.innerHTML = `<div>El usuario <b>${data.tag}</b> ha comentado el post de <b>${data.parentUser}</b></div> <div class='alert alert-info'>${data.result}</div>`
   
  }

 
  div.appendChild(p);

  container.prepend(div);
});

document.querySelector(".cancel").addEventListener("click", () => {
  console.log("Paused");
  document.querySelector('.loader').classList.add('visually-hidden')
  socket.emit("events", (action = false));
});

document.querySelector(".resume").addEventListener("click", () => {
  console.log("Resume");
  document.querySelector('.loader').classList.remove('visually-hidden')
  socket.emit("events", (action = true));
});
