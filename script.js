// 数据存储与初始化
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    updateStats();
});

// 添加任务
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');

    // 空输入校验
    if (taskInput.value.trim() === '') return;

    // 创建新任务
    const newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false,
        category: categorySelect.value,
        createdAt: new Date()
    };

    // 添加到数组并保存
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();

    // 重置输入框
    taskInput.value = '';
    taskInput.focus();
}

// 渲染任务列表
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const activeTab = document.querySelector('.category-tab.active');
    const filter = activeTab ? activeTab.textContent : '全部';

    // 筛选任务
    let filteredTasks = tasks;
    if (filter !== '全部') {
        filteredTasks = tasks.filter(task => task.category === filter);
    }

    // 清空列表
    taskList.innerHTML = '';

    // 空状态处理
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">暂无任务</div>';
        return;
    }

    // 渲染每个任务
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="task-category">${task.category}</span>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">删除</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// 标记任务完成/未完成
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
    updateStats();
}

// 删除任务
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// 筛选任务（切换标签）
function filterTasks(filter, el) {
    // 移除所有标签的 active 类
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    // 给当前标签添加 active 类
    if (el) el.classList.add('active');
    // 重新渲染任务
    renderTasks();
}

// 更新统计数据
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
}

// 保存任务到本地存储
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
