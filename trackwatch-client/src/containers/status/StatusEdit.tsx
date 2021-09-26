import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { IStatus } from "../../dto/IStatus";
import { IWorkAuthor } from "../../dto/IWorkAuthor";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";

const StatusEdit = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [status, setStatus] = useState({} as IStatus);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [deleteClicked, setDeleteClicked] = useState(false);

    const loadData = async () => {
        let statusResult = await BaseService.get<IStatus>(id, '/statuses', appState.token!);

        if (statusResult.ok && statusResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setStatus(statusResult.data)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: statusResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        await BaseService.put(status.id, {
            'id': status.id,
            'name': status.name,
            'description': status.description
        }, '/characters', appState.token!);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(status).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
            deleteClicked ?
                <>
                    <h3>Are you sure you want to delete "{status.name}"?</h3>
                    <button onClick={ async () => {
                       await BaseService.delete(status.id, '/statuses', appState.token!);
                    }} className="btn btn-danger">Yes</button> <button onClick={() => setDeleteClicked(false)} className="btn btn-primary" style={{ marginLeft: '1rem' }}>No</button>
                </>
                :
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
                </> : (null)
    );
};

export default StatusEdit;