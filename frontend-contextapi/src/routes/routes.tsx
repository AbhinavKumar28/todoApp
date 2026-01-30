import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { type JSX } from "react";
import { PATH } from "../constants/paths.ts";
import componentsImports from "../constants/componentsImports.ts";
function Rout(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path={PATH.TODOS_SHOW} element={<componentsImports.TodosPage />} />
        <Route path={PATH.MAIN} element={<componentsImports.HomePage />} />
        <Route path={PATH.HOME} element={<componentsImports.LoginPage />} />
      </Routes>
    </Router>
  );
}
export default Rout;
