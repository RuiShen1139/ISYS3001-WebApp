// 从 localStorage 加载数据（修复核心：数据持久化）
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    // ... 原有逻辑不变 ...
    tasks.push(newTask);
    saveTasks(); // 新增：保存到本地存储
    renderTasks();
    // ...
}

function deleteTask(id) {
    // ... 原有逻辑不变 ...
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(); // 新增：保存到本地存储
    renderTasks();
}

// 新增：保存任务到 localStorage 的函数
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ... 原有 renderTasks 和 DOMContentLoaded 逻辑不变 ...
