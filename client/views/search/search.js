Template.search.helpers({
    venuesLength: function() {
        return Venues.find().count() > 0
    }
});

Template.search.events({
    'click #submit-btn': function(event) {
        event.preventDefault();
        var currentMarker = Session.get('currentMarker'),
            venues,
            params = {
            query: $('#query').val(),
            radius: $('#radius').val() || 1000,
            limit: 10,
            ll: currentMarker.lat + ',' + currentMarker.lng
            },
            query = {
                place: $('#query').val(),
                latitude: currentMarker.lat,
                longtitude: currentMarker.lng,
                distance: $('#radius').val(),
                date: moment().format('MMM D, LT')
            };
        var validateAnswer = validate(params);

        if(validateAnswer !== true) {
            return sAlert.info(validateAnswer);
        }

        Foursquare.find(params, function(error, result) {
            if(error) {
                return error;
            }

            venues = result.response.venues;

            if (venues.length === 0) {
                return sAlert.info('We did not find anything in this radius', {timeout: 2000});
            }

            if(Venues.find().count() > 0) {
                Venues.remove({});
            }
            addVenues(venues);
            addQueryToHistory(query);
            clearFields();
        });

        function addVenues(venues) {
            _.each(venues, function(venue) {
                Venues.insert(venue);
            });
        }

        function addQueryToHistory(query) {
            Meteor.call('addQuery', query, function(error) {
                if (error)
                    return alert(error.reason);
            });
        }

        function validate(params) {
            if(!(params.query).trim()) {
                return 'Query field cannot be empty';
            }

            if(isNaN(params.radius)) {
                return 'Radius cannot be a string';
            }
            return true;
        }

        function clearFields() {
            $('#query').val('');
            $('#radius').val('');
        }
    }
});


