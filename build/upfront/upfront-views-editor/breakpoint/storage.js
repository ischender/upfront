!function(e){define(["scripts/upfront/upfront-views-editor/breakpoint/collection"],function(t){var n=function(n){var o,a=function(){o=new t(n);var a=o.get_default();a.set({active:!0}),o.on("change:enabled change:width change:name add remove change:typography change:styles",i),_.each(o.models,function(t){var n=e("#"+t.get("id")+"-breakpoint-style");n.length>0||e("body").append('<style id="'+t.get("id")+'-breakpoint-style">'+t.get("styles")+"</style>")})};this.get_breakpoints=function(){return o};var i=function(){var e={action:"upfront_update_breakpoints",breakpoints:o.toJSON()};Upfront.Util.post(e).error(function(){return notifier.addMessage(l10n.breakpoint_save_fail)})};Upfront.Events.once("application:mode:before_switch",a)};return new n(Upfront.mainData.themeInfo.breakpoints)})}(jQuery);