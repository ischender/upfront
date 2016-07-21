define(["scripts/upfront/settings/modules/base-module"],function(e){var d=Upfront.Settings.l10n.preset_manager,t=e.extend({className:"padding-settings sidebar-settings clearfix",initialize:function(e){this.options=e||{};var t=this,i=Upfront.Settings.LayoutEditor.Grid.column_padding;this.listenTo(Upfront.Events,"upfront:paddings:updated",this.refresh),this.fields=_([new Upfront.Views.Editor.Field.Checkboxes({model:this.model,className:"use-padding checkbox-title",use_breakpoint_property:!0,property:"use_padding",label:"",default_value:this.model.get_breakpoint_property_value("top_padding_use")||this.model.get_breakpoint_property_value("bottom_padding_use")||this.model.get_breakpoint_property_value("left_padding_use")||this.model.get_breakpoint_property_value("right_padding_use"),multiple:!1,values:[{label:"Customize Padding",value:"yes"}],change:function(e){t.model.set_breakpoint_property("use_padding",e),"undefined"==typeof e&&(t.model.set_breakpoint_property("left_padding_num",i,!0),t.model.set_breakpoint_property("top_padding_num",i,!0),t.model.set_breakpoint_property("right_padding_num",i,!0),t.model.set_breakpoint_property("bottom_padding_num",i,!0),padding_left.get_field().val(i),padding_top.get_field().val(i),padding_right.get_field().val(i),padding_bottom.get_field().val(i),t.disable_paddings())},show:function(e,d){var i=d.closest(".upfront-settings-item-content"),n=t.model.get_breakpoint_property_value("lock_padding");"yes"==e?"yes"==n?(i.find(".padding-slider").show(),i.find(".padding-number").show()):(i.find(".padding-top").show(),i.find(".padding-bottom").show(),i.find(".padding-left").show(),i.find(".padding-right").show()):(i.find(".padding-top").hide(),i.find(".padding-bottom").hide(),i.find(".padding-left").hide(),i.find(".padding-right").hide(),i.find(".padding-slider").hide(),i.find(".padding-number").hide())}}),lock_padding=new Upfront.Views.Editor.Field.Checkboxes({model:this.model,className:"padding-lock",use_breakpoint_property:!0,property:"lock_padding",label:"",default_value:0,multiple:!1,values:[{label:"",value:"yes"}],show:function(e){t.model.set_breakpoint_property("lock_padding",e);var d=t.$el,i=t.model.get_breakpoint_property_value("use_padding"),n=t.model.get_breakpoint_property_value("padding_number");"yes"==e&&"yes"==i?(d.find(".padding-slider").show(),d.find(".padding-number").show(),d.find(".padding-top").hide(),d.find(".padding-bottom").hide(),d.find(".padding-left").hide(),d.find(".padding-right").hide(),t.model.set_breakpoint_property("left_padding_num",n),t.model.set_breakpoint_property("top_padding_num",n),t.model.set_breakpoint_property("right_padding_num",n),t.model.set_breakpoint_property("bottom_padding_num",n),padding_left.get_field().val(n),padding_top.get_field().val(n),padding_right.get_field().val(n),padding_bottom.get_field().val(n),"undefined"!=typeof Upfront.data.currentEntity.paddingControl&&Upfront.data.currentEntity.paddingControl.refresh()):"yes"==i&&(d.find(".padding-slider").hide(),d.find(".padding-number").hide(),d.find(".padding-top").show(),d.find(".padding-bottom").show(),d.find(".padding-left").show(),d.find(".padding-right").show())},change:function(e){t.model.set_breakpoint_property("lock_padding",e)}}),locked_slider=new Upfront.Views.Editor.Field.Slider({className:"padding-slider upfront-field-wrap",model:this.model,use_breakpoint_property:!0,property:"padding_slider",default_value:this.model.get_breakpoint_property_value("padding_slider")||i,suffix:d.px,step:5,min:0,max:250,change:function(e){t.model.set_breakpoint_property("padding_slider",e),t.model.set_breakpoint_property("padding_number",e,!0),t.model.set_breakpoint_property("left_padding_num",e,!0),t.model.set_breakpoint_property("top_padding_num",e,!0),t.model.set_breakpoint_property("right_padding_num",e,!0),t.model.set_breakpoint_property("bottom_padding_num",e,!0),locked_num.get_field().val(e),padding_left.get_field().val(e),padding_top.get_field().val(e),padding_right.get_field().val(e),padding_bottom.get_field().val(e),t.enable_lock_padding(),t.re_render_entity()},show:function(){var e=t.model.get_property_value_by_name("padding_number");e>250?t.$el.find(".padding-slider").css("opacity",.6):t.$el.find(".padding-slider").css("opacity",1)}}),locked_num=new Upfront.Views.Editor.Field.Number({className:"padding-number",model:this.model,use_breakpoint_property:!0,property:"padding_number",default_value:this.model.get_breakpoint_property_value("padding_number")||i,label:"",step:5,min:0,change:function(e){t.model.set_breakpoint_property("padding_slider",e),t.model.set_breakpoint_property("padding_number",e),locked_slider.$el.find("#"+locked_slider.get_field_id()).slider("value",e),t.model.set_breakpoint_property("left_padding_num",e,!0),t.model.set_breakpoint_property("top_padding_num",e,!0),t.model.set_breakpoint_property("right_padding_num",e,!0),t.model.set_breakpoint_property("bottom_padding_num",e,!0),padding_left.get_field().val(e),padding_top.get_field().val(e),padding_right.get_field().val(e),padding_bottom.get_field().val(e),t.enable_lock_padding(),t.re_render_entity(),e>250?t.$el.find(".padding-slider").css("opacity",.6):t.$el.find(".padding-slider").css("opacity",1)}}),padding_top=new Upfront.Views.Editor.Field.Number({model:this.model,className:"padding-top",use_breakpoint_property:!0,property:"top_padding_num",label:"",step:5,min:0,default_value:this.model.get_breakpoint_property_value("top_padding_num")||i,change:function(e){t.model.set_breakpoint_property("top_padding_num",e),t.enable_padding("top_padding_use")},focus:function(){t.$el.find(".padding-bottom label").css("border-top","3px solid #7bebc6")},blur:function(){t.$el.find(".padding-bottom label").css("border","1px dotted #7d99b3")}}),padding_left=new Upfront.Views.Editor.Field.Number({model:this.model,className:"padding-left",use_breakpoint_property:!0,property:"left_padding_num",label:"",step:5,min:0,default_value:this.model.get_breakpoint_property_value("left_padding_num")||i,change:function(e){t.model.set_breakpoint_property("left_padding_num",e),t.enable_padding("left_padding_use")},focus:function(){t.$el.find(".padding-bottom label").css("border-left","3px solid #7bebc6")},blur:function(){t.$el.find(".padding-bottom label").css("border","1px dotted #7d99b3")}}),padding_right=new Upfront.Views.Editor.Field.Number({model:this.model,className:"padding-right",use_breakpoint_property:!0,property:"right_padding_num",label:"",step:5,min:0,default_value:this.model.get_breakpoint_property_value("right_padding_num")||i,change:function(e){t.model.set_breakpoint_property("right_padding_num",e),t.enable_padding("right_padding_use")},focus:function(){t.$el.find(".padding-bottom label").css("border-right","3px solid #7bebc6")},blur:function(){t.$el.find(".padding-bottom label").css("border","1px dotted #7d99b3")}}),padding_bottom=new Upfront.Views.Editor.Field.Number({model:this.model,className:"padding-bottom",use_breakpoint_property:!0,property:"bottom_padding_num",label:"",step:5,min:0,default_value:this.model.get_breakpoint_property_value("bottom_padding_num")||i,change:function(e){t.model.set_breakpoint_property("bottom_padding_num",e),t.enable_padding("bottom_padding_use")},focus:function(){t.$el.find(".padding-bottom label").css("border-bottom","3px solid #7bebc6")},blur:function(){t.$el.find(".padding-bottom label").css("border","1px dotted #7d99b3")}})])},refresh:function(){this.model.set_breakpoint_property("use_padding","yes");var e=this.model.get_breakpoint_property_value("lock_padding"),d=this.fields._wrapped[1].$el.find("input"),t=this.model.get_breakpoint_property_value("top_padding_num"),i=this.model.get_breakpoint_property_value("bottom_padding_num"),n=this.model.get_breakpoint_property_value("left_padding_num"),p=this.model.get_breakpoint_property_value("right_padding_num");e?d.attr("checked","checked"):d.removeAttr("checked"),d.trigger("change"),this.fields._wrapped[4].get_field().val(t),this.fields._wrapped[5].get_field().val(n),this.fields._wrapped[6].get_field().val(p),this.fields._wrapped[7].get_field().val(i)},enable_padding:function(e){this.model.set_breakpoint_property(e,"yes"),Upfront.Events.trigger("upfront:paddings:updated")},disable_paddings:function(){this.model.set_breakpoint_property("top_padding_use",""),this.model.set_breakpoint_property("bottom_padding_use",""),this.model.set_breakpoint_property("left_padding_use",""),this.model.set_breakpoint_property("right_padding_use",""),Upfront.Events.trigger("upfront:paddings:updated")},enable_lock_padding:function(){var e=this.model instanceof Upfront.Models.ModuleGroup;this.enable_padding("top_padding_use"),this.enable_padding("bottom_padding_use"),e||(this.enable_padding("left_padding_use"),this.enable_padding("right_padding_use"))},re_render_entity:function(){var e=Upfront.data.currentEntity;clearTimeout(this.refresh_timer),this.refresh_timer=setTimeout(function(){"function"==typeof e.render&&e.render()},200)}});return t});