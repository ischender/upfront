(function(e){define(["text!scripts/redactor/ueditor-templates.html"],function(t){var n={IMAGE:"image",EMBED:"embed"},r=Backbone.View.extend({shortcodeName:"ueditor-insert",attributes:{contenteditable:"false"},defaultData:{},resizable:!1,initialize:function(e){e=e||{};var t=e.data||{};t=_.extend({},this.defaultData,t),t.id||(t.id="uinsert-"+ ++Upfront.data.ueditor.insertCount,Upfront.Events.trigger("content:insertcount:updated")),this.el.id=t.id,this.data=new Backbone.Model(t),this.listenTo(this.data,"change add remove reset",this.render),this.createControls(),typeof this.init=="function"&&this.init()},start:function(){var t=e.Deferred();return t.resolve(),t.promise()},getOutput:function(){var e=this.data.toJSON(),t='[ueditor-insert type="'+this.type+'"';return _.each(e,function(e,n){t+=" "+n+'="'+e+'"'}),t+"]"},importInserts:function(t){var n=this,r=new RegExp("(["+this.shortcodeName+"[^]]*?])","ig"),i=t.html(),s=e("<div></div>");i=i.replace(r,'<p class="ueditor-insert">$1</p>');var o=s.html(i).find("p.ueditor-insert");o.each(function(){var e=n.parseShortcode(this.innerHTML);e.type&&l[e.type]})},parseShortcode:function(t){var n=/\[([^\s\]]+)([^\]]*?)\]/i,r=/(\w+)\s*=\s*"([^"]*)"(?:\s|$)|(\w+)\s*=\s*\'([^\']*)\'(?:\s|$)|(\w+)\s*=\s*([^\s\'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/ig,i=t.match(n),s={},o;if(!i)return!1;s.shortcodeName=i[1],o=e.trim(i[2]);if(o){var u=o.match(r);u&&_.each(u,function(t){t=e.trim(t);var n=t.split("=");if(n.length==1)s[t]=t;else{var r=e.trim(n[0]),i=e.trim(n.slice(1).join("="));if(i[0]=='"'&&i[i.length-1]=='"'||i[0]=="'"&&i[i.length-1]=="'")i=i.slice(1,-1);s[r]=i}})}return s},createControls:function(){var e=this,t=Upfront.Views.Editor.InlinePanels;this.controls&&(this.controls.remove(),this.controls=!1);if(!this.controlsData)return;this.controls=t.ControlPanel.extend({position_v:"top"}),this.controls=new this.controls;var n=[];_.each(this.controlsData,function(r){var i;if(r.type=="simple")i=e.createSimpleControl(r),e.controls.listenTo(i,"click",function(){e.controls.trigger("control:click",i),e.controls.trigger("control:click:"+i.id,i)});else if(r.type=="multi"){i=new t.TooltipControl,i.selected=r.selected;if(r.subItems){var s={};_.each(r.subItems,function(t){s[t.id]=e.createSimpleControl(t)}),i.sub_items=s}e.controls.listenTo(i,"select",function(t){e.controls.trigger("control:select:"+i.id,t)})}else r.type=="dialog"&&(i=new t.DialogControl,i.view=r.view,e.controls.listenTo(i,"panel:ok",function(t){e.controls.trigger("control:ok:"+i.id,t,i)}),e.controls.listenTo(i,"panel:open",function(){e.controls.$el.addClass("uinsert-control-visible"),e.$el.addClass("nosortable")}),e.controls.listenTo(i,"panel:close",function(){e.controls.$el.removeClass("uinsert-control-visible"),e.$el.removeClass("nosortable")}));i&&(i.icon=r.icon,i.tooltip=r.tooltip,i.id=r.id,i.label=r.label,i.active=r.active,n.push(i))}),this.controls.items=_(n),this.controls.render(),typeof this.controlEvents=="function"&&this.controlEvents(),this.controls.delegateEvents()},createSimpleControl:function(e){var t=new Upfront.Views.Editor.InlinePanels.Control;return t.icon=e.icon,t.tooltip=e.tooltip,t.id=e.id,t.label=e.label,t},getAligmnentControlData:function(e){var t={left:{id:"left",icon:"alignleft",tooltip:"Align left"},right:{id:"right",icon:"alignright",tooltip:"Align right"},center:{id:"center",icon:"aligncenter",tooltip:"Align center"},full:{id:"full",icon:"alignfull",tooltip:"Full width"}},n={id:"alignment",type:"multi",icon:"alignment",tooltip:"Alignment",subItems:[]};return _.each(e,function(e){t[e]&&n.subItems.push(t[e])}),n},getRemoveControlData:function(){return{id:"remove",type:"simple",icon:"remove",tooltip:"Delete"}},resizableInsert:function(){if(!this.resizable)return;var e=this,t=this.data.get("align"),n=!0,r=!0,i=".upfront-icon-control-resize-se",s={},o=Upfront.Behaviors.GridEditor;this.$el.hasClass("ui-resizable")&&this.$el.resizable("destroy"),t=="left"?n=!1:t=="right"&&(r=!1,i=".upfront-icon-control-resize-sw"),this.$(i).length||(r&&(this.$el.append('<span class="upfront-icon-control upfront-icon-control-resize-se upfront-resize-handle-se ui-resizable-handle ui-resizable-se nosortable" style="display: inline;"></span>'),s.se=".upfront-icon-control-resize-se"),n&&(this.$el.append('<span class="upfront-icon-control upfront-icon-control-resize-sw upfront-resize-handle-sw ui-resizable-handle ui-resizable-sw nosortable" style="display: inline;"></span>'),s.sw=".upfront-icon-control-resize-sw"));var u=this.getResizableOptions?this.getResizableOptions():{};u.handles=s,u.grid=[o.col_size,o.baseline],this.$el.resizable(u)}}),i=r.extend({caption_active:!1,type:"image",className:"ueditor-insert upfront-inserted_image-wrapper",tpl:_.template(e(t).find("#image-insert-tpl").html()),resizable:!1,defaultData:{caption:"Default caption",show_caption:1,imageFull:{src:"",width:100,height:100},imageThumb:{src:"",width:100,height:100},linkType:"do_nothing",linkUrl:"",isLocal:1,externalImage:{top:0,left:0,width:0,height:0},variant_id:"",style:new Upfront.Models.ImageVariant},init:function(){this.controlsData=[{id:"style",type:"dialog",icon:"style",tooltip:"Style",view:this.getStyleView()},{id:"link",type:"dialog",icon:"link",tooltip:"Link image",view:this.getLinkView()},{id:"toggle_caption",type:"simple",icon:"caption",tooltip:"Toggle Caption",active:_.bind(this.get_caption_state,this)}],this.createControls()},events:{"click .ueditor-insert-remove":"click_remove"},get_caption_state:function(){return 1-parseInt(this.data.get("show_caption"),10)},click_remove:function(e){e.preventDefault(),this.trigger("remove",this)},start:function(){var e=this,t=Upfront.Media.Manager.open({multiple_selection:!1});return t.done(function(t,n){var r=e.getImageData(n);r.id=e.data.id,e.data.clear({silent:!0}),r.style=Upfront.Content.ImageVariants.length?Upfront.Content.ImageVariants.first().toJSON():(new Upfront.Models.ImageVariant).toJSON(),e.data.set(r),e.createControls()}),t},apply_classes:function(e){if(!e)return!1;var t=Upfront.Settings.LayoutEditor.Grid;e.height=e.row*t.baseline,e.width_cls=t.class+e.col,e.left_cls=t.left_margin_class+e.left,e.top&&(e.top_cls=t.top_margin_class+e.top),e.clear_cls=e.clear?"clr":""},render:function(){this.data.set("show_caption",parseInt(this.data.get("show_caption"),10));var t=this,n=this.data.toJSON(),r=this.data.get("style"),i=this.data.get("imageThumb"),s=Upfront.Settings.LayoutEditor.Grid;if(!r)return;n.style.label_id=n.style.label&&n.style.label.trim()!==""?"ueditor-image-style-"+n.style.label.toLowerCase().trim().replace(" ","-"):n.style.vid,n.image=this.get_proper_image(),this.apply_classes(n.style.group),this.apply_classes(n.style.image),this.apply_classes(n.style.caption),this.data.get("show_caption")==0&&(n.style.image.width_cls=Upfront.Settings.LayoutEditor.Grid.class+24);var o=this.$el.find(".ueditor-insert-variant-group"),u=Upfront.Behaviors.GridEditor,a=e(".upfront-content-marker-contents"),f=parseFloat(e(".upfront-content-marker-contents>*").css("padding-left"))/u.col_size,l=parseFloat(e(".upfront-content-marker-contents>*").css("padding-right"))/u.col_size,c=Upfront.Util.grid.width_to_col(a.width(),!0),h=c-f-l,p=e(".upfront-content-marker-contents>*").width()/h;f=f?parseInt(f):0,l=l?parseInt(l):0,r&&r.group&&r.group.float&&(r.group.float=="left"&&f>0?(n.style.group.marginLeft=(f-Math.abs(r.group.margin_left))*p,n.style.group.marginRight=0):r.group.float=="right"&&l>0?(n.style.group.marginRight=(l-Math.abs(r.group.margin_right))*p,n.style.group.marginLeft=0):r.group.float=="none"&&f>0&&(n.style.group.marginLeft=(f-Math.abs(r.group.margin_left)+Math.abs(r.group.left))*p,n.style.group.marginRight=0)),this.$el.html(this.tpl(n)),this.controls.render(),this.$(".ueditor-insert-variant-group").append(this.controls.$el),this.$el.addClass("ueditor-insert-variant"),this.make_caption_editable(),this.updateControlsPosition(),this.$(".ueditor-insert-variant-group").prepend('<a href="#" class="upfront-icon-button upfront-icon-button-delete ueditor-insert-remove"></a>'),this.data.get("isLocal")||this.data.set({externalImage:r.image.width},{silent:!0})},make_caption_editable:function(){var e=this,t=this.data.get("style");if(!t)return!1;if(!t.caption.show||this.$(".wp-caption-text").length===0)return;this.$(".wp-caption-text").off("keyup").on("keyup",function(t){e.data.set("caption",this.innerHTML,{silent:!0}),e.data.trigger("update")}).ueditor({linebreaks:!0,autostart:!0,pastePlainText:!0,buttons:[]}),this.ueditor=this.$(".wp-caption-text").data("ueditor"),this.ueditor.redactor.events.on("ueditor:focus",function(t){if(t!=e.ueditor.redactor||e.caption_active===!0)return;e.caption_active=!0;var n=e.$el.closest(".upfront-content-marker-contents").data("ueditor"),r=n?n.redactor:!1;if(!r)return;r.$editor.off("drop.redactor paste.redactor keydown.redactor keyup.redactor focus.redactor blur.redactor"),r.$textarea.on("keydown.redactor-textarea")}),this.ueditor.redactor.events.on("ueditor:blur",function(t){if(t!=e.ueditor.redactor||e.caption_active===!1)return;e.caption_active=!1;var n=e.$el.closest(".upfront-content-marker-contents").data("ueditor"),r=n?n.redactor:!1;if(!r)return;r.build.setEvents()})},on_redactor_start:function(){var e=this;this.ueditor=this.$(".wp-caption-text").data("ueditor"),this.ueditor.redactor.events.on("ueditor:focus",function(t){if(!_.isEqual(t,e.ueditor.redactor))return;var n=e.$el.closest(".upfront-content-marker-contents").data("ueditor"),r=n?n.redactor:!1;if(!r)return;r.$editor.off("drop.redactor paste.redactor keydown.redactor keyup.redactor focus.redactor blur.redactor"),r.$textarea.on("keydown.redactor-textarea"),n.stop()}),this.ueditor.redactor.events.on("ueditor:blur",function(t){if(t!=e.ueditor.redactor)return;var n=e.$el.closest(".upfront-content-marker-contents").data("ueditor"),r=n?n.redactor:!1;if(!r)return;r.build.setEvents();var n=e.$el.closest(".ueditable").data("ueditor");n.start()})},controlEvents:function(){var e=this;this.stopListening(this.controls),this.listenTo(this.controls,"control:ok:link",function(e,t){var n=e.$("input[type=text]").val(),r=e.$("input[type=radio]:checked").val()||"do_nothing",i={};"external"===r&&!n.match(/https?:\/\//)&&!n.match(/\/\/:/)&&(n=n.match(/^www\./)||n.match(/\./)?"http://"+n:n),i={linkType:r,linkUrl:n},this.data.set(i),e.model.set(i),t.close()}),this.listenTo(this.controls,"control:ok:style",function(e,t){if(e._style){var n=e._style.toJSON();this.data.set("variant_id",e.variant_id),this.data.set("style",e._style.toJSON()),e.data.set("selected",e.variant_id)}t.close()}),this.listenTo(this.controls,"control:click:toggle_caption",function(e){this.data.set("show_caption",1-parseInt(this.data.get("show_caption"),10))})},updateControlsPosition:function(){var e=this.data.get("width"),t=this.data.get("captionPosition"),n=this.data.get("imageThumb").width,r=this.controls.$el,i=0;t=="left"?i=Math.min(e-n+n/2-r.width()/2,e-r.width()):i=Math.max(0,n/2-r.width()/2),r.css("margin-left",i+"px")},getSimpleOutput:function(){var t=this.el.cloneNode(!0),n=this.data.toJSON();return n.image=n.imageFull,this.data.set("width",this.$el.width(),{silent:!0}),this.data.trigger("update"),n.isLocal=parseInt(n.isLocal,10),t.innerHTML=this.tpl(n),e(t).width(this.data.get("width")),e("<div>").html(t).html()},get_proper_image:function(){var e=this.data.toJSON(),t=e.imageFull,n=Upfront.Settings.LayoutEditor.Grid;return e.style=e.style||{image_col:0,group:"",image:"",caption:""},e.imageThumb&&e.style&&e.style.image&&e.style.image.col&&e.style.image.col*n.column_width<=e.imageThumb.width&&(t=e.imageThumb),t},getOutput:function(){var t=this.el.cloneNode(),n=this.data.toJSON();return n.image=this.get_proper_image(),this.data.set("width",this.$el.width(),{silent:!0}),this.data.trigger("update"),n.isLocal=parseInt(n.isLocal,10),t.innerHTML=this.tpl(n),e("<div>").html(t).html()},getImageData:function(t){if(!t)return!1;var n=t.at(0).toJSON(),r=this.getSelectedImage(n),i=e.extend({},this.defaultData,{attachmentId:n.ID,title:n.post_tite,imageFull:n.image,imageThumb:this.getThumb(n.additional_sizes),linkType:"do_nothing",linkUrl:"",align:"center",captionPosition:"nocaption"});return i},getThumb:function(e){var t={width:0};return _.each(e,function(e){e.width<=500&&e.width>t.width&&(t=e)}),t},getSelectedImage:function(e){if(e.selected_size=="full")return e.image;var t=e.selected_size?e.selected_size.split("x"):[];if(t.length!=2)return e.image;for(var n=0;n<e.additional_sizes.length;n++){var r=e.additional_sizes[n];if(r.width==t[0]&&r.height==t[1])return r}return e.image},importInserts:function(t,n){var r=this,i=t.find("img"),s={};return i.each(function(){var t=e(this),i=t.closest(".upfront-inserted_image-wrapper"),o=!1;i.length?o=r.importFromWrapper(i,n):o=r.importFromImage(t),s[o.data.id]=o}),s},importFromWrapper:function(e,t){var n=e.attr("id"),r=!1,s=!1,o=!1;return t[n]?r=new i({data:t[n]}):(r=this.importFromImage(e.find("img")),s=e.css("float"),s!="none"&&r.data.set("align",s),o=e.find(".wp-caption-text")),r.render(),e.replaceWith(r.$el),r},importFromImage:function(t){var n=this.defaultData,r={src:t.attr("src"),width:t.width(),height:t.height()},s=e("<a>").attr("href",r.src)[0],o=this.calculateRealSize(r.src);s.origin!=window.location.origin&&(n.isLocal=0),this.calculateRealSize(r.src),n.imageThumb=r,n.imageFull={width:o.width,height:o.height,src:r.src};var u="center";t.hasClass("aligncenter")?u="center":t.hasClass("alignleft")?u="left":t.hasClass("alignright")&&(u="right"),n.align=u;var a=t.parent();a.is("a")&&(n.linkUrl=a.attr("href"),n.linkType="external");var f=t.attr("class");f?(f=f.match(/wp-image-(\d+)/),f?n.attachmentId=f[1]:n.attachmentId=!1):n.attachmentId=!1,n.title=t.attr("title");var l=new i({data:n});return l.render(),t.replaceWith(l.$el),l},getLinkView:function(){if(this.linkView)return this.linkView;var e=new s({data:{linkType:this.data.get("linkType"),linkUrl:this.data.get("linkUrl")}});return this.linkView=e,e},getStyleView:function(){if(this.styleView)return this.styleView;var e=new o(this.data);return this.styleView=e,e},calculateRealSize:function(e){var t=new Image;return t.src=e,{width:t.width,height:t.height}},generateThumbSrc:function(e,t){var n=this.data.get("imageFull").src,r=n.split("."),i=r.pop();return n=r.join(".")+"-"+e+"x"+t+"."+i,n},calculateImageResize:function(e,t){var n=t.width/t.height>e.width/e.height?"height":"width",r=t[n]/e[n],i={width:Math.round(t.width/r),height:Math.round(t.height/r)},s=n=="width";return i.top=s?-Math.round((i.height-e.height)/2):0,i.left=s?0:-Math.round((i.width-e.width)/2),i}}),s=Backbone.View.extend({tpl:_.template(e(t).find("#image-link-tpl").html()),initialize:function(e){e.data&&(this.model=new Backbone.Model(e.data),this.listenTo(this.model,"change",this.render))},events:{"change input[type=radio]":"updateData"},render:function(){this.$el.width("200px");var e=this.model.toJSON();e.checked='checked="checked"',this.$el.html(this.tpl(e))},updateData:function(e){var t=this,n=this.$("input:checked").val(),r=this.$("#uinsert-image-link-url").val();if(n=="post"){var i={postTypes:this.postTypes()};Upfront.Views.Editor.PostSelector.open(i).done(function(e){t.model.set({linkType:"post",linkUrl:e.get("permalink")})})}else this.model.set({linkType:n,linkUrl:r})},postTypes:function(){var e=[];return _.each(Upfront.data.ugallery.postTypes,function(t){t.name!="attachment"&&e.push({name:t.name,label:t.label})}),e}}),o=Backbone.View.extend({tpl:_.template(e(t).find("#image-style-tpl").html()),initialize:function(e){this.data=new Backbone.Model,this.listenTo(this.data,"change",this.render),this.data.set("variants",Upfront.Content.ImageVariants.toJSON()),this.data.set("selected",e.get("variant_id"))},events:{"change input[type=radio]":"update_data","click input[type=radio]":"on_click"},render:function(){return this.$el.html(this.tpl({data:this.data.toJSON()})),this},on_click:function(e){e.stopPropagation()},update_data:function(t){t.stopPropagation(),this.variant_id=e(t.target).val(),this._style=Upfront.Content.ImageVariants.findWhere({vid:this.variant_id})}}),u=r.extend({type:"embed",className:"ueditor-insert upfront-inserted_embed-wrapper uinsert-drag-handle",defaultData:{code:""},start:function(){var t=this,n=new a({code:this.data.get("code")}),r=new e.Deferred;return n.on("done",function(e){t.data.set({code:e}),n.remove(),r.resolve(this,e)}),n.on("render",function(e,r,i){t.trigger("manager:rendered",n,e,r,i)}),Upfront.Events.on("upfront:element:edit:stop",function(){n.remove(),r.resolve()}),r},render:function(){var t=this,n=this.data.get("code"),r=e("<div />").append(n);this.$el.empty();if(!n)return;r.append('<div class="upfront-edit_insert">edit</div>'),this.$el.append(e("<div />").append(r).html()),this.$el.off("click",".upfront-edit_insert").on("click",".upfront-edit_insert",function(e){e.preventDefault(),e.stopPropagation(),t.start()})},getOutput:function(){return this._get_output()},getSimpleOutput:function(){return this._get_output()},_get_output:function(){var t=this.data.get("code"),n=e("<div />").append('<div class="upfront-inserted_embed">'+t+"</div>");return t?n.html():""},importInserts:function(t,n){var r={};return t.find(".upfront-inserted_embed").each(function(){var t=e(this),n=new u({data:{code:t.html()}});r[n.data.id]=n,n.render(),t.replaceWith(n.$el)}),r}}),a=Backbone.View.extend({className:"upfront-inserts-markup-editor",initialize:function(e){var t=this,n=e&&e.code?e.code:"";require(["//cdnjs.cloudflare.com/ajax/libs/ace/1.1.01/ace.js"],function(){t.render(n)})},render:function(t){var n=this,r=new f.Main({code:t}),i=new f.Bar,s=new f.OK;r.render(),i.render(),s.render(),this.$el.empty().append(i.$el).append(s.$el).append(r.$el),e("body").append(this.$el),r.boot_editor(),i.on("insert",function(e){r.insert(e)}),s.on("done",function(){var e=r.get_value();n.trigger("done",e)}),this.trigger("render",r,i,s)}}),f={l10n:Upfront.Settings.l10n.markup_embeds,OK:Backbone.View.extend({className:"upfront-inserts-markup-apply",events:{click:"propagate_apply"},propagate_apply:function(e){e.stopPropagation(),this.trigger("done")},render:function(){this.$el.empty().append('<a href="#">'+f.l10n.done+"</a>")}}),Bar:Backbone.View.extend({className:"upfront-inserts-markup-bar",events:{click:"stop_prop","click .inserts-shortcode":"request_shortcode","click .inserts-image":"request_image"},stop_prop:function(e){e.stopPropagation()},render:function(){this.$el.empty().append('<ul><li><a href="#" class="inserts-shortcode">'+f.l10n.insert_shortcode+"</a></li>"+'<li><a href="#" class="inserts-image">'+f.l10n.insert_image+"</a></li>"+"</ul>")},request_shortcode:function(t){t.stopPropagation(),t.preventDefault();var n=this;Upfront.Popup.open(function(){var t=this,n=new f.ShortcodesList;n.render(),n.on("done",function(e){Upfront.Popup.close(e)}),e(this).empty().append(n.$el)},{},"embed-shortcode").done(function(e,t){n.trigger("insert",t)})},request_image:function(e){e.stopPropagation(),e.preventDefault();var t=this;Upfront.Media.Manager.open({multiple_selection:!1,media_type:["images"]}).done(function(e,n){if(!n)return;var r=n.models[0],i=r.get("image").src;i=i.replace(document.location.origin,""),t.trigger("insert",i)})}}),Main:Backbone.View.extend({className:"upfront-embed_editor",events:{click:"stop_prop"},code:"",initialize:function(e){e&&e.code&&(this.code=e.code)},stop_prop:function(e){e.stopPropagation()},render:function(){this.$el.empty().append('<div class="upfront-inserts-markup active"><div class="upfront-inserts-ace"></div></div>').show()},boot_editor:function(){var e=this.$el,t=e.find(".upfront-inserts-ace"),n=t.html(),r=ace.edit(t.get(0)),i=t.data("type");r.getSession().setUseWorker(!1),r.setTheme("ace/theme/monokai"),r.getSession().setMode("ace/mode/html"),r.setShowPrintMargin(!1),r.getSession().setValue(this.code),r.renderer.scrollBar.width=5,r.renderer.scroller.style.right="5px",t.height(e.height()),r.resize(),r.focus(),this.editor=r},insert:function(e){this.editor.insert(e)},get_value:function(){return this.editor.getValue()}}),ShortcodesList:Backbone.View.extend({events:{click:"stop_prop"},stop_prop:function(e){e.stopPropagation()},render:function(){var e=this;this.$el.empty().append(f.l10n.waiting),Upfront.Util.post({action:"upfront_list_shortcodes"}).done(function(t){e.$el.empty().append('<div class="shortcode-types" />').append('<div class="shortcode-list" />'),e.render_types(t.data),e.render_list()})},render_types:function(e){var t=this,n=[{label:f.l10n.select_area,value:0}],r=this.$el.find(".shortcode-types");_.each(_.keys(e),function(e){n.push({label:e,value:e})});var i=new Upfront.Views.Editor.Field.Select({label:"",name:"shortcode-selection",width:"100%",values:n,multiple:!1,change:function(){var n=this.get_value();if(!(n in e))return!1;t.render_list(e[n])}});i.render(),r.empty().append(i.$el)},render_list:function(e){var t=this,n=this.$el.find(".shortcode-list");n.empty();if(empty(e))return!1;_.each(e,function(e){var e=new f.Shortcode({code:e});e.render(),e.on("done",function(e){t.trigger("done",e)}),n.append(e.$el)})}}),Shortcode:Backbone.View.extend({tagName:"pre",events:{click:"send_shortcode"},initialize:function(e){this.code=e.code},send_shortcode:function(e){e.stopPropagation(),e.preventDefault();if(!this.code)return!1;this.trigger("done","["+this.code+"]")},render:function(){this.$el.empty().append("<code>["+this.code+"]</code>")}})},l={};return l[n.IMAGE]=i,l[n.EMBED]=u,{UeditorInsert:r,inserts:l,TYPES:n}})})(jQuery);