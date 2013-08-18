
define(
    [
        'jquery'
        ,'underscore'
        ,'backbone'
        ,'socketio'
        ,'iobind'
        ,'iosync'
        ]
    , function(
        jquery
        ,underscore
        ,Backbone
        ,io
        ,iobind
        ,iosync
        ) {
        console.log("omg you guys!!")
        function SockioLogic() {
            
            this.initialise();
        }
        
        SockioLogic.prototype= {
            socket: {},
            initialise: function() {
                window.socket = io.connect('http://collective.azerothian.c9.io');

            }
            
        }
       // exports = SockioLogic;
        return SockioLogic;
    });
