const inputForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const heroInner = document.querySelector(".hero_inner");
const tasksList = document.querySelector(".task-lists");
const firstColorMode = document.querySelector(".first-color-mode");
const secondColorMode = document.querySelector(".second-color-mode");
const heading = document.querySelector(".heading");
const headingTaskList = document.querySelector(".heading-task-list");
const taskData = document.querySelectorAll(".task-data");
const modalka = document.querySelector(".modul");
const backIconModal = document.querySelector(".back-icon");
const editedTask = document.querySelector(".edited-task");
const editTaskForm = document.querySelector(".edit-task-form");



async function getData() {
    const res = await fetch("http://localhost:3000/tasks");
    const data = await res.json()
    return data;
}

getData().then((data) => {
    showTasks(data)
})

async function pointAsDone(el){
    el.childNodes[0].classList.toggle("check-done-icon-active");
    const arrClass = el.childNodes[0].classList
    let count = 0
    for (let i = 0; i < arrClass.length; i++) {
        if (arrClass[i] == "check-done-icon-active") {
            count++
        }        
    }
    console.log(count);
    if (count) {
        await fetch(`http://localhost:3000/tasks/${el.id}`,{
            method:"POST",
            body:JSON.stringify({
                done:"true"
            })
        })
        return
    } 
    await fetch(`http://localhost:3000/tasks/${el.id}`,{
        method:"POST",
    body:JSON.stringify({
        done:"false"
        })
    })

}
window.pointAsDone = pointAsDone

async function deleteTask(el){
    const taskId = el.id;
    try {
        const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "DELETE",
        });
        const data = await res.json()
        if (res.status == 200) {
            getData().then((data) => {
                if (data) showTasks(data);
            });
        } else {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to delete task');
    }
}
window.deleteTask = deleteTask

async function editTask(el){
    modalka.style.display = "flex"
    const res = await fetch(`http://localhost:3000/tasks/${el.id}`);
    const data = await res.json(res)
    editedTask.value = data.data
    editTaskForm.addEventListener("submit", async (e)=>{
        e.preventDefault()
        const newEditedTask =  e.target.new_edited_task.value.trim()
        const res = await fetch(`http://localhost:3000/tasks/${el.id}`,{
            method:"POST",
            body:JSON.stringify({
                task:newEditedTask
            })
        })
    })
}

window.editTask = editTask


function showTasks(data) {
    data = data.reverse()
    for (let i = 0; i < data.length; i++) {
        const box = document.createElement("div");
        box.className = 'task-data'
        if (data[i].done == "false") {
            box.innerHTML = `<p id="${data[i].id}">${data[i].task}</p> 
        <div class="edit-delete-wrapper"> 
            <span class="check-done" id="${data[i].id}" onclick="pointAsDone(this)"><img src='./public/images/icons/check.png' class="check-done-icon" id="${data[i].id}"></span> 
            <img src="./public/images/icons/pen.png" class="editors" onclick="editTask(this)" id="${data[i].id}"> 
            <img src="./public/images/icons/delete.png" class="editors" onclick="deleteTask(this)" id="${data[i].id}">
            <button class="btn-save" >Save</button>
        </div>
        `
        }
        else{
            box.innerHTML = `
            <p class="task-letters" id="${data[i].id}">${data[i].task}</p> 
            <div class="edit-delete-wrapper"> 
            <span class="check-done" id="${data[i].id}" onclick="pointAsDone(this)"><img src='./public/images/icons/check.png' class="check-done-icon check-done-icon-active" id="${data[i].id}"></span> 
            <img src="./public/images/icons/pen.png" class="editors edit-btn" onclick="editTask(this)" id="${data[i].id}"> 
            <img src="./public/images/icons/delete.png" class="editors" onclick="deleteTask(this)" id="${data[i].id}">
            <button class="btn-save" >Save</button>
        </div>
        `
        }
        tasksList.appendChild(box)
    }
}




async function postData(data) {
    const res = await fetch("http://localhost:3000/tasks", {
        method:"POST", 
        // headers:{"Content-type":"application/json"},
        body:JSON.stringify(data)
    });

    if (res.status == 201) {
        getData().then((data) => {
            showTasks(data)
        })
    }
}

backIconModal.addEventListener("click", ()=>{
    modalka.style.display = 'none'
})



inputForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    const taskName = event.target.task_name.value.trim()
    if(!taskName) {
    taskInput.value = ''
    return null
    }
    const data = {
        task:taskName
    }
    postData({task: taskName, done:false})
    taskInput.value = ''
    
    
})




