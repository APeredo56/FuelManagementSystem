import { createBrowserRouter } from "react-router-dom";
import { Routes } from "./CONSTANTS";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import StationManagementPage from "../pages/station/StationManagementPage";
import SaleListPage from "../pages/sale/SaleListPage";
import SaleCreatePage from "../pages/sale/SaleCreatePage";
import PumpFormPage from "../pages/pump/PumpFormPage";


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
    path: Routes.SALE.CREATE,
    element: <SaleCreatePage />,
  },
  {
    path: Routes.SALE.LIST,
    element: <SaleListPage />,
  },
  {
    path: Routes.SALE.CREATE,
    element: <SaleCreatePage />,
  },
  {
    path: Routes.STATION.MANAGE,
    element: <StationManagementPage />
  },
  {
    path: Routes.PUMP.CREATE,
    element: <PumpFormPage />
  },
  {
    path: Routes.PUMP.EDIT,
    element: <PumpFormPage />
  }
]);