import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserPrivateComponent = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default UserPrivateComponent;
