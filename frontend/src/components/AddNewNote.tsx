import "../assets/styles/styles.css";
import "../assets/images/add-button.svg";
import images from "../constants/imagesImports.ts";
import Popup from "reactjs-popup";
import type { JSX } from "react";
import type { Task, Category, AddNewNodeProps } from "../types/components.d.ts";
import { useState } from "react";
import React from "react";
function AddNewNote({ categories, tasks, setTasks, id }: AddNewNodeProps): JSX.Element {
  const [currentTask, setCurrentTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(id);
  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>): null {
    setSelectedCategory(e.target.value.toLowerCase());
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
  const addTask = async (): Promise<void> => {
    let data: Task = {} as Task;
    try {
      const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
      if (typeof a === "string") {
        const response = await fetch("http://localhost:3005/todosInsert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(a)}`,
          },
          body: JSON.stringify({ todonote: currentTask, category: selectedCategory }),
        });
        data = (await response.json()) as Task;
        console.log("hello", data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    if (currentTask !== "") {
      let updatedTask: Task[] = [...tasks, data];

      setTasks(updatedTask);
      setCurrentTask("");
    }
  };
  return (
    <>
      <Popup
        trigger={<img className="addButtonIcon" aria-hidden alt="" src={images.addButton} />}
        modal
        nested
      >
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

            <div className="buttonContainer">
              <button
                className="closeButton"
                onClick={() => {
                  console.log("modal closed ");
                  close();
                }}
              >
                Cancel
              </button>
              <button className="addButton" onClick={addTask}>
                Apply
              </button>
            </div>
          </div>
        )}
      </Popup>
    </>
  );
}
export default AddNewNote;
