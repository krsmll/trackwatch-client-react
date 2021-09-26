import { worker } from "cluster";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { ICharacterPerson } from "../../dto/ICharacterPerson";
import { IWork } from "../../dto/IWork";
import { IWorkAuthor } from "../../dto/IWorkAuthor";
import { IWorkCharacter } from "../../dto/IWorkCharacter";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";

const CharacterEdit = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [character, setCharacter] = useState({} as ICharacter);
    const [allWorks, setAllWorks] = useState([] as IWork[]);
    const [pictureUrl, setPictureUrl] = useState('');
    const [workAuthors, setWorkAuthors] = useState([] as IWorkAuthor[]);
    const [selectedWorks, setSelectedWorks] = useState([] as string[]);
    const [selectedAuthors, setSelectedAuthors] = useState([] as string[]);

    const [worksEdited, setWorksEdited] = useState(false);
    const [authorsEdited, setAuthorsEdited] = useState(false);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [deleteClicked, setDeleteClicked] = useState(false);

    const loadData = async () => {
        let characterResult = await BaseService.get<ICharacter>(id, '/characters', appState.token!);
        let allWorksResult = await BaseService.getAll<IWork>('/works', appState.token!);
        let workAuthorResult = await BaseService.getAll<IWorkAuthor>('/workauthors', appState.token!);

        if (characterResult.ok && characterResult.data && allWorksResult.ok && allWorksResult.data && workAuthorResult.ok && workAuthorResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setCharacter(characterResult.data);
            setAllWorks(allWorksResult.data);
            setWorkAuthors(workAuthorResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: characterResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        if (worksEdited) {
            selectedWorks.forEach(async w => {
                if (character.workCharacters.find(wc => wc.work.id === w) === undefined) {
                    await BaseService.post<IWorkCharacter>(
                        {
                            'workId': w,
                            'characterId': id
                        }, "/workcharacters", true, appState!.token!
                    )
                }
            });

            character.workCharacters.forEach(async w => {
                if (selectedWorks.find(it => it === w.work.id) === undefined) {
                    await BaseService.delete(w.id, '/workcharacters', appState!.token!)
                }
            });

            setWorksEdited(false);
        }

        if (authorsEdited) {
            selectedAuthors.forEach(async w => {
                if (character.characterPersons.find(wc => wc.workAuthor.id === w) === undefined) {
                    await BaseService.post<ICharacterPerson>(
                        {
                            'workAuthorId': w,
                            'characterId': id
                        }, "/characterpersons", true, appState!.token!
                    )
                }
            });

            character.characterPersons.forEach(async w => {
                if (selectedWorks.find(it => it === w.workAuthor.id) === undefined) {
                    await BaseService.delete(w.id, '/characterpersons', appState!.token!)
                }
            });

            setAuthorsEdited(false);
        }

        await BaseService.put(character.id, {
            'id': character.id,
            'firstName': character.firstName,
            'lastName': character.lastName,
            'description': character.description,
            'age': character.age,
            'birthdate': character.birthdate,
        }, '/characters', appState.token!);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(character).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
            deleteClicked ?
                <>
                    <h3>Are you sure you want to delete {character.lastName !== null ? character.firstName + " " + character.lastName : character.firstName}?</h3>
                    <button onClick={async () => {
                        await BaseService.delete(id, '/characters', appState.token!);
                        <Redirect to="/manage" />
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
                                        <input id='Age' name='Age' type='number' value={character.age.toString()} onChange={e => setCharacter({ ...character, age: parseInt(e.target.value) })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Date_Birthdate">Birthdate: </label><br />
                                        <input id='Date_Birthdate' name='Date.Birthdate' type='datetime-local' value={character.birthdate !== null ? character.birthdate!.substring(0, character.birthdate!.length - 1) : ""} onChange={e => setCharacter({ ...character, birthdate: moment(e.target.value).toISOString() })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Pic_URL">Picture URL: </label><br />
                                        <input id='Pic_URL' name='Pic.URL' type='text' value={pictureUrl} onChange={e => setPictureUrl(e.target.value)}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Dropdown_Works">Works: </label><br />
                                        <select id='Dropdown_Works' onChange={e => { setWorksEdited(true); setSelectedWorks(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                            {allWorks.sort().map(
                                                w => character.workCharacters.find(it => w.id === it.work.id) !== undefined ?
                                                    <option value={w.id} selected>{w.title}</option> :
                                                    <option value={w.id}>{w.title}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Dropdown_Authors">Authors: </label><br />
                                        <select id='Dropdown_Authors' onChange={e => { setAuthorsEdited(true); setSelectedAuthors(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                            {workAuthors.sort().map(
                                                w => character.characterPersons.find(it => w.id === it.workAuthor.id) !== undefined ?
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
}

export default CharacterEdit;