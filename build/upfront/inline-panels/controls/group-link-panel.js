!function(t){define(["scripts/upfront/inline-panels/controls/link-panel","scripts/upfront/link-model"],function(t,i){var n=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views,e=t.extend({className:"upfront-inline-panel-item group-link-control",initialize:function(t){var e=this;this.options=t||{},this.constructor.__super__.constructor.__super__.initialize.call(this,t),this.icon=this.options.icon,this.tooltip=this.options.tooltip,this.id=this.options.id,this.link=new i({type:this.options.linkType,url:this.options.linkUrl,target:this.options.linkTarget,object:this.options.linkObject,object_id:this.options.linkObjectId}),this.view=new Upfront.Views.Editor.LinkPanel({model:this.link,button:!1,title:n.link_group_to}),this.listenTo(this.link,"change change:target change:type",function(t){e.render_label(),this.trigger("change",{url:t.get("url"),target:t.get("target"),type:t.get("type")})})}});return e})}(jQuery);