import React from 'react';
import { updateData } from '../actions/data';
import { connect } from 'react-redux';
import Connected from './connected';
import NotConnected from './not-connected';

let Logged = ({name, resetName, connected}) => (
    <div className={'logged'}>
        <div className={'header'}>
            Zalogowany jako <span className={'name'}>{name}</span>
            {!connected && <a onClick={() => resetName()} className={'change link'}>[ Zmień ]</a>}
        </div>
        {connected ? <Connected/> : <NotConnected/>}
    </div>
);

const mapStateToProps = (state) => ({
    connectOtherShown: state.gui.connectOther,
    name: state.data.name,
    connected: state.data.isConnected
});

const mapDispatchToProps = dispatch => {
    return {
        resetName: () => dispatch(updateData({name: ""}))
    };
};

Logged = connect(
    mapStateToProps,
    mapDispatchToProps
)(Logged);

export default Logged;
