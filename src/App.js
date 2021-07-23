import React from "react";
import Peer from "peerjs";

class User extends React.PureComponent {
    _conns = [];
    state = {
        connected: false,
        chats: []
    };

    componentDidMount() {
        const {index, peers} = this.props;
        const me = peers[index];

        me.on("connection", conn => {
            this._handleConnect(conn);
        });

        peers.slice(index + 1)
            .map(p => me.connect(p.id))
            .forEach(conn => {
                this._handleConnect(conn);
            });
    }

    _handleConnect(conn) {
        const {peers} = this.props;
        const userIdx = peers.findIndex(p => p.id === conn.peer);

        conn.on("open", () => {
            this._conns.push(conn);

            if (this._conns.length === peers.length - 1) {
                this.setState({connected: true});
            }

            conn.on("data", data => {
                this.setState(prev => ({chats: [...prev.chats, `User ${userIdx}: "${data}"`]}));
            });
        });
    }

    render() {
        const {index} = this.props;
        const {connected, chats} = this.state;

        if (!connected) {
            return <p>connecting...</p>;
        }

        return (
            <div>
                <h2>User {index}</h2>
                <input type="text" ref={this._input} onKeyDown={this._handleKeyDown} />
                <button onClick={this._send}>Send</button>
                <ul>
                    {chats.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
            </div>
        );
    }

    _input = React.createRef();

    _handleKeyDown = e => {
        const {keyCode} = e;

        if (keyCode === 13) { // enter
            this._send();
        }
    };

    _send = () => {
        const el = this._input.current;
        const {value} = el;

        this.setState(prev => ({chats: [...prev.chats, `me: "${value}"`]}));
        this._conns.forEach(conn => conn.send(value));

        el.value = "";
    };
}

class App extends React.PureComponent {
    _readyCount = 0;
    _peers = [new Peer(), new Peer(), new Peer()];

    state = {
        ready: false
    };

    componentDidMount() {
        this._peers.forEach(p => {
            p.on("open", () => {
                this._readyCount++;

                if (this._readyCount === this._peers.length) {
                    this.setState({ready: true});
                }
            });
        });
    }

    render() {
        const {ready} = this.state;

        return (
            <div>
                <h1>A POC for multi-peer connection</h1>
                {
                    ready ?
                        this._peers.map((p, i) => <User key={i} index={i} peers={this._peers} />) :
                        "loading..."
                }
            </div>
        );
    }
}

export default App;
