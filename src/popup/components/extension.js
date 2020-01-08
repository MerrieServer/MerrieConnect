import React from 'react';
import { connect } from 'react-redux';
import { ExtensionVersion } from '../../config';
import Logged from './logged';
import NotLogged from './not-logged';

let Extension = ({hasNickname}) => (
    <div className={'extension full'}>
        <div className={'logo'}>
            Merrie-Connect
        </div>
        <div className={'version'}>
            v{ExtensionVersion}
        </div>
        <div className={'content'}>
            {hasNickname ? <Logged/> : <NotLogged/>}
        </div>
    </div>
);

const mapStateToProps = (state) => ({
    hasNickname: state.data.name !== undefined && state.data.name !== ""
});

Extension = connect(
    mapStateToProps
)(Extension);

export default Extension;