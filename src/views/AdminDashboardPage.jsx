import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";
import DashboardContent from "../components/Admin/DashboardContent";

const AdminMenuPage = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      navigate("/");
      return;
    }

    setAuthorized(true);

    const alertShown = sessionStorage.getItem("adminWelcomeShown");
    if (!alertShown) {
      setShowAlert(true);
      sessionStorage.setItem("adminWelcomeShown", "true");
    }
  }, [navigate]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (!authorized) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            padding: "20px",
            paddingTop: "70px",
            backgroundColor: "#f0fdf4",
            position: "relative",
          }}
        >
          {showAlert && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#065f46",
                color: "#bbf7d0",
                padding: "20px 40px",
                fontWeight: "bold",
                fontSize: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                textAlign: "center",
                zIndex: 1500,
              }}
            >
              ¡Bienvenido Jefe!
            </div>
          )}
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default AdminMenuPage;
