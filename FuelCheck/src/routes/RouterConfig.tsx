import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./CONSTANTS";
import HomePage from "../pages/home/HomePage";


export const routerConfig = createBrowserRouter([
  {
    path: Routes.HOME,
    element: <HomePage />,
  },
]);