import React from "react";
import Peer from "peerjs";

class App extends React.PureComponent {
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
        const {id} = this.state;

        return (
            <div>
                <p>Connect with me: {id}</p>
            </div>
        );
    }
}

export default App;
