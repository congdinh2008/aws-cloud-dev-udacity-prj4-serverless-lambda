import { v4 } from "uuid";
import Todo from "../models/todo.model";
import TodoRepository from "../repositories/todo.repository";
import { TodoCreate } from "../view-models/todo-create.view-model";
import { TodoUpdate } from "../view-models/todo-update.view-model";
import { TodoStorage } from "../storages/todo.storage";
import { createLogger } from "../helpers/logging/logging.helper";

const logger = createLogger("Service: Todo");

export default class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private todoStorage: TodoStorage
  ) {}

  async getAll(userId: string): Promise<Todo[]> {
    logger.info(`Service: Getting all Todos for userId: ${userId}`);

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
    logger.info(
      `Service: Create a new Todo for user with [userId: ${userId}, todoId: ${todoId}]`
    );
    return await this.todoRepository.create(newTodo);
  }

  async update(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<Todo> {
    logger.info(
      `Service: Update a Todo for user with [userId: ${userId}, todoId: ${todoId}]`
    );
    return await this.todoRepository.update(todoId, userId, todoUpdate);
  }

  async delete(todoId: string, userId: string): Promise<any> {
    logger.info(
      `Service: Delete a Todo for user with [userId: ${userId}, todoId: ${todoId}]`
    );
    return await this.todoRepository.delete(todoId, userId);
  }

  async updateAttachmentUrl(
    userId: string,
    todoId: string,
    attachmentId: string
  ) {
    const attachmentUrl = await this.todoStorage.getAttachmentUrl(attachmentId);

    const item = await this.todoRepository.getById(todoId, userId);
    logger.info(
      `Service: Update Todo's Attachment URL for user with [userId: ${userId}, todoId: ${todoId}]`
    );

    if (!item) {
      logger.error(
        "Service: Error update Todo's Attachment URL: Item not found"
      );
      throw new Error("Item not found");
    }
    if (item.userId !== userId) {
      logger.error(
        "Service: Error update Todo's Attachment URL: User is not authorized to update item"
      );
      throw new Error("User is not authorized to update item");
    }

    await this.todoRepository.updateAttachmentUrl(
      todoId,
      userId,
      attachmentUrl
    );
  }

  async generateUploadUrl(attachmentId: string): Promise<string> {
    logger.info(
      `Service: Generate Todo's Upload URL for attachment with [attachmentId: ${attachmentId}]`
    );
    const uploadUrl = await this.todoStorage.getUploadUrl(attachmentId);
    return uploadUrl;
  }
}
