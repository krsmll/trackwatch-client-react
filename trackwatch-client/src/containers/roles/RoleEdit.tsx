import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { IRole } from "../../dto/IRole";
import { IStatus } from "../../dto/IStatus";
import { IWorkAuthor } from "../../dto/IWorkAuthor";
import { IWorkAuthorRole } from "../../dto/IWorkAuthorRole";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";

const RoleEdit = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [role, setRole] = useState({} as IRole);
    const [workAuthors, setWorkAuthors] = useState([] as IWorkAuthor[])
    const [page, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });
    const [selectedAuthors, setSelectedAuthors] = useState([] as string[])

    const [rolesEdited, setRolesEdited] = useState(false);
    const [deleteClicked, setDeleteClicked] = useState(false);

    const loadData = async () => {
        let roleResult = await BaseService.get<IRole>(id, '/roles', appState.token!);
        let workAuthorsResult = await BaseService.getAll<IWorkAuthor>('/workauthors', appState.token!);

        if (roleResult.ok && roleResult.data && workAuthorsResult.ok && workAuthorsResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setRole(roleResult.data)
            setWorkAuthors(workAuthorsResult.data)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: roleResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        if (rolesEdited) {
            selectedAuthors.forEach(async w => {
                if (role.workAuthors.find(it => it.workAuthorId === w) === undefined)  {
                    await BaseService.post<IWorkAuthorRole>(
                        {
                            'workAuthorId': w,
                            'roleId': id
                        }, "/workauthorroles", true, appState!.token!
                    )
                }
            });

            role.workAuthors.forEach(async w => {
                if (selectedAuthors.find(it => it === w.workAuthor.id) === undefined) {
                    await BaseService.delete(w.id, '/workauthorroles', appState!.token!)
                }
            });

            setRolesEdited(false);
        }

        await BaseService.put(role.id, {
            'id': role.id,
            'name': role.name,
        }, '/roles', appState.token!);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(role).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
            deleteClicked ?
                <>
                    <h3>Are you sure you want to delete "{role.name}"?</h3>
                    <button onClick={async () => {
                        await BaseService.delete(role.id, '/roles', appState.token!);
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
                                        <input id='Title' name='Notes' type='text' value={role.name} onChange={e => setRole({ ...role, name: e.target.value })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Dropdown_Genres">Work Authors: </label><br />
                                        <select id='Dropdown_Genres' onChange={e => { setRolesEdited(true); setSelectedAuthors(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                            {workAuthors.sort().map(
                                                w => role.workAuthors.find(g => g.workAuthorId === w.id) !== undefined ?
                                                    <option value={w.id} selected>{w.person.firstName} {w.person.lastName}</option> :
                                                    <option value={w.id}>{w.person.firstName} {w.person.lastName}</option>
                                            )}
                                        </select>
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
export default RoleEdit;