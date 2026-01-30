import "../assets/styles/styles.css";
import images from "../constants/imagesImports.ts";
import Popup from "reactjs-popup";
import "../assets/images/frame-6.svg";
import type { JSX } from "react";
import { useState } from "react";
import "../assets/images/share.png";
import type { Task, ShareProps } from "../types/components.d.ts";
function EditIcon({ tasks, setTasks, index }: ShareProps): JSX.Element {
  const foundTask = tasks.find((item) => item._id === index);
  const [currentTask, setCurrentTask] = useState<string>(foundTask ? foundTask.todonote : "");
  const [sharedEmail, setSharedEmail] = useState<string>("");
  //   const [selectedCategory, setSelectedCategory] = useState<category>(
  //     foundTask ? foundTask.category : "household"
  //   );
  //   function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>): null {
  //     setSelectedCategory(e.target.value.toLowerCase());
  //     setCurrentCategory(e.target.value.toLowerCase());
  //     return null;
  //   }
  const shareTask = async (): Promise<void> => {
    try {
      const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
      if (typeof a === "string") {
        const response = await fetch(`http://localhost:3005/todos/share/${index}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(a)}`,
          },
          body: JSON.stringify({ todonote: currentTask, email: sharedEmail.toLowerCase() }),
        });
        // const data = await response.text();
        // console.log("hello", data);
        console.log(response);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    const updatedArray: Task[] = tasks.map((item: Task): Task => {
      if (item._id === index) {
        return { ...item, todonote: currentTask };
      }
      return item;
    });
    setTasks(updatedArray);
    setCurrentTask("");
    setSharedEmail("");
  };
  return (
    <>
      <Popup
        trigger={<img alt="" className="trashIcon" aria-hidden src={images.share} />}
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
              <input
                type="text"
                placeholder="Input your email..."
                className="inputElement"
                value={sharedEmail}
                onChange={(e) => setSharedEmail(e.target.value)}
              />
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
                  shareTask();
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
