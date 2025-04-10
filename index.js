// Get references to DOM elements
const inputtext = document.getElementById("input"); // Input field
const btn = document.getElementById("add"); // Add/Update button
const applist = document.getElementById("list"); // Task list container
const statusMsg = document.getElementById("statusMsg"); // Message text
const darkToggle = document.getElementById("darkToggle");
const prioritySelect = document.getElementById("priority");
const filterPriority = document.getElementById("filterPriority");
const filterStatus = document.getElementById("filterStatus");
const deleteSound = document.getElementById("deleteSound");

let currentEditId = null; // Keeps track of the ID of the task being edited

// Load dark mode setting from localStorage
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
});

// ✅ Load all tasks from localStorage when the page loads
window.onload = () => {
  refreshList();
};

// ✅ Handle Add or Update button click
btn.addEventListener("click", () => {
  const priority = prioritySelect.value;
  const text = inputtext.value.trim(); // Get input value and trim spaces
  if (!text) return; // Don't allow empty tasks

  if (currentEditId !== null) {
    // If editing existing task
    updateTask(text, priority);
  } else {
    // If adding new task
    const task = {
      id: Date.now(),
      text,
      completed: false,
      priority,
    };
    saveTask(task);
  }

  playSound("completeSound"); // ✅ Play sound after add/update

  // Reset UI state
  inputtext.value = "";
  prioritySelect.value = "medium";
  btn.textContent = "Add";
  statusMsg.textContent = "";
  currentEditId = null;
  refreshList();
});

// ✅ Function to add a task to UI
function addTaskToUI(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  li.classList.add("fade-in");

  li.innerHTML = `
    <label class="custom-checkbox">
      <input type="checkbox" ${
        task.completed ? "checked" : ""
      } class="complete-checkbox" />
      <span class="checkmark"></span>
    </label>
    <span style="${
      task.completed ? "text-decoration:line-through; color:#888" : ""
    }">
      ${task.text} ${task.completed ? "🎉" : ""}
    </span>
    <span class="priority-label ${task.priority}">${task.priority}</span>
    <button class="editBtn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;
  applist.appendChild(li);
}

// ✅ Save task to localStorage
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Update existing task in localStorage
function updateTask(text, priority) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) =>
    t.id === currentEditId ? { ...t, text, priority } : t
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  currentEditId = null;
}

// ✅ Delete a task by ID
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // Reset and play the sound every time
  deleteSound.pause(); // stop if it’s still playing
  deleteSound.currentTime = 0; // rewind
  deleteSound.play(); // play again

  const li = document.querySelector(`li[data-id="${id}"]`);
  li.classList.add("fade-out");
  li.classList.add("swish-out");

  setTimeout(() => {
    tasks = tasks.filter((t) => t.id !== id); // Remove task from array
    saveTasks(tasks); // Save updated tasks to localStorage
    refreshList(); // Re-render the updated task list
  }, 400); // match fade-out time
}

// ✅ Save updated tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Toggle task completion (checkbox)
function toggleComplete(id, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed } : t));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshList();
  if (completed) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

// ✅ Re-render all tasks (after update/delete/complete)
function refreshList() {
  applist.innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const selectedPriority = filterPriority.value;
  const selectedStatus = filterStatus.value;

  const filtered = tasks.filter((task) => {
    const priorityMatch =
      selectedPriority === "all" || task.priority === selectedPriority;
    const statusMatch =
      selectedStatus === "all" ||
      (selectedStatus === "completed" && task.completed) ||
      (selectedStatus === "incomplete" && !task.completed);
    return priorityMatch && statusMatch;
  });

  filtered.forEach(addTaskToUI);
}

// ✅ Handle Edit & Delete button clicks
applist.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  const id = parseInt(li.getAttribute("data-id"));

  if (e.target.classList.contains("editBtn")) {
    const text = li.querySelector("span").textContent.trim();
    const priority = li.querySelector(".priority-label").textContent.trim();
    inputtext.value = text;
    prioritySelect.value = priority;
    btn.textContent = "Update";
    currentEditId = id;
    statusMsg.textContent = "Update the task below 👇";
  } else if (e.target.classList.contains("delete-btn")) {
    li.classList.add("fade-out");
    setTimeout(() => deleteTask(id), 300);
  }
});

// ✅ Handle checkbox change (complete/uncomplete task)
applist.addEventListener("change", (e) => {
  if (e.target.classList.contains("complete-checkbox")) {
    const li = e.target.closest("li");
    const id = parseInt(li.getAttribute("data-id"));
    toggleComplete(id, e.target.checked);
  }
});

// ✅ Handle Enter Key on addBtn
inputtext.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// ✅ Handle filter changes
filterPriority.addEventListener("change", refreshList);
filterStatus.addEventListener("change", refreshList);
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS Loaded");

  const addBtn = document.getElementById("add");
  const input = document.getElementById("input");
  const list = document.getElementById("list");

  addBtn.addEventListener("click", () => {
    const task = input.value.trim();
    if (!task) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task}</span>
      <button class="delete-btn">Delete</button>
    `;
    list.appendChild(li);
    input.value = "";
  });
});
