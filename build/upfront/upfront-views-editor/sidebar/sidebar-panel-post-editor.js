!function(t){var s=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/upfront-views-editor/sidebar/sidebar-panel","scripts/upfront/upfront-views-editor/sidebar/sidebar-panel-settings-section-post-details","scripts/upfront/upfront-views-editor/sidebar/sidebar-panel-settings-section-post-tag-category","scripts/upfront/upfront-views-editor/sidebar/sidebar-panel-settings-section-page-template"],function(t,o,e,n){return t.extend({className:"sidebar-panel sidebar-panel-post-editor",initialize:function(t){var s=this;this.active=!0,this.postId=this.getPostId(),this.sections=_([new o({model:this.model,postId:this.postId})]),Upfront.Application.is_single("post")?s.sections.push(new e({model:s.model,postId:this.postId})):Upfront.Application.is_single("page")&&s.sections.push(new n({model:s.model,postId:this.postId})),Upfront.Events.off("command:layout:save",this.on_save,this),Upfront.Events.on("command:layout:save",this.on_save,this),Upfront.Events.off("command:layout:save_as",this.on_save,this),Upfront.Events.on("command:layout:save_as",this.on_save,this),Upfront.Events.off("command:layout:save_post_layout",this.on_save,this),Upfront.Events.on("command:layout:save_post_layout",this.on_save,this),Upfront.Events.off("command:layout:publish",this.on_save,this),Upfront.Events.on("command:layout:publish",this.on_save,this),Upfront.Events.off("command:layout:save_success",this.on_save_after,this),Upfront.Events.on("command:layout:save_success",this.on_save_after,this),Upfront.Events.off("command:layout:save_error",this.on_save_after,this),Upfront.Events.on("command:layout:save_error",this.on_save_after,this),Upfront.Events.off("entity:drag_stop",this.reset_modules,this),Upfront.Events.on("entity:drag_stop",this.reset_modules,this),Upfront.Events.off("layout:render",this.apply_state_binding,this),Upfront.Events.on("layout:render",this.apply_state_binding,this)},get_title:function(){return Upfront.Application.is_single("page")?s.page_settings:s.post_settings},on_save:function(){var t=this.model.get("regions");this._shadow_region=t.get_by_name("shadow"),t.remove(this._shadow_region,{silent:!0})},on_preview:function(){return this.on_save()},apply_state_binding:function(){Upfront.Events.on("command:undo",this.reset_modules,this),Upfront.Events.on("command:redo",this.reset_modules,this)},on_render:function(){var t=this;setTimeout(function(){t.$el.find(".sidebar-panel-title").trigger("click")},200)},_post_type_has_taxonomy:function(t,s){if(!t)return!0;var o=s.get("post_type")||"post";return"page"!==o},getPostId:function(){return postId=_upfront_post_data.post_id?_upfront_post_data.post_id:Upfront.Settings.LayoutEditor.newpostType?0:!1,this.postId||!0!==Upfront.plugins.isRequiredByPlugin("generate fake post id")?this.postId||!0!==Upfront.plugins.isRequiredByPlugin("generate fake post id")||Upfront.Application.mode.current!==Upfront.Application.MODE.CONTENT_STYLE||(postId="fake_styled_post"):postId="fake_post",postId}})})}(jQuery);