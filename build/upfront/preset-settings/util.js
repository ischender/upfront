(function(e){define([],function(){var t=function(e,t){var n=Upfront.Util.template(t);return n({properties:e})},n={generateCss:t,generatePresetsToPage:function(e,t){_.each(Upfront.mainData[e+"Presets"],function(r){n.updatePresetStyle(e,r,t)})},getPresetProperties:function(t,n){var r=Upfront.mainData[t+"Presets"]||[],i={};return e.each(r,function(e,t){if(!t||!t.id||n!==t.id)return!0;i=_.extend({},t)}),i},updatePresetStyle:function(n,r,i){var s=n+"-preset-"+r.id,o=_.extend({},r);_.each(o,function(e,t){Upfront.Util.colors.is_theme_color(e)&&(o[t]=Upfront.Util.colors.get_color(e))}),e("style#"+s).length===0&&e("body").append('<style id="'+s+'"></style>'),e("style#"+s).text(t(o,i))}};return n})})(jQuery);