const columns = document.querySelectorAll('.column');
const addTaskForm = document.getElementById('addTaskForm');

// Event Listeners
addTaskForm.addEventListener('submit', handleAddTaskForm);
loadTasks();

// Persistent taskCounter.
let taskCounter = localStorage.getItem('counter');
if (!taskCounter) {
  taskCounter = 0;
}

function handleAddTaskForm(event) {
  event.preventDefault(); // Prevent default form submission
  const taskName = document.getElementById('taskName').value;
  const desc = document.getElementById('taskDescription').value;
  if (taskName) {
    addTask(taskName, desc); // Call the existing addTask function
    addTaskForm.reset();
  }
}

function makeVisible(element) {
  e = document.getElementById(element);
  if (e.style.display === "none") {
    e.style.display = "block";
  } else {
    e.style.display = "none";
  }
}

// Function to create a new task
function addTask(taskName, taskDescription) {
  //const taskName = prompt("Enter task name:");
  if (taskName) {
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    newTask.draggable = true;
    newTask.textContent = taskName;
    //console.log(taskName);
    newTask.id = `task-${taskCounter}`;

    const desc = document.createElement('div');
    desc.textContent = taskDescription;
    desc.classList.add('description');
    desc.id = `${newTask.id}-description`;
    desc.style.display = "none";

    newTask.onclick = e => {makeVisible(desc.id)}

    const taskText = document.createElement('span');
    taskText.textContent = taskName;
    newTask.appendChild(taskText);

    taskCounter++;
    columns[0].appendChild(newTask); // Add to the "To Do" column
    saveTasks();
  }
}

// Load tasks from local storage
function loadTasks() {
  const tasksData = localStorage.getItem('tasks');
  if (tasksData) {
    const tasks = JSON.parse(tasksData);
    tasks.forEach(task => {
      const columnId = task.column;
      const taskElement = document.createElement('div');
      taskElement.classList.add('task');
      taskElement.draggable = true;
      taskElement.textContent = task.name;
      taskElement.id = task.id;

      var description = document.createElement('div');
      description.id = task.id + "-description";
      description.classList.add('description');
      description.style.display = "none";
      description.textContent = task.description;


      const taskText = document.createElement('span');
      taskText.textContent = task.name;
      taskElement.appendChild(taskText);



      taskElement.appendChild(description);

      taskElement.onclick = e => {makeVisible(description.id)}
      document.getElementById(columnId).appendChild(taskElement);
    });
  }
}

// Save tasks to local storage
function saveTasks() {
  const tasks = [];
  columns.forEach(column => {
    const taskElements = column.querySelectorAll('.task');
    taskElements.forEach(taskElement => {
      //console.log(document.getElementById(`${taskElement.id}-description`))
      //console.log(taskElement);
      tasks.push({
        name: taskElement.querySelector('span').textContent,
        column: column.id,
        id: taskElement.id,
        description: document.getElementById(`${taskElement.id}-description`).textContent
      });
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('counter', taskCounter );
}

// Drag and drop functionality
columns.forEach(column => {
  column.addEventListener('dragover', e => e.preventDefault()); // Required for 'drop'
  column.addEventListener('drop', e => {
    const task = e.dataTransfer.getData('task');
    if (document.getElementById(task)) { // Check if element exists
      e.target.appendChild(document.getElementById(task));
      saveTasks();
    } else {
       console.error("Task element not found:", task);
    }
  });
});

document.addEventListener('dragstart', e => {
  console.log(e.target);
  e.dataTransfer.setData('task', e.target.id);
});
