import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import {ListGroup, Tab, Tabs, Table} from 'react-bootstrap';
import { Link } from "react-router-dom";
import MatchupCard from "./MatchupCard";

function CurrentDrive(props) {
    let drive = props.drive;

    if (typeof drive === "undefined" || typeof drive.team === "undefined") {
        return (null);
    }

    return (
        <Card className="mb-3">
            <Card.Header>Latest Drive: {drive.team.displayName}</Card.Header>
            <ListGroup variant="flush">
                {drive.plays.map(play => (
                    <ListGroup.Item>{play.text}</ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
}

function DateSpan(props) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(props.date);

    return (<span>{monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</span>);
}

class GameTabs extends React.Component {
    selectedTab;

    constructor(props) {
        super(props);

        this.state = {
            expandedGameId: null,
            expandedVideo: props.expandedVideo
        };

        this.selectedTab = this.state.expandedVideo ? "tab_videos" : "tab_leaders";

        this.state.leaders = props.leaders;
        this.state.lastFiveGames = props.lastFiveGames;
        this.state.playerStats = props.playerStats;
        this.state.scoringPlays = props.scoringPlays;
        this.state.videos = props.videos;
    }

    expandGame(game) {
        this.setState({expandedGameId: game.id});
    }

    expandVideo(video) {
        this.setState({expandedVideo: video});
    }

    componentDidUpdate(prevProps) {
        for (let property in ['leaders', 'lastFiveGames', 'playerStats', 'scoringPlays', 'videos', 'expandedVideo']) {
            if (prevProps[property] !== this.props[property]) {
                this.setState({[property]: this.props[property]});
            }
        }
    }

    recentGamesTabs() {
        if (!this.state.lastFiveGames) {
            return (null);
        }

        let recentGameExpanded = (null);

        if (this.state.expandedGameId) {
            recentGameExpanded = <GameDisplay match={{params: {id: this.state.expandedGameId}}} />
        }

        return (
            <Tab eventKey="tab_recentGames" title="Recent Games">
                <Row className="p-3">
                    {this.state.lastFiveGames.map(teamData => (
                        <Col>
                            <div><strong>{teamData.team.displayName}</strong></div>
                            <Table bordered striped responsive>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Opponent</th>
                                    <th>Result</th>
                                    <th>Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {teamData.events.map(game => (
                                    <tr>
                                        <td>
                                            <Link to={"#"} onClick={this.expandGame.bind(this, game)}><DateSpan date={game.gameDate} /></Link>
                                        </td>
                                        <td>{game.opponent.displayName}</td>
                                        <td>{game.gameResult}</td>
                                        <td>{game.score}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    ))}
                </Row>
                {recentGameExpanded}
            </Tab>
        );
    }

    scoringTab() {
        if (!this.state.scoringPlays) {
            return (null);
        }

        return (
            <Tab eventKey="tab_scoringPlays" title="Scoring Plays">
                <ListGroup>
                    {this.state.scoringPlays.map(play => (
                        <ListGroup.Item>{play.text}</ListGroup.Item>
                    ))}
                </ListGroup>
            </Tab>
        );
    }

    statLeadersTab() {
        let leaders = this.state.leaders;

        for (let team in leaders) {
            if (!leaders[team].leaders || !leaders[team].leaders[0]) {
                delete leaders[team];
                continue;
            }

            for (let category in leaders[team].leaders) {
                if (!leaders[team].leaders[category].leaders || !leaders[team].leaders[category].leaders[0]) {
                    delete leaders[team].leaders[category];
                }
            }
        }

        return (
            <Tab eventKey="tab_leaders" title="Stat Leaders">
                <div className="p-3">
                    <Row className="mb-3">
                        {leaders.map(team => (
                            <Col>
                                <div><strong>{team.team.displayName}</strong></div>
                                {team.leaders.map(leader => (
                                    <Card className="mb-3">
                                        <Card.Body>
                                            <Card.Title>
                                                {leader.leaders[0].athlete.displayName}
                                            </Card.Title>
                                            <Card.Text>
                                                {leader.leaders[0].displayValue}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Col>
                        ))}
                    </Row>
                </div>
            </Tab>
        );
    }

    playerStatsTab() {
        if (!this.state.playerStats) {
            return (null);
        }

        return (
            <Tab eventKey="tab_playerStats" title="Player Stats">
                {this.state.playerStats.map(teamGrouped => (
                <Table bordered responsive>
                    {teamGrouped.statistics.map(statGrouped => (
                        <thead>
                        <tr>
                            <th>{statGrouped.text}</th>
                        </tr>
                        <tr>
                            <td></td>
                            {statGrouped.descriptions.map(label => (
                                <td>{label}</td>
                            ))}
                        </tr>
                        {statGrouped.athletes.map(athlete => (
                            <tr>
                                <td>{athlete.athlete.displayName}</td>
                                {athlete.stats.map(stat => (
                                    <td>{stat}</td>
                                ))}
                            </tr>
                        ))}
                        </thead>
                    ))}
                </Table>
                ))}
            </Tab>
        );
    }

    videoTab() {
        if (!this.state.videos || this.state.videos.length < 1) {
            return (null);
        }

        let expandedVideo = null;

        if (this.state.expandedVideo) {
            expandedVideo = (
                <Card>
                    <Card.Body>
                        <Card.Title>{this.state.expandedVideo.headline}</Card.Title>
                        <Card.Text>
                            <div className="mb-3">
                                {this.state.expandedVideo.description}
                            </div>
                            <video width="100%" height="300" controls id="videotab_expanded_{this.state.expandedVideo.id}">
                                <source src={this.state.expandedVideo.links.source.full.href} type="video/mp4" />
                            </video>
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        }

        return (
            <Tab eventKey="tab_videos" title="Videos">
                <ListGroup>
                    {this.state.videos.map(video => (
                        <ListGroup.Item>
                            <Link to={"#"} data-video-id={video.id}  onClick={this.expandVideo.bind(this, video)}>{video.description}</Link>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                {expandedVideo}
            </Tab>
        );
    }

    render() {
        return (
            <Tabs defaultActiveKey={this.selectedTab}>
                {this.statLeadersTab()}
                {this.scoringTab()}
                {this.videoTab()}
                {this.playerStatsTab()}
                {this.recentGamesTabs()}
            </Tabs>
        );
    }
}

class GameDisplay extends React.Component {
    intervalId;
    gameId;

    constructor(props) {
        super(props);

        this.gameId = props.match.params.id;
        this.expandedVideoId = props.match.params.videoid;

        this.state = {loaded: false, loading: true};
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

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id
            || prevProps.match.params.videoid !== this.props.match.params.videoid
        ) {
            this.gameId = this.props.match.params.id;
            this.expandedVideoId = this.props.match.params.videoid;

            this.setBaseState();

            this.fetchData();
            clearInterval(this.intervalId);
            this.intervalId = setInterval(this.fetchData.bind(this), 10000);
        }
    }

    setBaseState() {
        this.setState({
            loading: true,
            loaded: false,
            leaders: null,
            latestDrive: null,
            gameStatus: null,
            score: null,
            videos: null,
            scoringPlays: null,
            lastFiveGames: null,
            playerStats: null
        });
    }

    fetchData() {
        fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=" + this.gameId)
            .then(response => response.json())
            .then(result => {
                let stateData = {
                    loading: false,
                    loaded: true,
                };

                if (result.leaders) {
                    stateData.leaders = result.leaders;
                }

                if (result.drives) {
                    let lastDriveIndex = result.drives.previous.length - 1;
                    stateData.latestDrive = result.drives.previous[lastDriveIndex];
                }

                stateData.gameStatus = result.header.competitions[0].status;
                stateData.score = result.header.competitions[0].competitors;
                stateData.videos = result.videos;

                if (result.scoringPlays) {
                    stateData.scoringPlays = result.scoringPlays;
                }

                if (result.lastFiveGames) {
                    stateData.lastFiveGames = result.lastFiveGames;
                }

                if (result.boxscore.players) {
                    stateData.playerStats = result.boxscore.players;
                }

                this.setState(stateData);

                if (result.header.competitions[0].status.type.name === 'STATUS_FINAL') {
                    clearInterval(this.intervalId);
                }
            });
    }

    expandedVideo() {
        if (!this.expandedVideoId) {
            return (null);
        }

        for (let video in this.state.videos) {
            if (this.state.videos[video].id === parseInt(this.expandedVideoId)) {
                console.info("returned video", this.state.videos[video]);
                return this.state.videos[video];
            }
        }

        return null;
    }

    render() {
        if (this.state.loaded === false) {
            return <span>Loading...</span>
        }

        const centerBold = {
            textAlign: 'center',
            fontWeight: 'bold'
        };

        return (
        <div className="p-3">
            <Link to={"/scoreboard"} className="mb-3">Back To Scoreboard</Link>
            <Card className="mb-3">
                <MatchupCard homeTeam={this.state.score[0]}
                             awayTeam={this.state.score[1]}
                             gameStatus={this.state.gameStatus}
                             leaders={null}
                             gameId={this.gameId} />
            </Card>

            <CurrentDrive drive={this.state.latestDrive} />

            <GameTabs leaders={this.state.leaders} scoringPlays={this.state.scoringPlays}
                videos={this.state.videos} playerStats={this.state.playerStats} lastFiveGames={this.state.lastFiveGames}
                expandedVideo={this.expandedVideo()}/>
        </div>
        );
    }
}

export default GameDisplay;
