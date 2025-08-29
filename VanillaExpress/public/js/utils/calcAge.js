export const calcAge = (birthdayValue) => {

    const birthDate = new Date(birthdayValue);
    const currentDate = new Date();

    if (birthDate > currentDate) {
        return null;
    }

    let years = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    const d = currentDate.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && d < 0)) years--;
    return years;
}