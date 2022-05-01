import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children, userLogin }) {
    const location = useLocation();

    if (userLogin === "check") {
        return <div>身分驗證中</div>;
    }
    if (userLogin === "out") {
        console.log(location);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
