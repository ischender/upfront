define([
	'scripts/upfront/preset-settings/show-state-settings-button',
	'scripts/upfront/preset-settings/state-settings'
], function(ShowStateSettingsButton, StateSettings) {
	var l10n = Upfront.Settings.l10n.preset_manager;
	
	var EditPresetItem = Upfront.Views.Editor.Settings.Item.extend({
		className: 'preset_specific',

		initialize: function(options) {
			this.options = options || {};

			this.listenTo(this.model, 'change', this.onPresetUpdate);
			
			var me = this,
				firstStateButton = false,
				firstStateSettings = false;
			
			if((Upfront.Application.get_current() === Upfront.Application.MODE.THEME || this.options.model.get('theme_preset') !== true) 
					&& this.options.model.get('id') !== 'default') {
				var fields = [
					new Upfront.Views.Editor.Field.Button({
						model: this.model,
						label: l10n.delete_label,
						className: 'delete_preset',
						compact: true,
						on_click: function() {
							me.deletePreset();
						}
					})
				];
			} else if(Upfront.Application.get_current() !== Upfront.Application.MODE.THEME 
						&& (this.options.model.get('id') === 'default' || this.options.model.get('theme_preset') === true)) {
				var fields = [
					new Upfront.Views.Editor.Field.Button({
						model: this.model,
						label: 'Reset',
						className: 'delete_preset',
						compact: true,
						on_click: function() {
							me.resetPreset();
						}
					})
				];
			} else {
				var fields = [];
			}
			
			// First add global fields
			_.each(this.options.stateFields, function(stateFields, state) {
				if(state === "Global") {
					var stateSettings = new StateSettings({
						model: this.model,
						fields: stateFields,
						state: state
					});
					fields.push(stateSettings);
				}
			}, this);

			// First add settings state selectors
			_.each(this.options.stateFields, function(stateFields, state) {
				if(state !== "Global") {
					var showStateButton = new ShowStateSettingsButton({
						state: state
					});
					fields.push(showStateButton);
					this.listenTo(showStateButton, 'upfront:presets:state_show', this.showState);

					if (!firstStateButton) {
						firstStateButton = showStateButton;
					}
				}
			}, this);

			// Than add settings state settings
			_.each(this.options.stateFields, function(stateFields, state) {
				if(state !== "Global") {
					var stateSettings = new StateSettings({
						model: this.model,
						fields: stateFields,
						state: state
					});
					fields.push(stateSettings);
					if (!firstStateSettings) {
						firstStateSettings = stateSettings;
					} else {
						stateSettings.$el.hide();
					}
				}
			}, this);

			firstStateButton.$el.addClass('active');
			firstStateSettings.$el.show();

			this.fields =_(fields);
		},
		
		onPresetUpdate: function() {
			this.trigger('upfront:presets:update', this.model.toJSON());
		},

		deletePreset: function() {
			this.trigger('upfront:presets:delete', this.model);
		},
		
		resetPreset: function() {
			this.trigger('upfront:presets:reset', this.model);
		},

		showState: function(state) {
			this.$el.find('.state_settings_button').removeClass('active');
			this.$el.find('.state_settings_button_' + state).addClass('active');
			this.$el.find('.state_settings').hide();
			this.$el.find('.state_settings_' + state).show();
		}
	});

	return EditPresetItem;
});
