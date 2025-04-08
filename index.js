// grabbing input box, add button, and the list where tasks will go
const inputtext = document.getElementById("input");
const btn = document.getElementById("add");
const applist = document.getElementById("list");

// when "Add" button is clicked
btn.addEventListener("click", () => {
  const data = inputtext.value.trim(); // take what's typed and remove spaces

  if (data) {
    // only do stuff if there's actual input
    const li = document.createElement("li"); // create a new list item

    // setting up how each task looks: text + checkbox + delete button
    li.innerHTML = `
      <span>${data}</span>
      <input type="checkbox" class="complete-checkbox">
      <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
    `;

    applist.appendChild(li); // add the new task to the list
    inputtext.value = ""; // clear input box after adding
  }
});

//Warning: I Used Chatgpt for comments genaration don't call me copy paste devlopar🙃

// listens for checkbox being clicked (marking task complete/incomplete)
applist.addEventListener("change", (e) => {
  if (e.target.classList.contains("complete-checkbox")) {
    const span = e.target.previousElementSibling; // grab the task text

    // if checked → cross out and gray the text, else reset it
    span.style.textDecoration = e.target.checked ? "line-through" : "none";
    span.style.color = e.target.checked ? "#888" : "inherit";
  }
});

// listens for delete button click inside the task list
applist.addEventListener("click", (e) => {
  // make sure click was on delete button or the trash icon inside it
  if (
    e.target.classList.contains("delete-btn") ||
    e.target.closest(".delete-btn")
  ) {
    const confirmed = confirm("Are you sure you want to delete this task?"); // confirm delete

    if (confirmed) {
      const li = e.target.closest("li"); // grab the whole <li> to delete
      li.classList.add("fade-out"); // trigger fade out animation (handled in CSS)

      // wait a bit before actually removing it
      setTimeout(() => li.remove(), 300);
    }
  }
});
