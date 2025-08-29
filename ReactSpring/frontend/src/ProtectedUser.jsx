import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {verifyMe} from "./store/reducers/authReducer.js";

const ProtectedUser = ({children}) => {

    const dispatch = useDispatch();
    const { isAuth, isLoading } = useSelector(s => s.auth);
    const location = useLocation();

    useEffect(() => {
        if (isAuth === null && !isLoading) {
            dispatch(verifyMe());
        }
    }, [isAuth, isLoading, dispatch]);

    if (isAuth === null || isLoading) {
        return <div className="p-6 text-center">Checking Session</div>;
    }

    return isAuth ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}

export default ProtectedUser;