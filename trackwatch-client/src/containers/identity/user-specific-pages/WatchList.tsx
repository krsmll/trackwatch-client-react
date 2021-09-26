import React, { useContext, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { AppContext } from "../../../context/AppContext";
import { IWatchList } from "../../../dto/IWatchList";
import { IWorkInList } from "../../../dto/IWorkInList";
import { BaseService } from "../../../services/base-service";
import { EPageStatus } from "../../../types/EPageStatus";
import { IRouteUsername } from "../../../types/IRouteId";


const Works = (props: { works: IWorkInList[], maxRating: number, title: string, filters: { formatId: string, genreId: string, typeId: string} }) => {

    console.log(props.filters);
    

    let list = props.works;
    if (props.filters.formatId !== '') {
        list = list.filter(w => w.work.format.id === props.filters.formatId)
    }
    if (props.filters.typeId !== '') {
        list = list.filter(w => w.work.workType.id === props.filters.typeId)
    }
    if (props.filters.genreId !== '') {
        list = list.filter(w => w.work.workGenres.find(wg => wg.genre.id === props.filters.genreId) !== undefined)
    }

    return (
        list.length !== 0 ?
            <>
                <h4>{props.title}</h4>
                <Container className="d-inline-flex flex-wrap">
                    {
                        list.map(w =>
                            <Link title={w.notes} style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/works/' + w.work.id}>
                                <img className="rounded" style={{ maxWidth: '10rem' }} src={w.work.coverPictures[0].url}></img><br />
                                {w.work.title}<br />
                                {w.rating}
                            </Link>
                        )
                    }
                </Container>
            </>
            : null
    )
}


const WatchList = () => {
    const appState = useContext(AppContext);
    const { username } = useParams() as IRouteUsername;
    const [watchList, setWatchList] = useState({} as IWatchList);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });
    const [workTypeFilter, setWorkTypeFilter] = useState('');
    const [formatFilter, setFormatFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');

    const loadData = async () => {
        let result = await BaseService.get<IWatchList>(username, '/watchlists/user', appState.token!);

        if (result.ok && result.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setWatchList(result.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: result.statusCode });
        }
    }

    useEffect(() => {
        loadData();
    }, []);


    return (
        watchList.workInLists ? <>
            <Container>
                <Row><h4>Filters:</h4></Row>
                <Row>
                    <form>
                        <label htmlFor="Dropdown_Type">Type:</label>
                        <select id='Dropdown_Type' value={workTypeFilter} onChange={e => setWorkTypeFilter(e.target.value)}>
                            <option value={''}>Any</option>
                            {watchList.workInLists.map(wil =>
                                <option value={wil.work.workType.id}>{wil.work.workType.name}</option>
                            )}
                        </select>
                        <label htmlFor="Dropdown_Format">Format: </label>
                        <select id='Dropdown_Format' value={formatFilter} onChange={e => setFormatFilter(e.target.value)}>
                            <option value={''}>Any</option>
                            {watchList.workInLists.map(wil =>
                                <option value={wil.work.format.id}>{wil.work.format.name}</option>
                            )}
                        </select>
                        <label htmlFor="Dropdown_Genre">Genre: </label>
                        <select id='Dropdown_Genre' value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                            <option value={''}>Any</option>
                            {watchList.workInLists.map(wil =>
                                wil.work.workGenres.map(wg => <option value={wg.genre.id}>{wg.genre.name}</option>)
                            )}
                        </select>
                    </form>
                </Row>
                <Row><Works works={watchList.workInLists.filter(w => w.status.name === "In Progress").sort((one, two) => (one.rating > two.rating ? -1 : 1))} maxRating={watchList.ratingScale.maxValue} title='In Progress' filters={{typeId: workTypeFilter, genreId: genreFilter, formatId: formatFilter }} /></Row>
                <Row><Works works={watchList.workInLists.filter(w => w.status.name === "Completed").sort((one, two) => (one.rating > two.rating ? -1 : 1))} maxRating={watchList.ratingScale.maxValue} title='Completed' filters={{typeId: workTypeFilter, genreId: genreFilter, formatId: formatFilter }} /></Row>
                <Row><Works works={watchList.workInLists.filter(w => w.status.name === "Paused").sort((one, two) => (one.rating > two.rating ? -1 : 1))} maxRating={watchList.ratingScale.maxValue} title='Paused' filters={{typeId: workTypeFilter, genreId: genreFilter, formatId: formatFilter }} /></Row>
                <Row><Works works={watchList.workInLists.filter(w => w.status.name === "Dropped").sort((one, two) => (one.rating > two.rating ? -1 : 1))} maxRating={watchList.ratingScale.maxValue} title='Dropped' filters={{typeId: workTypeFilter, genreId: genreFilter, formatId: formatFilter }} /></Row>
                <Row><Works works={watchList.workInLists.filter(w => w.status.name === "Planned").sort((one, two) => (one.rating > two.rating ? -1 : 1))} maxRating={watchList.ratingScale.maxValue} title='Planned' filters={{typeId: workTypeFilter, genreId: genreFilter, formatId: formatFilter }} /></Row>
            </Container>
            <Loader {...pageStatus} />
        </>
            :
            null
    );
}
export default WatchList