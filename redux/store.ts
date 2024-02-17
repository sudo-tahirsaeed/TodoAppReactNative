// Import necessary modules from Redux Toolkit
import { configureStore, combineReducers } from "@reduxjs/toolkit";
// Import the reducer slice for managing tasks
import AddTask from "./slices/AddTask";
// Combine reducers into a single root reducer
const rootReducer = combineReducers({
  addtask: AddTask, // AddTask reducer manages the 'addtask' state slice
});
// Define the RootState type using the ReturnType utility function
export type RootState = ReturnType<typeof rootReducer>;
// Configure the Redux store with the root reducer
const store = configureStore({
  reducer: rootReducer, // Pass the root reducer to the store configuration
});
// Export the configured Redux store
export default store;
