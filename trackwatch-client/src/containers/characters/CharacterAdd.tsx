import { worker } from "cluster";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { ICharacterPerson } from "../../dto/ICharacterPerson";
import { ICharacterPicture } from "../../dto/ICharacterPicture";
import { IWork } from "../../dto/IWork";
import { IWorkAuthor } from "../../dto/IWorkAuthor";
import { IWorkCharacter } from "../../dto/IWorkCharacter";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";
import Page404 from "../Page404";

const CharacterAdd = () => {
    const appState = useContext(AppContext);
    const [character, setCharacter] = useState({
        'firstName': '',
        'lastName': '',
        'description': '',
        'age': NaN,
        'birthdate': '',
    } as ICharacter);
    const [allWorks, setAllWorks] = useState([] as IWork[]);
    const [pictureUrl, setPictureUrl] = useState('');
    const [workAuthors, setWorkAuthors] = useState([] as IWorkAuthor[]);
    const [selectedWorks, setSelectedWorks] = useState([] as string[]);
    const [selectedAuthors, setSelectedAuthors] = useState([] as string[]);

    const [worksEdited, setWorksEdited] = useState(false);
    const [authorsEdited, setAuthorsEdited] = useState(false);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = async () => {
        let allWorksResult = await BaseService.getAll<IWork>('/works', appState.token!);
        let workAuthorResult = await BaseService.getAll<IWorkAuthor>('/workauthors', appState.token!);

        if (allWorksResult.ok && allWorksResult.data && workAuthorResult.ok && workAuthorResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setAllWorks(allWorksResult.data);
            setWorkAuthors(workAuthorResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: allWorksResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        let addResult = await BaseService.post<ICharacter>({
            'firstName': character.firstName,
            'lastName': character.lastName,
            'description': character.description,
            'age': character.age,
            'birthdate': character.birthdate,
        }, '/characters', true, appState.token!);

        if (addResult.ok && addResult.data) {
            if (worksEdited) {
                selectedWorks.forEach(async w => {
                    await BaseService.post<IWorkCharacter>(
                        {
                            'workId': w,
                            'characterId': addResult.data!.id
                        }, "/workcharacters", true, appState!.token!
                    )
                });

                setWorksEdited(false);
            }

            if (authorsEdited) {
                selectedAuthors.forEach(async w => {
                    await BaseService.post<ICharacterPerson>(
                        {
                            'workAuthorId': w,
                            'characterId': addResult.data!.id
                        }, "/characterpersons", true, appState!.token!
                    )
                });

                setAuthorsEdited(false);
            }

            if (pictureUrl !== '') {
                await BaseService.post<ICharacterPicture>({
                    'characterId': addResult.data.id,
                    'url': pictureUrl,
                }, '/characterpictures', true, appState.token!)
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
                                    <input id='FirstName' name='FirstName' type='text' value={character.firstName} onChange={e => setCharacter({ ...character, firstName: e.target.value })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="LastName">Last Name: </label><br />
                                    <input id='LastName' name='LastName' type='text' value={character.lastName} onChange={e => setCharacter({ ...character, lastName: e.target.value })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Description">Description: </label><br />
                                    <input id='Description' name='Description' type='text' value={character.description} onChange={e => setCharacter({ ...character, description: e.target.value })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Age">Age: </label><br />
                                    <input id='Age' name='Age' type='number' value={character.age} onChange={e => setCharacter({ ...character, age: parseInt(e.target.value) })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Date_Birthdate">Birthdate: </label><br />
                                    <input id='Date_Birthdate' name='Date.Birthdate' type='datetime-local' value={character.birthdate !== '' ? character.birthdate!.substring(0, character.birthdate!.length - 1) : ''} onChange={e => setCharacter({ ...character, birthdate: moment(e.target.value).toISOString() })}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Pic_URL">Picture URL: </label><br />
                                    <input id='Pic_URL' name='Pic.URL' type='text' value={pictureUrl} onChange={e => setPictureUrl(e.target.value)}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Dropdown_Works">Works: </label><br />
                                    <select id='Dropdown_Works' onChange={e => { setWorksEdited(true); setSelectedWorks(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                        {allWorks.sort().map(w => <option value={w.id}>{w.title}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Dropdown_Authors">Authors: </label><br />
                                    <select id='Dropdown_Authors' onChange={e => { setAuthorsEdited(true); setSelectedAuthors(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                        {workAuthors.sort().map(w => <option value={w.id}>{w.person.firstName} {w.person.lastName}</option>)}
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
export default CharacterAdd;