// Data
let tasks = [
    new Task("TODO Task 1", "Example task", "todo", 0),
    new Task("TODO Task 2", "Example task", "todo", 2),
    new Task("TODO Task 3", "Example task", "todo", 1),
    new Task("TODO Task 4", "Example task", "todo", 1),
    new Task("DONE Task 1", "Example task 2", "done", 0),
];

tasks = tasks.sort(function (a, b) {   
    return a.status < b.status || a.priority - b.priority;
});

const states = [
    { value: "todo", displayName: "ToDo", color: "#a5a5a5" },
    { value: "doing", displayName: "Doing", color: "#5a69ff" },
    { value: "done", displayName: "Done", color: "#08b151"  },
    { value: "deleted", displayName: "Deleted", color: "#e01212", exclude: true },
];

const statusTaskLists = [
    { status: "general", displayName: "General", id: "general-tasks-list" },
    { status: "todo", displayName: "ToDo", id: "todo-tasks-list" },
    { status: "doing", displayName: "Doing", id: "doing-tasks-list" },
    { status: "done", displayName: "Done", id: "done-tasks-list" },
    { status: "deleted", displayName: "Deleted", id: "deleted-tasks-list" },
];
const taskListsWithoutAddButton = ["general", "deleted"];