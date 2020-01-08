import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Mode } from '../actions/api';
import { ignoreUpdate } from '../actions/gui';


let Update = ({ignore, text, detail, buttonText}) => (
    <div className={'update full'}>
        <div className={'icon'}>
            <FontAwesomeIcon icon={'sync'}/>
        </div>
        <div className={'text'}>
            {text}
        </div>
        <div className={'detail'}>
            {detail}
        </div>
        <div className={'button'}>
            <button onClick={() => ignore()}>{buttonText}</button>
        </div>
    </div>
);

const mapStateToProps = (state) => {
    let text = "???";
    let detail = "???";

    switch (state.api.mode) {
        case Mode.OK:
            text = "Dostępna jest nowa wersja wtyczki!";
            detail = state.api.data.latest;
            break;
        case Mode.WAITING:
            text = "Proszę czekać, trwa pobieranie informacji z serwera głównego";
            detail = "";
            break;
        case Mode.ERROR:
            text = "Wystąpił błąd podczas pobierania wersji wtyczki.";
            detail = state.api.data.error;
            break;
    }

    return {
        updateIgnored: state.api.ignored,
        text: text,
        detail: detail,
        buttonText: state.api.mode === Mode.WAITING ? "Pomiń" : "Ignoruj"
    };
};

const mapDispatchToProps = dispatch => {
    return {
        ignore: () => dispatch(ignoreUpdate())
    };
};


Update = connect(
    mapStateToProps,
    mapDispatchToProps
)(Update);

export default Update;