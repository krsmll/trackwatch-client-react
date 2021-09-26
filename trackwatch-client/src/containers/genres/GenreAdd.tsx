import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { IGenre } from "../../dto/IGenre";
import { BaseService } from "../../services/base-service";
import Page404 from "../Page404";

const GenreAdd = () => {
    const appState = useContext(AppContext);
    const [genre, setGenre] = useState({
        'name': '',
        'description': ''
    } as IGenre);

    const submitClicked = async (e: Event) => {
        e.preventDefault()

        await BaseService.post({
            'name': genre.name,
            'description': genre.description
        }, '/genres', true, appState.token!);
    }

    useEffect(() => {
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
                                        <label htmlFor="Title">Name: </label><br />
                                        <input id='Title' name='Notes' type='text' value={genre.name} onChange={e => setGenre({ ...genre, name: e.target.value })}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Description">Description: </label><br />
                                        <input id='Description' name='Description' type='text' value={genre.description} onChange={e => setGenre({ ...genre, description: e.target.value })}></input>
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
};
export default GenreAdd;