import { hot } from 'react-hot-loader';
import React from 'react';
import { connect } from 'react-redux';

import Update from './update';
import Extension from './extension';

let App = ({updateIgnored}) => (
    <div className={'full'}>
        {!updateIgnored ? <Update/> : <Extension/>}
    </div>
);

const mapStateToProps = (state) => ({
    updateIgnored: state.gui.updateIgnored
});

App = connect(
    mapStateToProps
)(App);

export default hot(module)(App);