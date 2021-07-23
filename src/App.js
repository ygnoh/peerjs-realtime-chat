import React from "react";
import Peer from "peerjs";

const peers = [];

class User extends React.PureComponent {
    _conns = [];

    componentDidMount() {
        this._peer = new Peer();

        this._peer.on("open", () => {
            this.props.onReady();
            peers.push(this._peer);
        });

        this._peer.on("connection", conn => {
            conn.on("open", () => {
                console.log("Connected successfully", conn);

                this._conns.push(conn);
            });
        });
    }

    render() {
        const {index} = this.props;

        return (
            <div>
                <h2>User {index}</h2>
            </div>
        );
    }
}

class App extends React.PureComponent {
    _users = [1, 2, 3];
    _readyCount = 0;

    state = {
        ready: false
    };

    render() {
        const {ready} = this.state;

        return (
            <div>
                <h1>A POC for multi-peer connection</h1>
                <button onClick={this._connect} disabled={!ready}>Start connecting</button>
                {this._users.map(i => <User key={i} index={i} onReady={this._handleReady} />)}
            </div>
        );
    }

    _connect() {
        for (let i = 0; i < peers.length; i++) {
            for (let j = i + 1; j < peers.length; j++) {
                peers[j].connect(peers[i].id);
            }
        }
    }

    _handleReady = () => {
        this._readyCount++;

        if (this._readyCount === this._users.length) {
            this.setState({ready: true});
            console.log("Ready to connect each other");
        }
    };
}

export default App;
