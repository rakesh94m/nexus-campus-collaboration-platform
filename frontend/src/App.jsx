import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <AppRoutes />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;