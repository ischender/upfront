!function(e){define(["scripts/upfront/upfront-views-editor/breakpoint/model"],function(t){return Backbone.Collection.extend({model:t,initialize:function(){this.on("change:active",this.on_change_active,this),this.on("change:enabled",this.on_change_enabled,this),this.on("change:width",this.on_change_width,this)},on_change_active:function(t){var i=this.active?this.active.toJSON():!1;this.prev_active=this.active,this.active=t,_.each(this.models,function(e){e.get("id")!==t.get("id")&&e.set({active:!1},{silent:!0})}),Upfront.Events.trigger("upfront:layout_size:change_breakpoint",t.toJSON(),i),Upfront.Events.trigger("upfront:layout_size:change_breakpoint:secondary",t.toJSON(),i),Upfront.Events.trigger("upfront:layout_size:change_breakpoint:tertiary",t.toJSON(),i),this.prev_active&&e("#page").removeClass(this.prev_active.get("id")+"-breakpoint"),e("#page").addClass(this.active.get("id")+"-breakpoint"),this.active.get("default")?e("#page").removeClass("responsive-breakpoint").addClass("default-breakpoint"):e("#page").removeClass("default-breakpoint").addClass("responsive-breakpoint")},on_change_enabled:function(e){if(e.get("active")!==!1){var t=this.get_default();t.set({active:!0})}},on_change_width:function(e,t){Upfront.Events.trigger("upfront:layout_size:viewport_width_change",t)},sorted_by_width:function(){return _.sortBy(this.models,function(e){return e.get("width")})},get_active:function(){var e=this.findWhere({active:!0});return _.isUndefined(e)===!1?e:(e=this.get_default(),e.set({active:!0}),e)},get_enabled:function(){var e=this.where({enabled:!0});return _.isUndefined(e)===!1&&e.length>0?e:[this.get_active()]},get_default:function(){var e=this.findWhere({"default":!0});if(_.isUndefined(e)&&(e=this.findWhere({id:"desktop"}),e&&e.set({"default":!0})),_.isUndefined(e))throw"Breakpoints are not loaded properly.";return e},get_unique_id:function(){for(var e="custom-"+new Date;!_.isUndefined(this.findWhere({id:e}));)e="custom-"+new Date;return e}})})}(jQuery);