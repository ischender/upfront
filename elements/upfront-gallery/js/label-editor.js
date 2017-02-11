(function ($) {
define([
	'text!elements/upfront-gallery/js/templates/label-editor-template.html',
	'text!elements/upfront-gallery/js/templates/label-selector-template.html',
	'text!elements/upfront-gallery/js/templates/labels-template.html'
], function(labelEditorTpl, labelSelectorTpl, labelsTpl) {
	var l10n = Upfront.Settings.l10n.gallery_element;

	var LabelEditor = Backbone.View.extend({
		template: _.template(labelEditorTpl),
		labelSelectorTpl: _.template(labelSelectorTpl),

		events: {
			'keyup .labels_filter .filter': 'fill_suggestion_list',
			'keydown .labels_filter .filter': 'on_field_keydown',
			'click .labels_filter .filter': 'on_field_click',
			'click .labels_filter label': 'remove_label',
			'click .ugallery-magnific-addbutton': 'focus_name_field',
			"click .new_labels .toggle-add-label": "show_add_label",
		},

		initialize: function(options) {
			this.options = options || {};
			this.gallery = options.gallery;
			this.labels = options.labels;
			this.imageId = options.imageId;
		},

		/*?
		 * Prevent crazy click hijack that navigates and reloads the page.
		 */
		on_field_click: function(event) {
			$(event.target).focus();
			event.preventDefault();
			event.stopPropagation();
			return false;
		},

		updateLabels: function() {
			this.$el.find('.ugallery-magnific-wrapper').html(_.template(labelsTpl, {labels: this.labels, l10n: l10n.template}));
			if (this.labels.length) {
				this.$el.parents('.inline-panel-control-dialog')
					.siblings('.upfront-icon-region-edit-labels-no-labels')
					.removeClass('upfront-icon-region-edit-labels-no-labels')
					.addClass('upfront-icon-region-edit-labels');
			} else {
				this.$el.parents('.inline-panel-control-dialog')
					.siblings('.upfront-icon-region-edit-labels')
					.removeClass('.upfront-icon-region-edit-labels')
					.addClass('upfront-icon-region-edit-labels-no-labels');
			}
 		},

		render: function() {
			this.$el.html(this.template({
				labels: _.template(labelsTpl, {labels: this.labels, l10n: l10n.template}),
				imageId: this.imageId,
				l10n: l10n.template,
				selection: this.selection
			}));

			return this;
		},
		
		show_add_label: function (e) {
			e.preventDefault();
			e.stopPropagation();
			var $hub = this.$el.find(".new_labels");
			$hub.addClass('active');
		},
	
		focus_name_field: function() {
			var $addlabels = this.$el.find('.ugallery-addlabels');
			if ( $addlabels.val() === '' )
				$addlabels.focus();
			else
				this.addLabel($addlabels);
		},

		fill_suggestion_list: function(e) {
			var me = this;

			if([9, 13, 38, 40, 27].indexOf(e.which) !== -1) {
				return;
			}

			var val = $(e.target).val(),
				allLabels = _.keys(Upfront.data.ugallery.label_names),
				labels = [];

			if(val.length < 2) {
				return $('.labels_list').html('');
			}

			_.each(allLabels, function(label){
				if(label.indexOf(val) !== -1){
					var lab = Upfront.data.ugallery.label_names[label];

					if(!_.findWhere(me.labels, { id: lab.id + '' }) && !_.findWhere(me.labels, { id: parseInt(lab.id, 10)})){
						labels.push({
							id: lab.id,
							text: lab.text.replace(val, '<span class="selection">' + val + '</span>')
						});
					}
				}
			});
			
			if (labels.length > 0) this.$el.find('.upfront-additive_multiselection').addClass('has_match');
				else this.$el.find('.upfront-additive_multiselection').removeClass('has_match');

			this.$el.find('.labels_list').html(me.labelSelectorTpl({labels: labels, l10n: l10n.template}));
		},

		selectNextSuggestion: function() {
			var selected,
				suggestions,
				currentIdx = -1,
				idx = 0;

			suggestions = this.$el.find('.labels_list li');

			if(!suggestions.length){
				return;
			}

			selected = suggestions.find('label.selected');

			if(selected.length){
				selected.removeClass('selected');
			}

			while(idx < suggestions.length && currentIdx === -1){
				currentIdx = suggestions[idx] === selected.parent()[0] ? idx : -1;
				idx++;
			}

			if(currentIdx === -1) {
				$(suggestions[0]).find('label').addClass('selected');
			} else if(currentIdx < suggestions.length - 1) {
				$(suggestions[currentIdx + 1]).find('label').addClass('selected');
			}
		},

		selectPreviousSuggestion: function() {
			var selected,
				suggestions,
				currentIdx = -1,
				idx = 0;

			suggestions = this.$el.find('.labels_list li');

			selected = suggestions.find('label.selected');

			if(selected.length){
				selected.removeClass('selected');
			}

			while(idx < suggestions.length && currentIdx === -1){
				currentIdx = suggestions[idx] === selected.parent()[0] ? idx : -1;
				idx++;
			}

			if(currentIdx === -1) {
				$(suggestions[suggestions.length -1]).find('label').addClass('selected');
			} else if(currentIdx > 0) {
				$(suggestions[currentIdx - 1]).find('label').addClass('selected');
			}
		},

		on_field_keydown: function(e) {
			if (_.indexOf([13, 9, 40, 38, 27], e.which) !== -1) {
				e.preventDefault();
			}

			switch (e.which) {
				case 13: // Enter
					this.addLabel($(e.target));
					break;
				case 9: // Tab
				case 40: // Down
					this.selectNextSuggestion();
					break;
				case 38: // Up
					this.selectPreviousSuggestion();
					break;
				case 27: // Escape
					this.clearSuggestions();
			}
		},

		clearSuggestions: function() {
			this.$el.find('.labels_list').html('');
		},

		addLabel: function($nameField) {
			var selected = this.$el.find('.labels_list label.selected'),
				me = this,
				label,
				labelId;

			if(!selected.length){
				label = $.trim($nameField.val());
				if(label.length){
					$nameField.val('').siblings('.labels_list').html('');
					$.when(this.gallery.addLabel(label, this.imageId)).done(function(label) {
						me.labels.push(label);
						me.updateLabels();
						$nameField.val('').siblings('.labels_list').html('');
					});
				}

				return;
			}

			labelId = selected.attr('rel');
			label = Upfront.data.ugallery.label_ids[labelId];

			this.labels.push(label);
			this.updateLabels();

			$nameField.val('').siblings('.labels_list').html('');
			this.gallery.addLabel(label.text, this.imageId);
		},

		remove_label: function(e){
			e.preventDefault();

			var $label = $(e.target),
				me = this,
				labelId = $label.data('idx'),
				data,
				label;

			data = {
				action: 'upfront-media-disassociate_label',
				'term': labelId,
				'post_id': this.imageId
			};

			Upfront.Util.post(data);
			label = _.findWhere(this.labels, { id: labelId + ''}) || _.findWhere(this.labels, { id: parseInt(labelId, 10)});
			this.labels = _.without(this.labels, label);

			this.gallery.deleteLabel(labelId, this.imageId);
			
			if (!$label.is( "li" )) {
				$label = $label.closest('li');
			}

			$label.fadeOut('fast', function(){
				$(this).remove();
				if (me.labels.length === 0) {
					me.updateLabels();
				}
			});
		}
	});

	return LabelEditor;
});
})(jQuery);
