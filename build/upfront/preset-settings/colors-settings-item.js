define([],function(){var e=Upfront.Views.Editor.Settings.Item.extend({className:"colors_settings_item clearfix",group:!0,get_title:function(){return this.options.title},initialize:function(e){this.options=e||{};var t=this,n=[];_.each(this.options.abccolors,function(e){var r=new Upfront.Views.Editor.Field.Color({blank_alpha:0,model:this.model,name:e.name,label_style:"inline",label:e.label,spectrum:{preferredFormat:"rgb",change:function(n){if(!n)return!1;var r=n.get_is_theme_color()!==!1?n.theme_color:n.toRgbString();t.model.set(e.name,r)},move:function(n){if(!n)return!1;var r=n.get_is_theme_color()!==!1?n.theme_color:n.toRgbString();t.model.set(e.name,r)}}});n.push(r)}),this.fields=_(n)},render:function(){var e=this;this.constructor.__super__.render.call(this),this.fields.each(function(t){var n=e.model.get(t.name);t.set_value(n),t.update_input_border_color(Upfront.Util.colors.to_color_value(n))})}});return e});