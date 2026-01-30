import componentsImports from "../constants/componentsImports.ts";
import "../assets/styles/styles.css";
import images from "../constants/imagesImports.ts";
import "../assets/images/trash-svgrepo-com-1.svg";
import React from "react";
import type { JSX } from "react";
import type { Task } from "../types/components.d.ts";
import { useTaskContext } from "../App/App.tsx";
import { useIdContext } from "../pages/Id.tsx";
function BothTasks(): JSX.Element {
  const [tasks, setTasks] = useTaskContext();
  const flag = useIdContext();
  const removeTask = async (i: string): Promise<void> => {
    const removedTask: Task[] = tasks.filter((task: Task): boolean => task._id !== i);
    setTasks(removedTask);
    const deletedTask: Task[] = tasks.filter((task: Task): boolean => task._id === i);
    const currentCategory = deletedTask[0]?.category;
    try {
      const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
      if (typeof a === "string") {
        const response = await fetch(`http://localhost:3005/todos/${i}/${currentCategory}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(a)}`,
          },
        });
        const data = await response.text();
        console.log("hello", data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const renderTodos = (): JSX.Element[] => {
    const todoElements: JSX.Element[] = tasks.map((td: Task): JSX.Element => {
      return (
        <React.Fragment key={JSON.stringify(td._id)}>
          <li className="noteList">
            <input type="checkbox" className="noteCheckbox" name="" id="" />
            <span className="noteText">{td.todonote}</span>
            <span className="editDeleteContainer">
              <componentsImports.EditIcon index={td._id} category={td.category} flag={flag} />
              <img
                className="trashIcon"
                aria-hidden
                onClick={() => removeTask(td._id)}
                alt=""
                src={images.trash}
              />
              {flag !== "shared-todos" && (
                <componentsImports.ShareIcon tasks={tasks} setTasks={setTasks} index={td._id} />
              )}
            </span>
          </li>
          <hr className="noteDivider" />
        </React.Fragment>
      );
    });
    return todoElements;
  };
  return (
    <>
      <div className="body">
        <div className="listContainer">
          <ul className="noteListContainer">{typeof tasks !== "undefined" && renderTodos()}</ul>
        </div>
      </div>
    </>
  );
}
export default BothTasks;
