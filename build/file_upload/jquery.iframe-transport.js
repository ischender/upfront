/*
 * jQuery Iframe Transport Plugin 1.7
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

!function(t){t(window.jQuery)}(function(t){"use strict";var e=0;t.ajaxTransport("iframe",function(r){if(r.async){var a,n,o;return{send:function(p,i){a=t('<form style="display:none;"></form>'),a.attr("accept-charset",r.formAcceptCharset),o=/\?/.test(r.url)?"&":"?","DELETE"===r.type?(r.url=r.url+o+"_method=DELETE",r.type="POST"):"PUT"===r.type?(r.url=r.url+o+"_method=PUT",r.type="POST"):"PATCH"===r.type&&(r.url=r.url+o+"_method=PATCH",r.type="POST"),e+=1,n=t('<iframe src="javascript:false;" name="iframe-transport-'+e+'"></iframe>').bind("load",function(){var e,o=t.isArray(r.paramName)?r.paramName:[r.paramName];n.unbind("load").bind("load",function(){var e;try{if(e=n.contents(),!e.length||!e[0].firstChild)throw new Error}catch(r){e=void 0}i(200,"success",{iframe:e}),t('<iframe src="javascript:false;"></iframe>').appendTo(a),window.setTimeout(function(){a.remove()},0)}),a.prop("target",n.prop("name")).prop("action",r.url).prop("method",r.type),r.formData&&t.each(r.formData,function(e,r){t('<input type="hidden"/>').prop("name",r.name).val(r.value).appendTo(a)}),r.fileInput&&r.fileInput.length&&"POST"===r.type&&(e=r.fileInput.clone(),r.fileInput.after(function(t){return e[t]}),r.paramName&&r.fileInput.each(function(e){t(this).prop("name",o[e]||r.paramName)}),a.append(r.fileInput).prop("enctype","multipart/form-data").prop("encoding","multipart/form-data")),a.submit(),e&&e.length&&r.fileInput.each(function(r,a){var n=t(e[r]);t(a).prop("name",n.prop("name")),n.replaceWith(a)})}),a.append(n).appendTo(document.body)},abort:function(){n&&n.unbind("load").prop("src","javascript".concat(":false;")),a&&a.remove()}}}}),t.ajaxSetup({converters:{"iframe text":function(e){return e&&t(e[0].body).text()},"iframe json":function(e){return e&&t.parseJSON(t(e[0].body).text())},"iframe html":function(e){return e&&t(e[0].body).html()},"iframe xml":function(e){var r=e&&e[0];return r&&t.isXMLDoc(r)?r:t.parseXML(r.XMLDocument&&r.XMLDocument.xml||t(r.body).html())},"iframe script":function(e){return e&&t.globalEval(t(e[0].body).text())}}})});