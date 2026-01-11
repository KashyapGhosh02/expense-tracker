import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpenseList from "./components/ExpenseList";
import MonthlySummary from "./components/MonthlySummary";
import { Container, Box } from "@mui/material";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Box
          sx={{
            minHeight: "calc(100vh - 64px)",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            py: 4,
          }}
        >
          <Container maxWidth="lg">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>
                      <MonthlySummary />
                      <ExpenseList />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
