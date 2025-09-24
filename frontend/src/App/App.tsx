import { useState } from "react";
import type { JSX } from "react";
import "../assets/styles/styles.css";
import Rout from "../routes/routes.tsx";
import type { Category, Task } from "../types/components.d.ts";
function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  return (
    <>
      <Rout
        categories={categories}
        setCategories={setCategories}
        tasks={tasks}
        setTasks={setTasks}
      />
    </>
  );
}

export default App;
