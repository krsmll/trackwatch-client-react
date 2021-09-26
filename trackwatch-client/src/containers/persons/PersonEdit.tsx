import { worker } from "cluster";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { ICharacterPerson } from "../../dto/ICharacterPerson";
import { IPerson } from "../../dto/IPerson";
import { IWork } from "../../dto/IWork";
import { IWorkAuthor } from "../../dto/IWorkAuthor";
import { IWorkCharacter } from "../../dto/IWorkCharacter";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";

const PersonEdit = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [person, setPerson] = useState({} as IPerson);
    const [allWorks, setAllWorks] = useState([] as IWork[]);
    const [pictureUrl, setPictureUrl] = useState('');
    const [selectedWorks, setSelectedWorks] = useState([] as string[]);

    const [worksEdited, setWorksEdited] = useState(false);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [deleteClicked, setDeleteClicked] = useState(false);

    const loadData = async () => {
        let personResult = await BaseService.get<IPerson>(id, '/persons', appState.token!);
        let allWorksResult = await BaseService.getAll<IWork>('/works', appState.token!);

        if (personResult.ok && personResult.data && allWorksResult.ok && allWorksResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setPerson(personResult.data);
            setAllWorks(allWorksResult.data);
            setPictureUrl(personResult.data.personPictures.length > 0 ? personResult.data.personPictures[0].url : '')
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: personResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        if (worksEdited) {
            selectedWorks.forEach(async w => {
                console.log(w);
            
                if (person.workAuthors.find(wc => wc.work.id === w) === undefined) {
                    await BaseService.post<IWorkAuthor>(
                        {
                            'workId': w,
                            'personId': id
                        }, "/workauthors", true, appState!.token!
                    )
                }
            });

            person.workAuthors.forEach(async w => {
                if (selectedWorks.find(it => it === w.work.id) === undefined) {
                    await BaseService.delete(w.id, '/workauthors', appState!.token!)
                }
            });

            setWorksEdited(false);
        }

        await BaseService.put(person.id, {
            'id': person.id,
            'firstName': person.firstName,
            'lastName': person.lastName,
            'nationality': person.nationality,
            'birthdate': person.birthdate,
        }, '/persons', appState.token!);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(person).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
            deleteClicked ?
                <>
                    <h3>Are you sure you want to delete {person.firstName + " " + person.lastName} </h3>
                    <button onClick={async () => {
                        await BaseService.delete(id, '/persons', appState.token!);
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
                                        <input id='Pic_URL' name='Pic.URL' type='text' value={pictureUrl} onChange={e => setPictureUrl(e.target.value.toString())}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Dropdown_Works">Works: </label><br />
                                        <select id='Dropdown_Works' onChange={e => { setWorksEdited(true); setSelectedWorks(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                            {allWorks.sort().map(
                                                w => person.workAuthors.find(it => w.workAuthors.find(that => that.id === it.id) !== undefined) !== undefined ?
                                                    <option value={w.id} selected>{w.title}</option> :
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
                </> : (null)
    );
}

export default PersonEdit;