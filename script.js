let tasksData={}

const todo=document.querySelector('#todo')
const progress=document.querySelector('#progress')
const done=document.querySelector('#done')
const columns=[todo,progress,done];

let dragElement=null;

function addTask (title, description,column){
    const div=document.createElement("div")

    div.classList.add("task");
    div.setAttribute("draggable","true")

    div.innerHTML=`
    <h2>${title}</h2>
    <p>${description}</p>
    <button>Delete</button>
    `
    column.appendChild(div);

    div.addEventListener("drag",(e)=>{
        dragElement=div;
    })

    const deleteButton=div.querySelector("button");
    deleteButton.addEventListener("click",()=>{
        div.remove();
        updateTaskCount();
    })

    return div;
    
}

function updateTaskCount(){
    columns.forEach(col=>{
            const tasks=col.querySelectorAll(".task");
            const count=col.querySelector(".right");
            
            tasksData[col.id]=Array.from(tasks).map(t => {
                return {
                    title: t.querySelector("h2").innerText,
                    description: t.querySelector("p").innerText
                }
            })
            
            localStorage.setItem("tasks",JSON.stringify(tasksData));
            count.innerText=tasks.length;
        })
}

if(localStorage.getItem("tasks")){
    const data=JSON.parse(localStorage.getItem("tasks"));

    for(const col in data){
        const column=document.querySelector(`#${col}`);
        data[ col ].forEach(task=>{
            addTask(task.title, task.description, column);
            
        })
    }

    updateTaskCount();
}

const tasks=document.querySelectorAll('.task');

tasks.forEach(task =>{
    task.addEventListener("drag",(e)=>{
        // console.log("dragging",e);
        draggedElement=task;
    })
})

function addDragEventsOnColumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        column.classList.add("hover-over");5
    })
    column.addEventListener("dragleave",(e)=>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })
    column.addEventListener("dragover",(e)=>{
        e.preventDefault();
    })
    column.addEventListener("drop",(e)=>{
        e.preventDefault();
        column.appendChild(draggedElement);
        column.classList.remove("hover-over");


        updateTaskCount();


    })
}
addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

const toggleModalButton=document.querySelector("#toggle-modal");
const modalBg=document.querySelector(".modal .bg");
const modal=document.querySelector(".modal");

toggleModalButton.addEventListener("click",()=>{
    modal.classList.toggle("active");
})
modalBg.addEventListener("click",()=>{
    modal.classList.remove("active");
})
const addTaskButton=document.querySelector('#add-task')

addTaskButton.addEventListener("click",()=>{

const taskTitle=document.querySelector('#task-title-input').value
const taskDescription=document.querySelector('#task-description-input').value

console.log('Title:', taskTitle);
console.log('Description:', taskDescription);

addTask(taskTitle, taskDescription, todo);
updateTaskCount();
modal.classList.remove("active")

document.querySelector('#task-title-input').value="";
document.querySelector('#task-description-input').value="";

})
