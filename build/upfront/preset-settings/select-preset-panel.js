define(["scripts/upfront/preset-settings/select-preset-item","scripts/upfront/preset-settings/new-preset-item","scripts/upfront/element-settings/panel"],function(e,t,n){var r=n.extend({className:"preset-manager-panel",initialize:function(n){this.options=n,this.newPresetItem=new t({model:this.model}),this.selectPresetItem=new e({model:this.model,presets:this.options.presets}),this.listenTo(this.newPresetItem,"upfront:presets:new",this.createPreset),this.listenTo(this.selectPresetItem,"upfront:presets:edit",this.editPreset),this.settings=_([this.selectPresetItem,this.newPresetItem])},createPreset:function(e){this.trigger("upfront:presets:new",e)},editPreset:function(e){this.trigger("upfront:presets:edit",e)}});return r});