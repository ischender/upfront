!function(t){upfrontrjs=window.upfrontrjs||{define:define,require:require,requirejs:requirejs},upfrontrjs.define(["upfront/post-editor/upfront-post-edit"],function(e){var i=function(){this.parts={title:{replacements:["%title%","%permalink%"],editable:["%title%"]},contents:{replacements:["%contents%","%excerpt%"],editable:["%contents%","%excerpt%"]},excerpt:{replacements:["%excerpt%"],editable:["%excerpt%"]},author:{replacements:["%author%","%author_url%","%author_meta%"],editable:["%author%"],withParameters:["%author_meta_","%avatar_"]},categories:{replacements:["%categories%"],editable:[]},tags:{replacements:["%tags%"],editable:[]},comments_count:{replacements:["%comments_count%"],editable:[]},featured_image:{replacements:["%image%","%permalink%"],editable:["%image%"]},date:{replacements:["%date%","%date_iso%"],editable:["%date%"]},update:{replacements:["%update%","%date_iso%"],editable:["%update%"]},author_gravatar:{replacements:["%avatar_%"],editable:["%avatar%"],withParameters:["%avatar_"]}},this.markup=function(t,e,i,n){var a=this,r=n&&n.extraClasses?n.extraClasses:"",s=n&&n.attributes?n.attributes:{},o="";if(_.each(s,function(t,e){o+=e+'="'+t+'" '}),this.parts[t]&&this.parts[t].replacements&&_.each(this.parts[t].replacements,function(n){var s=e[n];a.parts[t].editable.indexOf(n)!==-1&&(s='<div class="upfront-content-marker upfront-content-marker-'+t+" "+r+'" '+o+">"+s+"</div>"),i=i.replace(n,s)}),this.parts[t]&&this.parts[t].withParameters){var p=this.parts[t].withParameters;p&&_.each(p,function(t){var n=new RegExp(t+"[^%]+%","gm"),a=n.exec(i);_.each(a,function(t){i="undefined"==typeof e[t]?"":i.replace(t,e[t])})})}return i}},n=new i,a=function(t){this.post=t.post,this.currentData={title:this.post.get("post_title"),content:this.post.get("post_content"),excerpt:this.post.get("post_excerpt"),author:this.post.get("post_author"),date:this.post.get("post_date")},this.inserts=this.post.meta.getValue("_inserts_data")||{},_.extend(this,Backbone.Events)},r=Backbone.View.extend({events:{"click a":"preventLinkNavigation",dblclick:"triggerEditor"},type:"",canTriggerEdit:!1,initialize:function(t){this.parent=t.parent,this.parentModel=t.parentModel,this.loading=!1,this.$("a").data("bypass",!0),this.init&&this.init()},triggerEditor:function(){(Upfront.Application.user_can("EDIT")!==!1||parseInt(this.parent.post.get("post_author"),10)===Upfront.data.currentUser.id&&Upfront.Application.user_can("EDIT_OWN")===!0)&&(this.parent._editing||!0!==Upfront.plugins.isForbiddenByPlugin("trigger post editor")&&this.canTriggerEdit&&(this.parent.triggerEditors(),this.focus()))},editContent:function(){},stopEditContent:function(){},focus:function(){},preventLinkNavigation:function(t){t.preventDefault()}});a.prototype={_editing:!1,_viewInstances:[],partView:{title:r.extend({events:{dblclick:"editContent"},type:"title",canTriggerEdit:!0,init:function(){this.listenTo(this.parent,"change:title",this.titleChanged),this.listenTo(Upfront.Events,"change:title",this.sidebarTitleChanged)},editContent:function(){if(!(this.parent._editing||this.parent.isViewLoading()||(r.prototype.editContent.call(this),this.$el.find("[contenteditable='true']").length||this.$el.is("[contenteditable='true']")))){var e=this.$(".upostdata-part");if(e.length){var i=this._findDeep(e);t.trim(i.text())==t.trim(e.text())?this.$title=i:this.$title=e;var n=this.$title.parent();n.is("a")&&n.replaceWith(this.$title),this.$title.attr("contenteditable",!0).off("blur").on("blur",_.bind(this.blur,this)).off("keyup").on("keyup",_.bind(this.keyup,this)).off("keypress").on("keypress",_.bind(this.keypress,this)),this.focus(),t("html").on("mousedown",{$title:this.$title,$partView:this},this.mousedown)}this.parent.editorStart()}},mousedown:function(e){e&&!1==(e.target===e.data.$title[0])&&(e.data.$title.trigger("blur"),t("html").off("mousedown",e.data.$partView.mousedown))},disable_edit_title:function(){this.$title.attr("contenteditable",!1).off("blur").off("keyup").off("keypress").off("dblclick").on("dblclick",_.bind(this.editContent,this)),this.parent.editorStop()},blur:function(){var t=this.$title.get(0);this.parent.setSelection(t,!1),this.parent.titleBlurred(),this.parent.currentData.title=this.$title.text(),this.parent.trigger("change:title",this.parent.currentData.title,this),Upfront.Events.trigger("content:change:title",this.parent.currentData.title),this.disable_edit_title()},keyup:function(t){this.parent.currentData.title=this.$title.text(),Upfront.Events.trigger("content:change:title",this.parent.currentData.title),27===t.keyCode&&this.disable_edit_title()},keypress:function(t){13==t.which&&t.preventDefault()},focus:function(){var t=this.$title.get(0);t.focus(),this.parent.setSelection(t,!0)},titleChanged:function(t,e){e!=this&&"undefined"!=typeof this.$title&&this.$title.text(t)},sidebarTitleChanged:function(e){var i=this.$(".upostdata-part");if("undefined"==typeof this.title&&i.length){var n=this._findDeep(i);t.trim(n.text())==t.trim(i.text())?this.$title=n:this.$title=i}this.$title.text(e),this.parent.currentData.title=e},_findDeep:function(t){var e=t.children(":not(script, style, object, iframe, embed)");return e.length>0?this._findDeep(e.first()):t}}),content:r.extend({events:{dblclick:"editContent"},type:"content",canTriggerEdit:!0,init:function(){this.listenTo(this.parent,"change:content",this.contentChanged)},editContent:function(){if(!this.parent._editing&&!this.parent.isViewLoading()){var e=this;if(r.prototype.editContent.call(this),this.$content=this.$(".upostdata-part"),this.$content.find(".upfront-indented_content").length&&(this.$content=this.$content.find(".upfront-indented_content")),this.$content.length){var i="excerpt"==this.model.get_property_value_by_name("content"),n=i?this.parent.currentData.excerpt:this.parent.currentData.content,a=i?this.parent.getExcerptEditorOptions():this.parent.getContentEditorOptions();this.$content.html(n).ueditor(a),this.editor=this.$content.data("ueditor"),this.$content.off("blur").on("blur",_.bind(this.blur,this)).on("keyup",_.bind(this.keyup,this)).off("stop").on("stop",_.bind(this.stopEditContent,this)),this.parent.editorStart(),setTimeout(function(){e.$content.find(".upfront-inserted_image-wrapper").each(function(){t(this).attr("contenteditable","true")}),e.focus()},100)}}},keyup:function(t){27===t.keyCode&&this.stopEditContent()},stopEditContent:function(){this.editor.redactor&&this.editor.redactor.code&&this.editor.redactor.code.startSync(),this.$content.length&&(this.$content.off("blur").off("keyup"),Upfront.Events.trigger("editor:change:content",this.$content.html())),this.updateContent(),this.parent.editorStop()},blur:function(){var t=this.$content.html();this.parent.trigger("change:content",t,this),Upfront.Events.trigger("editor:change:content",t)},updateContent:function(){var e,i="excerpt"==this.model.get_property_value_by_name("content");_.isObject(this.editor)&&(this.$content.find(".upfront-inline-panel").remove(),this.$content.find(".ueditor-insert-remove").remove(),this.$content.find(".upfront-inserted_image-wrapper").each(function(){var e=t(this),i=e.find(".post-images-shortcode").length?e.find(".post-images-shortcode"):e.find(".post-images-shortcode-wp");if(i.length>0){var n=t.trim(i.html().replace(/(\r\n|\n|\r)/gm,""));e.replaceWith(n)}}),e=t.trim(this.editor.getValue()),e=e.replace(/(\n)*?<br\s*\/?>\n*/g,"<br/>"),i?this.parent.currentData.excerpt=e:this.parent.currentData.content=e,this.parent.currentData.inserts=this.editor.getInsertsData())},focus:function(){var t=this.$content.get(0);t.focus(),"undefined"!=typeof this.$content&&this.$content&&this.$content.text()===Upfront.Settings.l10n.global.ueditor.default_post_content&&this.parent.setSelection(t,!0)},contentChanged:function(t,e){"undefined"!=typeof this.$content&&(!this.$content||e!=this&&this.$content.redactor&&this.$content.redactor.code)&&this.$content.redactor("code.set",t)}}),author:r.extend({type:"author",events:function(){return _.extend({},r.prototype.events,{"click .upostdata-part":"editAuthor"})},init:function(){this.listenTo(this.parent,"change:author",this.authorChanged)},editContent:function(){r.prototype.editContent.call(this),this.$author=this.$(".upostdata-part")},stopEditContent:function(){this.parent.removeAuthorSelect()},editAuthor:function(t){if(this.$author&&this.$author.length){t.preventDefault();var e=this.parent.getAuthorSelect(),i=this.$author.position();e.$el.is(":visible")?e.close():(e.fromView=this,e.$el.appendTo(this.$author),e.open(),e.$el.css({top:0,left:i.left,display:"block"}))}},authorChanged:function(t,e){}}),gravatar:r.extend({type:"gravatar",events:function(){return _.extend({},r.prototype.events,{"click .upostdata-part":"editAuthor"})},init:function(){a.prototype.partView.author.prototype.init.call(this)},editContent:function(){a.prototype.partView.author.prototype.editContent.call(this)},stopEditContent:function(){a.prototype.partView.author.prototype.stopEditContent.call(this)},editAuthor:function(t){a.prototype.partView.author.prototype.editAuthor.call(this,t)},authorChanged:function(t,e){}}),date_posted:r.extend({type:"date_posted",events:function(){return _.extend({},r.prototype.events,{"click .upostdata-part":"editDate","click .ueditor-action-pickercancel":"editDateCancel","click .ueditor-action-pickerok":"editDateOk"})},init:function(){this.listenTo(this.parent,"change:date",this.dateChanged),this.listenTo(this.parent,"bar:date:updated",this.dateChanged)},editContent:function(){if(r.prototype.editContent.call(this),this.$date=this.$(".upostdata-part"),this.$date.length){var e=this,i={},n=this.parent.currentData.date,a=this.getDateFormat();i.minutes=_.range(0,60),i.hours=_.range(0,24),i.currentHour=n.getHours(),i.currentMinute=n.getHours(),this.datepickerTpl=_.template(t(Upfront.data.tpls.popup).find("#datepicker-tpl").html()),this.$el.prepend(this.datepickerTpl(i)),this.datepicker=this.$(".upfront-bar-datepicker"),this.datepicker.datepicker({changeMonth:!0,changeYear:!0,dateFormat:a,onChangeMonthYear:function(t,i,n){var a=n.selectedDay,r=new Date(t,i-1,a,e.parent.currentData.date.getHours(),e.parent.currentData.date.getMinutes());e.datepicker.datepicker("setDate",r)}})}},stopEditContent:function(){this.datepicker.parent().remove()},editDate:function(t){if(this.$date&&this.$date.length){t.preventDefault();var e=this.$date.offset(),i=this.$date.height(),n=this.parent.currentData.date;if(this.datepicker.parent().show().offset({top:e.top+i,left:e.left}),n){var a=n.getHours(),r=n.getMinutes();this.datepicker.datepicker("setDate",n),this.$(".ueditor-hours-select").val(a),this.$(".ueditor-minutes-select").val(r)}}},getDateFormat:function(){var t=this.parentModel.get_property_value_by_name("date_posted_format");return Upfront.Util.date.php_format_to_js(t?t:Upfront.data.date.format)},editDateCancel:function(t){t.preventDefault(),this.$(".upfront-date_picker").hide()},editDateOk:function(t){t.preventDefault();var e=this.datepicker.datepicker("getDate"),i=this.datepicker.parent(),n=i.find(".ueditor-hours-select").val(),a=i.find(".ueditor-minutes-select").val();e.setHours(n),e.setMinutes(a),this.dateOk(e),this.$(".upfront-date_picker").hide()},dateOk:function(t){this.parent.currentData.date=t,this.parent.trigger("change:date",t,this)},dateChanged:function(t,e){}}),featured_image:r.extend({type:"featured_image",init:function(){if(this.$featured=this.$el,this.$featured.length){this.parent.post.meta.getValue("_thumbnail_id");this.$featured.addClass("ueditor_thumb ueditable").css({position:"relative","overflow-y":"hidden",width:"100%"}).append('<div class="upost_thumbnail_changer" ><div>'+Upfront.Settings.l10n.global.content.trigger_edit_featured_image+"</div></div>").find("img").css({"z-index":"2",position:"relative"}),this.updateImageSize()}this.parent.off("swap:image",this.openImageSelector),this.parent.off("edit:image",this.editThumb),this.parent.on("swap:image",this.openImageSelector,this),this.parent.on("edit:image",this.editThumb,this),this.listenTo(Upfront.Events,"featured:image:resized",this.updateResized)},events:function(){return _.extend({},r.prototype.events,{"click .upost_thumbnail_changer":"editThumb"})},editContent:function(){r.prototype.editContent.call(this)},stopEditContent:function(){},updateImageSize:function(){var t=this.parentModel.get_breakpoint_property_value("row",!0),e=Upfront.Settings.LayoutEditor.Grid,i=parseInt(this.parentModel.get_breakpoint_property_value("top_padding_use",!0)?this.parentModel.get_breakpoint_property_value("top_padding_num",!0):0,10),n=parseInt(this.parentModel.get_breakpoint_property_value("bottom_padding_use",!0)?this.parentModel.get_breakpoint_property_value("bottom_padding_num",!0):0,10),a=parseInt(this.model.get_breakpoint_property_value("top_padding_use",!0)?this.model.get_breakpoint_property_value("top_padding_num",!0):e.column_padding,10),r=parseInt(this.model.get_breakpoint_property_value("bottom_padding_use",!0)?this.model.get_breakpoint_property_value("bottom_padding_num",!0):e.column_padding,10),s=t*e.baseline;s-=i+n+a+r,this.$featured.length&&this.$featured.css({"min-height":s+"px","max-height":s+"px"})},editThumb:function(t){if(this.$featured&&this.$featured.length){"undefined"!=typeof t&&t.preventDefault();var e=this,i=(this.$featured.find("img"),new Upfront.Views.Editor.Loading({loading:Upfront.Settings.l10n.global.content.starting_img_editor,done:Upfront.Settings.l10n.global.content.here_we_are,fixed:!1})),n=this.parent.post.meta.getValue("_thumbnail_id"),a=this.parentModel.get_property_value_by_name("full_featured_image");if(!n||"1"==a)return e.openImageSelector();i.render(),this.$featured.append(i.$el),e.getImageInfo(e.parent.post).done(function(t){i.$el.remove(),e.openImageEditor(!1,t,e.parent.post.id)})}},getImageInfo:function(e){var i=e.meta.get("_thumbnail_data"),n=e.meta.get("_thumbnail_id"),a=t.Deferred(),r=this.$featured.find("img");if(i&&_.isObject(i.get("meta_value"))&&i.get("meta_value").imageId==n.get("meta_value")){var s=i.get("meta_value");r.width()/s.cropSize.width;a.resolve({src:s.src,srcFull:s.srcFull,srcOriginal:s.srcOriginal,fullSize:s.fullSize,size:s.imageSize,position:s.imageOffset,rotation:s.rotation,align:s.align,valign:s.valign,isDotAlign:s.isDotAlign,id:s.imageId})}else{if(!n)return!1;Upfront.Views.Editor.ImageEditor.getImageData([n.get("meta_value")]).done(function(t){var e=t.data.images,i={},n=0;_.each(e,function(t,e){i=t,n=e}),a.resolve({src:i.medium?i.medium[0]:i.full?i.full[0]:"",srcFull:i.full?i.full[0]:"",srcOriginal:i.full?i.full[0]:"",fullSize:{width:i.full?i.full[1]:0,height:i.full?i.full[2]:0},size:{width:r.width(),height:r.height()},position:{top:0,left:0},rotation:0,id:n})})}return a.promise()},openImageSelector:function(e){var i=this,n=this.parentModel.get_property_value_by_name("full_featured_image");Upfront.Views.Editor.ImageSelector.open().done(function(a){var r={},s=0;_.each(a,function(t,e){r=t,s=e});var o={src:r.medium?r.medium[0]:r.full[0],srcFull:r.full[0],srcOriginal:r.full[0],fullSize:{width:r.full[1],height:r.full[2]},size:r.medium?{width:r.medium[1],height:r.medium[2]}:{width:r.full[1],height:r.full[2]},position:!1,rotation:0,id:s};t("<img>").attr("src",o.srcFull).load(function(){if(Upfront.Views.Editor.ImageSelector.close(),"1"==n){var a=i.$featured.find("img"),r=t('<img style="z-index:2;position:relative">');return i.updatePost(imageData),a.length?(a.replaceWith(r),a=r):a=r.appendTo(i.$(".thumbnail")),void a.attr("src",o.srcFull)}i.openImageEditor(!0,o,e)})})},openImageEditor:function(e,i,n){var a=this,r=this.$el.find(".thumbnail"),s=_.extend({},i,{element_id:this.model.get_element_id()+"_post_"+n,element_cols:Upfront.Util.grid.width_to_col(r.width(),!0),maskOffset:r.offset(),maskSize:{width:r.width(),height:r.height()},setImageSize:e,extraButtons:[{id:"image-edit-button-swap",text:Upfront.Settings.l10n.global.content.swap_image,callback:function(t,e){e.cancel(),a.openImageSelector(n)}}]});setTimeout(function(){t("#image-edit-button-align").hide()},100),Upfront.Views.Editor.ImageEditor.open(s).done(function(e){var i=(a.post,r.find("img")),n=t('<img style="z-index:2;position:relative">');a.updatePost(e),i.length?(i.replaceWith(n),i=n):i=n.appendTo(r),t("#image-edit-button-align").show(),i.attr("src",e.srcFull),e.imageSize&&(i.css("width",e.imageSize.width),i.css("height",e.imageSize.height),i.css("top",-e.imageOffset.top),i.css("left",-e.imageOffset.left)),Upfront.Events.trigger("featured_image:updated",i)}).fail(function(t){t&&"changeImage"===t.reason&&a.openImageSelector()})},updatePost:function(t){var e=this.parent.post.meta.findWhere({meta_key:"_thumbnail_data"});e?(this.parent.post.meta.setValue("_thumbnail_id",t.imageId),this.parent.post.meta.setValue("_thumbnail_data",t)):this.parent.post.meta.add([{meta_key:"_thumbnail_id",meta_value:t.imageId},{meta_key:"_thumbnail_data",meta_value:t}],{merge:!0});var i=this.$featured.find(".thumbnail");i.attr("data-fallback")&&i.removeAttr("data-fallback")},updateResized:function(t){this.updatePost(t)},property:function(t,e,i){return"undefined"!=typeof e?("undefined"==typeof i&&(i=!0),this.model.set_property(t,e,i)):this.model.get_property_value_by_name(t)}}),tags:r.extend({type:"tags",editContent:function(){r.prototype.editContent.call(this)},stopEditContent:function(){},blur:function(){},focus:function(){}}),categories:r.extend({type:"categories",editContent:function(){r.prototype.editContent.call(this)},stopEditContent:function(){},blur:function(){},focus:function(){}})},triggerEditors:function(){if(Upfront.Application.user_can("EDIT")!==!1||parseInt(this.post.get("post_author"),10)===Upfront.data.currentUser.id&&Upfront.Application.user_can("EDIT_OWN")===!0){t(Upfront.Settings.LayoutEditor.Selectors.main);this._editing||(_.each(this._viewInstances,function(t){t.editContent()}),this.editorStart(),Upfront.Events.trigger("post:content:edit:start",this))}},stopEditors:function(){$main=t(Upfront.Settings.LayoutEditor.Selectors.main),this._editing&&(_.each(this._viewInstances,function(t){t.stopEditContent()}),this.editorStop(),Upfront.Events.trigger("post:content:edit:stop",this))},editorStart:function(){var e=t(Upfront.Settings.LayoutEditor.Selectors.main);this._editing||(this._editing=!0,e.addClass("upfront-editing-post-content"),this.trigger("edit:start"))},editorStop:function(){$main=t(Upfront.Settings.LayoutEditor.Selectors.main),this._editing&&(this._editing=!1,$main.removeClass("upfront-editing-post-content"),this.trigger("edit:stop"))},setView:function(t,e,i,n){if(_.isUndefined(this.partView[t]))return!1;var a=new this.partView[t]({el:e,model:i,parentModel:n,parent:this});return this._viewInstances.push(a),a},isViewLoading:function(){var t=!1;return _.each(this._viewInstances,function(e){e.loading&&(t=!0)}),t},prepareBox:function(){t(Upfront.Settings.LayoutEditor.Selectors.main);return"undefined"!=typeof this.box&&this.box.remove(),this.box=new e.Box({post:this.post}),this.bindBarEvents(),this.box.render(),this.box},bindBarEvents:function(){var t=this,e=["cancel","publish","draft","trash","auto-draft"];_.each(e,function(e){t.listenTo(t.box,e,function(){_.each(t._viewInstances,function(t){t.trigger(e)});var i={};"publish"!=e&&"draft"!=e&&"auto-draft"!=e||(i.title=t.currentData.title,i.content=t.currentData.content,i.excerpt=t.currentData.excerpt,i.author=t.currentData.author,i.date=t.currentData.date,i.inserts=t.currentData.inserts,t.postStatus&&(i.status=t.postStatus),t.postVisibility&&(i.visibility=t.postVisibility),t.postPassword&&(i.pass=t.postPassword)),t.trigger(e,i)})}),this.listenTo(t.box.scheduleSection,"date:updated",t.updateDateFromBar).listenTo(t.box.statusSection,"status:change",t.updateStatus).listenTo(Upfront.Events,"global:status:change",t.updateStatus).listenTo(t.box.visibilitySection,"visibility:change",t.updateVisibility)},updateStatus:function(t){this.postStatus=t},updateVisibility:function(t,e){this.postVisibility=t,this.postPassword=e},getExcerptEditorOptions:function(){return{linebreaks:!1,autostart:!0,autoexit:!0,focus:!1,pastePlainText:!0,inserts:[],airButtons:["bold","italic"],placeholder:"<p>Excerpt here</p>"}},getContentEditorOptions:function(){return{linebreaks:!1,replaceDivs:!1,autostart:!0,autoexit:!0,focus:!1,inserts:["postImage","video","embed"],insertsData:this.inserts,pastePlainText:!1,placeholder:"<p>Content here</p>"}},titleBlurred:function(){!this.post.is_new||this.box.urlEditor.hasDefinedSlug||_.isEmpty(this.currentData.title)||(this.post.set("post_name",this.currentData.title.toLowerCase().replace(/\ /g,"-")),this.box.urlEditor.render())},getAuthorSelect:function(){if(this.authorSelect)return this.authorSelect;var t=this,e=Upfront.data.ueditor.authors,i=[];return _.each(e,function(t){i.push({value:t.ID,name:t.display_name})}),this.authorSelect=new o({options:i}),this.authorSelect.on("select",function(e){t.changeAuthor(e,this.fromView)}),this.authorSelect},removeAuthorSelect:function(){this.authorSelect&&(this.authorSelect.remove(),this.authorSelect=!1)},changeAuthor:function(t,e){this.currentData.author=t,this.trigger("change:author",t,e)},getAuthorData:function(t){for(var e=-1,i=!1,n=Upfront.data.ueditor.authors;++e<n.length&&!i;)n[e].ID==t&&(i=n[e]);return i},updateDateFromBar:function(t){this.currentData.date=t,this.trigger("bar:date:updated",t)},setSelection:function(t,e){var i,n;document.createRange?(i=document.createRange(),i.selectNodeContents(t),e||i.collapse(!1),n=window.getSelection(),n.removeAllRanges(),n.addRange(i)):document.selection&&(i=document.body.createTextRange(),i.moveToElementText(t),selectall||i.collapse(!1),i.select())}};var s=Backbone.View.extend(_.extend({},a.prototype,{events:{"click a":"preventLinkNavigation","click .upfront-content-marker-author":"editAuthor","click .upfront-content-marker-date":"editDate","click .upost_thumbnail_changer":"editThumb","click .ueditor-action-pickercancel":"editDateCancel","click .ueditor-action-pickerok":"editDateOk"},initialize:function(e){this.post=e.post,this.postView=e.postView,this.triggeredBy=e.triggeredBy||this.$(".upfront-content-marker").first(),this.parts={},this.partOptions=e.partOptions,this.postAuthor=this.post.get("post_author"),this.authorTpl=e.authorTpl,this.contentMode=e.content_mode,this.inserts=this.post.meta.getValue("_inserts_data")||{},this.$el.addClass("clearfix").css("padding-bottom","60px"),this.rawContent=e.rawContent,this.rawExcerpt=e.rawExcerpt,this.$("a").data("bypass",!0);var i=this.$el.closest(".ui-draggable");i.length&&(cancel=i.draggable("disable")),t(".change_feature_image").addClass("ueditor-display-block"),this.prepareEditableRegions()},title_blurred:function(){"undefined"!=typeof this.box&&(!this.post.is_new||this.box.urlEditor.hasDefinedSlug||_.isEmpty(this.parts.titles.html())||(this.post.set("post_name",this.parts.titles.html().toLowerCase().replace(/\ /g,"-")),this.box.urlEditor.render()))},prepareEditableRegions:function(){var e=this;if(this.parts.titles=this.$(".upfront-content-marker-title"),this.parts.titles.length){var i=this.parts.titles.parent();i.is("a")&&i.replaceWith(this.parts.titles),this.onTitleEdited=_.bind(this.titleEdited,this),this.parts.titles.attr("contenteditable",!0).off("blur").on("blur",_.bind(e.title_blurred,e))}if(this.parts.contents=this.$(".upfront-content-marker-contents"),this.parts.contents.length){var n="post_excerpt"==this.contentMode,a=n?this.rawExcerpt:this.rawContent,r=n?this.getExcerptEditorOptions():this.getContentEditorOptions();this.onContentsEdited=_.bind(this.contentEdited,this),this.editors=[],this.parts.contents.html(a).ueditor(r),this.parts.contents.on("keyup",this.onContentsEdited),this.parts.contents.each(function(){e.editors.push(t(this).data("ueditor"))}),this.currentContent=this.parts.contents[0]}if(this.parts.authors=this.$(".upfront-content-marker-author"),this.parts.authors.length){var e=this,s=Upfront.data.ueditor.authors,p=[];_.each(s,function(t){p.push({value:t.ID,name:t.display_name})}),this.authorSelect=new o({options:p}),this.authorSelect.on("select",function(t){e.changeAuthor(t)}),this.$el.append(this.authorSelect.$el)}if(this.parts.author_gravatars=this.$(".upfront-content-marker-author-gravatar"),this.parts.authors.length){var e=this,s=Upfront.data.ueditor.authors,p=[];_.each(s,function(t){p.push({value:t.ID,name:t.display_name})}),this.authorSelect=new o({options:p}),this.authorSelect.on("select",function(t){e.changeAuthor(t)}),this.$el.append(this.authorSelect.$el)}if(this.parts.dates=this.$(".upfront-content-marker-date"),this.parts.dates.length){var e=this,h={},p=[],d=this.post.get("post_date"),l=this.getDateFormat();h.minutes=_.range(0,60),h.hours=_.range(0,24),h.currentHour=d.getHours(),h.currentMinute=d.getHours(),this.datepickerTpl=_.template(t(Upfront.data.tpls.popup).find("#datepicker-tpl").html()),this.$el.prepend(this.datepickerTpl(h)),this.datepicker=this.$(".upfront-bar-datepicker"),this.datepicker.datepicker({changeMonth:!0,changeYear:!0,dateFormat:l,onChangeMonthYear:function(i,n,a){var r=a.selectedDay,s=new Date(e.parts.dates.text()),o=new Date(i,n-1,r,s.getHours(),s.getMinutes());e.parts.dates.html(t.datepicker.formatDate(l,o)),e.post.set("post_date",o),e.datepicker.datepicker("setDate",o)},onSelect:function(t){e.parts.dates.html(t)}})}if(this.parts.featured=this.$(".upfront-content-marker-featured_image"),this.parts.featured.length){var u=(this.post.meta.getValue("_thumbnail_id"),this.partOptions.featured_image&&this.partOptions.featured_image.height?this.partOptions.featured_image.height:60);this.parts.featured.addClass("ueditor_thumb ueditable").css({position:"relative","min-height":u+"px","max-height":u+"px","overflow-y":"hidden","overflow-x":"hidden",width:"100%"}).append('<div class="upost_thumbnail_changer" ><div>'+Upfront.Settings.l10n.global.content.trigger_edit_featured_image+"</div></div>").find("img").css({"z-index":"2",position:"relative"})}this.parts.tags=this.$(".upfront-postpart-tags"),this.parts.categories=this.$(".upfront-postpart-categories"),setTimeout(function(){e.triggeredBy.length&&e.focus(e.triggeredBy,!0)},200)},editThumb:function(e){e.preventDefault();var i=this,n=t(e.target),a=(this.postId,n.parent().find("img"),new Upfront.Views.Editor.Loading({loading:Upfront.Settings.l10n.global.content.starting_img_editor,done:Upfront.Settings.l10n.global.content.here_we_are,fixed:!1})),r=this.post.meta.getValue("_thumbnail_id"),s=this.postView.property("full_featured_image");return r&&"1"!=s?(a.render(),n.parent().append(a.$el),void i.getImageInfo(i.post).done(function(t){a.$el.remove(),i.openImageEditor(!1,t,i.post.id)})):i.openImageSelector()},getImageInfo:function(e){var i=e.meta.get("_thumbnail_data"),n=e.meta.get("_thumbnail_id"),a=t.Deferred(),r=this.$(".ueditor_thumb").find("img");if(i&&_.isObject(i.get("meta_value"))&&i.get("meta_value").imageId==n.get("meta_value")){var s=i.get("meta_value"),o=r.width()/s.cropSize.width;a.resolve({src:s.src,srcFull:s.srcFull,srcOriginal:s.srcOriginal,fullSize:s.fullSize,size:{width:s.imageSize.width*o,height:s.imageSize.height*o},position:{top:s.imageOffset.top*o,left:s.imageOffset.left*o},rotation:s.rotation,id:s.imageId})}else{if(!n)return!1;Upfront.Views.Editor.ImageEditor.getImageData([n.get("meta_value")]).done(function(t){var e=t.data.images,i={},n=0;_.each(e,function(t,e){i=t,n=e}),a.resolve({src:i.medium?i.medium[0]:i.full[0],srcFull:i.full[0],srcOriginal:i.full[0],fullSize:{width:i.full[1],height:i.full[2]},size:{width:r.width(),height:r.height()},position:{top:0,left:0},rotation:0,id:n})})}return a.promise()},openImageSelector:function(e){var i=this,n=this.postView.property("full_featured_image");Upfront.Views.Editor.ImageSelector.open().done(function(a){var r={},s=0;_.each(a,function(t,e){r=t,s=e});var o={src:r.medium?r.medium[0]:r.full[0],srcFull:r.full[0],srcOriginal:r.full[0],fullSize:{width:r.full[1],height:r.full[2]},size:r.medium?{width:r.medium[1],height:r.medium[2]}:{width:r.full[1],height:r.full[2]},position:!1,rotation:0,id:s};t("<img>").attr("src",o.srcFull).load(function(){if(Upfront.Views.Editor.ImageSelector.close(),"1"==n){var a=i.$(".ueditor_thumb img"),r=t('<img style="z-index:2;position:relative">');return i.post.meta.add([{meta_key:"_thumbnail_id",meta_value:s},{meta_key:"_thumbnail_data",meta_value:""}],{merge:!0}),a.length?(a.replaceWith(r),a=r):a=r.appendTo(i.$(".ueditor_thumb")),void a.attr("src",o.srcFull)}i.openImageEditor(!0,o,e)})})},openImageEditor:function(e,i,n){var a=this,r=this.$(".ueditor_thumb"),s=this.partOptions.featured_image&&this.partOptions.featured_image.height?this.partOptions.featured_image.height:60,o=_.extend({},i,{element_id:"post_"+n,element_cols:Upfront.Util.grid.width_to_col(r.width(),!0),maskOffset:r.offset(),maskSize:{width:r.width(),height:s},setImageSize:e,extraButtons:[{id:"image-edit-button-swap",text:Upfront.Settings.l10n.global.content.swap_image,callback:function(t,e){e.cancel(),a.openImageSelector(n)}}]});setTimeout(function(){t("#image-edit-button-align").hide()},100),Upfront.Views.Editor.ImageEditor.open(o).done(function(e){var i=(a.post,r.find("img")),n=t('<img style="z-index:2;position:relative">');a.post.meta.add([{meta_key:"_thumbnail_id",meta_value:e.imageId},{meta_key:"_thumbnail_data",meta_value:e}],{merge:!0}),i.length?(i.replaceWith(n),i=n):i=n.appendTo(r),t("#image-edit-button-align").show(),i.attr("src",e.srcFull)}).fail(function(t){t&&"changeImage"===t.reason&&a.openImageSelector()})},focus:function(e,i){var n="upfront-content-marker-";"undefined"==typeof e.length&&(e=t(e)),(e.hasClass(n+"title")||e.hasClass(n+"contents"))&&(e.get(0).focus(),this.setSelection(e[0],i))},changeAuthor:function(t){var e=this,i=e.getAuthorData(t);this.$(".upfront-content-marker-author").html(i.display_name),this.postAuthor=t},editAuthor:function(e){e.preventDefault();var i=t(e.target);this.authorSelect.open(),this.authorSelect.$el.css({top:e.offsetY+50,left:e.offsetX+i.width(),display:"block"})},editDate:function(e){e.preventDefault();var i=t(e.target);this.datepicker.is(":visible")&&this.datepicker.offset({top:i.offset().top+30,left:i.offset().left+i.width()});var n=this.selectedDate||this.post.get("post_date");if(this.datepicker.parent().show().offset({top:i.offset().top+30,left:i.offset().left+i.width()}),n){var a=n.getHours(),r=n.getMinutes();this.datepicker.datepicker("setDate",n),this.$(".ueditor-hours-select").val(a),this.$(".ueditor-minutes-select").val(r)}},getDateFormat:function(){return Upfront.Util.date.php_format_to_js(this.partOptions.date&&this.partOptions.date.format?this.partOptions.date.format:Upfront.data.date.format)},updateDateParts:function(e){this.parts.dates.html(t.datepicker.formatDate(this.getDateFormat(),e))},editDateCancel:function(){this.updateDateParts(this.selectedDate||this.post.get("post_date")),this.$(".upfront-date_picker").hide()},editDateOk:function(){var t=this.datepicker.datepicker("getDate"),e=this.datepicker.parent(),i=e.find(".ueditor-hours-select").val(),n=e.find(".ueditor-minutes-select").val();t.setHours(i),t.setMinutes(n),this.dateOk(t),this.$(".upfront-date_picker").hide()},dateOk:function(t){this.selectedDate=t},updateDateFromBar:function(t){this.updateDateParts(t),this.dateOk(t)},editTags:function(t){this.box.editTaxonomies(t,"post_tag")},editCategories:function(t){this.box.editTaxonomies(t,"category")},getAuthorData:function(t){for(var e=-1,i=!1,n=Upfront.data.ueditor.authors;++e<n.length&&!i;)n[e].ID==t&&(i=n[e]);return i},updateStatus:function(t){this.postStatus=t},updateVisibility:function(t,e){this.postVisibility=t,this.postPassword=e},titleEdited:function(t){var e=t.target.innerHTML;this.parts.titles.each(function(){this!=t.target&&(this.innerHTML=e)})},contentEdited:function(e){var i=e.currentTarget.innerHTML;this.parts.contents.each(function(){this!=e.currentTarget&&t(this).redactor("set",i,!1)}),this.currentContent=e.currentTarget},prepareBox:function(){if(!this.box)return this.box=new e.Box({post:this.post}),this.bindBarEvents(),this.box.render(),this.$el.append(this.box.$el),_.delay(_.bind(this.box.setPosition,this.box),10),this.box.toggleRegionClass(!0),
this},bindBarEvents:function(){var e=this,i=["cancel","publish","draft","trash","auto-draft"];_.each(i,function(i){e.listenTo(e.box,i,function(){var n={};if("publish"===i||"draft"===i||"auto-draft"===i){if(e.parts.titles&&(n.title=t.trim(e.parts.titles.text())),e.currentContent){var a=t(e.currentContent).data("ueditor");"publish"===i&&(e.$el.find(".upfront-inline-panel").remove(),e.$el.find(".ueditor-insert-remove").remove()),e.$(".upfront-inserted_image-wrapper").each(function(){var e=t(this),i=e.find(".post-images-shortcode").length?e.find(".post-images-shortcode"):e.find(".post-images-shortcode-wp"),n=t.trim(i.html().replace(/(\r\n|\n|\r)/gm,""));e.replaceWith(n)}),n.content=t.trim(a.getValue()),n.content=n.content.replace(/(\n)*?<br\s*\/?>\n*/g,"<br/>"),n.inserts=a.getInsertsData(),n.author=e.postAuthor}e.selectedDate&&(n.date=e.selectedDate),e.postStatus&&(n.status=e.postStatus),e.postVisibility&&(n.visibility=e.postVisibility),e.postPassword&&(n.pass=e.postPassword),e.postView&&(e.postView||{}).markup&&(e.postView.markup=!1)}e.trigger(i,n)})}),this.listenTo(e.box.scheduleSection,"date:updated",e.updateDateFromBar).listenTo(e.box.statusSection,"status:change",e.updateStatus).listenTo(e.box.visibilitySection,"visibility:change",e.updateVisibility),Upfront.Events.on("editor:post:tax:updated",_.bind(e.refreshTaxonomies,e))},refreshTaxonomies:function(){if((this.parts.tags.length||this.parts.categories.length)&&!this.taxLoading){var t=this,e=this.postView.partOptions||{},i=this.postView.partTemplates||{},n={action:"content_part_markup",post_id:this.post.get("ID"),parts:[],templates:{}};this.parts.tags.length&&(n.parts.push({slug:"tags",options:e.tags||{}}),n.templates.tags=i.tags||""),this.parts.categories.length&&(n.parts.push({slug:"categories",options:e.categories||{}}),n.templates.categories=i.categories||""),n.parts=JSON.stringify(n.parts),setTimeout(function(){t.taxLoading=Upfront.Util.post(n).done(function(e){var i=t.postView.partContents;_.extend(i.replacements,e.data.replacements),_.extend(i.tpls,e.data.tpls),t.parts.tags.html(e.data.tpls.tags),t.parts.categories.html(e.data.tpls.categories),t.taxLoading=!1})},300)}},stop:function(){this.onTitleEdited&&this.parts.titles.off("change",this.onTitleEdited),this.editors&&_.each(this.editors,function(t){t.stop()});var t=this.$el.closest(".ui-draggable");t.length&&(cancel=t.draggable("enable")),this.$("a").data("bypass",!1)},preventLinkNavigation:function(t){t.preventDefault()}})),o=Backbone.View.extend({tpl:!1,className:"ueditor-select ueditor-popup upfront-ui",events:{"blur input":"close","click .ueditor-select-option":"select"},initialize:function(t){this.opts=t.options,this.render()},render:function(){this.tpl||(this.tpl=this.getTpl()),this.tpl&&this.$el.html(this.tpl({options:this.opts}))},open:function(){var e=this;this.tpl||this.render(),this.$el.css("display","inline-block"),this.delegateEvents(),t(document).one("click",function(i){var n=e.$el.parent().length?e.$el.parent():e.$el,a=t(i.target);a.is(n[0])||a.closest(n[0]).length||e.close()})},close:function(t){var e=this;setTimeout(function(){e.$el.hide()},200)},select:function(e){e.preventDefault();var i=t(e.target).data("id");this.trigger("select",i),this.$("input").val("value"),this.$el.hide()},getTpl:function(){return this.tpl?this.tpl:!(!Upfront.data||!Upfront.data.tpls)&&_.template(t(Upfront.data.tpls.popup).find("#microselect-tpl").html())}});return{PostContentEditor:a,PostContentEditorLegacy:s,getMarkupper:function(){return n}}})}(jQuery);