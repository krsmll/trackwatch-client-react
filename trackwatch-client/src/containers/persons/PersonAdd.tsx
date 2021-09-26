import { worker } from "cluster";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { ICharacterPerson } from "../../dto/ICharacterPerson";
import { ICharacterPicture } from "../../dto/ICharacterPicture";
import { IPerson } from "../../dto/IPerson";
import { IPersonPicture } from "../../dto/IPersonPicture";
import { IWork } from "../../dto/IWork";
import { IWorkAuthor } from "../../dto/IWorkAuthor";
import { IWorkCharacter } from "../../dto/IWorkCharacter";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";
import Page404 from "../Page404";

const PersonAdd = () => {
    const appState = useContext(AppContext);
    const [person, setPerson] = useState({
        'firstName': '',
        'lastName': '',
        'nationality': '',
        'birthdate': '',
    } as IPerson);
    const [allWorks, setAllWorks] = useState([] as IWork[]);
    const [pictureUrl, setPictureUrl] = useState('');
    const [selectedWorks, setSelectedWorks] = useState([] as string[]);

    const [worksEdited, setWorksEdited] = useState(false);
    const [pictureEdited, setPictureEdited] = useState(false);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = async () => {
        let allWorksResult = await BaseService.getAll<IWork>('/works', appState.token!);
        let workAuthorResult = await BaseService.getAll<IWorkAuthor>('/workauthors', appState.token!);

        if (allWorksResult.ok && allWorksResult.data && workAuthorResult.ok && workAuthorResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setAllWorks(allWorksResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: allWorksResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        let addResult = await BaseService.post<ICharacter>({
            'firstName': person.firstName,
            'lastName': person.lastName,
            'nationality': person.nationality,
            'birthdate': person.birthdate
        }, '/persons', true, appState.token!);

        if (addResult.ok && addResult.data) {
            if (worksEdited) {
                selectedWorks.forEach(async w => {
                    await BaseService.post<IWorkAuthor>(
                        {
                            'workId': w,
                            'personId': addResult.data!.id
                        }, "/workauthors", true, appState!.token!
                    )
                });

                person.workAuthors.forEach(async w => {
                    await BaseService.delete(w.id, '/workauthors', appState!.token!)
                });

                setWorksEdited(false);
            }

            if (pictureEdited) {
                await BaseService.post<IPersonPicture>({
                    'personId': addResult.data.id,
                    'url': pictureUrl
                }, '/personpictures', true, appState.token!)
            }
        }
    }

    useEffect(() => {
        loadData();
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
                                    <label htmlFor="FirstName">First Name: </label><br />
                                    <input id='FirstName' name='FirstName' type='text' value={person.firstName} onChange={e => setPerson({ ...person, firstName: e.target.value })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="LastName">Last Name: </label><br />
                                    <input id='LastName' name='LastName' type='text' value={person.lastName} onChange={e => setPerson({ ...person, lastName: e.target.value })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Description">Nationality: </label><br />
                                    <input id='Description' name='Description' type='text' value={person.nationality} onChange={e => setPerson({ ...person, nationality: e.target.value })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Date_Birthdate">Birthdate: </label><br />
                                    <input id='Date_Birthdate' name='Date.Birthdate' type='datetime-local' value={person.birthdate !== null ? person.birthdate!.substring(0, person.birthdate!.length - 1) : ""} onChange={e => setPerson({ ...person, birthdate: moment(e.target.value).toISOString() })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Pic_URL">Picture URL: </label><br />
                                    <input id='Pic_URL' name='Pic.URL' type='text' value={pictureUrl} onChange={e => {setPictureEdited(true); setPictureUrl(e.target.value.toString())}}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Dropdown_Works">Works: </label><br />
                                    <select id='Dropdown_Works' onChange={e => { setWorksEdited(true); setSelectedWorks(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                        {allWorks.sort().map(
                                            w =>
                                                <option value={w.id}>{w.title}</option>
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
            </> : <Page404 />
    );
}
export default PersonAdd;