(function($) {
	
var l10n = Upfront.Settings && Upfront.Settings.l10n
	? Upfront.Settings.l10n.global.views
	: Upfront.mainData.l10n.global.views
;

define([
	'scripts/upfront/bg-settings/mixins'
], function(Mixins) {
	
	var MapItem = Upfront.Views.Editor.Settings.Item.extend(_.extend({}, Mixins, {
		group: false,
		initialize: function (options) {
			var me = this,
				map_center = this.model.get_property_value_by_name('background_map_center'),
				set_value = function () {
					var value = this.get_value();
					this.model.set_breakpoint_property(this.property_name, value);
				};
				
			if ( ! map_center ){
				this.model.init_property('background_map_center', [10.722250, 106.730762]);
				this.model.init_property('background_map_zoom', 10);
				this.model.init_property('background_map_style', "ROADMAP");
				this.model.init_property('background_map_controls', "");
			}
			
			var fields = {
					location: new Upfront.Views.Editor.Field.Text({
						model: this.model,
						label: l10n.location + ":",
						property: 'background_map_location',
						use_breakpoint_property: true,
						placeholder: "e.g 123 Nice St",
						change: function () {
							var value = this.get_value();
							this.model.set_breakpoint_property(this.property_name, value, true);
							me._location = value;
							me._location_changed = true;
						},
						rendered: function (){
							this.$el.addClass('uf-bgsettings-map-location');
						}
					}),
					refresh: new Upfront.Views.Editor.Field.Button({
						label: "",
						compact: true,
						classname: 'upfront-field-icon upfront-field-icon-refresh-2 upfront-refresh-map',
						on_click: function(){
							me.geocode_location();
						}
					}),
					zoom: new Upfront.Views.Editor.Field.Slider({
						model: this.model,
						label: l10n.zoom + ":",
						property: 'background_map_zoom',
						use_breakpoint_property: true,
						default_value: 8,
						min: 1,
						max: 19,
						step: 1,
						change: set_value,
						rendered: function (){
							this.$el.addClass('uf-bgsettings-map-zoom');
						}
					}),
					style: new Upfront.Views.Editor.Field.Select({
						model: this.model,
						label: l10n.map_style + ":",
						property: 'background_map_style',
						use_breakpoint_property: true,
						values: [
							{ label: l10n.roadmap, value: 'ROADMAP' },
							{ label: l10n.satellite, value: 'SATELLITE' },
							{ label: l10n.hybrid, value: 'HYBRID' },
							{ label: l10n.terrain, value: 'TERRAIN' }
						],
						change: set_value,
						rendered: function (){
							this.$el.addClass('uf-bgsettings-map-style');
						}
					}),
					controls: new Upfront.Views.Editor.Field.Select({
						model: this.model,
						label: l10n.controls + ":",
						placeholder: l10n.choose_ctrl,
						property: 'background_map_controls',
						use_breakpoint_property: true,
						multiple: true,
						default_value: ["pan"],
						values: [
							{ label: l10n.pan, value: "pan" },
							{ label: l10n.zoom, value: "zoom" },
							{ label: l10n.map_type, value: "map_type" },
							{ label: l10n.scale, value: "scale" },
							{ label: l10n.street_view, value: "street_view" },
							{ label: l10n.overview_map, value: "overview_map" }
						],
						change: set_value,
						rendered: function (){
							this.$el.addClass('uf-bgsettings-map-controls');
						}
					})
				};
			
			this.$el.addClass('uf-bgsettings-item uf-bgsettings-mapitem');
			
			options.fields = _.map(fields, function(field){ return field; });
			
			this._location = fields.location.get_value();
			
			this.$el.on('keypress', 'input[name="background_map_location"]', function (e) {
				if( e.keyCode === 13 ){
					me._location = $(this).val();
					me._location_changed = true;
					me.geocode_location();
				}
			});
			
			this.bind_toggles();
			this.constructor.__super__.initialize.call(this, options);
		},
		geocode_location: function () {
			if ( this._geocoding == true || !this._location_changed )
				return;
			var me = this,
				location = this._location,
				geocoder = new google.maps.Geocoder();
			this._geocoding = true;
			geocoder.geocode({address: location}, function (results, status) {
				if (status != google.maps.GeocoderStatus.OK) return false;
				var pos = results[0].geometry.location;

				me.model.set_breakpoint_property("background_map_center", [pos.lat(), pos.lng()]);
				me._geocoding = false;
				me._location_changed = false;
			});
		}
	}));

	return MapItem;
});
})(jQuery);
