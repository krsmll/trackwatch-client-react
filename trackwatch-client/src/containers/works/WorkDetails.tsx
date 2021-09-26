import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { IWork } from "../../dto/IWork";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";

import { Card, Container, Row } from 'react-bootstrap';
import { AppContext } from "../../context/AppContext";
import { IRouteId } from "../../types/IRouteId";
import { ICharacter } from "../../dto/ICharacter";
import { IWorkCharacter } from "../../dto/IWorkCharacter";
import noImage from "../../assets/walter.png";
import { IWorkGenre } from "../../dto/IWorkGenre";
import { IWorkInListToAdd } from "../../dto/IWorkInList";
import { IWatchList } from "../../dto/IWatchList";
import { IStatus } from "../../dto/IStatus";
import moment from "moment";


const WorkGenres = (props: { workGenres: IWorkGenre[] }) => {
    if (props.workGenres.length === 0) return (null);
    return (
        <span>
            <b>Genres:</b> { props.workGenres.map(wg => wg.genre.name).join(", ")}
        </span>
    )
}

const WorkCard = (props: { work: IWork }) => {
    if (Object.keys(props.work).length !== 0) {
        return (
            <Card style={{ maxWidth: '14rem', margin: '1rem' }}>
                <Card.Img variant="top" style={{ maxWidth: '18rem' }} src={props.work.coverPictures.length !== 0 ? props.work.coverPictures[0].url : ""} />
                <Card.Body>
                    <Card.Title>{props.work.title}</Card.Title>
                    <Card.Text>
                        <span className="font-weight-light">{props.work.workType.name} - {props.work.format.name}</span>
                    </Card.Text>
                    <Card.Text style={{ marginTop: '0.5rem' }}>
                        <b>Episodes:</b> {props.work.episodeNumber} <br />
                        <b>Start Date:</b> {props.work.releaseDate !== null ? props.work.releaseDate : "-"} <br />
                        <b>Finish Date:</b> {props.work.releaseDate !== null ? props.work.finishDate : "-"} <br />
                        <WorkGenres workGenres={props.work.workGenres} />
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    } else { return null }
};

const WorkCharacters = (props: { work: IWork }) => {
    if (!props.work.workCharacters) return (null);

    let characters: ICharacter[] = props.work.workCharacters.map(
        (workCharacter: IWorkCharacter) => workCharacter.character
    );

    return characters.length !== 0 ? (
        <div>
            <hr />
            <h4>Characters</h4>
            <Container className="d-inline-flex flex-wrap">
                {characters.map(workCharacter =>
                    <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/characters/' + workCharacter.id}>
                        <img className="rounded" style={{ maxWidth: '10rem', minWidth: '10rem' }} src={workCharacter.pictures.length !== 0 ? workCharacter.pictures[0]!.url : noImage}></img><br />
                        {workCharacter.lastName !== null ? workCharacter.firstName + " " + workCharacter.lastName : workCharacter.firstName}
                    </Link>
                )}
            </Container>
        </div>
    ) : (null);
}

const RelatedWorks = (props: { work: IWork }) => {
    if (!props.work.relatedWorks && !props.work.relationOfWorks) return (null);

    let relations: IWork[] = [];
    if (props.work.relatedWorks) relations = [...relations, ...props.work.relatedWorks.map(
        relation => relation.relatedWork
    )];
    if (props.work.relationOfWorks) relations = [...relations, ...props.work.relationOfWorks.map(
        relation => relation.work
    )];

    return relations.length !== 0 ? (
        <div>
            <hr />
            <h4>Relations</h4>
            <Container className="d-inline-flex flex-wrap">
                {relations.map(relation =>
                    <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/works/' + relation.id}>
                        <img className="rounded" style={{ maxWidth: '10rem' }} src={relation.coverPictures[0].url}></img><br />
                        {relation.title}
                    </Link>
                )}
            </Container>
        </div>
    ) : (null);
}

const WorkInformation = (props: { work: IWork }) => {
    return (
        <div style={{ margin: '1rem' }}>
            { props.work.releaseDate !== null ? <span><b>Release Date:</b> {props.work.releaseDate}</span> : ''}
            { props.work.finishDate !== null ? <span><b>Finish Date:</b> {props.work.finishDate}</span> : ''}
            <span><h4>Description:</h4> {props.work.description}</span>
            <RelatedWorks work={props.work} key={props.work.id} />
            <WorkCharacters work={props.work} key={props.work.id} />
        </div>
    )
};

const AddToListView = (props: { work: IWork, watchList: IWatchList, statuses: IStatus[], token: string | undefined }) => {

    let wil = props.watchList.workInLists.find(wil => wil.work.id === props.work.id);

    const [workInList, setWorkInList] = useState({
        watchListId: props.watchList.id,
        workId: props.work.id,
        statusId: wil !== undefined ? wil.statusId : '',
        started: wil !== undefined ? moment(wil.started).toISOString() : moment(moment.now()).toISOString(),
        finished: wil !== undefined ? moment(wil.finished).toISOString() : moment(moment.now()).toISOString(),
        notes: wil !== undefined ? wil.notes : '',
        rating: wil !== undefined ? wil.rating : 0,
        episodesWatched: wil !== undefined ? wil.episodesWatched : 0
    } as IWorkInListToAdd);


    const submitClicked = async (e: Event) => {
        e.preventDefault()
        if (wil !== undefined) {
            let toSend = { ...workInList, id: wil.id } as any
            if (toSend.rating > props.watchList.ratingScale.maxValue) { toSend = { ...toSend, rating: props.watchList.ratingScale.maxValue } }
            else if (toSend.rating < props.watchList.ratingScale.minValue) { toSend = { ...toSend, rating: props.watchList.ratingScale.minValue } }
            await BaseService.put(wil.id, toSend, '/workinlists', props.token);
        } else {
            console.log(workInList);
            
            await BaseService.post(workInList, '/workinlists', true, props.token);
        }
    }

    return (
        <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
            <div className="row">
                <div className="col-md-6">
                    <section>
                        <hr />
                        <div className="form-group">
                            <label htmlFor="Dropdown_Status">Status: </label>
                            <select id='Dropdown_Status' value={workInList.statusId} onChange={e => setWorkInList({ ...workInList, statusId: e.target.value })}>
                                {props.statuses.map(status => <option value={status.id}>{status.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Date_Start">Started:</label>
                            <input id='Date_Start' name='Date.Start' type='datetime-local' value={workInList.started!.substring(0, workInList.started!.length - 1)} onChange={e => setWorkInList({ ...workInList, started: moment(e.target.value).toISOString() })}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Date_End">Finished:</label>
                            <input id='Date_End' name='Date.End' type='datetime-local' value={workInList.finished !== undefined ? workInList.finished.substring(0, workInList.finished!.length - 1) : ''} onChange={e => setWorkInList({ ...workInList, finished: moment(e.target.value).toISOString() })}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Rating">Rating:</label>
                            <input id='Rating' name='Rating' type='number' value={workInList.rating} onChange={e => setWorkInList({ ...workInList, rating: parseInt(e.target.value) })}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Episodes_Watched">Episodes Watched:</label>
                            <input id='Episodes_Watched' name='Episodes.Watched' type='number' value={workInList.episodesWatched} onChange={e => setWorkInList({ ...workInList, episodesWatched: parseInt(e.target.value) })}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Rating">Notes:</label>
                            <input id='Notes' name='Notes' type='text' value={workInList.notes} onChange={e => setWorkInList({ ...workInList, notes: e.target.value })}></input>
                        </div>
                        <div className="form-group">
                            <button onClick={(e) => submitClicked(e.nativeEvent)} type="submit" className="btn btn-primary">{wil !== undefined ? "Edit" : "Add to List"}</button>
                        </div>
                    </section>
                </div>
            </div>
        </form>
    );
}

const WorkDetails = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [work, setWork] = useState({} as IWork);
    const [watchList, setWatchList] = useState({} as IWatchList)
    const [statuses, setStatuses] = useState([] as IStatus[])
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });
    const [addToListView, setAddToListView] = useState(false);

    const loadData = async () => {
        let workResult = await BaseService.get<IWork>(id, '/works', appState.token!);
        let watchListResult = await BaseService.get<IWatchList>(appState.username!, '/watchlists/user', appState.token!)
        let statusResult = await BaseService.getAll<IStatus>('/statuses', appState.token!)

        if (workResult.ok && workResult.data && watchListResult.ok && watchListResult.data && statusResult.ok && statusResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setWatchList(watchListResult.data)
            setStatuses(statusResult.data)
            setWork(workResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: workResult.statusCode });
        }
    }


    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {

    }, [addToListView]);

    return (
        <>
            <Container>
                <Row>
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => {
                        setAddToListView(!addToListView);
                    }}>
                        {addToListView ? "Show Details" : "Watch List Editor"}
                    </button>
                </Row>
                <Row>
                    <WorkCard work={work} key={work.id} />
                    {
                        addToListView ? <AddToListView work={work} watchList={watchList} statuses={statuses} token={appState.token === null ? undefined : appState.token} /> : <WorkInformation work={work} key={work.id} />
                    }

                </Row>
            </Container>
            <Loader {...pageStatus} />
        </>
    );
}

export default WorkDetails;
