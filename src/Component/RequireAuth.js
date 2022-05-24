import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Loading } from "./Loading";

function RequireAuth({ children, userLogin }) {
    const location = useLocation();

    if (userLogin === "check") {
        return <Loading />;
    }
    if (userLogin === "out") {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

RequireAuth.propTypes = {
    children: PropTypes.element.isRequired,
    userLogin: PropTypes.string.isRequired,
};

export default RequireAuth;
