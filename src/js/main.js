// Init
this.loadStates(states);
this.loadTaskLists(statusTaskLists, tasks, states);
//this.hidePriorityButtons(statusTaskLists);
document.getElementById("new-task-form-button").addEventListener('click', (e) => {
    e.preventDefault();
    addTaskWithForm();
});

const closeModalButtons = document.getElementsByClassName("close-modal-button");
for (let closeModalButton of closeModalButtons) {
    closeModalButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModalContainer();
    });
}

function toggleModalContainer() {
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer.classList.contains("hidden")) {
        modalContainer.classList.remove("hidden");
    } else {
        modalContainer.classList.add("hidden");
    }
    const modals = document.getElementsByClassName("modal");
    for (let modal of modals) {
        if (!modal.classList.contains("hidden")) {
            modal.classList.add("hidden");
        }
    }
}


// Funtions

function loadStates(states) {
    if (!states || states.length === 0) {
        return;
    }

    const selectStatus = document.getElementById("new-task-status");
    states.forEach(status => {
        if (!status?.exclude) {
            const optionTemplate = document.createElement("option");
            optionTemplate.value = status.value;
            optionTemplate.innerHTML = status.displayName;
            selectStatus.appendChild(optionTemplate.cloneNode(true));
        }
    });
    selectStatus.value = states[0]?.value;
}

function loadTaskLists(statusTaskLists, tasks, states) {
    if (!statusTaskLists || statusTaskLists.length === 0) {
        return;
    }

    const taskListToClone = document.getElementById("taskListToClone");
    const taskListParent = document.getElementsByClassName("task-list-container")[0];
    statusTaskLists.forEach(taskList => {
        let templateTaskList = taskListToClone.cloneNode(true);
        let taskListName = templateTaskList.getElementsByClassName("task-list-title");
        taskListName[0].innerHTML = taskList.displayName;
        const status = states?.find(status => status.value === taskList.status);
        const color = (!!status ? status.color : null);
        if (!!color) {
            taskListName[0].style.backgroundColor = color;
        }

        let taskListContainer = templateTaskList.getElementsByClassName("task-container");
        taskListContainer[0].setAttribute('id', taskList.id);
        
        const addTaskButton = templateTaskList.getElementsByClassName('add-task-button')[0];
        addTaskButton.setAttribute('data-task-list-id', taskList.id);
        const deleteTaskButton = templateTaskList.getElementsByClassName('delete-task-button')[0];
        deleteTaskButton.setAttribute('data-task-list-id', taskList.id);

        addTaskButton.addEventListener('click', (e) => {
            e.preventDefault();
            const taskListId = e.target.getAttribute('data-task-list-id');

            this.toggleModalContainer();
            const newTaskModal = document.getElementById("new-task-modal");
            newTaskModal.classList.remove("hidden");
            newTaskModal.setAttribute('data-task-list-id', taskListId);
        });

        deleteTaskButton.addEventListener('click', (e) => {
            e.preventDefault();
            const taskListId = e.target.getAttribute('data-task-list-id');

            this.toggleModalContainer();
            const deleteTaskModal = document.getElementById("delete-task-modal");
            deleteTaskModal.classList.remove("hidden");
            deleteTaskModal.setAttribute('data-task-list-id', taskListId);
            //emptyTaskList(taskListId);
        });

        
        if(taskListsWithoutAddButton?.includes(taskList.status)) {
            templateTaskList.getElementsByClassName("add-task-button")[0].remove();
        }

        const isGeneralTaskList = (taskList.status === "general");
        let taskListTasks = tasks;
        if (isGeneralTaskList) {
            document.getElementById("sidebar-menu").appendChild(templateTaskList);
        } else {
            taskListTasks = tasks.filter(task => task.status === taskList.status);
            taskListParent.appendChild(templateTaskList);

            const hideTaskListContainer = document.getElementById("hide-task-list-container");
            const spanTaskList = document.createElement("span");
            spanTaskList.classList.add("task-status");
            spanTaskList.innerHTML = taskList?.displayName;
            spanTaskList.setAttribute("data-task-list-id", taskList.id);
            if (!!color) {
                spanTaskList.style.backgroundColor = color;
            }
            spanTaskList.addEventListener('click', (e) => {
                const taskListId = e.target.getAttribute("data-task-list-id");
                const taskListFromSpan = document.getElementById(taskListId).parentElement;
                if (e.target.classList.contains("active")) {
                    e.target.classList.remove("active");
                    taskListFromSpan.classList.remove("hidden");
                } else {
                    e.target.classList.add("active")
                    taskListFromSpan.classList.add("hidden");
                }
            });
            hideTaskListContainer.append(spanTaskList);
        }

        loadTasks(taskList.id, taskListTasks, states, isGeneralTaskList);
    });
}

function loadTasks(taskListId, tasks, states, isGeneralTaskList) {
    if (
        !taskListId || taskListId.length === 0 ||
        !tasks || tasks.length === 0 ||
        !states || states.length === 0
    ) {
        return;
    }
    
    const taskListElement = document.getElementById(taskListId);
    const taskToClone = document.getElementById("taskToClone");

    if (!!tasks && tasks.length > 0) {
        tasks.forEach((task, index) => {
            const status = states?.find(status => status.value === task.status);

            let templateTask = taskToClone.cloneNode(true);
            let taskName = templateTask.getElementsByClassName("task-name");
            taskName[0].innerHTML = task.name;
            let taskStatus = templateTask.getElementsByClassName("task-status");
            if (isGeneralTaskList && !!status) {
                taskStatus[0].innerHTML = status.displayName;
                taskStatus[0].style.backgroundColor = status.color;
            } else {
                taskStatus[0].remove();
            }
            let taskDescription = templateTask.getElementsByClassName("task-description");
            taskDescription[0].innerHTML = task.description;
            templateTask.setAttribute('data-status', task.status);
            templateTask.removeAttribute('id');

            const taskHigherPriorityButton = templateTask.getElementsByClassName("task-higher-priority")[0];
            if (index === 0) {
                taskHigherPriorityButton?.classList.add('invisible');
            } else {
                taskHigherPriorityButton.addEventListener('click', (e) => {
                    const task = e.target.parentElement.parentElement;
                    const taskList = task.parentElement;
                    const taskStatus = task.getAttribute("data-status");
                    const taskName = task.getElementsByClassName("task-name")[0]?.innerHTML;

                    const currentTaskIndex = tasks.findIndex(t => t.name === taskName);
                    if (currentTaskIndex > 0) {
                        const taskListElements = taskList.querySelectorAll("[data-status='"+taskStatus+"']");
                        taskList.insertBefore(taskListElements[currentTaskIndex], taskListElements[currentTaskIndex-1]);
                        [tasks[currentTaskIndex], tasks[currentTaskIndex-1]] = [tasks[currentTaskIndex-1], tasks[currentTaskIndex]];
                    }
                    this.hidePriorityButtons([statusTaskLists.find(list => list.status === taskStatus)]);
                });
            }
            
            const taskLowerPriorityButton = templateTask.getElementsByClassName("task-lower-priority")[0];
            if ((tasks.length-1) === index) {
                taskLowerPriorityButton?.classList.add('invisible');
            } else {
                taskLowerPriorityButton.addEventListener('click', (e) => {
                    const task = e.target.parentElement.parentElement;
                    const taskList = task.parentElement;
                    const taskStatus = task.getAttribute("data-status");
                    const taskName = task.getElementsByClassName("task-name")[0]?.innerHTML;

                    const currentTaskIndex = tasks.findIndex(t => t.name === taskName);
                    if (currentTaskIndex < tasks.length) {
                        const taskListElements = taskList.querySelectorAll("[data-status='"+taskStatus+"']");
                        taskList.insertBefore(taskListElements[currentTaskIndex], taskListElements[currentTaskIndex+2]);
                        [tasks[currentTaskIndex], tasks[currentTaskIndex+1]] = [tasks[currentTaskIndex+1], tasks[currentTaskIndex]];
                    }
                    this.hidePriorityButtons([statusTaskLists.find(list => list.status === taskStatus)]);
                });
            }
    
            taskListElement.appendChild(templateTask);
        });
    }
}

function hidePriorityButtons(statusTaskLists) {
    if (!statusTaskLists || statusTaskLists.length === 0) {
        return;
    }

    statusTaskLists.forEach(taskList => {
        const statusTasks = document.getElementById(taskList?.id).querySelectorAll("[data-status='"+taskList?.status+"']")
        statusTasks.forEach((task, index) => {
            if (index === 0) {
                task.getElementsByClassName("task-higher-priority")[0].classList.add('invisible');
            } else {
                task.getElementsByClassName("task-higher-priority")[0].classList.remove('invisible');
            }
            if ((statusTasks.length-1) === index) {
                task.getElementsByClassName("task-lower-priority")[0].classList.add('invisible');
            } else {
                task.getElementsByClassName("task-lower-priority")[0].classList.remove('invisible');
            }
        });
    })
}

function emptyTaskList(taskListId) {
    const parent = document.getElementById(taskListId);
    if (parent.children.length <= 0) {
        return;
    }

    const YES_OPTION = "YES";
    const userSureInput = prompt(`Are you sure you want to delete ${taskListId}?<br>If you are sure type "${YES_OPTION}"`);

    const tasksList = statusTaskLists?.find(list => list.id === taskListId);

    if ([YES_OPTION, "yes", "Y", "y"].includes(userSureInput)) {
        this.removeChildren(parent);
    }
}

function removeChildren(parent) {
    if (!removeChildren) {
        return;
    }

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function addTaskWithForm() {
    const form = document.getElementById("new-task-form");
    const status = (!!form[0].value ? form[0].value : "todo");
    const statusError = document.getElementById("new-task-status-error");
    const name = form[1].value;
    const nameError = document.getElementById("new-task-name-error");
    const description = (!!form[2].value ? form[2].value : null);
    const descriptionError = document.getElementById("new-task-description-error");

    statusError.classList.add("invisible");
    statusError.textContent = "None";
    nameError.classList.add("invisible");
    nameError.textContent = "None";
    descriptionError.classList.add("invisible");
    descriptionError.textContent = "None";

    try {
        taskValidator.validateStatus(status);
        taskValidator.validateName(name, tasks);
        taskValidator.validateDescription(description);
    } catch(error) {
        const appError = taskValidator.validator.getError(error);
        switch(appError.parameter) {
            case "status":
                statusError.classList.remove("invisible");
                statusError.innerHTML = appError.message;
                break;
            case "name":
                nameError.classList.remove("invisible");
                nameError.innerHTML = appError.message;
                break;
            case "description":
                descriptionError.classList.remove("invisible");
                descriptionError.innerHTML = appError.message;
                break;
        }

        return;
    }

    const task = new Task(name, description, status);
    if (!!task) {
        addTaskToList(status, task);
    }
}

function addTaskToList(status, task) {
    let taskToAdd = task;

    const taskListId = `${status}-tasks-list`;
    const taskList = document.getElementById(taskListId);

    const taskToClone = document.getElementById("taskToClone");
    let templateTask = taskToClone.cloneNode(true);
    templateTask.removeAttribute("id");

    const tasksList = statusTaskLists?.find(list => list.id === taskListId);

    if (!task && !!tasksList) {
        const name = prompt("Enter task name");
        const description = prompt("Enter task description");
        const status = tasksList.status;
        taskToAdd = new Task(name, description, status);
    }

    if (
        !!taskToAdd && !!tasksList &&
        tasksList.status === taskToAdd.status &&
        !tasks.find(taskListElement => taskListElement.name === taskToAdd.name)
    ) {
        let taskTemplateName = templateTask.getElementsByClassName("task-name");
        taskTemplateName[0].innerHTML = taskToAdd?.name;
        let taskTemplateStatus = templateTask.getElementsByClassName("task-status");
        if (tasksList.status === "general") {
            taskTemplateStatus[0].innerHTML = taskToAdd?.status;
        } else {
            taskTemplateStatus[0].remove();
        }
        let taskTemplateDescription = templateTask.getElementsByClassName("task-description");
        taskTemplateDescription[0].innerHTML = taskToAdd?.description;

        taskList.appendChild(templateTask);
        tasks.push(taskToAdd);
        tasks = tasks.sort(function (a, b) {   
            return a.status < b.status || a.priority - b.priority;
        });
    }
}