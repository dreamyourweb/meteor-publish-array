Meteor.publishArray = (name, collection, options, func) => {
    let {interval: interval = 10000, idField: idField = "_id"} = options;
    let intervalHandle;

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
                        ids.remove(id);
                    }
                });
            }

            pub.ready();
        };

        intervalHandle = Meteor.setInterval(() => {
            refresh();
        }, interval);

        this.onStop = () => {
            Meteor.clearInterval(intervalHandle);
            return true;
        };

    });

};
