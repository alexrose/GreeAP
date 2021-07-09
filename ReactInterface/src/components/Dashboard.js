import React from 'react'
import InputRange from 'react-input-range';
import Dropdown from 'react-dropdown';
import Loader from 'react-loader-spinner';

import {connect} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import {bindActionCreators} from 'redux';
import {Alert, Button, ToggleButton, ToggleButtonGroup, Col, Row, Navbar, Container} from 'react-bootstrap';

import {getDefaults, setParamsOn, setParamsOff} from "../actions/actionCreators";
import {AC_DIRECTION, AC_FAN_SPEED, AC_MODE} from "../constants";

import 'react-dropdown/style.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-input-range/lib/css/index.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            temperature: 16,
            mode: null,
            fanSpeed: null,
            direction: null,
            directionAuto: null,
            light: null,
            turbo: null,
            xFan: null,
            sleep: null
        };
    }

    componentDidMount() {
        this.props.getDefaults();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {defaults} = this.props.defaults;

        if (!prevState.initialized && defaults.length > 0) {
            this.setState({
                ...this.state,
                initialized: true,
                temperature: defaults[1],
                mode: defaults[0],
                fanSpeed: defaults[2],
                direction: defaults[4],
                directionAuto: defaults[3],
                light: defaults[5],
                turbo: defaults[6],
                xFan: defaults[7],
                sleep: defaults[8]
            });
        }
    }

    _onDirectionChange(data) {
        this.setState({
            ...this.state,
            direction: data.value,
            directionAuto: (data.value > 6 || data.value === 1) ? 1 : 0
        });
    }

    _sendCommand() {
        this.props.setParamsOn(this.state);
    }

    _turnOff() {
        this.props.setParamsOff();
    }


    render() {
        let {defaults} = this.props.defaults;
        let {counterRequest} = this.props.counterRequest;

        return (
            <Container fluid className='p-0'>
                <Loader className={"loader"} type="Bars" color="#00BFFF" visible={counterRequest > 0}/>

                <Navbar bg='dark' variant='dark'>
                    <Navbar.Brand href='#'>
                        <img alt='' width='48' height='48' src='assets/android-chrome-192x192.png'/>
                        {' Gree Remote Control '}
                    </Navbar.Brand>
                </Navbar>

                <Container fluid>
                    <p>&nbsp;</p>
                    <form name={'greeData'}>
                        <Row>
                            <Col>
                                <Alert variant='warning'>
                                    <InputRange
                                        name={'acTemp'}
                                        maxValue={32}
                                        minValue={16}
                                        value={this.state.temperature}
                                        formatLabel={value => `${value}°C`}
                                        onChange={value => this.setState({temperature: value})}
                                    />
                                    <p>&nbsp;</p>

                                    <Row>
                                        <Col>
                                            <label>Mode</label>
                                            <Alert variant='success'>
                                                <Dropdown
                                                    name={'acMode'}
                                                    options={AC_MODE}
                                                    onChange={data => this.setState({mode: data.value})}
                                                    value={AC_MODE.find(el => el.value === defaults[0])}
                                                    placeholder="Select mode"
                                                />

                                            </Alert>
                                        </Col>
                                        <Col>
                                            <label>Fan speed</label>
                                            <Alert variant='info'>
                                                <Dropdown
                                                    name={'acFanSpeed'}
                                                    options={AC_FAN_SPEED}
                                                    onChange={data => this.setState({fanSpeed: data.value})}
                                                    value={AC_FAN_SPEED.find(el => el.value === defaults[2])}
                                                    placeholder="Select fan speed"
                                                />
                                            </Alert>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col sm>
                                            <label>Direction</label>
                                            <Alert variant='danger'>
                                                <Dropdown
                                                    name={'acDirection'}
                                                    options={AC_DIRECTION}
                                                    onChange={this._onDirectionChange.bind(this)}
                                                    value={AC_DIRECTION.find(el => el.value === defaults[4])}
                                                    placeholder="Select direction"
                                                />
                                            </Alert>
                                        </Col>
                                        <Col sm>
                                            <label>Options</label>
                                            <Alert variant='secondary'>
                                                <ToggleButtonGroup type="checkbox" defaultValue={1}
                                                                   className={'mr-1 mb-1'}>
                                                    <ToggleButton
                                                        variant={"outline-secondary"}
                                                        size="sm"
                                                        value={defaults[5]}
                                                        onClick={data => this.setState({light: Number(data.target.checked)})}>
                                                        Light
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                <ToggleButtonGroup type="checkbox" defaultValue={1}
                                                                   className={'mr-1 mb-1'}>
                                                    <ToggleButton
                                                        type={"checkbox"}
                                                        variant={"outline-secondary"}
                                                        size="sm"
                                                        value={defaults[6]}
                                                        onClick={data => this.setState({turbo: Number(data.target.checked)})}>
                                                        Turbo
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                <ToggleButtonGroup type="checkbox" defaultValue={1}
                                                                   className={'mr-1 mb-1'}>
                                                    <ToggleButton
                                                        type={"checkbox"}
                                                        variant={"outline-secondary"}
                                                        size="sm"
                                                        value={defaults[7]}
                                                        onClick={data => this.setState({xFan: Number(data.target.checked)})}>
                                                        X-Fan
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                <ToggleButtonGroup type="checkbox" defaultValue={1} className={'mb-1'}>
                                                    <ToggleButton
                                                        type={"checkbox"}
                                                        variant={"outline-secondary"}
                                                        size="sm"
                                                        value={defaults[8]}
                                                        onClick={data => this.setState({sleep: Number(data.target.checked)})}>
                                                        Sleep
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            </Alert>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm>
                                            <Button variant="success" className={'mb-2'} block
                                                    onClick={this._sendCommand.bind(this)}>Send command</Button>
                                        </Col>
                                        <Col sm>
                                            <Button variant="danger" className={'mb-2'} block
                                                    onClick={this._turnOff.bind(this)}>Turn off</Button>
                                        </Col>
                                    </Row>
                                </Alert>
                            </Col>
                        </Row>

                    </form>
                </Container>

                <ToastContainer autoClose={2000}/>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        defaults: state.defaultsData,
        counterRequest: state.handleRequestData
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        "getDefaults": getDefaults,
        "setParamsOn": setParamsOn,
        "setParamsOff": setParamsOff
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
