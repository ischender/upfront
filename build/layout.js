jQuery(document).ready(function(e){function t(e){var t=document.createElement("div"),n=new RegExp("(khtml|moz|ms|webkit|)"+e,"i");for(s in t.style)if(s.match(n))return!0;return!1}function n(){var e=window.getComputedStyle(document.body,":after").getPropertyValue("content");return e.replace(/['"]/g,"")}function r(){var t=n();t=t?t:"desktop",e("[data-bg-type-"+t+"]").each(function(){var n=e(this).attr("data-bg-type-"+t);e(this).find("> .upfront-output-bg-overlay").not(".upfront-output-bg-"+t).each(function(){e(this).is(".upfront-output-bg-video")&&e(this).children().not("script.video-embed-code").remove()});if(n=="image"||n=="featured"){var r=e(this).attr("data-src"),i=e(this).attr("data-src-"+t),s=e(this).attr("data-bg-image-ratio-"+t);i?e(this).attr("data-src",i):e(this).removeAttr("data-src"),s?e(this).attr("data-bg-image-ratio",s):e(this).removeAttr("data-bg-image-ratio").css("background-position","").css("background-size",""),i&&r!=i&&e(this).hasClass("upfront-image-lazy")&&e(this).removeClass("upfront-image-lazy-loaded")}else n!="color"&&(e(this).css("background-image","none"),e(this).find("> .upfront-output-bg-"+t).each(function(){e(this).is(".upfront-output-bg-video")&&e(this).children().length==1&&e(this).append(e(this).children("script.video-embed-code").html())}))})}function i(){o(),e(".upfront-output-region-container").each(function(){var t=e(this).find(".upfront-output-region").filter(".upfront-region-center, .upfront-region-side-left, .upfront-region-side-right"),n=e(this).hasClass("upfront-region-container-full"),r=height=0;t.length>1&&(t.each(function(){var t=parseInt(e(this).css("min-height")),n=e(this).outerHeight();t&&(r=t>r?t:r),height=n>height?n:height}),t.css({minHeight:height,height:"",maxHeight:""}))})}function o(){e(".upfront-output-region-container.upfront-region-container-full").each(function(){var t=e(this).find(".upfront-region-center"),n=e(this).find(".upfront-region-side-top, .upfront-region-side-bottom"),r=e("body").offset(),i=e(window).height()-r.top,s=e(this).find(".upfront-output-bg-overlay");n.each(function(){i-=e(this).outerHeight()}),t.css({minHeight:i});var o=e(this).attr("data-behavior"),u=parseInt(e(this).attr("data-original-height"));if(o=="keep-ratio"&&u>0){var a=t.find("> .upfront-region-wrapper > .upfront-output-wrapper"),f=[],l=!1,c=!1,h=!1,p=!1,d=0;a.each(function(){var t=e(this).find("> .upfront-output-module, > .upfront-output-module-group").first();t.css("margin-top","");var n=parseInt(t.css("margin-top")),r=e(this).position(),i=r.top+e(this).height();c=c===!1||i>c?i:c;if(r.top!=0)return;l=l===!1||n<l?n:l,f.push(t)}),h=l+(i>c?i-c:0),p=l+(u>c?u-c:0),h==p?d=u>i?l-(u-i):l:d=l/p*h,e.each(f,function(e,t){var n=parseInt(t.css("margin-top"));if(n<=0)return;t.css("margin-top",d+n-l+"px")})}s.length&&s.css("height",i)})}function u(){e("[data-bg-image-ratio]").each(function(){var t=e(this).is(".upfront-output-layout"),n=(e(this).is(".upfront-region-container-bg")||e(this).is(".upfront-output-region"))&&e(this).closest(".upfront-region-container-full").length>0,r=t?e(window).width():e(this).outerWidth(),i=t?e(window).height():n?parseInt(e(this).closest(".upfront-output-region-container").find(".upfront-region-center").css("min-height")):e(this).outerHeight(),s=parseFloat(e(this).attr("data-bg-image-ratio"));Math.round(i/r*100)/100>s?(e(this).data("bg-position-y",0),e(this).css({"background-position":"50% 0","background-size":i/s+"px "+i+"px"})):(e(this).data("bg-position-y",(i-r*s)/2),e(this).css({"background-position":"0 "+(i-r*s)/2+"px","background-size":r+"px "+r*s+"px"}))}),e("[data-bg-video-ratio]").each(function(){var t=e(this).parent().is(".upfront-output-layout"),n=e(this).parent().is(".upfront-output-region, .upfront-region-container-bg")&&e(this).closest(".upfront-region-container-full").length>0,r=t?e(window).width():e(this).outerWidth(),i=t?e(window).height():n?parseInt(e(this).closest(".upfront-output-region-container").find(".upfront-region-center").css("min-height")):e(this).outerHeight(),s=parseFloat(e(this).attr("data-bg-video-ratio")),o=e(this).attr("data-bg-video-style")||"crop",u=e(this).children("iframe");e(this).css("overflow","hidden"),u.css({position:"absolute"});if(o=="crop")if(Math.round(i/r*100)/100>s){var a=i/s;u.css({width:a,height:i,top:0,left:(r-a)/2})}else{var f=r*s;u.css({width:r,height:f,top:(i-f)/2,left:0})}else if(o=="full")u.css({top:0,left:0,width:r,height:i});else if(o=="inside")if(Math.round(i/r*100)/100<s){var a=i/s;u.css({width:a,height:i,top:0,left:(r-a)/2})}else{var f=r*s;u.css({width:r,height:f,top:(i-f)/2,left:0})}})}function a(){var t=n(),r=e("body").offset(),i=e(window).scrollTop(),s=e(window).height(),o=i+s;r.top>0&&(i+=r.top,s-=r.top),e('.upfront-output-region-container[data-sticky="1"], .upfront-output-region-sub-container[data-sticky="1"]').each(function(){var t=e(this).hasClass("upfront-output-region-sub-container"),n=t&&e(this).nextAll(".upfront-grid-layout").length>0,s=e(this).offset(),o=e(this).data("sticky-top"),u={};typeof o!="number"&&i>s.top?(u.position="fixed",u.top=e("#wpadminbar").css("position")!="fixed"?0:r.top,u.left=0,u.right=0,u.bottom="auto",e(this).addClass("upfront-output-region-container-sticky"),e(this).data("sticky-top",s.top),t?e(this).closest(".upfront-region-container-bg").css(n?"padding-top":"padding-bottom",e(this).height()):e(this).next(".upfront-output-region-container").css("margin-top",e(this).height())):typeof o=="number"&&i<=o&&(u.position="",u.top="",u.left="",u.right="",u.bottom="",e(this).removeClass("upfront-output-region-container-sticky"),e(this).removeData("sticky-top"),t?e(this).closest(".upfront-region-container-bg").css(n?"padding-top":"padding-bottom",""):e(this).next(".upfront-output-region-container").css("margin-top","")),e(this).css(u)}),e('.upfront-output-region-container.upfront-region-container-full, .upfront-output-region-container.upfront-region-container-full .upfront-output-region-sub-container:not(.upfront-output-region-container-sticky), .upfront-output-region.upfront-region-side-fixed[data-restrict-to-container="1"]').each(function(){var t=e(this).is(".upfront-region-side-fixed"),n=e(this).is(".upfront-region-container-full"),u=e(this).is(".upfront-output-region-sub-container"),a=e(this).closest(".upfront-output-region-container"),f=a.outerHeight(),l=a.offset(),c=l.top+f,h=e(this).height(),p=t?parseInt(e(this).attr("data-top")):0,d=t?typeof e(this).attr("data-top")!="undefined":e(this).nextAll(".upfront-grid-layout").length>0,v=t?parseInt(e(this).attr("data-bottom")):0,m=t?typeof e(this).attr("data-bottom")!="undefined":e(this).prevAll(".upfront-grid-layout").length>0,g={};if(n){var y=e(this).find(".upfront-region-container-bg"),b=y.css("background-image")!="none",w=e(this).find(".upfront-output-bg-overlay"),E=w.length>0,S=0,x=parseInt(e(this).find(".upfront-region-center").css("min-height"));b&&(typeof y.data("bg-position-y")=="undefined"&&y.data("bg-position-y",y.css("background-position-y")),S=y.data("bg-position-y"))}if(i>=l.top&&o<=c){if(t||u)g.position="fixed",d?g.top=p+r.top:g.bottom=v;u&&(g.left=0,g.right=0,d?a.css("padding-top",h):a.css("padding-bottom",h)),n&&(b?y.css("background-position-y",S+i+"px"):E&&w.css("top",i-r.top))}else t?(g.position="absolute",d?f>s&&i>=l.top+f-s?g.top=f-s+p:g.top=p:f>s&&o<=l.top+s?g.bottom=f-s+v:g.bottom=v):u?(g.position="relative",d&&(g.top=f-s+p),g.bottom="",g.left="",g.right="",a.css({paddingTop:"",paddingBottom:""})):n&&(b?y.css("background-position-y",S+(f-(d?x:s-r.top))+"px"):E&&w.css("top",f-(d?x:s)));e(this).css(g)})}function d(){clearTimeout(h),h=setTimeout(function(){var t=e(window).scrollTop(),n=e(window).height(),r=e(window).width();e(".upfront-image-lazy").each(function(){if(e(this).hasClass("upfront-image-lazy-loading"))return;var r=this,i=e(this).offset(),s=e(this).height(),o=e(this).width(),u,a,f;if((p&&i.top+s>=t&&i.top<t+n||!p)&&o>0&&s>0){u=e(this).attr("data-sources"),u?u=JSON.parse(u):a=e(this).attr("data-src");if(typeof u!="undefined"&&u.length||a){if(typeof u!="undefined"&&u.length){for(var l=0;l<u.length;l++)if(u[l][1]<=o||f>=0&&u[f][1]<o&&u[l][1]>o)f=l;if(e(this).data("loaded")==f)return;a=u[f][0],e(this).data("loaded",f)}else if(a&&e(this).hasClass("upfront-image-lazy-loaded"))return;e(this).removeClass("upfront-image-lazy-loaded").addClass("upfront-image-lazy-loading"),e("<img>").attr("src",a).on("load",function(){e(r).hasClass("upfront-image-lazy-bg")?e(r).css("background-image",'url("'+e(this).attr("src")+'")'):e(r).attr("src",e(this).attr("src")),e(r).removeClass("upfront-image-lazy-loading").addClass("upfront-image-lazy-loaded")})}}})},100)}function v(){function r(t){var n=new e.Deferred;return t.$el.removeClass("upfront-image-lazy-loaded").addClass("upfront-image-lazy-loading"),e("<img />").attr("src",t.url).on("load",function(){t.$el.is(".upfront-image-lazy-bg")?t.$el.css("background-image",'url("'+t.url+'")'):t.$el.attr("src",t.url),t.$el.removeClass("upfront-image-lazy-loading").addClass("upfront-image-lazy-loaded"),n.resolve()}),n.promise()}function i(e,t){n.push({url:e,$el:t})}function s(){var i=new e.Deferred;return e.each(n,function(e,n){t.push(r(n))}),e.when.apply(e,t).always(function(){i.resolve()}),i.promise()}var t=[],n=[];return{add:i,start:s}}function m(e){function t(){e.reverse(),n()}function n(){var t=e.pop();if(!t)return!1;t.start().done(n)}return{start:t}}function g(){var t=1500,r=e(".upfront-image-lazy"),i=new v,s=new v,o=new v,u=e(window).scrollTop(),a=e(window).height(),f=e(window).width(),l=n();l=!l||"none"===l?"desktop":l;if(!r.length)return!1;r.each(function(){var n=e(this),r=n.offset(),f=n.attr("data-sources"),c=n.attr("data-src"),h=n.attr("data-src-"+l),p=n.height(),d=n.width();if(n.is(".upfront-image-lazy-loaded"))return!0;if(!f&&!c&&!h)return!0;if(p<=0&&d<=0)return!0;if(f){var d=n.width(),v=0;f=JSON.parse(f);for(var m=0;m<f.length;m++)if(f[m][1]<=d||v>=0&&f[v][1]<d&&f[m][1]>d)v=m;if(e(this).data("loaded")==v)return!0;c=f[v][0],e(this).data("loaded",v)}else h&&(c=h);r.top+p>=u&&r.top<u+a?i.add(c,n):r.top+p+t>=u&&r.top<u+a+t?s.add(c,n):o.add(c,n)}),e(window).off("scroll",d);var c=(new m([i,s,o])).start()}function y(){var t=n();e("[data-theme-styles]").each(function(){var n=e(this).attr("data-theme-styles"),r=[];n&&(n=JSON.parse(n)),e.each(n,function(e,t){r.push(t)}),e(this).removeClass(r.join(" ")),!t&&n.default?e(this).addClass(n.default):t&&(n[t]||n.default)&&e(this).addClass(n[t]?n[t]:n.default)})}r(),e(window).on("resize",r),t("flex")?(e("html").addClass("flexbox-support"),o(),e(window).on("load",o),e(window).on("resize",o)):(i(),e(window).on("load",i),e(window).on("resize",i)),u(),e(window).on("resize",u),a(),e(window).on("scroll",a);var f=e('<div class="upfront-lightbox-bg"></div>'),l=e('<div class="upfront-ui close_lightbox"></div>'),c=e('<div class="upfront-icon upfront-icon-popup-close"></div>');e(document).on("click","a",function(t){if(e(t.target).closest("div.redactor_box")>0)return;if(e("div#sidebar-ui").length>0&&e("div#sidebar-ui").css("display")=="block"){var n=e(t.target).attr("href");if(n&&n.indexOf&&n.indexOf("#ltb-")>-1){t.preventDefault();var r=Upfront.Application.layout.get("regions"),i=n.split("#");region=r?r.get_by_name(i[1]):!1;if(region){_.each(r.models,function(e){e.attributes.sub=="lightbox"&&Upfront.data.region_views[e.cid].hide()});var s=Upfront.data.region_views[region.cid];s.show()}}return}var n=e(this).attr("href");if(!n)return;if(n.indexOf("#")>=0){var o=n.split("#");if(o[1].trim()!=""&&o[1].trim().indexOf("ltb-")==0){var u=e("div.upfront-region-"+o[1].trim());f.css("background-color",u.data("overlay")).insertBefore(u);if(u.data("closeicon")=="yes"||u.data("addclosetext")=="yes")u.prepend(l),u.data("addclosetext")=="yes"&&(l.append(e("<h3>"+u.data("closetext")+"</h3>")),u.data("closeicon")=="yes"&&l.children("h3").css("margin-right","40px")),u.data("closeicon")=="yes"&&l.append(c),l.bind("click",function(){a()});u.data("clickout")=="yes"&&f.bind("click",function(){a()}),u.css("width",e("div.upfront-grid-layout").first().width()*u.data("col")/24),u.show().css({"margin-left":-parseInt(u.width()/2),"margin-top":-parseInt(u.height()/2)}),e(document).trigger("upfront-lightbox-open"),t.preventDefault();function a(){l.html("").remove(),f.remove(),u.hide()}}}});var h,p=window._upfront_image_lazy_scroll;e(window).on("resize",d),p?(e(window).on("scroll",d),d()):e(g),y(),e(window).on("resize",y)});