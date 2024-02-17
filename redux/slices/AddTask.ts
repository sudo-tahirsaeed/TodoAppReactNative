// Import necessary modules from Redux Toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Define the interface for the task object
interface AddTask {
  taskid: string;
  title: string;
  category: string;
  deadline: string;
  description: string;
  status: number;
}
// Define the initial state as an empty array of tasks
const initialState: AddTask[] = [];
// Define the type for the action payload, which can be a single task or an array of tasks
type AddTaskAction = AddTask | AddTask[];
// Create a slice for managing tasks
const titleSlice = createSlice({
  name: "title", // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function for adding a task
    AddTask(state, action: PayloadAction<AddTaskAction>) {
      if (Array.isArray(action.payload)) {
        // If the payload is an array of tasks, iterate over each task
        action.payload.forEach((item) => {
          // Check if an item with the same taskid already exists in state
          if (
            !state.some((existingItem) => existingItem.taskid === item.taskid)
          ) {
            // If the item does not exist, add it to the state
            state = state.concat(action.payload);
          }
        });
      } else {
        // If the payload is a single task, add it to the state
        const payload = action.payload as AddTask;
        if (
          !state.some((existingItem) => existingItem.taskid === payload.taskid)
        ) {
          state.push(payload);
        }
      }
    },
    // Reducer function for deleting a task
    DeleteTask(state, action: PayloadAction<string>) {
      // Filter out the task with the specified taskid
      return state.filter((task) => task.taskid !== action.payload);
    },
    // Reducer function for updating the status of a task
    UpdateTaskStatus(state, action: PayloadAction<string>) {
      // Map over the tasks and update the status of the task with the specified taskid
      return state.map((task) =>
        task.taskid === action.payload ? { ...task, status: 1 } : task
      );
    },
  },
});
// Export the action creators and reducer function
export const { AddTask, DeleteTask, UpdateTaskStatus } = titleSlice.actions;
export default titleSlice.reducer;
