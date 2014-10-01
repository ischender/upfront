jQuery(document).ready(function(e){function t(e){var t=document.createElement("div"),n=new RegExp("(khtml|moz|ms|webkit|)"+e,"i");for(s in t.style)if(s.match(n))return!0;return!1}function n(){r(),e(".upfront-output-region-container").each(function(){var t=e(this).find(".upfront-output-region").filter(".upfront-region-center, .upfront-region-side-left, .upfront-region-side-right"),n=e(this).hasClass("upfront-region-container-full"),r=height=0;t.length>1&&(t.each(function(){var t=parseInt(e(this).css("min-height")),n=e(this).outerHeight();t&&(r=t>r?t:r),height=n>height?n:height}),t.css({minHeight:height,height:"",maxHeight:""}))})}function r(){e(".upfront-output-region-container.upfront-region-container-full").each(function(){var t=e(this).find(".upfront-region-center"),n=e(this).find(".upfront-region-side-top, .upfront-region-side-bottom"),r=e("body").offset(),i=e(window).height()-r.top,s=e(this).find(".upfront-output-bg-overlay");n.each(function(){i-=e(this).outerHeight()}),t.css({minHeight:i});var o=e(this).attr("data-behavior"),u=parseInt(e(this).attr("data-original-height"));if(o=="keep-ratio"&&u>0){var a=t.find("> .upfront-region-wrapper > .upfront-output-wrapper"),f=[],l=!1,c=!1,h=!1,p=!1,d=0;a.each(function(){var t=e(this).find("> .upfront-output-module, > .upfront-output-module-group").first();t.css("margin-top","");var n=parseInt(t.css("margin-top")),r=e(this).position(),i=r.top+e(this).height();c=c===!1||i>c?i:c;if(r.top!=0)return;l=l===!1||n<l?n:l,f.push(t)}),h=l+(i>c?i-c:0),p=l+(u>c?u-c:0),h==p?d=u>i?l-(u-i):l:d=l/p*h,e.each(f,function(e,t){var n=parseInt(t.css("margin-top"));if(n<=0)return;t.css("margin-top",d+n-l+"px")})}s.length&&s.css("height",i)})}function i(){e("[data-bg-image-ratio]").each(function(){var t=e(this).is(".upfront-output-layout"),n=(e(this).is(".upfront-region-container-bg")||e(this).is(".upfront-output-region"))&&e(this).closest(".upfront-region-container-full").length>0,r=t?e(window).width():e(this).outerWidth(),i=t?e(window).height():n?parseInt(e(this).closest(".upfront-output-region-container").find(".upfront-region-center").css("min-height")):e(this).outerHeight(),s=parseFloat(e(this).attr("data-bg-image-ratio"));Math.round(i/r*100)/100>s?(e(this).data("bg-position-y",0),e(this).css({"background-position":"50% 0","background-size":i/s+"px "+i+"px"})):(e(this).data("bg-position-y",(i-r*s)/2),e(this).css({"background-position":"0 "+(i-r*s)/2+"px","background-size":r+"px "+r*s+"px"}))}),e("[data-bg-video-ratio]").each(function(){var t=e(this).parent().is(".upfront-output-layout"),n=e(this).parent().is(".upfront-output-region, .upfront-region-container-bg")&&e(this).closest(".upfront-region-container-full").length>0,r=t?e(window).width():e(this).outerWidth(),i=t?e(window).height():n?parseInt(e(this).closest(".upfront-output-region-container").find(".upfront-region-center").css("min-height")):e(this).outerHeight(),s=parseFloat(e(this).attr("data-bg-video-ratio")),o=e(this).attr("data-bg-video-style")||"crop",u=e(this).children("iframe");e(this).css("overflow","hidden"),u.css({position:"absolute"});if(o=="crop")if(Math.round(i/r*100)/100>s){var a=i/s;u.css({width:a,height:i,top:0,left:(r-a)/2})}else{var f=r*s;u.css({width:r,height:f,top:(i-f)/2,left:0})}else if(o=="full")u.css({top:0,left:0,width:r,height:i});else if(o=="inside")if(Math.round(i/r*100)/100<s){var a=i/s;u.css({width:a,height:i,top:0,left:(r-a)/2})}else{var f=r*s;u.css({width:r,height:f,top:(i-f)/2,left:0})}})}function o(){var t=window.getComputedStyle(document.body,":after").getPropertyValue("content"),n=e("body").offset(),r=e(window).scrollTop(),i=e(window).height(),s=r+i;n.top>0&&(r+=n.top,i-=n.top),t||e('.upfront-output-region-container[data-sticky="1"], .upfront-output-region-sub-container[data-sticky="1"]').each(function(){var t=e(this).hasClass("upfront-output-region-sub-container"),i=t&&e(this).nextAll(".upfront-grid-layout").length>0,s=e(this).offset(),o=e(this).data("sticky-top"),u={};typeof o!="number"&&r>s.top?(u.position="fixed",u.top=n.top,u.left=0,u.right=0,u.bottom="auto",e(this).addClass("upfront-output-region-container-sticky"),e(this).data("sticky-top",s.top),t?e(this).closest(".upfront-region-container-bg").css(i?"padding-top":"padding-bottom",e(this).height()):e(this).next(".upfront-output-region-container").css("margin-top",e(this).height())):typeof o=="number"&&r<=o&&(u.position="",u.top="",u.left="",u.right="",u.bottom="",e(this).removeClass("upfront-output-region-container-sticky"),e(this).removeData("sticky-top"),t?e(this).closest(".upfront-region-container-bg").css(i?"padding-top":"padding-bottom",""):e(this).next(".upfront-output-region-container").css("margin-top","")),e(this).css(u)}),e('.upfront-output-region-container.upfront-region-container-full, .upfront-output-region-container.upfront-region-container-full .upfront-output-region-sub-container:not(.upfront-output-region-container-sticky), .upfront-output-region.upfront-region-side-fixed[data-restrict-to-container="1"]').each(function(){var t=e(this).is(".upfront-region-side-fixed"),o=e(this).is(".upfront-region-container-full"),u=e(this).is(".upfront-output-region-sub-container"),a=e(this).closest(".upfront-output-region-container"),f=a.outerHeight(),l=a.offset(),c=l.top+f,h=e(this).height(),p=t?parseInt(e(this).attr("data-top")):0,d=t?typeof e(this).attr("data-top")!="undefined":e(this).nextAll(".upfront-grid-layout").length>0,v=t?parseInt(e(this).attr("data-bottom")):0,m=t?typeof e(this).attr("data-bottom")!="undefined":e(this).prevAll(".upfront-grid-layout").length>0,g={};if(o){var y=e(this).find(".upfront-region-container-bg"),b=y.css("background-image")!="none",w=e(this).find(".upfront-output-bg-overlay"),E=w.length>0,S=0,x=parseInt(e(this).find(".upfront-region-center").css("min-height"));b&&(typeof y.data("bg-position-y")=="undefined"&&y.data("bg-position-y",y.css("background-position-y")),S=y.data("bg-position-y"))}if(r>=l.top&&s<=c){if(t||u)g.position="fixed",d?g.top=p+n.top:g.bottom=v;u&&(g.left=0,g.right=0,d?a.css("padding-top",h):a.css("padding-bottom",h)),o&&(b?y.css("background-position-y",S+r+"px"):E&&w.css("top",r-n.top))}else t?(g.position="absolute",d?f>i&&r>=l.top+f-i?g.top=f-i+p:g.top=p:f>i&&s<=l.top+i?g.bottom=f-i+v:g.bottom=v):u?(g.position="relative",d&&(g.top=f-i+p),g.bottom="",g.left="",g.right="",a.css({paddingTop:"",paddingBottom:""})):o&&(b?y.css("background-position-y",S+(f-(d?x:i-n.top))+"px"):E&&w.css("top",f-(d?x:i)));e(this).css(g)})}function h(){clearTimeout(l),l=setTimeout(function(){var t=e(window).scrollTop(),n=e(window).height(),r=e(window).width();e(".upfront-image-lazy").each(function(){if(e(this).hasClass("upfront-image-lazy-loading"))return;var r=this,i=e(this).offset(),s=e(this).height(),o=e(this).width(),u,a,f;if((c&&i.top+s>=t&&i.top<t+n||!c)&&o>0&&s>0){u=e(this).attr("data-sources"),u?u=JSON.parse(u):a=e(this).attr("data-src");if(typeof u!="undefined"&&u.length||a){if(typeof u!="undefined"&&u.length){for(var l=0;l<u.length;l++)if(u[l][1]<=o||f>=0&&u[f][1]<o&&u[l][1]>o)f=l;if(e(this).data("loaded")==f)return;a=u[f][0],e(this).data("loaded",f)}else if(a&&e(this).hasClass("upfront-image-lazy-loaded"))return;e(this).removeClass("upfront-image-lazy-loaded").addClass("upfront-image-lazy-loading"),e("<img>").attr("src",a).on("load",function(){e(r).hasClass("upfront-image-lazy-bg")?e(r).css("background-image",'url("'+e(this).attr("src")+'")'):e(r).attr("src",e(this).attr("src")),e(r).removeClass("upfront-image-lazy-loading").addClass("upfront-image-lazy-loaded")})}}})},100)}function p(){function r(t){var n=new e.Deferred;return t.$el.removeClass("upfront-image-lazy-loaded").addClass("upfront-image-lazy-loading"),e("<img />").attr("src",t.url).on("load",function(){t.$el.is(".upfront-image-lazy-bg")?t.$el.css("background-image",'url("'+t.url+'")'):t.$el.attr("src",t.url),t.$el.removeClass("upfront-image-lazy-loading").addClass("upfront-image-lazy-loaded"),n.resolve()}),n.promise()}function i(e,t){n.push({url:e,$el:t})}function s(){var i=new e.Deferred;return e.each(n,function(e,n){t.push(r(n))}),e.when.apply(e,t).always(function(){i.resolve()}),i.promise()}var t=[],n=[];return{add:i,start:s}}function d(e){function t(){e.reverse(),n()}function n(){var t=e.pop();if(!t)return!1;t.start().done(n)}return{start:t}}function v(){var t=1500,n=e(".upfront-image-lazy"),r=new p,i=new p,s=new p,o=e(window).scrollTop(),u=e(window).height(),a=e(window).width();if(!n.length)return!1;n.each(function(){var n=e(this),a=n.offset(),f=n.attr("data-sources"),l=n.attr("data-src"),c=n.height(),h=n.width();if(n.is(".upfront-image-lazy-loaded"))return!0;if(!f&&!l)return!0;if(c<=0&&h<=0)return!0;if(f){var h=n.width(),p=0;f=JSON.parse(f);for(var d=0;d<f.length;d++)if(f[d][1]<=h||p>=0&&f[p][1]<h&&f[d][1]>h)p=d;if(e(this).data("loaded")==p)return!0;l=f[p][0],e(this).data("loaded",p)}a.top+c>=o&&a.top<o+u?r.add(l,n):a.top+c+t>=o&&a.top<o+u+t?i.add(l,n):s.add(l,n)}),e(window).off("scroll",h);var f=(new d([r,i,s])).start()}function m(){var t=window.getComputedStyle(document.body,":after").getPropertyValue("content");e("[data-theme-styles]").each(function(){var n=e(this).attr("data-theme-styles"),r=[];n&&(n=JSON.parse(n)),e.each(n,function(e,t){r.push(t)}),e(this).removeClass(r.join(" ")),!t&&n.default?e(this).addClass(n.default):t&&(n[t]||n.default)&&e(this).addClass(n[t]?n[t]:n.default)})}t("flex")?(e("html").addClass("flexbox-support"),r(),e(window).on("load",r),e(window).on("resize",r)):(n(),e(window).on("load",n),e(window).on("resize",n)),i(),e(window).on("resize",i),o(),e(window).on("scroll",o);var u=e('<div class="upfront-lightbox-bg"></div>'),a=e('<div class="upfront-ui close_lightbox"></div>'),f=e('<div class="upfront-icon upfront-icon-popup-close"></div>');e(document).on("click","a",function(t){if(e(t.target).closest("div.redactor_box")>0)return;if(e("div#sidebar-ui").length>0&&e("div#sidebar-ui").css("display")=="block"){var n=e(t.target).attr("href");if(n&&n.indexOf&&n.indexOf("#ltb-")>-1){t.preventDefault();var r=Upfront.Application.layout.get("regions"),i=n.split("#");region=r?r.get_by_name(i[1]):!1;if(region){_.each(r.models,function(e){e.attributes.sub=="lightbox"&&Upfront.data.region_views[e.cid].hide()});var s=Upfront.data.region_views[region.cid];s.show()}}return}var n=e(this).attr("href");if(!n)return;if(n.indexOf("#")>=0){var o=n.split("#");if(o[1].trim()!=""&&o[1].trim().indexOf("ltb-")==0){var l=e("div.upfront-region-"+o[1].trim());u.css("background-color",l.data("overlay")).insertBefore(l);if(l.data("closeicon")=="yes"||l.data("addclosetext")=="yes")l.prepend(a),l.data("addclosetext")=="yes"&&(a.append(e("<h3>"+l.data("closetext")+"</h3>")),l.data("closeicon")=="yes"&&a.children("h3").css("margin-right","40px")),l.data("closeicon")=="yes"&&a.append(f),a.bind("click",function(){c()});l.data("clickout")=="yes"&&u.bind("click",function(){c()}),l.css("width",e("div.upfront-grid-layout").first().width()*l.data("col")/24),l.show().css({"margin-left":-parseInt(l.width()/2),"margin-top":-parseInt(l.height()/2)}),e(document).trigger("upfront-lightbox-open"),t.preventDefault();function c(){a.html("").remove(),u.remove(),l.hide()}}}});var l,c=window._upfront_image_lazy_scroll;e(window).on("resize",h),c?(e(window).on("scroll",h),h()):e(v),m(),e(window).on("resize",m)});