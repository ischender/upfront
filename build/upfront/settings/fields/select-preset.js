define([],function(){var e=Upfront.Settings.l10n.preset_manager,l=Upfront.Views.Editor.Field.Chosen_Select.extend({className:"preset select-preset-field",render:function(){Upfront.Views.Editor.Field.Chosen_Select.prototype.render.call(this);var l=this;this.$el.find(".upfront-chosen-select").val();if(this.$el.find(".upfront-chosen-select").chosen({search_contains:!0,width:"175px",disable_search:!Upfront.Application.user_can("MODIFY_PRESET")}),Upfront.Application.user_can("MODIFY_PRESET")){var t=['<a href="#" title="'+e.add_preset_label+'" class="upfront-preset-add">'+e.add_label+"</a>"];this.$el.find(".chosen-search").append(t.join(""))}return this.$el.on("click",".upfront-preset-add",function(t){if(t.preventDefault(),!Upfront.Application.user_can("MODIFY_PRESET"))return!1;var a=l.$el.find(".chosen-search input").val();return""===a.trim()?void alert(e.not_empty_label):a.match(/[^A-Za-z0-9 ]/)?void alert(e.special_character_label):a.match(/^[A-Za-z][A-Za-z0-9 ]*$/)?void l.trigger("upfront:presets:new",a.trim()):void alert(e.invalid_preset_label)}),this},get_value_html:function(l,t){var a="",i=this.get_saved_value()?this.get_saved_value():"default";if(l.value===this.clear_preset_name(i)&&(a=' selected="selected"'),"default"===l.value){l.label=e.default_label;var o=this.get_element_type(this.model.get_property_value_by_name("type"));"undefined"!=typeof o&&"undefined"!=typeof o.label&&(l.label=e.default_label+" "+o.label)}return['<option value="',l.value,'"',a,">",l.label,"</option>"].join("")},clear_preset_name:function(e){return e=e.replace(" ","-"),e=e.replace(/[^-a-zA-Z0-9]/,"")},get_element_type:function(l){var t={UaccordionModel:{label:e.accordion,id:"accordion"},UcommentModel:{label:e.comments,id:"comment"},UcontactModel:{label:e.contact_form,id:"contact"},UgalleryModel:{label:e.gallery,id:"gallery"},UimageModel:{label:e.image,id:"image"},LoginModel:{label:e.login,id:"login"},LikeBox:{label:e.like_box,id:"likebox"},MapModel:{label:e.map,id:"map"},UnewnavigationModel:{label:e.navigation,id:"nav"},ButtonModel:{label:e.button,id:"button"},PostsModel:{label:e.posts,id:"posts"},UsearchModel:{label:e.search,id:"search"},USliderModel:{label:e.slider,id:"slider"},SocialMediaModel:{label:e.social,id:"social"},UtabsModel:{label:e.tabs,id:"tab"},ThisPageModel:{label:e.page,id:"this_page"},ThisPostModel:{label:e.post,id:"this_post"},UwidgetModel:{label:e.widget,id:"widget"},UyoutubeModel:{label:e.youtube,id:"youtube"},PlainTxtModel:{label:e.text,id:"text"}};return t[l]}});return l});