import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IFormat } from "../../dto/IFormat";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";

const FormatEdit = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [format, setFormat] = useState({} as IFormat);
    const [page, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [deleteClicked, setDeleteClicked] = useState(false);

    const loadData = async () => {
        let roleResult = await BaseService.get<IFormat>(id, '/formats', appState.token!);

        if (roleResult.ok && roleResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setFormat(roleResult.data)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: roleResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()
        await BaseService.put(format.id, {
            'id': format.id,
            'name': format.name,
        }, '/formats', appState.token!);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(format).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
            deleteClicked ?
                <>
                    <h3>Are you sure you want to delete "{format.name}"?</h3>
                    <button onClick={async () => {
                        await BaseService.delete(format.id, '/formats', appState.token!);
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
                                        <input id='Title' name='Notes' type='text' value={format.name} onChange={e => setFormat({ ...format, name: e.target.value })}></input>
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
export default FormatEdit;