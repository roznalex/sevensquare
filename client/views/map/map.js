var KIEV_COORDINATES = {
    lat: 50.4501,
    lng: 30.5234
};

Template.map.helpers({
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            return {
                center: KIEV_COORDINATES,
                zoom: 12
            };
        }
    }
});

Template.map.onCreated(function() {
    GoogleMaps.ready('googleMap', function(map) {
        var mapInstance = map.instance;
        var ICON = 'img/marker-icon.png';
        var markers = [];

        var marker = addMarker(KIEV_COORDINATES, mapInstance, 'You are here', ICON);

        Session.set('currentMarker', KIEV_COORDINATES);

        Tracker.autorun(function() {
            createMarkers();
        });

        function createMarkers() {
            var venues = Venues.find().fetch();
            removeMarkers(markers);

            markers = _.map(venues, function(venue) {
                var position = new google.maps.LatLng(venue.location.lat, venue.location.lng);
                return addMarker(position, mapInstance, venue.name);
            });
        }

        function addMarker(position, map, title, icon) {
            return new google.maps.Marker({
                position: position,
                map: map,
                title: title,
                icon: icon
            });
        }

        function removeMarkers(markers) {
            _.each(markers, function(marker) {
                marker.setMap(null);
            });
        }

        google.maps.event.addListener(mapInstance, 'click', function(e) {
            marker.setMap(null);
            marker = addMarker(e.latLng, mapInstance, 'You are here', ICON);
            Session.set('currentMarker', {lat: e.latLng.lat(), lng: e.latLng.lng()});
        });
    });
});