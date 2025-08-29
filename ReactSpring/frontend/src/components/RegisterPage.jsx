import {Link, useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {messageClear, register} from "../store/reducers/authReducer.js";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const RegisterPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuth, isLoading, errorMessage, successMessage} = useSelector(state => state.auth);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuth) {
            navigate('/age-calculator', { replace: true });
        }
    }, [isAuth, navigate]);

    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const updateData = (e) => {
        const {name, value} = e.target;
        setState(prev => ({
            ...prev,
            [name]: name === "name" ? value.trim() : value
        }));

        if (name === "passwordConfirm") {
            setError(state.password === value ? "" : "Passwords don't match");
        }

        if (name === "password") {
            setError(state.passwordConfirm === value ? "" : (state.passwordConfirm ? "Passwords don't match" : ""));
        }
    }

    const validate = () => {
        return state.name.length >= 5 && (state.password.length >= 12 && (state.password === state.passwordConfirm))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch(register(state));
        }
    }

    useEffect(() => {
        if (successMessage) toast.success(successMessage);
        if (errorMessage) toast.error(errorMessage);
        dispatch(messageClear());
    }, [successMessage, errorMessage, dispatch]);

    return (
        <main
            className={`min-h-screen w-full bg-gradient-to-br from-purple-700 to-fuchsia-700 
            text-white flex items-center justify-center`}>
            <div className={`w-full max-w-md`}>
                <h2 className={`text-4xl font-bold text-blue-100 text-center mb-6`}>
                    Login
                </h2>
                <div className={`bg-white text-gray-900 rounded-xl p-6`}>

                    <div className={`flex items-center justify-between gap-1 py-5`}>
                        <Link
                            to={`${apiUrl}/oauth2/authorization/google`}
                            className={`flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300`}
                        >
                        <span>
                            <FcGoogle className={`text-2xl`}/>
                        </span>
                            <span>
                            Login with Google
                        </span>
                        </Link>
                        <Link
                            to={`${apiUrl}/oauth2/authorization/github`}
                            className={`flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300`}
                        >
                        <span>
                            <FaGithub className={`text-2xl`}/>
                        </span>
                            <span>
                            Login with Google
                        </span>
                        </Link>
                    </div>

                    <form className={`space-y-5`} onSubmit={handleSubmit}>
                        <div className={`flex flex-col mb-2`}>
                            <label htmlFor="email" className={`text-sm font-medium mb-1`}>
                                Username
                            </label>
                            <input
                                type="text"
                                id={'name'}
                                name={'name'}
                                placeholder={'John Doe'}
                                value={state.name}
                                onChange={updateData}
                                required
                                minLength={5}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>
                        <div className={`flex flex-col mb-2`}>
                            <label htmlFor="email" className={`text-sm font-medium mb-1`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id={'email'}
                                name={'email'}
                                placeholder={'john.doe@example.com'}
                                value={state.email}
                                onChange={updateData}
                                required
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>
                        <div className={`flex flex-col mb-2`}>
                            <label htmlFor="password" className={`text-sm font-medium mb-1`}>
                                Password
                            </label>
                            <input
                                type="password"
                                id={'password'}
                                name={'password'}
                                placeholder={"••••••••"}
                                value={state.password}
                                onChange={updateData}
                                required
                                minLength={12}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>
                        <div className={`flex flex-col mb-2`}>
                            <label htmlFor="passwordConfirm" className={`text-sm font-medium mb-1`}>
                                Password
                            </label>
                            <input
                                type="password"
                                id={'passwordConfirm'}
                                name={'passwordConfirm'}
                                placeholder={"••••••••"}
                                value={state.passwordConfirm}
                                onChange={updateData}
                                required
                                minLength={12}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>
                        <p className={`text-red-500`}>{error}</p>
                        <button type={"submit"}
                                className={`w-full inline-flex items-center justify-center cursor-pointer
                                rounded-md bg-emerald-500 px-4 py-2.5 text-white font-semibold transition 
                                hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed`}>
                            {
                                isLoading ? "Loading..." : "Register"
                            }
                        </button>
                    </form>

                    <div className={`text-center mt-5 text-sm text-gray-600`}>
                        Already have an account? {" "}
                        <Link to={"/login"} className={`font-medium text-purple-600 hover:underline`}>
                            Click Here
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RegisterPage;