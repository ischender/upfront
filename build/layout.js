jQuery(document).ready(function(e){function t(e){var t=document.createElement("div"),n=new RegExp("(khtml|moz|ms|webkit|)"+e,"i");for(s in t.style)if(s.match(n))return!0;return!1}function n(){r(),e(".upfront-output-region-container").each(function(){var t=e(this).find(".upfront-output-region").filter(".upfront-region-center, .upfront-region-side-left, .upfront-region-side-right"),n=e(this).hasClass("upfront-region-container-full"),r=height=0;t.length>1&&(t.each(function(){var t=parseInt(e(this).css("min-height")),n=e(this).outerHeight();t&&(r=t>r?t:r),height=n>height?n:height}),t.css({minHeight:height,height:"",maxHeight:""}))})}function r(){e(".upfront-output-region-container.upfront-region-container-full").each(function(){var t=e(this).find(".upfront-region-center"),n=e(this).find(".upfront-region-side-top, .upfront-region-side-bottom"),r=e("body").offset(),i=e(window).height()-r.top;n.each(function(){i-=e(this).outerHeight()}),t.css({minHeight:i,height:i,maxHeight:i})})}function i(){e("[data-bg-image-ratio]").each(function(){var t=e(this).is(".upfront-output-layout"),n=t?e(window).width():e(this).outerWidth(),r=t?e(window).height():e(this).outerHeight(),i=parseFloat(e(this).attr("data-bg-image-ratio"));Math.round(r/n*100)/100>i?e(this).css("background-size",r/i+"px "+r+"px"):e(this).css("background-size",n+"px "+n*i+"px")}),e("[data-bg-video-ratio]").each(function(){var t=e(this).parent().is(".upfront-output-layout"),n=t?e(window).width():e(this).outerWidth(),r=t?e(window).height():e(this).outerHeight(),i=parseFloat(e(this).attr("data-bg-video-ratio")),s=e(this).attr("data-bg-video-style")||"crop",o=e(this).children("iframe");e(this).css("overflow","hidden"),o.css({position:"absolute"});if(s=="crop")if(Math.round(r/n*100)/100>i){var u=r/i;o.css({width:u,height:r,top:0,left:(n-u)/2})}else{var a=n*i;o.css({width:n,height:a,top:(r-a)/2,left:0})}else if(s=="full")o.css({top:0,left:0,width:n,height:r});else if(s=="inside")if(Math.round(r/n*100)/100<i){var u=r/i;o.css({width:u,height:r,top:0,left:(n-u)/2})}else{var a=n*i;o.css({width:n,height:a,top:(r-a)/2,left:0})}})}function c(){clearTimeout(f),f=setTimeout(function(){var t=e(window).scrollTop(),n=e(window).height(),r=e(window).width();e(".upfront-image-lazy").each(function(){if(e(this).hasClass("upfront-image-lazy-loading"))return;var r=this,i=e(this).offset(),s=e(this).height(),o=e(this).width(),u,a,f;if((l&&i.top+s>=t&&i.top<t+n||!l)&&o>0&&s>0){u=e(this).attr("data-sources"),u?u=JSON.parse(u):a=e(this).attr("data-src");if(typeof u!="undefined"&&u.length||a){if(typeof u!="undefined"&&u.length){for(var c=0;c<u.length;c++)if(u[c][1]<=o||f>=0&&u[f][1]<o&&u[c][1]>o)f=c;if(e(this).data("loaded")==f)return;a=u[f][0],e(this).data("loaded",f)}else if(a&&e(this).hasClass("upfront-image-lazy-loaded"))return;e(this).removeClass("upfront-image-lazy-loaded").addClass("upfront-image-lazy-loading"),e("<img>").attr("src",a).on("load",function(){e(r).hasClass("upfront-image-lazy-bg")?e(r).css("background-image",'url("'+e(this).attr("src")+'")'):e(r).attr("src",e(this).attr("src")),e(r).removeClass("upfront-image-lazy-loading").addClass("upfront-image-lazy-loaded")})}}})},100)}function h(){var t=window.getComputedStyle(document.body,":after").getPropertyValue("content");e("[data-theme-styles]").each(function(){var n=e(this).attr("data-theme-styles"),r=[];n&&(n=JSON.parse(n)),e.each(n,function(e,t){r.push(t)}),e(this).removeClass(r.join(" ")),!t&&n.default?e(this).addClass(n.default):t&&(n[t]||n.default)&&e(this).addClass(n[t]?n[t]:n.default)})}t("flex")?(e("html").addClass("flexbox-support"),r(),e(window).on("load",r),e(window).on("resize",r)):(n(),e(window).on("load",n),e(window).on("resize",n)),i(),e(window).on("resize",i);var o=e('<div class="upfront-lightbox-bg"></div>'),u=e('<div class="upfront-ui close_lightbox"></div>'),a=e('<div class="upfront-icon upfront-icon-popup-close"></div>');e(document).on("click","a",function(t){if(e("div#sidebar-ui").length>0&&e("div#sidebar-ui").css("display")=="block"){var n=e(t.target).attr("href");if(n.indexOf("#ltb-")>-1){t.preventDefault();var r=Upfront.Application.layout.get("regions"),i=n.split("#");region=r?r.get_by_name(i[1]):!1;if(region){_.each(r.models,function(e){e.attributes.sub=="lightbox"&&Upfront.data.region_views[e.cid].hide()});var s=Upfront.data.region_views[region.cid];s.show()}}return}var n=e(this).attr("href");if(!n)return;if(n.indexOf("#")>=0){var f=n.split("#");if(f[1].trim()!=""&&f[1].trim().indexOf("ltb-")==0){var l=e("div.upfront-region-"+f[1].trim());o.css("background-color",l.data("overlay")).insertBefore(l);if(l.data("closeicon")=="yes"||l.data("addclosetext")=="yes")l.prepend(u),l.data("addclosetext")=="yes"&&(u.append(e("<h3>"+l.data("closetext")+"</h3>")),l.data("closeicon")=="yes"&&u.children("h3").css("margin-right","40px")),l.data("closeicon")=="yes"&&u.append(a),u.bind("click",function(){c()});l.data("clickout")=="yes"&&o.bind("click",function(){c()}),l.css("width",e("div.upfront-grid-layout").first().width()*l.data("col")/24),l.show().css({"margin-left":-parseInt(l.width()/2),"margin-top":-parseInt(l.height()/2)}),e(document).trigger("upfront-lightbox-open"),t.preventDefault();function c(){u.html("").remove(),o.remove(),l.hide()}}}});var f,l=!0;c(),e(window).on("resize",c),l&&e(window).on("scroll",c),h(),e(window).on("resize",h)});