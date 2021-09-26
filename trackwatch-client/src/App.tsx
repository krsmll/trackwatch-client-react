import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Page404 from './containers/Page404';
import { AppContextProvider, initialAppState } from './context/AppContext';

import HomeIndex from './containers/home/HomeIndex';
import Login from './containers/identity/Login';
import Register from './containers/identity/Register';
import FavoriteCharacters from './containers/identity/user-specific-pages/FavoriteCharacters'
import WatchList from './containers/identity/user-specific-pages/WatchList'
import CharacterDetails from './containers/characters/CharacterDetails'
import CharacterEdit from './containers/characters/CharacterEdit'
import CharacterAdd from './containers/characters/CharacterAdd'
import WorkDetails from './containers/works/WorkDetails';
import WorkIndex from './containers/works/WorkIndex';
import WorkEdit from './containers/works/WorkEdit'
import PersonDetails from './containers/persons/PersonDetails';
import PersonEdit from './containers/persons/PersonEdit'
import RoleEdit from './containers/roles/RoleEdit'
import StatusEdit from './containers/status/StatusEdit'
import GenreEdit from './containers/genres/GenreEdit'
import FormatEdit from './containers/formats/FormatEdit'
import WorkTypeEdit from './containers/worktypes/WorkTypeEdit'
import AdminView from './containers/admin/AdminView'
import WorkAdd from './containers/works/WorkAdd';
import PersonAdd from './containers/persons/PersonAdd';
import StatusAdd from './containers/status/StatusAdd';
import RoleAdd from './containers/roles/RoleAdd';
import GenreAdd from './containers/genres/GenreAdd';
import FormatAdd from './containers/formats/FormatAdd';
import WorkTypeAdd from './containers/worktypes/WorkTypeAdd';


function App() {
  const setAuthInfo = (token: string | null, roles: string[], username: string): void => {
    setAppState({ ...appState, token, roles, username });
  }

  const [appState, setAppState] = useState({ ...initialAppState, setAuthInfo });

  return (
    <>
      <AppContextProvider value={appState} >
        <Header />
        <div className="container">
          <main role="main" className="pb-3">
            <Switch>
              <Route exact path="/" component={HomeIndex} />

              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />

              <Route exact path="/manage" component={AdminView} />

              <Route path="/:username/fav-chars" render={props => <FavoriteCharacters key={props.match.params.username} />} />
              <Route path="/:username/watchlist" render={props => <WatchList key={props.match.params.username} />} />

              <Route exact path='/works' component={WorkIndex} />
              <Route path='/works/edit/:id' render={props => <WorkEdit key={props.match.params.id} />} />
              <Route exact path='/works/add' component={WorkAdd} />
              <Route path='/works/:id' render={props => <WorkDetails key={props.match.params.id} />} />

              <Route path='/characters/edit/:id' render={props => <CharacterEdit key={props.match.params.id} />} />
              <Route exact path='/characters/add' component={CharacterAdd} />
              <Route path='/characters/:id' render={props => <CharacterDetails key={props.match.params.id} />} />

              <Route path='/persons/edit/:id' render={props => <PersonEdit key={props.match.params.id} />} />
              <Route exact path='/persons/add' component={PersonAdd} />
              <Route path='/persons/:id' render={props => <PersonDetails key={props.match.params.id} />} />

              <Route path='/statuses/edit/:id' render={props => <StatusEdit key={props.match.params.id} />} />
              <Route exact path='/statuses/add' component={StatusAdd} />

              <Route path='/roles/edit/:id' render={props => <RoleEdit key={props.match.params.id} />} />
              <Route exact path='/roles/add' component={RoleAdd} />

              <Route path='/genres/edit/:id' render={props => <GenreEdit key={props.match.params.id} />} />
              <Route exact path='/genres/add' component={GenreAdd} />

              <Route path='/formats/edit/:id' render={props => <FormatEdit key={props.match.params.id} />} />
              <Route exact path='/formats/add' component={FormatAdd} />

              <Route path='/worktypes/edit/:id' render={props => <WorkTypeEdit key={props.match.params.id} />} />
              <Route exact path='/worktypes/add' component={WorkTypeAdd} />
              
              <Route component={Page404} />
            </Switch>
          </main>
        </div>
        <Footer />
      </AppContextProvider>
    </>
  );
}

export default App;
