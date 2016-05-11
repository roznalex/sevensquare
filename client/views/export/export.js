Template.export.events({
    'click #export': function(e) {
        e.preventDefault();
        var venues = Venues.find({}, {
            fields: {
                name: true,
                'location.city': true,
                'location.crossStreet': true,
                'location.lat': true,
                'location.lng': true,
                _id: false
            }})
            .fetch();

        var convertedVenues = toCSV(venues);
        var uri ="data:text/csv;charset=utf8," + encodeURIComponent(convertedVenues);
        download(uri, 'venues');


        function wrap(value) {
            switch (typeof value) {
                case "undefined":
                    return ' " " ';
                break;

                case "string":
                    return '"' + value + '"';

                default:
                    return value;
            }
        }

        function convertVenue(venue) {
            var keys = _.keys(venue);
            return _.map(keys, function(key) {
                if(_.isObject(venue[key])) {
                    return convertVenue(venue[key]);
                }
                return wrap(venue[key]);
            }).join(',');
        }

        function toCSV(venues) {
            return _.map(venues, function(venue){
                return convertVenue(venue);
            }).join('\n');
        }

        function download(uri, fileName) {
            var link = document.createElement("a");
            link.setAttribute("href", uri);
            link.setAttribute("download", fileName);
            link.click();
        }
    }
});