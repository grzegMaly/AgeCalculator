import {api} from "./utils/api.js";

const formEl = document.querySelector('.form')
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');

const endpoints = {
    login: data => api('/login', {method: "POST", body: data}),
    register: data => api('/register', {method: "POST", body: data}),
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validators = {
    login: ({email, password}) => {
        if (!emailRegex.test(email)) return 'Type correct e-mail';
        if (!password || password.length < 12) return 'Password to short';
        return null;
    },
    register: ({name, email, password, passwordConfirm}) => {
        const base = validators.login({email, password});
        if (base) return base;
        if (!name || name.trim().length < 5) return 'Incorrect username';
        if (password !== passwordConfirm) return "Passwords don't match";
        return null;
    }
}

const showError = (message) => {
    let pEl = document.querySelector('.error');
    if (!pEl) {
        pEl = document.createElement('p');
        pEl.classList.add('error');
        formEl.insertAdjacentElement('beforeend', pEl);
    }
    pEl.innerText = message;
}

const determineOperation = async (data, location) => {

    const result = validators[location](data);
    if (result) {
        console.log(result);
        showError(result);
        return;
    }

    const old = formEl.querySelector('.error');
    if (old) old.remove();

    try {
        const resp = await endpoints[location](data);
        if (resp.status === 'success') {
            return window.location.assign('/');
        }
    } catch (error) {
        showError(error.message)
    }
}

if (formEl) {
    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailEl.value.trim();
        const password = passwordEl.value.trim();
        const data = {email,password}
        const location = window.location.pathname.slice(1);

        if (location === 'register') {
            const name = document.getElementById('name');
            const passwordConfirm = document.getElementById('passwordConfirm');
            data.name = name.value.trim();
            data.passwordConfirm = passwordConfirm.value.trim();
        }
        await determineOperation(data, location);
    });
}