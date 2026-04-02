
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { registerSW } from 'virtual:pwa-register';

  registerSW({ immediate: true });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.update());
    });
  }

  createRoot(document.getElementById("root")!).render(<App />);
  