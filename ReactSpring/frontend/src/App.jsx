import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import HomePage from "./components/HomePage.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import ProtectedUser from "./ProtectedUser.jsx";
import AgeCalculator from "./components/AgeCalculator.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {verifyMe} from "./store/reducers/authReducer.js";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler.jsx";

function App() {

    const dispatch = useDispatch();
    const {isAuth, isLoading} = useSelector(state => state.auth);
    useEffect(() => {
        dispatch(verifyMe())
    }, [dispatch]);

    if (!isAuth && isLoading) {
        return <div className={`p-6 text-center`}>Loading...</div>
    }

    return (
        <Router>
            <Routes>
                <Route path={"/"} element={<HomePage/>}/>
                <Route path={"/login"} element={<LoginPage/>}/>
                <Route path={"/register"} element={<RegisterPage/>}/>

                <Route path={'/oauth2/redirect'} element={<OAuth2RedirectHandler/>}/>
                <Route path={'/age-calculator'} element={<ProtectedUser><AgeCalculator/></ProtectedUser>}/>
                <Route path={"*"} element={<NotFoundPage/>}/>
            </Routes>
        </Router>
    );
}

export default App
