define([
	'scripts/upfront/element-settings/settings',
	'scripts/upfront/preset-settings/preset-manager',
	'scripts/upfront/preset-settings/util',
	'scripts/upfront/preset-settings/typography-settings-item',
	'scripts/upfront/preset-settings/colors-settings-item',
	'scripts/upfront/preset-settings/border-settings-item',
	'scripts/upfront/preset-settings/hov-animation-settings-item',
	'text!elements/upfront-tabs/tpl/preset-style.html'
], function(ElementSettings, PresetManager, Util, TypographySettingsItem, ColorsSettingsItem, BorderSettingsItem, HovAnimationSettingsItem, styleTpl) {
	var l10n = Upfront.Settings.l10n.utabs_element;

	var TabsAppearance = PresetManager.extend({
		mainDataCollection: 'tabPresets',
		styleElementPrefix: 'tab-preset',
		ajaxActionSlug: 'tab',
		panelTitle: l10n.settings,
		presetDefaults: {
			'global-content-bg': 'rgb(255, 255, 255)',
			'global-useborder': '',
			'global-borderwidth': 1,
			'global-bordertype': 'solid',
			'static-bordercolor': 'rgb(0, 0, 0)',
			'static-font-size': 14,
			'static-font-family': 'Arial',
			'static-font-color': 'rgb(96, 96, 96)',
			'static-font-style': '400 normal',
			'static-weight': 400,
			'static-style': 'normal',
			'static-line-height': 1,
			'static-tab-bg': 'rgb(0, 0, 0)',
			'static-useborder': '',
			'static-borderwidth': 1,
			'static-bordertype': 'solid',
			'static-bordercolor': 'rgb(0, 0, 0)',
			'hover-bordercolor': 'rgb(0, 0, 0)',
			'hover-font-size': 14,
			'hover-font-family': 'Arial',
			'hover-font-color': 'rgb(96, 96, 96)',
			'hover-font-style': '400 normal',
			'hover-weight': 400,
			'hover-style': 'normal',
			'hover-line-height': 1,
			'hover-tab-bg': 'rgb(0, 0, 0)',
			'hover-useborder': '',
			'hover-borderwidth': 1,
			'hover-bordertype': 'solid',
			'hover-bordercolor': 'rgb(0, 0, 0)',
			'hover-transition-duration': 0.3,
			'hover-transition-easing': 'ease-in-out',
			'active-bordercolor': 'rgb(0, 0, 0)',
			'active-font-size': 14,
			'active-font-family': 'Arial',
			'active-font-color': 'rgb(96, 96, 96)',
			'active-font-style': '400 normal',
			'active-weight': 400,
			'active-style': 'normal',
			'active-line-height': 1,
			'active-tab-bg': 'rgb(0, 0, 0)',
			'active-useborder': '',
			'active-borderwidth': 1,
			'active-bordertype': 'solid',
			'active-bordercolor': 'rgb(0, 0, 0)',
			'id': 'default',
			'name': l10n.default_preset
		},
		styleTpl: styleTpl,
		stateFields: {
			Global: [
				{
					fieldClass: ColorsSettingsItem,
					options: {
						title: l10n.content_area_colors_label,
						multiple: false,
						single: true,
						abccolors: [
							{
								name: 'global-content-bg',
								label: l10n.content_area_bg_label
							},
						]
					}
				},
				{
					fieldClass: BorderSettingsItem,
					options: {
						state: 'static',
						title: '',
						fields: {
							use: 'global-useborder',
							width: 'global-borderwidth',
							type: 'global-bordertype',
							color: 'global-bordercolor',
						}
					}
				}
			],
			Static: [
				{
					fieldClass: ColorsSettingsItem,
					options: {
						title: l10n.colors_label,
						multiple: false,
						single: true,
						abccolors: [
							{
								name: 'static-tab-bg',
								label: l10n.tab_bg_label
							},
						]
					}
				},
				{
					fieldClass: TypographySettingsItem,
					options: {
						title: l10n.tab_typography_label,
						state: 'static',
						toggle: false,
						fields: {
							typeface: 'static-font-family',
							fontstyle: 'static-font-style',
							weight: 'static-weight',
							style: 'static-style',
							size: 'static-font-size',
							line_height: 'static-line-height',
							color: 'static-font-color',
						}
					}
				},
				{
					fieldClass: BorderSettingsItem,
					options: {
						state: 'static',
						title: '',
						fields: {
							use: 'static-useborder',
							width: 'static-borderwidth',
							type: 'static-bordertype',
							color: 'static-bordercolor',
						}
					}
				}
			],

			Hover: [
				{
					fieldClass: ColorsSettingsItem,
					options: {
						title: l10n.colors_label,
						multiple: false,
						single: true,
						toggle: true,
						fields: {
							use: 'hover-use-color',
						},
						abccolors: [
							{
								name: 'hover-tab-bg',
								label: l10n.tab_bg_label
							},
						]
					}
				},
				{
					fieldClass: TypographySettingsItem,
					options: {
						title: l10n.tab_typography_label,
						state: 'hover',
						toggle: true,
						fields: {
							use: 'hover-use-typography',
							typeface: 'hover-font-family',
							fontstyle: 'hover-font-style',
							weight: 'hover-weight',
							style: 'hover-style',
							size: 'hover-font-size',
							line_height: 'hover-line-height',
							color: 'hover-font-color',
						}
					}
				},
				{
					fieldClass: BorderSettingsItem,
					options: {
						state: 'hover',
						title: '',
						fields: {
							use: 'hover-useborder',
							width: 'hover-borderwidth',
							type: 'hover-bordertype',
							color: 'hover-bordercolor',
						}
					}
				},
				{
					fieldClass: HovAnimationSettingsItem,
					options: {
						state: 'hover',
						title: '',
						toggle: true,
						fields: {
							use: 'hover-use-transition',
							duration: 'hover-transition-duration',
							easing: 'hover-transition-easing',
						}
					}
				}
			],

			Active: [
				{
					fieldClass: ColorsSettingsItem,
					options: {
						title: l10n.colors_label,
						multiple: false,
						single: true,
						toggle: true,
						fields: {
							use: 'active-use-color',
						},
						abccolors: [
							{
								name: 'active-tab-bg',
								label: l10n.tab_bg_label
							},
						]
					}
				},
				{
					fieldClass: TypographySettingsItem,
					options: {
						title: l10n.tab_typography_label,
						state: 'active',
						toggle: true,
						fields: {
							use: 'active-use-typography',
							typeface: 'active-font-family',
							fontstyle: 'active-font-style',
							weight: 'active-weight',
							style: 'active-style',
							size: 'active-font-size',
							line_height: 'active-line-height',
							color: 'active-font-color',
						}
					}
				},
				{
					fieldClass: BorderSettingsItem,
					options: {
						state: 'active',
						title: '',
						fields: {
							use: 'active-useborder',
							width: 'active-borderwidth',
							type: 'active-bordertype',
							color: 'active-bordercolor',
						}
					}
				}
			]
		}
	});

	var TabsSettings = ElementSettings.extend({
		initialize: function (opts) {
			this.options = opts;
			var me = this;
			this.panels = _([
				new TabsAppearance({
					model: this.model
				})
			]);

			this.on('open', function(){
				me.model.trigger('settings:open', me);
			});
		},

		get_title: function () {
			return l10n.settings;
		}
	});

	// Generate presets styles to page
	Util.generatePresetsToPage('tab', styleTpl);

	return TabsSettings;
});
