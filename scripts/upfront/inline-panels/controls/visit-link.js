define([
	'scripts/upfront/inline-panels/control'
], function (Control) {
	var VisitLinkControl = Control.extend({
		initialize: function(options) {
			this.options = options || {};
			this.constructor.__super__.initialize.call(this, options);
			this.setOptions(this.options.url, this.options.type);
		},

		setOptions: function(url, type) {
			var theType = type ? type : Upfront.Util.guessLinkType(url);
			this.url = url;
			this.icon = 'visit-link-' + theType,
			this.label = this.getTextByLinkType(theType);
		},

		clicked: function(event) {
			this.constructor.__super__.clicked.call(this, event);
			if(this.url !== "") {
				Upfront.Util.visitLink(this.url);
			}
		},

		setLink: function(url, type) {
			this.setOptions(url, type);
			this.render();
		},

		getTextByLinkType: function(linktype) {
			switch(linktype) {
				case 'unlink':
					return 'Not Linked';
				case 'lightbox':
					return 'Open Lightbox';
				case 'anchor':
					return 'Scroll to Anchor';
				case 'entry':
					return 'Go To Post / Page';
				case 'external':
					return 'Open Ext. Link';
				case 'email':
						return 'Send Email';
			};
		},

	});

	return VisitLinkControl;
});
