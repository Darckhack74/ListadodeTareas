document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.querySelector(".task-text");
    const startDateInput = document.querySelector("#startDate");
    const endDateInput = document.querySelector("#endDate");
    const addTaskBtn = document.querySelector(".add-task-btn");
    const taskList = document.getElementById("taskList");
    const filterAll = document.getElementById("filterAll");
    const filterActive = document.getElementById("filterActive");
    const filterCompleted = document.getElementById("filterCompleted");

    addTaskBtn.addEventListener("click", addTask);
    taskList.addEventListener("contextmenu", deleteTask);
    taskList.addEventListener("click", toggleTask);
    filterAll.addEventListener("click", filterTasks);
    filterActive.addEventListener("click", filterTasks);
    filterCompleted.addEventListener("click", filterTasks);

    flatpickr(".date-input", {
        enableTime: true, // Habilita la selección de hora
        dateFormat: "Y-m-d H:i", // Formato de fecha y hora
        time_24hr: true // Usa formato de 24 horas para la hora
    });

    loadTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        const startDateTime = startDateInput.value;
        const endDateTime = endDateInput.value;

        // Validar que la fecha de finalización sea posterior a la fecha de inicio
        if (taskText !== "" && startDateTime !== "" && endDateTime !== "" && endDateTime >= startDateTime) {
            const taskItem = document.createElement("li");

            // Texto de la tarea
            const taskContent = document.createElement("span");
            taskContent.textContent = taskText;
            taskItem.appendChild(taskContent);

            // Fecha y hora de inicio
            const startDateEl = document.createElement("span");
            startDateEl.textContent = "Inicio: " + formatDate(startDateTime);
            taskItem.appendChild(startDateEl);

            // Fecha y hora de finalización
            const endDateEl = document.createElement("span");
            endDateEl.textContent = "Fin: " + formatDate(endDateTime);
            taskItem.appendChild(endDateEl);

            // Botón para completar tarea
            const completeButton = document.createElement("button");
            completeButton.textContent = "Completado";
            completeButton.classList.add("completeBtn");
            completeButton.onclick = function() {
                taskItem.classList.toggle("completed");
                saveTasks();
            };
            taskItem.appendChild(completeButton);

            // Botón para editar tarea
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.classList.add("editBtn");
            editButton.onclick = function() {
                const newText = prompt("Edita la tarea:", taskText);
                if (newText !== null && newText !== "") {
                    taskContent.textContent = newText;
                    saveTasks();
                }
            };
            taskItem.appendChild(editButton);

            // Botón para eliminar tarea
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("deleteBtn");
            deleteButton.onclick = function() {
                taskItem.remove();
                saveTasks();
            };
            taskItem.appendChild(deleteButton);

            taskList.appendChild(taskItem);
            saveTasks();
            taskInput.value = "";
            startDateInput.value = "";
            endDateInput.value = "";
        } else {
            alert("La fecha de finalización debe ser posterior o igual a la fecha de inicio.");
        }
    }

    function formatDate(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        };
        return dateTime.toLocaleString(undefined, options);
    }

    function deleteTask(event) {
        event.preventDefault();
        if (event.target.tagName === "LI" && event.button === 2) {
            event.target.remove();
            saveTasks();
        }
    }

    function toggleTask(event) {
        const clickedElement = event.target;
        if (clickedElement.tagName === "SPAN" && !clickedElement.parentElement.classList.contains("completed")) {
            const taskText = clickedElement.textContent;
            const newText = prompt("Edita la tarea:", taskText);
            if (newText !== null && newText !== "") {
                clickedElement.textContent = newText;
                saveTasks();
            }
        }
    }

    function filterTasks(event) {
        const filter = event.target.id.replace("filter", "").toLowerCase();
        const tasks = document.querySelectorAll("li");
        tasks.forEach(task => {
            switch (filter) {
                case "all":
                    task.style.display = "block";
                    break;
                case "active":
                    if (!task.classList.contains("completed")) {
                        task.style.display = "block";
                    } else {
                        task.style.display = "none";
                    }
                    break;
                case "completed":
                    if (task.classList.contains("completed")) {
                        task.style.display = "block";
                    } else {
                        task.style.display = "none";
                    }
                    break;
            }
        });
    }

    function saveTasks() {
        const tasks = document.querySelectorAll("li");
        const tasksData = [];
        tasks.forEach(task => {
            const taskText = task.querySelector("span").textContent;
            const startDate = task.querySelectorAll("span")[1].textContent.replace("Inicio: ", "");
            const endDate = task.querySelectorAll("span")[2].textContent.replace("Fin: ", "");
            tasksData.push({ taskText, startDate, endDate });
        });
        localStorage.setItem("tasks", JSON.stringify(tasksData));
    }

    function loadTasks() {
        if (localStorage.getItem("tasks")) {
            const tasksData = JSON.parse(localStorage.getItem("tasks"));
            tasksData.forEach(task => {
                const taskItem = document.createElement("li");

                // Texto de la tarea
                const taskContent = document.createElement("span");
                taskContent.textContent = task.taskText;
                taskItem.appendChild(taskContent);

                // Fecha y hora de inicio
                const startDateEl = document.createElement("span");
                startDateEl.textContent = "Inicio: " + task.startDate;
                taskItem.appendChild(startDateEl);

                // Fecha y hora de finalización
                const endDateEl = document.createElement("span");
                endDateEl.textContent = "Fin: " + task.endDate;
                taskItem.appendChild(endDateEl);

                // Botón para completar tarea
                const completeButton = document.createElement("button");
                completeButton.textContent = "Completado";
                completeButton.classList.add("completeBtn");
                completeButton.onclick = function() {
                    taskItem.classList.toggle("completed");
                    saveTasks();
                };
                taskItem.appendChild(completeButton);

                // Botón para editar tarea
                const editButton = document.createElement("button");
                editButton.textContent = "Editar";
                editButton.classList.add("editBtn");
                editButton.onclick = function() {
                    const newText = prompt("Edita la tarea:", task.taskText);
                    if (newText !== null && newText !== "") {
                        taskContent.textContent = newText;
                        saveTasks();
                    }
                };
                taskItem.appendChild(editButton);

                // Botón para eliminar tarea
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.classList.add("deleteBtn");
                deleteButton.onclick = function() {
                    taskItem.remove();
                    saveTasks();
                };
                taskItem.appendChild(deleteButton);

                taskList.appendChild(taskItem);
            });
        }
    }
});
