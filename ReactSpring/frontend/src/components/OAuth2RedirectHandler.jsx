import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {setIsAuth} from "../store/reducers/authReducer.js";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";

function OAuth2RedirectHandler() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            dispatch(setIsAuth(token));

            setTimeout(() => {
                navigate("/age-calculator")
            }, 100)
        } else {
            toast.error("Unauthorized");
            navigate("/login");
        }
    }, [dispatch, location, navigate]);

    return (
        <div>Redirecting...</div>
    );
}

export default OAuth2RedirectHandler;