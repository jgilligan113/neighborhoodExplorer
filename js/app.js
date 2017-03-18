  //var input = "";
  //get map
  var placesAddress ='';
  function initAutocomplete() {
          var map = new google.maps.Map(document.getElementsByClassName('map'), {
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
        $(document).on('change', '#pac-input', function(){
        console.log("Address 1" + placesAddress);
      });
      //api call to google

      // var queryURLGoogle = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ input +'&key=AIzaSyCm1RMUd3GGzW25X_Vl463MG-qlQ_CEkQg';
      // console.log(queryURLGoogle);
      //
      // $.ajax({
      //         url: queryURLGoogle,
      //         method: "GET"
      //     })
      //     .done(function(response1) {
      //       console.log(response1);
      //
      //
      //     });
      //
      // // Event listener for all button element
      // $.ajaxPrefilter(function(options) {
      //     if (options.crossDomain && jQuery.support.cors) {
      //         options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
      //     }
      // });
      //
      // $.ajax({
      //         dataType: "xml",
      //         url: 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz19b7ds3exor_305s0&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA',
      //         method: "GET"
      //     })
      //     // After the data comes back from the API
      //     .done(function(response) {
      //         var jsonData = $.xml2json(response);
      //         var parsedResult = jsonData["#document"]["SearchResults:searchresults"].response.results.result;
      //         console.log(parsedResult); //Look in console.
      //         var neighborhood = JSON.stringify(parsedResult.localRealEstate.region.$.name);
      //         console.log(neighborhood);
      //     });

