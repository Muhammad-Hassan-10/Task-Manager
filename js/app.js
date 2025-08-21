// Task Manager App

document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeIcon = document.getElementById('dark-mode-icon');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  function setDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    darkModeIcon.textContent = on ? '☀️' : '🌙';
    darkModeToggle.setAttribute('aria-label', on ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('theme', on ? 'dark' : 'light');
  }
  // Initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
  darkModeToggle.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('dark-mode'));
  });
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function getFilteredTasks() {
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
    return tasks;
  }

  function renderTasks() {
    const filtered = getFilteredTasks();
    taskList.innerHTML = '';
    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.textContent = tasks.length === 0 ? 'No tasks yet!' : 'No tasks to show.';
      li.style.textAlign = 'center';
      li.style.color = '#94a3b8';
      taskList.appendChild(li);
      return;
    }
    filtered.forEach((task, idxFiltered) => {
      // Find the real index in tasks array
      const idx = tasks.indexOf(task);
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.setAttribute('role', 'listitem');
      li.setAttribute('tabindex', '0');
      li.innerHTML = `
        <span>${task.text}</span>
        <div class="task-actions">
          <button class="complete-btn" aria-label="Mark as completed" title="Mark as completed">✔</button>
          <button class="delete-btn" aria-label="Delete task" title="Delete">🗑</button>
        </div>
      `;
      // Complete button
      li.querySelector('.complete-btn').onclick = () => {
        tasks[idx].completed = !tasks[idx].completed;
        saveTasks();
        renderTasks();
      };
      // Delete button
      li.querySelector('.delete-btn').onclick = () => {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
      };
      taskList.appendChild(li);
    });
  }

  // Filter button logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilter = btn.getAttribute('data-filter');
      renderTasks();
    });
  });


  taskForm.onsubmit = e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.value = '';
      taskInput.focus();
      taskInput.setAttribute('aria-invalid', 'true');
      taskInput.placeholder = 'Please enter a task';
      setTimeout(() => {
        taskInput.setAttribute('aria-invalid', 'false');
        taskInput.placeholder = 'Add a new task';
      }, 1200);
      return;
    }
    tasks.unshift({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
  };

  renderTasks();
});
