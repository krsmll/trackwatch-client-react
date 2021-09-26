import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IFormat } from "../../dto/IFormat";
import { IGenre } from "../../dto/IGenre";
import { IWork } from "../../dto/IWork";
import { IWorkGenre } from "../../dto/IWorkGenre";
import { IWorkRelation } from "../../dto/IWorkRelation";
import { IWorkType } from "../../dto/IWorkType";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IRouteId } from "../../types/IRouteId";

const WorkEdit = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [work, setWork] = useState({} as IWork);
    const [allWorks, setAllWorks] = useState([] as IWork[])
    const [workTypes, setWorkTypes] = useState([] as IWorkType[]);
    const [formats, setFormats] = useState([] as IFormat[]);
    const [genres, setGenres] = useState([] as IGenre[]);
    const [relatedWorks, setRelatedWorks] = useState([] as string[]);
    const [selectedGenres, setSelectedGenres] = useState([] as string[]);
    const [pictureUrl, setPictureUrl] = useState('')
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const [deleteClicked, setDeleteClicked] = useState(false);
    const [genresEdited, setGenresEdited] = useState(false);
    const [relationsEdited, setRelationsEdited] = useState(false);

    const loadData = async () => {
        let workResult = await BaseService.get<IWork>(id, '/works', appState.token!);
        let allWorksResult = await BaseService.getAll<IWork>('/works', appState.token!);
        let workTypesResult = await BaseService.getAll<IWorkType>('/worktypes', appState.token!);
        let genreResult = await BaseService.getAll<IGenre>('/genres', appState.token!);
        let formatsResult = await BaseService.getAll<IFormat>('/formats', appState.token!);

        if (workResult.ok && workResult.data && allWorksResult.ok && allWorksResult.data && workTypesResult.ok && workTypesResult.data && genreResult.ok && genreResult.data && formatsResult.ok && formatsResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setWork(workResult.data);
            setPictureUrl(workResult.data.coverPictures.length > 0 ? workResult.data.coverPictures[0].url : '');
            setAllWorks(allWorksResult.data)
            setWorkTypes(workTypesResult.data);
            setGenres(genreResult.data)
            setFormats(formatsResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: workResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        if (relationsEdited) {
            relatedWorks.forEach(async id => {
                if (work.relatedWorks.find(w => w.relatedWork.id === id) === undefined && work.relationOfWorks.find(w => w.work.id === id) === undefined) {
                    await BaseService.post<IWorkRelation>(
                        {
                            'workId': work.id,
                            'relatedWorkId': id
                        }, "/workrelations", true, appState!.token!
                    )
                }
            });

            work.relatedWorks.forEach(async w => {
                if (relatedWorks.find(it => it === w.relatedWork.id) === undefined) {
                    await BaseService.delete(w.id, '/workrelations', appState!.token!)
                }
            });

            work.relationOfWorks.forEach(async w => {
                if (relatedWorks.find(it => it === w.work.id) === undefined) {
                    await BaseService.delete(w.id, '/workrelations', appState!.token!)
                }
            });

            setRelationsEdited(false);
        }

        if (genresEdited) {
            selectedGenres.forEach(async id => {
                if (work.workGenres.find(it => it.genre.id === id) === undefined) {
                    await BaseService.post<IWorkGenre>(
                        {
                            'genreId': id,
                            'workId': work.id
                        }, "/workgenres", true, appState!.token!
                    )
                }
            });

            work.workGenres.forEach(async wg => {
                if (selectedGenres.find(it => it === wg.genre.id) === undefined) {
                    await BaseService.delete(wg.id, '/workgenres', appState!.token!)
                }
            });

            setGenresEdited(false);
        }

        if (work.coverPictures.length > 0) {
            if (pictureUrl !== work.coverPictures[0].url) {
                await BaseService.put(work.coverPictures[0].id, {
                    'id': work.coverPictures[0].id,
                    'workId': work.id,
                    'url': pictureUrl
                }, '/coverpictures', appState.token!)
            }
        }

        await BaseService.put(work.id, {
            'id': work.id,
            'formatId': work.formatId,
            'workTypeId': work.workTypeId,
            'title': work.title,
            'description': work.description,
            'releaseDate': work.releaseDate,
            'finishDate': work.finishDate,
            'episodeNumber': work.episodeNumber
        }, '/works', appState.token!);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        Object.keys(work).length !== 0 && appState.roles.find(it => it === "Admin") !== undefined ?
            deleteClicked ?
                <>
                    <h3>Are you sure you want to delete "{work.title}"?</h3>
                    <button onClick={ async () => {
                       await BaseService.delete(work.id, '/works', appState.token!);
                       <Redirect to='/manage' />
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
                                        <label htmlFor="Dropdown_Format">Format: </label><br />
                                        <select id='Dropdown_Format' value={work.formatId} onChange={e => setWork({ ...work, formatId: e.target.value })}>
                                            {formats.map(format => <option value={format.id}>{format.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Dropdown_WorkType">Work Type: </label><br />
                                        <select id='Dropdown_WorkType' value={work.workTypeId} onChange={e => setWork({ ...work, workTypeId: e.target.value })}>
                                            {workTypes.map(workType => <option value={workType.id}>{workType.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Title">Title: </label><br />
                                        <input id='Title' name='Notes' type='text' value={work.title} onChange={e => setWork({ ...work, title: e.target.value })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Description">Description: </label><br />
                                        <input id='Description' name='Description' type='text' value={work.description} onChange={e => setWork({ ...work, description: e.target.value })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Episode_Number">Episode Number: </label><br />
                                        <input id='Episode_Number' name='Episode.Number' type='number' value={work.episodeNumber.toString()} onChange={e => setWork({ ...work, episodeNumber: parseInt(e.target.value) })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Date_Release">Release Date: </label><br />
                                        <input id='Date_Release' name='Date.Release' type='datetime-local' value={work.releaseDate !== null ? work.releaseDate!.substring(0, work.releaseDate!.length - 1) : ""} onChange={e => setWork({ ...work, releaseDate: moment(e.target.value).toISOString() })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Date_Finish">Finish Date: </label><br />
                                        <input id='Date_Finish' name='Date.Finish' type='datetime-local' value={work.finishDate !== null ? work.finishDate!.substring(0, work.finishDate!.length - 1) : ""} onChange={e => setWork({ ...work, finishDate: moment(e.target.value).toISOString() })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Pic_URL">Picture URL: </label><br />
                                        <input id='Pic_URL' name='Pic.URL' type='text' value={pictureUrl} onChange={e => setPictureUrl(e.target.value)}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Dropdown_RelatedWorks">Related Works: </label><br />
                                        <select id='Dropdown_RelatedWorks' onChange={e => { setRelatedWorks(Array.from(e.target.selectedOptions, option => option.value)) }} multiple>
                                            {allWorks.sort().map(
                                                w => w.id !== work.id ?
                                                    (work.relatedWorks.find(it => it.relatedWork.id === w.id) !== undefined ||
                                                        work.relationOfWorks.find(it => it.work.id === w.id) !== undefined) ?
                                                        <option value={w.id} selected>{w.title}</option> :
                                                        <option value={w.id}>{w.title}</option> :
                                                    (null)
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Dropdown_Genres">Related Works: </label><br />
                                        <select id='Dropdown_Genres' onChange={e => setSelectedGenres(Array.from(e.target.selectedOptions, option => option.value))} multiple>
                                            {genres.sort().map(
                                                genre => work.workGenres.find(g => g.genre.id === genre.id) ?
                                                    <option value={genre.id} selected>{genre.name}</option> :
                                                    <option value={genre.id}>{genre.name}</option>
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

export default WorkEdit;