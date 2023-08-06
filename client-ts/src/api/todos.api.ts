import Axios from "axios";
import { TodoCreate } from "../view-models/todo-create.view-model";
import { TodoUpdate } from "../view-models/todo-update.view-model";

export const getTodos = async (idToken: string) => {
  const response = await Axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.items;
};

export const createTodo = async (idToken: string, newTodo: TodoCreate) => {
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    JSON.stringify(newTodo),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.item;
};

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: TodoUpdate
) {
  await Axios.patch(
    `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`,
    JSON.stringify(updatedTodo),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
}

export async function deleteTodo(idToken: string, todoId: string) {
  await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function getUploadUrl(idToken: string, todoId: string) {
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}/attachment`,
    "",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: any) {
  await Axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
}
