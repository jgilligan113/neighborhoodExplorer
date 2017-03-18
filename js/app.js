//var input = "";
 //get map
 var placesAddress ='';
 function initAutocomplete() {
         var map = new google.maps.Map(document.getElementById('map'), {
           center: {lat: -33.8688, lng: 151.2195},
           zoom: 13,
           mapTypeId: 'roadmap'
         });

         // Create the search box and link it to the UI element.
         var input = document.getElementById('pac-input');
         console.log(input);
         var searchBox = new google.maps.places.SearchBox(input);
         map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

         // Bias the SearchBox results towards current map's viewport.
         map.addListener('bounds_changed', function() {
           searchBox.setBounds(map.getBounds());
           console.log("singh-----------"+map.getBounds());
         });

         var markers = [];
         // Listen for the event fired when the user selects a prediction and retrieve
         // more details for that place.
         searchBox.addListener('places_changed', function() {
           var places = searchBox.getPlaces();
           placesAddress = places[0].formatted_address;
           console.log(placesAddress);

           if (places.length == 0) {
             return;
           }

           // Clear out the old markers.
           markers.forEach(function(marker) {
             marker.setMap(null);
           });
           markers = [];

           // For each place, get the icon, name and location.
           var bounds = new google.maps.LatLngBounds();
           places.forEach(function(place) {
             if (!place.geometry) {
               console.log("Returned place contains no geometry");
               return;
             }
             var icon = {
               url: place.icon,
               size: new google.maps.Size(71, 71),
               origin: new google.maps.Point(0, 0),
               anchor: new google.maps.Point(17, 34),
               scaledSize: new google.maps.Size(25, 25)
             };

             // Create a marker for each place.
             markers.push(new google.maps.Marker({
               map: map,
               icon: icon,
               title: place.name,
               position: place.geometry.location
             }));

             if (place.geometry.viewport) {
               // Only geocodes have viewport.
               bounds.union(place.geometry.viewport);

             } else {
               bounds.extend(place.geometry.location);
             }
           });
           map.fitBounds(bounds);

         });
       }
       $(document).on('click', '#search', function(){
       console.log("Address 1" + placesAddress);
       var placesAddressFormatted = placesAddress.replace(/ /g, "+");
       console.log ("Address formatted " + placesAddressFormatted);


     //api call to google

      var queryURLGoogle = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ placesAddressFormatted +'&key=AIzaSyCm1RMUd3GGzW25X_Vl463MG-qlQ_CEkQg';
      console.log(queryURLGoogle);



      $.ajax({
            url: queryURLGoogle,
              method: "GET"
         })
         .done(function(response1) {
           console.log(response1);
//look thru object to find city, state and zip array index value

           for (i = 0; i < response1.results[0].address_components.length; i++ ) {

              if (response1.results[0].address_components[i].types[0] == "locality") {
                var cityIndex = i;
                console.log(cityIndex);
              }
                else if
                  (response1.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                    var stateIndex = i;
                    console.log(stateIndex);
                  }
                  else if
                    (response1.results[0].address_components[i].types[0] == "postal_code") {
                      var zipIndex = i;
                      console.log(zipIndex);
                    }

               else { console.log("I can't find it")};

           };

           console.log(response1.results[0].address_components[0].long_name);
           console.log(response1.results[0].address_components[1].long_name);
           console.log(response1.results[0].address_components[cityIndex].long_name);
           console.log(response1.results[0].address_components[stateIndex].long_name);
           console.log(response1.results[0].address_components[zipIndex].long_name);

           var streetAddress = response1.results[0].address_components[0].long_name + "+" +
                               response1.results[0].address_components[1].long_name.replace(/ /g, "+");
           console.log(streetAddress);
           var cityStateZip = response1.results[0].address_components[cityIndex].long_name.replace(/ /g, "+")  + "+" +
                             response1.results[0].address_components[stateIndex].long_name.replace(/ /g, "+")  + "+" +
                             response1.results[0].address_components[zipIndex].long_name;
           console.log(cityStateZip);
         });

     // Event listener for all button element
     $.ajaxPrefilter(function(options) {
         if (options.crossDomain && jQuery.support.cors) {
             options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
         }
     });

     $.ajax({
             dataType: "xml",
             zillowURL: 'https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz19b7ds3exor_305s0&address='+streetAddress+'&citystatezip='+cityStateZip,
             method: "GET"
         })
         // After the data comes back from the API
         .done(function(response2) {
           console.log(response2);
         });
// end of on click
      });
