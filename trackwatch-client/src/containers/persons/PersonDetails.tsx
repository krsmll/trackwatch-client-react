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
import { ICharacterInList } from "../../dto/ICharacterInList";
import { IFetchResponse } from "../../types/IFetchResponse";
import { IPerson } from "../../dto/IPerson";


const PersonCard = (props: { person: IPerson }) => {
    if (Object.keys(props.person).length !== 0) {
        return (
            <Card style={{ maxWidth: '18rem', margin: '1rem' }}>
                <Card.Img variant="top" style={{ maxWidth: '18rem' }} src={props.person.personPictures.length !== 0 ? props.person.personPictures[0].url : noImage} />
                <Card.Body>
                    <Card.Title>{props.person.firstName + " " + props.person.lastName}</Card.Title>
                    <Card.Text style={{ marginTop: '0.5rem' }}>
                        <b>Nationality:</b> {props.person.nationality !== null ? props.person.nationality : "-"} <br />
                        <b>Birthdate:</b> {props.person.birthdate !== null ? props.person.birthdate : "-"}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    } else { return null }
};

const PersonWorks = (props: { person: IPerson }) => {
    if (!props.person.workAuthors) return (null);

    return props.person.workAuthors.length !== 0 ? (
        <div>
            <hr />
            <h4>Persons</h4>
            <Container className="d-inline-flex flex-wrap">
                {
                    props.person.workAuthors.map(
                        workAuthor =>
                            <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/works/' + workAuthor.work.id}>
                                <img className="rounded" style={{ maxWidth: '10rem' }} src={workAuthor.work.coverPictures[0].url}></img><br />
                                {workAuthor.work.title}
                            </Link>
                    )
                }
            </Container>
        </div>
    ) : (null);
}

// const PersonCharacters = (props: { person: IPerson }) => {
//     if (!props.person.characterPersons) return (null)

//     let characters: ICharacter[] = props.person.characterPersons.map(
//         characterPerson => characterPerson.character
//     );

//     return characters.length !== 0 ? (
//         <div>
//             <hr />
//             <h4>Relations</h4>
//             <Container className="d-inline-flex flex-wrap">
//                 {characters.map(character =>
//                     <Link style={{ margin: '1rem 2rem 1rem -1rem', textDecoration: 'inherit', color: 'inherit' }} to={'/characters/' + character.id}>
//                         <img className="rounded" style={{ maxWidth: '10rem' }} src={character.pictures.length !== 0 ? character.pictures[0].url : noImage}></img><br />
//                         {character.lastName !== null ? character.firstName + " " + character.lastName : character.firstName}
//                     </Link>
//                 )}
//             </Container>
//         </div>
//     ) : (null);
// }

const PersonInformation = (props: { person: IPerson }) => (
    <div style={{ margin: '1rem' }}>
        <PersonWorks person={props.person} key={props.person.id} />
        {/* <PersonCharacters person={props.person} key={props.person.id} /> */}
    </div >
);


const PersonDetails = () => {
    const appState = useContext(AppContext);
    const { id } = useParams() as IRouteId;
    const [person, setPerson] = useState({} as IPerson);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    console.log(id);
    

    const loadData = async () => {
        let personResult = await BaseService.get<IPerson>(id, '/persons', appState.token!);

        if (personResult.ok && personResult.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 200 });
            setPerson(personResult.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: personResult.statusCode });
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <Container>
                <Row>
                    <PersonCard person={person} key={person.id} />
                    <PersonInformation person={person} key={person.id} />
                </Row>
            </Container>
            <Loader {...pageStatus} />
        </>
    );
}

export default PersonDetails;
