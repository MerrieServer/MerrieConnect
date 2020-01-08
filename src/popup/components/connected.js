import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateData } from '../actions/data';
import { BaseUrl } from '../../config';

const startGame = () => {
    const win = window.open(BaseUrl, '_blank');
    win.focus();
};

let Connected = ({serverName, disconnect}) => (
    <div className={'connected'}>
        <div className={'icon'}>
            <FontAwesomeIcon icon={'plug'}/>
        </div>

        <div className={'text'}>
            Połączono do <span className={'serverName'}>{serverName}</span>
        </div>

        <button className={'play'} onClick={() => startGame()}>Rozpocznij grę</button>
        <button className={'disconnect'} onClick={() => disconnect()}>Rozłącz się</button>
    </div>
);

const mapStateToProps = (state) => ({
    serverName: state.data.serverName,
});

const mapDispatchToProps = dispatch => {
    return {
        disconnect: () => dispatch(updateData({isConnected: false, ip: ""}))
    };
};

Connected = connect(
    mapStateToProps,
    mapDispatchToProps
)(Connected);

export default Connected;
