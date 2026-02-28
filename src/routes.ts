import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { RawMaterial } from "./components/RawMaterial";
import { Production } from "./components/Production";
import { Inventory } from "./components/Inventory";
import { Sales } from "./components/Sales";
import { Labour } from "./components/Labour";
import { Recovery } from "./components/Recovery";
import { ProfitLoss } from "./components/ProfitLoss";
import { BalanceSheet } from "./components/BalanceSheet";
import { CashFlow } from "./components/CashFlow";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { Clients } from "./components/Clients";
import { Suppliers } from "./components/Suppliers";
import { LabourDetails } from "./components/labour/LabourDetails";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
      { index: true, Component: Dashboard },
      { path: "clients", Component: Clients },
      { path: "suppliers", Component: Suppliers },
      { path: "raw-material", Component: RawMaterial },
      { path: "production", Component: Production },
      { path: "inventory", Component: Inventory },
      { path: "sales", Component: Sales },
      { path: "sales/butter", Component: Sales },
      { path: "sales/ghee", Component: Sales },
      { path: "sales/khoya", Component: Sales },
      { path: "sales/cream", Component: Sales },
      { path: "labour", Component: Labour },
      { path: "labour/:id", Component: LabourDetails },
      { path: "recovery", Component: Recovery },
      { path: "profit-loss", Component: ProfitLoss },
      { path: "balance-sheet", Component: BalanceSheet },
      { path: "cash-flow", Component: CashFlow },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
      }
    ],
  },
]);
