!function(e){var o=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/bg-settings/mixins","elements/upfront-image/js/video-selector"],function(e,t){var i=Upfront.Views.Editor.Settings.Item.extend(_.extend({},e,{group:!1,initialize:function(e){var i,r=this,l=new t,d=new Upfront.Views.Editor.Field.Button({label:o.pick_video,model:this.model,compact:!0,classname:"uf-button-alt uf-bgsettings-image-pick uf-bgsettings-video-pick",on_click:function(){l.open().done(function(e){l.close(),r.model.set_breakpoint_property("uploaded_background_video_embed",""),r.model.set_breakpoint_property("uploaded_background_video",""),r.model.set_breakpoint_property("background_video_embed",""),r.model.set_breakpoint_property("background_video",""),r.model.set_breakpoint_property("background_video_width",e.width),r.model.set_breakpoint_property("background_video_height",e.height),r.model.set_breakpoint_property("uploaded_background_video_embed",e.embed),r.model.set_breakpoint_property("uploaded_background_video",e.id),r.model.set_breakpoint_property("type","uploaded_video")})}}),n=new Upfront.Views.Editor.Field.Text({model:this.model,label:o.video_url,property:"background_video",use_breakpoint_property:!0,default_value:"",placeholder:o.video_source,change:function(){var e=this.get_value();e&&(r.model.set_breakpoint_property("type","video"),r.model.set_breakpoint_property("uploaded_background_video_embed",""),r.model.set_breakpoint_property("uploaded_background_video",""),r.model.set_breakpoint_property("background_video_embed",""),r.get_video_embed(e).done(function(e){e.data&&(r.model.set_breakpoint_property("background_video_width",e.data.width),r.model.set_breakpoint_property("background_video_height",e.data.height),r.model.set_breakpoint_property("background_video_embed",e.data.html))})),this.model.set_breakpoint_property(this.property_name,e)},rendered:function(){this.$el.addClass("uf-bgsettings-video-url")}});i={bg_style:new Upfront.Views.Editor.Field.Select({model:this.model,label:"Video Source",className:"upfront-field-wrap upfront-field-wrap-select background-video-style-field",property:"background_style",use_breakpoint_property:!0,default_value:"upload",icon_class:"upfront-region-field-icon",values:this.get_bg_style_values(),change:function(){var e=this.get_value();"upload"==e?(n.$el.hide(),d.$el.show()):"service"==e&&(d.$el.hide(),n.$el.show()),r._bg_style=e,r.update_video()}}),pick_video:d,mute:new Upfront.Views.Editor.Field.Checkboxes({model:this.model,property:"background_video_mute",use_breakpoint_property:!0,default_value:1,layout:"horizontal-inline",multiple:!1,values:[{label:o.mute_on_play,value:1}],change:function(){var e=this.get_value();this.model.set_breakpoint_property(this.property_name,e?1:0)},rendered:function(){this.$el.addClass("uf-bgsettings-video-mute")}}),video:n,autoplay:new Upfront.Views.Editor.Field.Checkboxes({model:this.model,property:"background_video_autoplay",use_breakpoint_property:!0,default_value:1,layout:"horizontal-inline",multiple:!1,values:[{label:o.autoplay,value:1}],change:function(){var e=this.get_value();this.model.set_breakpoint_property(this.property_name,e?1:0)},rendered:function(){this.$el.addClass("uf-bgsettings-video-autoplay")}}),loop:new Upfront.Views.Editor.Field.Checkboxes({model:this.model,property:"background_video_loop",use_breakpoint_property:!0,default_value:1,layout:"horizontal-inline",multiple:!1,values:[{label:o.loop,value:1}],change:function(){var e=this.get_value();this.model.set_breakpoint_property(this.property_name,e?1:0)},rendered:function(){this.$el.addClass("uf-bgsettings-video-loop")}}),style:new Upfront.Views.Editor.Field.Select({model:this.model,property:"background_video_style",use_breakpoint_property:!0,layout:"horizontal-inline",default_value:["crop"],values:[{label:o.scale_and_crop,value:"crop"},{label:o.no_crop_embed,value:"full"},{label:o.no_crop_bg,value:"inside"}],change:function(){var e=this.get_value();"inside"==e?i.color.$el.show():i.color.$el.hide(),this.model.set_breakpoint_property(this.property_name,e)},rendered:function(){this.$el.addClass("uf-bgsettings-video-style")}}),color:new Upfront.Views.Editor.Field.Color({model:this.model,label:o.bg_color_short,label_style:"inline",property:"background_color",use_breakpoint_property:!0,default_value:"#ffffff",spectrum:{move:function(e){r.preview_color(e)},change:function(e){r.update_color(e)},hide:function(e){r.reset_color()}},rendered:function(){this.$el.addClass("uf-bgsettings-video-color")}})},this.$el.addClass("uf-bgsettings-item uf-bgsettings-videoitem"),e.fields=_.map(i,function(e){return e}),this.on("show",function(){i.style.trigger("changed")}),this.bind_toggles(),this.constructor.__super__.initialize.call(this,e),setTimeout(function(){var e=r.model.get_breakpoint_property_value("background_style");"upload"===e?(n.$el.hide(),d.$el.show()):"service"===e?(d.$el.hide(),n.$el.show()):(r.model.set_breakpoint_property("background_style","upload"),n.$el.hide(),d.$el.show())},50)},get_video_embed:function(e){return Upfront.Util.post({action:"upfront-media-get_embed_raw",media:e})},get_bg_style_values:function(){var e=[{label:"Upload",value:"upload",icon:"bg-image-full"},{label:"Video Service",value:"service",icon:"bg-image-tile"}];return e},update_video:function(){var e=this._bg_style;this.model.set_breakpoint_property("background_style",e)}}));return i})}(jQuery);