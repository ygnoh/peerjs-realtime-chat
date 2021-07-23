import React from "react";
import Peer from "peerjs";

const peers = [];

class User extends React.PureComponent {
    _conns = [];

    componentDidMount() {
        this._peer = new Peer();

        peers.push(this._peer);

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
    render() {
        return (
            <div>
                <h1>A POC for multi-peer connection</h1>
                <button onClick={this._connect}>Start connecting</button>
                {[1, 2, 3].map(i => <User key={i} index={i} />)}
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
}

export default App;
