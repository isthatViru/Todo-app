// Get references to DOM elements
const inputtext = document.getElementById("input"); // Input field
const btn = document.getElementById("add"); // Add/Update button
const applist = document.getElementById("list"); // Task list container
const statusMsg = document.getElementById("statusMsg"); // Message text

let currentEditId = null; // Keeps track of the ID of the task being edited

// ✅ Load all tasks from localStorage when the page loads
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // Get tasks or empty array
  savedTasks.forEach(addTaskToUI); // Show each task on UI
};

// ✅ Handle Add or Update button click
btn.addEventListener("click", () => {
  const text = input.value.trim(); // Get input value and trim spaces
  if (!text) return; // Don't allow empty tasks

  if (currentEditId !== null) {
    // If editing existing task
    updateTask(text);
  } else {
    // If adding new task
    const task = {
      id: Date.now(), // Generate unique ID using timestamp
      text,
      completed: false, // Default status
    };
    saveTask(task); // Save to localStorage
    addTaskToUI(task); // Add to screen
  }

  // Reset UI state
  input.value = "";
  btn.textContent = "Add";
  statusMsg.textContent = "";
  currentEditId = null;
});

// ✅ Function to add a task to UI
function addTaskToUI(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id); // Attach ID for future reference
  li.innerHTML = `
    <input type="checkbox" ${
      task.completed ? "checked" : ""
    } class="complete-checkbox">
    <span style="${
      task.completed ? "text-decoration:line-through; color:#888" : ""
    }">
      ${task.text}
    </span>
    <button class="editBtn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;
  list.appendChild(li);
}

// ✅ Save task to localStorage
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Get existing tasks
  tasks.push(task); // Add new one
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Save back
}

// ✅ Update existing task in localStorage
function updateTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => (t.id === currentEditId ? { ...t, text } : t)); // Replace matching task
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshList(); // Redraw list
}

// ✅ Delete a task by ID
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t.id !== id); // Keep all except the one with given id
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshList();
}

// ✅ Toggle task completion (checkbox)
function toggleComplete(id, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed } : t)); // Update completed value
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshList();
}

// ✅ Re-render all tasks (after update/delete/complete)
function refreshList() {
  list.innerHTML = ""; // Clear UI
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToUI); // Show all tasks
}

// ✅ Handle Edit & Delete button clicks
list.addEventListener("click", (e) => {
  const li = e.target.closest("li"); // Find the clicked task's list item
  const id = parseInt(li.getAttribute("data-id")); // Get task ID

  if (e.target.classList.contains("editBtn")) {
    // Edit button clicked
    const text = li.querySelector("span").textContent;
    input.value = text; // Fill input with old text
    btn.textContent = "Update"; // Change button text
    currentEditId = id; // Set edit mode
    statusMsg.textContent = "Update the task below 👇";
  } else if (e.target.classList.contains("delete-btn")) {
    // Delete button clicked
    li.classList.add("fade-out"); // Add animation class
    setTimeout(() => deleteTask(id), 300); // Wait for fade then delete
  }
});

// ✅ Handle checkbox change (complete/uncomplete task)
list.addEventListener("change", (e) => {
  if (e.target.classList.contains("complete-checkbox")) {
    const li = e.target.closest("li");
    const id = parseInt(li.getAttribute("data-id"));
    toggleComplete(id, e.target.checked); // Update completed status
  }
});
