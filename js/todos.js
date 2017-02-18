const Util = require("./util.js");

function addNewTodoToDOM(todo, location) {
  let { item, isDone } = todo;
  let isChecked = isDone ? "checked" : "";
  let complete = isDone ? "complete" : "";
  let todoHTML = `<li class="todoItem ${complete}"><i class="fa fa-trash-o fa-fw delTodo"></i><input type="checkbox" ${isChecked}/><span>${item}</span></li>`;
  $(location).append(todoHTML);
}

function saveTodo(todo) {
  var newTodoItem = {
    item: todo,
    isDone: false
  };
  var existingTodos = Util.getBrowserSetting("todos", []);
  existingTodos.push(newTodoItem);
  Util.setBrowserSetting("todos", existingTodos);
}

function getSavedTodos() {
  var savedTodos = Util.getBrowserSetting("todos", []);
  return savedTodos;
}

function saveTodoList() {
  let currentTodos = [].slice.call($("li.todoItem"));
  let updatedTodos = [];
  currentTodos.forEach(function(el) {
    let todoEntry = {
      "item" : $(el).find("span").text(),
      "isDone" : $(el).find("input").prop("checked")
    };
    updatedTodos.push(todoEntry);
  });
  
  Util.setBrowserSetting("todos", updatedTodos);
}

function clearAllTodos() {
  $("li.todoItem").remove();
  saveTodoList();

}

module.exports = {
  addNewTodoToDOM,
  saveTodo,
  getSavedTodos,
  saveTodoList,
  clearAllTodos
};
