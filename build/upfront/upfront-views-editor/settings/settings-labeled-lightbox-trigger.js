!function(t){var e=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/upfront-views-editor/settings/settings-lightbox-trigger"],function(t){return t.extend({initialize:function(i){this.options=i,t.prototype.initialize.call(this,this.options),this.options.fields.push(new Field_Text({model:this.model,property:"lightbox_label",label:e.label}))},get_values:function(){return{anchor:this.fields._wrapped[0].get_value(),label:this.fields._wrapped[1].get_value()}}})})}(jQuery);