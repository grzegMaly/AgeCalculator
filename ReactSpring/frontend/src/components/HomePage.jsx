import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <main className={`bg-gradient-to-br from-[#4dff88] to-[#ac00e6] min-h-screen min-w-screen flex items-center justify-center`}>
            <div className={`p-8 flex flex-col items-center`}>
                <h1 className={`text-white text-7xl mb-7`}>
                    Welcome To Ages App
                </h1>
                <Link
                    to={'/age-calculator'}
                    className={`px-3 py-3 text-center w-[40%] font-bold text-2xl text-white cursor-pointer 
                    bg-blue-500 hover:bg-blue-300 rounded-md`}
                >
                    Enter Calculator
                </Link>
            </div>
        </main>
    )
}

export default HomePage;