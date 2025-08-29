import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <main className={`bg-white min-h-screen flex justify-center items-center`}>
            <div className={`mx-auto max-w-screen text-center`}>
                <h1 className={`mb-4 text-7xl font-extrabold text-blue-400`}>
                    404
                </h1>
                <p className={`mb-4 text-3xl tracking-tight font-bold text-gray-900`}>
                    Something is missing.
                </p>
                <p className={`mb-4 text-lg font-light text-gray-500`}>
                    Sorry, we can't find that page.
                </p>
                <Link to={'/'} className={`inline-flex hover:underline hover:text-purple-600`}>
                    Go back to Homepage
                </Link>
            </div>
        </main>
    )
}

export default NotFoundPage;