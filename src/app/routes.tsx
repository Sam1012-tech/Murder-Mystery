import { createBrowserRouter } from "react-router";
import IntroScreen from "./components/IntroScreen";
import Dashboard from "./components/Dashboard";
import CrimeScene from "./components/CrimeScene";
import CCTVMonitoring from "./components/CCTVMonitoring";
import PhoneCall from "./components/PhoneCall";
import EvidenceBoard from "./components/EvidenceBoard";
import Interrogation from "./components/Interrogation";
import Terminal from "./components/Terminal";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: IntroScreen,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/crime-scene",
    Component: CrimeScene,
  },
  {
    path: "/cctv",
    Component: CCTVMonitoring,
  },
  {
    path: "/phone-call",
    Component: PhoneCall,
  },
  {
    path: "/evidence-board",
    Component: EvidenceBoard,
  },
  {
    path: "/interrogation",
    Component: Interrogation,
  },
  {
    path: "/terminal",
    Component: Terminal,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);