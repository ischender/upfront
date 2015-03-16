(function(e){define(["text!scripts/upfront/templates/link-panel.html"],function(t){var n=Backbone.Model.extend({}),r=function(){var e=Upfront.Application.layout.get("regions"),t=[],n;return n=function(e){e.each(function(e){e.get("objects")?e.get("objects").each(function(e){var n=e.get_property_value_by_name("anchor");n&&n.length&&t.push({id:"#"+n,label:n})}):e.get("modules")&&n(e.get("modules"))})},e.each(function(e){n(e.get("modules"))}),t},i=function(){var e=[];return _.each(Upfront.data.ugallery.postTypes,function(t){t.name!="attachment"&&e.push({name:t.name,label:t.label})}),e},s=function(){var e=[],t=Upfront.Application.layout.get("regions");return _.each(t.models,function(t){t.attributes.sub=="lightbox"&&e.push({id:"#"+t.get("name"),label:t.get("title")})}),e},o=Backbone.View.extend({tpl:_.template(t),defaultLinkTypes:{unlink:!0,external:!0,entry:!0,anchor:!0,image:!1,lightbox:!0,email:!0},events:{"click .js-ulinkpanel-input-entry":"openPostSelector","keydown .js-ulinkpanel-lightbox-input":"onLightboxNameInputChange","blur .js-ulinkpanel-input-external":"onUrlInputBlur","click .js-ulinkpanel-ok":"onOkClick"},className:"ulinkpanel-dark",initialize:function(e){if(e.linkTypes&&e.linkTypes.image&&e.linkTypes.image===!0&&_.isUndefined(e.imageUrl))throw'Provide "imageUrl" if "linkTypes" option has { image: true } when initializing LinkPanel.';var t=this;this.options=e||{},this.linkTypes=_.extend({},this.defaultLinkTypes,e.linkTypes||{}),this.theme=e.theme||"dark",this.button=e.button||!1,this.model=new n({type:e.linkType||"unlink",url:e.linkUrl||"",target:e.linkTarget||"_self"}),this.listenTo(this.model,"change:url",function(){t.trigger("change",t.model.toJSON())}),this.listenTo(this.model,"change:target",function(){t.trigger("change:target",t.model.toJSON())}),this.listenTo(this.model,"change:type",this.handleTypeChange)},onOkClick:function(){this.trigger("change",this.model.toJSON())},handleTypeChange:function(){this.model.set({url:""}),this.render(),this.model.get("type")==="entry"&&this.openPostSelector(),this.model.get("type")==="image"&&this.model.set({url:this.options.imageUrl})},getLinkTypeValue:function(e){var t=Upfront.Settings.l10n.global.content;switch(e){case"unlink":return{value:"unlink",label:t.no_link};case"external":return{value:"external",label:t.url};case"email":return{value:"email",label:"Email address"};case"entry":return{value:"entry",label:t.post_or_page};case"anchor":return{value:"anchor",label:t.anchor};case"image":return{value:"image",label:t.larger_image};case"lightbox":return{value:"lightbox",label:t.lightbox}}},openPostSelector:function(e){e&&e.preventDefault();var t=this,n={postTypes:i()};Upfront.Views.Editor.PostSelector.open(n).done(function(e){t.model.set({url:e.get("permalink")}),t.render()})},onLightboxNameInputChange:function(e){e.which==13&&(e.preventDefault(),this.createLightBox())},createLightBox:function(){var t=e.trim(this.$(".js-ulinkpanel-lightbox-input").val());if(!t)return Upfront.Views.Editor.notify(l10n.ltbox_empty_name_nag,"error"),!1;this.model.set({url:"#"+Upfront.Application.LayoutEditor.createLightboxRegion(t)}),this.render()},onUrlInputBlur:function(t){var n=e(t.currentTarget).val().trim();this.model.get("type")==="external"&&!n.match(/https?:\/\//)&&(n="http://"+n),this.model.get("type")==="email"&&!n.match(/^mailto:/)&&(n="mailto:"+n),this.model.set({url:n}),this.render()},render:function(){var e=this,t={link:this.model.toJSON(),checked:'checked="checked"',lightboxes:s(),button:this.button,type:this.model.get("type")};this.$el.html(this.tpl(t)),this.renderTypeSelect(),this.model.get("type")=="anchor"&&this.renderAnchorSelect(),this.model.get("type")=="lightbox"&&s()&&this.renderLightBoxesSelect(),this.renderTargetRadio(),this.delegateEvents()},renderTypeSelect:function(){var e=this,t=[];_.each(this.linkTypes,function(e,n){if(!e)return;t.push(this.getLinkTypeValue(n))},this),this.typeSelect=new Upfront.Views.Editor.Field.Select({label:"",values:t,default_value:this.model.get("type"),change:function(){e.model.set({type:this.get_value()})}}),this.typeSelect.render(),this.$el.find("form").prepend(this.typeSelect.el)},renderTargetRadio:function(){var e=this;this.targetRadio=new Upfront.Views.Editor.Field.Radios({label:"Target:",default_value:this.model.get("target")||"_self",layout:"horizontal-inline",values:[{label:"blank",value:"_blank"},{label:"self",value:"_self"}],change:function(){e.model.set({target:this.get_value()})}}),this.targetRadio.render(),this.$el.find("form").append(this.targetRadio.el)},renderAnchorSelect:function(){var e=this.model,t=[{label:"Choose Anchor...",value:""}];_.each(r(),function(e){t.push({label:e.label,value:e.id})});var n=this.model.get("url");n=n?n:"",n=n.match(/^#/)?n:"",this.anchorSelect=new Upfront.Views.Editor.Field.Select({label:"",values:t,default_value:n,change:function(){e.set({url:this.get_value()})}}),this.anchorSelect.render(),this.$el.find(".anchor-selector").append(this.anchorSelect.el)},renderLightBoxesSelect:function(){var e=this.model,t=[{label:"Choose Lightbox...",value:""}];_.each(s()||[],function(e){t.push({label:e.label,value:e.id})});var n=this.model.get("url");n=n?n:"",n=n.match(/^#/)?n:"",this.lightboxSelect=new Upfront.Views.Editor.Field.Select({label:"",values:t,default_value:n,change:function(){e.set({url:this.get_value()})}}),this.lightboxSelect.render(),this.$el.find(".lightbox-selector").append(this.lightboxSelect.el)},delegateEvents:function(e){this.typeSelect&&this.typeSelect.delegateEvents(),this.anchorSelect&&this.anchorSelect.delegateEvents(),this.lightboxSelect&&this.lightboxSelect.delegateEvents(),Backbone.View.prototype.delegateEvents.call(this,e)}});return o})})(jQuery);