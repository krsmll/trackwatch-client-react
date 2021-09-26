import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { IStatus } from "../../dto/IStatus";
import { IWorkAuthor } from "../../dto/IWorkAuthor";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";
import Page404 from "../Page404";

const StatusAdd = () => {
    const appState = useContext(AppContext);
    const [status, setStatus] = useState({
        'name': '',
        'description': ''
    } as IStatus);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [deleteClicked, setDeleteClicked] = useState(false);

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        await BaseService.post({
            'name': status.name,
            'description': status.description
        }, '/statuses', true, appState.token!);
    }

    useEffect(() => {

    }, []);

    return (
        Object.keys(status).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
                <>
                    <button onClick={() => setDeleteClicked(true)} className='btn btn-danger'>Delete</button>
                    <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
                        <div className="row">
                            <div className="col-md-6">
                                <section>
                                    <hr />
                                    <div className="form-group">
                                        <label htmlFor="Title">Name: </label><br />
                                        <input id='Title' name='Notes' type='text' value={status.name} onChange={e => setStatus({ ...status, name: e.target.value })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Description">Description: </label><br />
                                        <input id='Description' name='Description' type='text' value={status.description} onChange={e => setStatus({ ...status, description: e.target.value })}></input>
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

export default StatusAdd;