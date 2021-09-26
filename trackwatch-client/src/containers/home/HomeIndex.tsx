import { useContext } from "react";
import { Container } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";

const HomeIndex = () => {
    const appState = useContext(AppContext);

    return (
        <Container style={{ textAlign: 'center' }}>
            <h1>trackWatch</h1>
            <h4>
                is a manual tracking system for whatever is possible to watch, read, or consume as a media.
            </h4>
            <br />
            <h5 className='font-weight-light'>To start, make an account and you will receive a watch list where you can track progress of various movies, shows etc. You also get a favorite character list.</h5>
            <h5 className='font-weight-light'>To add movies and shows to the watch list, click on browse to browse various movies and shows and then add them from their page. You can also favorite characters by going to their page </h5>
        </Container>
    );
}

export default HomeIndex;