class TodoRepository {
  constructor(docClient, tableName) {
    this.docClient = docClient;
    this.tableName = tableName;
  }

  async getAll(userId) {
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

    return result.Items;
  }

  async getById(todoId, userId) {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: {
          todoId,
          userId,
        },
      })
      .promise();

    const item = result.Item;

    return item;
  }

  async create(todo) {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: todo,
      })
      .promise();

    return todo;
  }

  async update(todoId, userId, updateTodo) {
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

    return result.Attributes;
  }

  async updateAttachmentUrl(todoId, userId, attachmentUrl) {
    await this.docClient
      .update({
        TableName: this.tableName,
        Key: {
          todoId,
          userId,
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl,
        },
      })
      .promise();
  }

  async delete(todoId, userId) {
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

export default TodoRepository;
