!function(){Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define([],function(){return Backbone.View.extend({tagName:"ul",initialize:function(){this.commands=_([])},render:function(){this.$el.find("li").remove(),this.commands.each(this.add_command,this)},add_command:function(n){n&&(n.remove(),n.render(),this.$el.append(n.el),n.bind("upfront:command:remove",this.remove_command,this),n.delegateEvents())},remove_command:function(n){var e=this.commands.reject(function(e){return e.remove(),e.cid==n.cid});this.commands=_(e),this.render()}})})}();