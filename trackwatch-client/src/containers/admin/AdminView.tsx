import { NOTFOUND } from "dns";
import React, { useContext, useEffect, useState } from "react"
import { Card, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { AppContext } from "../../context/AppContext";
import { ICharacter } from "../../dto/ICharacter";
import { IFormat } from "../../dto/IFormat";
import { IGenre } from "../../dto/IGenre";
import { IPerson } from "../../dto/IPerson";
import { IRole } from "../../dto/IRole";
import { IStatus } from "../../dto/IStatus";
import { IWork } from "../../dto/IWork";
import { IWorkType } from "../../dto/IWorkType";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import Page404 from "../Page404";
import noImage from "../../assets/walter.png";



const WorkView = (props: { works: IWork[] }) => (
    <>
        <Link className='btn btn-primary' to='/works/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.works.map(work =>
                <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/works/edit/' + work.id}>
                    <img className="rounded" style={{ maxWidth: '10rem' }} src={work.coverPictures[0].url}></img><br />
                    {work.title}
                </Link>
            )}
        </Container>
    </>
);

const CharacterView = (props: { characters: ICharacter[] }) => (
    <>
        <Link className='btn btn-primary' to='/characters/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.characters.map(char =>
                <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/characters/edit/' + char.id}>
                    <img className="rounded" style={{ maxWidth: '10rem', minWidth: '10rem' }} src={char.pictures.length !== 0 ? char.pictures[0].url : noImage}></img><br />
                    {char.lastName !== null ? char.firstName + " " + char.lastName : char.firstName}
                </Link>
            )}
        </Container>
    </>
);

const PersonView = (props: { persons: IPerson[] }) => (
    <>
        <Link className='btn btn-primary' to='/persons/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.persons.map(person =>
                <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/persons/edit/' + person.id}>
                    <img className="rounded" style={{ maxWidth: '10rem', minWidth: '10rem' }} src={person.personPictures.length !== 0 ? person.personPictures[0].url : noImage}></img><br />
                    {person.firstName + " " + person.lastName}
                </Link>
            )}
        </Container>
    </>
);

const StatusView = (props: { statuses: IStatus[] }) => (
    <>
        <Link className='btn btn-primary' to='/statuses/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.statuses.map(status =>
                <Link className='btn btn-light' style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/statuses/edit/' + status.id}>
                    {status.name}
                </Link>
            )}
        </Container>
    </>
);

const RolesView = (props: { roles: IRole[] }) => (
    <>
        <Link className='btn btn-primary' to='/roles/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.roles.map(role =>
                <Link className='btn btn-light' style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/roles/edit/' + role.id}>
                    {role.name}
                </Link>
            )}
        </Container>
    </>
);

const GenresView = (props: { genres: IGenre[] }) => (
    <>
        <Link className='btn btn-primary' to='/genres/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.genres.map(genre =>
                <Link className='btn btn-light' style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/genres/edit/' + genre.id}>
                    {genre.name}
                </Link>
            )}
        </Container>
    </>
);

const FormatView = (props: { formats: IFormat[] }) => (
    <>
        <Link className='btn btn-primary' to='/formats/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.formats.map(format =>
                <Link className='btn btn-light' style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/formats/edit/' + format.id}>
                    {format.name}
                </Link>
            )}
        </Container>
    </>
);

const WorkTypeView = (props: { workTypes: IWorkType[] }) => (
    <>
        <Link className='btn btn-primary' to='/worktypes/add' style={{ marginTop: '2rem' }}>Add</Link>
        <Container className="d-inline-flex flex-wrap">
            {props.workTypes.map(workType =>
                <Link className='btn btn-light' style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/worktypes/edit/' + workType.id}>
                    {workType.name}
                </Link>
            )}
        </Container>
    </>
);

const AdminView = () => {
    const appState = useContext(AppContext);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });
    const [view, setView] = useState('Works');
    const [works, setWorks] = useState([] as IWork[]);
    const [characters, setCharacters] = useState([] as ICharacter[]);
    const [persons, setPersons] = useState([] as IPerson[]);
    const [statuses, setStatuses] = useState([] as IStatus[]);
    const [roles, setRoles] = useState([] as IRole[]);
    const [genres, setGenres] = useState([] as IGenre[]);
    const [formats, setFormats] = useState([] as IFormat[]);
    const [workTypes, setWorkTypes] = useState([] as IWorkType[]);

    const loadData = async () => {
        let workResult = await BaseService.getAll<IWork>('/works', appState.token!);
        let charResult = await BaseService.getAll<ICharacter>('/characters', appState.token!);
        let personResult = await BaseService.getAll<IPerson>('/persons', appState.token!);
        let statusResult = await BaseService.getAll<IStatus>('/statuses', appState.token!);
        let roleResult = await BaseService.getAll<IRole>('/roles', appState.token!);
        let genreResult = await BaseService.getAll<IGenre>('/genres', appState.token!);
        let formatResult = await BaseService.getAll<IFormat>('/formats', appState.token!);
        let workTypeResult = await BaseService.getAll<IWorkType>('/worktypes', appState.token!);

        if (workResult.ok && workResult.data && charResult.ok && charResult.data && personResult.ok &&
            personResult.data && roleResult.ok && roleResult.data && genreResult.ok && genreResult.data &&
            formatResult.ok && formatResult.data && workResult.ok && workTypeResult.data && statusResult.ok &&
            statusResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setWorks(workResult.data);
            setCharacters(charResult.data);
            setPersons(personResult.data);
            setStatuses(statusResult.data);
            setRoles(roleResult.data);
            setGenres(genreResult.data)
            setFormats(formatResult.data);
            setWorkTypes(workTypeResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: workResult.statusCode });
        }
    }


    useEffect(() => {
        loadData();
    }, []);

    if (appState.roles !== null && appState.roles.find(role => role === 'Admin') === undefined) return <Page404 />;

    return (
        appState.roles.find(role => role === 'Admin') !== undefined ? <>
            <Container>

                <Row style={{ marginLeft: '0rem' }}><Card.Title>Menu</Card.Title></Row>
                <Row style={{ marginLeft: '0rem' }}><Card.Subtitle className="mb-2 text-muted">Select what to display</Card.Subtitle></Row>

                <Row>
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Works') }}>Works</button>
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Characters') }}>Characters</button>
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Persons') }}>Persons</button><br />
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Statuses') }}>Statuses</button><br />
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Roles') }}>Roles</button><br />
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Genres') }}>Genres</button><br />
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Formats') }}>Formats</button><br />
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => { setView('Work Types') }}>Work Types</button>
                </Row>
                {view === "Works" ? <WorkView works={works} /> : (null)}
                {view === "Characters" ? <CharacterView characters={characters} /> : (null)}
                {view === "Persons" ? <PersonView persons={persons} /> : (null)}
                {view === "Statuses" ? <StatusView statuses={statuses} /> : (null)}
                {view === "Roles" ? <RolesView roles={roles} /> : (null)}
                {view === "Genres" ? <GenresView genres={genres} /> : (null)}
                {view === "Formats" ? <FormatView formats={formats} /> : (null)}
                {view === "Work Types" ? <WorkTypeView workTypes={workTypes} /> : (null)}
            </Container>
        </>
            :
            <Page404 />

    )
}

export default AdminView;