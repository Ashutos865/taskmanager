const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterContainer = document.getElementById('filter-container');
const counter = document.getElementById('task-counter');
const clearBtn = document.getElementById('clear-completed-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function render() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskList.innerHTML = '';

    const filtered = tasks.filter(t => {
        if (currentFilter === 'pending') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    if (filtered.length === 0) {
        taskList.innerHTML = `<li class="empty-state">No tasks</li>`;
    } else {
        const fragment = document.createDocumentFragment();

        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);

            const safeText = task.text.replace(/[&<>'"]/g, 
                char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char)
            );

            li.innerHTML = `
                <label class="task-label">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${safeText}</span>
                </label>
                <button class="delete-btn">×</button>
            `;
            fragment.appendChild(li);
        });

        taskList.appendChild(fragment);
    }

    const active = tasks.filter(t => !t.completed).length;
    counter.textContent = `${active} item${active === 1 ? '' : 's'} left`;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({ id: Date.now().toString(), text, completed: false });
    input.value = '';
    render();
});

taskList.addEventListener('click', e => {
    const item = e.target.closest('.task-item');
    if (!item) return;

    const id = item.dataset.id;

    if (e.target.classList.contains('delete-btn')) {
        tasks = tasks.filter(t => t.id !== id);
        render();
    } else if (e.target.classList.contains('task-checkbox')) {
        const targetTask = tasks.find(t => t.id === id);
        targetTask.completed = e.target.checked;
        render();
    }
});

filterContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('filter-btn')) return;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    render();
});

clearBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    render();
});

render();
