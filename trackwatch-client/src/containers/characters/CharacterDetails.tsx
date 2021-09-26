import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { IWork } from "../../dto/IWork";
import { BaseService } from "../../services/base-service";
import { EPageStatus } from "../../types/EPageStatus";

import { Card, Container, Row } from 'react-bootstrap';
import { AppContext } from "../../context/AppContext";
import { IRouteId } from "../../types/IRouteId";
import { ICharacter } from "../../dto/ICharacter";
import noImage from "../../assets/walter.png";
import { IWorkAuthor } from "../../dto/IWorkAuthor";

import { IFavCharacterList } from "../../dto/IFavCharacterList";

const CharacterCard = (props: { character: ICharacter }) => {
    if (Object.keys(props.character).length !== 0) {
        return (
            <Card style={{ maxWidth: '18rem', margin: '1rem' }}>
                <Card.Img variant="top" style={{ maxWidth: '18rem' }} src={props.character.pictures.length !== 0 ? props.character.pictures[0].url : noImage} />
                <Card.Body>
                    <Card.Title>{props.character.lastName !== null ? props.character.firstName + " " + props.character.lastName : props.character.firstName}</Card.Title>
                    <Card.Text style={{ marginTop: '0.5rem' }}>
                        <b>Birthdate:</b> {props.character.birthdate !== null ? props.character.birthdate : "Unknown"} <br />
                        <b>Age:</b> {props.character.age !== null ? props.character.age : "Unknown"} <br />
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    } else { return null }
};

const CharacterAuthors = (props: { character: ICharacter }) => {
    if (!props.character.characterPersons) return (null);

    let persons: IWorkAuthor[] = props.character.characterPersons.map(
        workCharacter => workCharacter.workAuthor
    );

    return persons.length !== 0 ? (
        <div>
            <hr />
            <h4>Persons</h4>
            <Container className="d-inline-flex flex-wrap">
                {persons.map(workAuthor =>
                    <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/persons/' + workAuthor.person.id}>
                        <img className="rounded" style={{ maxWidth: '10rem', minWidth: '10rem' }} src={workAuthor.person.personPictures.length !== 0 ? workAuthor.person.personPictures[0]!.url : noImage}></img><br />
                        {workAuthor.person.firstName + " " + workAuthor.person.lastName} <br />
                        <span className="font-weight-light"> {
                            workAuthor.workAuthorRoles.map(workAuthorRole => workAuthorRole.role.name).join(", ")
                        } </span>
                    </Link>
                )}
            </Container>
        </div>
    ) : (null);
}

const RelatedWorks = (props: { character: ICharacter }) => {
    if (!props.character.workCharacters) return (null)

    let relations: IWork[] = props.character.workCharacters.map(
        relation => relation.work
    );

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

const CharacterInformation = (props: { character: ICharacter }) => (
    <div style={{ margin: '1rem' }}>
        <span><h4>Description:</h4> {props.character.description}</span>
        <RelatedWorks character={props.character} key={props.character.id} />
        <CharacterAuthors character={props.character} key={props.character.id} />
    </div >
);


const CharacterDetails = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [character, setCharacter] = useState({} as ICharacter);
    const [favCharList, setFavCharList] = useState({ id: '', appUserId: '', charactersInList: [] } as IFavCharacterList)
    const [favorited, setFavorited] = useState(false)
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = async () => {
        let charResult = await BaseService.get<ICharacter>(id, '/characters', appState.token!);
        let favResult = await BaseService.get<IFavCharacterList>(appState.username, '/favcharacterlists/user', appState.token!);

        if (charResult.ok && charResult.data && favResult.ok && favResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setCharacter(charResult.data);
            setFavCharList(favResult.data);
            setFavorited(favResult.data.charactersInList.find(c => c.characterId === charResult.data!.id) !== undefined)
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: charResult.statusCode });
        }
    }

    const buttonPressed = async (favorited: boolean) => {
        let charInList = favCharList.charactersInList.find(charInList => charInList.characterId === character.id)
        let usedToken = appState.token === null ? undefined : appState.token;

        if (!favorited && charInList !== undefined) {
            await BaseService.delete(charInList!.id, '/characterinlists', usedToken)
        }
        if (favorited && charInList === undefined) {
            await BaseService.post(
                {
                    "characterId": character.id,
                    "favCharacterListId": favCharList.id
                }, '/characterinlists', true, usedToken
            )
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        buttonPressed(favorited)
    }, [favorited]);

    return (
        <>
            <Container>
                <Row>
                    <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={() => {
                        setFavorited(!favorited);
                    }}>
                        {favorited ? "Unfavorite" : "Favorite"}
                    </button>
                </Row>
                <Row>
                    <CharacterCard character={character} key={character.id} />
                    <CharacterInformation character={character} key={character.id} />
                </Row>
            </Container>
            <Loader {...pageStatus} />
        </>
    );
}

export default CharacterDetails;
