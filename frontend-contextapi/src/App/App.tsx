import { createContext, useState, useContext } from "react";
import type { JSX } from "react";
import "../assets/styles/styles.css";
import Rout from "../routes/routes.tsx";
import type {
  Category,
  CategoryContextType,
  Task,
  TaskContextType,
} from "../types/components.d.ts";
export const TaskContext = createContext<TaskContextType | null>(null);
export const CategoryContext = createContext<CategoryContextType | null>(null);
export function useCategoryContext(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within CategoryContext.Provider");
  }
  return context;
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskContext.Provider");
  }
  return context;
}

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  return (
    <>
      <TaskContext.Provider value={[tasks, setTasks]}>
        <CategoryContext.Provider value={[categories, setCategories]}>
          <Rout />
        </CategoryContext.Provider>
      </TaskContext.Provider>
    </>
  );
}

export default App;
