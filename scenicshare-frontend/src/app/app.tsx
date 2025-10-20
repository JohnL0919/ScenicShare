import { Route, Routes, BrowserRouter, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Home from "./landing-page/page";
import Layout from "./ClientLayout";
import HomePage from "./protected/home-page/page";
import CreatePath from "./protected/pathCreator-page/page";
import Login from "./login-page/page";
import Register from "./registration-page/page";
import MyRoutes from "./myRoutes-page/page";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import placeholders for pages not yet created
const NotFound = () => <div>404 Page Not Found</div>;

interface State {
  userInfo: {
    isLoggedIn: boolean;
    token: string;
  };
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Only logged in users can access these */}
            <ProtectedRoute>
              <HomePage />
              <CreatePath />
              <MyRoutes />
            </ProtectedRoute>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "1rem" }}
      />
    </>
  );
}

export default App;
