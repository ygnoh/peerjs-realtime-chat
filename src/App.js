import React from "react";
import Peer from "peerjs";

const ids = []; // store every ids to connect each other

class User extends React.PureComponent {
    _id;

    componentDidMount() {
        this._peer = new Peer();

        this._peer.on("open", id => {
            this._id = id;

            ids.push(id);
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
                {[1, 2, 3].map(i => <User key={i} index={i} />)}
            </div>
        );
    }
}

export default App;
