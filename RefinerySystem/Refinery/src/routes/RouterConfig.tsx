import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./CONSTANTS";
import AdminHomePage from "../pages/home/AdminHomePage";
import LoginPage from "../pages/login/LoginPage";
import TruckListPage from "../pages/truck/TruckListPage";
import TruckFormPage from "../pages/truck/TruckFormPage";
import RouteListPage from "../pages/routes/RouteListPage";
import RouteFormPage from "../pages/routes/RouteFormPage";
import RouteDetailPage from "../pages/routes/RouteDetailPage";
import DriverHomePage from "../pages/home/DriverHomePage";


export const routerConfig = createBrowserRouter([
  {
    path: Routes.LOGIN,
    element: <LoginPage />,
  },
  {
    path: Routes.HOME.ADMIN,
    element: <AdminHomePage />,
  },
  {
    path: Routes.HOME.DRIVER,
    element: <DriverHomePage />,
  },
  {
    path: Routes.TRUCK.LIST,
    element: <TruckListPage />,
  },
  {
    path: Routes.TRUCK.CREATE,
    element: <TruckFormPage />,
  },
  {
    path: Routes.TRUCK.EDIT,
    element: <TruckFormPage />,
  },
  {
    path: Routes.ROUTE.LIST,
    element: <RouteListPage />,
  },
  {
    path: Routes.ROUTE.CREATE,
    element: <RouteFormPage />,
  },
  {
    path: Routes.ROUTE.DETAIL,
    element: <RouteDetailPage />,
  },
]);