!function(e){define([],function(){e("body").append('<div id="element-settings-sidebar" />'),e("#element-settings-sidebar").width(0);var t,n=function(){t.cleanUp(),t=!1,e("#element-settings-sidebar").width(0).html(""),Upfront.Events.off("element:settings:saved",n)},i=function(i){var s,o;return t?n():(s=_(Upfront.Application.LayoutEditor.Objects).reduce(function(e,t){return i instanceof t.View?t:e},!1),s=s&&s.Settings?s:Upfront.Views.Editor.Settings,o=s.Settings,t=new o({model:i.model,anchor:!!s&&s.anchor}),t.for_view=i,t.render(),e("#element-settings-sidebar").html(t.el),e("#element-settings-sidebar").width(260),Upfront.Events.on("element:settings:saved",n),void 0)};Upfront.Events.on("element:settings:activate",i)})}(jQuery);