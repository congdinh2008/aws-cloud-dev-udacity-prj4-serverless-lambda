import { v4 } from "uuid";

class TodoService {
  constructor(todoRepository, todoStorage) {
    this.todoRepository = todoRepository;
    this.todoStorage = todoStorage;
  }

  async getAll(userId) {
    return this.todoRepository.getAll(userId);
  }

  async create(todoCreate, userId) {
    const todoId = v4();
    const newTodo = Object.assign({}, todoCreate, {
      todoId: todoId,
      userId: userId,
      createdAt: new Date().getTime().toString(),
      attachmentUrl: "",
      done: false,
    });
    return await this.todoRepository.create(newTodo);
  }

  async update(id, userId, todoUpdate) {
    return await this.todoRepository.update(id, userId, todoUpdate);
  }

  async delete(id, userId) {
    return await this.todoRepository.delete(id, userId);
  }

  async updateAttachmentUrl(userId, todoId, attachmentId) {
    const attachmentUrl = await this.todoStorage.getAttachmentUrl(attachmentId);

    const item = await this.todoRepository.getById(todoId, userId);

    if (!item) throw new Error("Item not found");

    if (item.userId !== userId) {
      throw new Error("User is not authorized to update item");
    }

    await this.todoRepository.updateAttachmentUrl(
      todoId,
      userId,
      attachmentUrl
    );
  }

  async generateUploadUrl(attachmentId) {
    const uploadUrl = await this.todoStorage.getUploadUrl(attachmentId);
    return uploadUrl;
  }
}

export default TodoService;
