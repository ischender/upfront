!function(t,e){Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/upfront-views-editor/mixins"],function(i){return e.View.extend(_.extend({},i.Upfront_Icon_Mixin,{className:"upfront-settings-item-tab-wrap",radio:!1,is_default:!1,events:{"click .upfront-settings-item-tab":"reveal"},initialize:function(t){this.options=t,this.settings=t.settings?_(t.settings):_([]),this.radio="undefined"!=typeof t.radio?t.radio:this.radio,this.is_default="undefined"!=typeof t.is_default?t.is_default:this.is_default},get_title:function(){return this.options.title?this.options.title:""},get_icon:function(){return this.options.icon?this.options.icon:""},get_property:function(){return this.options.property?this.options.property:""},get_value:function(){return this.options.value?this.options.value:""},get_property_model:function(){var t=this.get_property();return t?this.model.get_property_by_name(t):!1},get_property_value:function(){var t=this.get_property_model();return t?t.get("value"):""},render:function(){var e=this;this.$el.html(""),this.$el.append('<div class="upfront-settings-item-tab" />'),this.$el.append('<div class="upfront-settings-item-tab-content" />');var i=this.$el.find(".upfront-settings-item-tab"),s=this.$el.find(".upfront-settings-item-tab-content");if(this.radio){var n=this.get_property_model();n||this.is_default&&this.model.init_property(this.get_property(),this.get_value());var r=this.cid+"-"+this.get_property(),o=t('<label for="'+r+'" />'),a=this.get_property_value()==this.get_value();o.append(this.get_icon_html(this.get_icon())),o.append('<span class="upfront-settings-item-tab-radio-text">'+this.get_title()+"</span>"),i.append(o),i.append('<input type="radio" id="'+r+'" class="upfront-field-radio" name="'+this.get_property()+'" value="'+this.get_value()+'" '+(a?'checked="checked"':"")+" />"),this.$el.addClass("upfront-settings-item-tab-radio")}else i.text(this.get_title());this.settings.each(function(t){t.panel=e.panel,t.render(),s.append(t.el)}),this.listenTo(this.panel,"rendered",this.panel_rendered),this.trigger("rendered")},conceal:function(){this.$el.removeClass("upfront-settings-item-tab-active")},reveal:function(){this.panel.settings.invoke("conceal"),this.$el.addClass("upfront-settings-item-tab-active"),this.radio&&this.$el.find(".upfront-settings-item-tab input").prop("checked",!0).trigger("change")},panel_rendered:function(){this.radio&&this.get_property_value()==this.get_value()&&this.reveal()},save_fields:function(){if(this.settings.invoke("save_fields"),this.radio&&this.$el.find(".upfront-settings-item-tab input:checked").size()>0){var t=this.get_property_model();t?t.set({value:this.get_value()},{silent:!0}):this.model.init_property(this.get_property(),this.get_value()),this.get_property_value()!=this.get_value()&&(this.panel.is_changed=!0)}},remove:function(){this.settings&&this.settings.each(function(t){t.remove()}),e.View.prototype.remove.call(this)}}))})}(jQuery,Backbone);