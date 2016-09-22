!function(e){var t=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/bg-settings/mixins"],function(e){var o=Upfront.Views.Editor.Settings.Item.extend(_.extend({},e,{group:!1,initialize:function(e){var o=this,i={mute:new Upfront.Views.Editor.Field.Checkboxes({model:this.model,property:"background_video_mute",use_breakpoint_property:!0,default_value:1,layout:"horizontal-inline",multiple:!1,values:[{label:t.mute_on_play,value:1}],change:function(){var e=this.get_value();this.model.set_breakpoint_property(this.property_name,e?1:0)},rendered:function(){this.$el.addClass("uf-bgsettings-video-mute")}}),autoplay:new Upfront.Views.Editor.Field.Checkboxes({model:this.model,property:"background_video_autoplay",use_breakpoint_property:!0,default_value:1,layout:"horizontal-inline",multiple:!1,values:[{label:t.autoplay,value:1}],change:function(){var e=this.get_value();this.model.set_breakpoint_property(this.property_name,e?1:0)},rendered:function(){this.$el.addClass("uf-bgsettings-video-autoplay")}}),loop:new Upfront.Views.Editor.Field.Checkboxes({model:this.model,property:"background_video_loop",use_breakpoint_property:!0,default_value:1,layout:"horizontal-inline",multiple:!1,values:[{label:t.loop,value:1}],change:function(){var e=this.get_value();this.model.set_breakpoint_property(this.property_name,e?1:0)},rendered:function(){this.$el.addClass("uf-bgsettings-video-loop")}}),style:new Upfront.Views.Editor.Field.Radios({model:this.model,property:"background_video_style",use_breakpoint_property:!0,layout:"horizontal-inline",default_value:["crop"],values:[{label:t.scale_and_crop,value:"crop"},{label:t.no_crop_embed,value:"full"},{label:t.no_crop_bg,value:"inside"}],change:function(){var e=this.get_value();"inside"==e?i.color.$el.show():i.color.$el.hide(),this.model.set_breakpoint_property(this.property_name,e)},rendered:function(){this.$el.addClass("uf-bgsettings-video-style")}}),color:new Upfront.Views.Editor.Field.Color({model:this.model,label:t.area_bg_color+":",label_style:"inline",property:"background_color",use_breakpoint_property:!0,default_value:"#ffffff",spectrum:{move:function(e){o.preview_color(e)},change:function(e){o.update_color(e)},hide:function(e){o.reset_color()}},rendered:function(){this.$el.addClass("uf-bgsettings-video-color")}}),video:new Upfront.Views.Editor.Field.Text({model:this.model,label:t.video_url,property:"background_video",use_breakpoint_property:!0,default_value:"",placeholder:t.video_source,change:function(){var e=this.get_value();e&&(o.model.set_breakpoint_property("background_video_embed",""),o.get_video_embed(e).done(function(e){e.data&&e.data.width&&e.data.height&&(o.model.set_breakpoint_property("background_video_width",e.data.width),o.model.set_breakpoint_property("background_video_height",e.data.height),o.model.set_breakpoint_property("background_video_embed",e.data.html))})),this.model.set_breakpoint_property(this.property_name,e)},rendered:function(){this.$el.addClass("uf-bgsettings-video-url")}})};this.$el.addClass("uf-bgsettings-item uf-bgsettings-videoitem"),e.fields=_.map(i,function(e){return e}),this.on("show",function(){i.style.trigger("changed")}),this.bind_toggles(),this.constructor.__super__.initialize.call(this,e)},get_video_embed:function(e){return Upfront.Util.post({action:"upfront-media-get_embed_raw",media:e})}}));return o})}(jQuery);