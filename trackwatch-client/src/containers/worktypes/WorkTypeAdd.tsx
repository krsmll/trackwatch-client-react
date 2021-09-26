import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IWorkType } from "../../dto/IWorkType";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";
import Page404 from "../Page404";

const WorkTypeAdd = () => {
    const appState = useContext(AppContext);
    const [workType, setWorkType] = useState({
        'name': '',
        'description': ''
    } as IWorkType);


    const submitClicked = async (e: Event) => {
        e.preventDefault()
        await BaseService.post({
            'name': workType.name,
            'description': workType.description
        }, '/worktypes', true, appState.token!);
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
                                    <input id='Title' name='Title' type='text' value={workType.name} onChange={e => setWorkType({ ...workType, name: e.target.value })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Description">Description: </label><br />
                                    <input id='Description' name='Description' type='text' value={workType.description} onChange={e => setWorkType({ ...workType, description: e.target.value })}></input>
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
export default WorkTypeAdd;