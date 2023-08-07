import todoStorage from "../storages";
import todoRepository from "../repositories";
import TodoService from "./todo.service";

const todoService = new TodoService(todoRepository, todoStorage);

export default todoService;
