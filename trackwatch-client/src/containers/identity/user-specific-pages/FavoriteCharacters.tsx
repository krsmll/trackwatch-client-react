import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../components/Loader";

import { BaseService } from "../../../services/base-service";
import { EPageStatus } from "../../../types/EPageStatus";
import { Container } from 'react-bootstrap';
import { AppContext } from "../../../context/AppContext";
import { IFavCharacterList } from "../../../dto/IFavCharacterList";
import { ICharacter } from "../../../dto/ICharacter";
import { IRouteUsername } from "../../../types/IRouteId";

import blankImage from "../../../assets/walter.png";


const Character = (props: { character: ICharacter }) => (
    <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/characters/' + props.character.id}>
        <img className="rounded" style={{ maxWidth: '14rem', minWidth: '14rem' }} src={props.character.pictures.length !== 0 ? props.character.pictures[0]!.url : blankImage}></img><br />
        {props.character.lastName !== null ? props.character.firstName + " " + props.character.lastName : props.character.firstName}
        <span className="font-weight-light"> {
            props.character.characterPersons.map(it => it.workAuthor.workAuthorRoles
                .map(workAuthorRole => workAuthorRole.role.name)
            ).join(", ")
        } </span>
    </Link>
)

const FavoriteCharacters = () => {
    const appState = useContext(AppContext);
    const { username } = useParams() as IRouteUsername
    const [characterList, setCharacterList] = useState({ id: '', appUserId: '', charactersInList: [] } as IFavCharacterList);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = async () => {
        let result = await BaseService.get<IFavCharacterList>(username, '/favcharacterlists/user', appState.token!);
        console.log(result)

        if (result.ok && result.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setCharacterList(result.data);
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
                {characterList.charactersInList.map(characterInList =>
                    <Character character={characterInList.character} key={characterInList.character.id} />
                )}
            </Container>
            <Loader {...pageStatus} />
        </>
    );
}

export default FavoriteCharacters;
