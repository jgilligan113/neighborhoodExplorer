
//init firebaseapp
var config = {
    apiKey: "AIzaSyASg1TVyLnJi2SgnqEGX0lqgy4vKY0ViYg",
    authDomain: "neighborhoodexplorer-b82d5.firebaseapp.com",
    databaseURL: "https://neighborhoodexplorer-b82d5.firebaseio.com",
    storageBucket: "neighborhoodexplorer-b82d5.appspot.com",
    messagingSenderId: "852891560151"
  };
  firebase.initializeApp(config);

//global variables

var placesAddress ='';
var cityStateZip = '';
var city = '';
var state = '';
var streetAddress = '';
var neighborhood = '';
var database = firebase.database();
database.ref().on("child_added", function(childSnapshot){
 var obj = childSnapshot.val();
  console.log(obj);
  $('#myTable thead:last').after('<tr><td>'+ obj.streetAddress2 +'</td><td>'+ obj.city2 +'</td><td>'+ obj.state2 +'</td><td>'+ obj.neighborhood2+'</td>');
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});
//get map
 function initAutocomplete() {

         var map = new google.maps.Map(document.getElementById('map'), {
           center: {lat: 32.0812053, lng: -81.0934179},
           zoom: 13,
           mapTypeId: 'roadmap'
         });

         // Create the search box and link it to the UI element.
         var input = document.getElementById('pac-input');
         //console.log(input);
         var searchBox = new google.maps.places.SearchBox(input);
         //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

         // Bias the SearchBox results towards current map's viewport.
         map.addListener('bounds_changed', function() {
           searchBox.setBounds(map.getBounds());
           //console.log("singh-----------"+map.getBounds());
         });

         var markers = [];
         // Listen for the event fired when the user selects a prediction and retrieve
         // more details for that place.
         searchBox.addListener('places_changed', function() {
           var places = searchBox.getPlaces();
           placesAddress = places[0].formatted_address;
           console.log(placesAddress);
           test111(placesAddress);


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
           event.preventDefault();
         });
       }
       //$(document).on('click', '#search', function getGoogleData(){
       function test111(placesAddress){
        console.log("inside test finction");
       //event.preventDefault();
       console.log("Address 1" + placesAddress);
       var placesAddressFormatted = placesAddress.replace(/ /g, "+");
       console.log ("Address formatted " + placesAddressFormatted);
       $(".progress").css('display', 'block');

     //api call to google

      var queryURLGoogle = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ placesAddressFormatted +'&key=AIzaSyCm1RMUd3GGzW25X_Vl463MG-qlQ_CEkQg';
      console.log(queryURLGoogle);



      var myAjaxCall = $.ajax({
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

           var city = response1.results[0].address_components[cityIndex].long_name;
           var state = response1.results[0].address_components[stateIndex].long_name;

           var cityStateZip = response1.results[0].address_components[cityIndex].long_name.replace(/ /g, "+")  + "+" +
                             response1.results[0].address_components[stateIndex].long_name.replace(/ /g, "+")  + "+" +
                             response1.results[0].address_components[zipIndex].long_name;
           console.log("Here it is!!!! "+cityStateZip);

           getZillowData(city, state, streetAddress, cityStateZip);
         });
//end of on-click for initial search parameters
  //});
}

    function getZillowData(city, state, streetAddress, cityStateZip) {
    $('.sourceInfo').html("");
    console.log(streetAddress);
    console.log()

     // Event listener for all button element
     $.ajaxPrefilter(function(options) {
         if (options.crossDomain && jQuery.support.cors) {
             options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
         }
     });
console.log('http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19b7ds3exor_305s0&state='+state+'&city='+city+'&childtype=neighborhood');
console.log('http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz19b7ds3exor_305s0&address='+streetAddress+'&citystatezip='+cityStateZip);
console.log('http://api.wunderground.com/api/2d160d5a7d89cd60/geolookup/conditions/q/'+state+'/'+city+'.json');

//get list of neighborhoods for address entered using api call to zillow using Region Children url
     $.ajax({
             dataType: "xml",
             url: 'http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19b7ds3exor_305s0&state='+state+'&city='+city+'&childtype=neighborhood',
             method: "GET"
         })
         // After the data comes back from the API
         .done(function(response2) {
           console.log(response2);
           var jsonData = $.xml2json(response2);
                var parsedResult = jsonData["#document"]["RegionChildren:regionchildren"].response.list;
                console.log(parsedResult); //Look in console.
                console.log(streetAddress, cityStateZip);
                console.log(parsedResult.region[0].name);

                $('#neighborhoods').on('click', function(){
                     event.preventDefault();
                     $('.sourceInfo').html("");
                     var listDiv = $("<div>");
                     listDiv.html('<h5>Neighborhoods of '+city+'</h5>');
                     for (i=0; i<parsedResult.region.length; i++){
                     var neighborhoodList = '<li>'+parsedResult.region[i].name+'</li>';
                     listDiv.append(neighborhoodList);
                     $('.sourceInfo').html(listDiv)
                     console.log(neighborhoodList);
                   }
                });

                $('#weather').on('click', function(){
                event.preventDefault();

                $.ajax({
                    url : 'http://api.wunderground.com/api/2d160d5a7d89cd60/geolookup/forecast/q/'+state+'/'+city+'.json',
                    method: 'GET'
                    }).done(function (weather){
                      console.log('F High------------'+weather.forecast.simpleforecast.forecastday[0].high.fahrenheit);
                      console.log('C High------------'+weather.forecast.simpleforecast.forecastday[0].high.celsius);
                      console.log('F Low-------------'+weather.forecast.simpleforecast.forecastday[0].low.fahrenheit);
                      console.log('C Low-------------'+weather.forecast.simpleforecast.forecastday[0].low.celsius);
                      console.log('conditions-------------'+weather.forecast.txt_forecast.forecastday[0].fcttext);
                      $('#city').text(city);
                      $('#high').text(weather.forecast.simpleforecast.forecastday[0].high.fahrenheit);
                      $('#low').text(weather.forecast.simpleforecast.forecastday[0].low.fahrenheit);
                      $('#conditions').text(weather.forecast.txt_forecast.forecastday[0].fcttext);
                      $('#modal2').modal('open');
                      });

                  });
              });
                $.ajax({
                        dataType: "xml",
                        url: 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz19b7ds3exor_305s0&address='+streetAddress+'&citystatezip='+cityStateZip,
                        method: "GET"
                    })
                    // After the data comes back from the API - this is hte zillow deep search results where we get details on specific address.
                    .done(function(response3) {
                      console.log(response3);
                      $(".progress").css('display', 'none');
                      var jsonData2 = $.xml2json(response3);
                           var parsedResultError = jsonData2["#document"]["SearchResults:searchresults"].message.text;
                           if (parsedResultError == 'Error: no exact match found for input address') {
                             alert("Error, no exact match for address");
                             //var message = 'Sorry, there is not an exact match for the address';
                              $('#modal1').modal('open');
                              //$('.modal-content').find('p').text(message);

                           console.log(parsedResultError);
                         } else {
                           var parsedResult2 = jsonData2["#document"]["SearchResults:searchresults"].response.results.result;

                             console.log(parsedResult2);
                             var streetAddress2 = parsedResult2.address.street;
                             var city2 = parsedResult2.address.city;
                             var state2 = parsedResult2.address.state;
                             console.log(streetAddress);
                             var bedrooms = parsedResult2.bedrooms;
                             var bathrooms = parsedResult2.bathrooms;
                             var lastSold = parsedResult2.lastSoldPrice._;
                             var sqrFt = parsedResult2.finishedSqFt;
                             var neighborhood2 = parsedResult2.localRealEstate.region.$.name;
                             var comps = parsedResult2.links.comparables;
                             var data = parsedResult2.links.graphsanddata;
                             var details = parsedResult2.links.homedetails;
                             var map = parsedResult2.links.mapthishome;
                             console.log(neighborhood2);
                             var addressDetails = $("<div>").attr("class", "addressDetails");
                             addressDetails.html('<h5>Home Details</h5><p>Bedrooms: '+bedrooms+'<br>Bathrooms: '+bathrooms+'<br>Finished Square Feet: '+sqrFt+'<br>Last Sold for: $'+lastSold+'<br>Neighborhood: '+neighborhood2+'</p>');
                             $('.sourceInfo').html("");
                             $('.sourceInfo').append(addressDetails);

                             database.ref().push({
                                streetAddress2 : streetAddress2,
                                city2 : city2,
                                state2 : state2,
                                neighborhood2 : neighborhood2,
                                dateAdded : firebase.database.ServerValue.TIMESTAMP

                               });


                           }
                         });
                       }
//Allow the modal to be triggered
$(document).ready(function(){
// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
// $('#noMatch').hide();
  });
