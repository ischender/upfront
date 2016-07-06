!function(e,t){var n=Upfront.Settings&&Upfront.Settings.l10n?Upfront.Settings.l10n.global.views:Upfront.mainData.l10n.global.views;define(["scripts/upfront/upfront-views-editor/breakpoint/storage"],function(i){return t.View.extend({className:"breakpoint-edit-panel",template:'<div><span class="edit-breakpoint-popup-title">'+n.set_custom_breakpoint+':</span></div><div><label for="breakpoint-name">'+n.name+':</label><input type="text" value="{{ name }}" placeholder="'+n.custom_breakpoint_placeholder+'" id="breakpoint-name" /></div><div><label for="breakpoint-width">'+n.width+':</label><input type="number" min="240" max="1080" value="{{ width }}" id="breakpoint-width" /><label>'+n.px+'</label><label for="breakpoint-columns">'+n.number_of_columns+':</label><input min="5" max="24" type="number" value="{{ columns }}" id="breakpoint-columns" /></div>',events:{"change #breakpoint-name":"on_name_change","change #breakpoint-width":"on_width_change","change #breakpoint-columns":"on_columns_change"},initialize:function(e){this.options=e||{},_.isUndefined(this.model)&&(this.model=i.get_breakpoints().get_active()),this.listenTo(this.model,"change",this.update_values),this.lazy_change_width=_.debounce(function(e){this.model.set({width:e})},500)},render:function(){return this.$el.html(_.template(this.template,this.model.toJSON())),this},update_values:function(){this.$el.find("#breakpoint-name").val(this.model.get("name")),this.$el.find("#breakpoint-width").val(this.model.get("width")),this.$el.find("#breakpoint-columns").val(this.model.get("columns"))},on_name_change:function(t){this.model.set({name:e(t.currentTarget).val()})},on_width_change:function(t){this.lazy_change_width(e(t.currentTarget).val())},on_columns_change:function(t){this.model.set({columns:e(t.currentTarget).val()})}})})}(jQuery,Backbone);