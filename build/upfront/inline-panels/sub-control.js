(function(e){define(["scripts/upfront/inline-panels/item","scripts/upfront/inline-panels/control"],function(t,n){var r=Upfront.mainData.l10n.image_element,i=n.extend({multiControl:!0,events:{click:"onClickControl","click .upfront-inline-panel-item":"selectItem"},initialize:function(){var t=this;e(document).click(function(n){var r=e(n.target);r.closest("#page").length&&r[0]!==t.el&&!r.closest(t.el).length&&t.isOpen&&t.close()})},onClickControl:function(e){if(this.isDisabled)return;e.preventDefault(),this.clicked(e),this.$el.siblings(".upfront-sub-control-dialog-open").removeClass("upfront-sub-control-dialog-open"),this.isOpen?this.close():this.open()},open:function(){this.isOpen=!0,this.$el.addClass("upfront-sub-control-dialog-open")},close:function(){this.isOpen=!1,this.$el.removeClass("upfront-sub-control-dialog-open")},render:function(){t.prototype.render.call(this,arguments);var n=this.$(".image-sub-control"),r=this,i,s=0;n.length||(n=e('<div class="image-sub-control inline-panel-sub-control-dialog"></div>'),this.$el.append(n)),_.each(this.sub_items,function(e,t){t===r.selected?e.setIsSelected(!0):e.setIsSelected(!1),e.render(),n.append(e.$el),s++}),this.$el.find(".image-sub-control").css("width",38*s)},get_selected_item:function(){return this.selected},setDisabled:function(e){this.isDisabled=e,e?this.tooltip=r.ctrl.caption_position_disabled:this.tooltip=r.ctrl.caption_display}});return i})})(jQuery);