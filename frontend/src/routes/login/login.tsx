import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookie] = useCookies(['session_id']);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        doLogin(username, password, setCookie)
    };

    
    const doLogin = async (username: string, password: string, setCookie: any): Promise<void> => {
        // const [cookies, setCookie] = useCookies(['session_id']);
        const headers = new Headers();
        headers.append("Authorization", "Basic " + Buffer.from(username + ":" + password, 'binary').toString('base64'));

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
                headers: headers,
                // credentials: 'include', // play nice with CORS
                method: 'POST',
            });

            if (response.status !== 200) {
                alert("Login failed!");
                return;
            }

            const json = await response.json();

            setCookie('session_id', json['session_id'].toString(), { path: '/', maxAge: 3600 * 24 });

            navigate("../");

        } catch (error) {
            alert("Login failed!");
            return;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input id="username" name="username" type="text" autoComplete="username" required
                                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                   placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required
                                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                   placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up!
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
