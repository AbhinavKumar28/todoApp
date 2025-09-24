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
  const addCategory = async (): Promise<void> => {
    let data: Category = {} as Category;
    try {
      const response = await fetch("http://localhost:3005/categoriesInsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: currentCategory.toLowerCase() }),
      });
      console.log(response);
      data = (await response.json()) as Category;
      console.log("hello", data);
    } catch (err) {
      console.error("Error:", err);
    }
    if (currentCategory !== "") {
      const updatedCategory: Category[] = [...categories, data];
      setCategories(updatedCategory);
      setCurrentCategory("");
    }
  };
  const renderCategories = (): JSX.Element[] => {
    const a: JSX.Element[] = categories.map((td: Category): JSX.Element => {
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
    return a;
  };
  useEffectToShowCategory(setCategories);
  return (
    <>
      <div className="body">
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Add Category..."
            className="inputElement"
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
          />
          <button onClick={addCategory} className="addButton">
            Add{" "}
          </button>
        </div>
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
