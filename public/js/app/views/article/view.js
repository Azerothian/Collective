define(['underscore', 'jquery', 'jsui/controls/Templated',
    'text!templates/article/view.html'],
    function (_, $, TemplateControl, template) {
        return TemplateControl.extend({
            events: {
                //'click button#btnSave': 'btnSave_OnClick'
            },
            SetDataSource: function (source) {
                console.log("SET DATA");
                this.DataSource = source;
                
                var tmpl = this.viewTemplate({ 
                    id: this.DataSource.get("_id"), 
                    title: this.DataSource.get("title"),
                    segments: 5,  
                });
                
                $(this.el).html(tmpl);
            },

            OnInitialise: function () {
                //_.bindAll(this, 'btnClose_OnClick'); // fixes loss of context for 'this' within methods
                this.viewTemplate = _.template(template);
            },
            OnCreateControl: function (name, control) {

               
            },
            OnAfterRender: function () {
               
            },
            OnDispose: function () {
                //   this.modelBinder.unbind();
            }


        });
    });

