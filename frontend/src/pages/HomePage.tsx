import React from "react";
import "../assets/styles/styles.css";
import "../assets/images/arrow-right.png";
import images from "../constants/imagesImports.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import type { Category, ComponentProps } from "../types/components.d.ts";
import componentsImports from "../constants/componentsImports.ts";
import { useEffectToShowCategory } from "../hooks/useCategory.ts";
function HomePage({ categories, setCategories, tasks, setTasks }: ComponentProps): JSX.Element {
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const navigate = useNavigate();
  const showAlert = (): null => {
    let a = document.getElementById("alert") ? document.getElementById("alert") : null;
    if (a instanceof HTMLElement) {
      a.textContent = "Cannot choose shared-todos category";
      setTimeout(function () {
        a.innerHTML = "";
      }, 8000);
    }
    return null;
  };
  // showAlert();
  const addCategory = async (): Promise<void> => {
    let data: Category = {} as Category;
    try {
      const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
      if (typeof a === "string") {
        const response = await fetch("http://localhost:3005/categoriesInsert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(a)}`,
          },
          body: JSON.stringify({ category: currentCategory.toLowerCase() }),
        });
        console.log(response);
        if (response.status === 200) {
          data = (await response.json()) as Category;
          console.log("hello", data);
          if (currentCategory !== "") {
            const updatedCategory: Category[] = [...categories, data];
            setCategories(updatedCategory);
            setCurrentCategory("");
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          let err = await response.json();
          console.log("Error:", err);
          showAlert();
        }
      }
    } catch (err) {
      console.log("Error:", err);
      // alert();
    }
  };
  const renderCategories = (): JSX.Element[] => {
    let a: JSX.Element[] = categories.map((td: Category): JSX.Element => {
      // console.log(td.category);
      return (
        <React.Fragment key={JSON.stringify(td._id)}>
          <div className="categoryContainer">
            <span className="categoryHeading">{td.category.toUpperCase()}</span>
            <img
              onClick={() => navigate(`/list/${td.category}/todos`)}
              className="rightArrowButton"
              aria-hidden
              alt=""
              src={images.rightArrow}
            />
          </div>
        </React.Fragment>
      );
    });
    a.push(
      <div className="categoryContainer">
        <span className="categoryHeading">SHARED-TODOS</span>
        <img
          onClick={() => navigate(`/list/shared-todos/todos`)}
          className="rightArrowButton"
          aria-hidden
          alt=""
          src={images.rightArrow}
        />
      </div>
    );
    return a;
  };
  useEffectToShowCategory(setCategories);
  // e.target.value.toLowerCase() === "shared-todos" ? "" :
  return (
    <>
      <div className="body">
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Add Category..."
            className="inputElement"
            value={currentCategory}
            onChange={(e) => {
              setCurrentCategory(e.target.value);
            }}
          />
          <button onClick={addCategory} className="addButton">
            Add{" "}
          </button>
        </div>
        <div id="alert"></div>
        <div className="list">{renderCategories()}</div>
        <componentsImports.AddNewNote
          categories={categories}
          tasks={tasks}
          setTasks={setTasks}
          id="household"
        />
      </div>
    </>
  );
}
export default HomePage;
