import {useState} from "react";

const AgeCalculator = () => {

    const [data, setData] = useState({
        result: null,
        birthday: null
    });

    const calcAge = () => {
        const birthDate = new Date(data.birthday);
        const currentDate = new Date();

        if (birthDate > currentDate) {
            return null;
        }

        let years = currentDate.getFullYear() - birthDate.getFullYear();
        const m = currentDate.getMonth() - birthDate.getMonth();
        const d = currentDate.getDate() - birthDate.getDate();

        if (m < 0 || (m === 0 && d < 0)) years--
        return years;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.birthday) {
            alert("Please enter your birthday");
            return;
        }

        const age = calcAge();
        if (!Number.isInteger(age) || age < 0) {
            setData({...data, result: "Insert correct date"})
            return;
        }

        setData({
            ...data,
            result: `You are ${age} year${age > 1 ? "s" : ""} old`
        });
    }

    return (
        <main className={`min-w-screen min-h-screen bg-gradient-to-br from-[#83e15e] to-[#56b8d6] 
        bg-cover flex items-center justify-center`}>
            <div className={`p-5 flex-col items-center justify-center bg-white w-[40%] rounded-md shadow-xl shadow-slate-300`}>
                <h1 className={`text-lg text-center mb-5`}>
                    Age Container
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className={`flex flex-col items-center justify-center`}>
                    <label className={`mb-4 font-bold`} htmlFor="birthday">Enter your birthday</label>
                    <input
                        name={'birthday'}
                        type="date"
                        onChange={e => setData({...data, birthday: e.target.value})}
                        className={`mb-4 p-2 border-[1px] border-[#ccc] rounded-md w-full text-center max-w-[50%]`}
                    />
                    <button
                        id={'btn'}
                        type={'submit'}
                        className={`mb-4 bg-[#007bff] text-white py-3 px-5 border-none rounded-md cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#0062cc]`}
                    >
                        Calculate Age
                    </button>
                    <p
                        className={`mt-5 text-2xl font-bold`}
                    >
                        {data.result}
                    </p>
                </form>
            </div>
        </main>
    )
}

export default AgeCalculator;