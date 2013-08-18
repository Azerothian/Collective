define(['backbone','underscore', 'model/article'], function(Backbone, _, articleModel, sockioLogic) {
    return Backbone.Collection.extend({
        model: articleModel,
        url: 'article',
        //socket: {},
        initialize: function() {
            _.bindAll(this, 'serverCreate', 'collectionCleanup');
            this.ioBind('create', this.serverCreate, this);
          //  this.socket = app.logic.Sockio.socket;
        },
        serverCreate: function(data) {
            // make sure no duplicates, just in case
            var exists = this.get(data.id);
            if (!exists) {
                this.add(data);
            }
            else {
                data.fromServer = true;
                exists.set(data);
            }
        },
        collectionCleanup: function(callback) {
            this.ioUnbindAll();
            this.each(function(model) {
                model.modelCleanup();
            });
            return this;
        }
    });


});