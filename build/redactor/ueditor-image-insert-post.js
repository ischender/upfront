(function(e){define(["scripts/redactor/ueditor-insert","scripts/redactor/ueditor-image-insert-base","text!scripts/redactor/ueditor-templates.html","scripts/redactor/ueditor-insert-utils"],function(t,n,r,i){var s=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.ueditor:Upfront.mainData.l10n.global.ueditor,o=n.ImageInsertBase.extend({className:"ueditor-insert upfront-inserted_image-wrapper ueditor-insert-variant ueditor-post-image-insert",tpl:_.template(e(r).find("#post-image-insert-tpl").html()),shortcode_tpl:_.template(e(r).find("#post-image-insert-shortcode-tpl").html().replace(/\s+/g," ")),init:function(e){this.$editor=e.$editor,this.controlsData=[{id:"style",type:"dialog",icon:"style",tooltip:s.style,view:this.getStyleView()},{id:"change_image",type:"simple",icon:"change_image",tooltip:s.change_image},{id:"link",type:"dialog",icon:"link",tooltip:s.link_image,view:this.getLinkView()},{id:"toggle_caption",type:"simple",icon:"caption",tooltip:s.toggle_caption,active:_.bind(this.get_caption_state,this)}],this.createControls();if(e.start)return this.start(e.start)},start:function(e){var t=this.getImageData(e);return t.id=this.data.id,t.style=this.data.get("style")||Upfront.Content.ImageVariants.first().toJSON(),t.variant_id=t.style.vid,this.data.clear({silent:!0}),this.data.set(t,{silent:!0}),this.set_selected_style(),this.render(),this},set_selected_style:function(){_.findWhere(this.controlsData,{id:"style"}).view.data.set("selected",this.data.get("variant_id"))},render:function(){var e=this.prepare_data();this.$el.html(this.tpl(e)),this.$shortcode_el=this.$(".post-images-shortcode"),this.render_shortcode(e),this.createControls(),this.controls.render();var t=this.$(".ueditor-insert-variant-group");t.append(this.controls.$el),this.make_caption_editable(),this.updateControlsPosition(),t.append('<a href="#" contenteditable="false" class="upfront-icon-button upfront-icon-button-delete ueditor-insert-remove"></a>')},prepare_data:function(){var t=_.extend({},this.defaultData,this.data.toJSON()),n=t.style;if(!n)return;t.style.label_id=t.style.label&&t.style.label.trim()!==""?"ueditor-image-style-"+t.style.label.toLowerCase().trim().replace(" ","-"):t.style.vid,t.image=this.get_proper_image(),t.linkType=="show_larger_image"&&(t.linkUrl=t.image.src),t.show_caption==0&&(t.style.image.width_cls=Upfront.Settings.LayoutEditor.Grid.class+24);var r=this.$el.find(".ueditor-insert-variant-group"),i=Upfront.Behaviors.GridEditor,s=e(".upfront-content-marker-contents"),o=parseFloat(e(".upfront-content-marker-contents>*").css("padding-left"))/i.col_size,u=parseFloat(e(".upfront-content-marker-contents>*").css("padding-right"))/i.col_size,a=Upfront.Util.grid.width_to_col(s.width(),!0),f=a-o-u,l=e(".upfront-content-marker-contents>*").width()/f;return this.$editor.hasClass("upfront-indented_content")&&(s=this.$editor,o=parseFloat(s.css("padding-left"))/i.col_size,u=parseFloat(s.css("padding-right"))/i.col_size,a=Upfront.Util.grid.width_to_col(s.width(),!0),f=a-o-u,l=s.width()/f,this.$el.attr("style","margin-left: "+o*l*-1+"px; margin-right: "+u*l*-1+"px;")),o=o?parseInt(o):0,u=u?parseInt(u):0,n&&n.group&&n.group.float&&(n.group.float=="left"&&o>0?(t.style.group.marginLeft=(o-Math.abs(n.group.margin_left))*l,t.style.group.marginRight=0):n.group.float=="right"&&u>0?(t.style.group.marginRight=(u-Math.abs(n.group.margin_right))*l,t.style.group.marginLeft=0):n.group.float=="none"&&o>0&&(t.style.group.marginLeft=(o-Math.abs(n.group.margin_left)+Math.abs(n.group.left))*l,t.style.group.marginRight=0)),t},control_events:function(){this.listenTo(this.controls,"control:ok:style",function(e,t){if(e._style){var n=e._style.toJSON();this.data.set("variant_id",n.vid),this.data.set("style",n),e.data.set("selected",n.vid)}t.close()})}}),u=n.ImageInsertBase.extend({className:"ueditor-insert upfront-inserted_image-wrapper upfront-wp-inserted_image-wrapper",tpl:_.template(e(r).find("#post-image-insert-wp-tpl").html()),shortcode_tpl:_.template(e(r).find("#post-image-insert-shortcode-wp-tpl").html()),generate_new_id:function(){return"wpinsert-"+ ++Upfront.data.ueditor.insertCount},init:function(e){this.$editor=e.$editor;if(e.start)return this.start(e.start)},prepare_controls:function(){this.controlsData=[{id:"wp_style",type:"dialog",icon:_.bind(this.get_style_icon,this),tooltip:"Style",view:this.getStyleView(),hideOkButton:!0},{id:"change_image",type:"simple",icon:"change_image",tooltip:s.change_image},{id:"link",type:"dialog",icon:"link",tooltip:"Link image",view:this.getLinkView()},{id:"toggle_caption",type:"simple",icon:"caption",tooltip:"Toggle Caption",active:_.bind(this.get_caption_state,this)}]},start:function(e){var t=this,n=t.getImageData(e);return n.id=t.data.id,n.variant_id=t.data.get("variant_id")||"alignnone",t.data.clear({silent:!0}),t.data.set(n,{silent:!0}),this.prepare_controls(),this.createControls(),this.render(),this},getImageData:function(e){if(!e)return!1;var t=e.at(0).toJSON(),n=this.getSelectedImage(t),r=_.extend({},this.wp_defaults,{attachment_id:t.ID,caption:t.post_excerpt?t.post_excerpt:"",link_url:"",image:n,style:{caption:{show:!0},wrapper:{alignment:"alignnone",width:n.width},image:{size_class:"size-"+n.selected_size}}});return r},render:function(){var e=this.data.toJSON();e.variant_id&&(e.style.wrapper.alignment=e.variant_id),this.$el.html(this.tpl(e)),this.$shortcode_el=this.$(".post-images-shortcode-wp"),this.render_shortcode(e),this.prepare_controls(),this.createControls(),this.controls.render();var t=this.$(".wp-caption");t.append(this.controls.$el),this.make_caption_editable(),this.updateControlsPosition(),t.append('<a href="#" contenteditable="false" class="upfront-icon-button upfront-icon-button-delete ueditor-insert-remove"></a>')},getStyleView:function(){if(this.styleView)return this.styleView;var e=new i.WP_PostImageStylesView({model:this.data});return this.styleView=e,e},get_caption_state:function(){return this.data.get("style").caption.show?0:1},get_style_icon:function(){var e="wp-style";return this.data&&this.data.get("style")&&(e+=" "+this.data.get("style").wrapper.alignment),e},controlEvents:function(){this.listenTo(this.controls,"control:click:toggle_caption",function(e){var t=1,n=Upfront.Util.clone(this.data.toJSON().style);this.get_caption_state()||(t=0),n.caption.show=t,this.data.set("style",n)}),this.listenTo(this.controls,"control:ok:link",function(e,t){var n=e.$("input[type=radio]:checked").val()||"do_nothing",r=n==="do_nothing"?"":e.$("input[type=text]").val(),i="";n=="show_larger_image"&&(r=this.data.get("image").src),this.data.set("link_url",r),t.close()}),this.listenTo(this.controls,"control:click:change_image",this.change_image)},get_url_type:function(e,t){var n="",r=document.createElement("a");return r.href=e,r.origin!=window.location.origin&&(n="external"),r.origin==window.location.origin&&t!=e&&(n="post"),r.origin==window.location.origin&&t==e&&(n="show_larger_image"),n}});return{PostImageInsert:o,WP_PostImageInsert:u}})})(jQuery);