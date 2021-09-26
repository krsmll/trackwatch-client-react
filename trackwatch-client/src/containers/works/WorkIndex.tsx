import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { IWork } from "../../dto/IWork";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";

import { Card, Container, Row } from 'react-bootstrap';
import { AppContext } from "../../context/AppContext";
import { IGenre } from "../../dto/IGenre";
import { IWorkType } from "../../dto/IWorkType";
import { IFormat } from "../../dto/IFormat";


const WorkCard = (props: { work: IWork }) => (
    <Card style={{ maxWidth: '14rem', margin: '1rem' }}>
        <Link to={"/works/" + props.work.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card.Img variant="top" style={{ maxWidth: '18rem' }} src={props.work.coverPictures.length !== 0 ? props.work.coverPictures[0].url : ""} />
            <Card.Body>
                <Card.Title>{props.work.title}</Card.Title>
                <Card.Text>
                    <span>{props.work.workGenres.length !== 0 ? Array.prototype.map.call(props.work.workGenres, workGenre => workGenre.genre.name).join(", ") : ""} </span>
                </Card.Text>
                <Card.Text style={{ marginTop: '0.5rem' }}>
                    <span className="font-weight-light">{props.work.workType.name} - {props.work.format.name}</span>
                </Card.Text>
            </Card.Body>
        </Link>
    </Card>
);

const Works = (props: { works: IWork[], filters: { formatId: string, genreId: string, typeId: string } }) => {
    let list = props.works;
    if (props.filters.formatId !== '') {
        list = list.filter(w => w.format.id === props.filters.formatId)
    }
    if (props.filters.typeId !== '') {
        list = list.filter(w => w.workType.id === props.filters.typeId)
    }
    if (props.filters.genreId !== '') {
        list = list.filter(w => w.workGenres.find(wg => wg.genre.id === props.filters.genreId) !== undefined)
    }

    return (
        list.length !== 0 ?
            <>
                <Container className="d-inline-flex flex-wrap">
                    {
                        list.map(w =>
                            <WorkCard work={w} />
                        )
                    }
                </Container>
            </>
            : null
    )
}

const WorkIndex = () => {
    const appState = useContext(AppContext);
    const [works, setWorks] = useState([] as IWork[]);
    const [genres, setGenres] = useState([] as IGenre[]);
    const [formats, setFormats] = useState([] as IFormat[]);
    const [workTypes, setWorkTypes] = useState([] as IWorkType[]);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [workTypeFilter, setWorkTypeFilter] = useState('');
    const [formatFilter, setFormatFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');

    const loadData = async () => {
        let result = await BaseService.getAll<IWork>('/works', appState.token!);
        let genreResult = await BaseService.getAll<IGenre>('/genres', appState.token!);
        let formatResult = await BaseService.getAll<IFormat>('/formats', appState.token!);
        let workTypeResult = await BaseService.getAll<IWorkType>('/worktypes', appState.token!);

        if (result.ok && result.data && genreResult.ok && genreResult.data && formatResult.ok && formatResult.data && workTypeResult.ok && workTypeResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setWorks(result.data);
            setGenres(genreResult.data)
            setFormats(formatResult.data)
            setWorkTypes(workTypeResult.data)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: result.statusCode });
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <Container className="d-inline-flex flex-wrap">
                <Row>
                    <form>
                        <label htmlFor="Dropdown_Type">Type:</label>
                        <select id='Dropdown_Type' value={workTypeFilter} onChange={e => setWorkTypeFilter(e.target.value)}>
                            <option value={''}>Any</option>
                            {workTypes.map(w =>
                                <option value={w.id}>{w.name}</option>
                            )}
                        </select>
                        <label htmlFor="Dropdown_Format">Format:</label>
                        <select id='Dropdown_Format' value={formatFilter} onChange={e => setFormatFilter(e.target.value)}>
                            <option value={''}>Any</option>
                            {formats.map(f =>
                                <option value={f.id}>{f.name}</option>
                            )}
                        </select>
                        <label htmlFor="Dropdown_Genre">Genre:</label>
                        <select id='Dropdown_Genre' value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                            <option value={''}>Any</option>
                            {genres.map(g => <option value={g.id}>{g.name}</option>)}
                        </select>
                    </form>
                </Row>
                <Row>
                    <Works works={works} filters={{ typeId: workTypeFilter, genreId: genreFilter, formatId: formatFilter }} />
                </Row>
            </Container>
            <Loader {...pageStatus} />
        </>
    );
}

export default WorkIndex;
