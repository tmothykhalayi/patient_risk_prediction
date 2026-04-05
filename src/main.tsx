import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import { store } from "./app/store";
import "./index.css";
import App from "./App";
import { Toaster } from "sonner";


createRoot(document.getElementById("root")!).render(
<StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            classNames: {
              error: "bg-red-500 text-white",
              success: "bg-green-500 text-white",
              warning: "bg-yellow-500 text-white",
              info: "bg-blue-500 text-white",
            },
          }}
        />
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);
