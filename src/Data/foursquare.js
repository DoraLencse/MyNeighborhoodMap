import { CLIENT_ID, CLIENT_SECRET, VERSION } from '../Data/authentication';
import * as data from '../Data/locations.json';


// Sending request to Foursquare to get a photo of the location

//ll=47.4953404,19.0727711

export const fsqRequest = () => {
	
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
}