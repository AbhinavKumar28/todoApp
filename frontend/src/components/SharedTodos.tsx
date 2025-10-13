// import "../assets/styles/styles.css";
// import { useState } from "react";
// import type { Task, ComponentProps } from "../types/components.d.ts";
// import type { JSX } from "react";
// import componentsImports from "../constants/componentsImports.ts";
// import { useEffectToShowTasks, useSearchFunctionality } from "../hooks/useTasks.ts";
// function SharedTodos({ categories, setCategories, tasks, setTasks }: ComponentProps): JSX.Element {
//   const [searchInput, setSearchInput] = useState<string>("");
//   const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
//   useEffectToShowTasks(setTasks, id="");
//   useSearchFunctionality(tasks, searchInput, setFilteredTasks);
//   return (
//     <>
//       <componentsImports.Heading id="Shared Todos" />
//       <componentsImports.TaskInputForm searchInput={searchInput} setSearchInput={setSearchInput} />
//       <componentsImports.BothTasks
//         categories={categories}
//         setCategories={setCategories}
//         tasks={filteredTasks}
//         setTasks={setTasks}
//       />
//       <componentsImports.BackImage />
//     </>
//   );
// }
// export default SharedTodos;
