(function(e){define(["upfront/post-editor/upfront-post-content","text!upfront/templates/popup.html"],function(t,n){var r=Upfront.Views.ObjectView.extend({initialize:function(e){var t=this,n=this.model.get_property_value_by_name("postPart");this.postPart=n,this.listenTo(Upfront.Events,"entity:resize_start",this.close_settings),this.listenTo(Upfront.Events,"entity:drag_start",this.close_settings),this.postView=Upfront.Application.PostLayoutEditor.postView,this.postView.partOptions&&this.postView.partOptions[this.postPart]&&_.each(this.postView.partOptions[this.postPart],function(e,n){t.model.set_property(n,e,!0)}),this.listenTo(this.model.get("properties"),"change add remove",this.updateOptions),this.listenTo(this.postView.model,"template:"+n,this.refreshTemplate),_upfront_post_data&&(this.post=Upfront.data.posts[_upfront_post_data.post_id]),this.tpl=this.getTemplate(),this.model.tpl=this.tpl,typeof this.init=="function"&&this.init.apply(this,arguments)},get_content_markup:function(){console.log(this.property("postPart"));var e=this.property("postPart"),n=t.getMarkupper(),r=this.getTemplate(),i=Upfront.Application.PostLayoutEditor.partMarkup,s=n.markup(e,i,r);return s?s:(this.updatePartContent(),"Loading")},on_render:function(){var e=this.postView.partOptions,t=e[this.property("postPart")]||{};t.extraClasses&&this.$(".upfront-object").addClass(t.extraClasses),Upfront.Events.trigger("post:layout:partrendered",this)},updateOptions:function(){var e=this.model.get("properties").toJSON(),t={},n=this.postView.partOptions,r=["","row","type","view_class","has_settings","id_slug","postPart","element_id"];_.isArray(n)&&(n={}),_.each(e,function(e){r.indexOf(e.name)==-1&&(t[e.name]=e.value)}),n[this.postPart]=t,this.postView.partOptions=n,this.updatePartContent(),this.$(".upfront-object-content").html("Loading")},updatePartContent:function(){var e=this,t=this.postView.partOptions||{},n={action:"content_part_markup",post_id:this.postView.editor.postId?this.postView.editor.postId:this.post.id,parts:JSON.stringify([{slug:this.postPart,options:t[this.postPart]||{}}]),templates:{}};n.templates[this.postPart]=this.getTemplate(),Upfront.Util.post(n).done(function(t){_.extend(Upfront.Application.PostLayoutEditor.partMarkup,t.data.replacements),e.render()})},getTemplate:function(){var e=this.postView.partTemplates,t=this.postPart;return t=="contents"&&this.postView.property("content_type")=="excerpt"&&(t="excerpt"),e&&e[t]?e[t]:Upfront.data.thisPost.templates[t]},refreshTemplate:function(){this.model.tpl=this.getTemplate(),this.render()},property:function(e,t,n){return typeof t!="undefined"?(typeof n=="undefined"&&(n=!0),this.model.set_property(e,t,n)):this.model.get_property_value_by_name(e)}}),i=Upfront.Views.Editor.Sidebar.Element.extend({className:"draggable-element upfront-no-select draggable-post-element",initialize:function(e){console.log("initializing element"),this.options=e,this.title=e.title,this.slug=this.title.toLowerCase().replace(" ","_"),this.Model=g,this.View=d[this.slug]?d[this.slug]:r,this.Settings=p[this.slug]?p[this.slug]:u},add_element:function(){var e=new this.Model({properties:{type:"PostPart_"+this.slug+"Model",view_class:"PostPart_"+this.slug+"View",has_settings:1,id_slug:"PostPart_"+this.slug,postPart:this.slug}}),t=new Upfront.Models.Module({name:"",properties:[{name:"element_id",value:Upfront.Util.get_unique_id("module")},{name:"class",value:"c10 post-part"},{name:"has_settings",value:0},{name:"row",value:Upfront.Util.height_to_row(100)}],objects:[e]});this.add_module(t)}}),s=Upfront.Views.Editor.Settings,o=Upfront.Views.Editor.Field,u=s.Settings.extend({has_tabs:!1,initialize:function(e){this.options=e,this.cssEditor=!1,this.postPart=this.model.get_property_value_by_name("postPart"),typeof this.init=="function"&&this.init(e),this.updatePanels()},updatePanels:function(){var e=new Upfront.Views.Editor.Settings.Item({title:"General setup",model:this.model,fields:[new v({model:this.model})]});this.panels?this.panels.first().settings.push(e):this.panels=_([new s.Panel({label:"General",model:this.model,settings:[e]})])}}),a=u.extend({init:function(e){this.panels=_([new s.Panel({hide_common_fields:!0,title:"Date format",model:this.model,settings:[new Upfront.Views.Editor.Settings.Item({title:"Date setup",model:this.model,fields:[new o.Text({label:"PHP date format",property:"format",model:this.model})]})]})])}}),f=u.extend({init:function(e){this.panels=_([new s.Panel({hide_common_fields:!0,title:"Tags",model:this.model,settings:[new Upfront.Views.Editor.Settings.Item({title:"Tags settings",model:this.model,fields:[new o.Text({label:"Tags separator",property:"tag_separator",model:this.model})]})]})])}}),l=u.extend({events:{"keyup .upfront-field-number":"offsetChanged","change .upfront-field-number":"updatePadding"},init:function(e){this.panels=_([new s.Panel({hide_common_fields:!0,title:"Tags",model:this.model,settings:[new Upfront.Views.Editor.Settings.Item({title:"Content padding",className:"content-overflow-setting",model:this.model,fields:[new o.Number({label:"Left",property:"padding_left",max:3,min:0,step:1,model:this.model}),new o.Number({label:"Right",property:"padding_right",max:3,min:0,step:1,model:this.model})]})]})])},offsetChanged:function(e){var t=e.target;if(isNaN(parseInt(t.value))||t.value<0||t.value>3)Upfront.Views.Editor.notify("Content padding needs to be an number between 0 and 3.","error"),t.value=0;this.updatePadding()},updatePadding:function(){var e=this.$("input[name=padding_left]").val()||0,t=this.$("input[name=padding_right]").val()||0;this.for_view&&this.for_view.trigger("post:padding:update",e,t)}}),c=r.extend({updateOptions:function(){var e=this.model.get("properties").toJSON(),t={},n=this.postView.partOptions,r=["","row","type","view_class","has_settings","id_slug","postPart","element_id"];_.isArray(n)&&(n={}),_.each(e,function(e){r.indexOf(e.name)==-1&&(t[e.name]=e.value)});var i=t.overflow_left||0,s=t.overflow_right||0;n[this.postPart]=t,n.colSize=Upfront.Behaviors.GridEditor.col_size,this.postView.partOptions=n,this.updatePartContent(),this.$(".upfront-object-content").html("Loading")},render:function(){r.prototype.render.apply(this,arguments),this.paddingChangeHandler||(this.paddingChangeHandler=_.bind(this.refreshPaddings,this),this.on("post:padding:update",this.paddingChangeHandler)),this.refreshPaddingsFromProperties()},refreshPaddingsFromProperties:function(){this.refreshPaddings(this.property("padding_left")||0,this.property("padding_right")||0)},refreshPaddings:function(t,n){var r=Upfront.Behaviors.GridEditor.col_size,i=n*r,s=t*r,o=e(".upfront-region-postlayouteditor").find(".upfront-post-padding"),u=".upfront-region-postlayouteditor .upfront-output-PostPart_contents>* {";o.length||(o=e('<style class="upfront-post-padding"></style>'),setTimeout(function(){e(".upfront-region-postlayouteditor").append(o)},200)),u+="padding-left: "+s+"px; padding-right: "+i+"px;}",o.html(u)}}),h=r.extend({init:function(e){this.partOptions=this.postView.partOptions.featured_image||{}},on_render:function(){var t=this,n=this.moduleId||this.parent_module_view.model.get_property_value_by_name("element_id"),r=this.partOptions.height||100,i=this.parent_module_view;this.moduleId=n,this.moduleView=i.$("#"+n),this.placeholder||(this.placeholder=e('<div class="upfront-post-thumb-placeholder upfront-ui"><div>Post Featured Image</div></div>'),r&&this.placeholder.height(r)),this.$(".upfront-content-marker").replaceWith(this.placeholder),r||this.resizePlaceholder(),i.$("#style-"+this.cid).length||i.$el.append('<style id="style-'+this.cid+'">#'+n+" div{ height: 100%; }</style>"),this.resizePlaceholderCallback||(this.resizePlaceholderCallback=_.bind(this.resizePlaceholder,this)),this.moduleView.off("resizestop",t.resizePlaceholderCallback).off("resize",t.resizePlaceholderCallback).on("resize",t.resizePlaceholderCallback).on("resizestop",t.resizePlaceholderCallback)},resizePlaceholder:function(t){this.placeholder.height(this.moduleView.height());if(t&&t.type=="resizestop"){var n=e(".upfront-resize").height();this.model.set_property("height",n,!0),this.model.set_property("attributes",{style:"max-height: "+n+"px"}),this.partOptions.height=n}}}),p={date:a,tags:f,contents:l},d={contents:c,featured_image:h},v=Upfront.Views.Editor.Field.Field.extend({events:{"click .upfront-template-edit":"prepareTemplateEditor"},render:function(){return this.$el.html('<a href="#" title="Edit template" class="upfront-css-edit upfront-template-edit">Edit HTML template</a>'),this},prepareTemplateEditor:function(e){e.preventDefault(),Upfront.Events.trigger("post:edit:templatepart",this.model.tpl,this.model.get_property_value_by_name("postPart"))}}),m=Backbone.View.extend({events:{"click button":"save","click .upfront-css-close":"cancel"},initialize:function(){var t=e("#upfront_code-editor"),n=e.Deferred();t.length||(t=e('<section id="upfront_code-editor" class="upfront-ui upfront_code-editor upfront_code-editor-complex upfront-css-no-sidebar"></section>')),this.setElement(t),this.prepareAce=n.promise(),require(["//cdnjs.cloudflare.com/ajax/libs/ace/1.1.01/ace.js"],function(){n.resolve()}),this.editor=t},open:function(e){var t=this;t.tpl=e.tpl,t.postPart=e.postPart,this.prepareAce.then(function(){t.ace?(t.ace.getSession().setValue(t.tpl),t.$el.show()):t.render()})},render:function(){var t=this,n=e('<div class="upfront-css-resizable"></div>'),r=this.editor;r.detach(),n.html('<div class="upfront-css-top ui-resizable-handle ui-resizable-n"><span class="upfront-css-type">'+this.postPart+' Part Template</span><a class="upfront-css-close" href="#">close</a></div>'),n.append('<div class="upfront-css-body"><div class="upfront_code-editor-section upfront_code-markup active"><div class="upfront-css-ace"></div></div><button>Save</button></div>'),this.resizeHandler=this.resizeHandler||function(){r.width(e(window).width()-e("#sidebar-ui").width()-1)},e(window).on("resize",this.resizeHandler),this.resizeHandler(),e("body").append(r.append(n).show());var i=r.height()-r.find(".upfront-css-top").outerHeight();r.find(".upfront-css-body").height(i);var s=ace.edit(r.find(".upfront-css-ace")[0]),o=s.getSession();o.setUseWorker(!1),s.setShowPrintMargin(!1),o.setMode("ace/mode/html"),s.setTheme("ace/theme/monokai"),s.setShowPrintMargin(!1),o.setValue(this.tpl),s.on("change",function(e){t.timer&&clearTimeout(t.timer),t.timer=setTimeout(function(){console.log("esso")},1e3),t.trigger("change",s)}),s.focus(),this.ace=s,this.startResizable()},startResizable:function(){var t=this.editor,n=this,r=t.find(".upfront-css-body"),i=t.find(".upfront-css-top").outerHeight(),s=t.find(".upfront-css-selectors"),o=t.find(".upfront-css-save-form"),u=function(u,a){var f=a?a.size.height:t.find(".upfront-css-resizable").height(),l=f-i;r.height(l),n.ace&&n.ace.resize(),s.height(l-o.outerHeight()),e("#page").css("padding-bottom",f)};u(),t.find(".upfront-css-resizable").resizable({handles:{n:".upfront-css-top"},resize:u,minHeight:200,delay:100})},save:function(){this.trigger("save",this.ace.getSession().getValue(),this.postPart)},cancel:function(e){e.preventDefault(),this.trigger("cancel")},close:function(){this.postPart=!1,this.tpl=!1,this.$el.hide()},destroy:function(){this.ace.destroy(),this.remove()}}),g=Upfront.Models.ObjectModel.extend({initialize:function(e){var t=e.properties;t.element_id||(t.element_id=Upfront.Util.get_unique_id(t.id_slug+"-object")),this.set("properties",new Upfront.Collections.Properties({})),this.init_properties(t),typeof this.init=="function"&&this.init.apply(this,arguments)}}),y=Backbone.View.extend({tpl:_.template(e(n).find("#save-dialog-tpl").html()),attributes:{id:"upfront-save-dialog-background"},events:{"click #upfront-save-dialog":"save",click:"close"},initialize:function(e){this.options=e},render:function(){if(e("#upfront-save-dialog-background").length)return;return this.$el.html(this.tpl(this.options)),e("body").append(this.$el),this.$el.width(e(window).width()).height(e(document).height()),this},save:function(t){t.preventDefault();var n=e(t.target),r;if(!n.hasClass("upfront-save-button"))return;this.trigger("save",n.data("save-as"))},close:function(e){if(e&&e.isDefaultPrevented())return;var t=this;this.$el.fadeOut("fast",function(){t.$el.detach(),t.trigger("closed")})},save_dialog:function(t,n){e("body").append("<div id='upfront-save-dialog-background' />"),e("body").append("<div id='upfront-save-dialog' />");var r=e("#upfront-save-dialog"),i=e("#upfront-save-dialog-background"),s=Upfront.Application.layout.get("current_layout"),o="";i.width(e(window).width()).height(e(document).height()),o+="<p>Do you wish to save layout just for this post or apply it to all posts?</p>",e.each(_upfront_post_data.layout,function(e,t){if(e=="type")return;o+='<span class="upfront-save-button" data-save-as="'+t+'">'+Upfront.Settings.LayoutEditor.Specificity[e]+"</span>"}),r.html(o),e("#upfront-save-dialog").on("click",".upfront-save-button",function(){var s=e(this).attr("data-save-as");return i.remove(),r.remove(),t.apply(n,[s]),!1}),e("#upfront-save-dialog-background").on("click",function(){return i.remove(),r.remove(),!1})}});return Upfront.Views.Editor.SaveDialog=y,Upfront.Content||(Upfront.Content={}),_.extend(Upfront.Content,{PostElement:i,TemplateEditor:m,PostPart:g}),{}})})(jQuery);