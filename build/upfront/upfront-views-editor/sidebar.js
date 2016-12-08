!function(e){var i=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/upfront-views-editor/sidebar/sidebar-panel","scripts/upfront/upfront-views-editor/sidebar/draggable-element","scripts/upfront/upfront-views-editor/commands","scripts/upfront/upfront-views-editor/sidebar/sidebar-profile","scripts/upfront/upfront-views-editor/sidebar/sidebar-panels","scripts/upfront/upfront-views-editor/sidebar/commands/sidebar-commands-primary-post-type","scripts/upfront/upfront-views-editor/breakpoint","scripts/upfront/upfront-views-editor/sidebar/sidebar-panel-responsive-section-typography","scripts/upfront/upfront-views-editor/commands/command-save-post","scripts/perfect-scrollbar/perfect-scrollbar"],function(n,s,t,o,a,r,d,l,p,m){var c=t.Commands.extend({className:function(){var e="sidebar-commands sidebar-commands-control",i=Upfront.plugins.call("add-sidebar-commands-class",{className:e});return i.status&&"called"===i.status&&i.result&&(e=i.result),e},initialize:function(){Upfront.Application.user_can_modify_layout()?!1===Upfront.plugins.isForbiddenByPlugin("show undo redo and responsive commands")?(this.commands=_([new t.Command_Undo({model:this.model}),new t.Command_Redo({model:this.model})]),Upfront.Application.user_can("RESPONSIVE_MODE")&&this.commands.push(new t.Command_StartResponsiveMode({model:this.model})),this.commands.push(new t.Command_ToggleGrid({model:this.model}))):this.commands=_([new t.Command_ToggleGrid({model:this.model})]):this.commands=_([]),Upfront.Application.user_can("RESPONSIVE_MODE")&&Upfront.plugins.call("insert-responsive-buttons",{commands:this.commands,model:this.model}),Upfront.plugins.call("insert-save-buttons",{commands:this.commands,model:this.model}),this.commands.push(new t.Command_Trash({model:this.model})),!Upfront.Settings.Application.NO_SAVE&&!1===Upfront.plugins.isForbiddenByPlugin("show save layout command")&&Upfront.Application.user_can_modify_layout()?this.commands.push(new t.Command_SaveLayout({model:this.model})):!Upfront.Settings.Application.NO_SAVE&&!1===Upfront.plugins.isForbiddenByPlugin("show save layout command")&&Upfront.Application.user_can_save_content()?this.commands.push(new p({model:this.model})):!1===Upfront.plugins.isForbiddenByPlugin("show preview layout command")&&Upfront.Settings.Application.PERMS.REVISIONS&&this.commands.push(new t.Command_PreviewLayout({model:this.model})),Upfront.Settings.Debug.dev&&(Upfront.Settings.Application.NO_SAVE||!1!==Upfront.plugins.isForbiddenByPlugin("show reset everything command")||this.commands.push(new t.Command_ResetEverything({model:this.model})),Upfront.Settings.Application.DEBUG||!1!==Upfront.plugins.isForbiddenByPlugin("show publish layout command")||Upfront.Settings.Application.NO_SAVE||this.commands.push(new t.Command_PublishLayout({model:this.model})))}}),h=t.Commands.extend({className:"sidebar-commands sidebar-commands-header",initialize:function(){this.commands=_([new t.Command_Logo({model:this.model})]),this.commands.push(new t.Command_Menu({model:this.model})),this.listenTo(Upfront.Events,"upfront:more_menu:open",this.on_menu_open),this.listenTo(Upfront.Events,"upfront:more_menu:close",this.on_menu_close)},on_menu_open:function(){this.$el.addClass("more-menu-open clearfix")},on_menu_close:function(){this.$el.removeClass("more-menu-open clearfix")}}),u=Backbone.View.extend({tagName:"li",className:"sidebar-panel sidebar-panel-settings expanded",template:'<div class="sidebar-panel-content"></div>',initialize:function(){this.collection=d.storage.get_breakpoints(),this.listenTo(this.collection,"change:active",this.render),this.global_option=!0},render:function(){var e=d.storage.get_breakpoints().get_active();e.get("default")&&(this.model.attributes.id="default");var i=new l({model:e.get("default")?this.model:e});i.render(),this.$el.html(this.template),this.$el.find(".sidebar-panel-content").html(i.el);var n=this.$el.find(".sidebar-panel-content");m.initialize(n[0],{suppressScrollX:!0});Upfront.Events.on("color:spectrum:show",function(){n.css("position","static"),n.closest("li.sidebar-panel-settings").css("position","relative")}),Upfront.Events.on("color:spectrum:hide",function(){n.css("position","relative"),n.closest("li.sidebar-panel-settings").css("position","static")})}}),g=Backbone.View.extend({tagName:"ul",className:"sidebar-commands sidebar-commands-responsive",initialize:function(){this.views=[new t.Command_BreakpointDropdown,new t.Command_AddCustomBreakpoint],this.views.push(new u({model:this.model}))},render:function(){return Upfront.Application.user_can_modify_layout()?(_.each(this.views,function(e){e.render(),"undefined"!=typeof e.global_option&&e.global_option?Upfront.Settings.Application.PERMS.OPTIONS&&this.$el.append(e.el):this.$el.append(e.el)},this),this):!1},destroy:function(){this.remove(),_.each(this.views,function(e){e.remove()})}}),f=t.Commands.extend({className:"sidebar-commands sidebar-commands-responsive-control sidebar-commands-control",initialize:function(){Upfront.Application.user_can_modify_layout()?this.commands=_([new t.Command_ResponsiveUndo({model:this.model}),new t.Command_ResponsiveRedo({model:this.model}),new t.Command_ToggleGrid({model:this.model}),new t.Command_SaveLayout,new t.Command_StopResponsiveMode]):this.commands=_([new t.Command_StopResponsiveMode])},render:function(){this.$el.find("li").remove(),this.commands.each(this.add_command,this)}}),b=Backbone.View.extend({tagName:"div",visible:1,events:{"click #sidebar-ui-toggler-handle":"toggleSidebar"},initialize:function(){this.sidebar_profile=new o({model:this.model}),this.sidebar_commands={header:new h({model:this.model}),primary:new r({model:this.model}),additional:!1,control:new c({model:this.model}),responsive:new g({model:this.model})},this.sidebar_panels=new a({model:this.model}),this.fetch_current_user(),Upfront.Application.get_current()!=Upfront.Settings.Application.MODE.CONTENT&&(Upfront.Events.on("upfront:element:edit:start",this.preventUsage,this),Upfront.Events.on("upfront:element:edit:stop",this.allowUsage,this),Upfront.Events.on("element:settings:deactivate",this.allowUsage,this),Upfront.Events.on("element:settings:canceled",this.allowUsage,this)),Upfront.Events.on("application:mode:after_switch",this.render,this),Upfront.Events.on("application:user:fetch",this.render,this)},preventUsage:function(n){var s=i.not_available_in_text_edit;"media-upload"===n&&(s=i.not_available_in_media_upload),"write"===n&&(this.writingIsOn=!0,s=i.publish_first_nag),this.prevented_usage_type||(this.prevented_usage_type=n),e("#preventUsageOverlay span").html(s),e("#preventUsageOverlay").show(),e("#preventElementsUsageOverlay span").html(s),e("#preventElementsUsageOverlay").show()},allowUsage:function(i){return this.writingIsOn&&"write"!==i?void this.preventUsage("write"):(this.prevented_usage_type=!1,this.writingIsOn=!1,e("#preventUsageOverlay").hide(),void e("#preventElementsUsageOverlay").hide())},render:function(){var i=Upfront.Application.get_current(),n=i===Upfront.Settings.Application.MODE.RESPONSIVE,s=e('<div id="sidebar-ui-wrapper" class="upfront-ui"></div>');if(Upfront.Events.trigger("sidebar:add_classes",s),this.sidebar_commands.header.render(),s.append(this.sidebar_commands.header.el),this.addHoverSidebarClasses(),!1!==Upfront.plugins.isForbiddenByPlugin("show sidebar profile")||n||(this.sidebar_profile.render(),s.append(this.sidebar_profile.el)),n||(this.sidebar_commands.primary.render(),s.append(this.sidebar_commands.primary.el)),this.sidebar_commands.additional&&!n&&(this.sidebar_commands.additional.render(),s.append(this.sidebar_commands.additional.el)),n&&(this.sidebar_commands.responsive.render(),s.append(this.sidebar_commands.responsive.el)),i===Upfront.Settings.Application.MODE.CONTENT||n){if(n){var t=new f({model:this.model});t.render(),s.append(t.el)}}else this.sidebar_panels.render(),s.append(this.sidebar_panels.el),this.sidebar_commands.control.render(),s.append(this.sidebar_commands.control.el),s.append('<div id="preventUsageOverlay"><span></span></div>');this.$el.html(s),Upfront.Events.trigger("sidebar:rendered")},get_panel:function(e){return this.sidebar_panels.panels[e]?this.sidebar_panels.panels[e]:!1},get_commands:function(e){return this.sidebar_commands[e]?this.sidebar_commands[e]:!1},to_content_editor:function(){},from_content_editor:function(){},fetch_current_user:function(){var e=Upfront.data.currentUser;e||(e=new Upfront.Models.User,Upfront.data.loading.currentUser=e.fetch().done(function(){Upfront.data.currentUser=e,Upfront.Events.trigger("application:user:fetch")}))},addCollapsibleEvents:function(){var i=this;this.$el.append('<div id="sidebar-ui-toggler"><div id="sidebar-ui-toggler-handle" class="sidebar-ui-hide"></div></div>'),e("body").on("mousemove",function(n){300*i.visible+100>n.pageX?i.collapsibleHint||(e("#sidebar-ui-toggler").fadeIn(),i.collapsibleHint=!0):i.collapsibleHint&&(e("#sidebar-ui-toggler").fadeOut(),i.collapsibleHint=!1)}),this.resizeCollapseHandle(),e(window).on("resize",function(){i.resizeCollapseHandle()})},resizeCollapseHandle:function(){var i=e(window).height();this.$("#sidebar-ui-toggler").height(i)},addHoverSidebarClasses:function(){e("#sidebar-ui, #element-settings-sidebar, #region-settings-sidebar").hover(function(){e("#sidebar-ui, #element-settings-sidebar, #region-settings-sidebar").addClass("upfront-sidebar-hover")},function(){e("#sidebar-ui, #element-settings-sidebar, #region-settings-sidebar").removeClass("upfront-sidebar-hover")})},toggleSidebar:function(i){var n=this,s={marginLeft:"260px"};unmargined_css={marginLeft:"0px"},_margin=Upfront.Util.isRTL()?"marginRight":"marginLeft",this.visible?(e("#sidebar-ui, #element-settings-sidebar").stop().animate({width:"0px"},300,function(){e("#sidebar-ui, #element-settings-sidebar").addClass("collapsed")}),Upfront.Util.isRTL()&&(unmargined_css={marginRight:"0px"}),e("#page").stop().animate(unmargined_css,300,function(){Upfront.Events.trigger("sidebar:toggle:done",n.visible)}),this.$("#sidebar-ui-toggler-handle").removeClass().addClass("sidebar-ui-show"),this.visible=0):(Upfront.Util.isRTL()&&(s={marginRight:"260px"}),e("#sidebar-ui").removeClass("collapsed").stop().animate({width:"260px"},300),e("#element-settings-sidebar").removeClass("collapsed"),0!==e("#element-settings-sidebar").contents().length&&e("#element-settings-sidebar").removeClass("collapsed").stop().animate({width:"260px"},300),e("#page").stop().animate(s,300,function(){Upfront.Events.trigger("sidebar:toggle:done",n.visible)}),this.$("#sidebar-ui-toggler-handle").removeClass().addClass("sidebar-ui-hide"),this.visible=1),Upfront.Events.trigger("sidebar:toggle",this.visible)}});return{Sidebar:b,Panel:n,Element:s}})}(jQuery);