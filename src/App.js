import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';

import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from "react-router-dom";

import ReactGA from 'react-ga';

import Scoreboard from './Components/Scoreboard.js';
import GameDisplay from './Components/GameDisplay.js';

ReactGA.initialize('UA-59736959-3');
ReactGA.pageview(window.location.pathname + window.location.search);

const history = createBrowserHistory();
history.listen((location, action) => {
    console.info("history", location, action);
    ReactGA.pageview(location.pathname + location.search);
});

function App() {
  return (
    <Router history={history}>
        <Switch>
            <Route exact path="/game/:id" component={GameDisplay} />
            <Route exact path="/game/:id/videos/:videoid" component={GameDisplay} />
            <Route>
                <Scoreboard />
            </Route>
        </Switch>
    </Router>
  );
}

export default App;
