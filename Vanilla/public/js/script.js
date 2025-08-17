import {calcAge} from "./utils/calcAge.js";

const form = document.querySelector('form')
const birthdayEl = document.getElementById('birthday');
const resultEl = document.getElementById('result');

form.addEventListener('submit', e => {
    e.preventDefault();

    const birthdayValue = birthdayEl.value;
    if (birthdayValue === "") {
        alert("Please enter your birthday");
        return;
    }

    const age = calcAge(birthdayValue);
    if (!Number.isInteger(age) || age < 0) {
        resultEl.textContent = 'Insert Correct Date';
        return;
    }
    resultEl.textContent = `You are ${age} year${age > 1 ? "s" : ""} old`;
});
