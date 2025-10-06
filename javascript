let tasks = [];

// 添加任务
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = { id: Date.now(), text: taskText, completed: false };
    tasks.push(newTask);
    renderTasks();
    taskInput.value = '';
}

// 渲染任务列表
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">删除</button>
        `;
        taskList.appendChild(li);
    });
}

// 删除任务
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

// 页面加载时渲染任务
document.addEventListener('DOMContentLoaded', renderTasks);
