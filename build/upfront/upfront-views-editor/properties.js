!function(e,t){define(["scripts/upfront/upfront-views-editor/property","text!upfront/templates/properties.html"],function(e,r){return t.View.extend({events:{"click #add-property":"show_new_property_partial","click #done-adding-property":"add_new_property"},initialize:function(){this.listenTo(this.model.get("properties"),"change",this.render),this.listenTo(this.model.get("properties"),"add",this.render),this.listenTo(this.model.get("properties"),"remove",this.render)},render:function(){var t=_.template(r,this.model.toJSON()),n=this;this.$el.html(t),this.model.get("properties").each(function(t){var r=new e({model:t});r.render(),n.$el.find("dl").append(r.el)})},show_new_property_partial:function(){this.$("#add-property").hide(),this.$("#upfront-new_property").slideDown()},add_new_property:function(){var e=this.$("#upfront-new_property-name").val(),t=this.$("#upfront-new_property-value").val();this.model.get("properties").add(new Upfront.Models.Property({name:e,value:t})),this.$("#upfront-new_property").slideUp().find("input").val("").end(),this.$("#add-property").show()}})})}(jQuery,Backbone);