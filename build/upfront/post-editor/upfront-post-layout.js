!function(t){define(["upfront/post-editor/upfront-post-content","text!upfront/templates/popup.html","text!elements/upfront-image/tpl/image_editor.html","scripts/upfront/element-settings/settings","scripts/upfront/element-settings/root-settings-panel"],function(e,i,s,o,n){var r=Upfront.Views.ObjectView.extend({initialize:function(e){var i=this,s=this.model.get_property_value_by_name("postPart");this.postPart=s,this.listenTo(Upfront.Events,"entity:resize_start",this.close_settings),this.listenTo(Upfront.Events,"entity:drag_start",this.close_settings),this.postView=Upfront.Application.PostLayoutEditor.postView,this.postView.partOptions&&this.postView.partOptions[this.postPart]&&_.each(this.postView.partOptions[this.postPart],function(t,e){i.model.set_property(e,t,!0)}),this.listenTo(this.model.get("properties"),"change add remove",this.updateOptions),this.listenTo(this.postView.model,"template:"+s,this.refreshTemplate),this.listenTo(Upfront.Events,"entity:modules:render_module",function(){t(".upfront-wrapper:not(:visible)").filter('[class*="part-"]').show()}),_upfront_post_data&&(this.post=Upfront.data.posts[_upfront_post_data.post_id]),this.tpl=this.getTemplate(),this.model.tpl=this.tpl,"function"==typeof this.init&&this.init.apply(this,arguments)},get_content_markup:function(){var t=this.property("postPart"),i=e.getMarkupper(),s=this.getTemplate(),o=Upfront.Application.PostLayoutEditor.partMarkup,n=i.markup(t,o,s);return n?n:(this.updatePartContent(),"Loading")},on_render:function(){var t=this.postView.partOptions,e=t[this.property("postPart")]||{};e.extraClasses&&this.$(".upfront-object").addClass(e.extraClasses),this.$(".upfront-object").addClass("Postpart_"+this.postPart),Upfront.Events.trigger("post:layout:partrendered",this)},updateOptions:function(){var t=this.model.get("properties").toJSON(),e={},i=this.postView.partOptions,s=["","row","type","view_class","has_settings","id_slug","postPart","element_id"];_.isArray(i)&&(i={}),_.each(t,function(t){-1==s.indexOf(t.name)&&(e[t.name]=t.value)}),i[this.postPart]=e,this.postView.partOptions=i,this.updatePartContent(),this.$(".upfront-object-content").html("Loading")},updatePartContent:function(){var t=this,e=this.postView.partOptions||{},i={action:"content_part_markup",post_id:this.postView.editor.postId?this.postView.editor.postId:this.post.id,parts:JSON.stringify([{slug:this.postPart,options:e[this.postPart]||{}}]),templates:{}};i.templates[this.postPart]=this.getTemplate(),Upfront.Util.post(i).done(function(e){_.extend(Upfront.Application.PostLayoutEditor.partMarkup,e.data.replacements),t.render()})},getTemplate:function(){var t=this.postView.partTemplates,e=this.postPart;return"contents"==e&&"excerpt"==this.postView.property("content_type")&&(e="excerpt"),t&&t[e]?t[e]:Upfront.data.thisPost.templates[e]},refreshTemplate:function(){this.model.tpl=this.getTemplate(),this.render()},property:function(t,e,i){return"undefined"!=typeof e?("undefined"==typeof i&&(i=!0),this.model.set_property(t,e,i)):this.model.get_property_value_by_name(t)}}),a=Upfront.Views.Editor.Sidebar.Element.extend({className:"draggable-element upfront-no-select draggable-post-element",initialize:function(t){this.options=t,this.title=t.title,this.slug=this.title.toLowerCase().replace(" ","_"),this.Model=y,this.View=v[this.slug]?v[this.slug]:r,this.Settings=c},add_element:function(){var t=new this.Model({properties:{type:"PostPart_"+this.slug+"Model",view_class:"PostPart_"+this.slug+"View",has_settings:1,id_slug:"PostPart_"+this.slug,postPart:this.slug}}),e=new Upfront.Models.Module({name:"",properties:[{name:"element_id",value:Upfront.Util.get_unique_id("module")},{name:"class",value:"c10 post-part"},{name:"has_settings",value:0},{name:"row",value:Upfront.Util.height_to_row(100)}],objects:[t]});this.add_module(e)}}),p={type:"Button",compact:!0,on_click:function(){Upfront.Events.trigger("post:edit:templatepart",this.model.tpl,this.model.get_property_value_by_name("postPart"))},label:"Edit markup"},l=n.extend({settings:[{type:"SettingsItem",fields:[p]}]}),d=l.extend({label:"date",settings:[{type:"SettingsItem",title:"Date",fields:[{type:"Text",label:Upfront.Settings.l10n.global.content.php_date_fmt,property:"format"},p]}],title:"Date"}),h=l.extend({label:"tag",settings:[{type:"SettingsItem",title:"Tag",fields:[{type:"Text",label:Upfront.Settings.l10n.global.content.tag_separator,property:"tag_separator"},p]}],title:"Tag"}),u=l.extend({label:"content",settings:[{type:"SettingsItem",title:"Content",fields:[{type:"Number",label:Upfront.Settings.l10n.global.content.left,property:"padding_left",min:0,step:1},{type:"Number",label:Upfront.Settings.l10n.global.content.right,property:"padding_right",min:0,step:1},p]}],title:"Content"}),c=o.extend({initialize:function(){var t=this.model.get_property_value_by_name("postPart");this.panels=t&&this.raw_panels[t]?{General:this.raw_panels[t]}:this.raw_panels,o.prototype.initialize.apply(this,arguments)},raw_panels:{date:d,tags:h,contents:u,title:l.extend({label:"title",title:"Title"}),featured_image:l.extend({label:"featured_image",title:"Featured Image"}),author:l.extend({label:"author",title:"Author"}),author_gravatar:l.extend({label:"gravatar",title:"Gravatar"}),comments_count:l.extend({label:"comments_count",title:"Count"}),categories:l.extend({label:"categories",title:"Categories"})}}),f=r.extend({updateOptions:function(){var t=this.model.get("properties").toJSON(),e={},i=this.postView.partOptions,s=["","row","type","view_class","has_settings","id_slug","postPart","element_id"];_.isArray(i)&&(i={}),_.each(t,function(t){-1==s.indexOf(t.name)&&(e[t.name]=t.value)});e.overflow_left||0,e.overflow_right||0;i[this.postPart]=e,i.colSize=Upfront.Behaviors.GridEditor.col_size,this.postView.partOptions=i,this.updatePartContent(),this.$(".upfront-object-content").html("Loading")},render:function(){r.prototype.render.apply(this,arguments),this.paddingChangeHandler||(this.paddingChangeHandler=_.bind(this.refreshPaddings,this),Upfront.Events.on("post:padding:update",this.paddingChangeHandler)),this.refreshPaddingsFromProperties()},refreshPaddingsFromProperties:function(){this.refreshPaddings(this.property("padding_left")||0,this.property("padding_right")||0)},refreshPaddings:function(e,i){var s=Upfront.Behaviors.GridEditor,o=s.col_size,n=i>0?i*o:15,r=e>0?e*o:15,a=t(".upfront-region-postlayouteditor").find(".upfront-post-padding"),p=".upfront-region-postlayouteditor .upfront-output-PostPart_contents {";t(".upfront-region-postlayouteditor .upfront-output-PostPart_contents");a.length||(a=t('<style class="upfront-post-padding"></style>'),setTimeout(function(){t(".upfront-region-postlayouteditor").append(a)},200)),p+="padding-left: "+r+"px; padding-right: "+n+"px;}",p+=".upfront-region-postlayouteditor  .upfront-output-PostPart_contents .ueditor-insert-variant {",p+=" margin-left: "+-1*r+"px; margin-right: "+-1*n+"px; }",a.html(p)}}),g=r.extend({sizehintTpl:_.template(t(s).find("#sizehint-tpl").html()),init:function(t){this.partOptions=this.postView.partOptions.featured_image||{}},on_render:function(){var e=this,i=this.moduleId||this.parent_module_view.model.get_property_value_by_name("element_id"),s=this.partOptions.height||100,o=this.parent_module_view;this.moduleId=i,this.moduleView=o.$("#"+i),this.placeholder||(this.placeholder=t('<div class="upfront-post-thumb-placeholder upfront-ui"><div>'+Upfront.Settings.l10n.global.content.post_featured_image+"</div></div>"),s&&this.placeholder.height(s)),this.$(".upfront-content-marker").replaceWith(this.placeholder),s||this.resizePlaceholder(),o.$("#style-"+this.cid).length||o.$el.append('<style id="style-'+this.cid+'">#'+i+" div{ height: 100%; }</style>"),this.resizePlaceholderCallback||(this.resizePlaceholderCallback=_.bind(this.resizePlaceholder,this)),this.moduleView.off("resizestop",e.resizePlaceholderCallback).off("resize",e.resizePlaceholderCallback).on("resize",e.resizePlaceholderCallback).on("resizestop",e.resizePlaceholderCallback),this.update_size_hint()},resizePlaceholder:function(e){this.placeholder.height(this.moduleView.height());var i=t(".upfront-resize").height();e&&"resizestop"==e.type&&(this.model.set_property("height",i,!0),this.model.set_property("attributes",{style:"max-height: "+i+"px"}),this.partOptions.height=i),this.update_size_hint(i)},update_size_hint:function(e){e="undefined"==typeof e?this.property("height"):e;var i=this.$(".upfront-editable_entity").width()?this.$(".upfront-editable_entity").width():"100%";i="100%"!==i?Upfront.Util.grid.normalize_width(i):i;var s=t("<div>").addClass("upfront-ui uimage-resize-hint sizehint-top featured-image-sizehint").html(this.sizehintTpl({width:i,height:e}));this.placeholder.closest(".upfront-object-view").append(s)}}),m=r.extend({init:function(t){this.partOptions=this.postView.partOptions.date||{}},on_render:function(){var t=this,e=this.moduleId||this.parent_module_view.model.get_property_value_by_name("element_id"),i=this.partOptions.height||30,s=this.parent_module_view;this.moduleId=e,this.moduleView=s.$("#"+e),this.moduleView.height(i),this.update_attributes_callback||(this.update_attributes_callback=_.bind(this.update_attributes,this)),this.moduleView.off("resizestop",t.update_attributes_callback).off("resize",t.update_attributes_callback).on("resize",t.update_attributes_callback).on("resizestop",t.update_attributes_callback)},update_attributes:function(e){if(e&&"resizestop"==e.type){var i=t(".upfront-resize").height();this.model.set_property("height",i,!0),this.model.set_property("attributes",{style:"min-height: "+i+"px"}),this.partOptions.height=i}}}),v={contents:f,featured_image:g,date:m},b=(Upfront.Views.Editor.Field.Field.extend({events:{"click .upfront-template-edit":"prepareTemplateEditor"},render:function(){return this.$el.html('<a href="#" title="Edit template" class="upfront-css-edit upfront-template-edit">'+Upfront.Settings.l10n.global.content.edit_html_tpl+"</a>"),this},prepareTemplateEditor:function(t){t.preventDefault(),Upfront.Events.trigger("post:edit:templatepart",this.model.tpl,this.model.get_property_value_by_name("postPart"))}}),Backbone.View.extend({events:{"click button":"save","click .upfront-css-close":"cancel"},initialize:function(){var e=t("#upfront_code-editor"),i=t.Deferred();e.length||(e=t('<section id="upfront_code-editor" class="upfront-ui upfront_code-editor upfront_code-editor-complex upfront-css-no-sidebar"></section>')),this.setElement(e),this.prepareAce=i.promise(),require([Upfront.Settings.ace_url],function(){i.resolve()}),this.editor=e},open:function(t){var e=this;e.tpl=t.tpl,e.postPart=t.postPart,this.prepareAce.then(function(){e.ace?(e.ace.getSession().setValue(e.tpl),e.$el.show()):e.render()})},render:function(){var e=this,i=t('<div class="upfront-css-resizable"></div>'),s=this.editor;s.detach(),i.html('<div class="upfront-css-top"><span class="upfront-css-type">'+this.postPart+' Part Template</span><a class="upfront-css-close" href="#">close</a></div>'),i.append('<div class="upfront-css-body"><div class="upfront_code-editor-section upfront_code-markup active"><div class="upfront-css-ace"></div></div><button>'+Upfront.Settings.l10n.global.content.save+"</button></div>"),this.resizeHandler=this.resizeHandler||function(){s.width(t(window).width()-t("#sidebar-ui").width()-1)},t(window).on("resize",this.resizeHandler),this.resizeHandler(),t("body").append(s.append(i).show());var o=s.height()-s.find(".upfront-css-top").outerHeight();s.find(".upfront-css-body").height(o);var n=ace.edit(s.find(".upfront-css-ace")[0]),r=n.getSession();r.setUseWorker(!1),n.setShowPrintMargin(!1),r.setMode("ace/mode/html"),n.setTheme("ace/theme/monokai"),n.setShowPrintMargin(!1),r.setValue(this.tpl),n.on("change",function(t){e.timer&&clearTimeout(e.timer),e.timer=setTimeout(function(){console.log("esso")},1e3),e.trigger("change",n)}),n.focus(),this.ace=n,this.startResizable()},startResizable:function(){var e=this.editor,i=this,s=e.find(".upfront-css-body"),o=e.find(".upfront-css-top").outerHeight(),n=e.find(".upfront-css-selectors"),r=e.find(".upfront-css-save-form"),a=function(a,p){var l=p?p.size.height:e.find(".upfront-css-resizable").height(),d=l-o;s.height(d),i.ace&&i.ace.resize(),n.height(d-r.outerHeight()),t("#page").css("padding-bottom",l)};a(),e.find(".upfront-css-resizable").resizable({handles:{n:".upfront-css-top"},resize:a,minHeight:200,delay:100})},save:function(){this.trigger("save",this.ace.getSession().getValue(),this.postPart)},cancel:function(t){t.preventDefault(),this.trigger("cancel")},close:function(){this.postPart=!1,this.tpl=!1,this.$el.hide()},destroy:function(){this.ace.destroy(),this.remove()}})),y=Upfront.Models.ObjectModel.extend({initialize:function(t){var e=t.properties;e.element_id||(e.element_id=Upfront.Util.get_unique_id(e.id_slug+"-object")),this.set("properties",new Upfront.Collections.Properties({})),this.init_properties(e),"function"==typeof this.init&&this.init.apply(this,arguments)}}),w=Backbone.View.extend({tpl:_.template(t(i).find("#save-dialog-tpl").html()),attributes:{id:"upfront-save-dialog-background"},events:{"click #upfront-save-dialog":"save",click:"close"},initialize:function(t){this.options=t},render:function(){return t("#upfront-save-dialog-background").length?void 0:(this.$el.html(this.tpl(this.options)),t("body").append(this.$el),this.$el.width(t(window).width()).height(t(document).height()),this)},save:function(e){e.preventDefault();var i=t(e.target);i.hasClass("upfront-save-button")&&this.trigger("save",i.data("save-as"))},close:function(t){if(!t||!t.isDefaultPrevented()){var e=this;this.$el.fadeOut("fast",function(){e.$el.detach(),e.trigger("closed")})}},save_dialog:function(e,i){t("body").append("<div id='upfront-save-dialog-background' />"),t("body").append("<div id='upfront-save-dialog' />");var s=t("#upfront-save-dialog"),o=t("#upfront-save-dialog-background"),n=(Upfront.Application.layout.get("current_layout"),"");o.width(t(window).width()).height(t(document).height()),n+="<p>"+Upfront.Settings.l10n.global.content.save_layout_nag+"</p>",t.each(_upfront_post_data.layout,function(t,e){"type"!=t&&(n+='<span class="upfront-save-button" data-save-as="'+e+'">'+Upfront.Settings.LayoutEditor.Specificity[t]+"</span>")}),s.html(n),t("#upfront-save-dialog").on("click",".upfront-save-button",function(){var n=t(this).attr("data-save-as");return o.remove(),s.remove(),e.apply(i,[n]),!1}),t("#upfront-save-dialog-background").on("click",function(){return o.remove(),s.remove(),!1})}});Upfront.Views.Editor.SaveDialog=w;var P=new Upfront.Collections.ImageVariants(Upfront.mainData.postImageVariants),z=new Upfront.Collections.ImageVariants(Upfront.mainData.prevPostImageVariants),U=new Upfront.Collections.ImageVariants(Upfront.mainData.otherPostImageVariants);return Upfront.Content||(Upfront.Content={}),_.extend(Upfront.Content,{PostElement:a,TemplateEditor:b,PostPart:y,ImageVariants:P,PrevImageVariants:z,OtherImageVariants:U}),{}})}(jQuery);