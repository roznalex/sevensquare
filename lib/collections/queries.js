Queries = new Mongo.Collection('queries');

Queries.allow({
    update: ownsDocument,
    remove: ownsDocument
});

Meteor.methods({
    addQuery: function(query) {
        check(Meteor.userId(), String);
        check(query, {
            place: String,
            latitude: Number,
            longtitude: Number,
            distance: String,
            date: String
        });
        var user = Meteor.user();
        var extendedQuery = _.extend(query, {
            userId: user._id});
        var id = Queries.insert(extendedQuery);
        return {
            _id: id
        };
    }
});