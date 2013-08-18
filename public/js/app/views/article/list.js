define(['underscore', 'jquery', 'jsui/controls/Templated',
    'text!templates/article/list.html', 'collections/articles',
    'css!bootstrap/dist/css/bootstrap', 'bootstrap/dist/js/bootstrap'],
    function (_, $, TemplateControl, template, Articles) {
        return TemplateControl.extend({
            ctlArticleView: {},
            collection: {},
            events: {
                //'click button#btnSave': 'btnSave_OnClick'
            },

            OnInitialise: function () {
                //_.bindAll(this, 'btnClose_OnClick'); // fixes loss of context for 'this' within methods
                this.template = template;
                this.collection = new Articles();
                this.collection.fetch();
                //   this.model.
            },
            OnCreateControl: function (name, control) {
                if(name == "ctlArticleView")
                {
                    this.ctlArticleView = control;    
                
                }
               
            },
            OnAfterRender: function () {
               
            },
            OnDispose: function () {
                //   this.modelBinder.unbind();
            }


        });
    });

