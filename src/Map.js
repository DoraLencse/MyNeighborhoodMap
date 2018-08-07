import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import allLocations from './Icons/icons8-paste-special-40.png';
import Family from './Icons/icons8-family-40.png';
import Us from './Icons/icons8-romance-40.png';
import Me from './Icons/icons8-female-profile-40.png';
import Pizza from './Icons/icons8-pizza-40.png';
import Zoo from './Icons/icons8-elephant-40.png';
import Woman from './Icons/icons8-hair-dryer-40.png';
import Train from './Icons/icons8-steam-engine-40.png';
import PlayingGround from './Icons/icons8-playground-40.png';

import { CLIENT_ID, CLIENT_SECRET, VERSION } from './Data/authentication';

export default class MapContainer extends Component {
	
	
	state={
		locations: [
        {name: 'Riso Ristorante & Terrace', title: 'Riso Restaurant', icon: Pizza, info: 'My favourite italian restaurant in Budapest', type: 'us', location: {lat: 47.5059025, lng: 19.0290468}},
          {name: 'Fővárosi Állat- és Növénykert', title: 'Budapest Zoo', icon: Zoo, info: 'Great Place for the whole Family', type: 'Family', location: {lat: 47.5189977, lng: 19.0754546}},
          {name: 'Podoben Hair Salon', title: 'Podoben Hair Salon', icon: Woman, info: 'Kriszta is a great Hairdresser', type: 'Me', location: {lat: 47.4756723, lng: 19.0459695}},
          {name: 'Vuk játszótér', title: 'Vuk Playground', icon: PlayingGround, info: 'Great Place for Kids', type: 'Family', location: {lat: 47.4864953, lng: 19.0401898}},
	      {name: 'Gyermekvasút - Csillebérc', title: 'Children Railway', icon: Train, info: 'Great place for the whole Family', type: 'Family', location: {lat: 47.4978666, lng: 18.964126}}
		 
        ],
		
		markers: [],
		query: '',
		infowindow: new this.props.google.maps.InfoWindow()	
	}

  componentDidMount() {
    this.loadMap()
	this.onClickLocation()
	this.filterMarkers()
//	this.loadLocations()
  }

  loadMap() {
	  
    if (this.props && this.props.google) {
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      const mapConfig = Object.assign({}, {
        center: {lat: 47.4953404, lng: 19.0727711},
        zoom: 13,
        mapTypeId: 'roadmap'
      })

      this.map = new maps.Map(node, mapConfig)
	  this.addMarkers()
    }
  } 
  
  //function for clicking on the sidebar in order to show the selected location on the map
  //Based on the Udacity webinarP8 : https://www.youtube.com/watch?v=9t1xxypdkrE
  onClickLocation = () => {
	 const that = this
	 const {infowindow} = this.state
	 	 
	 const showInfowindow = (e) => {
		 const {markers} = this.state
		 const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
		 that.populateInfoWindow(markers[markerInd], infowindow)
		 
	 }
	 document.querySelector('.location-list').addEventListener('click', function (e) {
		 if(e.target && e.target.nodeName === "LI") {
			 showInfowindow(e);
		 }	   
	 })  
  }
   
  addMarkers = () => {
	const {google} = this.props
    let {infowindow} = this.state
    const bounds = new google.maps.LatLngBounds()
	
	
    this.state.locations.forEach((location, ind) => {	  
      const marker = new google.maps.Marker({
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        title: location.title,
		info: location.info,
		icon: location.icon,
		type: location.type,
		name: location.name,
		
		animation: google.maps.Animation.DROP
	  })  
	  
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
		 if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
			marker.setAnimation(null);
			}, 1500);
			this.map.setZoom(12);
			this.map.setCenter(marker.getPosition());
		}	
      })
      
 // get request of foursquare data
   var reqURL = 'https://api.foursquare.com/v2/venues/search?ll=47.4953404,19.0727711' + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=' + VERSION + '&query=' + marker.name + '&limit=1';

    fetch(reqURL)
	.then(response => response.json()) 
	.then(data => {
		console.log(data);
		data.response.venues.forEach((venue, i) => {
			if(venue.name === marker.name) {
			  marker.address = venue.location.address;
			  
            } else {
			  marker.address = "no data from Foursquare";
			  }			 
		  }) 
		})
		.catch(err => {
      console.log('Failed to fetch foursquare data', err)
    })

//foursquare part _ end
	
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
	
  }
  
 
//Handle value change on searh field
  handleValueChange = (e) => {
    this.setState({query: e.target.value})
  }
 
 //filter Markers by topic
 filterMarkers = (type) => {
	 
	 const {locations, markers, infowindow} = this.state
	 
	 if (type) {
      locations.forEach((l, i) => {
        if (l.type.toLowerCase().includes(type.toLowerCase())) {
          markers[i].setVisible(true);
		  this.map.setZoom(11);
		  this.map.setCenter({lat: 47.4953404, lng: 19.0727711});
        } else {
          if (infowindow.marker === markers[i]) {
            // close the info window if marker removed
            infowindow.close()
          }
          markers[i].setVisible(false)
        }
      })
    } else {
      locations.forEach((l, i) => {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true);
		  this.map.setZoom(12);
		  this.map.setCenter({lat: 47.4953404, lng: 19.0727711});
        }
      })
    }	
}

	
   //Set up infowindow
   populateInfoWindow = (marker, infowindow) => {
   const {google} = this.props
   
   let content = ('<h3>' + marker.title + '</h3>' +
                  '<h4>' + marker.info + '</h4>' + 
			      '<p>' + marker.address + '</p>');
   
    if (infowindow.marker !== marker) {
    infowindow.marker = marker;
	infowindow.setContent(content);
    infowindow.open(this.map, marker);
	this.map.setCenter(marker.getPosition());
	this.map.setZoom(19);
	marker.setAnimation(google.maps.Animation.BOUNCE); 
	    setTimeout(function() {
			marker.setAnimation(null);
			}, 1500);
     
	 // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function () {
      infowindow.marker = null;
      });
    }

  }
 

  render() {   
   const {locations, query, markers, infowindow} = this.state
   
   
 // filter markers with search field - inspired by P8 webinar:  https://www.youtube.com/watch?v=9t1xxypdkrE  
	if (query) {
      locations.forEach((l, i) => {
        if (l.title.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true)
		  this.map.setZoom(12);
        } else {
          if (infowindow.marker === markers[i]) {
            // close the info window if marker removed
            infowindow.close()
          }
          markers[i].setVisible(false)
        }
      })
    } else {
      locations.forEach((l, i) => {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true)
        }
      })
    }
  
    return (
	 
        <div className="container">	  
          <div className="search-bar">	
            <input className="search-tab"
		          role="search" 
                  aria-label="Search places by name"
                  tabIndex="0"
		          placeholder="type for search" 
		          type='text'
                  value={this.state.value}
                  onChange={this.handleValueChange}/>
				 		  
		    <li className="all"
			  tabIndex="0"
			  role="button" 
			  aria-label="filter all locations" 
			  title="all places" 
			  onClick={() => this.filterMarkers('')}>
			  <img src={allLocations} alt="show all locations on the map"/>
		    </li>
			  
			<li className="Family"
			  tabIndex="0"
			  role="button" 
			  aria-label="filter locations for Family" 
			  title="Places for Family"  
              onClick={() => this.filterMarkers('family')}>
			  <img src={Family} alt="show places for family"/>
		    </li>
			 
			<li className="Us"
			  tabIndex="0"
			  role="button" 
			  aria-label="filter locations for Celebration / Dates" 
			  title="Places for Dates" 
			  onClick={() => this.filterMarkers('us')}>
			  <img src={Us} alt="Show places for date"/>
			</li>
			
			<li className="Me"
			  tabIndex="0"
			  role="button" 
			  aria-label="filter locations for Woman / Me" 
			  title="Places for Me"
			  onClick={() => this.filterMarkers('me')}>
			  <img src={Me} alt="show places for woman"/></li>
		  </div> 
       			   
          <div className="list-bar">			
            <ul className="location-list">{
              markers.filter(marker => marker.getVisible()).map((marker, index) =>
                (<li key={index}>{marker.title}</li>))
            }</ul>
          </div>			  
          <div role="application" className="map" ref="map">
            Your map is loading ...
          </div>		
      </div>
    )
  }
}

