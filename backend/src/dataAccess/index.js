import dynamoDBClient from "../data/dynamodb.client.js";
import TodoRepository from "./todo.repository.js";

console.log("Todo Table: ", process.env.TODO_TABLE);

const todoRepository = new TodoRepository(
  dynamoDBClient(),
  process.env.TODO_TABLE
);

export default todoRepository;
