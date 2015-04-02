jQuery(function($){
	if(typeof uimages != 'undefined'){
		var resizeWithText = function() {
			console.log('Resizing!!');
			var caption = this.content.find('figcaption'),
				maxHeight = this.wH - 120 - caption.outerHeight(),
				maxWidth = $(window).width() - 200
			;

			this.content.find('img').css({
				'max-width': maxWidth,
				'max-height': maxHeight
			});
		};

		/**
		 * re-Resize Magnific Popup 100ms after MFP open (iPhone issue) 
		 */
		var resizeMFP = function() {
			setTimeout(function(){
				$.magnificPopup.instance.updateSize();
			}, 100);
		};

		for(var imageId in uimages){
			var magOptions = uimages[imageId];
			magOptions.callbacks = {resize: resizeWithText, open: resizeMFP};
			$('#' + imageId).magnificPopup(magOptions);
		}
	}
});
