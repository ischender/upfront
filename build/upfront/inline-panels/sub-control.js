!function(n){define(["scripts/upfront/inline-panels/item","scripts/upfront/inline-panels/control"],function(e,t){var i=Upfront.mainData.l10n.image_element,s=t.extend({multiControl:!0,events:{click:"onClickControl","click .upfront-inline-panel-item":"selectItem"},initialize:function(){var e=this;n(document).click(function(t){var i=n(t.target);i.closest("#page").length&&i[0]!==e.el&&!i.closest(e.el).length&&e.isOpen&&e.close()}),this.listenTo(Upfront.Events,"upfront:hide:subControl",this.close)},onClickControl:function(n){this.isDisabled||(n.preventDefault(),this.clicked(n),this.$el.siblings(".upfront-sub-control-dialog-open").removeClass("upfront-sub-control-dialog-open"),this.isOpen?this.close():(Upfront.Events.trigger("upfront:hide:subControl"),this.open()))},open:function(){this.isOpen=!0,this.$el.addClass("upfront-sub-control-dialog-open"),Upfront.Events.trigger("upfront:hide:paddingPanel"),this.trigger("panel:open");var n=this.$el.closest(".upfront-inline-panel");this.inline===!0&&n.removeClass("upfront-panels-shadow"),this.updateWidth()},close:function(){this.isOpen=!1,this.$el.removeClass("upfront-sub-control-dialog-open"),this.trigger("panel:close");var n=this.$el.closest(".upfront-inline-panel");this.inline===!0&&(n.hasClass("upfront-panels-shadow")||n.addClass("upfront-panels-shadow"))},render:function(){e.prototype.render.call(this,arguments);var t=this.$(".image-sub-control"),i=this;this.item_count=0,t.length||(t=n(this.inline===!0?'<div class="image-sub-control upfront-panels-shadow inline-panel-sub-control-no-dropdown inline-panel-sub-control-dialog"></div>':'<div class="image-sub-control upfront-panels-shadow inline-panel-sub-control-dialog"></div>'),this.$el.append(t)),_.each(this.sub_items,function(n,e){e===i.selected?n.setIsSelected(!0):n.setIsSelected(!1),i.inline===!0&&(n.panel_type="tooltip"),n.render(),n.delegateEvents(),t.append(n.$el),i.item_count++});var s='<span class="upfront-control-arrow"></span>';this.$el.find(".image-sub-control").prepend(s)},updateWidth:function(){this.$el.find(".image-sub-control").css("width",28*this.item_count+2),this.$el.find(".upfront-inline-panel-item").show()},get_selected_item:function(){return this.selected},setDisabled:function(n){this.isDisabled=n,n?this.tooltip=i.ctrl.caption_position_disabled:this.tooltip=i.ctrl.caption_display}});return s})}(jQuery);