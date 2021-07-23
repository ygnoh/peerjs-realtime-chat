import React from "react";
import Peer from "peerjs";

class User extends React.PureComponent {
    state = {
        id: undefined
    };

    componentDidMount() {
        this._peer = new Peer();

        this._peer.on("open", id => {
            this.setState({id});
        });
    }

    render() {
        const {index} = this.props;
        const {id} = this.state;

        return (
            <div>
                <h2>User {index}</h2>
                <p>Connect with me: {id}</p>
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
