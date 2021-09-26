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
import Page404 from "../Page404";

const RoleAdd = () => {
    const appState = useContext(AppContext);
    const [role, setRole] = useState({} as IRole);
    const [workAuthors, setWorkAuthors] = useState([] as IWorkAuthor[])
    const [page, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });
    const [selectedAuthors, setSelectedAuthors] = useState([] as string[])

    const [rolesEdited, setRolesEdited] = useState(false);
    const [deleteClicked, setDeleteClicked] = useState(false);

    const loadData = async () => {
        let workAuthorsResult = await BaseService.getAll<IWorkAuthor>('/workauthors', appState.token!);

        if (workAuthorsResult.ok && workAuthorsResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setWorkAuthors(workAuthorsResult.data)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: workAuthorsResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        let addResult = await BaseService.post<IRole>({
            'name': role.name,
        }, '/roles', true, appState.token!);

        if (addResult.ok && addResult.data && rolesEdited) {
            selectedAuthors.forEach(async w => {
                await BaseService.post<IWorkAuthorRole>(
                    {
                        'workAuthorId': w,
                        'roleId': addResult.data!.id
                    }, "/workauthorroles", true, appState!.token!
                )
            });

            setRolesEdited(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        appState.roles.find(it => it === "Admin") !== undefined ?
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
                                            w => <option value={w.id}>{w.person.firstName} {w.person.lastName}</option>)}
                                    </select>
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
export default RoleAdd;