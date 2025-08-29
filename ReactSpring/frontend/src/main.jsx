import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import store from "./store/index.js";
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App/>
        <Toaster
            toastOptions={{
                position: 'top-center',
                style: {
                    background: '#4b75f4',
                    color: 'white'
                }
            }}
        />
    </Provider>
)
