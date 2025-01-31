// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import MyFlats from "./pages/MyFlats";
import Favourites from "./pages/Favourites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewFlat from "./pages/NewFlat";
import FlatDetails from "./pages/FlatDetails";
import EditFlat from "./pages/EditFlat";
import MyAccount from "./pages/MyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import AllUsers from "./pages/AllUsers";
import NotFound from "./pages/NotFound"; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          {/* Protejăm rutele care necesită autentificare */}
          <Route
            path="my-flats"
            element={
              <ProtectedRoute>
                <MyFlats />
              </ProtectedRoute>
            }
          />
          <Route
            path="favourites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />
          <Route
            path="new-flat"
            element={
              <ProtectedRoute>
                <NewFlat />
              </ProtectedRoute>
            }
          />
          <Route
            path="flat/:flatId"
            element={
              <ProtectedRoute>
                <FlatDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-flat/:flatId"
            element={
              <ProtectedRoute>
                <EditFlat />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="all-users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AllUsers />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rute publice */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rută pentru pagini inexistente */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
