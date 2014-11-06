/*global ugalleries */
jQuery(function($){

	var updateHorizonalPadding =  function(gallery, absolute) {
		var container = gallery.find('.ugallery_items').width(),
			items = gallery.find('.ugallery_labels').length ? gallery.find('.ugallery_item.filtered') : gallery.find('.ugallery_item'),
			itemWidth = items.outerWidth(),
			row = 0,
			columns,
			even_padding,
			thumbPaddingData,
			thumbPadding,
			itemsTotalWidth;

		even_padding = gallery.data('even-padding');
		thumbPaddingData = gallery.data('thumb-padding');
		thumbPadding = typeof thumbPaddingData === 'undefined' ? 15 : thumbPaddingData;
		columns = Math.floor(container / (itemWidth + thumbPadding));
		columns++;// Increase for 1 besause upper calculation will always give one less
		itemsTotalWidth = columns * itemWidth + (columns - 1) * thumbPadding;
		if (itemsTotalWidth > container) {// But check if got too much
			columns--;
		}

		items.each(function(item_index) {
			var $this = $(this);

			if (absolute) {
				// Set top margin for all thumbs that are not in first row
				if (item_index + 1 > columns && even_padding) {
					$this.css('top', parseInt($this.css('top'), 10) + thumbPadding * row);
				}

				if (item_index > 0 && (item_index + 1) % columns === 0) {
					row++;
					if (even_padding && !gallery.data('height-adjusted')) {
						gallery.css('height', parseInt(gallery.css('height'), 10) + thumbPadding);
					}
				}
			} else {
				// Set top margin for all thumbs that are not in first row
				if (item_index + 1 > columns && even_padding) {
					$this.css('margin-top', thumbPadding);
				}
			}
		});

		if (absolute && !gallery.data('height-adjusted')) {
			gallery.css('height', parseInt(gallery.css('height'), 10) - parseInt(items.css('margin-bottom'), 10));
		}

		gallery.data('height-adjusted', true);
	};

	var bindShuffle = function($ugallery_grid) {
		var $grids = $ugallery_grid || $('.ugallery_grid');

		$grids.each(function(){
			var grid = $(this),
				thumbPaddingData = grid.parent().data('thumb-padding'),
				thumbPadding = typeof thumbPaddingData === 'undefined' ? 15 : thumbPaddingData;

			grid.parent().data('height-adjusted', false);

			grid.on('layout.shuffle', function(){
				setTimeout(function(){
					updateHorizonalPadding(grid.parent(), true);
				}, 20);
			});

			grid.shuffle({
				itemSelector: '#' + $(this).attr('rel') + ' .ugallery_item',
				gutterWidth: thumbPadding,
				supported: false
			});

			grid.siblings('.ugallery_labels').on('click', '.ugallery_label_filter', function(e) {
				var filter;

				e.preventDefault();
				$(e.delegateTarget).find('a.filter_selected').removeClass('filter_selected');
				filter = $(e.target).addClass('filter_selected').attr('rel');
				grid.shuffle('shuffle', filter);
			});
		});
	};

	bindShuffle();

	$(document).on('upfront-load', function() {
		Upfront.frontFunctions = Upfront.frontFunctions || {};
		Upfront.frontFunctions.galleryBindShuffle = bindShuffle;
	});

	if (typeof ugalleries !== 'undefined') {
		var titleSrc = function(item){
			var itemId = item.el.closest('.ugallery_item').attr('rel'),
				text = gallery.find('.ugallery_lb_text[rel=' + itemId + ']')
			;
			if (text.length) {
				return text.html();
			}
			return '';
		};

		var resizeWithText = function() {
			var caption = this.content.find('figcaption'),
				maxHeight = this.wH - 120 - caption.outerHeight(),
				maxWidth = $(window).width() - 200
			;

			this.content.find('img').css({
				'max-width': maxWidth,
				'max-height': maxHeight
			});
		};
		var gallery, magOptions;
		for (var galleryId in ugalleries) {
			gallery = false;
			magOptions = ugalleries[galleryId].magnific;
			if (magOptions){
				gallery = $('#' + galleryId).find('.ugallery_item');
				if (ugalleries[galleryId].useLightbox) {
					magOptions.image = {
						titleSrc: titleSrc
					};
				}

				magOptions.callbacks = {resize: resizeWithText, afterChange: resizeWithText};
				gallery.magnificPopup(magOptions);
			} else {
				gallery = $('#' + galleryId).find('.ugallery_lightbox_link');
				magOptions = {
					type: 'image',
					gallery: {
						enabled: 'true',
						tCounter: '<span class="mfp-counter">%curr% / %total%</span>'
					},
					titleSrc: 'title',
					verticalFit: true,
					image: {
						markup: ugalleries[galleryId].template.markup,
						titleSrc: 'title',
						verticalFit: true
					},
					callbacks: {resize: resizeWithText, afterChange: resizeWithText}
				};
				gallery.magnificPopup(magOptions);
			}
		}

		setTimeout(function(){
			$(window).trigger('resize');
		}, 300);
	}

	$(window).on('resize', function(){
		$('.ugallery').each(function(){
			var gallery = $(this);
			if(!gallery.children('.ugallery_grid').length) {
				updateHorizonalPadding(gallery, false);
			}
		});
	});
});
