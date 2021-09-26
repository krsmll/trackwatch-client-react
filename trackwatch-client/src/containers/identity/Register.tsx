import React, { useContext, useState } from "react";
import { Redirect } from "react-router";
import Alert, { EAlertClass } from "../../components/Alerts";
import { AppContext } from "../../context/AppContext";
import { IdentityService } from "../../services/identity-service";


const Register = () => {
    const appState = useContext(AppContext);

    const [registerData, setRegisterData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
    const [alertMessage, setAlertMessage] = useState('');

    const registerClicked = async (e: Event) => {
        e.preventDefault();
        if (registerData.email === '') {
            setAlertMessage('Empty email!');
            return;
        };

        if (registerData.username === '') {
            setAlertMessage('Empty username!');
            return;
        };

        if (registerData.password === '') {
            setAlertMessage('Empty password!');
            return;
        };

        if (registerData.confirmPassword === '') {
            setAlertMessage('Please confirm password!');
            return;
        };

        if (registerData.password !== registerData.confirmPassword) {
            setAlertMessage('Passwords do not match!');
            return;
        }

        setAlertMessage('');
        let response = await IdentityService.Login('account/register', registerData);

        console.log(response);
        if (!response.ok) {
            setAlertMessage(response.messages![0]);
        } else {
            setAlertMessage('');
            appState.setAuthInfo(response.data!.token, response.data!.roles, response.data!.username);
        }
    }

    return (
        <>
            { appState.token !== null ? <Redirect to="/" /> : null}
            <h1>Log in</h1>
            <form onSubmit={(e) => registerClicked(e.nativeEvent)}>
                <div className="row">
                    <div className="col-md-6">
                        <section>
                            <hr />
                            <Alert show={alertMessage !== ''} message={alertMessage} alertClass={EAlertClass.Danger} />
                            <div className="form-group">
                                <label htmlFor="Input_Email">Email</label>
                                <input value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} className="form-control" type="email" id="Input_Email" name="Input.Email" placeholder="user@example.com"  autoComplete="username" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Input_Username">Username</label>
                                <input value={registerData.username} onChange={e => setRegisterData({ ...registerData, username: e.target.value })} className="form-control" type="text" id="Input_Username" name="Input.Username" placeholder="Input your current password..." autoComplete="current-password" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Input_Password">Password</label>
                                <input value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} className="form-control" type="password" id="Input_Password" name="Input.Password" placeholder="Input your current password..." autoComplete="current-password" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Input_Password">Password</label>
                                <input value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} className="form-control" type="password" id="Input_ConfirmPassword" name="Input.ConfirmPassword" placeholder="Input your current password..." autoComplete="current-password" />
                            </div>
                            <div className="form-group">
                                <button onClick={(e) => registerClicked(e.nativeEvent)} type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Register;
