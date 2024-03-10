import { fetchData } from "../fetchData.js";

export const updateTaskOrderAction = fetchData('PUT', 'list/updateTaskOrder', 'http://localhost:3001/api/updateTaskOrder');