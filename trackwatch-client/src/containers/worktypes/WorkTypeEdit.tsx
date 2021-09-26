import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IWorkType } from "../../dto/IWorkType";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";

const WorkTypeEdit = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [workType, setWorkType] = useState({} as IWorkType);
    const [page, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [deleteClicked, setDeleteClicked] = useState(false);

    const loadData = async () => {
        let roleResult = await BaseService.get<IWorkType>(id, '/worktypes', appState.token!);

        if (roleResult.ok && roleResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setWorkType(roleResult.data)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: roleResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()
        await BaseService.put(workType.id, {
            'id': workType.id,
            'name': workType.name,
            'description': workType.description
        }, '/worktypes', appState.token!);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(workType).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
            deleteClicked ?
                <>
                    <h3>Are you sure you want to delete "{workType.name}"?</h3>
                    <button onClick={async () => {
                        await BaseService.delete(workType.id, '/worktypes', appState.token!);
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
                </> : (null)
    );
};
export default WorkTypeEdit;