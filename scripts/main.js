// Set up the global namespace
var Upfront = window.Upfront || {};
Upfront.mainData = Upfront.mainData || {};
Upfront.Events = {};
_.extend(Upfront.Events, Backbone.Events);
require.config(Upfront.mainData.requireConfig);

  // Fix Underscore templating to Mustache style
  _.templateSettings = {
    evaluate : /\{\[([\s\S]+?)\]\}/g,
    interpolate : /\{\{([\s\S]+?)\}\}/g
  };

  require(['application', 'util'], function (application, util) {
    // Shims and stubs
    Upfront.Settings = {
      "root_url": Upfront.mainData.root,
      "ajax_url": Upfront.mainData.ajax,
      "admin_url": Upfront.mainData.admin,
      "site_url": Upfront.mainData.site,
      "Debug": Upfront.mainData.debug,
      "ContentEditor": {
        "Requirements": Upfront.mainData.layoutEditorRequirements,
        "Selectors": {
          "sidebar": "#sidebar-ui"
        }
      },
      "Application": {
        "MODE": Upfront.mainData.applicationModes,
        "NO_SAVE": Upfront.mainData.readOnly
      },
      "LayoutEditor": {
        "Requirements": Upfront.mainData.layoutEditorRequirements,
        "Selectors": {
          "sidebar": "#sidebar-ui",
          "commands": "#commands",
          "properties": "#properties",
          "layouts": "#layouts",
          "settings": "#settings",
          //"main": "#upfront-output"
          "main": "#page"
        },
        "Specificity": Upfront.mainData.specificity,
        "Grid": Upfront.mainData.gridInfo,
      },
      "Content": Upfront.mainData.content,
    };

    // Populate basics
    _.extend(Upfront, application);
    _.extend(Upfront, util);
    Upfront.Util.Transient.initialize();

    // Set up deferreds
    Upfront.LoadedObjectsDeferreds = {};
    Upfront.Events.trigger("application:loaded:layout_editor");

    if (Upfront.Application && Upfront.Application.boot) Upfront.Application.boot();
    else Upfront.Util.log('something went wrong');
  }); // Upfront
