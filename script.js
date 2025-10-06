// ====== 数据与常量 ======
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let customCategories = JSON.parse(localStorage.getItem('customCategories')) || ['旅行', '健康'];
const reservedCategories = new Set(['全部', '工作', '学习', '生活', '购物', '其他']);

// ====== 初始化 ======
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    renderCustomCategories();
    updateStats();
});

// ====== 任务相关 ======
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');

    if (taskInput.value.trim() === '') return;

    const newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false,
        category: categorySelect.value,
        createdAt: new Date()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();

    taskInput.value = '';
    taskInput.focus();
}

function addTaskToCategory(category) {
    const taskInput = document.getElementById('taskInput');

    if (taskInput.value.trim() === '') return;

    const newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false,
        category: category,
        createdAt: new Date()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();

    taskInput.value = '';
    taskInput.focus();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const categoryFilter = document.querySelector('.category-tab.active')?.textContent || '全部';

    let filteredTasks = tasks;
    if (categoryFilter !== '全部') {
        filteredTasks = tasks.filter(task => task.category === categoryFilter);
    }

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">暂无任务</div>';
        return;
    }

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

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// ====== 分类筛选 tabs ======
function filterTasks(filter, el) {
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    if (el) el.classList.add('active');
    renderTasks();
}

// ====== 统计 ======
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
}

// ====== 本地存储 ======
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveCustomCategories() {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
}

// ====== 自定义分类：新增、渲染、删除 ======
function addCustomCategory() {
    const input = document.getElementById('newCategoryInput');
    const categoryName = input.value.trim();

    if (categoryName === '') return;

    if (reservedCategories.has(categoryName)) {
        alert(`「${categoryName}」为内置或保留分类，不能作为自定义分类。`);
        input.value = '';
        return;
    }
    if (customCategories.includes(categoryName)) {
        alert(`已存在「${categoryName}」分类。`);
        input.value = '';
        return;
    }

    customCategories.push(categoryName);
    saveCustomCategories();
    renderCustomCategories();
    updateCategorySelect();

    input.value = '';
}

function renderCustomCategories() {
    const container = document.getElementById('customCategoriesContainer');
    container.innerHTML = '';

    customCategories.forEach(category => {
        const tag = document.createElement('span');
        tag.className = 'custom-category-tag';
        tag.textContent = category;
        tag.setAttribute('role', 'button');
        tag.setAttribute('title', `点击可将上方输入框内容添加到「${category}」`);
        tag.onclick = () => addTaskToCategory(category);

        const del = document.createElement('button');
        del.className = 'delete-category-btn';
        del.title = `删除「${category}」`;
        del.textContent = '×';
        del.onclick = (e) => {
            e.stopPropagation();
            deleteCustomCategory(category);
        };

        tag.appendChild(del);
        container.appendChild(tag);
    });
}

function deleteCustomCategory(category) {
    if (category === '全部') return;
    if (!customCategories.includes(category)) return;

    const ok = confirm(`确定删除分类「${category}」吗？\n该分类下的任务将自动移动到「其他」。`);
    if (!ok) return;

    customCategories = customCategories.filter(c => c !== category);
    saveCustomCategories();

    let changed = false;
    tasks = tasks.map(t => {
        if (t.category === category) {
            changed = true;
            return { ...t, category: '其他' };
        }
        return t;
    });
    if (changed) saveTasks();

    updateCategorySelect();
    renderCustomCategories();
    renderTasks();
    updateStats();
}

// ====== 下拉选项同步 ======
function updateCategorySelect() {
    const select = document.getElementById('categorySelect');
    const currentSelected = select.value;

    const defaultOptions = Array.from(select.options).slice(0, 5);
    select.innerHTML = '';
    defaultOptions.forEach(option => select.appendChild(option));

    customCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    select.value = Array.from(select.options).some(o => o.value === currentSelected)
        ? currentSelected
        : '其他';
}

// ====== 键盘回车快捷添加 ======
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});

document.getElementById('newCategoryInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addCustomCategory();
});
