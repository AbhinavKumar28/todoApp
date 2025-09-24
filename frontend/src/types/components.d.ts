import React from "react";
export type Data = {
  name: string;
  email: string;
  password: string;
};
export type Data_login = {
  email: string;
  password: string;
};
export type Username = {
  name: string;
  email: string;
};
export type Task = {
  _id: string;
  todonote: string;
  category: string;
};
export type Category = {
  _id: string;
  category: string;
};
export type TaskInputFormProps = {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};
export type EditIconProps = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  index: string;
};
export type ComponentProps = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export type AddNewNodeProps = {
  categories: Category[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  id: string | undefined;
};
export type AddNewNodeWithCategoriesProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  id: string | undefined;
};

export type Obj = {
  token: string;
  username: Username;
};
