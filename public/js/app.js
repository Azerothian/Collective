


var app = app || {};
app.Logic = app.Logic || {};

requirejs.config({
    baseUrl: '/js/lib',
    paths: {
        app: '/js/app',
        views: '/js/app/views',
        logic: '/js/app/logic',
        templates: '/js/app/templates',
        util: '/js/app/util',
        collections: '/js/app/data/collections',
        model: '/js/app/data/models',
        'jquery': 'jquery/jquery',
        'jquery-ui': 'jquery-ui/ui/jquery-ui',
        'underscore': 'underscore-amd/underscore',
        'backbone': 'backbone-amd/backbone',
        'text': 'requirejs-text/text',
        'css': 'require-css/css',
        'normalize': 'require-css/normalize',
        'iobind': 'backbone.iobind/backbone.iobind',
        'iosync': 'backbone.iobind/backbone.iosync',
        'socketio': '/socket.io/socket.io'
    },
    shim: {
        'socketio': {
            exports: 'io'
        },
        jquery: {
            exports: '$'
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        bootstrap: {
            deps: ['underscore']
        },
        Backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }

});
requirejs([
    'jquery',
    'underscore',
    'backbone',
    'jsui/jsui',
    'logic/sockio_c'
],
    function (
        $,
        _,
        Backbone,
        JSui,
        Sockio
    ) {
        console.log('App Starting up...');

        app.Logic.Sockio = new Sockio();
//        app.Logic.Ui = new UiLogic;
//        app.Data = new DataLogic;
        app.jsui = new JSui();

        app.jsui.start('body');

        var RouterLogic = Backbone.Router.extend({
            routes: {
                'l/:model/:func/:id': 'loadViewWithId'
                , 'l/:model/:func': 'loadView'
                 , '*actions': 'defaultRoute'
            },

            initialize: function () {
                console.log('Routes Initialised...');
            }
        });

        app.Logic.Router = new RouterLogic();

        app.Logic.Router.on('route:defaultRoute', function (actions) {
            //Default
            console.log('default', actions);
        });
        app.Logic.Router.on('route:loadViewWithId', function (model, func, id) {
            //Default

            requirejs(["views/" + model + "/" + func], function (view) {
                var v = new view();

                v.DataSource.set('Id', id);
                console.log("[/app/router/loadViewWithId]", model, func, id, v);
                app.jsui.root.addChild(model + func + id, v);
                app.Logic.Router.navigate("", false);
                return v;
            });
        });
        app.Logic.Router.on('route:loadView', function (model, func) {
            //Default
            app.Logic.Router.loadView(model, func);
            app.Logic.Router.navigate("", false);
        });
        app.Logic.Router.loadView = function (model, func, success) {
            requirejs(["views/" + model + "/" + func], function (view) {
                if(view === undefined)
                {
                    throw "View not able to execute: func: " + func + " model:" + model;
                }
                var v = new view();
                if (success) {
                    success(v);
                }
                console.log("[/app/router/loadView]", model, func, v);
                app.jsui.root.addChild(model + func, v);
                
            });

        };


        Backbone.history.start();
        app.Logic.Router.loadView("article", "list");
// INIT HERE

    });