
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);

  // Register Service Worker for PWA functionality
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.ts', {
      scope: '/',
    })
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  }
  