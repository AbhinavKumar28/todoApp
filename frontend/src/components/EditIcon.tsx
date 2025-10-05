import "../assets/styles/styles.css";
import images from "../constants/imagesImports.ts";
import Popup from "reactjs-popup";
import "../assets/images/frame-6.svg";
import type { JSX } from "react";
import { useState } from "react";
import React from "react";
import type { Task, Category, EditIconProps } from "../types/components.d.ts";
type category = string;
function EditIcon({
  categories,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCategories,
  tasks,
  setTasks,
  index,
  category,
}: EditIconProps): JSX.Element {
  const foundTask = tasks.find((item) => item._id === index);
  const [currentTask, setCurrentTask] = useState<string>(foundTask ? foundTask.todonote : "");
  const [currentCategory, setCurrentCategory] = useState<category>(
    foundTask ? foundTask.category : "household"
  );
  const [selectedCategory, setSelectedCategory] = useState<category>(
    foundTask ? foundTask.category : "household"
  );
  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>): null {
    setSelectedCategory(e.target.value.toLowerCase());
    setCurrentCategory(e.target.value.toLowerCase());
    return null;
  }
  const renderCategories = (): JSX.Element[] => {
    const categoryElements: JSX.Element[] = categories.map((cate: Category): JSX.Element => {
      return (
        <React.Fragment key={JSON.stringify(cate._id)}>
          <option value={cate.category}>{cate.category.toUpperCase()}</option>
        </React.Fragment>
      );
    });
    return categoryElements;
  };
  const editTask = async (): Promise<void> => {
    try {
      const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
      if (typeof a === "string") {
        const response = await fetch(`http://localhost:3005/todos/${index}/${category}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(a)}`,
          },
          body: JSON.stringify({ todonote: currentTask, category: currentCategory.toLowerCase() }),
        });
        const data = await response.text();
        console.log("hello", data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    const updatedArray: Task[] = tasks.map((item: Task): Task => {
      if (item._id === index) {
        return { ...item, todonote: currentTask, category: currentCategory };
      }
      return item;
    });
    setTasks(updatedArray);
    setCurrentTask("");
    setCurrentCategory("household");
  };
  return (
    <>
      <Popup trigger={<img alt="" aria-hidden src={images.edit} />} modal nested>
        {(close) => (
          <div className="modal">
            <div className="newNoteHeading">
              <h1>New Note</h1>
            </div>
            <div className="inputContainer">
              <input
                type="text"
                placeholder="Input your note..."
                className="inputElement"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
              />
            </div>
            <div className="inputContainer">
              <select
                name="cars"
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="inputElement"
                aria-hidden
              >
                <option value="" disabled selected hidden>
                  Input your category
                </option>
                {renderCategories()}
              </select>
            </div>

            <div className="content">
              <button
                className="closeButton"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
              <button
                className="addButton"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  editTask();
                  close();
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </Popup>
    </>
  );
}

export default EditIcon;
