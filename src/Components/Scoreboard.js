import React from 'react';

import Card from 'react-bootstrap/Card';
import MatchupCard from './MatchupCard';

class Scoreboard extends React.Component {
    intervalId;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            loaded: false
        };
    }

    componentDidMount() {
        this.fetchData();
        this.intervalId = setInterval(this.fetchData.bind(this), 10000);
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    fetchData() {
        fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard")
            .then(response => response.json())
            .then(result => {
                this.setState({
                    loading: false,
                    loaded: true,
                    events: result.events
                });

                let cancelInterval = true;

                for (let gameKey in result.events) {

                    if (result.events[gameKey].status.type.name !== "STATUS_FINAL") {
                        cancelInterval = false;
                    }

                    if (!cancelInterval) {
                        break;
                    }
                }

                if (cancelInterval && this.intervalId) {
                    clearInterval(this.intervalId);
                }
            });
    }

    render() {
        if (this.state.loaded === false) {
            return <span>Loading...</span>
        }

        return (<div className="p-3">
            {this.state.events.map(game => (
                <Card className="my-3">
                    <MatchupCard homeTeam={game.competitions[0].competitors[0]}
                                 awayTeam={game.competitions[0].competitors[1]}
                                 gameStatus={game.status}
                                 leaders={game.competitions[0].leaders}
                                 gameId={game.competitions[0].id}
                                 situation={game.competitions[0].situation}
                    />
                </Card>
            ))}
        </div>);
    }
}

export default Scoreboard;
