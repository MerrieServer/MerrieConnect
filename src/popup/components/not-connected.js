import React from 'react';
import { connect } from 'react-redux';
import PromotedServers from './promoted-servers';
import { updateConnectOther } from '../actions/gui';
import ConnectOther from './connect-other';
import { updateData } from '../actions/data';

let ConnectOtherButton = ({onClick}) => (
    <div onClick={onClick} className={'connect-other-button'}>
        Połącz z innym
    </div>
);

let NotConnected = ({connectOtherShown, setConnectOtherShown, connectTo}) => (
    <div className={'not-connected'}>
        {connectOtherShown
            ? <ConnectOther onSubmit={value => connectTo({ip: value, name: value})} onCancel={() => setConnectOtherShown(false)}/>
            : <>
                <PromotedServers connectTo={connectTo}/>
                <ConnectOtherButton onClick={() => setConnectOtherShown(true)}/>
            </>
        }
    </div>
);

const mapStateToProps = (state) => ({
    connectOtherShown: state.gui.connectOther
});

const mapDispatchToProps = dispatch => {
    return {
        setConnectOtherShown: (value) => dispatch(updateConnectOther(value)),
        connectTo: (server) => dispatch(updateData({isConnected: true, ip: server.ip, serverName: server.name}))
    };
};

NotConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotConnected);

export default NotConnected;
