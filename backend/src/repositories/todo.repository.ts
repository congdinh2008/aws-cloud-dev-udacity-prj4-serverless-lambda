import Todo from "src/models/todo.model";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoUpdate } from "src/view-models/todo-update.view-model";

export default class TodoRepository {
  constructor(private docClient: DocumentClient, private tableName: string) {}

  async getAll(userId: string): Promise<Todo[]> {
    console.log("Getting all Todos", userId);

    const result = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "#userId = :userId",
        ExpressionAttributeNames: {
          "#userId": "userId",
        },
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    return result.Items as Todo[];
  }

  async getById(todoId: string): Promise<Todo> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: {
          todoId,
        },
      })
      .promise();

    const item = result.Item;

    return item as Todo;
  }

  async create(todo: Todo): Promise<Todo> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: todo,
      })
      .promise();

    return todo as Todo;
  }

  async update(
    todoId: string,
    userId: string,
    updateTodo: Partial<TodoUpdate>
  ): Promise<Todo> {
    const result = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { todoId: todoId, userId: userId },
        UpdateExpression:
          "set #name = :name, #dueDate = :dueDate, #done = :done",
        ExpressionAttributeNames: {
          "#name": "name",
          "#dueDate": "dueDate",
          "#done": "done",
        },
        ExpressionAttributeValues: {
          ":name": updateTodo.name,
          ":dueDate": updateTodo.dueDate,
          ":done": updateTodo.done,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    console.log(result);

    return result.Attributes as Todo;
  }

  async updateAttachmentUrl(todoId: string, attachmentUrl: string) {
    await this.docClient
      .update({
        TableName: this.tableName,
        Key: {
          todoId,
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl,
        },
      })
      .promise();
  }

  async delete(todoId: string, userId: string): Promise<any> {
    const result = await this.docClient
      .delete({
        TableName: this.tableName,
        Key: {
          todoId: todoId,
          userId: userId,
        },
      })
      .promise();

    console.log(result);
    return result;
  }
}
