import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar.jsx";
import Input from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import {serverHost} from "../config/serverhost.jsx";
import {navigate} from "../Router.jsx";
import {useAuth} from "../hooks/auth.hook.jsx";
import DashboardSkeleton from "../components/ui/dashboard.skeleton.jsx";
import GoogleButton from "../components/ui/googlebutton.jsx";
import AnonymousButton from "../components/ui/anonymousbutton.jsx";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [serverResponse, setServerResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const isAuth = useAuth();
    if (isAuth === null) return <DashboardSkeleton />;

    if (isAuth) {
        navigate("/user");
    }

    const handleLogin = async () => {
        try{
            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if(!res.ok){
                console.log(data);
            }

            // setServerResponse(data.message)

            if(data?.message === "Successfully verified" && data?.data?.success){
                localStorage.setItem("userToken", data?.data?.userToken);
                navigate("/user");
            }else if((!data?.data?.success && data?.message === "Wrong password") || (!data?.data?.success && data?.message === "User not found")){
                setServerResponse("Wrong email or password");
            }else{
                setServerResponse(data?.message);
            }
        }catch(err){
            console.log("Error on handleLogin()",err);
        }
    }

    const handleLoginWithGoogle = async () => {
        try {
            window.location.href = `${serverHost}/api/auth/google`;
            // const res = await fetch(`${serverHost}/api/auth/google`);
            // const data = await res.json();
            // console.log(data);
        }catch(err){
            console.log("Error on handleLoginWithGoogle()",err);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
            <Navbar />

            <div className="flex items-center justify-center px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">
                            Welcome back
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Login to continue improving your IELTS writing
                        </p>
                    </div>

                    {serverResponse && (
                        <div className="text-red-700 text-center">{serverResponse}</div>
                    )}

                    {/* Card */}
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button className="w-full rounded-full py-2 mt-2" onClick={handleLogin}>
                            Sign In
                        </Button>

                        <div className="mt-3 mb-3">
                            <GoogleButton onClick={handleLoginWithGoogle} loading={loading}/>
                        </div>

                        <div className="mt-3 mb-3">
                            <AnonymousButton onClick={()=> navigate("/writing/anonymously")} loading={loading}/>
                        </div>

                        <div className="text-center text-sm text-gray-500 mt-2">
                            Don’t have an account?{" "}
                            <a
                                href="/register"
                                className="text-black font-medium hover:underline"
                            >
                                Sign up
                            </a>
                        </div>
                        <div className="flex justify-end text-sm text-gray-500 mt-2">
                            <a
                                href="/forgot/password"
                                className="text-black font-medium hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/*<footer className="border-t py-6 text-center text-sm text-gray-500">*/}
            {/*    © {new Date().getFullYear()} RedKalam. All rights reserved.*/}
            {/*</footer>*/}
        </div>
    );
}