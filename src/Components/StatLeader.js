import React from 'react';

import Card from 'react-bootstrap/Card';

class StatLeader extends React.Component {
    render() {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{this.props.stat_name}</Card.Title>
                    <Card.Text>
                        <div><strong>{this.props.player}</strong></div>
                        <div>{this.props.metric}: {this.props.value}</div>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default StatLeader;
