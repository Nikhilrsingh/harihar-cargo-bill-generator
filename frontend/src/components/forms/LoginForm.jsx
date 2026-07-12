import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/firebaseConfig";

import Button from "../common/Button";
import Input from "../common/Input";
import Card from "../common/Card";

function LoginForm() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/dashboard");

        } catch (error) {

            alert(error.message);

        }

    };

    return (

        <Card>

            <div className="login-form">

                <h2>Welcome Back</h2>

                <p>Sign in to continue</p>

                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <Button
                    text="Sign In"
                    onClick={handleLogin}
                />

            </div>

        </Card>

    );

}

export default LoginForm;