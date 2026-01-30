import { lazy } from "react";
const componentsImports = {
  HomePage: lazy(() => import(/* webpackChunkName: "HomePageBundle" */ "../pages/HomePage.tsx")),
  LoginPage: lazy(() => import(/* webpackChunkName: "LoginPageBundle" */ "../pages/Login.tsx")),
  TodosPage: lazy(() => import(/* webpackChunkName: "IDPageBundle" */ "../pages/Id.tsx")),
  AddNewNote: lazy(
    () => import(/* webpackChunkName: "AddNewNoteBundle" */ "../components/AddNewNote.tsx")
  ),
  AddNewNoteWithCategory: lazy(
    () =>
      import(
        /* webpackChunkName: "AddNewNoteWithCategoriesBundle" */ "../components/AddNewNoteWithCategory.tsx"
      )
  ),
  BackImage: lazy(
    () => import(/* webpackChunkName: "BackImageBundle" */ "../components/BackImage.tsx")
  ),
  BothTasks: lazy(
    () => import(/* webpackChunkName: "BothTaskBundle" */ "../components/BothTask.tsx")
  ),
  TaskInputForm: lazy(
    () => import(/* webpackChunkName: "TaskInputFormBundle" */ "../components/TaskInputForm.tsx")
  ),
  Heading: lazy(() => import(/* webpackChunkName: "HeadingBundle" */ "../components/Heading.tsx")),
  EditIcon: lazy(
    () => import(/* webpackChunkName: "EditIconBundle" */ "../components/EditIcon.tsx")
  ),
  ShareIcon: lazy(
    () => import(/* webpackChunkName: "ShareIconBundle" */ "../components/ShareIcon.tsx")
  ),
};
export default componentsImports;
