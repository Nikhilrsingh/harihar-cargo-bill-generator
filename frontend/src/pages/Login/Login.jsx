import "../../styles/login.css";
import LoginForm from "../../components/forms/LoginForm";

function Login() {
    return (
        <div className="login-page">

            <div className="login-left">

                <div className="branding">

                    <h1>Harihar Car Carriers</h1>

                    <p>
                        Professional Transport Management System
                    </p>

                </div>

            </div>

            <div className="login-right">

                <LoginForm />

            </div>

        </div>
    );
}

export default Login;