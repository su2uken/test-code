(function () {
    "use strict";

    const STORAGE_KEY = "todo-app.todos";

    const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    const list = document.getElementById("todo-list");
    const countEl = document.getElementById("todo-count");
    const clearBtn = document.getElementById("clear-completed");
    const filterBtns = document.querySelectorAll(".filter-btn");

    let todos = loadTodos();
    let currentFilter = "all";

    function loadTodos() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to load todos:", e);
            return [];
        }
    }

    function saveTodos() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    function createId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function addTodo(text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        todos.push({
            id: createId(),
            text: trimmed,
            completed: false,
            createdAt: Date.now(),
        });
        saveTodos();
        render();
    }

    function toggleTodo(id) {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }

    function deleteTodo(id) {
        todos = todos.filter((t) => t.id !== id);
        saveTodos();
        render();
    }

    function clearCompleted() {
        todos = todos.filter((t) => !t.completed);
        saveTodos();
        render();
    }

    function getFilteredTodos() {
        if (currentFilter === "active") return todos.filter((t) => !t.completed);
        if (currentFilter === "completed") return todos.filter((t) => t.completed);
        return todos;
    }

    function render() {
        list.innerHTML = "";
        const filtered = getFilteredTodos();

        if (filtered.length === 0) {
            const li = document.createElement("li");
            li.className = "empty-state";
            li.textContent =
                currentFilter === "all"
                    ? "タスクがまだありません"
                    : currentFilter === "active"
                    ? "未完了のタスクはありません"
                    : "完了したタスクはありません";
            list.appendChild(li);
        } else {
            for (const todo of filtered) {
                list.appendChild(renderItem(todo));
            }
        }

        const remaining = todos.filter((t) => !t.completed).length;
        countEl.textContent = `残り: ${remaining}件`;
    }

    function renderItem(todo) {
        const li = document.createElement("li");
        li.className = "todo-item" + (todo.completed ? " completed" : "");
        li.dataset.id = todo.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.setAttribute("aria-label", "削除");
        deleteBtn.textContent = "✕";
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        return li;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = "";
        input.focus();
    });

    clearBtn.addEventListener("click", clearCompleted);

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
            render();
        });
    });

    render();
})();
