import React from 'react';
import { connect } from 'react-redux';

let Server = ({server, connectTo}) => (
    <li className={'promoted-server'} onClick={() => connectTo(server)}>{server.name}</li>
);

let PromotedServers = ({servers, connectTo}) => (
    <div className={'promoted-servers'}>
        <h1 className={'title'}>Serwery promowane</h1>
        <ul className={'list'}>
            {servers.map(server => <Server key={server.name} server={server} connectTo={connectTo}/>)}
        </ul>
    </div>
);

const mapStateToProps = state => ({
    servers: state.api.data.promoted
});

PromotedServers = connect(
    mapStateToProps
)(PromotedServers);

export default PromotedServers;