import { v4 } from "uuid";
import Todo from "src/models/todo.model";
import TodoRepository from "src/repositories/todo.repository";
import { parseUserId } from "src/helpers/auth/auth.helper";
import { TodoCreate } from "src/view-models/todo-create.view-model";
import { TodoUpdate } from "src/view-models/todo-update.view-model";
import { TodoStorage } from "src/storages/todo.storage";

export default class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private todoStorage: TodoStorage
  ) {}

  async getAll(userId: string): Promise<Todo[]> {
    return this.todoRepository.getAll(userId);
  }

  async create(todoCreate: TodoCreate, userId: string): Promise<Todo> {
    const todoId = v4();
    const newTodo: Todo = Object.assign({}, todoCreate, {
      todoId: todoId,
      userId: userId,
      createdAt: new Date().getTime().toString(),
      attachmentUrl: "",
      done: false,
    });
    return await this.todoRepository.create(newTodo);
  }

  async update(
    id: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<Todo> {
    return await this.todoRepository.update(id, userId, todoUpdate);
  }

  async delete(id: string, userId: string): Promise<any> {
    return await this.todoRepository.delete(id, userId);
  }

  async updateAttachmentUrl(
    userId: string,
    todoId: string,
    attachmentId: string
  ) {
    const attachmentUrl = await this.todoStorage.getAttachmentUrl(attachmentId);

    const item = await this.todoRepository.getById(todoId, userId);

    if (!item) throw new Error("Item not found");

    if (item.userId !== userId) {
      throw new Error("User is not authorized to update item");
    }

    await this.todoRepository.updateAttachmentUrl(todoId, userId, attachmentUrl);
  }

  async generateUploadUrl(attachmentId: string): Promise<string> {
    const uploadUrl = await this.todoStorage.getUploadUrl(attachmentId);
    return uploadUrl;
  }
}
