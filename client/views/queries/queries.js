Template.queries.helpers({
    queries: function () {
        return Queries.find();
    },
    ownsDocument: function() {
    return this.userId == Meteor.userId();
    }
});

Template.queries.events({
    'click #delete': function() {
        if(confirm('Are you sure?'))
        Queries.remove(this._id);
    }
});