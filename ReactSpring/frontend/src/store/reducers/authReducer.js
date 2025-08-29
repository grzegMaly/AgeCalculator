import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api.js";
import {jwtDecode} from "jwt-decode";

export const login = createAsyncThunk(
    "auth/login",
    async (loginInfo, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const response = await api.post('/auth/public/login', loginInfo);
            return fulfillWithValue(response.data);
        } catch (error) {
            console.log("error", error)
            return rejectWithValue(error.response.data);
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (registerInfo, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const response = await api.post("/auth/public/register", registerInfo)
            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyMe = createAsyncThunk(
    "auth/me",
    async (_, {
        fulfillWithValue,
        rejectWithValue
    }) => {
        try {
            const response = await api.get('/auth/me', {withCredentials: true})
            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const decodeToken = (token) => {
    if (token) {
        return jwtDecode(token);
    } else {
        return '';
    }
}

const setupAuthData = (state, payload) => {
    state.isLoading = false;
    state.id = decodeToken(payload.data["jwtToken"]);
    state.user = {};
    state.user.username = payload.data.username;
    state.isAuth = true;
    state.successMessage = payload.message;
}

export const authReducer = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuth: null,
        isLoading: false,
        errorMessage: '',
        successMessage: ''
    },
    reducers: {
        messageClear: state => {
            state.errorMessage = '';
            state.successMessage = '';
        },
        setIsAuth: (state, {payload}) => {
            state.isAuth = true;
            state.id = decodeToken(payload.token);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.pending, state => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, {payload}) => {
                setupAuthData(state, payload)
            })
            .addCase(login.rejected, (state, {payload}) => {
                state.isLoading = false;
                state.errorMessage = payload.message;
            })
            .addCase(register.pending, state => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, {payload}) => {
                setupAuthData(state, payload);
            })
            .addCase(register.rejected, (state, {payload}) => {
                state.isLoading = false;
                state.errorMessage = payload.message;
            })
            .addCase(verifyMe.pending, state => {
                state.isLoading = true;
                state.errorMessage = ''
                state.successMessage = '';
            })
            .addCase(verifyMe.fulfilled, (state, {payload}) => {
                state.isLoading = false;
                state.isAuth = true;
                state.user = payload.data;
            })
            .addCase(verifyMe.rejected, (state, {payload}) => {
                state.isLoading = false;
                state.isAuth = false;
            });
    }
});

export const {messageClear, setIsAuth} = authReducer.actions;
export default authReducer.reducer;