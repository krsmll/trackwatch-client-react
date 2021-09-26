import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Header = () => {
    const appState = useContext(AppContext);

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">trackWatch</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">

                            <li className="nav-item">
                                <NavLink className="nav-link text-dark" to="/works">Works</NavLink>
                            </li>

                        </ul>
                        <ul className="navbar-nav">
                            {appState.token === null ?
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link text-dark" to="/login">Login</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link text-dark" to="/register">Register</NavLink>
                                    </li>
                                </>
                                :
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link text-dark">{appState.username}</span>
                                    </li>
                                    {
                                        appState.roles.find(role => role === "Admin") !== undefined ?
                                            <li className="nav-item">
                                                <NavLink className="nav-link text-dark" to={"/manage"}>Manage</NavLink>
                                            </li> : (null)
                                    }
                                    <li className="nav-item">
                                        <NavLink className="nav-link text-dark" to={"/" + appState.username + "/fav-chars"}>Favorite Characters</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link text-dark" to={"/" + appState.username + "/watchlist"}>Watchlist</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={() => appState.setAuthInfo(null, [], '')} className="btn btn-link nav-link text-dark" >Logout</button>
                                    </li>
                                </>
                            }

                        </ul>

                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;