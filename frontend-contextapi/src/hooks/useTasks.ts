import { useEffect } from "react";
import type { Task } from "../types/components";
import React from "react";
export const useEffectToShowTasks = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  id: string | undefined
): null => {
  useEffect(() => {
    console.log("useeffecttoshowtasks", "id", id);
    const showTask = async (): Promise<void> => {
      let data: Task[] = [];
      const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
      if (typeof a === "string") {
        try {
          const response = await fetch(`http://localhost:3005/list/${id}/todos`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem(a)}`,
            },
          });
          console.log("useEffectToShowTasks Response: ", response);
          data = (await response.json()) as Task[];
          console.log("useEffectToShowTasks Success: ", data);
        } catch (err) {
          console.error("Error:", err);
        }
      }
      if (data) {
        setTasks(data);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    showTask();
  }, []);
  return null;
};
// export const useEffectToShowSharedTasks = (
//   setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
//   id: string | undefined
// ): null => {
//   useEffect(() => {
//     const showTask = async (): Promise<void> => {
//       let data: Task[] = [];
//       const a = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser") : null;
//       if (typeof a === "string") {
//         try {
//           const response = await fetch(`http://localhost:3005/list/${id}/todos`, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem(a)}`,
//             },
//           });
//           data = (await response.json()) as Task[];
//           console.log("hello", data);
//         } catch (err) {
//           console.error("Error:", err);
//         }
//       }
//       if (data) {
//         setTasks(data);
//       }
//     };
//     // eslint-disable-next-line @typescript-eslint/no-floating-promises
//     showTask();
//   }, []);
//   return null;
// };

export const useSearchFunctionality = (
  tasks: Task[],
  searchInput: string,
  setFilteredTasks: React.Dispatch<React.SetStateAction<Task[]>>
): null => {
  useEffect(() => {
    let filter: Task[] = [...tasks];
    if (searchInput !== "" && filter.length !== 0) {
      filter = filter.filter((el) => {
        let item = el.todonote.toLowerCase();
        return item.includes(searchInput.toLowerCase());
      });
    }
    setFilteredTasks([...filter]);
  }, [tasks, searchInput]);
  return null;
};
