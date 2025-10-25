import "../assets/styles/styles.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Task, ComponentProps } from "../types/components.d.ts";
import type { JSX } from "react";
import componentsImports from "../constants/componentsImports.ts";
import { useEffectToShowTasks, useSearchFunctionality } from "../hooks/useTasks.ts";
import { useEffectToShowCategory } from "../hooks/useCategory.ts";
function Id({ categories, setCategories, tasks, setTasks }: ComponentProps): JSX.Element {
  const { id } = useParams();
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  // {
  //   id !== "Shared Todos" && useEffectToShowCategory(setCategories);
  // }
  useEffectToShowCategory(setCategories);
  useEffectToShowTasks(setTasks, id);
  useSearchFunctionality(tasks, searchInput, setFilteredTasks);
  return (
    <>
      <componentsImports.Heading id={id} />
      <componentsImports.TaskInputForm searchInput={searchInput} setSearchInput={setSearchInput} />
      {id !== "shared-todos" && (
        <componentsImports.AddNewNote
          categories={categories}
          tasks={tasks}
          setTasks={setTasks}
          id={id}
        />
      )}
      <componentsImports.BothTasks
        categories={categories}
        setCategories={setCategories}
        tasks={filteredTasks}
        setTasks={setTasks}
        flag={id}
      />
      <componentsImports.BackImage />
    </>
  );
}
export default Id;
