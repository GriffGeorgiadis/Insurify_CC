import React from 'react';
import axios from 'axios';
import moment from 'moment';
import MaterialTable from 'material-table';
import Clock from 'react-live-clock';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDepartures: []
    };
    this.getSchedule = this.getSchedule.bind(this);
  }

  componentDidMount() {
    this.getSchedule();
  }

  getSchedule() {
    axios.get(`https://api-v3.mbta.com/predictions?filter[route_type]=2&include=schedule,stop,trip&filter[stop]=place-north`)
    .then((result) => {
      let predictionsArr = result.data.data;
      let includedArr = result.data.included;

      let filteredPredictionsArr = predictionsArr.filter((predict) =>
        predict.attributes.departure_time !== null
      )
      console.log('filter', filteredPredictionsArr);

      let departures = [];
      let trips = includedArr.filter((predict) => predict.type === 'trip');
      let stops = includedArr.filter((predict) => predict.type === 'stop');
      let schedules = includedArr.filter((predict) => predict.type === 'schedule');

      filteredPredictionsArr.forEach((predict) => {
        let predictObj = {};
        //Departure Time
        let scheduleId = predict.relationships.schedule.data.id;
        let scheduleInfo = schedules.find((schedule) => schedule.id === scheduleId);
        predictObj.departureTime = moment(scheduleInfo.attributes.departure_time).format('LT');

        //Destination of the train
        predictObj.destination = predict.relationships.route.data.id;

        //Train #
        let tripId = predict.relationships.trip.data.id;
        let tripInfo = trips.find((trip) => trip.id === tripId);
        predictObj.trainNum = tripInfo.attributes.name;

        //Track the train will be one
        let stopId = predict.relationships.stop.data.id;
        let stopInfo = stops.find((stop) => stop.id === stopId);
        predictObj.track = (stopInfo.attributes.platform_code ? stopInfo.attributes.platform_code : 'TBD');

        //Current Status of the train
        predictObj.status = predict.attributes.status;
        //push to departure array
        departures.push(predictObj);

      })
      //store in reverse chronological order
      departures.sort((a, b) => a.departure_time - b.departure_time);
      this.setState({
        currentDepartures: departures
      })
      console.log('hello', departures);
    })
    .catch((err) => {
      console.log(err);
    });
  }


  render() {
    let columns = [
      { title: 'Time', field: 'departureTime' },
      { title: 'Destination', field: 'destination' },
      { title: 'Train #', field: 'trainNum' },
      { title: 'Track', field: 'track' },
      { title: 'Status', field: 'status' },
    ];
    return (
      <div className="App">
        <h1>North Station</h1>
        <h3>Current Time</h3>
        <div className="currentTime">
          <Clock format={'MMMM Do YYYY, h:mm:ss A'} ticking={true} timezone={'US/Eastern'} />
        </div>
        <div className="table">
          <MaterialTable title="Departures" data={this.state.currentDepartures} columns={columns} options={{search: false, paging: false}} />
        </div>
      </div>
    );
  }
}

export default App;
