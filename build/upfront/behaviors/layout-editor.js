(function(e){var t={selection:[],selecting:!1,create_mergeable:function(t,n){var r=this,i=Upfront.Behaviors.LayoutEditor,s=r.layout.get("regions");t.$el.selectable({distance:10,filter:".upfront-module",cancel:".upfront-module, .upfront-module-group, .upfront-region-side-fixed, .upfront-entity_meta, .upfront-region-edit-trigger, .upfront-region-edit-fixed-trigger, .upfront-region-finish-edit, .upfront-icon-control-region-resize, .upfront-inline-modal, .upfront-inline-panels",selecting:function(t,n){var r=e(n.selecting),s,o,u,a,f;if(r.closest(".upfront-module-group").length>0)return;if(i.selection.length>0){s=e(i.selection[0]).closest(".upfront-region");if(r.closest(".upfront-region").get(0)!=s.get(0))return;i._add_selections(s.find(".ui-selecting"),s.find(".upfront-module").not(".upfront-ui-selected, .upfront-module-parent-group"))}else i._add_selection(n.selecting);i._update_selection_outline()},unselecting:function(t,n){var r=e(n.unselecting),s,o,u,a;if(i.selection.length>0){s=e(i.selection[0]).closest(".upfront-region"),o=e(i.selection).filter(".ui-selecting"),a=i._get_group_position(o),u=i._find_affected_el(e(i.selection).not(".ui-selecting"),a.element),_.each(i.selection,function(t){var n=!1;if(e(t).hasClass("ui-selecting"))return;u!==!1&&u.length>0&&u.each(function(){this==t&&(n=!0)});if(n)return;i._remove_selection(t)}),i._update_selection_outline();return}i._remove_selection(n.unselecting)},unselected:function(t,n){var r=e(n.unselected);r.find(".upfront-selected-border").remove(),e(".upfront-module-group-group").remove()},start:function(e,t){i.selection=[],i.selecting=!0},stop:function(t,n){if(!e(".upfront-ui-selected").length)return!1;var r=this,o=e(".upfront-ui-selected:first").closest(".upfront-region"),u=s.get_by_name(o.data("name")),a=u?u.get("modules"):!1,f=u?u.get("wrappers"):!1,l=function(){e(this).find(".upfront-selected-border").remove(),e(this).removeClass("upfront-ui-selected ui-selected")},c=e(".upfront-ui-selected");if(c.length<2)return c.each(function(){i._remove_selection(this)}),e("#upfront-group-selection").remove(),!1;e(".upfront-module-group-group").remove();var h=e('<div class="upfront-module-group-toggle upfront-module-group-group">'+Upfront.Settings.l10n.global.behaviors.group+"</div>"),p=sel_left=sel_right=sel_bottom=!1,d=wrap_left=wrap_right=wrap_bottom=!1,v=group_left=0;e("body").append(h),c.each(function(){var t=e(this).offset(),n=e(this).outerWidth(),r=e(this).outerHeight(),i=e(this).closest(".upfront-wrapper"),s=i.offset(),o=i.outerWidth(),u=i.outerHeight();t.right=t.left+n,t.bottom=t.top+r,p=p===!1||t.top<p?t.top:p,sel_bottom=sel_bottom===!1||t.bottom>sel_bottom?t.bottom:sel_bottom,sel_left=sel_left===!1||t.left<sel_left?t.left:sel_left,sel_right=sel_right===!1||t.right>sel_right?t.right:sel_right,s.right=s.left+o,s.bottom=s.top+u,d=d===!1||s.top<d?s.top:d,wrap_bottom=wrap_bottom===!1||s.bottom>wrap_bottom?s.bottom:wrap_bottom,wrap_left=wrap_left===!1||s.left<wrap_left?s.left:wrap_left,wrap_right=wrap_right===!1||s.right>wrap_right?s.right:wrap_right}),v=p+Math.round((sel_bottom-p)/2)-Math.round(h.outerHeight()/2),group_left=sel_left+Math.round((sel_right-sel_left)/2)-Math.round(h.outerWidth()/2),h.css({position:"absolute",zIndex:999999,top:v,left:group_left}),setTimeout(function(){i.selecting=!1},1e3),h.on("click",function(){var t=Upfront.Behaviors.GridEditor,n=Upfront.Util.get_unique_id("module-group"),r=new Upfront.Models.ModuleGroup,i=!1,s=r.get("modules"),l=r.get("wrappers"),h=Upfront.Util.get_unique_id("wrapper"),v=new Upfront.Models.Wrapper,m=!1,g=!1,y=!1,b=!1,w=!1,E=[],S=[],x=Math.round((wrap_right-wrap_left)/t.grid.column_width),T=0,N=!1,C=!1,k=!1,L=!1,A=0,O=0,M=0,D=0,P,H,B,j=[],F=0;c.each(function(n){var r=e(this),i=r.attr("id"),s=a.get_by_element_id(i),o=s.get_property_value_by_name("class"),u=t.get_class_num(o,t.grid.class),l=t.get_class_num(o,t.grid.top_margin_class),c=t.get_class_num(o,t.grid.left_margin_class),h=a.indexOf(s),p=h-T==1,d=s.get_wrapper_id(),v=P==d,m=f.get_by_wrapper_id(d),g=m.get_property_value_by_name("class"),y=t.get_class_num(g,t.grid.class),b;N===!1&&(N=h),v||M++,!v&&(n==0||!p||O+y>x||g.match(/clr/))?(A++,p=!1,O=y):v?p=O==y||g.match(/clr/)?!1:!0:O+=y,S.push({model:s,col:u,is_next:p,margin_top:l,margin_left:c,wrapper_class:g,wrapper_col:y,wrapper_id:d,line:A});if(M==1||!p||g.match(/clr/))k=k===!1||c<k?c:k;A==1&&!v&&(C=C===!1||l<C?l:C),L=L===!1||O>L?O:L,P=d,T=h}),m=Upfront.data.module_views[S[0].model.cid],t.start(m,m.model),g=t.get_el(m.$el.find(".upfront-editable_entity:first")),y=t.get_grid(sel_left,p),b=t.get_grid(wrap_left,d),g.grid={top:y.y,left:y.x,right:y.x+Math.round((sel_right-sel_left)/t.col_size)-1,bottom:y.y+Math.round((sel_bottom-p)/t.baseline)-1},g.outer_grid={top:b.y,left:b.x,right:b.x+Math.round((wrap_right-wrap_left)/t.col_size)-1,bottom:b.y+Math.round((wrap_bottom-d)/t.baseline)-1},w=t.get_affected_els(g,t.els,[g],!1),_.each(_.union(w.left,w.right),function(e){var t=!1;_.isArray(E)&&_.each(E,function(n,r){if(t)return;e.outer_grid.left<n.right&&e.outer_grid.right>n.left&&e.outer_grid.top>=n.bottom&&(n.els.push(e),n.bottom=e.outer_grid.bottom,n.left=e.outer_grid.left<n.left?e.outer_grid.left:n.left,n.right=e.outer_grid.right>n.right?e.outer_grid.right:n.right,t=!0)}),t||E.push({top:e.outer_grid.top,bottom:e.outer_grid.bottom,left:e.outer_grid.left,right:e.outer_grid.right,els:[e]})}),k=k===!1?0:k,C=C===!1?0:C,L-=k,F=L+k,M=0,P=!1,_.each(S,function(e,n){var r=e.wrapper_id,i=[];P!=r&&(B=new Upfront.Models.Wrapper({}),H=Upfront.Util.get_unique_id("wrapper"),B.set_property("wrapper_id",H),B.set_property("class",e.wrapper_class),l.add(B),D=0,M++),M==1||!e.is_next||e.wrapper_class.match(/clr/)?(i.push(t.grid.left_margin_class+(e.margin_left-k)),D=e.wrapper_col-k):D=e.wrapper_col,e.line==1&&P!=r&&i.push(t.grid.top_margin_class+(e.margin_top-C)),B.replace_class(t.grid.class+D),P=r,e.model.set_property("wrapper_id",H),e.model.replace_class(i.join(" ")),a.remove(e.model,{silent:!0}),s.add(e.model)}),M>1?(v.set_property("wrapper_id",h),j.push(t.grid.class+F),S[0].wrapper_class.match(/clr/)&&j.push("clr"),v.set_property("class",j.join(" ")),f.add(v),r.set_property("wrapper_id",h)):r.set_property("wrapper_id",P),r.set_property("element_id",n),r.replace_class(t.grid.class+L+" "+t.grid.top_margin_class+C+" "+t.grid.left_margin_class+k),r.set_property("original_col",L),r.add_to(a,N),_.each(E,function(e,n){if(e.els.length<=1)return;var r=e.els[0].$el.attr("id"),i=a.get_by_element_id(r),s=a.indexOf(i),o=i?i.get_wrapper_id():!1,u=o?f.get_by_wrapper_id(o):!1,l=e.els[0].$el.closest(".upfront-wrapper");if(!i)return;_.each(_.rest(e.els,1),function(e,t){var n=e.$el.attr("id"),r=a.get_by_element_id(n),i=r?r.get_wrapper_id():!1;if(!r||i==o)return;r.set_property("wrapper_id",o),a.remove(r,{silent:!0}),r.add_to(a,s+t+1)}),u.replace_class(t.grid.class+(e.right-e.left+1))}),t.update_position_data(o.find(".upfront-editable_entities_container:first")),t.update_wrappers(u),e(this).remove(),e("#upfront-group-selection").remove(),Upfront.Events.trigger("entity:module_group:group",r,u)})}})},refresh_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("refresh")})},enable_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("enable")})},disable_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("disable")})},destroy_mergeable:function(){this.remove_selections(),e(".ui-selectable").each(function(){e(this).selectable("destroy")})},_get_group_position:function(t){var n=sel_left=sel_right=sel_bottom=!1,r=wrap_left=wrap_right=wrap_bottom=!1;return t.each(function(){var t=e(this).offset(),i=e(this).outerWidth(),s=e(this).outerHeight(),o=e(this).closest(".upfront-wrapper"),u=o.offset(),a=o.outerWidth(),f=o.outerHeight();t.right=t.left+i,t.bottom=t.top+s,n=n===!1||t.top<n?t.top:n,sel_bottom=sel_bottom===!1||t.bottom>sel_bottom?t.bottom:sel_bottom,sel_left=sel_left===!1||t.left<sel_left?t.left:sel_left,sel_right=sel_right===!1||t.right>sel_right?t.right:sel_right,u.right=u.left+a,u.bottom=u.top+f,r=r===!1||u.top<r?u.top:r,wrap_bottom=wrap_bottom===!1||u.bottom>wrap_bottom?u.bottom:wrap_bottom,wrap_left=wrap_left===!1||u.left<wrap_left?u.left:wrap_left,wrap_right=wrap_right===!1||u.right>wrap_right?u.right:wrap_right}),{element:{top:n,bottom:sel_bottom,left:sel_left,right:sel_right},wrapper:{top:r,bottom:wrap_bottom,left:wrap_left,right:wrap_right}}},_find_affected_el:function(t,n){if(this.selection.length==0)return!1;var r=!1;return t.each(function(){var t=e(this).offset(),i=e(this).width(),s=e(this).height(),o=t.top+s,u=t.left+i;n.top<o&&n.bottom>t.top&&n.left<u&&n.right>t.left&&(r=r!==!1?r.add(e(this)):e(this))}),r},_update_selection_outline:function(){var t=e("#upfront-group-selection"),n=this._get_group_position(e(this.selection));t.length||(t=e('<div id="upfront-group-selection" />'),t.appendTo("body")),t.css({top:n.element.top,left:n.element.left,height:n.element.bottom-n.element.top,width:n.element.right-n.element.left})},_add_selection:function(t){var n=_.find(this.selection,function(e){return e==t});if(n)return;this.selection.push(t),e(t).addClass("upfront-ui-selected")},_add_selections:function(e,t,n){var r=this,i=!1,n=n?n:1,s=e.length,o=r._get_group_position(e),u=r._find_affected_el(t,o.element);u!==!1&&u.each(function(){r._add_selection(this)});return},_remove_selection:function(t){this.selection=_.reject(this.selection,function(e){return e==t}),e(t).find(".upfront-selected-border").remove(),e(t).removeClass("upfront-ui-selected ui-selected")},remove_selections:function(){var t=Upfront.Behaviors.LayoutEditor;_.each(t.selection,function(e){t._remove_selection(e)}),t._update_selection_outline(),e(".upfront-module-group-group").remove()},create_undo:function(){this.layout.store_undo_state()},apply_history_change:function(){var e=Upfront.Application.layout.get("regions"),t=e?e.get_by_name("shadow"):!1;e&&t&&(e.remove(t),t=!1),Upfront.Application.layout_view.local_view=!1,Upfront.Application.layout_view.render()},save_dialog:function(t,n){e("body").append("<div id='upfront-save-dialog-background' />"),e("body").append("<div id='upfront-save-dialog' />");var r=e("#upfront-save-dialog"),i=e("#upfront-save-dialog-background"),s=Upfront.Application.layout.get("current_layout"),o="";i.width(e(window).width()).height(e(document).height()),o+="<p>"+Upfront.Settings.l10n.global.behaviors.this_post_only+"</p>",e.each(_upfront_post_data.layout,function(e,t){if(e=="type")return;o+='<span class="upfront-save-button" data-save-as="'+t+'">'+Upfront.Settings.LayoutEditor.Specificity[e]+"</span>"}),r.html(o),e("#upfront-save-dialog").on("click",".upfront-save-button",function(){var s=e(this).attr("data-save-as");return i.remove(),r.remove(),t.apply(n,[s]),!1}),e("#upfront-save-dialog-background").on("click",function(){return i.remove(),r.remove(),!1})},load_theme:function(e){var t=location.origin;t+=location.pathname.split("create_new")[0],t+="create_new/"+e,location.toString().indexOf("dev=true")>-1&&(t+="?dev=true"),window.location=t},open_theme_fonts_manager:function(){var t={},n=new Upfront.Views.Editor.Fonts.Text_Fonts_Manager({collection:Upfront.Views.Editor.Fonts.theme_fonts_collection});n.render();var r=new Upfront.Views.Editor.Fonts.Icon_Fonts_Manager({collection:Upfront.Views.Editor.Fonts.icon_fonts_collection});r.render();var i=Upfront.Popup.open(function(n,r,i){var s=e(this);s.empty().append('<p class="upfront-popup-placeholder">'+Upfront.Settings.l10n.global.behaviors.loading_content+"</p>"),t.$popup={top:r,content:s,bottom:i}},{width:750},"font-manager-popup");t.$popup.top.html('<ul class="upfront-tabs"><li id="theme-text-fonts-tab" class="active">'+Upfront.Settings.l10n.global.behaviors.theme_text_fonts+"</li>"+'<li id="theme-icon-fonts-tab">'+Upfront.Settings.l10n.global.behaviors.theme_icon_fonts+"</li>"+"</ul>"+t.$popup.top.html()),t.$popup.top.on("click","#theme-text-fonts-tab",function(r){t.$popup.content.html(n.el),e("#theme-icon-fonts-tab").removeClass("active"),e("#theme-text-fonts-tab").addClass("active"),e(".theme-fonts-ok-button").css("margin-top","30px")}),t.$popup.top.on("click","#theme-icon-fonts-tab",function(){t.$popup.content.html(r.el),e("#theme-text-fonts-tab").removeClass("active"),e("#theme-icon-fonts-tab").addClass("active"),e(".theme-fonts-ok-button").css("margin-top",0)}),t.$popup.bottom.append('<a class="theme-fonts-ok-button">'+Upfront.Settings.l10n.global.behaviors.ok+"</a>"),t.$popup.content.html(n.el),n.set_ok_button(t.$popup.bottom.find(".theme-fonts-ok-button")),t.$popup.bottom.find(".theme-fonts-ok-button").on("click",function(){Upfront.Popup.close()})},create_layout_dialog:function(){var t=Upfront.Application,n=Upfront.Behaviors.LayoutEditor,r={layout:new Upfront.Views.Editor.Field.Select({name:"layout",values:[{label:Upfront.Settings.l10n.global.behaviors.loading,value:""}],change:function(){var e=this.get_value();e==="single-page"?r.$_page_name_wrap.show():r.$_page_name_wrap.hide()}}),page_name:new Upfront.Views.Editor.Field.Text({name:"page_name",label:Upfront.Settings.l10n.global.behaviors.page_layout_name}),inherit:new Upfront.Views.Editor.Field.Radios({name:"inherit",layout:"horizontal-inline",values:[{label:Upfront.Settings.l10n.global.behaviors.start_fresh,value:""},{label:Upfront.Settings.l10n.global.behaviors.start_from_existing,value:"existing"}]}),existing:new Upfront.Views.Editor.Field.Select({name:"existing",values:[]})};n.available_layouts?r.layout.options.values=_.map(n.available_layouts,function(e,t){return{label:e.label,value:t,disabled:e.saved}}):Upfront.Util.post({action:"upfront_list_available_layout"}).done(function(e){n.available_layouts=e.data,r.layout.options.values=_.map(n.available_layouts,function(e,t){return{label:e.label,value:t,disabled:e.saved}}),r.layout.render(),r.layout.delegateEvents()}),n.all_templates?r.existing.options.values=_.map(n.all_templates,function(e,t){return{label:t,value:e}}):Upfront.Util.post({action:"upfront-wp-model",model_action:"get_post_extra",postId:"fake",allTemplates:!0}).done(function(e){if(!e.data||!e.data.allTemplates)return!1;if(0===e.data.allTemplates.length)return r.inherit.$el.hide(),r.existing.$el.hide(),!1;n.all_templates=e.data.allTemplates,r.existing.options.values=[],_.each(e.data.allTemplates,function(e,t){r.existing.options.values.push({label:t,value:e})}),r.existing.render()}),n.layout_modal||(n.layout_modal=new Upfront.Views.Editor.Modal({to:e("body"),button:!1,top:120,width:540}),n.layout_modal.render(),e("body").append(n.layout_modal.el)),n.layout_modal.open(function(t,i){var s=e('<div style="clear:both"><span class="uf-button">'+Upfront.Settings.l10n.global.behaviors.create+"</span></div>"),o=e('<div class="upfront-modal-select-wrap" />');$page_name_wrap=e('<div class="upfront-modal-select-wrap" />'),r.$_page_name_wrap=$page_name_wrap,_.each(r,function(e){if(!e.render)return!0;e.render(),e.delegateEvents()}),t.html('<h1 class="upfront-modal-title">'+Upfront.Settings.l10n.global.behaviors.create_new_layout+"</h1>"),o.append(r.layout.el),t.append(o),$page_name_wrap.hide(),$page_name_wrap.append(r.page_name.el),$page_name_wrap.append(r.inherit.el),$page_name_wrap.append(r.existing.el),t.append($page_name_wrap),t.append(s),s.on("click",function(){n.layout_modal.close(!0)})},n).done(function(){var e=r.layout.get_value(),i=t.layout.get("layout_slug"),s=_.extend({},n.available_layouts[e]),o=r.page_name.get_value();e==="single-page"&&o&&(e="single-page-"+o.replace(/\s/g,"-").toLowerCase(),s={layout:{type:"single",item:"single-page",specificity:e}}),s.use_existing=e.match(/^single-page/)&&o&&"existing"===r.inherit.get_value()?r.existing.get_value():!1,t.create_layout(s.layout,{layout_slug:i,use_existing:s.use_existing}).done(function(){t.layout.set("current_layout",e),n._export_layout()})})},browse_layout_dialog:function(){var t=Upfront.Application,n=Upfront.Behaviors.LayoutEditor,r={layout:new Upfront.Views.Editor.Field.Select({name:"layout",values:[{label:Upfront.Settings.l10n.global.behaviors.loading,value:""}],default_value:t.layout.get("current_layout")})};n.browse_modal||(n.browse_modal=new Upfront.Views.Editor.Modal({to:e("body"),button:!1,top:120,width:540}),n.browse_modal.render(),e("body").append(n.browse_modal.el)),n._get_saved_layout().done(function(e){!e||e.length==0?r.layout.options.values=[{label:Upfront.Settings.l10n.global.behaviors.no_saved_layout,value:""}]:r.layout.options.values=_.map(n.saved_layouts,function(e,t){return{label:e.label,value:t}}),r.layout.render(),r.layout.delegateEvents()}),n.browse_modal.open(function(t,i){var s=e('<span class="uf-button">'+Upfront.Settings.l10n.global.behaviors.edit+"</span>"),o=e('<div class="upfront-modal-select-wrap" />');_.each(r,function(e){e.render(),e.delegateEvents()}),t.html('<h1 class="upfront-modal-title">'+Upfront.Settings.l10n.global.behaviors.edit_saved_layout+"</h1>"),o.append(r.layout.el),t.append(o),t.append(s),s.on("click",function(){n.browse_modal.close(!0)})},n).done(function(){var e=r.layout.get_value(),i=t.layout.get("layout_slug"),s=n.saved_layouts[e];s.latest_post&&(_upfront_post_data.post_id=s.latest_post),t.layout.set("current_layout",e),t.load_layout(s.layout,{layout_slug:i})})},is_exporter_start_page:function(){return Upfront.themeExporter.currentTheme==="upfront"},export_dialog:function(){var t=Upfront.Application,n=Upfront.Behaviors.LayoutEditor,r,i;i=new Upfront.Views.Editor.Loading({loading:Upfront.Settings.l10n.global.behaviors.checking_layouts,done:Upfront.Settings.l10n.global.behaviors.layout_exported,fixed:!0}),n.is_exporter_start_page()?(r={theme:new Upfront.Views.Editor.Field.Select({name:"theme",default_value:Upfront.themeExporter.currentTheme==="upfront"?"":Upfront.themeExporter.currentTheme,label:Upfront.Settings.l10n.global.behaviors.select_theme,values:[{label:Upfront.Settings.l10n.global.behaviors.new_theme,value:""}],change:function(){var t=this.get_value(),n=e([r.name.el,r.directory.el,r.author.el,r.author_uri.el]);t!=""?n.hide():n.show()}}),name:new Upfront.Views.Editor.Field.Text({name:"name",label:Upfront.Settings.l10n.global.behaviors.theme_name}),directory:new Upfront.Views.Editor.Field.Text({name:"directory",label:Upfront.Settings.l10n.global.behaviors.directory}),author:new Upfront.Views.Editor.Field.Text({name:"author",label:Upfront.Settings.l10n.global.behaviors.author}),author_uri:new Upfront.Views.Editor.Field.Text({name:"author_uri",label:Upfront.Settings.l10n.global.behaviors.author_uri}),activate:new Upfront.Views.Editor.Field.Checkboxes({name:"activate",default_value:!0,multiple:!1,values:[{label:Upfront.Settings.l10n.global.behaviors.activate_upon_creation,value:1}]}),with_images:new Upfront.Views.Editor.Field.Checkboxes({name:"with_images",default_value:!0,multiple:!1,values:[{label:Upfront.Settings.l10n.global.behaviors.export_theme_images,value:1}]})},n.export_modal||(n.export_modal=new Upfront.Views.Editor.Modal({to:e("body"),button:!1,top:120,width:540}),n.export_modal.render(),e("body").append(n.export_modal.el)),n._get_themes().done(function(e){r.theme.options.values=_.union([{label:Upfront.Settings.l10n.global.behaviors.new_theme,value:""}],_.map(e,function(e,t){return{label:e.name,value:e.directory}})),r.theme.render(),r.theme.delegateEvents(),r.theme.$el.find("input").trigger("change")}),n.export_modal.open(function(t,s){var o=e('<span class="uf-button">'+Upfront.Settings.l10n.global.behaviors.export_button+"</span>");_.each(r,function(e){e.render(),e.delegateEvents()}),t.html('<h1 class="upfront-modal-title">'+Upfront.Settings.l10n.global.behaviors.export_theme+"</h1>"),t.append(r.theme.el),t.append(r.name.el),t.append(r.directory.el),t.append(r.author.el),t.append(r.author_uri.el),t.append(r.activate.el),t.append(r.with_images.el),t.append(o),o.on("click",function(){var t,s,o,u,a;t=r.theme.get_value()?r.theme.get_value():r.directory.get_value(),s=function(){var e={"thx-theme-name":r.name.get_value(),"thx-theme-slug":r.directory.get_value(),"thx-author":r.author.get_value(),"thx-author-uri":r.author_uri.get_value(),"thx-theme-template":"upfront","thx-activate_theme":r.activate.get_value()||"","thx-export_with_images":r.with_images.get_value()||"",add_global_regions:Upfront.Application.current_subapplication.layout.get("layout_slug")!=="blank"};return i.update_loading_text(Upfront.Settings.l10n.global.behaviors.creating_theme),n._create_theme(e)},i.render(),e("body").append(i.el),s().done(function(){n.export_single_layout(i,t).done(function(){n.load_theme(t)})})})},n)):(i.render(),e("body").append(i.el),n.export_single_layout(i,Upfront.themeExporter.currentTheme))},export_single_layout:function(e,t){var n=this,r=Upfront.Application,i=Upfront.Behaviors.LayoutEditor,s=_upfront_post_data.layout.specificity||_upfront_post_data.layout.item||_upfront_post_data.layout.type;return e.update_loading_text(Upfront.Settings.l10n.global.behaviors.exporting_layout+s),i._export_layout({theme:t}).done(function(){e.done(function(){i.export_modal&&i.export_modal.close(!0),i.clean_region_css()})})},first_save_dialog:function(e){var t=Upfront.Application,n=Upfront.Behaviors.LayoutEditor,r=t.layout.get("current_layout");e&&(!r||r=="archive-home")&&n.message_dialog(Upfront.Settings.l10n.global.behaviors.excellent_start,Upfront.Settings.l10n.global.behaviors.homepage_created)},message_dialog:function(t,n){var r=Upfront.Application,i=Upfront.Behaviors.LayoutEditor;i.message_modal||(i.message_modal=new Upfront.Views.Editor.Modal({to:e("body"),button:!0,top:120,width:540}),i.message_modal.render(),e("body").append(i.message_modal.el)),i.message_modal.open(function(e,r){r.addClass("upfront-message-modal"),e.html('<h1 class="upfront-modal-title">'+t+"</h1>"),e.append(n)},i)},_get_saved_layout:function(){var t=this,n=new e.Deferred;return Upfront.Util.post({action:"upfront_list_theme_layouts"}).success(function(e){t.saved_layouts=e.data,n.resolve(e.data)}).error(function(){n.reject()}),n.promise()},_get_themes:function(){var t=this,n=new e.Deferred;return Upfront.Util.post({action:"upfront_thx-get-themes"}).success(function(e){t.themes=e,n.resolve(e)}).error(function(){n.reject()}),n.promise()},_create_theme:function(t){var n=new e.Deferred;return Upfront.Util.post({action:"upfront_thx-create-theme",form:this._build_query(t)}).success(function(e){e&&e.error?n.reject(e.error):n.resolve()}).error(function(){n.reject()}),n.promise()},export_element_styles:function(e){Upfront.Util.post({action:"upfront_thx-export-element-styles",data:e}).success(function(t){if(t&&t.error){Upfront.Views.Editor.notify(t.error);return}Upfront.data.styles[e.elementType]||(Upfront.data.styles[e.elementType]=[]),Upfront.data.styles[e.elementType].indexOf(e.stylename)===-1&&Upfront.data.styles[e.elementType].push(e.stylename),Upfront.Views.Editor.notify(Upfront.Settings.l10n.global.behaviors.style_exported)}).error(function(){Upfront.Views.Editor.notify(Upfront.Settings.l10n.global.behaviors.style_export_fail)})},_export_layout:function(t){var n,r,i,s,o={};return n=_.findWhere(Upfront.Application.current_subapplication.get_layout_data().properties,{name:"typography"}),i=_.findWhere(Upfront.Application.current_subapplication.get_layout_data().properties,{name:"layout_style"}),r=_.extend({},Upfront.Util.model_to_json(Upfront.Application.current_subapplication.get_layout_data().properties)),r=_.reject(r,function(e){return _.contains(["typography","layout_style","global_regions"],e.name)}),o={typography:n?JSON.stringify(n.value):"",regions:JSON.stringify(Upfront.Application.current_subapplication.get_layout_data().regions),template:_upfront_post_data.layout.specificity||_upfront_post_data.layout.item||_upfront_post_data.layout.type,layout_properties:JSON.stringify(r),theme:Upfront.themeExporter.currentTheme,layout_style:i?i.value:"",theme_colors:{colors:Upfront.Views.Theme_Colors.colors.toJSON(),range:Upfront.Views.Theme_Colors.range},post_image_variants:Upfront.Content.ImageVariants.toJSON()},Upfront.themeExporter.layoutStyleDirty&&(o.layout_style=e("#layout-style").html(),Upfront.themeExporter.layoutStyleDirty=!1),t&&(o=_.extend(o,t)),s=new e.Deferred,Upfront.Util.post({action:"upfront_thx-export-layout",data:o}).success(function(e){e&&e.error?s.reject(e.error):s.resolve()}).error(function(){s.reject()}),s.promise()},clean_region_css:function(){var t=this,n=Upfront.Application.cssEditor,r=Upfront.Behaviors.LayoutEditor,i=[n.elementTypes.RegionContainer,n.elementTypes.Region],s=_upfront_post_data.layout,o=s.specificity||s.item||s.type,u=Upfront.Application.layout.get("regions"),a=[],f=[],l=function(t){if(!f[t]){Upfront.Views.Editor.notify(Upfront.Settings.l10n.global.behaviors.region_css_cleaned),c.resolve();return}var n=f[t].elementType,r=f[t].styleName;Upfront.Application.get_current()===Upfront.Settings.Application.MODE.THEME?data={action:"upfront_thx-delete-element-styles",data:{stylename:r,elementType:n}}:data={action:"upfront_delete_styles",styleName:r,elementType:n},Upfront.Util.post(data).done(function(){var i=Upfront.data.styles[n].indexOf(r);i!=-1&&Upfront.data.styles[n].splice(i,1),e("#upfront-style-"+r).remove(),l(t+1)})},c=new e.Deferred;return u.each(function(e){var t=e.is_main()?n.elementTypes.RegionContainer.id:n.elementTypes.Region.id,r=o+"-"+e.get("name")+"-style",i=e.get("scope")=="global";_.isArray(Upfront.data.styles[t])&&Upfront.data.styles[t].indexOf(r)!=-1&&a.push(r),r=t+"-"+e.get("name")+"-style",_.isArray(Upfront.data.styles[t])&&Upfront.data.styles[t].indexOf(r)!=-1&&a.push(r)}),r._get_saved_layout().done(function(e){_.each(i,function(t){_.each(Upfront.data.styles[t.id],function(n){var r=!1;_.each(e,function(e,t){if(t==o)return;var i=o.match(new RegExp("^"+t+"-"));n.match(new RegExp("^"+t))&&(!i||i&&!n.match(new RegExp("^"+o)))&&(r=!0)}),!_.contains(a,n)&&n.match(new RegExp("^"+o))&&!r&&f.push({elementType:t.id,styleName:n})})}),f.length>0&&(Upfront.Views.Editor.notify(Upfront.Settings.l10n.global.behaviors.cleaning_region_css),l(0))}),c.promise()},_build_query:function(e){return _.map(e,function(e,t){return t+"="+e}).join("&")},clean_global_regions:function(){Upfront.data.global_regions=!1},open_global_region_manager:function(){var t=Upfront.Behaviors.LayoutEditor;Upfront.Popup.open(function(n,r,i){var s=e(this);s.html('<p class="upfront-popup-placeholder">'+Upfront.Settings.l10n.global.behaviors.loading_content+"</p>"),Upfront.data.global_regions?t._render_global_region_manager(s):t._refresh_global_regions().done(function(){t._render_global_region_manager(s)})},{width:600},"global-region-manager")},_refresh_global_regions:function(){return Upfront.Util.post({action:"upfront_list_scoped_regions",scope:"global",storage_key:_upfront_save_storage_key}).done(function(e){Upfront.data.global_regions=e.data})},_render_global_region_manager:function(t){var n=Upfront.Behaviors.LayoutEditor,r=Upfront.Application.layout.get("regions"),i=[{title:Upfront.Settings.l10n.global.behaviors.global_regions,classname:"global",data:_.sortBy(Upfront.data.global_regions,function(e,t,n){return!e.container||e.name==e.container?t*3:_.indexOf(n,_.findWhere(n,{name:e.container}))*3+1})},{title:Upfront.Settings.l10n.global.behaviors.lightboxes,classname:"lightbox",data:Upfront.Util.model_to_json(r.filter(function(e){return e.get("sub")=="lightbox"}))}];t.html(""),_.each(i,function(r){var i=e('<div class="global-region-manager-wrap global-region-manager-'+r.classname+'"></div>'),s=e('<h3 class="global-region-manager-title">'+r.title+"</h3>"),o=e('<div class="global-region-manager-content upfront-scroll-panel"></div>');i.append([s,o]),n._render_regions(r.data,o),t.append(i),Upfront.Views.Mixins.Upfront_Scroll_Mixin.stop_scroll_propagation(o)}),t.on("click",".region-list-edit",function(e){e.preventDefault()}),t.on("click",".region-list-trash",function(i){i.preventDefault();var s=e(this).attr("data-name");e(this).closest(".global-region-manager-wrap").hasClass("global-region-manager-global")&&confirm("Deleting the global regions will remove it from all layouts. Continue?")&&Upfront.Util.post({action:"upfront_delete_scoped_regions",scope:"global",name:s,storage_key:_upfront_save_storage_key}).done(function(e){e.data&&(_.each(e.data,function(e){var t=r.get_by_name(e);r.remove(t)}),n._refresh_global_regions().done(function(){n._render_global_region_manager(t)}))})})},_render_regions:function(t,n){var r=e('<ul class="global-region-manager-lists"></ul>');_.each(t,function(e){var n=["global-region-manager-list"],i=!1;!e.container||e.name==e.container?n.push("region-list-main"):(i=_.find(t,function(t){return t.name==e.container}),n.push("region-list-sub"),n.push("region-list-sub-"+e.sub),i&&n.push("region-list-sub-has-main")),r.append('<li class="'+n.join(" ")+'">'+'<span class="region-list-name">'+e.title+"</span>"+'<span class="region-list-control">'+(Upfront.Application.get_current()!=Upfront.Settings.Application.MODE.THEME?'<a href="#" class="region-list-trash" data-name="'+e.name+'">'+Upfront.Settings.l10n.global.behaviors.trash+"</a>":"")+"</span>"+"</li>")}),n.append(r)}};define(t)})(jQuery);