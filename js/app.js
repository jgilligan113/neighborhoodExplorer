//init firebaseapp
var config = {
    apiKey: "AIzaSyASg1TVyLnJi2SgnqEGX0lqgy4vKY0ViYg",
    authDomain: "neighborhoodexplorer-b82d5.firebaseapp.com",
    databaseURL: "http://neighborhoodexplorer-b82d5.firebaseio.com",
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
//populate recent searches from firebase
// database.ref().on("child_added", function(childSnapshot){
//  var obj = childSnapshot.val();
//   //build the recent searches table
//   $('#myTable thead:last').after('<tr><td>'+ obj.streetAddress2 +'</td><td>'+ obj.city2 +'</td><td>'+ obj.state2 +'</td><td>'+ obj.neighborhood2+'</td>');
// }, function(errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });
//populate recent searches from firebase and limit to the last 10 searches
database.ref().orderByChild('dateAdded').limitToLast(20).on('child_added', function(childSnapshot1){
  var obj = childSnapshot1.val();

 console.log(obj);
// build the recent searches table
  $('#myTable thead:last').after('<tr><td>'+ obj.streetAddress2 +'</td><td>'+ obj.city2 +'</td><td>'+ obj.state2 +'</td><td>'+ obj.neighborhood2+'</td>');

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});


//get initial autocomplete functionality on seach and produce google map of input
 function initAutocomplete() {
         //create map variable and places map in the div with id 'map'
         var map = new google.maps.Map(document.getElementById('map'), {
           //changed to center map on Savannah
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
           //console.log(placesAddress);
           getGoogleGeo(placesAddress);

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
       function getGoogleGeo(placesAddress){
       //console.log("inside test function");
       //event.preventDefault();
       //console.log("Address 1" + placesAddress);
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
             if (response1.results[0].address_components[i].types[0] == "street_number") {
               var streetNoIndex = i;
               console.log("This is the street no: "+streetNoIndex);
             }
             else if (response1.results[0].address_components[i].types[0] == "route") {
               var routeIndex = i;
               console.log("This is the street: "+routeIndex);
             }

              else if (response1.results[0].address_components[i].types[0] == "locality") {
                var cityIndex = i;
                console.log("This is the city: " +cityIndex);
              }
                else if
                  (response1.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                    var stateIndex = i;
                    console.log("This is the state: "+stateIndex);
                  }
                  else if
                    (response1.results[0].address_components[i].types[0] == "postal_code") {
                      var zipIndex = i;
                      console.log("This is the zipcode: "+zipIndex);
                    }
               else { console.log("I can't find it")};

           };

           //console.log(response1.results[0].address_components[0].long_name);
           //console.log(response1.results[0].address_components[1].long_name);
           //console.log(response1.results[0].address_components[cityIndex].long_name);
           //console.log(response1.results[0].address_components[stateIndex].long_name);
           //console.log(response1.results[0].address_components[zipIndex].long_name);
           if (streetNoIndex > -1 && routeIndex > -1) {
           var streetAddress = response1.results[0].address_components[streetNoIndex].long_name + "+" +
                               response1.results[0].address_components[routeIndex].long_name.replace(/ /g, "+");
           console.log(streetAddress);
         } else {
           console.log("Ain't no street in here.");

         }
         if (cityIndex > -1 ) {
           var city = response1.results[0].address_components[cityIndex].long_name;
         } else {console.log("no city");}

         if (stateIndex > -1 ) {
           var state = response1.results[0].address_components[stateIndex].long_name;
         } else {console.log("no state");

       }
           if (zipIndex > -1 ) {
           var zip =  response1.results[0].address_components[zipIndex].long_name;
         } else {console.log("no zip");}

         if (cityIndex > -1 && stateIndex > -1) {
           getZillowData1(city, state);
         } else {console.log("can't run the zillow1 wiffout this stuff we need.");

                  $(".progress").css('display', 'none');
                  $("#homesForSale").addClass("disabled");
                  $('#modal3').modal('open');
                  return;
       }

           if (cityIndex > -1 && stateIndex > -1 && zipIndex > -1 ) {
           var cityStateZip = response1.results[0].address_components[cityIndex].long_name.replace(/ /g, "+")  + "+" +
                             response1.results[0].address_components[stateIndex].long_name.replace(/ /g, "+")  + "+" +
                             response1.results[0].address_components[zipIndex].long_name;
           console.log("Here it is!!!! "+cityStateZip);


           getZillowData2(city, state, streetAddress, cityStateZip);

         } else {console.log ("Something is missing here!");
                $("#homesForSale").addClass("disabled");
                $('#modal1').modal('open');
       }

       $('#weather').on('click', function() {
           $.ajax({
             url : 'http://api.wunderground.com/api/2d160d5a7d89cd60/forecast10day/q/'+state+'/'+city+'.json',
             method: 'GET'
             }).done(function (weather){
               for (i=0; i<5; i++) {
               var weatherF = weather.forecast.txt_forecast.forecastday[i].fcttext;
               var altTxt = weather.forecast.txt_forecast.forecastday[i].icon;
               var image = weather.forecast.txt_forecast.forecastday[i].icon_url;
               var day = weather.forecast.txt_forecast.forecastday[i].title;

               //add to the modal
               $('#city').text(city);
               var icon = $('<img>').attr('src', image);
               icon.attr('alt', altTxt);
               var details = $('<div>').html('<h6>'+day+'</h6><p>'+weatherF+'</p>');
               $('.weatherDetails').append(icon, details);
             }
               $('#modal2').modal('open');
               });
           });
       });

         };
//end of on-click for initial search parameters

    function getZillowData2(city, state, streetAddress, cityStateZip) {
    $('.sourceInfo').html("");
    //console.log(streetAddress);


     // Event listener for all button element
     $.ajaxPrefilter(function(options) {
         if (options.crossDomain && jQuery.support.cors) {
             options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
         }
     });
//console.log('http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19b7ds3exor_305s0&state='+state+'&city='+city+'&childtype=neighborhood');
console.log('http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz19b7ds3exor_305s0&address='+streetAddress+'&citystatezip='+cityStateZip);
//console.log('http://api.wunderground.com/api/2d160d5a7d89cd60/geolookup/conditions/q/'+state+'/'+city+'.json');

//get list of neighborhoods for address entered using api call to zillow using Region Children url
     $.ajax({
             dataType: "xml",
             url: 'https://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19b7ds3exor_305s0&state='+state+'&city='+city+'&childtype=neighborhood',
             method: "GET"
         })
         // After the data comes back from the API
         .done(function(response2) {
           //console.log(response2);
           var jsonData = $.xml2json(response2);
                var parsedResult = jsonData["#document"]["RegionChildren:regionchildren"].response.list;
                //console.log(parsedResult);

                $('#neighborhoods').on('click', function(){
                     event.preventDefault();
                     $('.sourceInfo').html("");
                     var listDiv = $("<div>");
                     listDiv.html('<h5>Neighborhoods of '+city+'</h5>');
                     for (i=0; i<parsedResult.region.length; i++){
                     var neighborhoodList = '<li>'+parsedResult.region[i].name+'</li>';
                     listDiv.append(neighborhoodList);
                     $('.sourceInfo').html(listDiv)
                     //console.log(neighborhoodList);
                   }
                });

              });
                $.ajax({
                        dataType: "xml",
                        url: 'https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz19b7ds3exor_305s0&address='+streetAddress+'&citystatezip='+cityStateZip,
                        method: "GET"
                    })
                    // After the data comes back from the API - this is hte zillow deep search results where we get details on specific address.
                    .done(function(response3) {
                      //console.log(response3);
                      $(".progress").css('display', 'none');
                      var jsonData2 = $.xml2json(response3);
                           var parsedResultError = jsonData2["#document"]["SearchResults:searchresults"].message.text;
                           if (parsedResultError == 'Error: no exact match found for input address') {
                             //var message = 'Sorry, there is not an exact match for the address';
                              $('#modal1').modal('open');
                              //$('.modal-content').find('p').text(message);

                           //console.log(parsedResultError);
                         } else {
                           var parsedResult2 = jsonData2["#document"]["SearchResults:searchresults"].response.results.result;

                             //console.log(parsedResult2);
                             var streetAddress2 = parsedResult2.address.street;
                             var city2 = parsedResult2.address.city;
                             var state2 = parsedResult2.address.state;
                             //console.log(streetAddress);
                             var bedrooms = parsedResult2.bedrooms;
                             var bathrooms = parsedResult2.bathrooms;
                             console.log(parsedResult2.lastSoldPrice);
                             console.log(parsedResult2);
                             var lastSold = '--';
                             if (typeof parsedResult2.lastSoldPrice !== 'undefined'){
                               lastSold = parsedResult2.lastSoldPrice._;
                             }

                             var sqrFt ='--';
                             if (typeof parsedResult2.finishedSqFt !== 'undefined'){
                               sqrFt = parsedResult2.finishedSqFt
                             }

                             var neighborhood2 = parsedResult2.localRealEstate.region.$.name;
                             var comps = parsedResult2.links.comparables;
                             var data = parsedResult2.links.graphsanddata;
                             var details = parsedResult2.links.homedetails;
                             var map = parsedResult2.links.mapthishome;
                             //console.log(neighborhood2);
                             var addressDetails = $("<div>").attr("class", "addressDetails");
                             addressDetails.html('<h5>Home Details</h5><p>Bedrooms: '+bedrooms+'<br>Bathrooms: '+bathrooms+'<br>Finished Square Feet: '+sqrFt+'<br>Last Sold for: $'+lastSold+'<br>Neighborhood: '+neighborhood2+'</p>');
                             $('.sourceInfo').html("");
                             $('.sourceInfo').append(addressDetails);
                             $('#homesForSale').on('click', function(){
                               var links = $('<div>').html(
                                 '<h5>Courtesy of Zillow</h5><a href="'+comps+'"target="_blank">Home Comps</a><br><a href="'+data+'"target="_blank">Area Graphs and Data</a><br><a href="'+details+'"target="_blank">Additional Details</a><br><a href="'+map+'"target="_blank">Map this home</a><br><img src="http://www.zillow.com/widgets/GetVersionedResource.htm?path=/static/logos/Zillowlogo_200x50.gif" alt="Zillow Real Estate Search" id="yui_3_18_1_1_1490097105280_373" height="50" width="200">'
                              );
                                $('.sourceInfo').empty();
                                $('.sourceInfo').append(links);
                             });

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

function getZillowData1(city, state) {
$('.sourceInfo').html("");
//console.log(streetAddress);
//console.log()

// Event listener for all button element
$.ajaxPrefilter(function(options) {
if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
}
});
//console.log('http://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19b7ds3exor_305s0&state='+state+'&city='+city+'&childtype=neighborhood');
//console.log('http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz19b7ds3exor_305s0&address='+streetAddress+'&citystatezip='+cityStateZip);
//console.log('http://api.wunderground.com/api/2d160d5a7d89cd60/geolookup/conditions/q/'+state+'/'+city+'.json');

//get list of neighborhoods for address entered using api call to zillow using Region Children url
$.ajax({
    dataType: "xml",
    url: 'https://www.zillow.com/webservice/GetRegionChildren.htm?zws-id=X1-ZWz19b7ds3exor_305s0&state='+state+'&city='+city+'&childtype=neighborhood',
    method: "GET"
})
// After the data comes back from the API
.done(function(response2) {
  //console.log(response2);
  var jsonData = $.xml2json(response2);
  console.log(response2);
       var parsedResult = jsonData["#document"]["RegionChildren:regionchildren"].response.list;
       console.log(parsedResult);
       $(".progress").css('display', 'none');
       //console.log(parsedResult); //Look in console.
       //console.log(streetAddress, cityStateZip);
       //console.log(parsedResult.region[0].name);

       $('#neighborhoods').on('click', function(){
            event.preventDefault();
            $('.sourceInfo').html("");
            var listDiv = $("<div>");
            listDiv.html('<h5>Neighborhoods of '+city+'</h5>');
            for (i=0; i<parsedResult.region.length; i++){
            var neighborhoodList = '<li>'+parsedResult.region[i].name+'</li>';
            listDiv.append(neighborhoodList);
            $('.sourceInfo').html(listDiv)
            //console.log(neighborhoodList);
          }
       });

            database.ref().push({
               street2: "--",
               city2 : city,
               state2 : state,
               zip2 : "--",
               dateAdded : firebase.database.ServerValue.TIMESTAMP
             });
          });
        }
//Allow the modal to be triggered
$(document).ready(function(){
// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  });
