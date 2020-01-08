import React from 'react';
import { updateData } from '../actions/data';
import { connect } from 'react-redux';

class NicknameSet extends React.Component {
    state = {
        text: this.props.text || ''
    };

    render() {
        return (<div className={'full nickname-set'}>
            <span className={'text'}>Ustaw nickname</span>
            <input onChange={e => this.setState({text: e.target.value})} value={this.state.text} id={'nickname-input'}
                   className={'input'}/>

            <button onClick={() => this.props.onSubmit(this.state.text)} className={'ok'}>Zatwierdź</button>
        </div>);
    }
}

let NotLogged = ({setName, name}) => (
    <div className={'full not-logged'}>
        <NicknameSet text={name} onSubmit={name => setName(name)}/>
    </div>
);

const mapStateToProps = (state) => ({
    name: state.data.name
});

const mapDispatchToProps = dispatch => {
    return {
        setName: (name) => dispatch(updateData({name: name}))
    };
};

NotLogged = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotLogged);

export default NotLogged;
