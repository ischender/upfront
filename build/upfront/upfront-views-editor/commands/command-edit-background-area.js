!function(t){Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/upfront-views-editor/commands/command","text!upfront/templates/edit_background_area.html"],function(n,i){return n.extend({className:"command-edit-background-area",events:{"click .switch":"on_switch"},initialize:function(){Upfront.Events.on("command:newpage:start",this.switchOff,this),Upfront.Events.on("command:newpost:start",this.switchOff,this)},render:function(){var t=_.template(i,{});this.$el.html(t)},on_switch:function(){var n=t(Upfront.Settings.LayoutEditor.Selectors.main);this.$el.find(".switch-on").hasClass("active")?this.switchOff():(this.$el.find(".switch-off").removeClass("active"),this.$el.find(".switch-on").addClass("active"),n.addClass("upfront-region-editing"),Upfront.Events.trigger("command:region:edit_toggle",!0))},switchOff:function(){var n=t(Upfront.Settings.LayoutEditor.Selectors.main);this.$el.find(".switch-off").addClass("active"),this.$el.find(".switch-on").removeClass("active"),n.removeClass("upfront-region-editing"),n.removeClass("upfront-region-lightbox-editing"),Upfront.Events.trigger("command:region:edit_toggle",!1)}})})}(jQuery);