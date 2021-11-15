import React from 'react';

import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import {ListGroup, Tab, Tabs, Table} from 'react-bootstrap';
import { ExternalLink } from 'react-external-link';

class MatchupCard extends React.Component {
    homeTeam;
    awayTeam;
    gameStatus;
    leaders;
    gameId;

    constructor(props) {
        super(props);

        this.state = {
            homeTeam: props.homeTeam,
            awayTeam: props.awayTeam,
            gameStatus: props.gameStatus,
            gameId: props.gameId,
            leaders: props.leaders,
            situation: props.situation
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.homeTeam !== this.props.homeTeam
            || prevProps.awayTeam !== this.props.awayTeam
            || prevProps.gameStatus !== this.props.gameStatus
            || prevProps.gameId !== this.props.gameId
            || prevProps.leaders !== this.props.leaders
            || prevProps.situation !== this.props.situation
        ) {
            this.setState({
                homeTeam: this.props.homeTeam,
                awayTeam: this.props.awayTeam,
                gameStatus: this.props.gameStatus,
                gameId: this.props.gameId,
                leaders: this.props.leaders,
                situation: this.props.situation
            });
        }
    }

    teamCol(props) {
        let logo = props.competitor.team.logo;
        if (!logo) {
            logo = props.competitor.team.logos[0].href;
        }

        let rank = null;
        if (props.competitor.curatedRank
            && props.competitor.curatedRank.current != "undefined"
            && props.competitor.curatedRank.current < 26) {
            rank = (<small className="text-muted">#{props.competitor.curatedRank.current}</small>);
        }
        else if (props.competitor.rank) {
            rank = (<small className="text-muted">#{props.competitor.rank}</small>);
        }

        return (
            <Col>
                <Row>
                    <Col>
                        <img src={logo} height="70" />
                    </Col>
                    <Col>
                        <div>{rank} {props.competitor.team.displayName}</div>
                        <div><strong>{props.competitor.score}</strong></div>
                    </Col>
                </Row>
            </Col>
        );
    }

    GameLeaders(props) {
        if (!props.leaders || !props.leaders[0]) {
            return;
        }

        return (
            <ListGroup>
                {props.leaders.map(leader => (
                    <ListGroup.Item><strong>{leader.leaders[0].athlete.displayName}</strong>: {leader.leaders[0].displayValue}</ListGroup.Item>
                ))}
            </ListGroup>
        );
    }

    Situation(props) {
        if (!props.situation || !props.situation.lastPlay) {
            return;
        }

        return (
            <Row>
                <Col md={{offset: 2, span: 8}}>
                    <ListGroup className="mt-3">
                        <ListGroup.Item><strong>Last Play: </strong> {props.situation.lastPlay.text}</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        );
    }

    render() {
        const centerBold = {
            textAlign: 'center',
            fontWeight: 'bold'
        };

        let description = this.state.gameStatus.type.description;
        let detail = description === 'Final' ? null : this.state.gameStatus.type.detail;

        return (<Card.Body>
            <Row>
                {this.teamCol({competitor: this.state.awayTeam})}
                <Col style={centerBold}>
                    <Link to={{
                        pathname: '/game/' + this.state.gameId
                    }}>
                        <div>{description}</div>
                        <div><small>{detail}</small></div>
                    </Link>
                </Col>
                {this.teamCol({competitor: this.state.homeTeam})}
            </Row>
            <Row>
                <Col md={{offset: 2, span: 8}}>
                    {this.GameLeaders({leaders: this.state.leaders})}
                </Col>
            </Row>
            {this.Situation({situation: this.state.situation})}
        </Card.Body>);
    }
}

export default MatchupCard;