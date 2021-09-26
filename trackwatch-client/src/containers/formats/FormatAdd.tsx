import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IFormat } from "../../dto/IFormat";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";
import Page404 from "../Page404";

const FormatAdd = () => {
    const appState = useContext(AppContext);
    const [format, setFormat] = useState({
        'name': ''
    } as IFormat);

    const submitClicked = async (e: Event) => {
        e.preventDefault()
        await BaseService.post({
            'name': format.name
        }, '/formats', true, appState.token!);
    }

    useEffect(() => {
    }, []);

    return (
        appState.roles.find(it => it === "Admin") !== undefined ?
                <>
                    <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
                        <div className="row">
                            <div className="col-md-6">
                                <section>
                                    <hr />
                                    <div className="form-group">
                                        <label htmlFor="Title">Name: </label><br />
                                        <input id='Title' name='Notes' type='text' value={format.name} onChange={e => setFormat({ ...format, name: e.target.value })}></input>
                                    </div>
                                    <div className="form-group">
                                        <button onClick={(e) => submitClicked(e.nativeEvent)} type="submit" className="btn btn-primary">Edit</button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </form>
                </> : <Page404 />
    );
};
export default FormatAdd;