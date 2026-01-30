import { useEffect } from "react";
import type { Category, Task } from "../types/components";
import React from "react";
export const useEffectToShowCategory = (
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
): null => {
  useEffect(() => {
    const showCategory = async (): Promise<void> => {
      let data: Task[] = [];
      const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
      if (typeof a === "string") {
        try {
          const response = await fetch(`http://localhost:3005/list/categories`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(a)}`,
            },
          });
          data = (await response.json()) as Task[];
          console.log("hello", data);
        } catch (err) {
          console.error("Error:", err);
        }
      }
      if (data) {
        setCategories(data);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    showCategory();
  }, []);
  return null;
};
