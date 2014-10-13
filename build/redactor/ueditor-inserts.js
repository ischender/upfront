(function(e){define(["text!scripts/redactor/ueditor-templates.html"],function(t){var n={IMAGE:"image",EMBED:"embed"},r=Backbone.View.extend({shortcodeName:"ueditor-insert",attributes:{contenteditable:"false"},defaultData:{},resizable:!1,initialize:function(e){e=e||{};var t=e.data||{};t=_.extend({},this.defaultData,t),t.id||(t.id="uinsert-"+ ++Upfront.data.ueditor.insertCount,Upfront.Events.trigger("content:insertcount:updated")),this.el.id=t.id,this.data=new Backbone.Model(t),this.listenTo(this.data,"change add remove reset",this.render),this.createControls(),typeof this.init=="function"&&this.init()},start:function(){var t=e.Deferred();return t.resolve(),t.promise()},getOutput:function(){var e=this.data.toJSON(),t='[ueditor-insert type="'+this.type+'"';return _.each(e,function(e,n){t+=" "+n+'="'+e+'"'}),t+"]"},importInserts:function(t){var n=this,r=new RegExp("(["+this.shortcodeName+"[^]]*?])","ig"),i=t.html(),s=e("<div></div>");i=i.replace(r,'<p class="ueditor-insert">$1</p>');var o=s.html(i).find("p.ueditor-insert");o.each(function(){var e=n.parseShortcode(this.innerHTML);e.type&&f[e.type]})},parseShortcode:function(t){var n=/\[([^\s\]]+)([^\]]*?)\]/i,r=/(\w+)\s*=\s*"([^"]*)"(?:\s|$)|(\w+)\s*=\s*\'([^\']*)\'(?:\s|$)|(\w+)\s*=\s*([^\s\'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/ig,i=t.match(n),s={},o;if(!i)return!1;s.shortcodeName=i[1],o=e.trim(i[2]);if(o){var u=o.match(r);u&&_.each(u,function(t){t=e.trim(t);var n=t.split("=");if(n.length==1)s[t]=t;else{var r=e.trim(n[0]),i=e.trim(n.slice(1).join("="));if(i[0]=='"'&&i[i.length-1]=='"'||i[0]=="'"&&i[i.length-1]=="'")i=i.slice(1,-1);s[r]=i}})}return s},createControls:function(){var e=this,t=Upfront.Views.Editor.InlinePanels;this.controls&&(this.controls.remove(),this.controls=!1);if(!this.controlsData)return;this.controls=new t.ControlPanel;var n=[];_.each(this.controlsData,function(r){var i;if(r.type=="simple")i=e.createSimpleControl(r),e.controls.listenTo(i,"click",function(){e.controls.trigger("control:click",i),e.controls.trigger("control:click:"+i.id,i)});else if(r.type=="multi"){i=new t.TooltipControl,i.selected=r.selected;if(r.subItems){var s={};_.each(r.subItems,function(t){s[t.id]=e.createSimpleControl(t)}),i.sub_items=s}e.controls.listenTo(i,"select",function(t){e.controls.trigger("control:select:"+i.id,t)})}else r.type=="dialog"&&(i=new t.DialogControl,i.view=r.view,e.controls.listenTo(i,"panel:ok",function(t){e.controls.trigger("control:ok:"+i.id,t,i)}),e.controls.listenTo(i,"panel:open",function(){e.controls.$el.addClass("uinsert-control-visible"),e.$el.addClass("nosortable")}),e.controls.listenTo(i,"panel:close",function(){e.controls.$el.removeClass("uinsert-control-visible"),e.$el.removeClass("nosortable")}));i&&(i.icon=r.icon,i.tooltip=r.tooltip,i.id=r.id,i.label=r.label,n.push(i))}),this.controls.items=_(n),this.controls.render(),typeof this.controlEvents=="function"&&this.controlEvents(),this.controls.delegateEvents()},createSimpleControl:function(e){var t=new Upfront.Views.Editor.InlinePanels.Control;return t.icon=e.icon,t.tooltip=e.tooltip,t.id=e.id,t.label=e.label,t},getAligmnentControlData:function(e){var t={left:{id:"left",icon:"alignleft",tooltip:"Align left"},right:{id:"right",icon:"alignright",tooltip:"Align right"},center:{id:"center",icon:"aligncenter",tooltip:"Align center"},full:{id:"full",icon:"alignfull",tooltip:"Full width"}},n={id:"alignment",type:"multi",icon:"alignment",tooltip:"Alignment",subItems:[]};return _.each(e,function(e){t[e]&&n.subItems.push(t[e])}),n},getRemoveControlData:function(){return{id:"remove",type:"simple",icon:"remove",tooltip:"Delete"}},resizableInsert:function(){if(!this.resizable)return;var e=this,t=this.data.get("align"),n=!0,r=!0,i=".upfront-icon-control-resize-se",s={},o=Upfront.Behaviors.GridEditor;this.$el.hasClass("ui-resizable")&&this.$el.resizable("destroy"),t=="left"?n=!1:t=="right"&&(r=!1,i=".upfront-icon-control-resize-sw"),this.$(i).length||(r&&(this.$el.append('<span class="upfront-icon-control upfront-icon-control-resize-se upfront-resize-handle-se ui-resizable-handle ui-resizable-se nosortable" style="display: inline;"></span>'),s.se=".upfront-icon-control-resize-se"),n&&(this.$el.append('<span class="upfront-icon-control upfront-icon-control-resize-sw upfront-resize-handle-sw ui-resizable-handle ui-resizable-sw nosortable" style="display: inline;"></span>'),s.sw=".upfront-icon-control-resize-sw"));var u=this.getResizableOptions?this.getResizableOptions():{};u.handles=s,u.grid=[o.col_size,o.baseline],this.$el.resizable(u)}}),i=r.extend({type:"image",className:"ueditor-insert upfront-inserted_image-wrapper",tpl:_.template(e(t).find("#image-insert-tpl").html()),resizable:!1,defaultData:{captionPosition:"bottom",caption:"Type your caption here ...",imageFull:{src:"",width:100,height:100},imageThumb:{src:"",width:100,height:100},linkType:"do_nothing",linkUrl:"",isLocal:1,externalImage:{top:0,left:0,width:0,height:0},variant_id:""},init:function(){var e=Upfront.Content.ImageVariants.findWhere({vid:this.data.get("variant_id")}),t=this.getAligmnentControlData(["left","center","full","right"]);t.selected=this.data.get("variant_id"),this.controlsData=[{id:"style",type:"multi",icon:"style",tooltip:"Style",selected:this.data.get("variant_id"),subItems:this.get_style_control_data()},{id:"link",type:"dialog",icon:"link",tooltip:"Link image",view:this.getLinkView()},this.getRemoveControlData()],this.createControls(),this.data.set("style",(e?e:new Upfront.Models.ImageVariant).toJSON())},start:function(){var e=this,t=Upfront.Media.Manager.open({multiple_selection:!1});return t.done(function(t,n){var r=e.getImageData(n);r.id=e.data.id,e.data.clear({silent:!0}),r.style=(new Upfront.Models.ImageVariant).toJSON(),e.data.set(r),e.controlsData[0].selected=e.data.get("align"),e.createControls()}),t},render:function(){var e=this,t=this.data.toJSON(),n=this.data.get("style"),r=this.data.get("imageThumb");t.image=t.imageFull,this.$el.html(this.tpl(t)),Upfront.Util.grid.update_class(this.$el,n.group.width_cls),this.$el.css({"float":n.group.float,height:n.group.height}),this.controls.render(),this.$el.append(this.controls.$el),this.make_caption_editable(),this.updateControlsPosition(),this.$(".uinsert-image-wrapper").find("img").attr("src",this.data.get("imageFull").src),this.data.get("isLocal")||this.data.set({externalImage:n.image.width},{silent:!0})},make_caption_editable:function(){var e=this;if(!this.data.get("style").caption.show)return;this.$(".wp-caption-text").off("keyup").on("keyup",function(t){e.data.set("caption",this.innerHTML,{silent:!0}),e.data.trigger("update")}).ueditor({linebreaks:!0,autostart:!0,pastePlainText:!0,airButtons:["bold","italic","upfrontLink","stateAlign"]}),this.ueditor=this.$(".wp-caption-text").data("ueditor"),this.ueditor.redactor.events.on("ueditor:focus",function(t){if(t!=e.ueditor.redactor)return;var n=e.$el.closest(".upfront-content-marker-contents").data("ueditor"),r=n?n.redactor:!1;if(!r)return;r.$editor.off("drop.redactor paste.redactor keydown.redactor keyup.redactor focus.redactor blur.redactor"),r.$source.on("keydown.redactor-textarea")}),this.ueditor.redactor.events.on("ueditor:blur",function(t){if(t!=e.ueditor.redactor)return;var n=e.$el.closest(".upfront-content-marker-contents").data("ueditor"),r=n?n.redactor:!1;if(!r)return;r.buildBindKeyboard()})},controlEvents:function(){var e=this;this.stopListening(this.controls),this.listenTo(this.controls,"control:click:remove",function(e){this.trigger("remove",this)}),this.listenTo(this.controls,"control:select:alignment",function(t){var n={align:t},r=Upfront.Behaviors.GridEditor.col_size,i=this.data.get("imageThumb"),s=this.data.get("captionPosition"),o=s=="left"||s=="right",u;t=="full"?(this.data.set(n),n.width=e.$el.width(),o?i.width=(n.width/r-3)*r:i.width=n.width,i.width=Math.round(i.width),i.src=this.data.get("isLocal")?this.generateThumbSrc(i.width,i.height):i.src,n.thumb=i):this.data.get("align")=="full"&&(u=Math.round((this.data.get("width")/r-6)*r),n.width=u,o?i.width=u-3*r:i.width=u,i.width=Math.round(i.width),i.src=this.data.get("isLocal")?this.generateThumbSrc(i.width,i.height):i.src,n.thumb=i),this.data.set(n)}),this.listenTo(this.controls,"control:ok:link",function(e,t){var n=e.$("input[type=text]").val(),r=e.$("input[type=radio]:checked").val()||"do_nothing",i={};"external"===r&&!n.match(/https?:\/\//)&&!n.match(/\/\/:/)&&(n=n.match(/^www\./)||n.match(/\./)?"http://"+n:n),i={linkType:r,linkUrl:n},this.data.set(i),e.model.set(i),t.close()}),this.listenTo(this.controls,"control:select:caption",function(e){var t=this.data.get("captionPosition"),n={captionPosition:e},r=["left","right"].indexOf(this.data.get("captionPosition"))!=-1,i=["left","right"].indexOf(e)!=-1,s=this.data.get("align"),o=this.data.get("imageThumb"),u=Upfront.Behaviors.GridEditor.col_size;r!=i&&(s=="full"?(o.width=i?(this.data.get("width")/u-3)*u:this.data.get("width"),o.width=Math.round(o.width),o.src=this.data.get("isLocal")?this.generateThumbSrc(o.width,o.height):o.src,n.imageThumb=o):n.width=i?parseInt(this.data.get("imageThumb").width,10)+3*u:parseInt(this.data.get("imageThumb").width,10)),this.data.set(n)}),this.listenTo(this.controls,"control:select:style",function(e){var t=Upfront.Content.ImageVariants.findWhere({vid:e});if(t){var n=t.toJSON();this.data.set("variant_id",e),this.data.set("style",t.toJSON())}})},updateControlsPosition:function(){var e=this.data.get("width"),t=this.data.get("captionPosition"),n=this.data.get("imageThumb").width,r=this.controls.$el,i=0;t=="left"?i=Math.min(e-n+n/2-r.width()/2,e-r.width()):i=Math.max(0,n/2-r.width()/2),r.css("margin-left",i+"px")},getSimpleOutput:function(){var t=this.el.cloneNode(),n=this.data.toJSON();return n.image=n.imageFull,this.data.set("width",this.$el.width(),{silent:!0}),this.data.trigger("update"),n.isLocal=parseInt(n.isLocal,10),t.innerHTML=this.tpl(n),e(t).width(this.data.get("width")),e("<div>").html(t).html()},getOutput:function(){var t=this.el.cloneNode(),n=this.data.toJSON();return n.image=n.imageThumb,this.data.set("width",this.$el.width(),{silent:!0}),this.data.trigger("update"),n.isLocal=parseInt(n.isLocal,10),t.innerHTML=this.tpl(n),e(t).width(this.data.get("width")),e("<div>").html(t).html()},getImageData:function(t){if(!t)return!1;var n=t.at(0).toJSON(),r=this.getSelectedImage(n),i=e.extend({},this.defaultData,{attachmentId:n.ID,title:n.post_tite,imageFull:n.image,imageThumb:this.getThumb(n.additional_sizes),linkType:"do_nothing",linkUrl:"",align:"center",captionPosition:"nocaption"});return i},getThumb:function(e){var t={width:0};return _.each(e,function(e){e.width<=500&&e.width>t.width&&(t=e)}),t},getSelectedImage:function(e){if(e.selected_size=="full")return e.image;var t=e.selected_size?e.selected_size.split("x"):[];if(t.length!=2)return e.image;for(var n=0;n<e.additional_sizes.length;n++){var r=e.additional_sizes[n];if(r.width==t[0]&&r.height==t[1])return r}return e.image},importInserts:function(t,n){var r=this,i=t.find("img"),s={};return i.each(function(){var t=e(this),i=t.closest(".upfront-inserted_image-wrapper"),o=!1;i.length?o=r.importFromWrapper(i,n):o=r.importFromImage(t),s[o.data.id]=o}),s},importFromWrapper:function(e,t){var n=e.attr("id"),r=!1,s=!1,o=!1;return t[n]?r=new i({data:t[n]}):(r=this.importFromImage(e.find("img")),s=e.css("float"),s!="none"&&r.data.set("align",s),o=e.find(".wp-caption-text"),o.length&&(r.data.set("caption",o.html()),e.hasClass("uinsert-caption-left")?r.data.set("captionPosition","left"):e.hasClass("uinsert-caption-right")?r.data.set("captionPosition","right"):r.data.set("captionPosition","bottom"))),r.render(),e.replaceWith(r.$el),r},importFromImage:function(t){var n=this.defaultData,r={src:t.attr("src"),width:t.width(),height:t.height()},s=e("<a>").attr("href",r.src)[0],o=this.calculateRealSize(r.src);s.origin!=window.location.origin&&(n.isLocal=0),this.calculateRealSize(r.src),n.imageThumb=r,n.imageFull={width:o.width,height:o.height,src:r.src};var u="center";t.hasClass("aligncenter")?u="center":t.hasClass("alignleft")?u="left":t.hasClass("alignright")&&(u="right"),n.align=u;var a=t.parent();a.is("a")&&(n.linkUrl=a.attr("href"),n.linkType="external");var f=t.attr("class");f?(f=f.match(/wp-image-(\d+)/),f?n.attachmentId=f[1]:n.attachmentId=!1):n.attachmentId=!1,n.title=t.attr("title");var l=new i({data:n});return l.render(),t.replaceWith(l.$el),l},getLinkView:function(){if(this.linkView)return linkView;var e=new s({data:{linkType:this.data.get("linkType"),linkUrl:this.data.get("linkUrl")}});return this.linkView=e,e},calculateRealSize:function(e){var t=new Image;return t.src=e,{width:t.width,height:t.height}},generateThumbSrc:function(e,t){var n=this.data.get("imageFull").src,r=n.split("."),i=r.pop();return n=r.join(".")+"-"+e+"x"+t+"."+i,n},calculateImageResize:function(e,t){var n=t.width/t.height>e.width/e.height?"height":"width",r=t[n]/e[n],i={width:Math.round(t.width/r),height:Math.round(t.height/r)},s=n=="width";return i.top=s?-Math.round((i.height-e.height)/2):0,i.left=s?0:-Math.round((i.width-e.width)/2),i},resizableImage:function(){return;var t,n,r,i,s},get_style_control_data:function(){return Upfront.Content.ImageVariants.map(function(e,t){return{id:e.get("vid"),label:e.get("label")}})}}),s=Backbone.View.extend({tpl:_.template(e(t).find("#image-link-tpl").html()),initialize:function(e){e.data&&(this.model=new Backbone.Model(e.data),this.listenTo(this.model,"change",this.render))},events:{"change input[type=radio]":"updateData"},render:function(){this.$el.width("200px");var e=this.model.toJSON();e.checked='checked="checked"',this.$el.html(this.tpl(e))},updateData:function(e){var t=this,n=this.$("input:checked").val(),r=this.$("#uinsert-image-link-url").val();if(n=="post"){var i={postTypes:this.postTypes()};Upfront.Views.Editor.PostSelector.open(i).done(function(e){t.model.set({linkType:"post",linkUrl:e.get("permalink")})})}else this.model.set({linkType:n,linkUrl:r})},postTypes:function(){var e=[];return _.each(Upfront.data.ugallery.postTypes,function(t){t.name!="attachment"&&e.push({name:t.name,label:t.label})}),e}}),o=r.extend({type:"embed",className:"ueditor-insert upfront-inserted_embed-wrapper uinsert-drag-handle",defaultData:{code:""},start:function(){var t=this,n=new u({code:this.data.get("code")}),r=new e.Deferred;return n.on("done",function(e){t.data.set({code:e}),n.remove(),r.resolve(this,e)}),Upfront.Events.on("upfront:element:edit:stop",function(){n.remove(),r.resolve()}),r},render:function(){var t=this,n=this.data.get("code"),r=e("<div />").append(n);this.$el.empty();if(!n)return;r.append('<div class="upfront-edit_insert">edit</div>'),this.$el.append(e("<div />").append(r).html()),this.$el.off("click",".upfront-edit_insert").on("click",".upfront-edit_insert",function(e){e.preventDefault(),e.stopPropagation(),t.start()})},getOutput:function(){return this._get_output()},getSimpleOutput:function(){return this._get_output()},_get_output:function(){var t=this.data.get("code"),n=e("<div />").append('<div class="upfront-inserted_embed">'+t+"</div>");return t?n.html():""},importInserts:function(t,n){var r={};return t.find(".upfront-inserted_embed").each(function(){var t=e(this),n=new o({data:{code:t.html()}});r[n.data.id]=n,n.render(),t.replaceWith(n.$el)}),r}}),u=Backbone.View.extend({className:"upfront-inserts-markup-editor",initialize:function(e){var t=this,n=e&&e.code?e.code:"";require(["//cdnjs.cloudflare.com/ajax/libs/ace/1.1.01/ace.js"],function(){t.render(n)})},render:function(t){var n=this,r=new a.Main({code:t}),i=new a.Bar,s=new a.OK;r.render(),i.render(),s.render(),this.$el.empty().append(i.$el).append(s.$el).append(r.$el),e("body").append(this.$el),r.boot_editor(),i.on("insert",function(e){r.insert(e)}),s.on("done",function(){var e=r.get_value();n.trigger("done",e)})}}),a={l10n:Upfront.Settings.l10n.markup_embeds,OK:Backbone.View.extend({className:"upfront-inserts-markup-apply",events:{click:"propagate_apply"},propagate_apply:function(e){e.stopPropagation(),this.trigger("done")},render:function(){this.$el.empty().append('<a href="#">'+a.l10n.done+"</a>")}}),Bar:Backbone.View.extend({className:"upfront-inserts-markup-bar",events:{click:"stop_prop","click .inserts-shortcode":"request_shortcode","click .inserts-image":"request_image"},stop_prop:function(e){e.stopPropagation()},render:function(){this.$el.empty().append('<ul><li><a href="#" class="inserts-shortcode">'+a.l10n.insert_shortcode+"</a></li>"+'<li><a href="#" class="inserts-image">'+a.l10n.insert_image+"</a></li>"+"</ul>")},request_shortcode:function(t){t.stopPropagation(),t.preventDefault();var n=this;Upfront.Popup.open(function(){var t=this,n=new a.ShortcodesList;n.render(),n.on("done",function(e){Upfront.Popup.close(e)}),e(this).empty().append(n.$el)},{},"embed-shortcode").done(function(e,t){n.trigger("insert",t)})},request_image:function(e){e.stopPropagation(),e.preventDefault();var t=this;Upfront.Media.Manager.open({multiple_selection:!1,media_type:["images"]}).done(function(e,n){if(!n)return;var r=n.models[0],i=r.get("image").src;i=i.replace(document.location.origin,""),t.trigger("insert",i)})}}),Main:Backbone.View.extend({className:"upfront-embed_editor",events:{click:"stop_prop"},code:"",initialize:function(e){e&&e.code&&(this.code=e.code)},stop_prop:function(e){e.stopPropagation()},render:function(){this.$el.empty().append('<div class="upfront-inserts-markup active"><div class="upfront-inserts-ace"></div></div>').show()},boot_editor:function(){var e=this.$el,t=e.find(".upfront-inserts-ace"),n=t.html(),r=ace.edit(t.get(0)),i=t.data("type");r.getSession().setUseWorker(!1),r.setTheme("ace/theme/monokai"),r.getSession().setMode("ace/mode/html"),r.setShowPrintMargin(!1),r.getSession().setValue(this.code),r.renderer.scrollBar.width=5,r.renderer.scroller.style.right="5px",t.height(e.height()),r.resize(),r.focus(),this.editor=r},insert:function(e){this.editor.insert(e)},get_value:function(){return this.editor.getValue()}}),ShortcodesList:Backbone.View.extend({events:{click:"stop_prop"},stop_prop:function(e){e.stopPropagation()},render:function(){var e=this;this.$el.empty().append(a.l10n.waiting),Upfront.Util.post({action:"upfront_list_shortcodes"}).done(function(t){e.$el.empty().append('<div class="shortcode-types" />').append('<div class="shortcode-list" />'),e.render_types(t.data),e.render_list()})},render_types:function(e){var t=this,n=[{label:a.l10n.select_area,value:0}],r=this.$el.find(".shortcode-types");_.each(_.keys(e),function(e){n.push({label:e,value:e})});var i=new Upfront.Views.Editor.Field.Select({label:"",name:"shortcode-selection",width:"100%",values:n,multiple:!1,change:function(){var n=this.get_value();if(!(n in e))return!1;t.render_list(e[n])}});i.render(),r.empty().append(i.$el)},render_list:function(e){var t=this,n=this.$el.find(".shortcode-list");n.empty();if(empty(e))return!1;_.each(e,function(e){var e=new a.Shortcode({code:e});e.render(),e.on("done",function(e){t.trigger("done",e)}),n.append(e.$el)})}}),Shortcode:Backbone.View.extend({tagName:"pre",events:{click:"send_shortcode"},initialize:function(e){this.code=e.code},send_shortcode:function(e){e.stopPropagation(),e.preventDefault();if(!this.code)return!1;this.trigger("done","["+this.code+"]")},render:function(){this.$el.empty().append("<code>["+this.code+"]</code>")}})},f={};return f[n.IMAGE]=i,f[n.EMBED]=o,{UeditorInsert:r,inserts:f,TYPES:n}})})(jQuery);