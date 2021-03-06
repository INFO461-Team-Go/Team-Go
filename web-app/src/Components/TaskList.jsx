import React from "react";
import TaskCard from "./TaskCard";
import firebase from "firebase/app";
import Picker from 'react-picker'
import md5 from "blueimp-md5";

let greyButton = {
    color: "#8B8B8B",
    cursor: "default"
}

let greyButtonActive = {
    color: "#31c4f3",
    cursor: "pointer"
}

let redButton = {
    color: "#FF4D4D",
    cursor: "pointer"
}

let emptyOption = {
    display: "none"
}

export default class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            fbError: undefined,
            taskSnap: undefined,
            dataSource: [],
            recieved: false,
            roommate: 0,
            addActive: false
        };
    }


    // async get_firebase_list() {
    //     return firebase.database().ref(this.props.hash + '/roommates/names/').once('value').then(function (snapshot) {
    //         // if (this.props.hash) {
    //         //     console.log(this.props.hash);
    //         // } else {
    //         //     console.log("hash is undefined");
    //         // }
    //         var items = [];
    //         snapshot.forEach(function (childSnapshot) {
    //             var childKey = childSnapshot.key;
    //             var childData = childSnapshot.val();
    //             items.push(childData);
    //         });
    //         // console.log("items_load: " + items);
    //         return items;
    //     });
    // }

    // async componentWillMount() {
    //     console.log("task list will mount")
    //     this.setState({
    //         dataSource: await this.get_firebase_list()
    //     })
    //     console.log("items: " + this.state.dataSource);
    // }

    async componentWillReceiveProps(nextProps) {
        this.props.taskRef.off("value", this.unlisten);
        this.props.roommatesRef.off('value', this.unlistenRoommates);
        this.unlisten = nextProps.taskRef.on("value", snapshot => this.setState({
            taskSnap: snapshot
        }));
        this.unlistenRoommates = nextProps.roommatesRef.on('value', snapshot => {
            this.setState({roommatesSnap: snapshot});
            let items = [];
            snapshot.forEach(childSnap => {
                items.push(childSnap.val());
            });
            this.setState({dataSource: items});
        });
        // console.log("task list will receive props");
        
    }

    componentDidMount() {
        this.unlisten = this.props.taskRef.on('value',
            snapshot => this.setState({ taskSnap: snapshot }));
        this.unlistenRoommates = this.props.roommatesRef.on('value', snapshot => {
            this.setState({roommatesSnap: snapshot});
            let items = [];
            snapshot.forEach(childSnap => {
                items.push(childSnap.val());
            });
            this.setState({dataSource: items});
        });
        // console.log("task list did mount");
    }

    componentWillUnmount() {
        this.props.taskRef.off('value', this.unlisten);
        this.props.roommatesRef.off('value', this.unlistenRoommates);
        // console.log("task list will unmount");
    }

    handleSubmit(evt) {
        //prevent the browser's default behavior
        //so that it doesn't try to post the form data
        //back to the server
        evt.preventDefault();
        this.setState({errMsg: undefined});
        let trim = this.state.name.trim();
        let flag = 0;
        let trimmedTask = this.toTitleCase(trim);
        this.state.taskSnap.forEach(childSnap => {
            let val = childSnap.val();
            let check = val.name;
            if (check === trimmedTask) {
                flag++;
            }
        });
        
        if (flag > 0) {
            this.setState({errMsg: "task exists in database"});
        } else if (this.state.roommates < 0) {
            this.setState({errMsg: "Please select a roommate"});
        } else {
            this.props.taskRef.push({ name: trimmedTask, roommate: this.state.roommate })
                .then(() => this.setState({ name: "", fbError: undefined, addActive: false }))
                .catch(err => this.setState({ fbError: err }));
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    handleCancelAdd() {
        this.setState({ addActive: false });
    }

    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    render() {

        if (!this.state.taskSnap) {
            return <p>loading...</p>
        }
        //TODO: loop over the tasks snapshot
        //and create a <Task/> for each child snapshot
        //pushing it into an array
        let names = [];
        let rooms = [];
        let roommatenames = [];

        //let poo = this.props;

        // console.log(this.state.dataSource)
        // this.state.dataSource.forEach(elem => {
        //     rooms.push(<Picker.Item label={elem.value}/>)
        // });

        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        let index = 0;

        this.state.dataSource.forEach(element => {
            // console.log("dataSource name: " + element.name);
            roommatenames.push(element.name);
            rooms.push(<option value={index}>{toTitleCase(element.name)}</option>)
            index++;
            // console.log("index: "+ index);
            // rooms.push(<Picker.Item label={element.name} value={element.name} />);
        });
        
        // this pushes a blank state to dropdown menu. It should not appear as a selectable option
        rooms.push(<option selected disabled style={emptyOption} value={-1}></option>);

        this.state.taskSnap.forEach(nameSnap => {
            names.push(<TaskCard rooms={rooms} nameList={roommatenames} key={nameSnap.key} nameSnap={nameSnap} taskSnap={this.state.taskSnap} />)
            // console.log("nameSnap: " + nameSnap.val().roommate);
        });
        // console.log(names.length);

        // console.log(this.state.dataSource)


        return (
            <div className="container" id="nameList" ref="wrap">
                {names}
                {
                    this.state.addActive ?
                        <div className="container p-0" id="roommateBox">
                            <form onKeyPress={this.onKeyPress} id="taskForm" className="d-flex row mx-auto" onSubmit={evt => { this.handleSubmit(evt); evt.preventDefault(); }}>
                                {
                                    this.state.fbError ?
                                        <div className="alert alert-danger">{this.state.fbError.message}</div> :
                                        undefined
                                }
                                <div className="row mx-0 w-100 px-1">
                                    <input type="text"
                                        className="form-control form-control-sm mx-auto col-8"
                                        id="inputBox"
                                        value={this.state.name}
                                        onInput={evt => this.setState({ name: evt.target.value })}
                                        placeholder="add task"
                                    />
                                    <select className="col-4" id="inputBox" value={this.state.roommate} onChange={evt => this.setState({ roommate: Number(evt.target.value) })}>
                                        {rooms.length == 0 ?
                                            <option disabled selected value> Please Submit a Roommmate to Begin </option> :
                                            rooms
                                        }
                                    </select>
                                </div>
                                {/* {rooms.length == 0 || this.state.name.trim() == "" ?
                                    <input type="submit" value="Submit" className="btn btn-primary" disabled /> :
                                    <input type="submit" value="Submit" className="btn btn-primary" />
                                } */}
                                <div className="row mx-auto px-1">
                                    <h4 className="col text-center m-auto" id="newCardButton" style={redButton}
                                        onClick={() => this.handleCancelAdd()}>cancel</h4>
                                    {
                                        rooms.length != 0 && this.state.name.trim() != "" ?
                                        <h4 className="col text-center m-auto" className="newCardButton" style={greyButtonActive}
                                        onClick={(evt) => this.handleSubmit(evt)}>add</h4>
                                        :
                                        <h4 className="col text-center m-auto" className="newCardButton" style={greyButton}>add</h4>
                                    }
                                </div>
                            </form>
                            {
                                this.state.errMsg ?
                                    <p className="text-danger">
                                        {this.state.errMsg}
                                    </p> :
                                    <div></div>
                            }
                        </div>
                        :
                        <div className="container d-flex justify-content-center my-3">
                            <i className="material-icons" id="addIcon"
                                onClick={() => this.setState({ addActive: true })}> add_circle_outline</i>
                        </div>
                }
                <div ref="listEnd"></div>
            </div>
        );
    }
}