import { useState } from "react";
import type { JSX } from "react";
import "../assets/styles/styles.css";
import Rout from "../routes/routes.tsx";
import type { Category, Task } from "../types/components.d.ts";
// const TaskContext = createContext<TaskContextType | null>(null);

// const
function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  return (
    <>
      {/* <TaskContext.Provider value={[tasks, setTasks]}> */}
      <Rout
        categories={categories}
        setCategories={setCategories}
        tasks={tasks}
        setTasks={setTasks}
      />
      {/* </TaskContext.Provider> */}
    </>
  );
}

export default App;
