!function(e){var t={selection:[],selecting:!1,create_mergeable:function(t,o){var n=this,r=Upfront.Behaviors.LayoutEditor;n.layout.get("regions");t.$el.selectable({distance:10,filter:".upfront-module",cancel:".upfront-module:not(.upfront-module-spacer), .upfront-module-group, .upfront-region-side-fixed, .upfront-entity_meta, .upfront-region-edit-trigger, .upfront-region-edit-fixed-trigger, .upfront-region-finish-edit, .upfront-icon-control-region-resize, .upfront-inline-modal, .upfront-inline-panels",selecting:function(t,o){var n,i=e(o.selecting);if(!(i.closest(".upfront-module-group").length>0)){if(r.selection.length>0){if(n=e(r.selection[0]).closest(".upfront-region"),i.closest(".upfront-region").get(0)!=n.get(0))return;r._add_selections(n.find(".ui-selecting"),n.find(".upfront-module").not(".upfront-ui-selected, .upfront-module-parent-group"),n.find(".upfront-module-group"))}else r._add_selection(o.selecting);r._update_selection_outline()}},unselecting:function(t,o){var n,i,a=e(o.unselecting);if(r.selection.length>1){if(n=e(r.selection[0]).closest(".upfront-region"),a.closest(".upfront-region").get(0)!=n.get(0))return;return e(".upfront-ui-selected").each(function(){r._remove_selection(this)}),i=n.find(".ui-selecting"),i.length>0&&(r._add_selection(i.get(0)),r._add_selections(i,n.find(".upfront-module").not(".upfront-ui-selected, .upfront-module-parent-group"),n.find(".upfront-module-group"))),void r._update_selection_outline()}r._remove_selection(o.unselecting),r._update_selection_outline()},unselected:function(t,o){var n=e(o.unselected);n.find(".upfront-selected-border").remove(),e(".upfront-module-group-group").remove()},start:function(e,t){r.remove_selections(),r.selection=[],r.selecting=!0},stop:function(e,t){r.parse_selections()}})},refresh_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("refresh")})},enable_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("enable")})},disable_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("disable")})},destroy_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("destroy")})},parse_selections:function(){if(!e(".upfront-ui-selected").length)return!1;if(!Upfront.Application.user_can_modify_layout())return!1;var t=this,o=Upfront.Application.layout.get("regions"),n=e(".upfront-ui-selected:first").closest(".upfront-region"),r=o.get_by_name(n.data("name")),i=!!r&&r.get("modules"),a=!!r&&r.get("wrappers"),l=e(".upfront-ui-selected");if(l.length<2)return l.each(function(){t._remove_selection(this)}),e("#upfront-group-selection").remove(),!1;e(".upfront-module-group-group").remove();var s=e('<div class="upfront-module-group-toggle upfront-module-group-group">'+Upfront.Settings.l10n.global.behaviors.group+"</div>"),p=sel_left=sel_right=sel_bottom=!1,d=wrap_left=wrap_right=wrap_bottom=!1,u=group_left=0;e("body").append(s),l.each(function(){var t=e(this).offset(),o=e(this).outerWidth(),n=e(this).outerHeight(),r=e(this).closest(".upfront-wrapper"),i=r.offset(),a=r.outerWidth(),l=r.outerHeight();t.right=t.left+o,t.bottom=t.top+n,p=p===!1||t.top<p?t.top:p,sel_bottom=sel_bottom===!1||t.bottom>sel_bottom?t.bottom:sel_bottom,sel_left=sel_left===!1||t.left<sel_left?t.left:sel_left,sel_right=sel_right===!1||t.right>sel_right?t.right:sel_right,i.right=i.left+a,i.bottom=i.top+l,d=d===!1||i.top<d?i.top:d,wrap_bottom=wrap_bottom===!1||i.bottom>wrap_bottom?i.bottom:wrap_bottom,wrap_left=wrap_left===!1||i.left<wrap_left?i.left:wrap_left,wrap_right=wrap_right===!1||i.right>wrap_right?i.right:wrap_right}),u=p+Math.round((sel_bottom-p)/2)-Math.round(s.outerHeight()/2),group_left=sel_left+Math.round((sel_right-sel_left)/2)-Math.round(s.outerWidth()/2),s.css({position:"absolute",zIndex:999999,top:u,left:group_left}),setTimeout(function(){t.selecting=!1},1e3),s.on("click",function(){var o=Upfront.Views.breakpoints_storage.get_breakpoints().get_active().toJSON(),s=Upfront.Behaviors.GridEditor,p=!1,d=(Math.round((wrap_right-wrap_left)/s.grid.column_width),s.parse_modules_to_lines(i,a,o.id,o.columns)),u=[],c=[],f=[],g=0,m=0,h=0,b=!1;_.each(d,function(t){var o=[],n=[],r=[],i=[],a=[],s=0,d=0,b=0;_.each(t.wrappers,function(t){var u=[],c=[],f=[];_.each(t.modules,function(t){var o=!1;l.each(function(){var n=e(this).attr("id");t.model.get_element_id()==n&&(p===!1&&(p=Upfront.data.module_views[t.model.cid]),u.push(t),o=!0)}),o||(0==u.length?c.push(t):f.push(t))}),u.length>0?(o.push({modules:u,top_modules:c,bottom_modules:f,model:t.model,col:t.col,clear:t.clear,spacer:t.spacer,order:t.order}),s+=t.col,c.length&&i.push({modules:c,model:t.model,col:t.col,clear:t.clear,spacer:t.spacer,order:t.order}),f.length&&a.push({modules:f,model:t.model,col:t.col,clear:t.clear,spacer:t.spacer,order:t.order})):((0==o.length?n:r).push({modules:t.modules,model:t.model,col:t.col,clear:t.clear,spacer:t.spacer,order:t.order}),0==o.length?d+=t.col:b+=t.col)}),o.length>0&&(u.push({wrappers:o,top_wrappers:i,bottom_wrappers:a,col:s}),g=s>g?s:g,n.length>0&&(c.push({wrappers:n,col:d}),m=d>m?d:m),r.length>0&&(f.push({wrappers:r,col:b}),h=b>h?b:h))}),s.start(p,p.model),c.length>1&&(t._do_combine(c,r)||t._do_group(c,r)),0==c.length&&0==f.length&&(b=!0),t._do_group(u,r,!1,b),f.length>1&&(t._do_combine(f,r)||t._do_group(f,r)),s.update_position_data(n.find(".upfront-editable_entities_container:first")),s.update_wrappers(r),e(this).remove(),e("#upfront-group-selection").remove(),t.selection=[]})},_do_group:function(e,t,o,n){var r=this,i=Upfront.Behaviors.GridEditor,a=o===!0,n=n===!0,l=t.get("modules"),s=t.get("wrappers"),p=Upfront.Util.get_unique_id("module-group"),d=new Upfront.Models.ModuleGroup,u=d.get("modules"),c=d.get("wrappers"),f=!1,g=!1,m=!1,h=0,b=!1,v=!1,w=Upfront.Views.breakpoints_storage.get_breakpoints().get_enabled();_.each(e,function(e,o){h=e.col>h?e.col:h,_.each(e.wrappers,function(e,t){var n=new Upfront.Models.Wrapper({}),r=Upfront.Util.get_unique_id("wrapper"),a=Upfront.data.wrapper_views[e.model.cid],p="top_modules"in e&&e.top_modules.length>0,d="bottom_modules"in e&&e.bottom_modules.length>0;n.set_property("wrapper_id",r),n.set_property("class",e.model.get_property_value_by_name("class")),n.replace_class(i.grid.class+e.col),0==t&&(n.add_class("clr"),0==o&&(f=e.clear)),c.add(n),_.each(e.modules,function(e,t){var o=l.indexOf(e.model),n=Upfront.data.module_views[e.model.cid];b===!1&&(b=o),e.model.set_property("wrapper_id",r,!0),l.remove(e.model,{silent:!0}),n.$el.detach(),p||d||a.$el.detach(),u.add(e.model)}),0==o&&0==t?(m=e.model.get_wrapper_id(),g=e.model):p||s.remove(e.model)}),"bottom_wrappers"in e&&e.bottom_wrappers.length>1&&(n?r._do_split(e.bottom_wrappers,t):r._do_group([{wrappers:e.bottom_wrappers,col:e.col}],t)),"top_wrappers"in e&&e.top_wrappers.length>1&&(n?(_.each(e.top_wrappers,function(e,t){_.each(e.modules,function(e,t){var o=l.indexOf(e.model);return v===!1?void(v=o):(l.remove(e.model,{silent:!0}),v++,void e.model.add_to(l,v))})}),v!==!1&&(b=v+1),a=!0):r._do_group([{wrappers:e.top_wrappers,col:e.col}],t))}),a&&(g=new Upfront.Models.Wrapper({}),m=Upfront.Util.get_unique_id("wrapper"),s.add(g)),g.set_property("wrapper_id",m),g.replace_class(i.grid.class+h),f&&g.add_class("clr"),d.set_property("wrapper_id",m),d.set_property("element_id",p),d.replace_class(i.grid.class+h),d.set_property("original_col",h);var U=g&&g.get_property_value_by_name("breakpoint")||{},y=d.get_property_value_by_name("breakpoint")||{};_.each(w,function(e){var t=e.toJSON();t.default||U&&U[t.id]&&U[t.id].edited&&(_.isObject(y[t.id])||(y[t.id]={edited:!1}),!y[t.id].edited&&_.isNumber(U[t.id].col)&&(y[t.id].col=U[t.id].col,y[t.id].edited=!0,d.set_property("breakpoint",Upfront.Util.clone(y))))}),d.add_to(l,b),Upfront.Events.trigger("entity:module_group:group",d,t)},_do_combine:function(e,t){var o=(Upfront.Behaviors.GridEditor,t.get("modules")),n=t.get("wrappers"),r=[],i=[],a=!0;if(_.each(e,function(e,t){t in r||(r[t]=[]),_.each(e.wrappers,function(e,o){o in i||(i[o]=[]),r[t][o]=e.col,i[o].push(e)})}),r.length>1)for(var l=1;l<r.length;l++)if(!_.isEqual(r[l-1],r[l])){a=!1;break}return!!a&&(_.each(i,function(e){var t,r=0,i=_.filter(e,function(e){return e.spacer}),a=e.length==i.length;_.each(e,function(e,i){return 0==i?(t=e.model.get_wrapper_id(),r=o.indexOf(_.last(e.modules).model),void(e.spacer&&!a&&(_.each(e.modules,function(e){o.remove(e.model)}),r--))):(n.remove(e.model),void(e.spacer?_.each(e.modules,function(e){o.remove(e.model)}):_.each(e.modules,function(e,n){e.model.set_property("wrapper_id",t,!0),o.remove(e.model,{silent:!0}),r++,e.model.add_to(o,r)})))})}),!0)},_do_split:function(e,t){var o=(Upfront.Behaviors.GridEditor,t.get("modules")),n=t.get("wrappers");return _.each(e,function(e,t){var r=new Upfront.Models.Wrapper({}),i=Upfront.Util.get_unique_id("wrapper");r.set_property("wrapper_id",i),r.set_property("class",e.model.get_property_value_by_name("class")),n.add(r),_.each(e.modules,function(e,t){var n=o.indexOf(e.model);e.model.set_property("wrapper_id",i,!0),o.remove(e.model,{silent:!0}),e.model.add_to(o,n)})}),!0},_get_group_position:function(t){var o=sel_left=sel_right=sel_bottom=!1,n=wrap_left=wrap_right=wrap_bottom=!1;return t.each(function(){var t=e(this).offset(),r=Math.round(parseFloat(e(this).css("width"))),i=Math.round(parseFloat(e(this).css("height"))),a=e(this).closest(".upfront-wrapper"),l=a.offset(),s=Math.round(parseFloat(a.css("width"))),p=Math.round(parseFloat(a.css("height")));t.left=Math.round(t.left),t.top=Math.round(t.top),t.right=t.left+r,t.bottom=t.top+i,o=o===!1||t.top<o?t.top:o,sel_bottom=sel_bottom===!1||t.bottom>sel_bottom?t.bottom:sel_bottom,sel_left=sel_left===!1||t.left<sel_left?t.left:sel_left,sel_right=sel_right===!1||t.right>sel_right?t.right:sel_right,l.left=Math.round(l.left),l.top=Math.round(l.top),l.right=l.left+s,l.bottom=l.top+p,n=n===!1||l.top<n?l.top:n,wrap_bottom=wrap_bottom===!1||l.bottom>wrap_bottom?l.bottom:wrap_bottom,wrap_left=wrap_left===!1||l.left<wrap_left?l.left:wrap_left,wrap_right=wrap_right===!1||l.right>wrap_right?l.right:wrap_right}),{element:{top:o,bottom:sel_bottom,left:sel_left,right:sel_right},wrapper:{top:n,bottom:wrap_bottom,left:wrap_left,right:wrap_right}}},_find_affected_el:function(t,o){if(0==this.selection.length)return!1;var n=!1;return t.each(function(){var t=e(this).offset(),r=Math.round(parseFloat(e(this).css("width"))),i=Math.round(parseFloat(e(this).css("height"))),a=Math.round(t.top),l=Math.round(t.left),s=a+i,p=l+r;o.top<s&&o.bottom>a&&o.left<p&&o.right>l&&(n=n!==!1?n.add(e(this)):e(this))}),n},_update_selection_outline:function(){var t=e("#upfront-group-selection"),o=this._get_group_position(e(this.selection));t.length||(t=e('<div id="upfront-group-selection" />'),t.appendTo("body")),t.css({top:o.element.top,left:o.element.left,height:o.element.bottom-o.element.top,width:o.element.right-o.element.left})},_add_selection:function(t){var o=_.find(this.selection,function(e){return e==t});o||(this.selection.push(t),e(t).addClass("upfront-ui-selected"))},_add_selections:function(t,o,n){var r,i,a,l=this,s=[];t.each(function(){var t=this,p=_.find(l.selection,function(e){return e==t}),d=e(o);if(!p){for(s=[],r=l._get_group_position(e(l.selection).add(this)),i=l._find_affected_el(d,r.element);i!==!1;)i.each(function(){s.push(this)}),d=d.not(i),r=l._get_group_position(e(l.selection).add(s)),i=l._find_affected_el(d,r.element);a=l._find_affected_el(n,r.element),a===!1&&_.each(s,function(e){l._add_selection(e)})}})},_remove_selection:function(t){this.selection=_.reject(this.selection,function(e){return e==t}),e(t).find(".upfront-selected-border").remove(),e(t).removeClass("upfront-ui-selected ui-selected")},remove_selections:function(){var t=Upfront.Behaviors.LayoutEditor;e(".upfront-ui-selected").each(function(){t._remove_selection(this)}),t._update_selection_outline(),e(".upfront-module-group-group").remove()},create_undo:function(){this.layout.store_undo_state()},apply_history_change:function(){var e=Upfront.Application.layout.get("regions"),t=!!e&&e.get_by_name("shadow");e&&t&&(e.remove(t),t=!1),Upfront.Application.layout_view.render()},save_dialog:function(t,o,n,r){e("body").append("<div id='upfront-save-dialog-background' />"),e("body").append("<div id='upfront-save-dialog' />");var i=e("#upfront-save-dialog"),a=e("#upfront-save-dialog-background"),l=(Upfront.Application.layout.get("current_layout"),"");r=!0===r,l+=r?"<p>"+Upfront.Settings.l10n.global.behaviors.this_archive_only+"</p>":"<p>"+Upfront.Settings.l10n.global.behaviors.this_post_only+"</p>",e.each(_upfront_post_data.layout,function(e,t){"type"!=e&&(l+=r?'<span class="upfront-save-button" data-save-as="'+t+'">'+Upfront.Settings.LayoutEditor.ArchiveSpecificity[e]+"</span>":'<span class="upfront-save-button" data-save-as="'+t+'">'+Upfront.Settings.LayoutEditor.Specificity[e]+"</span>")}),!0===Upfront.plugins.isForbiddenByPlugin("show save as dialog")||n!==!0?(a.remove(),i.remove(),t.apply(o,["single-post"])):(i.html(l),e("#upfront-save-dialog").on("click",".upfront-save-button",function(){var n=e(this).attr("data-save-as");return a.remove(),i.remove(),t.apply(o,[n]),Upfront.Events.trigger("command:proceed:save:post"),!1}),e("#upfront-save-dialog-background").on("click",function(){return a.remove(),i.remove(),!1}))},clean_region_css:function(){var t=Upfront.Application.cssEditor,o=(Upfront.Behaviors.LayoutEditor,[t.elementTypes.RegionContainer,t.elementTypes.Region]),n=_upfront_post_data.layout,r=n.specificity||n.item||n.type,i=Upfront.Application.layout.get("regions"),a=[],l=[],s=function(t){if(!l[t])return Upfront.Views.Editor.notify(Upfront.Settings.l10n.global.behaviors.region_css_cleaned),void p.resolve();var o,n=l[t].elementType,r=l[t].styleName,i=Upfront.plugins.call("prepare-delete-element-styles-data",{styleName:r,elementType:n});o=i.status&&"called"===i.status&&i.result?i.result:{action:"upfront_delete_styles",styleName:r,elementType:n},Upfront.Util.post(o).done(function(){var o=Upfront.data.styles[n].indexOf(r);o!=-1&&Upfront.data.styles[n].splice(o,1),e("#upfront-style-"+r).remove(),s(t+1)})},p=new e.Deferred;return i.each(function(e){var o=e.is_main()?t.elementTypes.RegionContainer.id:t.elementTypes.Region.id,n=r+"-"+e.get("name")+"-style";"global"==e.get("scope");_.isArray(Upfront.data.styles[o])&&Upfront.data.styles[o].indexOf(n)!=-1&&a.push(n),n=o+"-"+e.get("name")+"-style",_.isArray(Upfront.data.styles[o])&&Upfront.data.styles[o].indexOf(n)!=-1&&a.push(n)}),Upfront.plugins.call("clean-region-css",{elementTypes:o,layout_id:r,styleExists:a,deleteDatas:l,deleteFunc:s}),p.promise()},_build_query:function(e){return _.map(e,function(e,t){return t+"="+e}).join("&")},clean_global_regions:function(){Upfront.data.global_regions=!1},open_global_region_manager:function(){var t=Upfront.Behaviors.LayoutEditor;Upfront.Popup.open(function(o,n,r){var i=e(this);i.html('<p class="upfront-popup-placeholder">'+Upfront.Settings.l10n.global.behaviors.loading_content+"</p>"),Upfront.data.global_regions?t._render_global_region_manager(i):t._refresh_global_regions().done(function(){t._render_global_region_manager(i)})},{width:600},"global-region-manager")},open_theme_fonts_manager:function(){var t={},o=new Upfront.Views.Editor.Fonts.Text_Fonts_Manager({collection:Upfront.Views.Editor.Fonts.theme_fonts_collection});if(o.render(),Upfront.Application.mode.current===Upfront.Application.MODE.THEME){var n=new Upfront.Views.Editor.Fonts.Icon_Fonts_Manager({collection:Upfront.Views.Editor.Fonts.icon_fonts_collection});n.render()}Upfront.Popup.open(function(o,n,r){var i=e(this);i.empty().append('<p class="upfront-popup-placeholder">'+Upfront.Settings.l10n.global.behaviors.loading_content+"</p>"),t.$popup={top:n,content:i,bottom:r}},{width:750},"font-manager-popup");t.$popup.top.html('<ul class="upfront-tabs"><li id="theme-text-fonts-tab" class="active">'+Upfront.Settings.l10n.global.behaviors.theme_text_fonts+"</li>"+(Upfront.Application.mode.current===Upfront.Application.MODE.THEME?'<li id="theme-icon-fonts-tab">'+Upfront.Settings.l10n.global.behaviors.theme_icon_fonts+"</li>":"")+"</ul>"+t.$popup.top.html()),t.$popup.top.on("click","#theme-text-fonts-tab",function(n){t.$popup.content.html(o.el),e("#theme-icon-fonts-tab").removeClass("active"),e("#theme-text-fonts-tab").addClass("active"),e(".theme-fonts-ok-button").css("margin-top","30px")}),t.$popup.top.on("click","#theme-icon-fonts-tab",function(){t.$popup.content.html(n.el),e("#theme-text-fonts-tab").removeClass("active"),e("#theme-icon-fonts-tab").addClass("active"),e(".theme-fonts-ok-button").css("margin-top",0)}),t.$popup.bottom.append('<a class="theme-fonts-ok-button">'+Upfront.Settings.l10n.global.behaviors.ok+"</a>"),t.$popup.content.html(o.el),o.set_ok_button(t.$popup.bottom.find(".theme-fonts-ok-button")),t.$popup.bottom.find(".theme-fonts-ok-button").on("click",function(){Upfront.Popup.close()})},_refresh_global_regions:function(){return Upfront.Util.post({action:"upfront_list_scoped_regions",scope:"global",storage_key:_upfront_save_storage_key}).done(function(e){Upfront.data.global_regions=e.data})},_render_global_region_manager:function(t){var o=Upfront.Behaviors.LayoutEditor,n=Upfront.Application.layout.get("regions"),r=[{title:Upfront.Settings.l10n.global.behaviors.global_regions,classname:"global",data:_.sortBy(Upfront.data.global_regions,function(e,t,o){return e.container&&e.name!=e.container?3*_.indexOf(o,_.findWhere(o,{name:e.container}))+1:3*t})},{title:Upfront.Settings.l10n.global.behaviors.lightboxes,classname:"lightbox",data:Upfront.Util.model_to_json(n.filter(function(e){return"lightbox"==e.get("sub")}))}];t.html(""),_.each(r,function(n){var r=e('<div class="global-region-manager-wrap global-region-manager-'+n.classname+'"></div>'),i=e('<h3 class="global-region-manager-title">'+n.title+"</h3>"),a=e('<div class="global-region-manager-content upfront-scroll-panel"></div>');r.append([i,a]),o._render_regions(n.data,a,n.classname),t.append(r),Upfront.Views.Mixins.Upfront_Scroll_Mixin.stop_scroll_propagation(a)}),t.on("click",".region-list-edit",function(e){e.preventDefault()}),t.on("click",".region-list-trash",function(r){r.preventDefault();var i=e(this).attr("data-name");e(this).closest(".global-region-manager-wrap").hasClass("global-region-manager-global")&&confirm("Deleting the global regions will remove it from all layouts. Continue?")&&Upfront.Util.post({action:"upfront_delete_scoped_regions",scope:"global",name:i,storage_key:_upfront_save_storage_key}).done(function(e){e.data&&(_.each(e.data,function(e){var t=n.get_by_name(e);n.remove(t)}),o._refresh_global_regions().done(function(){o._render_global_region_manager(t)}))})})},_render_regions:function(t,o,n){var r=e('<ul class="global-region-manager-lists"></ul>');if(_.each(t,function(e){var o=["global-region-manager-list"],n=!1;e.container&&e.name!=e.container?(n=_.find(t,function(t){return t.name==e.container}),o.push("region-list-sub"),o.push("region-list-sub-"+e.sub),n&&o.push("region-list-sub-has-main")):o.push("region-list-main"),r.append('<li class="'+o.join(" ")+'"><span class="region-list-name">'+e.title+'</span><span class="region-list-control">'+(!1===Upfront.plugins.isForbiddenByPlugin("show region list trash")?'<a href="#" class="region-list-trash" data-name="'+e.name+'">'+Upfront.Settings.l10n.global.behaviors.trash+"</a>":"")+"</span></li>")}),t.length<1){if("lightbox"===n)var i=Upfront.Settings.l10n.global.behaviors.no_lightboxes;else var i=Upfront.Settings.l10n.global.behaviors.no_global_regions;r='<span class="region-list-empty">'+i+"</span>"}o.append(r)},import_image_dialog:function(){var e=Upfront.Behaviors.LayoutEditor,t=[],o=[];Upfront.Events.trigger("upfront:import_image:populate_theme_images",t),t.length<=0||Upfront.Util.post({action:"upfront_list_import_image",images:t}).done(function(t){0===parseInt(t.data.error,10)&&(_.each(t.data.images,function(e){"not_exists"===e.status?o.push(e.filepath):"exists"===e.status&&Upfront.Events.trigger("upfront:import_image:imported",e)}),o.length>0&&e.open_import_image_dialog(o))})},open_import_image_dialog:function(t){var o=Upfront.Behaviors.LayoutEditor;o.import_image_modal||(o.import_image_modal=new Upfront.Views.Editor.Modal({to:e("body"),button:!1,top:120,width:600}),o.import_image_modal.render(),e("body").append(o.import_image_modal.el)),o.import_image_modal.open(function(n,r){var i=!1,a=new Upfront.Views.Editor.Field.Button({name:"import_image",label:Upfront.Settings.l10n.global.behaviors.import_image_button,compact:!0,classname:"upfront-import-image-button",on_click:function(){i||(o.do_import_image(t).done(function(){n.html("<p>"+Upfront.Settings.l10n.global.behaviors.import_image_done_description+"</p>"),setTimeout(function(){o.import_image_modal.close()},3e3)}),i=!0)}}),l=new Upfront.Views.Editor.Field.Button({name:"import_image_ignore",label:Upfront.Settings.l10n.global.behaviors.import_image_ignore_button,compact:!0,classname:"upfront-import-image-button",on_click:function(){o.import_image_modal.close()}}),s=e('<ul class="upfront-import-image-list upfront-scroll-panel"></ul>');r.addClass("upfront-import-image-modal"),n.html("<p>"+Upfront.Settings.l10n.global.behaviors.import_image_description+"</p>"),_.each(t,function(e,t){s.append('<li class="upfront-import-image-each" id="import-image-'+t+'"><img src="'+e+'" alt="" /></li>')}),n.append(s),_.each([a,l],function(e){e.render(),e.delegateEvents(),n.append(e.$el)})},o)},do_import_image:function(t){var o,n=Upfront.Behaviors.LayoutEditor,r=4,i=function(t){for(var o=n._import_image_index;o<n._import_image_index+r;o++)e("#import-image-"+o).removeClass("processing done").addClass(t)};return n._import_image_index||(n._import_image_index=0),n._import_image_deferred||(n._import_image_deferred=new e.Deferred),o=t.slice(n._import_image_index,n._import_image_index+r),0===o.length?(n._import_image_deferred.resolve(),void(n._import_image_index=!1)):(i("processing"),Upfront.Util.post({action:"upfront_import_image",images:o}).done(function(e){_.each(e.data.images,function(e){"import_success"===e.status&&Upfront.Events.trigger("upfront:import_image:imported",e)}),i("done"),n._import_image_index+=r,n.do_import_image(t)}),n._import_image_deferred.promise())}};define(t)}(jQuery);