import todoStorage from "src/storages";
import todoRepository from "src/repositories";
import TodoService from "./todo.service";

const todoService = new TodoService(todoRepository, todoStorage);

export default todoService;
