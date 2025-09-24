import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { type JSX } from "react";
import { PATH } from "../constants/paths.ts";
import type { ComponentProps } from "../types/components.d.ts";
import componentsImports from "../constants/componentsImports.ts";
function Rout({ categories, setCategories, tasks, setTasks }: ComponentProps): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route
          path={PATH.TODOS_SHOW}
          element={
            <componentsImports.TodosPage
              categories={categories}
              setCategories={setCategories}
              tasks={tasks}
              setTasks={setTasks}
            />
          }
        />
        <Route
          path={PATH.MAIN}
          element={
            <componentsImports.HomePage
              categories={categories}
              setCategories={setCategories}
              tasks={tasks}
              setTasks={setTasks}
            />
          }
        />
        <Route
          path={PATH.HOME}
          element={
            <componentsImports.LoginPage
              categories={categories}
              setCategories={setCategories}
              tasks={tasks}
              setTasks={setTasks}
            />
          }
        />
      </Routes>
    </Router>
  );
}
export default Rout;
