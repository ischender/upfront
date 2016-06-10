!function(e){define([],function(){var t=function(e,t){this.initialize(e,t)};return t.prototype={module_selector:"> .upfront-module-view > .upfront-module, > .upfront-module-group",object_selector:"> .upfront-object-view > .upfront-object",el_selector:"",view:!1,model:!1,$me:!1,$wrap:!1,$region:!1,$main:!1,$layout:!1,me:!1,wrap:!1,region:!1,current_region:!1,$container:!1,$current_container:!1,region_model:!1,current_region_model:!1,current_wrappers:!1,is_group:!1,is_object:!1,is_parent_group:!1,is_disabled:!1,$helper:!1,event:!1,ui:!1,breakpoint:!1,app:!1,ed:!1,drop_areas:!1,drop_areas_created:!1,drops:!1,drop:!1,drop_col:0,drop_left:0,drop_top:0,area_col:0,current_area_col:0,current_row_wraps:!1,wrapper_id:!1,wrap_only:!1,new_wrap_view:!1,move_region:!1,current_grid:!1,current_grid_pos:!1,compare_area:!1,compare_area_position:!1,compare_col:0,compare_row:0,_last_drag_position:!1,_last_drag_time:0,_last_coord:!1,_t:!1,_focus_t:!1,focus:!1,focus_coord:!1,initialize:function(e,t){this.view=e,this.model=t,this.app=Upfront.Application,this.ed=Upfront.Behaviors.GridEditor,this.drop_areas=[],this.drop_areas_created=[],this.drops=[],this.current_row_wraps=[],this.current_grid={},this.current_grid_pos={},this.compare_area={},this.compare_area_position={},this._last_coord={x:0,y:0},this.focus_coord={x:0,y:0},this.setup()},setup:function(){return this.is_group=this.view.$el.hasClass("upfront-module-group"),this.is_object=this.view.$el.hasClass("upfront-object-view"),this.is_parent_group="undefined"!=typeof this.view.group_view,this.is_disabled=this.is_parent_group&&!this.view.group_view.$el.hasClass("upfront-module-group-on-edit")||this.is_object&&this.view.object_group_view&&!this.view.object_group_view.$el.hasClass("upfront-object-group-on-edit"),this.$me=this.is_group?this.view.$el:this.view.$el.find(".upfront-editable_entity:first"),this.$main=e(Upfront.Settings.LayoutEditor.Selectors.main),this.$layout=this.$main.find(".upfront-layout"),this.el_selector=this.is_object?this.object_selector:this.module_selector,this.app.mode.current!==this.app.MODE.THEME&&this.model.get_property_value_by_name("disable_drag")?!1:this.$me.hasClass("upfront-module-spacer")||this.$me.hasClass("upfront-object-spacer")?!1:this.is_object&&"undefined"==typeof this.view.object_group_view?!1:this.$me.data("ui-draggable")?((this.is_group||!this.is_disabled)&&this.$me.draggable("option","disabled",!1),!1):Upfront.Application.user_can_modify_layout()?void this.$me.draggable({revert:!0,revertDuration:0,zIndex:100,helper:"clone",disabled:this.is_disabled,cancel:".upfront-entity_meta, .upfront-element-controls",distance:10,appendTo:this.$main,iframeFix:!0,start:e.proxy(this.on_start,this),drag:e.proxy(this.on_drag,this),stop:e.proxy(this.on_stop,this)}):(this.$me.data("ui-draggable")&&(this.is_group||!this.is_disabled)&&this.$me.draggable("option","disabled",!1),!1)},on_start:function(e,t){this.ed.time_start("drag start"),this.event=e,this.ui=t,this.breakpoint=Upfront.Views.breakpoints_storage.get_breakpoints().get_active().toJSON(),this.is_parent_group="undefined"!=typeof this.view.group_view,this.prepare_drag(),this.ed.time_end("drag start"),this.ed.time_start("drag start - trigger"),Upfront.Events.trigger("entity:drag_start",this.view,this.model),this.ed.time_end("drag start")},on_drag:function(e,t){var i=this;this.event=e,this.ui=t,clearTimeout(this._t),this._t=setTimeout(function(){i.update_drop_timeout()},this.ed.timeout),this.update_drop_position(),this.ed.show_debug_element&&this.$helper.find(".upfront-debug-info").text("grid: "+this.current_grid.x+","+this.current_grid.y+" | current: ("+this.current_grid_pos.left+","+this.current_grid_pos.top+"),("+this.current_grid_pos.right+","+this.current_grid_pos.bottom+") | margin size: "+this.drop_top+"/"+this.drop_left)},on_stop:function(t,i){var r=this;this.ed.time_start("drag stop"),this.event=t,this.ui=i,clearTimeout(this._t),clearTimeout(this._focus_t),this.drop.is_me||this.render_drop(),this.clean_elements(),this.update_models(),this.update_views(),this.reset();var o=this.is_group?this.view.$el:this.view.$el.find(".upfront-editable_entity:first"),s="animationend.drop_ani webkitAnimationEnd.drop_ani MSAnimationEnd.drop_ani oAnimationEnd.drop_ani";o.one(s,function(){e(this).removeClass("upfront-dropped"),Upfront.Events.trigger("entity:drag_animate_stop",r.view,r.model),o.off(s)}).addClass("upfront-dropped"),Upfront.Events.trigger("entity:drag_stop",this.view,this.model),this.view.trigger("entity:drop",{col:this.drop_col,left:this.drop_left,top:this.drop_top},this.view,this.model),this.view.trigger("entity:self:drag_stop"),this.ed.time_end("drag stop")},update_vars:function(){var t=this.app.layout.get("regions");this.$helper=e(".ui-draggable-dragging"),this.$wrap=this.$me.closest(".upfront-wrapper"),this.$region=this.$me.closest(".upfront-region"),this.me=this.ed.get_el(this.$me),this.wrap=this.ed.get_wrap(this.$wrap),this.region=this.ed.get_region(this.$region),this.region_model=t.get_by_name(this.region.region),this.$container=this.$region.find(".upfront-modules_container > .upfront-editable_entities_container:first")},create_drop_point:function(){var t=this.ed;t.time_start("fn create_drop_point");var i=this.breakpoint,r=this,o=this.me,s=this.wrap,a=(o.$el.data("margin"),o.col),n=o.$el.hasClass("upfront-image_module")?1:a>t.min_col?t.min_col:a,p=o.row>t.max_row?t.max_row:o.row,d=o.$el.hasClass("upfront-module-spacer")||o.$el.hasClass("upfront-object-spacer"),l=this.app.layout.get("regions"),h=Upfront.Util.find_sorted(o.$el.closest(".upfront-wrapper")),g=h.length>1,c=h.index(o.$el);_.each(this.drop_areas,function(a,h){if(!_.contains(o.drop_areas_created,a)){var u=a.$el.hasClass("upfront-region"),f=u?a.$el.get(0)==r.current_region.$el.get(0):!1;if(!u||f){var m=a.$el.find(".upfront-editable_entities_container:first"),w=u?a.$el:a.$el.closest(".upfront-region"),v=w.data("name"),b=u?a:t.get_region(w),y=l.get_by_name(v),$=u?y:a.view?a.view.model:y.get("modules").get_by_element_id(a.$el.attr("id")),x=$.get("modules")||$.get("objects"),C=$.get("wrappers"),U=t.parse_modules_to_lines(x,C,i.id,a.col),j=w.hasClass("upfront-region-expand-lock"),k=a.grid.top,z=function(e,t){return!j||j&&t-e+1>=o.row},M=function(e){var i=Upfront.data.wrapper_views[e.model.cid];return i?t.get_wrap(i.$el):!1};if(_.each(U,function(p,l){_.each(p.wrappers,function(h,u){var f=Upfront.data.wrapper_views[h.model.cid];if(f){var m=f.$el,w=t.get_wrap(m),v=h.spacer,y=0==u,$=s&&w._id==s._id,x=1==h.modules.length,C=$&&x,j=u>0?p.wrappers[u-1]:l>0?_.last(U[l-1].wrappers):!1,E=j?Upfront.data.wrapper_views[j.model.cid]:!1,T=E?E.$el:!1,A=T?t.get_wrap(T):!1,q=1==u||0==u&&l>0&&1==U[l-1].wrappers.length,Y=A&&s&&A._id==s._id,L=j?j.spacer:!1,X=Y&&1==j.modules.length,D=u+1<p.wrappers.length?p.wrappers[u+1]:l+1<U.length?U[l+1].wrappers[0]:!1,O=D?Upfront.data.wrapper_views[D.model.cid]:!1,R=O?O.$el:!1,S=R?t.get_wrap(R):!1,B=u+1==p.wrappers.length,H=S&&s&&S._id==s._id,W=D?D.spacer:!1,F=(H&&1==D.modules.length,l+1<U.length?U[l+1].wrappers[0]:!1),V=F?Upfront.data.wrapper_views[F.model.cid]:!1,G=V?V.$el:!1,I=G?t.get_wrap(G):!1,J=(t.get_wrap_el_min(w),t.get_wrap_el_min(w,!1,!0),A?t.get_wrap_el_min(A):!1,S?t.get_wrap_el_min(S,!1,!0):!1,S?t.get_wrap_el_min(S):!1),N=I?t.get_wrap_el_min(I,!1,!0):!1,Q=_.map(p.wrappers,M),K=_.max(Q,function(e){return s&&s._id==e._id?-1:e.grid.bottom}),P=_.min(Q,function(e){return t.get_wrap_el_min(e,!1,!0).grid.top}),Z=t.get_wrap_el_min(P,!1,!0),ee=_.find(Q,function(e){return s&&s._id==e._id});if(ee&&r.current_row_wraps===!1&&(r.current_row_wraps=Q),!d&&!v&&((!i||i["default"])&&w.col>=n&&(S&&!B&&!C&&(R.find(r.el_selector).size()>1||!H)||A&&!y&&!C&&(T.find(r.el_selector).size()>1||!Y)||S&&A&&!B&&!y||!A&&!S&&$&&m.find(r.el_selector).size()>1)||i&&!i["default"]&&$&&m.find(r.el_selector).size()>1)){var te=w.grid.top,ie=S&&!B&&J?J.grid.left-1:a.grid.right;$els=Upfront.Util.find_sorted(m,r.el_selector),$els.each(function(i){if(e(this).get(0)!=o.$el.get(0)){var s=e(this),a=t.get_el(s),n=a.outer_grid.top==w.grid.top?w.grid.top:te,p=Math.ceil(a.grid_center.y),_=$els[i-1]?$els.eq(i-1):!1,d=_?t.get_el(_):!1,l=d&&d._id==o._id;r.drops.push({_id:t._new_id(),top:n,bottom:p,left:w.grid.left,right:ie,priority:{top:l?d.outer_grid.top:a.outer_grid.top-1,bottom:a.grid.top-1,left:w.grid.left,right:ie,index:l?3:5},priority_index:5,type:"inside",insert:["before",s],region:b,is_me:l,is_clear:!1,is_use:!1,is_switch:!1,switch_dir:!1,row_wraps:!1,me_in_row:!1}),te=p+1}});var re=$els.last(),oe=re.size()>0?t.get_el(re):!1,se=oe&&oe._id==o._id,ae=i&&!i["default"]&&N?Math.ceil(N.grid_center.y):K.grid.bottom;r.drops.push({_id:t._new_id(),top:te,bottom:ae,left:w.grid.left,right:ie,priority:{top:se?oe.outer_grid.top:w.grid.bottom,bottom:i&&!i["default"]&&N?N.grid.top:ae,left:w.grid.left,right:ie,index:se?3:5},priority_index:5,type:"inside",insert:["append",w.$el],region:b,is_me:se,is_clear:!1,is_use:!1,is_switch:!1,switch_dir:!1,row_wraps:!1,me_in_row:!1})}if(!(i&&!i["default"]&&g&&c>0)){if(!d&&y&&(!$||S&&!B)){var ne=w.grid.top==a.grid.top?a.grid.top-5:k,pe=t.get_wrap_el_min(w,!1,!0),_e=Math.ceil(pe.grid_center.y),de=q&&Y&&!g,le=de?A.grid.top:w.grid.top;z(le,pe.grid.top-1)&&(r.drops.push({_id:t._new_id(),top:ne,bottom:_e,left:a.grid.left,right:a.grid.right,priority:{top:le,bottom:Z.grid.top-1,left:a.grid.left,right:a.grid.right,index:de?2:3},priority_index:8,type:"full",insert:["before",w.$el],region:b,is_me:de,is_clear:!0,is_use:!1,is_switch:!1,switch_dir:!1,row_wraps:!1,me_in_row:!1}),k=_e+1)}if((!d||d&&ee&&(C||!v&&(!S||B||!W)))&&(!S||B)&&(!C||!y)){var he=!1,ge=Math.ceil(w.grid_center.x)+1,ce=!S||B?a.grid.right:w.grid.right,_e=$&&w.grid.bottom>K.grid.bottom?w.grid.bottom:K.grid.bottom;z(w.grid.top,_e)&&r.drops.push({_id:t._new_id(),top:w.grid.top,bottom:_e,left:C?w.grid.left:ge,right:ce,priority:{top:w.grid.top,bottom:_e,left:C?w.grid.left:ge+Math.ceil((ce-ge)/2),right:ce,index:C?1:4},priority_index:10,type:"side-after",insert:["after",w.$el],region:b,is_me:C,is_clear:!1,is_use:!1,is_switch:he,switch_dir:he?"left":!1,row_wraps:Q,me_in_row:ee?!0:!1})}if((!d||d&&ee&&(C||!v&&(y||!L)))&&(!C||S&&!B)&&(y||!X)){var ue=!1,fe=!1,ge=A&&!y?Math.ceil(A.grid_center.x)+1:w.grid.left,ce=Math.ceil(w.grid_center.x),_e=$&&w.grid.bottom>K.grid.bottom?w.grid.bottom:K.grid.bottom;z(w.grid.top,_e)&&r.drops.push({_id:t._new_id(),top:w.grid.top,bottom:_e,left:ge,right:C&&J?J.grid.left-1:ce,priority:{top:w.grid.top,bottom:_e,left:A&&!y?ge+Math.ceil((A.grid.right-ge)/2):ge,right:C&&J?J.grid.left-1:w.grid.left+Math.ceil((ce-w.grid.left)/2)-1,index:C?1:4},priority_index:10,type:"side-before",insert:[ue?"after":"before",w.$el],region:b,is_me:C,is_clear:y,is_use:!1,is_switch:ue||fe,switch_dir:ue?"left":fe?"right":!1,row_wraps:Q,me_in_row:ee?!0:!1})}}}})}),!(i&&!i["default"]&&g&&c>0||d))if(U.length>0){var E=U[U.length-1],T=_.last(E.wrappers),A=Upfront.data.wrapper_views[T.model.cid],q=t.get_wrap(A.$el),Y=q&&1==E.wrappers.length,L=s&&Y&&q._id==s._id&&!g,X=j?a.grid.bottom:a.grid.bottom-k>p?a.grid.bottom+5:k+p,D=_.map(E.wrappers,M),O=_.max(D,function(e){return s&&s._id==e._id?0:e.grid.bottom}),R=O.grid.bottom+1,S=!s||O&&s&&O._id!=s._id,B=S&&R>k?R:k;(z(B,X)||L)&&r.drops.push({_id:t._new_id(),top:k,bottom:X,left:a.grid.left,right:a.grid.right,priority:{top:B,bottom:X,left:a.grid.left,right:a.grid.right,index:L?2:3},priority_index:8,type:"full",insert:["append",m],region:b,is_me:L,is_clear:!0,is_use:!1,is_switch:!1,switch_dir:!1,row_wraps:!1,me_in_row:!1})}else{var X=j?a.grid.bottom:a.grid.bottom-a.grid.top>p?a.grid.bottom:a.grid.top+p;z(a.grid.top,X)&&r.drops.push({_id:t._new_id(),top:a.grid.top,bottom:X,left:a.grid.left,right:a.grid.right,priority:null,priority_index:8,type:"full",insert:["append",m],region:b,is_me:"shadow"==v&&o.region==v,is_clear:!0,is_use:!1,is_switch:!1,switch_dir:!1,row_wraps:!1,me_in_row:!1})}}}}),t.time_end("fn create_drop_point")},select_drop_point:function(t){var i=this.ed;if(t&&!t.is_use){i.time_start("fn select_drop");var r="object"!=typeof this.drop||t.is_me?!1:!0;_.each(this.drops,function(e){e.is_use=e._id==t._id}),this.drop=t,i.show_debug_element&&(e(".upfront-drop-view-current").removeClass("upfront-drop-view-current"),e("#drop-view-"+t._id).addClass("upfront-drop-view-current")),e(".upfront-drop").remove();var o=this,s=this.me,a=e('<div class="upfront-drop upfront-drop-use"></div>'),n=function(){Upfront.Events.trigger("entity:drag:drop_change",o.view,o.model)},p="inside"!=t.type||t.insert[1].hasClass("upfront-module-group")?t.insert[1]:t.insert[1].parent(),d=t.insert[1].data("breakpoint_order")||0;s.width,s.height;switch(t.insert[0]){case"before":a.insertBefore(p);break;case"after":a.insertAfter(p);break;case"append":t.insert[1].append(a),d=t.insert[1].children().length}if(a.css("order",d),"full"==t.type||"inside"==t.type)a.css("width",(t.right-t.left+1)*i.col_size),(!t.priority||t.is_me)&&(t.is_me?(a.css("margin-top",-1*s.height),a.css("height",s.height)):a.css("height",(t.bottom-t.top+1)*i.baseline));else if("side-before"==t.type||"side-after"==t.type){var l=p.position();a.css("height",(t.bottom-t.top+1)*i.baseline),t.is_me&&(a.css("width",s.width),"side-before"==t.type?a.css("margin-right",-1*s.width):a.css("margin-left",-1*s.width)),a.css({position:"absolute",top:l.top,left:Upfront.Util.isRTL()?l.left+("side-after"==t.type?0:p.width()):l.left+("side-after"==t.type?p.width():0)})}else r&&n();i.time_end("fn select_drop")}},prepare_drag:function(){var t=this.ed,i=this.breakpoint;this.$main.addClass("upfront-dragging"),this.view.$el.css("position",""),t.start(this.view,this.model),t.normalize(t.els,t.wraps),t.update_position_data(t.containment.$el),this.update_vars(),this.set_current_region(this.region);var r=this.$me,o=this.me,s=this.$helper,a=r.offset(),n=t.max_row*t.baseline,p=r.data("ui-draggable"),d=this.event.pageY-a.top,l=this.is_parent_group?t.get_position(this.view.group_view.$el):this.is_object?t.get_position(this.view.object_group_view.$el):t.get_region(this.$region);if(d>n/2&&p._adjustOffsetFromHelper({top:Math.round((o.height>n?n:o.height)/2)}),r.css("visibility","hidden"),s.css("max-width",o.width),s.css("height",o.height),s.css("max-height",n),s.css("margin-left",r.css("margin-left")),this.area_col=l.col,this.is_parent_group||this.is_object)l.region=this.$region.data("name"),l.group=this.is_parent_group?this.view.group_view.$el.attr("id"):"",l.view=this.is_parent_group?this.view.group_view:this.view.object_group_view,this.drop_areas=[l],this.current_area_col=l.col;else if(i&&!i["default"])this.drop_areas=[l];else{var h,g=!1;t.lightbox_cols=!1,_.each(t.regions,function(e){e.$el.hasClass("upfront-region-side-lightbox")&&"block"==e.$el.css("display")&&(g=e,t.lightbox_cols=e.col),e.$el.hasClass("upfront-region-shadow")&&(h=e)}),g?this.drop_areas=[g,h]:this.drop_areas=t.regions}this.current_row_wraps=!1,this.create_drop_point(),this.$wrap.css("min-height","1px"),e(".upfront-drop-me").css("height",(o.outer_grid.bottom-o.outer_grid.top)*t.baseline),this.show_debug_data(),this.select_drop_point(_.find(this.drops,function(e){return e.is_me})),this.$region.addClass("upfront-region-drag-active")},update_drop_timeout:function(){var e=this.breakpoint;this.update_compare_area(),this.update_focus_state(),e&&!e["default"]||this.is_parent_group||this.is_object?this.set_current_region():this.update_current_region(),this.update_current_drop_point()},update_compare_area:function(){var e=this.ed,t=this.$helper,i=Math.ceil(t.outerHeight()/e.baseline)*e.baseline,r=t.outerWidth(),o=t.offset(),s=Upfront.Util.isRTL()?o.left+r:o.left,a=o.top,n=a+i,p=Upfront.Util.isRTL()?s-r:s+r,_=(Upfront.Util.isRTL()?s-r/2:s+r/2,e.get_grid(s,a)),d=_.x,l=_.y,h=e.get_grid(p,n),g=h.x-1,c=h.y-1,u=e.get_grid(this.event.pageX,this.event.pageY),f=(this.me.col,this.focus?e.focus_compare_col:e.compare_col),m=this.focus?e.focus_compare_row:e.compare_row,w=u.y-m/2,w=l>w?l:w,v=u.x-f/2,v=d>v?d:v,b=v+f-1,b=b>g?g:b,y=w+m-1,y=y>c?c:y,y=y>w+e.max_row?w+e.max_row:y,$=[u.x,u.y,w,b,y,v];this.current_grid=u,this.current_grid_pos={top:l,left:d,right:g,bottom:c},this.compare_area={top:w,left:v,right:b,bottom:y},this.compare_area_position=$},update_focus_state:function(){var e=this,t=this.ed,i=this._last_coord?Math.sqrt(Math.pow(this.event.pageX-this._last_coord.x,2)+Math.pow(this.event.pageY-this._last_coord.y,2)):0,r=Date.now();if(this._last_drag_position&&i<=t.update_distance)return void(this._focus_t||(this._focus_t=setTimeout(function(){e.focus=!0,e.focus_coord.x=e.event.pageX,e.focus_coord.y=e.event.pageY,e._last_drag_time=Date.now(),e.update_drop_timeout()},t.focus_timeout)));if(clearTimeout(this._focus_t),this._focus_t=!1,this._last_drag_position=this.compare_area_position,this._last_coord.x=this.event.pageX,this._last_coord.y=this.event.pageY,this._last_drag_time=r,this.focus){var o=Math.sqrt(Math.pow(this.event.pageX-this.focus_coord.x,2)+Math.pow(this.event.pageY-this.focus_coord.y,2));o>t.focus_out_distance&&(this.focus=!1)}},update_current_drop_point:function(){var e=this,t=_.map(this.drops,function(t){if(t.region._id!=e.current_region._id)return!1;var i=e.get_area_compared(t);return{area:i,drop:t}}).filter(function(e){return e!==!1?!0:!1}),i=_.max(t,function(e){return e.area});if(i.area>0)var r=_.filter(t,function(e){return e.area==i.area}),o=_.sortBy(r,function(t,i,r){var o=t.drop.priority?e.get_area_compared(t.drop.priority):0;return 1*o>=t.area?t.drop.priority.index:t.drop.priority_index}),s=_.first(o).drop;else{var s=_.find(this.drops,function(e){return e.is_me});this.region._id!=this.current_region._id&&this.set_current_region()}this.select_drop_point(s),this.update_drop_position()},update_drop_position:function(){if(this.drop){var t=this.ed,i=this.drop,r=(this.current_region?this.current_region.col:this.me.col,this.$me.hasClass("upfront-module-spacer")||this.$me.hasClass("upfront-object-spacer")),o=1==this.$wrap.find(this.el_selector).length;i.priority?i.priority.top-i.top:0,i.priority?i.priority.left-i.left:0,i.region.$el.hasClass("upfront-region-expand-lock"),i.priority?i.priority.bottom-i.priority.top+1:i.bottom-i.top+1;if(this.drop_top=0,this.drop_left=0,i.is_me||i.me_in_row&&o||r)this.drop_col=this.me.col;else if("side-before"==i.type||"side-after"==i.type){var s=this.find_column_distribution(i.row_wraps,i.me_in_row&&o,!0,this.current_area_col,!1);this.drop_col=s.apply_col}else this.drop_col=i.priority?i.priority.right-i.priority.left+1:i.right-i.left+1;adjust_bottom=!0,t.show_debug_element&&e("#upfront-compare-area").css({top:(this.compare_area.top-1)*t.baseline,left:(this.compare_area.left-1)*t.col_size+(t.grid_layout.left-t.grid_layout.layout_left),width:(this.compare_area.right-this.compare_area.left+1)*t.col_size,height:(this.compare_area.bottom-this.compare_area.top+1)*t.baseline}).text("("+this.compare_area.left+","+this.compare_area.right+") ("+this.compare_area.top+","+this.compare_area.bottom+")")}},update_current_region:function(){var t=this,i=this.ed,r=e(".upfront-region-container-wide, .upfront-region-container-clip").not(".upfront-region-container-shadow").last(),o=_.map(i.regions,function(e){var o,s=e.$el.closest(".upfront-region-container").get(0)==r.get(0),a=s&&(!e.$el.hasClass("upfront-region-side")||e.$el.hasClass("upfront-region-side-left")||e.$el.hasClass("upfront-region-side-right"))?999999:e.grid.bottom,n=e.$el.hasClass("upfront-region-drag-active"),p=e.$el.hasClass("upfront-region-side-top")||e.$el.hasClass("upfront-region-side-bottom"),o=t.get_area_compared({top:e.grid.top-5,bottom:a+5,left:e.grid.left,right:e.grid.right}),_=e.$el.data("type"),d=i.region_type_priority[_];return o*=d,p&&(o*=2),n&&(o*=1.5),{area:o,region:e}}),s=_.max(o,function(e){return e.area});s.area>0&&s.region.$el.get(0)!=this.current_region.$el.get(0)&&(this.set_current_region(s.region),i.update_position_data(this.$current_container,!1),this.create_drop_point()),i.show_debug_element&&_.each(o,function(e){e.region.$el.find(">.upfront-debug-info").text(e.area)})},set_current_region:function(t){var i=this.app.layout.get("regions");this.current_region=t&&t.$el?t:this.ed.get_region(this.$region),this.current_region.$el.hasClass("upfront-region-drag-active")||(e(".upfront-region-drag-active").removeClass("upfront-region-drag-active"),this.current_region.$el.addClass("upfront-region-drag-active")),this.current_region_model=i.get_by_name(this.current_region.region),this.current_wrappers=this.is_parent_group?this.view.group_view.model.get("wrappers"):this.is_object?this.view.object_group_view.model.get("wrappers"):this.current_region_model.get("wrappers"),this.$current_container=this.is_parent_group?this.view.group_view.$el.find(".upfront-editable_entities_container:first"):this.is_object?this.view.object_group_view.$el.find(".upfront-editable_entities_container:first"):this.current_region.$el.find(".upfront-modules_container > .upfront-editable_entities_container:first"),this.move_region=this.region._id!=this.current_region._id,this.is_parent_group||this.is_object||(this.current_area_col=this.current_region.col)},get_area_compared:function(e){var t,i,r,o,s,a=this.compare_area;return a.left>=e.left&&a.left<=e.right?r=a.left:a.left<e.left?r=e.left:a.left>e.right&&a.left-e.right<=1&&(r=e.right),a.right>=e.left&&a.right<=e.right?o=a.right:a.right>e.right?o=e.right:a.right<e.left&&e.left-a.right<=1&&(o=e.left),a.top>=e.top&&a.top<=e.bottom?t=a.top:a.top<e.top&&(t=e.top),a.bottom>=e.top&&a.bottom<=e.bottom?i=a.bottom:a.bottom>e.bottom&&(i=e.bottom),s=t&&i&&r&&o?(o-r+1)*(i-t+1):0,s?s:0},render_drop:function(){var t=this.ed,i=this.breakpoint,r=e(".upfront-drop-use");if(this.wrap_only=i&&!i["default"]?!0:!1,!i||i["default"]){if("inside"!=this.drop.type){var o=Upfront.Util.get_unique_id("wrapper"),s=new Upfront.Models.Wrapper({name:"",properties:[{name:"wrapper_id",value:o},{name:"class",value:t.grid["class"]+this.drop_col}]}),a=new Upfront.Views.Wrapper({model:s});if(("full"==this.drop.type||this.drop.is_clear)&&s.add_class("clr"),this.current_wrappers.add(s),a.parent_view=this.view.parent_view,this.view.wrapper_view=a,a.render(),a.$el.append(this.view.$el),"side-before"==this.drop.type&&this.drop.is_clear&&r.nextAll(".upfront-wrapper").eq(0).removeClass("clr"),r.before(a.$el),this.new_wrap_view=a,Upfront.data.wrapper_views[s.cid]=a,!this.move_region){var n=this.current_wrappers.get_by_wrapper_id(this.$wrap.attr("id"));n&&s.set_property("breakpoint",Upfront.Util.clone(n.get_property_value_by_name("breakpoint")),!0)}}else{var p=r.closest(".upfront-wrapper"),o=p.attr("id"),s=this.current_wrappers.get_by_wrapper_id(o),a=Upfront.data.wrapper_views[s.cid];r.before(this.view.$el),a&&(this.view.wrapper_view=a)}this.wrapper_id=o,this.model.set_property("wrapper_id",this.wrapper_id,!0),0==this.$wrap.find(this.el_selector).length&&(this.wrap&&this.wrap.grid.left==this.current_region.grid.left&&this.$wrap.nextAll(".upfront-wrapper").eq(0).addClass("clr"),this.$wrap.remove(),this.wrap_only=!0)}},update_models:function(){var t=this,i=this.ed,r=this.breakpoint,o=this.current_wrappers,s=this.$me,a=this.$wrap,n=Upfront.data.region_views[this.current_region_model.cid];if(_.each(i.wraps,function(e){var t=!r||r["default"]?e.$el.hasClass("clr"):e.$el.data("breakpoint_clear");e.$el.data("clear",t?"clear":"none")}),!this.drop.is_me&&"side-before"==this.drop.type){var p=this.drop.insert[1];if(p.size()>0){var d=(i.get_wrap(p),!r||r["default"]?p.hasClass("clr"):p.data("breakpoint_clear"));(!d||this.drop.is_clear)&&p.data("clear","none")}}if(i.update_model_margin_classes(s,[i.grid["class"]+this.drop_col]),"inside"==this.drop.type||this.move_region){var l=this.current_wrappers.get_by_wrapper_id(a.attr("id"));l&&l.remove_property("breakpoint",!0),this.model.remove_property("breakpoint",!0)}if(!(this.drop.is_me||this.drop.me_in_row&&this.wrap_only||"side-before"!=this.drop.type&&"side-after"!=this.drop.type)){var h=this.find_column_distribution(this.drop.row_wraps,!1,!0,this.current_area_col,!1),g=h.remaining_col-(this.drop_col-h.apply_col),c=0,u=!1,f=!1;_.each(this.drop.row_wraps,function(r){r.$el.find(t.el_selector).each(function(){if(e(this).hasClass("upfront-module-spacer")||e(this).hasClass("upfront-object-spacer")){var s=o.get_by_wrapper_id(r.$el.attr("id")),a=i.get_el_model(e(this));o.remove(s),t.model.collection.remove(a),0==c&&(u=!0,"side-after"!=t.drop.type&&"side-before"!=t.drop.type||t.drop.insert[1].get(0)!=r.$el.get(0)||(f=!0))}else{var n=h.apply_col;g>0&&(n+=1,g-=1),i.update_model_margin_classes(e(this),[i.grid["class"]+n]),1==c&&u&&("side-before"==t.drop.type&&t.drop.insert[1].get(0)==r.$el.get(0)?f=!0:f||r.$el.data("clear","clear"))}c++})}),f&&(t.new_wrap_view!==!1?t.new_wrap_view.$el.data("clear","clear"):t.$wrap.data("clear","clear"))}if(!this.drop.is_me&&!this.drop.me_in_row&&this.wrap_only&&this.current_row_wraps&&!_.isEqual(this.drop.row_wraps,this.current_row_wraps)){var h=this.find_column_distribution(this.current_row_wraps,!0,!1,this.area_col),g=h.remaining_col;h.total>0?_.each(this.current_row_wraps,function(r){t.wrap.$el.get(0)!=r.$el.get(0)&&r.$el.find(t.el_selector).each(function(){if(!e(this).hasClass("upfront-module-spacer")&&!e(this).hasClass("upfront-object-spacer")){var t=h.apply_col;g>0&&(t+=1,g-=1),i.update_model_margin_classes(e(this),[i.grid["class"]+t])}})}):h.spacer_total>0&&_.each(this.current_row_wraps,function(r){t.wrap.$el.get(0)!=r.$el.get(0)&&r.$el.find(t.el_selector).each(function(){if(e(this).hasClass("upfront-module-spacer")||e(this).hasClass("upfront-object-spacer")){var s=o.get_by_wrapper_id(r.$el.attr("id")),a=i.get_el_model(e(this));o.remove(s),t.model.collection.remove(a,{update:!1})}})})}if(this.is_parent_group?i.update_wrappers(this.view.group_view.model,this.view.group_view.$el):this.is_object?i.update_wrappers(this.view.object_group_view.model,this.view.object_group_view.$el):i.update_wrappers(this.current_region_model,this.current_region.$el),this.move_region&&(i.update_model_margin_classes(this.$container.find(".upfront-wrapper").find(this.el_selector)),i.update_wrappers(this.region_model,this.region.$el)),!r||r["default"])if(this.move_region){var m=this.current_region_model.get("modules"),w=[];this.view.region_view._modules_view.preserve_wrappers_breakpoint_order(),this.model.collection.remove(this.model,{silent:!0}),this.model.get("shadow")&&(this.view.trigger("on_layout"),this.model.unset("shadow",{silent:!0})),this.view.region_view._modules_view.normalize_child_spacing(),n._modules_view.preserve_wrappers_breakpoint_order(),s.removeAttr("data-shadow"),this.$current_container.find(".upfront-wrapper").find(this.el_selector).each(function(){var i=e(this).attr("id"),r=m.get_by_element_id(i);r||i!=s.attr("id")?r&&w.push(r):w.push(t.model)}),m.reset(w)}else this.view.parent_view.preserve_wrappers_breakpoint_order(),this.view.resort_bound_collection(),this.view.parent_view.normalize_child_spacing();else{var v=[],b=0,y="inside"!=this.drop.type,$=y?Upfront.Util.find_sorted(this.$current_container,"> .upfront-wrapper"):Upfront.Util.find_sorted(s.closest(".upfront-wrapper"),this.el_selector),x=y?0:s.closest(".upfront-wrapper").find(this.el_selector).length,C=!1;!this.drop.is_me&&"append"==this.drop.insert[0]&&y&&(C=$.length-1),$.each(function(){var r=y?i.get_wrap(e(this)):i.get_el(e(this));r&&(C===b&&b++,t.drop.is_me||"append"!=t.drop.insert[0]||(y||C!==!1||e(this).closest(".upfront-wrapper").get(0)!=t.drop.insert[1].get(0)||(C=b+x-1),(y&&a.get(0)==this||!y&&s.get(0)==this)&&b--),t.drop.is_me||t.drop.insert[1].get(0)!=this?v.push({$el:e(this),order:b,clear:r.outer_grid.left==t.current_region.grid.left}):("before"==t.drop.insert[0]?(C=b,v.push({$el:e(this),order:b+1,clear:"side-before"!=t.drop.type})):"side-after"==t.drop.type&&"after"==t.drop.insert[0]&&(C=b+1,v.push({$el:e(this),order:b,clear:r.outer_grid.left==t.current_region.grid.left})),b++),b++)}),_.each(v,function(e){var n,p,d=e.$el.attr("id"),l=y?o.get_by_wrapper_id(d):i.get_el_model(e.$el);l&&((y&&e.$el.get(0)==a.get(0)||!y&&e.$el.get(0)==s.get(0))&&(e.order=C!==!1?C:e.order,e.clear=t.drop.is_clear),n=Upfront.Util.clone(l.get_property_value_by_name("breakpoint")||{}),_.isObject(n[r.id])||(n[r.id]={}),p=n[r.id],p.order=e.order,p.edited=!0,y&&(p.clear=e.clear),l.set_property("breakpoint",n))})}i.update_position_data(this.$current_container),i.normalize(i.els,i.wraps)},update_views:function(){var e=this.view,t=this.model;this.move_region&&(e.region=this.current_region_model,e.region_view=Upfront.data.region_views[e.region.cid],e.parent_view=e.region_view._modules_view,this.new_wrap_view.parent_view=e.parent_view,_.isUndefined(e._modules_view)||(e._modules_view.region_view=e.region_view,_.isUndefined(t.get("modules"))||t.get("modules").each(function(t){var i=Upfront.data.module_views[t.cid];i&&(i.region=e.region,i.region_view=e.region_view)})),e.trigger("region:updated"))},clean_elements:function(){e(".upfront-drop").remove(),e(".upfront-drop-view").remove(),e("#upfront-compare-area").remove(),this.$me.css({position:"",top:"",left:"","z-index":"",visibility:"visible"}),this.$wrap.css("min-height",""),this.$current_container.find(".upfront-wrapper").find(this.el_selector).css("max-height",""),e(".upfront-region-drag-active").removeClass("upfront-region-drag-active"),this.$main.removeClass("upfront-dragging")},reset:function(){this.drop_areas_created=[],this.drops=[],this.drop=!1},find_column_distribution:function(e,t,i,r,o){var i=i!==!1,s=_.filter(e,function(e){return e.$el.find("> .upfront-module-view > .upfront-module-spacer, > .upfront-object-view > .upfront-object-spacer").length>0}),a=_.reduce(s,function(e,t){return e+t.col},0),n=(t?e.length-1:e.length)-s.length,o=o!==!1,p=o?r-a:r,d=0,l=0;return i&&n++,n>0?(d=Math.floor(p/n),l=p-d*n):(d=p,l=0),{apply_col:d,remaining_col:l,total_col:p,spacers_col:a,total:n,spacer_total:s.length}},show_debug_data:function(){if(this.ed.show_debug_element){var t=this.ed,i=this.$layout,r=this.$helper;_.each(t.els,function(e){e.$el.find(".upfront-debug-info").size()||e.$el.find(".upfront-editable_entity:first").append('<div class="upfront-debug-info"></div>'),e.$el.find(".upfront-debug-info").text("grid: ("+e.grid.left+","+e.grid.right+"),("+e.grid.top+","+e.grid.bottom+") | outer: ("+e.outer_grid.left+","+e.outer_grid.right+"),("+e.outer_grid.top+","+e.outer_grid.bottom+") | center: "+e.grid_center.x+","+e.grid_center.y)}),_.each(this.drops,function(r){var o=e('<div class="upfront-drop-view"><div class="upfront-drop-priority-view"></div><span class="upfront-drop-view-pos"></span></div>');o.addClass("upfront-drop-view-"+r.type),r.is_me&&o.addClass("upfront-drop-view-me"),o.attr("id","drop-view-"+r._id),o.css({top:(r.top-1)*t.baseline,left:(r.left-1)*t.col_size+(t.grid_layout.left-t.grid_layout.layout_left),width:(r.right-r.left+1)*t.col_size,height:(r.bottom-r.top+1)*t.baseline}),r.priority&&o.find(".upfront-drop-priority-view").css({top:(r.priority.top-r.top)*t.baseline,left:(r.priority.left-r.left)*t.col_size,width:(r.priority.right-r.priority.left+1)*t.col_size,height:(r.priority.bottom-r.priority.top+1)*t.baseline}),o.find(".upfront-drop-view-pos").text("("+r.left+","+r.right+")("+r.top+","+r.bottom+")("+r.type+")"+(r.priority?"("+r.priority.left+","+r.priority.right+")("+r.priority.top+","+r.priority.bottom+")":"")),i.append(o)}),i.append('<div id="upfront-compare-area"></div>'),r.find(".upfront-debug-info").size()||r.append('<div class="upfront-debug-info"></div>')}}},t})}(jQuery);