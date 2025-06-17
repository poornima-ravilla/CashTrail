import React, { useEffect } from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from "../../assests/user.svg";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]); // ✅ navigate added

  function logoutFunc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">CashTrail</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            alt="User Avatar"
            style={{ borderRadius: "50%", width: "1.5rem", height: "1.5rem" }}
          />
          <p className="logo-link" onClick={logoutFunc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
