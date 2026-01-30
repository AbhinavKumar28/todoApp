/* eslint-disable @typescript-eslint/no-unused-vars */
import "../assets/styles/styles.css";
import { createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import type { Task } from "../types/components.d.ts";
import type { JSX } from "react";
import componentsImports from "../constants/componentsImports.ts";
import { useEffectToShowTasks, useSearchFunctionality } from "../hooks/useTasks.ts";
import { useEffectToShowCategory } from "../hooks/useCategory.ts";
import { useCategoryContext, useTaskContext } from "../App/App.tsx";
export const IdContext = createContext<string | undefined>(undefined);
export function useIdContext(): string {
  const context = useContext(IdContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within TaskContext.Provider");
  }
  return context;
}

function Id(): JSX.Element {
  const [categories, setCategories] = useCategoryContext();
  const [tasks, setTasks] = useTaskContext();
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
      <IdContext.Provider value={id}>
        <componentsImports.Heading />
        <componentsImports.TaskInputForm
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        {id !== "shared-todos" && <componentsImports.AddNewNote />}
        <componentsImports.BothTasks />
      </IdContext.Provider>
      <componentsImports.BackImage />
    </>
  );
}
export default Id;
