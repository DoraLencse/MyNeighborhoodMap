import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { GoogleApiWrapper } from 'google-maps-react';
import allLocations from './Icons/icons8-paste-special-40.png';
import Family from './Icons/icons8-family-40.png';
import Us from './Icons/icons8-romance-40.png';
import Me from './Icons/icons8-female-profile-40.png';
import Pizza from './Icons/icons8-pizza-40.png';
import Zoo from './Icons/icons8-elephant-40.png';
import Woman from './Icons/icons8-hair-dryer-40.png';
import Train from './Icons/icons8-steam-engine-40.png';
import PlayingGround from './Icons/icons8-playground-40.png';

export default class MapContainer extends Component {
	
	state={
		locations: [
          {title: 'Riso Restaurant', icon: Pizza, info: 'My favourite italian restaurant in Budapest', type: 'us', location: {lat: 47.5059025, lng: 19.0290468}},
          {title: 'Budapest Zoo', icon: Zoo, info: 'Great Place for the whole Family', type: 'Family', location: {lat: 47.5189977, lng: 19.0754546}},
          {title: 'Podoben Hair Salon', icon: Woman, info: 'Kriszta is a great Hairdresser', type: 'Me', location: {lat: 47.4756723, lng: 19.0459695}},
          {title: 'Vuk Playground', icon: PlayingGround, info: 'Great Place for Kids', type: 'Family', location: {lat: 47.4864953, lng: 19.0401898}},
	      {title: 'Children Railway', icon: Train, info: 'Great place for the whole Family', type: 'Family', location: {lat: 47.4978666, lng: 18.964126}}
        ],
		
		query: '',
		markers: [],
		filteredMarker: [],
		infowindow: new this.props.google.maps.InfoWindow()		
	}

  componentDidMount() {
    this.loadMap()
	this.onClickLocation()
	
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
  onClickLocation = () => {
	 const that = this
	 const {infowindow} = this.state
	 const {markers} = this.state
	 
	 const displayInfowindow = (e) => {
		 const {markers} = this.state
		 const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
		 that.populateInfoWindow(markers[markerInd], infowindow)
		 
	 }
	 document.querySelector('.location-list').addEventListener('click', function (e) {
		 if(e.target && e.target.nodeName === "LI") {
			 displayInfowindow(e);
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
		}	
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

   populateInfoWindow = (marker, infowindow) => {
    //const defaultIcon = this.state.locations.icon;
    if (infowindow.marker !== marker) {
    infowindow.marker = marker;
	infowindow.setContent('<h3>' + marker.title + '</h3>' + '<h4>' + marker.info + '</h4>')
      infowindow.open(this.map, marker);
	  
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function () {
      infowindow.marker = null;
      });
    }
  }
  
  render() {
    const {markers} = this.state
	
    return (
        <div className="container">	  
          <div className="search-bar">
		    <li className="all"><img src={allLocations} title="all places"/></li>
			<li className="Family"><img src={Family} title="Places for Family"/></li>
			<li className="Us"><img src={Us} title="Places for Dates"/></li>
			<li className="Me"><img src={Me} title="Places for Me"/></li>
		  </div>            
          <div className="list-bar">
		   <ul className="location-list">{
			  markers.map( (marker, index) =>
		     (<li key={index}>{marker.title}</li>))
		   }</ul>
          </div>			  
          <div role="application" className="map" ref="map">
            loading map...
          </div>		
      </div>
    )
  }
}