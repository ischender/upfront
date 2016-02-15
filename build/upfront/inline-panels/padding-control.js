(function(e){define(["scripts/upfront/inline-panels/item","scripts/upfront/inline-panels/control"],function(t,n){var r=Upfront.mainData.l10n.global.views,i=n.extend({multiControl:!0,events:{click:"onClickControl"},initialize:function(){var t=this;e(document).click(function(n){var r=e(n.target);r.closest("#page").length&&r[0]!==t.el&&!r.closest(t.el).length&&t.isOpen&&t.close()}),e(document).mouseup(function(n){var r=e(n.target),i=Upfront.data.currentEntity;r.closest("#page").length&&r[0]!==t.el&&!r.closest(t.el).length&&typeof i!="undefined"&&typeof i.padding_hint_locked!="undefined"&&i.padding_hint_locked&&(i.padding_hint_locked=!1,i.top_padding_hint_timer=setTimeout(function(){typeof i.hide_top_padding_hint=="function"&&i.hide_top_padding_hint()},1e3),i.bottom_padding_hint_timer=setTimeout(function(){typeof i.hide_bottom_padding_hint=="function"&&i.hide_bottom_padding_hint()},1e3))}),this.default_padding={top:!1,bottom:!1},this.listenTo(Upfront.Events,"upfront:paddings:updated",this.refresh)},onClickControl:function(t){var n=e(t.target);if(this.isDisabled)return;t.preventDefault();if(!n.closest(".upfront-icon-region-padding").length){t.stopPropagation();return}this.clicked(t),this.$el.siblings(".upfront-control-dialog-open").removeClass("upfront-control-dialog-open"),this.isOpen?this.close():this.open()},open:function(){this.isOpen=!0,this.refresh(),this.$el.addClass("upfront-control-dialog-open")},close:function(){this.isOpen=!1,this.$el.removeClass("upfront-control-dialog-open"),this.$el.closest(".upfront-inline-panel-item-open").removeClass("upfront-inline-panel-item-open")},on_render:function(){var t=this,n=t.$(".upfront-padding-control"),i=e('<div class="upfront-padding-container">'+r.top_padding_short+'<span class="upfront-padding-value"></span></div>'),s=e('<div class="upfront-padding-container">'+r.bottom_padding_short+'<span class="upfront-padding-value"></span></div>'),o=Upfront.Settings.LayoutEditor.Grid.column_padding;t.$el.hasClass("upfront-padding-control-item")||t.$el.addClass("upfront-padding-control-item"),n.length===0&&(n=e('<div class="upfront-padding-control inline-panel-control-dialog"></div>'),t.$el.append(n)),t.default_padding.top===!1&&(t.default_padding.top=o),t.default_padding.bottom===!1&&(t.default_padding.bottom=o),t.paddingTop=new Upfront.Views.Editor.Field.Slider({model:this.model,use_breakpoint_property:!0,property:"top_padding_num",label:"",default_value:this.model.get_breakpoint_property_value("top_padding_num")||t.default_padding.top,min:0,max:200,step:5,valueTextFilter:function(e){return t.paddingTop.$el.parent(".upfront-padding-container").find(".upfront-padding-value").html(e),""},change:function(){var e=this.get_value();this.model.set_breakpoint_property("use_padding","yes",!0),this.model.set_breakpoint_property("lock_padding","",!0),this.model.set_breakpoint_property("top_padding_use","yes",!0),this.model.set_breakpoint_property("top_padding_slider",e,!0),this.model.set_breakpoint_property("top_padding_num",e),Upfront.Events.trigger("upfront:paddings:updated",this.model,Upfront.data.currentEntity),Upfront.Events.trigger("upfront:paddings:top:updated",this.model,Upfront.data.currentEntity)}}),t.paddingBottom=new Upfront.Views.Editor.Field.Slider({model:this.model,use_breakpoint_property:!0,property:"bottom_padding_num",label:"",default_value:this.model.get_breakpoint_property_value("bottom_padding_num")||t.default_padding.bottom,min:0,max:200,step:5,valueTextFilter:function(e){return t.paddingBottom.$el.parent(".upfront-padding-container").find(".upfront-padding-value").html(e),""},change:function(){var e=this.get_value();this.model.set_breakpoint_property("use_padding","yes",!0),this.model.set_breakpoint_property("lock_padding","",!0),this.model.set_breakpoint_property("bottom_padding_use","yes",!0),this.model.set_breakpoint_property("bottom_padding_slider",e,!0),this.model.set_breakpoint_property("bottom_padding_num",e),Upfront.Events.trigger("upfront:paddings:updated",this.model,Upfront.data.currentEntity),Upfront.Events.trigger("upfront:paddings:bottom:updated",this.model,Upfront.data.currentEntity)}}),n.html(""),t.paddingTop.render(),i.append(t.paddingTop.$el),n.append(i),t.paddingBottom.render(),s.append(t.paddingBottom.$el),n.append(s),i.on("mousedown",function(){Upfront.data.currentEntity.padding_hint_locked=!0}).on("mouseup",function(){var e=Upfront.data.currentEntity;e.padding_hint_locked=!1,e.top_padding_hint_timer=setTimeout(function(){typeof e.hide_top_padding_hint=="function"&&e.hide_top_padding_hint()},1e3)}),s.on("mousedown",function(){Upfront.data.currentEntity.padding_hint_locked=!0}).on("mouseup",function(){var e=Upfront.data.currentEntity;e.padding_hint_locked=!1,e.bottom_padding_hint_timer=setTimeout(function(){typeof e.hide_bottom_padding_hint=="function"&&e.hide_bottom_padding_hint()},1e3)})},refresh:function(e){if(e&&e!==this.model)return;var t=Upfront.Settings.LayoutEditor.Grid.column_padding,n=this.model.get_breakpoint_property_value("top_padding_use",!0),r=this.model.get_breakpoint_property_value("bottom_padding_use",!0),i,s;this.default_padding.top===!1&&(this.default_padding.top=t),this.default_padding.bottom===!1&&(this.default_padding.bottom=t),i=n?this.model.get_breakpoint_property_value("top_padding_num",!0):this.default_padding.top,s=r?this.model.get_breakpoint_property_value("bottom_padding_num",!0):this.default_padding.bottom,typeof this.paddingTop!="undefined"&&(this.paddingTop.get_field().val(i),typeof this.paddingTop.$el.find("#"+this.paddingTop.get_field_id()).slider("instance")!="undefined"&&this.paddingTop.$el.find("#"+this.paddingTop.get_field_id()).slider("value",i),this.paddingTop.$el.parent(".upfront-padding-container").find(".upfront-padding-value").html(i)),typeof this.paddingBottom!="undefined"&&(this.paddingBottom.get_field().val(s),typeof this.paddingBottom.$el.find("#"+this.paddingBottom.get_field_id()).slider("instance")!="undefined"&&this.paddingBottom.$el.find("#"+this.paddingBottom.get_field_id()).slider("value",s),this.paddingBottom.$el.parent(".upfront-padding-container").find(".upfront-padding-value").html(s))},on_up_arrow_click:function(){if(typeof this.paddingTop!="undefined"){var e=parseInt(this.model.get_breakpoint_property_value("top_padding_num",!0))-5;e=e<0?0:e,this.model.set_breakpoint_property("top_padding_use","yes"),this.model.set_breakpoint_property("top_padding_num",e),this.model.set_breakpoint_property("top_padding_slider",e),this.refresh()}},on_down_arrow_click:function(){if(typeof this.paddingTop!="undefined"){var e=parseInt(this.model.get_breakpoint_property_value("top_padding_num",!0))+5;this.model.set_breakpoint_property("top_padding_use","yes"),this.model.set_breakpoint_property("top_padding_num",e),this.model.set_breakpoint_property("top_padding_slider",e),this.refresh()}}});return i})})(jQuery);