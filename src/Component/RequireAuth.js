import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loading } from "./Loading";

function RequireAuth({ children, userLogin }) {
    const location = useLocation();

    if (userLogin === "check") {
        return <Loading />;
    }
    if (userLogin === "out") {
        console.log(location);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
