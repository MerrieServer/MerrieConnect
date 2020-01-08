import React from 'react';

class ConnectOther extends React.Component {
    state = {
        text: this.props.text || ''
    };

    render() {
        return (<div className={'full connect-other'}>
            <span className={'text'}>Połącz się z serwerem</span>
            <input onChange={e => this.setState({text: e.target.value})} value={this.state.text} className={'input'}/>

            <button onClick={() => this.props.onSubmit(this.state.text)} className={'ok'}>Zatwierdź</button>
            <button onClick={() => this.props.onCancel()} className={'ok'}>Wyjdź</button>
        </div>);
    }
}

export default ConnectOther;