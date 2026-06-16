import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { StoProvider } from "./context/StoContext";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoProvider>
          <AppRouter />
        </StoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
