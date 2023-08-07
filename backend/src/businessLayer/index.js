import todoStorage from "../storages/index.js";
import todoRepository from "../dataAccess/index.js";
import TodoService from "./todo.service.js";

const todoService = new TodoService(todoRepository, todoStorage);

export default todoService;
