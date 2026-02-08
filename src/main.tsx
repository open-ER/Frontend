
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("!!! APP STARTING - main.tsx !!!");

createRoot(document.getElementById("root")!).render(<App />);
