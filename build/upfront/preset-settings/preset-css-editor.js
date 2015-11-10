(function(e){define(["text!upfront/templates/popup.html"],function(t){var n=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views,r=Backbone.View.extend({className:"upfront-ui",id:"upfront-csseditor",tpl:_.template(e(t).find("#csseditor-tpl").html()),prepareAce:!1,ace:!1,events:{"click .upfront-css-save-ok":"save","click .upfront-css-close":"close","click .upfront-css-theme_image":"openThemeImagePicker","click .upfront-css-media_image":"openImagePicker","click .upfront-css-font":"startInsertFontWidget","click .upfront-css-selector":"addSelector","click .upfront-css-type":"scrollToElement","mouseenter .upfront-css-selector":"hiliteElement","mouseleave .upfront-css-selector":"unhiliteElement"},elementTypes:{UaccordionModel:{label:n.accordion,id:"accordion"},UcommentModel:{label:n.comments,id:"comment"},UcontactModel:{label:n.contact_form,id:"contact"},UgalleryModel:{label:n.gallery,id:"gallery",preset_container:"inline"},UimageModel:{label:n.image,id:"image"},LoginModel:{label:n.login,id:"upfront-login_element"},LikeBox:{label:n.like_box,id:"Like-box-object"},MapModel:{label:n.map,id:"upfront-map_element"},UnewnavigationModel:{label:n.navigation,id:"nav",preset_container:"inline"},ButtonModel:{label:n.button,id:"button",preset_container:"inline"},PostsModel:{label:n.posts,id:"posts"},UsearchModel:{label:n.search,id:"search"},USliderModel:{label:n.slider,id:"slider"},SocialMediaModel:{label:n.social,id:"SocialMedia"},UtabsModel:{label:n.tabs,id:"tab",preset_container:"inline"},ThisPageModel:{label:n.page,id:"this_page"},ThisPostModel:{label:n.post,id:"this_post"},UwidgetModel:{label:n.widget,id:"widget"},UyoutubeModel:{label:n.youtube,id:"youtube"},PlainTxtModel:{label:n.text,id:"text",preset_container:"inline"}},initialize:function(t){var n=this,r=e.Deferred(),i,s;this.options=t||{},this.model=t.model,this.sidebar=t.sidebar!==!1,this.global=t.global===!0,this.prepareAce=r.promise(),require(["//cdnjs.cloudflare.com/ajax/libs/ace/1.1.01/ace.js"],function(){r.resolve()}),this.resizeHandler=this.resizeHandler||function(){n.$el.width(e(window).width()-e("#sidebar-ui").width()-1)},e(window).on("resize",this.resizeHandler),this.modelType=this.options.model.get_property_value_by_name("type"),this.elementType=this.elementTypes[this.modelType]||{label:"Unknown",id:"unknown"},i=this.options.preset.get("id"),s=e("#"+i),s.length===0?(this.$style=e('<style id="'+i+'"></style>'),e("body").append(this.$style)):this.$style=s,this.createSelectors(Upfront.Application.LayoutEditor.Objects),this.selectors=this.elementSelectors[this.modelType]||{},this.element_id=t.element_id?t.element_id:this.model.get_property_value_by_name("element_id"),typeof t.change=="function"&&this.listenTo(this,"change",t.change),this.render(),this.startResizable()},close:function(t){t&&t.preventDefault(),e(window).off("resize",this.resizeHandler),this.editor&&this.editor.destroy(),e("#page").css("padding-bottom",0),this.remove()},render:function(){var t=this;e("#page").append(this.$el),this.sidebar?this.$el.removeClass("upfront-css-no-sidebar"):this.$el.addClass("upfront-css-no-sidebar"),this.$el.html(this.tpl({name:this.stylename,elementType:this.elementType.label,selectors:this.selectors,show_style_name:!1,showToolbar:!0})),this.resizeHandler(".");var n=this.$el.height()-this.$(".upfront-css-top").outerHeight();this.$(".upfront-css-body").height(n),this.prepareAce.done(function(){t.startAce()}),this.prepareSpectrum(),this.$el.show()},startAce:function(){var t=this,n=ace.edit(this.$(".upfront-css-ace")[0]),r=n.getSession();r.setUseWorker(!1),n.setShowPrintMargin(!1),r.setMode("ace/mode/css"),n.setTheme("ace/theme/monokai"),n.on("change",function(r){var i,s=n.getValue().split("}"),o="\n\n"+t.get_css_selector();typeof t.elementType.preset_container=="undefined"&&(o+=" "),s=_.map(s,function(t){return e.trim(t)}),s.pop(),i=t.stylesAddSelector(e.trim(n.getValue()),"#page "+t.get_css_selector()),i=i.replace(new RegExp(t.get_css_selector()+" .upfront-button","g"),t.get_css_selector()+".upfront-button"),t.$style.html(i),t.trigger("change",i)});var i=this.options.preset.get("preset_style")?this.options.preset.get("preset_style"):"";scope=new RegExp(this.get_css_selector()+"\\s*","g"),i=i.replace(new RegExp("#page "+this.get_css_selector()+"\\s*","g"),""),i=i.replace(scope,""),i=i.replace(/\\'/g,"'"),i=i.replace(/\\'/g,"'"),i=i.replace(/\\'/g,"'"),i=i.replace(/\\"/g,'"'),i=i.replace(/\\"/g,'"'),i=i.replace(/\\"/g,'"'),i=Upfront.Util.colors.convert_string_color_to_ufc(i.replace(/div#page .upfront-region-container .upfront-module/g,"#page")),n.setValue(e.trim(i),-1),n.renderer.scrollBar.width=5,n.renderer.scroller.style.right="5px",n.focus(),this.editor=n},prepareSpectrum:function(){var e=this,t=new Upfront.Views.Editor.Field.Color({default_value:"#ffffff",showAlpha:!0,showPalette:!0,maxSelectionSize:9,localStorageKey:"spectrum.recent_bgs",preferredFormat:"hex",chooseText:"Ok",showInput:!0,allowEmpty:!0,autohide:!1,spectrum:{show:function(){},choose:function(t){var n=t.alpha<1?t.toRgbString():t.toHexString();e.editor.insert(n),e.editor.focus()}}});t.render(),e.$(".upfront-css-color").html(t.el)},createSelectors:function(e){var t=this,n={};_.each(e,function(e){n[e.cssSelectorsId]=e.cssSelectors||{}}),t.elementSelectors=n},createSelector:function(e,t,n){var r=new e,i=new t({model:r});this.elementSelectors[n]=i.cssSelectors||{},i.remove()},startResizable:function(){var t=this,n=t.$(".upfront-css-body"),r=0,i=t.$(".upfront-css-selectors"),s=t.$(".upfront-css-save-form"),o=this.$(".upfront-css-resizable"),u=function(u,a){var f=a?a.size.height:t.$(".upfront-css-resizable").height(),l=f-r;n.height(l),t.editor&&t.editor.resize(),i.height(l-s.outerHeight()),o.css({width:"",height:"",left:"",top:""}),e("#page").css("padding-bottom",f)};o.find(".upfront-css-top").removeClass("ui-resizable-handle").addClass("ui-resizable-handle").removeClass("ui-resizable-n").addClass("ui-resizable-n"),r=t.$(".upfront-css-top").outerHeight(),u(),o.resizable({handles:{n:".upfront-css-top"},resize:u,minHeight:200,delay:100})},remove:function(){Backbone.View.prototype.remove.call(this),e(window).off("resize",this.resizeHandler)},openThemeImagePicker:function(){this._open_media_popup({themeImages:!0})},openImagePicker:function(){this._open_media_popup()},_open_media_popup:function(e){e=_.isObject(e)?e:{};var t=this,n=_.extend({},e);Upfront.Media.Manager.open(n).done(function(e,n){Upfront.Events.trigger("upfront:element:edit:stop");if(!n)return;var r=n.models[0],i=r.get("image")?r.get("image"):n.models[0],s="src"in i?i.src:"get"in i?i.get("original_url"):!1;t.editor.insert('url("'+s+'")'),t.editor.focus()})},startInsertFontWidget:function(){var t=new i({editor:this.editor,collection:Upfront.Views.Editor.Fonts.theme_fonts_collection});e("#insert-font-widget").html(t.render().el)},scrollToElement:function(){var t=e("#"+this.element_id);if(!t.length)return;var n=t.offset().top-50;e(document).scrollTop(n>0?n:0),this.blink(t,4)},hiliteElement:function(t){var n=this.get_css_selector();typeof this.elementType.preset_container=="undefined"&&(n+=" ");var r=n+e(t.target).data("selector");if(!r.length)return;var i=e("#"+this.element_id);i.find(r).addClass("upfront-css-hilite")},unhiliteElement:function(t){var n=this.get_css_selector();typeof this.elementType.preset_container=="undefined"&&(n+=" ");var r=n+e(t.target).data("selector");if(!r.length)return;var i=e("#"+this.element_id);i.find(r).removeClass("upfront-css-hilite")},addSelector:function(t){var n=e(t.target).data("selector");this.editor.insert(n),this.editor.focus()},get_css_selector:function(){return this.is_global_stylesheet?"":"."+this.options.preset.get("id")},updateStyles:function(e){var t=this.get_style_element();Upfront.Util.Transient.push("css-"+this.element_id,t.html()),e=Upfront.Util.colors.convert_string_ufc_to_color(e),t.html(this.stylesAddSelector(e,this.is_default_style?"":"#page "+this.get_css_selector()).replace(/#page/g,"div#page .upfront-region-container .upfront-module")),this.trigger("updateStyles",this.element_id)},stylesAddSelector:function(t,n){if(this.is_global_stylesheet&&empty(n))return t;var r=this,i=t.split("}"),s="";return _.each(i,function(t){var i=e.trim(t).split("{");if(i.length!=2)return!0;var o=i[0].split(","),u=[];_.each(o,function(t){t=e.trim(t);var i=t.replace(/:[^\s]+/,""),s=i[0]==="@"||r.recursiveExistence(n,i),o=s?"":" ";u.push(""+n+o+t+"")}),s+=u.join(", ")+" {"+i[1]+"\n}\n"}),s},recursiveExistence:function(t,n){var r=n.split(" "),i=this;while(r.length>0){try{if(!!e(t+r.join(" ")).closest("#"+i.element_id).length)return!0}catch(s){}r.pop()}return!1},save:function(t){t&&t.preventDefault();var r=this,i=e.trim(this.editor.getValue()),s;return this.is_global_stylesheet===!1&&this.stylename===this.get_temp_stylename()?Upfront.Views.Editor.notify(n.style_name_nag,"error"):i?(i=this.stylesAddSelector(i,this.is_default_style?"":this.get_css_selector()),s={styles:i,elementType:this.elementType.id,global:this.global},this.options.preset.set("preset_style",s.styles),this.trigger("upfront:presets:update",this.options.preset.toJSON()),Upfront.Views.Editor.notify(n.preset_style_saved.replace(/%s/,this.elementType.id))):Upfront.Views.Editor.notify(n.style_empty_nag,"error")}}),i=Backbone.View.extend({initialize:function(e){var t=this;this.editor=e.editor,this.fields=[new Upfront.Views.Editor.Field.Typeface_Chosen_Select({label:"",compact:!0,values:Upfront.Views.Editor.Fonts.theme_fonts_collection.get_fonts_for_select(),additional_classes:"choose-typeface",select_width:"230px"}),new Upfront.Views.Editor.Field.Typeface_Style_Chosen_Select({label:"",compact:!0,values:[],additional_classes:"choose-variant",select_width:"120px"}),new Upfront.Views.Editor.Field.Button({label:n.insert_font,compact:!0,on_click:function(){t.finish()}})]},render:function(){return e("#insert-font-widget").html("").addClass("open"),this.$el.html(""),_.each(this.fields,function(e){e.render(),this.$el.append(e.el)},this),this.listenTo(this.fields[0],"changed",function(){var e=Upfront.Views.Editor.Fonts.theme_fonts_collection.get_variants(this.fields[0].get_value());this.render_variants(e)}),this.listenTo(this.fields[1],"changed",function(){this.preview_font()}),this},render_variants:function(e){var t=this.$el.find(".choose-variant select");t.find("option").remove(),t.append('<option value="">'+n.choose_variant+"</option>"),_.each(e,function(e){t.append('<option value="'+e+'">'+e+"</option>")}),t.trigger("chosen:updated")},preview_font:function(){this.replaceFont({font_family:this.fields[0].get_value(),variant:Upfront.Views.Font_Model.parse_variant(this.fields[1].get_value())})},replaceFont:function(e){var t;this.style_doc=this.editor.getSession().getDocument(),this.last_selected_font=e,this.font_family_range?this.font_family_range.end=this.end_point:this.font_family_range=this.editor.getSelection().getRange(),this.end_point=this.style_doc.replace(this.font_family_range,e.font_family),this.reset_properties(),t=[],e.variant.weight&&t.push("    font-weight: "+e.variant.weight+";"),e.variant.style&&t.push("    font-style: "+e.variant.style+";"),t.length>0&&this.style_doc.insertLines(this.font_family_range.start.row+1,t)},reset_properties:function(){var e,t,n;this.style_doc=this.editor.getSession().getDocument(),n={},e=this.font_family_range.start.row+1,t=this.style_doc.getLine(e);while(t.indexOf("}")<0){t.indexOf("font-weight")!==-1&&(n.weight=e,this.starting_weight||(this.starting_weight=t)),t.indexOf("font-style")!==-1&&(n.style=e,this.starting_style||(this.starting_style=t)),e++,t=this.style_doc.getLine(e);if(!t)break}n.weight&&n.style&&(n.weight>n.style?(this.style_doc.removeLines(n.weight,n.weight),this.style_doc.removeLines(n.style,n.style)):(this.style_doc.removeLines(n.style,n.style),this.style_doc.removeLines(n.weight,n.weight)),n.weight=!1,n.style=!1),n.weight&&this.style_doc.removeLines(n.weight,n.weight),n.style&&this.style_doc.removeLines(n.style,n.style)},finish:function(){e("#insert-font-widget").html('<a class="upfront-css-font" href="#">'+n.insert_font+"</a>").removeClass("open")}});return r})})(jQuery);