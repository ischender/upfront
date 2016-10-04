!function(e){var t=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/upfront-views-editor/modal-bg-setting","scripts/upfront/upfront-views-editor/fields","text!upfront/templates/region_edit_panel.html"],function(i,n,o){return i.extend({render_modal:function(e,t){var i=this.get_template(),n=i();e.find(".upfront-region-bg-setting-tab-primary, .upfront-region-bg-setting-tab-secondary").children().detach(),e.html(n),t.addClass("upfront-region-modal-bg"),this.render_header_settings(e.find(".upfront-region-bg-setting-header")),this.render_main_settings(e),this.render_footer_settings(e.find(".upfront-region-bg-setting-footer")),this.render_bg_type_settings(e),this.render_padding_settings(e.find(".upfront-region-bg-setting-padding"))},get_template:function(){var t=e(o);return _.template(t.find("#upfront-region-bg-setting").html())},get_bg_types:function(){var e=Upfront.Views.breakpoints_storage.get_breakpoints().get_active().toJSON(),i=this.model.get_property_value_by_name("background_type"),n=[{label:t.solid_color,value:"color",icon:"color"},{label:t.image,value:"image",icon:"image"},{label:t.video,value:"video",icon:"video"},{label:t.image_slider,value:"slider",icon:"slider"},{label:t.map,value:"map",icon:"map"}];return e&&!e["default"]&&n.unshift({label:t.inherit,value:"",icon:i?i:"color"}),(_upfront_post_data.post_id||!0===Upfront.plugins.isRequiredByPlugin("show feature image region type")&&Upfront.Application.is_single())&&(Upfront.Application.is_single("404_page")||n.push({label:t.featured_image,value:"featured",icon:"feat"})),n},get_region_types:function(e){var i=[{label:t.full_width,value:"wide"},{label:t.contained,value:"clip"}];return e>0?i:_.union([{label:t.full_screen,value:"full"}],i)},render_header_settings:function(i){var r=this,l=Upfront.Views.breakpoints_storage.get_breakpoints().get_active().toJSON(),a=l&&!l["default"],s=this.model.is_main()?!1:this.model.get("sub"),d=e(o),p=_.template(d.find("#upfront-region-bg-setting-name").html()),g=new n.Text({model:this.model,name:"title",placeholder:t.region_name_placeholder,compact:!0,change:function(){},blur:function(){var t,i,n,o=this.model.collection,l=this.model.get("title"),a=(this.model.get("name"),e.trim(this.get_value().replace(/[^A-Za-z0-9\s_-]/g,""))),s=a.toLowerCase().replace(/\s/g,"-");l!=a&&(o.get_by_name(s)&&(t=o.get_new_title(a+" ",2),a=t.title,s=t.name),n=r.get_region_css_styles(this.model),this.model.is_main()?(i=this.model.get_sub_regions(),_.each(i,function(e,t){_.isArray(e)?_.each(e,function(e){e.set({container:s},{silent:!0})}):_.isObject(e)&&e.set({container:s},{silent:!0})}),this.model.set({title:a,name:s,container:s},{silent:!0})):this.model.set({title:a,name:s},{silent:!0}),c.find(".upfront-region-name-edit-value").text(a),r.set_region_css_styles(this.model,n.styles,n.selector),this.model.get("properties").trigger("change"))},rendered:function(){var e=this;this.get_field().on("keyup",function(t){13===t.which&&e.trigger("blur")})}}),u=new n.Checkboxes({model:this.model,name:"scope",multiple:!1,values:[{label:t.make_global,value:"global"}],change:function(){var e=this.get_value();"global"==e&&(r.apply_region_scope(this.model,"global"),c.find(".upfront-region-bg-setting-is-global").show())}}),m=new n.Button({model:this.model,name:"localize",label:t.localize_region,classname:"upfront-region-bg-setting-localize",compact:!0,on_click:function(){r.apply_region_scope(this.model,"local"),c.find(".upfront-region-bg-setting-name-wrap").show(),h.show(),c.find(".upfront-region-bg-setting-name-edit").hide(),c.find(".upfront-region-bg-setting-is-global").hide(),u.$el.find("[value=global]").prop("checked",!1),u.$el.show(),this.$el.hide()},rendered:function(){this.$el.attr("title",t.localize_region_info)}}),f=new n.Button({model:this.model,name:"save",label:t.save,compact:!0,classname:"upfront-region-bg-setting-name-save",on_click:function(){c.find(".upfront-region-bg-setting-name-wrap").show(),h.show(),c.find(".upfront-region-bg-setting-name-edit").hide(),"global"==this.model.get("scope")?(u.$el.hide(),m._no_display||m.$el.show()):u.$el.show()}}),c=i.find(".upfront-region-bg-setting-name"),h=i.find(".upfront-region-bg-setting-auto-resize");if(a)return void i.hide();if(c.append(p()),g.render(),u.render(),m.render(),f.render(),c.find(".upfront-region-bg-setting-name-edit").append([g.$el,u.$el,m.$el,f.$el]).hide(),c.find(".upfront-region-name-edit-value").text(this.model.get("title")),"global"==this.model.get("scope")){if(c.find(".upfront-region-bg-setting-is-global").show(),u.$el.hide(),!this.model.is_main()&&s){var b=this.model.collection.get_by_name(this.model.get("container"));b&&"global"==b.get("scope")&&(m.$el.hide(),m._no_display=!0)}}else c.find(".upfront-region-bg-setting-is-global").hide(),m.$el.hide();c.on("click",".upfront-region-name-edit-trigger",function(e){e.preventDefault(),c.find(".upfront-region-bg-setting-name-wrap").hide(),h.hide(),c.find(".upfront-region-bg-setting-name-edit").show(),"global"!=r.model.get("scope")?g.get_field().prop("disabled",!1).trigger("focus").select():g.get_field().prop("disabled",!0)}),this.model.is_main()?(h.on("click",function(t){t.preventDefault(),t.stopPropagation(),r.trigger_expand_lock(e(this))}),this.render_expand_lock(h)):h.hide()},render_main_settings:function(e){var i=this,o=Upfront.Views.breakpoints_storage.get_breakpoints().get_active().toJSON(),r=o&&!o["default"],l=this.model.collection,a=l.indexOf(this.model),s=l.index_container(this.model,["shadow","lightbox"]),d=(l.total_container(["shadow","lightbox"]),new n.Radios({model:this.model,name:"type",default_value:"wide",layout:"horizontal-inline",values:this.get_region_types(s),change:function(){var e=this.get_value();this.model.set({type:e},{silent:!0}),"full"==e?(f.show(),c.show(),this.model.set({sticky:0},{silent:!0})):(f.hide(),c.hide()),this.model.get("properties").trigger("change"),i.update_pos(),Upfront.Events.trigger("command:region:edit_toggle",!1),Upfront.Events.trigger("command:region:edit_toggle",!0)}})),p=this.model.get_property_value_by_name("nav_region"),g=new n.Checkboxes({model:this.model,property:"sub_regions",default_value:this.model.get_property_value_by_name("sub_regions")?[]:[p],layout:"horizontal-inline",multiple:!0,values:[{label:t.top,value:"top"},{label:t.bottom,value:"bottom"}],change:function(){var e=this.get_value(),t=i.model.get_sub_regions(),n=!1;a=l.indexOf(i.model),!_.contains(e,"top")&&t.top&&(n=Upfront.Util.model_to_json(t.top),i._sub_region_top_copy=new Upfront.Models.Region(n),l.remove(t.top)),!_.contains(e,"bottom")&&t.bottom&&(n=Upfront.Util.model_to_json(t.bottom),i._sub_region_bottom_copy=new Upfront.Models.Region(n),l.remove(t.bottom)),_.each(e,function(e){if(!t[e]){var n=!1,o=!1;if("bottom"==e?(i._sub_region_bottom_copy&&(o=i._sub_region_bottom_copy),n=t.right?a+2:a+1):"top"==e&&(i._sub_region_top_copy&&(o=i._sub_region_top_copy),n=t.left?a-1:a),n!==!1){var r=i.model.get("name")+"_"+e,s=i.model.get("title")+" "+e;o===!1&&(o=new Upfront.Models.Region(_.extend(_.clone(Upfront.data.region_default_args),{name:r,title:s,container:i.model.get("name"),sub:e,scope:i.model.get("scope")}))),o.add_to(l,n,{sub:e}),Upfront.Events.trigger("command:region:edit_toggle",!0)}}}),this.property.set({value:e})}}),u=new n.Radios({model:this.model,name:"behavior",default_value:"keep-position",layout:"horizontal-inline",values:[{label:t.keep_position,value:"keep-position"},{label:t.keep_ratio,value:"keep-ratio"}],change:function(){var e=this.get_value();this.model.set({behavior:e},{silent:!0}),this.model.get("properties").trigger("change")}}),m=e.find(".upfront-region-bg-setting-region-type"),f=e.find(".upfront-region-bg-setting-region-nav"),c=e.find(".upfront-region-bg-setting-region-behavior");!r&&this.model.is_main()?(d.render(),m.append(d.$el),g.render(),f.append(g.$el),u.render(),c.append(u.$el)):(m.hide(),f.hide(),c.hide()),this.model.is_main()&&(this.listenTo(d,"changed",function(){i.render_expand_lock(e.find(".upfront-region-bg-setting-auto-resize"))}),r||d.trigger("changed"))},render_footer_settings:function(e){var t=this,i=Upfront.Views.breakpoints_storage.get_breakpoints().get_active().toJSON(),n=i&&!i["default"],o=this.model.is_main()?!1:this.model.get("sub"),r=e.find(".upfront-region-bg-setting-sticky");n||!this.model.is_main()&&"top"!=o&&"bottom"!=o?r.hide():this.render_sticky_settings(r),e.find(".upfront-region-bg-setting-edit-css").on("click",function(e){e.preventDefault(),e.stopPropagation(),t.trigger_edit_css()})},render_sticky_settings:function(e){var i=this.model.collection,o=i.findWhere({sticky:"1"}),r=new n.Checkboxes({model:this.model,name:"sticky",default_value:"",layout:"horizontal-inline",values:[{label:t.sticky_region,value:"1"}],change:function(){var e=this.get_value();this.model.set({sticky:e},{silent:!0}),this.model.get("properties").trigger("change")},multiple:!1});!o&&this.for_view.$el.height()<=300||this.model.get("sticky")?(r.render(),e.append(r.$el)):e.hide()},render_padding_settings:function(i){var r,l,a,s,d=e(o),p=_.template(d.find("#upfront-region-bg-setting-padding").html()),g=new n.Radios({model:this.model,use_breakpoint_property:!0,property:"bg_padding_type",label:"",values:[{label:t.varied_padding,value:"varied"},{label:t.equal_padding,value:"equal"}],default_value:this.model.get_breakpoint_property_value("bg_padding_type")||"equal",change:function(){this.model.set_breakpoint_property("bg_padding_type",this.get_value())},show:function(t,n){"varied"===t?(e(".upfront-region-bg-setting-padding-top",i).show(),e(".upfront-region-bg-setting-padding-bottom",i).show(),e(".upfront-region-bg-setting-equal-padding",i).hide()):(e(".upfront-region-bg-setting-equal-padding",i).show(),e(".upfront-region-bg-setting-padding-top",i).hide(),e(".upfront-region-bg-setting-padding-bottom",i).hide())}}),u=new n.Slider({model:this.model,use_breakpoint_property:!0,property:"top_bg_padding_slider",label:"",default_value:this.model.get_breakpoint_property_value("top_bg_padding_slider")||0,min:0,max:200,step:5,valueTextFilter:function(){return""},change:function(){var e=this.get_value();this.model.set_breakpoint_property("top_bg_padding_slider",e),m.get_field().val(e),this.model.set_breakpoint_property("top_bg_padding_num",e,!0)}}),m=new n.Number({model:this.model,use_breakpoint_property:!0,property:"top_bg_padding_num",label:"",default_value:this.model.get_breakpoint_property_value("top_bg_padding_num")||0,prefix:t.bottom_padding,suffix:t.px,min:0,step:5,change:function(){var e=this.get_value();this.model.set_breakpoint_property("top_bg_padding_num",e),this.model.set_breakpoint_property("top_bg_padding_slider",e,!0),u.$el.find("#"+u.get_field_id()).slider("value",e)}}),f=new n.Slider({model:this.model,use_breakpoint_property:!0,property:"bottom_bg_padding_slider",label:"",default_value:this.model.get_breakpoint_property_value("bottom_bg_padding_slider")||0,min:0,max:200,step:5,valueTextFilter:function(){return""},change:function(){var e=this.get_value();this.model.set_breakpoint_property("bottom_bg_padding_slider",e),c.get_field().val(e),this.model.set_breakpoint_property("bottom_bg_padding_num",e,!0)}}),c=new n.Number({model:this.model,use_breakpoint_property:!0,property:"bottom_bg_padding_num",label:"",default_value:this.model.get_breakpoint_property_value("bottom_bg_padding_num")||0,suffix:t.px,min:0,step:5,change:function(){var e=this.get_value();this.model.set_breakpoint_property("bottom_bg_padding_num",e),this.model.set_breakpoint_property("bottom_bg_padding_slider",e,!0),f.$el.find("#"+f.get_field_id()).slider("value",e)}}),h=new n.Slider({model:this.model,use_breakpoint_property:!0,property:"bg_padding_slider",label:"",default_value:this.model.get_breakpoint_property_value("bg_padding_slider")||0,min:0,max:200,step:5,valueTextFilter:function(){return""},change:function(){var e=this.get_value();this.model.set_breakpoint_property("bg_padding_slider",e),this.model.set_breakpoint_property("top_bg_padding_slider",e,!0),this.model.set_breakpoint_property("bottom_bg_padding_slider",e,!0),u.$el.find("#"+u.get_field_id()).slider("value",e),f.$el.find("#"+f.get_field_id()).slider("value",e),b.get_field().val(e),m.get_field().val(e),c.get_field().val(e),this.model.set_breakpoint_property("bg_padding_num",e,!0),this.model.set_breakpoint_property("top_bg_padding_num",e,!0),this.model.set_breakpoint_property("bottom_bg_padding_num",e,!0)}}),b=new n.Number({model:this.model,use_breakpoint_property:!0,property:"bg_padding_num",label:"",default_value:this.model.get_breakpoint_property_value("bg_padding_num")||0,suffix:t.px,min:0,step:5,change:function(){var e=this.get_value();this.model.set_breakpoint_property("bg_padding_num",e),m.get_field().val(e),c.get_field().val(e),this.model.set_breakpoint_property("top_bg_padding_num",e,!0),this.model.set_breakpoint_property("bottom_bg_padding_num",e,!0),this.model.set_breakpoint_property("bg_padding_slider",e,!0),this.model.set_breakpoint_property("top_bg_padding_slider",e,!0),this.model.set_breakpoint_property("bottom_bg_padding_slider",e,!0),h.$el.find("#"+h.get_field_id()).slider("value",e),u.$el.find("#"+u.get_field_id()).slider("value",e),f.$el.find("#"+f.get_field_id()).slider("value",e)}});i.append(p()),r=i.find(".upfront-region-bg-setting-padding-type"),l=i.find(".upfront-region-bg-setting-equal-padding"),a=i.find(".upfront-region-bg-setting-padding-top"),s=i.find(".upfront-region-bg-setting-padding-bottom"),"varied"===this.model.get_breakpoint_property_value("bg_padding_type")?l.hide():(a.hide(),s.hide()),g.render(),r.append(g.$el),u.render(),a.append(u.$el),m.render(),a.append(m.$el),f.render(),s.append(f.$el),c.render(),s.append(c.$el),h.render(),l.append(h.$el),b.render(),l.append(b.$el)},apply_region_scope:function(e,t,i,n){var o,r=this,l=e.get_sub_regions(),a=e.get("title"),s=e.get("name"),d=function(e){var o=r.get_region_css_styles(e);if(e.set({scope:t},{silent:!0}),i&&s!=i){var l=new RegExp("^"+a,"i"),d=new RegExp("^"+s,"i"),p=e.get("title").replace(l,n),g=e.get("name").replace(d,i);e.set({container:i,title:p,name:g},{silent:!0})}r.set_region_css_styles(e,o.styles,o.selector),e.get("properties").trigger("change")};e.is_main()&&_.each(l,function(e){_.isArray(e)?_.each(e,function(e){d(e)}):e&&d(e)}),o=r.get_region_css_styles(e),e.set({scope:t},{silent:!0}),i&&s!=i&&e.set({title:n,name:i,container:i},{silent:!0}),r.set_region_css_styles(e,o.styles,o.selector),e.get("properties").trigger("change")},get_region_css_styles:function(t){return Upfront.Application.cssEditor.init({model:t,type:t.is_main()?"RegionContainer":"Region",element_id:t.is_main()?"region-container-"+t.get("name"):"region-"+t.get("name"),no_render:!0}),{styles:e.trim(Upfront.Application.cssEditor.get_style_element().html()),selector:Upfront.Application.cssEditor.get_css_selector()}},set_region_css_styles:function(e,t,i){t&&(Upfront.Application.cssEditor.init({model:e,type:e.is_main()?"RegionContainer":"Region",element_id:e.is_main()?"region-container-"+e.get("name"):"region-"+e.get("name"),no_stylename_fallback:!0,no_render:!0}),selector=Upfront.Application.cssEditor.get_css_selector(),i!=selector&&(t=t.replace(new RegExp(i.replace(/^\./,"."),"g"),selector)),Upfront.Application.cssEditor.get_style_element().html(t),Upfront.Application.cssEditor.saveCall(!1))},render_expand_lock:function(i){var n=this.model.get_breakpoint_property_value("expand_lock",!0),o=this.model.get("type"),r=e("<span />");"full"==o?(i.addClass("upfront-region-bg-setting-auto-resize-disabled"),i.attr("title",t.auto_resize_disabled_title)):(i.removeClass("upfront-region-bg-setting-auto-resize-disabled"),i.removeAttr("title")),n?r.addClass("auto-resize-off"):r.addClass("auto-resize-on"),i.html(""),i.append("<span>"+t.auto_resize+"</span>"),i.append(r)},trigger_expand_lock:function(e){if(!e.hasClass("upfront-region-bg-setting-auto-resize-disabled")){var t=this.model.get_breakpoint_property_value("expand_lock");this.model.set_breakpoint_property("expand_lock",!t),this.render_expand_lock(e)}},trigger_edit_css:function(){Upfront.Application.cssEditor.init({model:this.model,type:this.model.is_main()?"RegionContainer":"lightbox"==this.model.get("type")?"RegionLightbox":"Region",element_id:this.model.is_main()?"region-container-"+this.model.get("name"):"region-"+this.model.get("name")}),this.listenTo(Upfront.Application.cssEditor,"updateStyles",this.adjust_grid_padding)},adjust_grid_padding:function(){var e=new Upfront.Views.Editor.Command_ToggleGrid;e.update_grid()}})})}(jQuery);