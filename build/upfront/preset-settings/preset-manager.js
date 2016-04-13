!function(e){define(["scripts/upfront/element-settings/root-settings-panel","scripts/upfront/settings/modules/select-preset","scripts/upfront/settings/modules/edit-preset","scripts/upfront/settings/modules/migrate-preset","scripts/upfront/settings/modules/preset-css","scripts/upfront/preset-settings/util","scripts/upfront/preset-settings/preset-css-editor"],function(t,s,i,r,n,a,o){var p=Upfront.Settings.l10n.preset_manager,l=t.extend({className:"uf-settings-panel upfront-settings_panel preset-manager-panel",initialize:function(e){var t=this;this.options=e,_.each(this.options,function(e,t){this[t]=e},this);var s=!1;_.each(Upfront.mainData[this.mainDataCollection],function(e,t){"default"===e.id&&(s=!0)}),s||(Upfront.mainData[this.mainDataCollection]=_.isArray(Upfront.mainData[this.mainDataCollection])?Upfront.mainData[this.mainDataCollection]:[],Upfront.mainData[this.mainDataCollection].unshift(this.getPresetDefaults("default"))),this.presets=new Backbone.Collection(Upfront.mainData[this.mainDataCollection]||[]);var i=function(e){return Upfront.Application.user_can("MODIFY_PRESET")?void Upfront.Util.post({action:"upfront_save_"+this.ajaxActionSlug+"_preset",data:e}).done(function(){t.model.trigger("preset:updated",e.id)}):(t.model.trigger("preset:updated",e.id),!1)};this.debouncedSavePreset=_.debounce(i,1e3),this.createBackup(),this.defaultOverlay(),this.listenToOnce(Upfront.Events,"element:settings:canceled",function(){this.updateCanceledPreset(this.backupPreset)}),this.listenToOnce(Upfront.Events,"upfront:layout_size:change_breakpoint",this.cancelPresetChanges)},createBackup:function(){var e=this.property("preset")?this.clear_preset_name(this.property("preset")):"default",t=this.presets.findWhere({id:e});"undefined"==typeof t&&(t=this.presets.findWhere({id:"default"})),"undefined"==typeof this.backupPreset&&(this.backupPreset=Upfront.Util.clone(t.toJSON()))},defaultOverlay:function(){var e=this,t=this.property("preset")?this.clear_preset_name(this.property("preset")):"default";"default"===t&&setTimeout(function(){e.$el.find(".preset_specific").next().andSelf().wrapAll('<div class="default-overlay-wrapper" />'),e.$el.find(".default-overlay-wrapper").append('<div class="default-overlay"><div class="overlay-title">'+p.default_overlay_title+'</div><div class="overlay-text">'+p.default_overlay_text+'</div><div class="overlay-button"><button type="button" class="overlay-button-input">'+p.default_overlay_button+"</button></div></div>"),e.$el.find(".delete_preset input").prop("disabled",!0),e.$el.find(".delete_preset input").css({opacity:.6})},100),this.$el.on("click",".overlay-button-input",function(t){t.preventDefault(),e.$el.find(".default-overlay").remove(),e.$el.find(".default-overlay-wrapper").css("min-height","30px"),e.$el.find(".delete_preset input").prop("disabled",!1),e.$el.find(".delete_preset input").css({opacity:1})})},updateMainDataCollectionPreset:function(e){var t;_.each(Upfront.mainData[this.mainDataCollection],function(s,i){s.id===e.id&&(t=i)}),"undefined"!=typeof t?Upfront.mainData[this.mainDataCollection][t]=e:Upfront.mainData[this.mainDataCollection].push(e)},migratePresetProperties:function(e){return e},migrateElementStyle:function(e,t){return e},migrateDefaultStyle:function(e){return e},setupItems:function(){this.trigger("upfront:presets:setup-items",this);var e,t,a,o=this.clear_preset_name(this.model.decode_preset()||"default"),p=this.presets.findWhere({id:o});"undefined"==typeof p&&(p=this.presets.findWhere({id:"default"})),this.selectPresetModule&&this.selectPresetModule.stopListening&&(this.selectPresetModule.stopListening(),this.stopListening(this.selectPresetModule)),Upfront.Application.user_can("SWITCH_PRESET")&&(this.selectPresetModule=new s({model:this.model,presets:this.presets})),this.options.hasBreakpointSettings===!0&&(e=Upfront.Views.breakpoints_storage.get_breakpoints().get_active(),t=p.get("breakpoint")||{},a=t[e.id]||{},_.each(this.options.breakpointSpecificPresetSettings,function(e){if(!_.isUndefined(a[e.name])){var t={};t[e.name]=a[e.name],p.set(t,{silent:!0})}},this)),this.editPresetModule&&this.editPresetModule.stopListening&&(this.editPresetModule.stopListening(),this.stopListening(this.editPresetModule)),Upfront.Application.user_can("SWITCH_PRESET")&&(Upfront.Application.user_can("MODIFY_PRESET")||Upfront.Application.user_can("DELETE_PRESET"))&&(this.editPresetModule=new i({model:p,stateModules:this.stateModules})),this.presetCssModule&&this.presetCssModule.stopListening&&(this.presetCssModule.stopListening(),this.stopListening(this.presetCssModule)),Upfront.Application.user_can("SWITCH_PRESET")&&Upfront.Application.user_can("MODIFY_PRESET")&&(this.presetCssModule=new n({model:this.model,preset:p})),this.migratePresetModule=new r({model:this.model,presets:this.presets,elementPreset:this.styleElementPrefix}),Upfront.Application.user_can("SWITCH_PRESET")&&(this.selectPresetModule&&Upfront.Application.user_can("SWITCH_PRESET")&&this.listenTo(this.selectPresetModule,"upfront:presets:change",this.changePreset),this.selectPresetModule&&Upfront.Application.user_can("SWITCH_PRESET")&&this.listenTo(this.selectPresetModule,"upfront:presets:migrate",this.migratePreset),this.editPresetModule&&Upfront.Application.user_can("DELETE_PRESET")&&this.listenTo(this.editPresetModule,"upfront:presets:delete",this.deletePreset),this.editPresetModule&&Upfront.Application.user_can("DELETE_PRESET")&&this.listenTo(this.editPresetModule,"upfront:presets:reset",this.resetPreset),this.editPresetModule&&Upfront.Application.user_can("MODIFY_PRESET")&&this.listenTo(this.editPresetModule,"upfront:presets:state_show",this.stateShow),this.editPresetModule&&Upfront.Application.user_can("MODIFY_PRESET")&&this.listenTo(this.editPresetModule,"upfront:presets:update",this.updatePreset),this.presetCssModule&&Upfront.Application.user_can("MODIFY_PRESET")&&this.listenTo(this.presetCssModule,"upfront:presets:update",this.updatePreset),this.selectPresetModule&&Upfront.Application.user_can("MODIFY_PRESET")&&this.listenTo(this.selectPresetModule,"upfront:presets:new",this.createPreset)),this.listenTo(this.migratePresetModule,"upfront:presets:preview",this.previewPreset),this.listenTo(this.migratePresetModule,"upfront:presets:change",this.applyExistingPreset),this.listenTo(this.migratePresetModule,"upfront:presets:new",this.migratePreset),this.settings=_([this.selectPresetModule,this.editPresetModule,this.presetCssModule])},getTitle:function(){return"Appearance"},getPresetDefaultsMigration:function(e){var t=this.styleElementPrefix.replace(/-preset/,"");return"tab"===t||"accordion"===t||"contact"===t||"button"===t?_.extend({},{id:e.toLowerCase().replace(/ /g,"-"),name:e}):_.extend(this.presetDefaults,{id:e.toLowerCase().replace(/ /g,"-"),name:e})},getPresetDefaults:function(e){return _.extend(this.presetDefaults,{id:e.toLowerCase().replace(/ /g,"-"),name:e,preset_style:""})},updateCanceledPreset:function(e){a.updatePresetStyle(this.styleElementPrefix.replace(/-preset/,""),e,this.styleTpl),this.debouncedSavePreset(e),this.updateMainDataCollectionPreset(e)},updatePreset:function(e){var t,s;this.options.hasBreakpointSettings===!0&&(t=Upfront.Views.breakpoints_storage.get_breakpoints().get_active(),s=e.breakpoint||{},s[t.id]=s[t.id]||{},_.each(this.options.breakpointSpecificPresetSettings,function(i){s[t.id][i.name]=e[i.name],delete e[i.name]},this),e.breakpoint=s),a.updatePresetStyle(this.styleElementPrefix.replace(/-preset/,""),e,this.styleTpl),this.debouncedSavePreset(e),this.updateMainDataCollectionPreset(e)},migratePreset:function(t){var s=this.presets.findWhere({id:t.toLowerCase().replace(/ /g,"-")}),i="";if("undefined"!=typeof s)return void Upfront.Views.Editor.notify(p.preset_already_exist.replace(/%s/,t),"error");var r=this.property("theme_style");r||(r="_default"),"_default"!==r&&(Upfront.Application.cssEditor.init({model:this.model,stylename:"_default",no_render:!0}),i=e.trim(Upfront.Application.cssEditor.get_style_element().html().replace(/div#page.upfront-layout-view .upfront-editable_entity.upfront-module/g,"#page")),i=i.replace(/#page/g,""),i=this.migrateDefaultStyle(i),i=Upfront.Application.stylesAddSelectorMigration(e.trim(i),"#page ."+t.toLowerCase().replace(/ /g,"-"))),Upfront.Application.cssEditor.init({model:this.model,stylename:r,no_render:!0});var n=e.trim(Upfront.Application.cssEditor.get_style_element().html().replace(/div#page.upfront-layout-view .upfront-editable_entity.upfront-module/g,"#page"));n=n.replace(new RegExp(r,"g"),t.toLowerCase().replace(/ /g,"-")),"_default"!==r?n=i+n:(n=this.migrateDefaultStyle(n),n=Upfront.Application.stylesAddSelectorMigration(e.trim(n),"#page ."+t.toLowerCase().replace(/ /g,"-"))),n=this.migrateElementStyle(n,"#page ."+t.toLowerCase().replace(/ /g,"-")),newPreset=new Backbone.Model(this.getPresetDefaultsMigration(t)),"undefined"!=typeof n&&newPreset.set({preset_style:n}),this.migratePresetProperties(newPreset),this.property("preset",newPreset.id),this.presets.add(newPreset),presetOptions=newPreset,properties=newPreset.toJSON(),this.property("theme_style",""),a.updatePresetStyle(this.styleElementPrefix.replace(/-preset/,""),properties,this.styleTpl),this.debouncedSavePreset(properties),this.updateMainDataCollectionPreset(properties),this.property("usingNewAppearance",!0),this.model.get("properties").trigger("change"),Upfront.Views.Editor.notify(p.preset_created.replace(/%s/,t)),this.render()},createPreset:function(e){var t=this.presets.findWhere({id:e.toLowerCase().replace(/ /g,"-")});if("undefined"!=typeof t)return void Upfront.Views.Editor.notify(p.preset_already_exist.replace(/%s/,e),"error");var s=this.getPresetDefaults(e);this.presets.add(s),this.model.set_property("preset",s.id),this.updatePreset(s),this.model.encode_preset(s.id),Upfront.Views.Editor.notify(p.preset_created.replace(/%s/,e)),this.render()},deletePreset:function(e){var t;Upfront.Util.post({data:e.toJSON(),action:"upfront_delete_"+this.ajaxActionSlug+"_preset"}),_.each(Upfront.mainData[this.mainDataCollection],function(s,i){s.id===e.get("id")&&(t=i)}),Upfront.mainData[this.mainDataCollection].splice(t,1),this.model.set_property("preset","default"),this.model.encode_preset("default"),this.presets.remove(e),this.render(),this.defaultOverlay()},resetPreset:function(e){var t=this;Upfront.Util.post({data:e.toJSON(),action:"upfront_reset_"+this.ajaxActionSlug+"_preset"}).success(function(s){var i=s.data;(_.isEmpty(s.data)||s.data===!1)&&(i=t.getPresetDefaults("default")),a.updatePresetStyle(t.styleElementPrefix.replace(/-preset/,""),i,t.styleTpl),t.updateMainDataCollectionPreset(i),t.presets=new Backbone.Collection(Upfront.mainData[t.mainDataCollection]||[]),Upfront.Views.Editor.notify(p.preset_reset.replace(/%s/,e.get("id"))),t.$el.empty(),t.render()}).error(function(e){Upfront.Views.Editor.notify(e)})},applyExistingPreset:function(e){this.property("usingNewAppearance",!0),this.changePreset(e),this.defaultOverlay()},changePreset:function(e){this.stopListening(),this.model.set_property("theme_style",""),this.model.encode_preset(e),this.render(),this.defaultOverlay(),Upfront.Views.Editor.notify(p.preset_changed.replace(/%s/,e))},previewPreset:function(t){var s,i=this.property("element_id"),r=this.styleElementPrefix.replace(/-preset/,""),n=this.model.get_property_value_by_name("theme_style");""===t&&n?e("#"+i).addClass(n):n&&(e("#"+i).removeClass(n),e("#"+i).find("."+n).removeClass(n)),"accordion"===r?(s=e("#"+i).find(".upfront-accordion-container"),s.removeClass(this.getPresetClasses(r)),""!==t?s.addClass(r+"-preset-"+t):s.addClass(r+"-preset-"+this.model.get_property_value_by_name("preset"))):"tab"===r?(s=e("#"+i).find(".upfront-tabs-container"),s.removeClass(this.getPresetClasses(r)),""!==t?s.addClass(r+"-preset-"+t):s.addClass(r+"-preset-"+this.model.get_property_value_by_name("preset"))):"button"===r?(s=e("#"+i).find(".upfront_cta"),s.removeClass(this.getPresetClasses(r)),""!==t?s.addClass(r+"-preset-"+t):s.addClass(r+"-preset-"+this.model.get_property_value_by_name("preset"))):_.contains(["image","text","gallery","slider","contact"],r)?("undefined"==typeof this.actualModelData&&(this.actualModelData=Upfront.Util.model_to_json(this.model)),""!==t?(this.model.set_property("usingNewAppearance",!0,!0),this.model.set_property("theme_style","",!0),this.model.set_property("preset",t,!0),this.model.trigger("change"),this.previousPresetClass=t):(actualProperties=new Upfront.Collections.Properties(this.actualModelData.properties),actualProperties._events=this.model.get("properties")._events,this.model.set("properties",actualProperties),e(".upfront-active_entity").removeClass(this.previousPresetClass))):(e("#"+i).removeClass(this.getPresetClasses()),""!==t&&e("#"+i).addClass(t))},getPresetClasses:function(e){var t="";return _.map(this.presets.models,function(s){t+="undefined"!=typeof e&&e?e+"-preset-"+s.get("id")+" ":s.get("id")+" "}),t},stateShow:function(e){this.trigger("upfront:presets:state_show",e)},getModifiedProperties:function(){return!0},migrateToDefault:function(){var e=this.getModifiedProperties(),t=this.property("usingNewAppearance");return e||t||(this.property("usingNewAppearance",!0),this.property("preset","default"),this.defaultOverlay()),!1},getBody:function(){this.setupItems();var t=e("<div />"),s=this;return this.migrateToDefault(),this.property("usingNewAppearance")!==!0&&(this.settings=_([this.migratePresetModule])),this.settings.each(function(e){return(e||{}).render?(e.panel||(e.panel=s),e.render(),void t.append(e.el)):!0}),t},clear_preset_name:function(e){return e=e.replace(" ","-"),e=e.replace(/[^-a-zA-Z0-9]/,"")},property:function(e,t,s){return"undefined"!=typeof t?("undefined"==typeof s&&(s=!0),this.model.set_property(e,t,s)):this.model.get_property_value_by_name(e)},save_settings:function(){}});return l})}(jQuery);