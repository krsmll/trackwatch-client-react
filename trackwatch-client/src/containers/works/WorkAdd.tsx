import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { ICoverPicture } from "../../dto/ICoverPicture";
import { IFormat } from "../../dto/IFormat";
import { IGenre } from "../../dto/IGenre";
import { IWork } from "../../dto/IWork";
import { IWorkGenre } from "../../dto/IWorkGenre";
import { IWorkRelation } from "../../dto/IWorkRelation";
import { IWorkType } from "../../dto/IWorkType";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import Page404 from "../Page404";

const WorkAdd = () => {
    const appState = useContext(AppContext);
    const [work, setWork] = useState({
        'formatId': '',
        'workTypeId': '',
        'title': '',
        'description': '',
        'releaseDate': '',
        'finishDate': '',
        'episodeNumber': 0
    } as IWork);
    const [pictureUrl, setPictureUrl] = useState('');
    const [allWorks, setAllWorks] = useState([] as IWork[])
    const [workTypes, setWorkTypes] = useState([] as IWorkType[]);
    const [formats, setFormats] = useState([] as IFormat[]);
    const [genres, setGenres] = useState([] as IGenre[]);
    const [relatedWorks, setRelatedWorks] = useState([] as string[]);
    const [selectedGenres, setSelectedGenres] = useState([] as string[]);

    const [genresEdited, setGenresEdited] = useState(false);
    const [relationsEdited, setRelationsEdited] = useState(false);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });


    const loadData = async () => {
        let allWorksResult = await BaseService.getAll<IWork>('/works', appState.token!);
        let workTypesResult = await BaseService.getAll<IWorkType>('/worktypes', appState.token!);
        let genreResult = await BaseService.getAll<IGenre>('/genres', appState.token!);
        let formatsResult = await BaseService.getAll<IFormat>('/formats', appState.token!);

        if (allWorksResult.ok && allWorksResult.data && workTypesResult.ok && workTypesResult.data && genreResult.ok && genreResult.data && formatsResult.ok && formatsResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setAllWorks(allWorksResult.data)
            setWorkTypes(workTypesResult.data);
            setGenres(genreResult.data)
            setFormats(formatsResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: allWorksResult.statusCode });
        }
    }

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        if (pictureUrl === '' || work.formatId === '' || work.workTypeId === '' || work.title === '') return;

        let obj = {
            'formatId': work.formatId,
            'workTypeId': work.workTypeId,
            'title': work.title,
            'description': work.description,
            'releaseDate': work.releaseDate,
            'finishDate': work.finishDate,
            'episodeNumber': work.episodeNumber
        }
        console.log(obj);


        let addResult = await BaseService.post<IWork>(obj, '/works', true, appState.token!);

        if (addResult.ok && addResult.data) {
            if (relationsEdited) {
                relatedWorks.forEach(async id => {
                    await BaseService.post<IWorkRelation>(
                        {
                            'workId': addResult.data!.id,
                            'relatedWorkId': id
                        }, "/workrelations", true, appState!.token!
                    )
                });

                setRelationsEdited(false);
            }

            if (genresEdited) {
                selectedGenres.forEach(async id => {
                    await BaseService.post<IWorkGenre>(
                        {
                            'genreId': id,
                            'workId': work.id
                        }, "/workgenres", true, appState!.token!
                    )
                });

                setGenresEdited(false);
            }

            let imgObj = {
                'workId': addResult.data.id,
                'url': pictureUrl,
            };
            console.log(imgObj);
            
            await BaseService.post<ICoverPicture>(imgObj, '/coverpictures', true, appState.token!)
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
                                    <label htmlFor="Dropdown_Format">Format: </label><br />
                                    <select id='Dropdown_Format' value={work.formatId} onChange={e => setWork({ ...work, formatId: Array.from(e.target.selectedOptions, option => option.value)[0] })}>
                                        <option value={''} selected>Please select</option>
                                        {formats.map(format => <option value={format.id}>{format.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Dropdown_WorkType">Work Type: </label><br />
                                    <select id='Dropdown_WorkType' value={work.workTypeId} onChange={e => setWork({ ...work, workTypeId: e.target.value })}>
                                        <option value={''} selected>Please select</option>
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
                                        {allWorks.sort().map(w =>
                                            <option value={w.id}>{w.title}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Dropdown_Genres">Related Works: </label><br />
                                    <select id='Dropdown_Genres' onChange={e => setSelectedGenres(Array.from(e.target.selectedOptions, option => option.value))} multiple>
                                        {genres.sort().map(
                                            genre =>
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
            </> : <Page404 />
    );
}
export default WorkAdd;