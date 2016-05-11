Template.app.helpers({
    queriesLength: function() {
        return Queries.find().count() > 0
    },
    venuesLength: function() {
        return Venues.find().count() > 0
    }
});