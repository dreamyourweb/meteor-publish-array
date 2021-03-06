Meteor.publishArray = function(name, collection, options, func) {
    let {interval: interval = 10000, idField: idField = "_id", refreshHandle} = options;
    let intervalHandle;

    let subscriptions = {};

    if (_.isObject(refreshHandle)) {
        refreshHandle.refresh = function() {
            _.each(subscriptions, function(sub, id) {
                sub.refresh();
            });
        };
    }

    return Meteor.publish(name, function(params) {
        let pub = this;
        let ids = new Set();
        let results;

        let refresh = () => {
            let currentIds = new Set();
            try {
                results = func.call(pub, params);
            } catch(error) {
                results = [];
                throw new Meteor.Error(error);
            }

            if (results) {
                results.forEach(result => {
                    let id = result[idField];
                    currentIds.add(id);
                    if (ids.has(id)) {
                        pub.changed(collection, id, result);
                    } else {
                        ids.add(id);
                        pub.added(collection, id, result);
                    }
                });

                ids.forEach(id => {
                    if (!currentIds.has(id)) {
                        pub.removed(collection, id);
                        ids.delete(id);
                    }
                });
            }

            pub.ready();
        };

        subscriptions[pub._subscriptionId] = {
            refresh: refresh
        };

        refresh();
        intervalHandle = Meteor.setInterval(() => {
            refresh();
        }, interval);

        this.onStop = () => {
            Meteor.clearInterval(intervalHandle);
            delete subscriptions[pub._subscriptionId];
            return true;
        };

    });

};
