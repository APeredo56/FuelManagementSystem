import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./CONSTANTS";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import UserListPage from "../pages/user/UserListPage";
import UserFormPage from "../pages/user/UserFormPage";
import StationListPage from "../pages/station/StationListPage";
import StationFormPage from "../pages/station/StationFormPage";


export const routerConfig = createBrowserRouter([
  {
    path: Routes.LOGIN,
    element: <LoginPage />,
  },
  {
    path: Routes.HOME,
    element: <HomePage />,
  },
  {
    path: Routes.USER.LIST,
    element: <UserListPage />
  },
  {
    path: Routes.USER.CREATE,
    element: <UserFormPage />
  },
  {
    path: Routes.USER.EDIT,
    element: <UserFormPage />
  },
  {
    path: Routes.STATION.LIST,
    element: <StationListPage />
  },
  {
    path: Routes.STATION.CREATE,
    element: <StationFormPage />
  },
  {
    path: Routes.STATION.EDIT,
    element: <StationFormPage />
  },
]);