(function ($) {

define([
		'text!elements/upfront-image/tpl/image.html',
		'text!elements/upfront-image/tpl/image_editor.html',
		'text!elements/upfront-gallery/tpl/ugallery_editor.html'
	], function(imageTpl, editorTpl, galleryTpl) {

var $editorTpl = $(editorTpl);

var UimageModel = Upfront.Models.ObjectModel.extend({
	init: function () {
		var properties = _.clone(Upfront.data.uimage.defaults);
		properties.element_id = Upfront.Util.get_unique_id(properties.id_slug);
		this.init_properties(properties);
	}
});

var UimageView = Upfront.Views.ObjectView.extend(_.extend({}, /*Upfront.Mixins.FixedObjectInAnonymousModule,*/ {
	model: UimageModel,
	imageTpl: Upfront.Util.template(imageTpl),
	selectorTpl: _.template($editorTpl.find('#selector-tpl').html()),
	progressTpl: _.template($editorTpl.find('#progress-tpl').html()),
	linkTpl: _.template($editorTpl.find('#link-tpl').html()),
	formTpl: _.template($editorTpl.find('#upload-form-tpl').html()),
	sizehintTpl: _.template($editorTpl.find('#sizehint-tpl').html()),
	sizes: false,
	elementSize: {width: 0, height: 0},
	imageId: 0,
	imageSize: {width: 0, height: 0},
	imageOffset: {top: 0, left: 0},
	maskOffset: {top: 0, left: 0},
	imageInfo : false,
	controls: false,
	editor: false,

	//Temporary props for element resizing and cropping
	temporaryProps: {
		size: false,
		position: false
	},
	cropTimer: false,
	stoppedTimer : false,
	cropTimeAfterResize: 10000,

	cssSelectors: {
		'.upfront-image': {label: 'Image element', info: 'The whole image element'},
		'.wp-caption': {label: 'Caption panel', info: 'Caption layer'},
		'.upfront-image-container': {label: 'Image wrapper', info: 'Image container'}
	},

	initialize: function(){
		var me = this;
		if(! (this.model instanceof UimageModel)){
			this.model = new UimageModel({properties: this.model.get('properties')});
		}
		this.events = _.extend({}, this.events, {
			'click a.upfront-image-select': 'openImageSelector',
			'click div.upfront-quick-swap': 'openImageSelector',
			'dblclick .wp-caption': 'editCaption'
		});
		this.delegateEvents();

		this.bodyEventHandlers = {
			dragover: function(e){
				e.preventDefault();
				me.handleDragEnter(e);
			},
			dragenter: function(e){
				me.handleDragEnter(e);
			},
			dragleave: function(e){
				me.handleDragLeave(e);
			},
			drop: function(e){
				console.log('drop body');
			}
		}

		$('body').on('dragover', this.bodyEventHandlers.dragover)
			.on('dragenter', this.bodyEventHandlers.dragenter)
			.on('dragleave', this.bodyEventHandlers.dragleave)
			.on('drop', this.bodyEventHandlers.drop)
		;

		// Set the full size current size if we don't have attachment id
		if(!this.property('image_id'))
			this.property('srcFull', this.property('src'));

		this.listenTo(this.model.get("properties"), 'change', this.render);
		this.listenTo(this.model.get("properties"), 'add', this.render);
		this.listenTo(this.model.get("properties"), 'remove', this.render);

		this.listenTo(this.model, 'uimage:edit', this.editRequest);

		this.controls = this.createControls();

		if(this.property('image_status') != 'ok' || this.property('quick_swap'))
			this.property('has_settings', 0);

		this.listenTo(Upfront.Events, 'upfront:element:edit:start', this.on_element_edit_start);
		this.listenTo(Upfront.Events, 'upfront:element:edit:stop', this.on_element_edit_stop);

		this.listenTo(Upfront.Events, 'command:layout:save', this.saveResizing);
		this.listenTo(Upfront.Events, 'command:layout:save_as', this.saveResizing);

		this.sizeClasses = {
			narrow: false,
			small: false,
			tiny: false
		};
	},

	getSelectedAlignment: function(){
		if(!this.property('include_image_caption'))
			return 'nocaption';
		if(this.property('caption_position') == 'below_image')
			return 'below';

		var align = this.property('caption_alignment');

		switch(align){
			case 'top':
				return 'topOver';
			case 'bottom':
				return 'bottomOver';
			case 'fill':
				return 'topCover';
			case 'fill_middle':
				return 'middleCover';
			case 'fill_bottom':
				return 'bottomCover';
		}

		return 'nocaption';
	},

	createControls: function() {
		var me = this,
			panel = new ControlPanel(),
			multi = new TooltipControl()
		;
		multi.sub_items = {
			topOver: this.createControl('topOver', 'Over image, top'),
			bottomOver: this.createControl('bottomOver', 'Over image, bottom'),
			topCover: this.createControl('topCover', 'Covers image, top'),
			middleCover: this.createControl('middleCover', 'Covers image, middle'),
			bottomCover: this.createControl('bottomCover', 'Covers image, bottom'),
			below: this.createControl('below', 'Below the image'),
			nocaption: this.createControl('nocaption', 'No caption')
		};

		multi.icon = 'caption';
		multi.tooltip = 'Caption position';
		multi.selected = this.getSelectedAlignment();

		this.listenTo(multi, 'select', function(item){
			switch(item){
				case 'topOver':
					me.property('include_image_caption', [1]);
					me.property('caption_position', 'over_image');
					me.property('caption_alignment', 'top');
					break;
				case 'bottomOver':
					me.property('include_image_caption', [1]);
					me.property('caption_position', 'over_image');
					me.property('caption_alignment', 'bottom');
					break;
				case 'topCover':
					me.property('include_image_caption', [1]);
					me.property('caption_position', 'over_image');
					me.property('caption_alignment', 'fill');
					break;
				case 'middleCover':
					me.property('include_image_caption', [1]);
					me.property('caption_position', 'over_image');
					me.property('caption_alignment', 'fill_middle');
					break;
				case 'bottomCover':
					me.property('include_image_caption', [1]);
					me.property('caption_position', 'over_image');
					me.property('caption_alignment', 'fill_bottom');
					break;
				case 'below':
					me.property('include_image_caption', [1]);
					me.property('caption_position', 'below_image');
					break;
				case 'nocaption':
					me.property('include_image_caption', false);
			}
			me.render();
		});

		panel.items = _([
			this.createControl('crop', 'Edit image', 'editRequest'),
			this.createControl('link', 'Link image', 'openLinkEditor'),
			multi
		]);

		return panel;
	},

	openLinkEditor: function(e) {
		e.preventDefault();
		var me = this,
			tplOptions = this.extract_properties(),
			contents
		;
		tplOptions.checked = 'checked="checked"';
		contents = $('<div/>').append(this.linkTpl(tplOptions))
			.on('change', 'input[name=ugallery-image-link]', function(ev){
				me.linkChanged(ev);
			})
			.on('click', 'button.upfront-save_settings', function(e){
				me.saveLink(e);
			})
			.on('click', '.ugallery-change-link-post', function(ev){
				me.linkChanged(ev);
			})
		;
		this.openTooltip(contents, $(e.target));
	},

	linkChanged: function(e){
		var me = this,
			val = $('#ugallery-tooltip').find('input[name=ugallery-image-link]:checked').val()
		;

		if(val == 'external'){
			$('#ugallery-image-link-url').show();
		}
		else{
			$('#ugallery-image-link-url').hide();
			if(val == 'post' || e.type != 'change'){
				var selectorOptions = {
						postTypes: this.postTypes()
					}
				;
				this.closeTooltip();

				Upfront.Views.Editor.PostSelector.open(selectorOptions).done(function(post){
					me.property('when_clicked', val);
					me.property('image_link', post.get('permalink'));
				});
			}
		}

	},
	saveLink: function(e){
		var tooltip = $('#ugallery-tooltip'),
			linkVal = tooltip.find('input[name=ugallery-image-link]:checked').val(),
			urlVal = tooltip.find('#ugallery-image-link-url').val()
		;
		this.property('when_clicked', linkVal);

		if((linkVal == 'external' || linkVal == 'post') && urlVal){
			this.property('image_link', urlVal);
		}
		else if(linkVal == 'show_larger_image') {
			this.property('image_link', this.property('srcFull'));
		}
		else{
			this.property('image_link', '');
		}

		this.closeTooltip();
		return this.render();
	},

	openTooltip: function(content, element){
		var tooltip = $('#ugallery-tooltip'),
			elementPosition = element.offset(),
			tooltipPosition = {
				top: elementPosition.top + element.outerHeight(),
				left: elementPosition.left - 125 + Math.floor(element.outerWidth() / 2)
			},
			tooltipClass = 'ugallery-tooltip-bottom',
			me = this
		;
		if(!tooltip.length){
			tooltip = $('<div id="ugallery-tooltip" class="upfront-ui"></div>');
			$('body').append(tooltip);
		}
		tooltip.hide().html(content);
		elementPosition.right = elementPosition.left + element.width();
		if(elementPosition.left - 280 < 0){
			tooltipPosition.left = elementPosition.left + element.width() + 20;
			tooltipClass = 'ugallery-tooltip-bottom';
		}
		tooltip
			.css(tooltipPosition)
			.addClass(tooltipClass)
			.show()
			.on('click', function(e){
				e.stopPropagation();
			})
			.on('blur', function(e){
				me.closeTooltip();
			})
			.on('closed', function(e){
				me.$el.removeClass('tooltip-open');
			})
		;

		this.$el.addClass('tooltip-open');

		Upfront.Events.trigger("entity:settings:deactivate");
	},

	closeTooltip: function(){
		var tooltip = $('#ugallery-tooltip');
		tooltip.hide().trigger('closed');
		setTimeout(function(){
			tooltip.remove();
		}, 100);
	},
	postTypes: function(){
		var types = [];
		_.each(Upfront.data.ugallery.postTypes, function(type){
			if(type.name != 'attachment')
				types.push({name: type.name, label: type.label});
		});
		return types;
	},

	editCaption: function(e){
		var me = this,
			captionEl = $('#' + this.property('element_id')).find('.wp-caption')
		;


		if(captionEl.find('.uimage-caption-cover').length)
			captionEl = captionEl.find('.uimage-caption-cover');

		if(captionEl.data('ueditor') || ! captionEl.length) //Already instantiated
			return;

		captionEl.ueditor({
				autostart: false,
				upfrontMedia: false,
				upfrontImages: false
			})
			.on('start', function(){
				me.$el.addClass('upfront-editing');
			})
			.on('stop', function(){
				me.$el.removeClass('upfront-editing');
			})
			.on('syncAfter', function(){
				me.property('image_caption', captionEl.html());
			})
		;
	},

	createControl: function(icon, tooltip, click){
		var me = this,
			item = new Control();
		item.icon = icon;
		item.tooltip = tooltip;
		if(click){
			this.listenTo(item, 'click', function(e){
				me[click](e);
			});
		}

		return item;
	},

	setImageInfo: function(){
		var maskSize, maskOffset,
			starting = this.$('.upfront-image-starting-select'),
			size = this.property('size'),
			position = this.property('position'),
			stretch = this.property('stretch'),
			img = this.$('img')
		;

		if(starting.length){
			maskSize = {
				width: starting.outerWidth(),
				height: starting.outerHeight()
			};
			maskOffset = starting.offset();
			position = false;
		}
		else {
			starting = this.$('.upfront-image-container');
			maskSize = {
				width: starting.width(),
				height: starting.height()
			};
			maskOffset = {
				top: starting.offset().top,
				left: starting.offset().left,
			};
		}

		//Fix for responsive images
		if(img.length){
			size = {
				width: img.width(),
				height: img.height()
			},
			position = {
				top: -img.position().top,
				left: -img.position().left
			}

		}

		this.imageInfo = {
			id: this.property('image_id'),
			src: this.property('src'),
			srcFull: this.property('srcFull'),
			srcOriginal: this.property('srcOriginal'),
			size: size,
			position: position,
			rotation: this.property('rotation'),
			fullSize: this.property('fullSize'),
			align: this.property('align'),
			maskSize: maskSize,
			maskOffset: maskOffset
		};

	},

	get_content_markup: function () {
		var me = this,
			props = this.extract_properties(),
			onclick = this.property('when_clicked')
		;
		if(!this.property('element_size').width || (!this.property('quick_swap') && !_.isNumber(this.property('element_size').height))){
			this.setElementSize();
			this.property('element_size', this.elementSize);
		}

		props.url = onclick == 'do_nothing' ? false : this.property('image_link');

		props.cover_caption = ['fill', 'fill_bottom', 'fill_middle'].indexOf(props.caption_alignment) != -1;

		if(props.stretch)
			props.imgWidth = '100%';
		else
			props.imgWidth = props.size.width + 'px';

		var rendered = this.imageTpl(props);

		console.log('Image element');


		if(this.property('quick_swap')){
			var size = this.property('element_size'),
				smallSwap = size.width < 150 || size.height < 90 ? 'uimage-quick-swap-small' : '';

			rendered += '<div class="upfront-quick-swap ' + smallSwap + '"><p>Change this image</p></div>';
		}
		else if(this.property('image_status') == 'starting'){
			rendered += '<div class="upfront-image-starting-select upfront-ui" style="height:' + this.elementSize.height + 'px"><div class="uimage-centered">' +
					'<span class="upfront-image-resizethiselement">Add Image</span><div class=""><a class="upfront-image-select button" href="#" title="Add Image">+</a></div>'+
			'</div></div>';
		}
		else {
			var render = $('<div></div>').append(rendered),
				elementSize = this.property('element_size'),
				size = this.property('size'),
				position = this.property('position'),
				img = render.find('img')
			;
			// Let's load the full image to improve resizing
			render.find('.upfront-image-container').css({
				overflow: 'hidden',
				position: 'relative',
				width: '100%',
				height: elementSize.height
			});

			if(!this.temporaryProps || !this.temporaryProps.size)
				this.temporaryProps = {
					size: size,
					position: position
				};

			if(position.top > 0 || position.left > 0 || size.width > elementSize.width || size.height > elementSize.height){
				img.attr('src', me.property('srcFull'))
					.css({
						width: this.temporaryProps.size.width,
						height: this.temporaryProps.size.height
					})
				;
			}

			img.css({
				position: 'absolute',
				top: 0-this.temporaryProps.position.top,
				'margin-top': 0,
				left: 0-this.temporaryProps.position.left,
				'max-height': 'none',
				'max-width': 'none'
			});

			if(!this.property('stretch')){
				var align = this.property('align');
				if(align == 'left')
					img.css({left: 0});
				else if(align == 'center')
					img.css({left: Math.max(0, (elementSize.width - img.width()) / 2)});
				else
					img.css({left: 'auto', right: 0});
			}

			rendered = render.html();
		}


		return rendered;
	},

	on_render: function(){
		var me = this;
		//Bind resizing events
		if(!me.parent_module_view.$el.data('resizeHandling')){
			me.parent_module_view.$el
				.on('resizestart', $.proxy(me.onElementResizeStart, me))
				.on('resize', $.proxy(me.onElementResizing, me))
				.on('resizestop', $.proxy(me.onElementResize, me))
				.data('resizeHandling', true)
			;
		}

		if(this.property('image_status') != 'ok'){
			var starting = this.$('.upfront-image-starting-select');
			if(!this.elementSize.height){
				this.setElementSize();
				starting.height(this.elementSize.height);
			}

			me.$el.append(
				$('<div>').addClass('uimage-resize-hint upfront-ui').html(me.sizehintTpl({
					width: me.elementSize.width,
					height: me.elementSize.height
				}))
			);

			return;
		}

		if (this.property('quick_swap')) return false; // Do not show image controls for swappable images.
		setTimeout(function(){
			var container = $('#' + me.property('element_id')).find('.upfront-image-container');

			me.controls.setWidth(container.width());
			me.controls.render();
			me.controls.$el.prepend('<div class="uimage-controls-toggle"></div>');

			container.parent().append($('<div class="uimage-controls upfront-ui"></div>').append(me.controls.$el));
			me.controls.delegateEvents();
			me.$el.removeClass('upfront-editing');

			me.editCaption();

			me.setSizeClasses(container.width(), container.height());
			me.setSizeHTMLClasses();

			//me.get_resizing_limits();
		}, 300);
	},

	setSizeClasses: function(width, height) {
		if(width < 131 && !this.sizeClasses.narrow){
			this.sizeClasses.narrow = true;
			this.parent_module_view.$el.addClass('uimage-narrow');
		}
		else if(width > 130 && this.sizeClasses.narrow){
			this.sizeClasses.narrow = false;
			this.parent_module_view.$el.removeClass('uimage-narrow');
		}

		if(height < 120 && !this.sizeClasses.small){
			this.sizeClasses.small = true;
			this.parent_module_view.$el.addClass('uimage-small');
		}
		else if(height > 119 && this.sizeClasses.small){
			this.sizeClasses.small = false;
			this.parent_module_view.$el.removeClass('uimage-small');
		}

		if(width < 50 && !this.sizeClasses.tiny){
			this.sizeClasses.tiny = true;
			this.parent_module_view.$el.addClass('uimage-tiny');
		}
		else if(width > 49 && this.sizeClasses.tiny){
			this.sizeClasses.tiny = false;
			this.parent_module_view.$el.removeClass('uimage-tiny');
		}
	},

	setSizeHTMLClasses: function(){
		var me = this;

		if(me.sizeClasses.small)
			this.parent_module_view.$el.addClass('uimage-small');
		else
			this.parent_module_view.$el.removeClass('uimage-small');

		if(me.sizeClasses.tiny)
			this.parent_module_view.$el.addClass('uimage-tiny uimage-narrow');
		else {
			this.parent_module_view.$el.removeClass('uimage-tiny');
			if(me.sizeClasses.narrow)
				this.parent_module_view.$el.addClass('uimage-narrow');
			else
				this.parent_module_view.$el.removeClass('uimage-narrow');
		}

		if(me.sizeClasses.small || me.sizeClasses.narrow)
			this.parent_module_view.$el.addClass('upfront-module-small');
		else
			this.parent_module_view.$el.removeClass('upfront-module-small');
	},

	on_edit: function(){
		return false;
	},

	extract_properties: function() {
		var props = {};
		this.model.get('properties').each(function(prop){
			props[prop.get('name')] = prop.get('value');
		});
		return props;
	},

	handleDragEnter: function(e){
		var me = this;
		if(!this.$('.uimage-drop-hint').length){
			var dropOverlay = $('<div class="uimage-drop-hint">Drop the image here<form </div>')
				.on('drop', function(e){
					e.preventDefault();
					e.stopPropagation();
					me.openImageSelector();
					$('.uimage-drop-hint').remove();
					if(e.originalEvent.dataTransfer){
						var files = e.originalEvent.dataTransfer.files,
							input = $('#upfront-image-file-input')
						;
						// Only call the handler if 1 or more files was dropped.
						if (files.length && input.length){
							input[0].files = files;
			            }
			        }
				})
				.on('dragenter', function(e){
					e.preventDefault();
					e.stopPropagation();
					$(this).addClass('uimage-dragenter');
				})
				.on('dragleave', function(e){
					e.preventDefault();
					e.stopPropagation();
					$(this).removeClass('uimage-dragenter');
				})
			;
			this.$('.upfront-image').append(dropOverlay);
		}
		if(this.dragTimer){
			clearTimeout(this.dragTimer);
			this.dragTimer = false;
		}
	},

	handleDragLeave: function(e){
		var me = this;
		this.dragTimer = setTimeout(function(){
				me.$('.uimage-drop-hint').remove();
				this.dragTimer = false;
			}, 200)
		;
	},

	onElementResize: function(e, ui){
		var starting = this.$('.upfront-image-starting-select');
		if(starting.length){
			this.elementSize = {
				height: $('.upfront-resize').height() - 30,
				width: $('.upfront-resize').width() - 30
			};
			this.property('element_size', this.elementSize);
			return;
		}
		else if(this.property('quick_swap'))
			return;

		var resizer = $('.upfront-resize'),
			img = this.$('img'),
			container = this.$('.upfront-image-container'),
			imgSize = this.property('size'),
			imgPosition = this.property('position'),
			me = this,
			imgOffset = img.offset(),
			containerOffset = img.offset(),
			newPosition = {top: containerOffset.top - imgOffset.top, left: containerOffset.left - imgOffset.left}
		;

		this.property('element_size', {width: container.width(), height: container.height()});
		if(imgSize.height != img.height() || imgSize.width != img.width() ||  newPosition.top != imgPosition.top || newPosition.left != imgPosition.left ){
			this.temporaryProps = {
				size: {width: img.width(), height: img.height()},
				position: {top: container.offset().top - img.offset().top, left: container.offset().left - img.offset().left}
			};

			if(this.cropTimer){
				clearTimeout(this.cropTimer);
				this.cropTimer = false;
			}
			this.cropTimer = setTimeout(function(){
				me.saveTemporaryResizing();
				console.log('resizingTimer');
			}, this.cropTimeAfterResize);
		}


		this.setSizeHTMLClasses();

		this.$('.wp-caption').fadeIn('fast');
	},

	onElementResizeStart: function(e, ui){
		this.$('.wp-caption').fadeOut('fast');
	},

	onElementResizing: function(e, ui){
		var starting = this.$('.upfront-image-starting-select'),
			resizer = $('html').find('.upfront-resize'),
			rWidth = resizer.width(),
			rHeight = resizer.height()
		;

		this.setSizeClasses(rWidth, rHeight);

		if(starting.length){
			this.$el.find('.uimage-resize-hint').html(this.sizehintTpl({
					width: resizer.width() - 30,
					height: resizer.height() - 30
				})
			).css({
				bottom: 'auto',
				top: resizer.height() - 39
			});
			return starting.outerHeight(resizer.height() - 30);
		}

		var text = this.property('caption_position') == 'below_image' ? this.$('.wp-caption') : [],
			textHeight = text.length ? text.outerHeight() : 0,
			newElementSize = {width: resizer.outerWidth() - 30, height: resizer.outerHeight() - 30 - textHeight},
			elementSize = this.property('element_size'),
			img = this.$('img'),
			position = this.property('position'),
			imgSize = this.property('size'),
			stretch = this.property('stretch')
		;

		this.$('.upfront-image-container').css({
			width: newElementSize.width,
			height: newElementSize.height
		});

		this.$('.upfront-image-starting-select').height(newElementSize.height);

		var widthChanged = false;
		if(position.left >= 0 && stretch){
			if(newElementSize.width > imgSize.width){
				img.css({
					left: 0,
					width: newElementSize.width,
					height: 'auto'
				});
				widthChanged = true;
			}
			else
				img.css({
					left: Math.max(-position.left, newElementSize.width - imgSize.width)
				});
		}
		else {
			if(this.property('align') == 'center')
				img.css('left', Math.max(0, (newElementSize.width - imgSize.width) / 2));
		}

		if(position.top > 0 || position.top === 0 && img.height() >= elementSize.height){
			var imgHeight = widthChanged ? img.height() : imgSize.height; // Reduce img height with element height
			if(newElementSize.height > imgHeight)
				img.css({
					top:0,
					height: newElementSize.height,
					width: 'auto'
				});
			else
				img.css({
					top: Math.min(0, Math.max(-position.top, newElementSize.height - img.height()))
				});
		}
		else {
			img.css({
				top: Math.max(0, Math.min(-position.top, newElementSize.height - img.height()))
			});
		}
	},

	saveTemporaryResizing: function(){
		var me = this,
			crop = me.property('element_size'),
			imageId = me.property('image_id'),
			resize = me.temporaryProps.size,
			position = me.temporaryProps.position
		;


		crop.top = position.top;
		crop.left = position.left;

		var promise = Upfront.Views.Editor.ImageEditor.saveImageEdition(
			imageId,
			me.property('rotation'),
			resize,
			crop
		).done(function(results){
			var imageData = results.data.images[imageId];

			if(imageData.error){
				console.error(imageData.msg);
				return;
			}

			me.property('size', resize);
			me.property('position', position);
			me.property('src', imageData.url);
			me.property('srcFull', imageData.urlOriginal, false);
			me.property('stretch', resize.width - crop.left > crop.width);
			clearTimeout(me.cropTimer);
			me.cropTimer = false;
		});

		return promise;
	},

	saveResizing: function(){
		var me = this;
		if(this.cropTimer){
			clearTimeout(this.cropTimer);
			this.cropTimer = false;

			this.saveTemporaryResizing().done(function(){
				var saveData = {
					element: JSON.stringify(Upfront.Util.model_to_json(me.model)),
					action: 'upfront_update_layout_element'
				};
				Upfront.Util.post(saveData).done(function(response){
					console.log('Ok');
				});
			});
		}
	},

	setElementSize: function(ui){
		var me = this,
			parent = this.parent_module_view.$('.upfront-editable_entity:first'),
			resizer = ui ? $('.upfront-resize') : parent
		;

		me.elementSize = {
			width: resizer.width() - 32,
			height: resizer.height() - 30
		};

		if(this.property('caption_position') == 'below_image')
			this.elementSize.height -= parent.find('.wp-caption').outerHeight();

		if(this.property('image_status') == 'starting')
			this.$('.upfront-object-content').height(me.elementSize.height);

	},
	openImageSelector: function(e){
		var me = this;
		if(e)
			e.preventDefault();

		Upfront.Views.Editor.ImageSelector.open().done(function(images){
			var sizes = {};
			_.each(images, function(image, id){
				sizes = image;
				me.imageId = id;
			});

			var	imageInfo = {
					src: sizes.medium ? sizes.medium[0] : sizes.full[0],
					srcFull: sizes.full[0],
					srcOriginal: sizes.full[0],
					fullSize: {width: sizes.full[1], height: sizes.full[2]},
					size: sizes.medium ? {width: sizes.medium[1], height: sizes.medium[2]} : {width: sizes.full[1], height: sizes.full[2]},
					position: false,
					rotation: 0,
					id: me.imageId
				}
			;
			$('<img>').attr('src', imageInfo.srcFull).load(function(){
				Upfront.Views.Editor.ImageSelector.close();
				me.openEditor(true, imageInfo);
			});
		});
	},

	handleEditorResult: function(result){
		this.property('image_status', 'ok', true);
		this.property('has_settings', 1);
		this.property('src', result.src, true);
		this.property('srcFull', result.srcFull, true);
		this.property('srcOriginal', result.srcOriginal, true);
		this.property('size', result.imageSize, true);
		this.property('position', result.imageOffset, true);
		var marginTop = result.mode == 'horizontal' || result.mode == 'small' ? result.imageOffset.top * -1 : 0;
		this.property('marginTop', marginTop, true);
		this.property('rotation', result.rotation, true);
		this.property('fullSize', result.fullSize, true);

		var textHeight = this.property('caption_position') == 'below_image' ? this.$('.wp-caption').outerHeight() : 0;
		if(textHeight)
			result.maskSize.height += textHeight;
		this.property('element_size', result.maskSize, true);


		this.property('align', result.align, true);
		this.property('stretch', result.stretch, true);
		this.property('quick_swap', false, true);
		if(result.imageId)
			this.property('image_id', result.imageId, true);


		var moduleModel = this.parent_module_view.model;
		if(result.elementSize){
			console.log(result.elementSize);
			this.set_element_size(result.elementSize.columns, result.elementSize.rows, 'all', true);
		}

		this.temporaryProps = false;
		this.render();
	},

	editRequest: function () {
		var me = this;
		if(this.property('image_status') == 'ok' && this.property('image_id'))
			return this.openEditor();

		Upfront.Views.Editor.notify('Image editing it is only suitable for images uploaded to WordPress', 'error');
	},

	getElementColumns: function(){
		var module = this.$el.closest('.upfront-module'),
			classes,
			found = false
		;

		if(!module.length)
			return -1;

		classes = module.attr('class').split(' ');

		_.each(classes, function(c){
			if(c.match(/^c\d+$/))
				found = c.replace('c', '');
		});
		return found || -1;
	},

	openEditor: function(newImage, imageInfo){
		var me = this,
			options = {
				setImageSize: newImage,
				saveOnClose: newImage,
				editElement: this
			}
		;

		this.setElementSize();
		this.setImageInfo();

		if(imageInfo)
			_.extend(options, this.imageInfo, imageInfo);
		else
			_.extend(options, this.imageInfo);

		if(this.cropTimer){
			this.stoppedTimer = true;
			clearTimeout(this.cropTimer);
			this.cropTimer = false;
		}

		options.element_id = me.model.get_property_value_by_name("element_id");

		Upfront.Views.Editor.ImageEditor.open(options)
			.done(function(result){
				me.handleEditorResult(result);
				this.stoppedTimer = false;
			})
			.fail(function(data){
				if(data && data.reason == 'changeImage')
					me.openImageSelector();
				else if(me.stoppedTimer) {
					me.saveTemporaryResizing();
					me.stoppedTimer = false;
				}
			})
		;
	},

	cleanup: function(){
		this.controls.remove();
		if(this.bodyEventHandlers){
			_.each(this.bodyEventHandlers, function(f, ev){
				$('body').off(ev, f);
			});
		}
	},

	property: function(name, value, silent) {
		if(typeof value != "undefined"){
			if(typeof silent == "undefined")
				silent = true;
			return this.model.set_property(name, value, silent);
		}
		return this.model.get_property_value_by_name(name);
	}
}));

var ImageElement = Upfront.Views.Editor.Sidebar.Element.extend({
	priority: 20,
	render: function () {
		this.$el.addClass('upfront-icon-element upfront-icon-element-image');
		this.$el.html('Image');
	},
	add_element: function () {
		var object = new UimageModel(),
			module = new Upfront.Models.Module({
				"name": "",
				"properties": [
					{"name": "element_id", "value": Upfront.Util.get_unique_id("module")},
					{"name": "class", "value": "c22 upfront-image_module"},
					{"name": "has_settings", "value": 0},
					{"name": "row", "value": 17}
				],
				"objects": [
					object
				]
			})
		;
		this.add_module(module);
	}
});
var ImageSettings = Upfront.Views.Editor.Settings.Settings.extend({
	initialize: function () {
		var me = this;
		this.panels = _([
			new DescriptionPanel({model: this.model})
		]);

		this.on('open', function(){
			me.model.trigger('settings:open', me);
		});
	},
	get_title: function () {
		return "Image settings";
	}
});

var DescriptionPanel = Upfront.Views.Editor.Settings.Panel.extend({
	className: 'upfront-settings_panel_wrap uimage-settings',
	initialize: function () {
		var me = this,
			SettingsItem =  Upfront.Views.Editor.Settings.Item,
			Fields = Upfront.Views.Editor.Field
		;

		this.settings = _([
			new SettingsItem({

				title: 'alternative_text',
				group: false,
				fields: [
					new Fields.Text({
						model: this.model,
						property: 'alternative_text',
						label: 'Alternative text'
					})
				]
			}),

			new SettingsItem({
				title: 'Show Caption:',
				fields: [
					new Fields.Radios({
						className: 'field-caption_trigger upfront-field-wrap upfront-field-wrap-multiple upfront-field-wrap-radios over_image_field',
						model: this.model,
						property: 'caption_trigger',
						layout: "horizontal-inline",
						values: [
							{
								label: 'always',
								value: 'always_show'
							},
							{
								label: 'on hover',
								value: 'hover_show'
							}
						]
					})
				]
			})
		]);

		if(this.model.get_property_value_by_name('include_image_caption'))
			this.addCaptionBackgroundPicker();
	},

	addCaptionBackgroundPicker: function(){
		var me = this,
			fields = Upfront.Views.Editor.Field
		;

		this.settings.push(new ColorPickerField({
			title: 'Caption Background',
			fields: [
				new fields.Radios({
					model: this.model,
					property: 'captionBackground',
					layout: "horizontal-inline",
					values: [
						{value: '0', label: 'None'},
						{value: '1', label: 'Pick color'}
					]
				}),
			]
		}));

		this.on('rendered', function(){
			var spectrum = false,
				currentColor = me.model.get_property_value_by_name('background'),
				input = $('<input type="text" value="' + currentColor + '">'),
				setting = me.$('.ugallery-colorpicker-setting')
			;

			setting.find('.upfront-field-wrap').append(input);
			setting.find('input[name="captionBackground"]').on('change', function(){
				me.toggleColorPicker();
			});

			input.spectrum({
				showAlpha: true,
				showPalette: true,
				palette: ['fff', '000', '0f0'],
				maxSelectionSize: 9,
				localStorageKey: "spectrum.recent_bgs",
				preferredFormat: "hex",
				chooseText: "Ok",
				showInput: true,
				allowEmpty:true,
				show: function(){
					spectrum = $('.sp-container:visible');
				},
				change: function(color) {
					var rgba = color.toRgbString();
					me.model.set_property('background', rgba, true);
					currentColor = rgba;
				},
				move: function(color) {
					var rgba = color.toRgbString();
					spectrum.find('.sp-dragger').css('border-top-color', rgba);
					spectrum.parent().find('.sp-dragger').css('border-right-color', rgba);
					me.parent_view.for_view.$el.find('.wp-caption').css('background-color', rgba);
				},
				hide: function(){
					me.parent_view.for_view.$el.find('.wp-caption').css('background-color', currentColor);
				}
			});
			setting.find('.sp-replacer').css('display', 'inline-block');
			me.toggleColorPicker();
		});
	},
	toggleColorPicker: function(){
		var setting = this.$('.ugallery-colorpicker-setting'),
			color = setting.find('input:checked').val(),
			picker = setting.find('.sp-replacer')
		;
		if(color == "1"){
			picker.show();
			if(this.parent_view)
				this.parent_view.for_view.$el.find('.wp-caption').css('background-color', this.model.get_property_value_by_name('background'));
		}
		else{
			picker.hide();

			if(this.parent_view)
			this.parent_view.for_view.$el.find('.wp-caption').css('background-color', 'transparent');
		}
	},
	get_label: function () {
		return 'Settings';
	},
	get_title: function () {
		return false;
	}
});

var ColorPickerField = Upfront.Views.Editor.Settings.Item.extend({
	className: 'ugallery-colorpicker-setting'
});

/**
 * The image editor needs the image to be uploaded as an attachment to WP in order to work.
 * The open method must receive the following options in an array:
 * {
 * 		id: The image attachment id. It is mandatory for the edition in the server side.
 * 		maskOffset: and array with the offset of the mask element relative to the top left of the page
 * 	 	maskSize: an array with the size of the mask
 * 	 	position: (optional:[{top:0, left:0}]) if the image is cropped is the offset of the crop relative to the original size of the image
 * 	 	size: the size of the image if it wasn't cropped
 * 	 	fullSize: the size of the original image
 * 	 	srcOriginal: the source url of the original image (the best to edit)
 * 	 	src: the source url of the image in the page
 * 	 	rotation: (optional:[0]) The angle of rotation of the image on the page relative to the original
 * 	 	align: (optional:['left']) alignment of the image (used if the image is smaller than the mask)
 * 	 	setImageSize: (optional:[false]) Boolean to tell the editor to calculates an initial size for the image. Default false.
 * 	 	buttons: (optional:[[]]) An array with extra buttons for the editor. Every button is an object with
 * 	 		'id': HTML id for the button
 * 	 		'text': Tooltip text for the button
 * 	 		'callback': A function to be called when clicked.
 * 	 	resizeElement: (ObjectView): An element to resize when the image is smaller than the element or it is expanded to 100%
 *
 * }
 * @return Promise When edition is successful an response object is return as parameter for the promise with the following attributes:
 * {
 * 		imageId: The attachment id
 * 		imageSize: The result image size without cropping
 * 		imageOffset: The offset of the crop relative to the top-left of the image.
 * 		maskSize: The size of the mask
 * 		cropSize: The size of the crop
 * 		src: The source url of the crop
 * 		srcFull: The source url of the full version. It may be a rotated version of the original.
 * 		rotation: Angle of rotation relative to the original image
 * 		fullSize: the size of the original image
 * 		align: alignment for the image
 * 		stretch: Whether the image is wider than the mask. If the image is narrower should be aligned instead of stretched when resizing.
 * }
 */
var ImageEditor = Backbone.View.extend({
	id: 'upfront-image-edit',
	rotation: 0,
	mode: 'big', // big | small | vertical | horizontal
	invert: false,
	tpl: _.template($(editorTpl).find('#editor-tpl').html()),
	src: '#',
	bordersWidth: 0,
	response: false,
	fullSize: {width: 0, height:0},
	buttons: [],
	sizes: false,

	events: {
		'click #image-edit-button-ok': 'imageOk',
		'click #image-edit-button-reset': 'image100', //'resetImage',
		'click #image-edit-button-fit': 'fitImage',
		'click #image-edit-button-align': 'selectAlign',
		'click .image-edit-rotate': 'rotate',
		'click .image-fit-element-button': 'fitMask',
		'click #image-edit-button-swap': 'changeImage',
		'mouseover a.image-edit-button': 'showTooltip',
		'mouseout a.image-edit-button': 'hideTooltip'
	},

	initialize: function(){
		var me = this;
		this.$el.on('click', function(e){
			if(e.target == e.currentTarget){
				if(me.saveOnClose)
					me.imageOk();
				else if(!me.isResizing)
					me.cancel();
			}
			me.isResizing = false;
		});
	},

	resetDefaults: function(){
		this.rotation = 0;
		this.mode = 'big';
		this.invert = false;
		this.src = '#';
		//this.response = false;
		this.fullSize = {width: 0, height:0};
		this.setImageInitialSize = false;
		this.buttons = [
			{id: 'image-edit-button-fit', text: 'Fit to Element', tooltip: 'Adapt to the mask'},
			{id: 'image-edit-button-reset', text: 'IMG 100%', tooltip: 'Expand image'},
			{id: 'image-edit-button-ok', text: 'Ok', tooltip: 'Save image'}
		];
		this.sizes = false;
		//this.promise = false;
		this.align = 'left';
		this.saveOnClose = false;
		this.elementSize = false;
		this.fitImageButton = true;
	},

	centerImageOffset: function(imageSize, maskSize){
		return {
			top: - (imageSize.height - maskSize.height) / 2,
			left: - (imageSize.width - maskSize.width) / 2
		};
	},

	open: function(options){
		this.resetDefaults();
		this.options = options;
		this.src = options.src;
		this.saveOnClose = options.saveOnClose;

		options.maskOffset.top += this.fixImageTop(options.maskOffset);

		this.setOptions(options);

		var resizedElement = this.maybeResizeElement(options);
		if(resizedElement){
			options.position = {top: 0, left: 0};
			options.maskSize = resizedElement.maskSize;
			options.size = resizedElement.imageSize;
			options.setImageSize = false;
			options.align = 'left';
			options.resizedElement = true;

			return this.open(options);
		}

		if(!this.options.editElement)
			this.buttons = [{id: 'image-edit-button-ok', text: 'Ok', tooltip: 'Save image'}];

		var halfBorder = this.bordersWidth /2,
			maskOffset = {
				top: parseInt(options.maskOffset.top) - halfBorder,
				left: parseInt(options.maskOffset.left) - halfBorder
			},
			maskSize = {
				width: parseInt(options.maskSize.width) + this.bordersWidth,
				height: parseInt(options.maskSize.height) + this.bordersWidth
			}
		;

		if(!options.position)
			options.position = this.centerImageOffset(options.size, maskSize);

		var canvasOffset = {
				top: parseInt(maskOffset.top) - options.position.top + halfBorder,
				left: parseInt(maskOffset.left) - options.position.left + halfBorder
			},
			canvasSize = {
				width: parseInt(options.size.width),
				height: parseInt(options.size.height)
			}
		;

		this.imageId = options.id;
		this.src = options.srcOriginal;

		this.fullSize = options.fullSize;
		if(options.align)
			this.align = options.align;


		if(this.setImageInitialSize){
			var fullImageProps = this.getFullWidthImage();
			canvasSize = fullImageProps.size;
			canvasOffset.left = fullImageProps.left;
		}
		else if(options.imageFit){
			canvasSize = this.initialImageSize(0, false, maskSize);
		}

		var tplOptions = {
			size: canvasSize,
			offset: canvasOffset,
			maskOffset: maskOffset,
			rotation: 'rotate_' + this.rotation,
			src: this.src,
			maskSize: maskSize,
			buttons: this.buttons,
			fitMask: options.fitMaskColumns
		};

		this.$el.html(this.tpl(tplOptions)).find('div').hide();
		if(!this.$el.closest('body').length){
			this.response = $.Deferred();
			$('body').append(this.$el);
		}

		this.addGridLines(maskOffset.top, maskSize.height);

		this.$el.css({
			height: $(document).height(),
			width: $(document).width()
		}).find('div').fadeIn(200);

		this.selectMode(canvasSize);
		this.startEditorUI();
		this.selectMode(canvasSize, true);

		this.setImageSize(canvasSize);

		//this.setAlign(this.align);
		this.$('#image-edit-button-align').addClass('align-' + this.align);

		if(this.setImageInitialSize){
			this.resetImage(false, false);
		}

		if(options.editElement){
			this.check100ButtonActivation();
		}

		return this.response.promise();
	},

	setOptions: function(options) {
		var me = this;
		if(typeof options.rotation != 'undefined')
			this.setRotation(options.rotation);
		else
			this.setRotation(0);

		if(options.setImageSize)
			this.setImageInitialSize = true;

		if(options.extraButtons && options.extraButtons.length){
			_.each(options.extraButtons, function(button){
				me.buttons.push({id: button.id, text: button.text});
				me.$el
					.off('click', '#' + button.id)
					.on('click', '#' + button.id, function(e){
						button.callback(e, me);
					})
				;
			});
		}
		this.element_id = options.element_id || false;
	},

	check100ButtonActivation: function(){
		var full = this.getFullWidthImage(this.options.fullSize).size,
			fullColsRows = this.getCurrentImageRowsCols(full.width, full.height),
			button = this.$('#image-edit-button-reset')
		;
		if(this.elementSize.columns == fullColsRows.columns && this.elementSize.rows == fullColsRows.rows)
			button.addClass('deactivated expanded').attr('data-tooltip', 'The image is completely expanded');
		else if(this.elementSize.columns == this.elementSize.maxColumns && this.elementSize.columns < fullColsRows.columns && this.elementSize.rows == fullColsRows.rows)
			button.addClass('deactivated').attr('data-tooltip', 'Can\'t expand the image');
	},

	/**
	 * Return the new mask size if the element could be resized in order to fit the current image.
	 * Also it iset the elementSize property.
	 * @param  {Object} options
	 * @return {Mixed} False if the current size is ok or the {width, height} hash if it can be improved
	 */
	maybeResizeElement: function(options, stretch){
		if(!options.editElement)
			return false;

		var elementView = options.editElement,
			elementSize = {
				maxColumns: elementView.get_element_max_columns(),
				maxRows: elementView.get_element_max_rows(),
				rowHeight: 15
			}
		;

		if(!elementSize.maxRows)
			elementSize.maxRows = elementView.get_element_rows();

		elementSize.columnWidth = elementView.get_element_max_columns_px() / elementSize.maxColumns;

		elementSize.rows = Math.round(options.maskSize.height / 15) + 2;
		elementSize.columns = Math.ceil(options.maskSize.width / elementSize.columnWidth);

		this.elementSize = elementSize;

		// If the image is not new we are done
		if(!options.setImageSize)
			return false;

		var fullGrid = this.getFullWidthImage(options.fullSize).size,
			current = this.getCurrentImageRowsCols(fullGrid.width, fullGrid.height),
			maskSize = {
				width: current.columns * this.elementSize.columnWidth - 30,
				height: (current.rows - 2) * this.elementSize.rowHeight
			}
		;

		if(current.columns > elementSize.columns || current.rows > elementSize.rows)
			return false;

		if(!stretch){
			maskSize = {
				width: Math.min(current.columns, elementSize.columns) * elementSize.columnWidth - 30,
				height: (Math.min(current.rows, elementSize.rows) - 2) * 15
			};
		}
		else if(this.elementSize.maxColumns < current.columns){
			var ratio = fullGrid.height / fullGrid.width,
				maskWidth = this.elementSize.maxColumns * this.elementSize.columnWidth - 30
			;
			maskSize = {
				width:  maskWidth,
				height: fullGrid.height
			};
		}

		return {
			maskSize: maskSize,
			imageSize: fullGrid
		};
	},

	imageOk: function() {
		var results = this.getEditorResults(),
			me = this,
			loading = new Upfront.Views.Editor.Loading({
				loading: "Saving image...",
				done: "Here we are",
				fixed: false
			}),
			mask = this.$('#uimage-mask')
		;

		if(results.imageId){
			loading.render();
			mask.append(loading.$el);
			this.saveImageEdition(
				results.imageId,
				results.rotation,
				results.imageSize,
				{
					top: results.imageOffset.top,
					left: results.imageOffset.left,
					width: results.maskSize.width,
					height: results.maskSize.height
				}
			)
			.done(function(result){
				var imageData = result.data.images[results.imageId];

				loading.done();

				if(imageData.error){
					console.error(imageData.msg);
					return;
				}

				results.src = imageData.url;
				results.srcFull = imageData.urlOriginal;
				results.cropSize = imageData.crop;
				if(me.options.resizedElement)
					results.elementSize = me.getCurrentMaskRowsCols();
				me.response.resolve(results);
				me.close();
			})
			.error(function(result){
				console.log(result);
			})
		}
	},

	close: function(reason) {
		var me = this;
		this.unfixImageTop();
		this.$('div').fadeOut(200, function(){
			me.$el.detach();
		});
		this.options = false;
		me.response.reject({reason: reason, id: this.imageId});
	},

	cancel: function(reason){
		this.close(reason);
	},

	changeImage: function(e){
		e.preventDefault();
		this.close('changeImage');
	},

	getEditorResults: function() {
		var canvas = this.$('#uimage-canvas'),
			img = canvas.find('img'),
			mask = this.$('#uimage-mask'),
			src = img.attr('src'),
			halfBorder = this.bordersWidth / 2
		;

		return {
			imageSize: {width: Math.round(this.invert ? img.height() : img.width()), height: Math.round(this.invert ? img.width() : img.height())},
			imageOffset: {
				top: mask.offset().top - canvas.offset().top + halfBorder,
				left: mask.offset().left - canvas.offset().left + halfBorder
			},
			maskSize: {
				width: mask.width(),
				height: mask.height()
			},
			rotation: this.rotation,
			imageId: this.imageId,
			fullSize: this.fullSize,
			srcOriginal: src,
			align: this.align,
			stretch : this.mode == 'big' || this.mode == 'horizontal',
			mode: this.mode
		}
	},

	rotate: function(e){
		var rotation = this.rotation,
			img = this.$('.uimage-img'),
			rotationClass = '',
			size = {width: img.width(), height: img.height()},
			canvas = this.$('#uimage-canvas'),
			handler = this.$('#uimage-drag-handle')
		;

		if(e){
			e.preventDefault();
			e.stopPropagation();
		}

		rotation = rotation == 270 ? 0 : rotation + 90;

		if(rotation)
			rotationClass = 'rotate_' + rotation;

		img.removeClass()
			.addClass('uimage-img ' + rotationClass);

		this.setRotation(rotation);

		if(this.invert){
			canvas.css({
				height: size.width,
				width: size.height
			});
			handler.css({
				height: size.width,
				width: size.height
			});
			img.css({
				height: size.height,
				width: size.width
			});
			//$('#uimage-drag-handle').resizable('option', 'aspectRatio', size.height / size.width);
		}
		else{
			canvas.css(size);
			handler.css(size);
			img.css({
				height: '100%',
				width: '100%'
			});
			//$('#uimage-drag-handle').resizable('option', 'aspectRatio', size.width / size.height);
		}

		img.css(this.imgOffset({width: img.width(), height: img.height()}));

		this.selectMode({width: canvas.width(), height: canvas.height()});

		//this.centerImage(true);

		$('#uimage-drag-handle').draggable('option', 'containment', this.getContainment());
		this.setResizingLimits();
	},

	setRotation: function(rotation){
		this.rotation = rotation;
		this.invert = [90,270].indexOf(rotation) != -1;
	},

	imgOffset: function(size) {
		if(! this.invert)
			return {top: 0, left: 0};
		return {
			top: Math.floor((size.width - size.height) / 2),
			left: Math.floor((size.height - size.width) / 2)
		};
	},

	startEditorUI: function() {
		var me = this,
			canvas = this.$('#uimage-canvas')
		;
		$('#uimage-drag-handle')
			.resizable({
				handles: {se: $('.image-edit-resize i')},
				autoHide: 0,
				aspectRatio: true, //(me.fullSize.width + me.bordersWidth) / (me.fullSize.height + me.bordersWidth),
				start: function() {
					me.$('#image-edit-button-reset')
						.attr('class', 'image-edit-button')
						.attr('data-tooltip', 'Expand image')
					;
					//Prevent editor closing after resizing. It is set to false by the initialize method.
					me.isResizing = true;
				},
				resize: function(e, ui){
					canvas.css(ui.size);
					me.setImageSize(ui.size);
				},
				stop: function(e, ui){
					var dragHandle = me.$('#uimage-drag-handle');
					e.preventDefault();
					//Recalculate dimensions from the original size
					var imageSize = {
							width: (me.invert ? ui.size.height : ui.size.width),
							height: (me.invert ? ui.size.width : ui.size.height)
						},
						factor = me.fullSize.width / Math.floor(imageSize.width),
						canvasSize
					;
					imageSize = {
						width: Math.floor(imageSize.width),
						height: Math.round(me.fullSize.height / factor)
					};

					canvasSize = {
						width: (me.invert ? imageSize.height : imageSize.width),
						height: (me.invert ? imageSize.width : imageSize.height)
					};

					canvas.css(canvasSize);
					dragHandle.css(canvasSize);
					me.selectMode(canvasSize, true);
					me.setImageSize(canvasSize);
					if(me.mode == 'small' || me.mode == 'vertical')
						me.centerImage(false);

					$('#uimage-drag-handle').draggable('option', 'containment', me.getContainment());
				}
			})
			.draggable({
				opacity:1,
				start: function(e, ui){
				},
				drag: function(e, ui){
					canvas.css({
						top: ui.position.top,
						left: ui.position.left
					});
				},
				stop: function(e, ui){
					canvas.css({
						top: ui.position.top,
						left: ui.position.left
					});
					me.setResizingLimits();
				},
				containment: me.getContainment()
			})
		;
		me.setResizingLimits();

	},

	addGridLines: function(initialPoint, maskHeight){
		var step = 15,
			height = maskHeight - this.bordersWidth,
			current = this.bordersWidth / 2
		;

		while(current <= height + step){
			this.$el.append('<div class="gridline" style="position: absolute;width: 100%; height: 0; top:' + (initialPoint + current) + 'px"></div>');
			current = current + step;
		}
	},

	selectMode: function(size, constraints) {
		var mode = 'small',
			mask = this.$('#uimage-mask'),
			maskSize = {
				width: mask.width(),
				height: mask.height()
			}
		;

		if(size.width >= maskSize.width){
			if(size.height >= maskSize.height)
				mode = 'big';
			else
				mode = 'horizontal';
		}
		else if(size.height > maskSize.height)
				mode = 'vertical';

		this.setMode(mode, constraints);
	},

	setMode: function(mode, constraints){
		var editor = $('#uimage-drag-handle'),
			centerImage = (mode == 'small' || mode == 'vertical') && mode != this.mode
		;
		this.$el
			.removeClass('uimage-mode-big uimage-mode-small uimage-mode-vertical uimage-mode-horizontal uimage-mode-tiny')
			.addClass('uimage-mode-' + mode)
		;
		if(editor.width() < 40 || editor.height() < 40)
			this.$el.addClass('uimage-mode-tiny');

		this.mode = mode;
		if(constraints){
			if(this.mode == 'horizontal' || this.mode == 'small')
				editor.draggable('option', {snap: '.gridline', snapMode: 'outer', snapTolerance: 6});
			else
				editor.draggable('option', {snap: false});
		}

		if(centerImage){
			this.centerImage(false);
		}

	},

	setImageSize: function(size){
		if(this.invert){
			var invertSize = {
				width: size.height,
				height: size.width
			};

			this.$('.uimage-img')
				.css(invertSize)
				.css(this.imgOffset(invertSize))
			;
		}
	},

	getContainment: function(){
		var canvas = this.$('#uimage-canvas'),
			mask = this.$('#uimage-mask'),
			initPoint = mask.offset(),
			halfBorder = this.bordersWidth / 2
		;


		if(this.mode == 'big'){
			return [
				initPoint.left - canvas.width() + mask.width() + halfBorder,
				initPoint.top - canvas.height() + mask.height() + halfBorder,
				initPoint.left + halfBorder,
				initPoint.top + halfBorder
			];
		}
		if(this.mode == 'horizontal')
			return [
				initPoint.left - canvas.width() + mask.width() + halfBorder,
				initPoint.top,
				initPoint.left + halfBorder,
				initPoint.top - canvas.height() + mask.height()
			];

		var left = this.align == 'left' ? initPoint.left: (this.align == 'right' ? initPoint.left + mask.width() - canvas.width() : initPoint.left + (mask.width() - canvas.width()) / 2);
		left += halfBorder;

		if(this.mode == 'vertical')
			return [
				left,
				initPoint.top - canvas.height() + mask.height() + halfBorder,
				left,
				initPoint.top + halfBorder
			];

		return [
			left,
			initPoint.top,
			left,
			initPoint.top - canvas.height() + mask.height()
		];
	},

	setResizingLimits: function() {
		var canvas = this.$('#uimage-canvas'),
			mask = this.$('#uimage-mask'),
			initPoint = mask.offset(),
			limits = {
				minWidth: 15,
				minHeight: 15
			}
		;
		if(this.mode == 'big'){
			limits = {
				minWidth: mask.width() + initPoint.left - canvas.offset().left + this.bordersWidth,
				minHeight: mask.height() + initPoint.top - canvas.offset().top + this.bordersWidth
			}
		}

		$('#uimage-drag-handle').resizable('option', limits);
	},

	resetImage: function(e, alert){
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		this.setRotation(270);
		this.rotate(); //Set rotation to 0
		this.setImageFullSize(e, alert);
		this.centerImage(true);
	},

	image100: function(e){
		if($(e.target).hasClass('deactivated')){
			if($(e.target).hasClass('expanded'))
				return;
			return this.showExpandAlert();
		}

		var fullGrid = this.getFullWidthImage().size,
			current = this.getCurrentImageRowsCols(fullGrid.width, fullGrid.height),
			maskSize = current
		;

		if(this.elementSize.maxColumns < current.columns){
			var ratio = fullGrid.height / fullGrid.width,
				maskWidth = this.elementSize.maxColumns * this.elementSize.columnWidth - 30,
				maskHeight = fullGrid.height
			;
			maskSize = {columns: this.elementSize.maxColumns, rows: Math.ceil(maskHeight / this.elementSize.rowHeight) + 2};
		}
		if(maskSize.columns != this.elementSize.columns || maskSize.rows != this.elementSize.rows)
			this.resizeMask(maskSize.columns, maskSize.rows);
		else{
			var maskOffset = this.$('#uimage-mask').offset();
			fullGrid.top = maskOffset.top;
			fullGrid.left = maskOffset.left;
			this.$('#uimage-canvas').css(fullGrid);
			this.$('#uimage-drag-handle').css(fullGrid);
		}

		if(maskSize.columns != 22 && current.columns > maskSize.columns)
			this.showExpandAlert();
	},

	getCurrentImageRowsCols: function(width, height){
		var img = this.$('#uimage-canvas'),
			imgWidth = width ? width : img.width(),
			imgHeight = height ? height : img.height()
		;

		return {
			rows: Math.ceil(imgHeight / this.elementSize.rowHeight) + 2,
			columns: Math.ceil((imgWidth + 30)/ this.elementSize.columnWidth)
		};
	},

	getCurrentMaskRowsCols: function(){
		var mask = this.$('#uimage-mask');
		return this.getCurrentImageRowsCols(mask.width(), mask.height());
	},

	showExpandAlert: function(){
		if(this.ignoreFullwidthAlert)
			return;

		var me = this;
		Upfront.Popup.open(function(){}, {width: 320})
			.progress(function(progress){
				if(progress == 'before_close')
					me.ignoreFullwidthAlert = $("#upfront-popup-content").find('input:checked').length;
			})
		;

		$("#upfront-popup-content")
			.append($(editorTpl).find('#fullwidth-alert-tpl').html());
	},

	resizeMask: function(columns, rows){
		var options = this.options;

		options.maskSize = {
			width: this.elementSize.columnWidth * columns - 30,
			height: this.elementSize.rowHeight * (rows - 2)
		};

		options.size = this.getFullWidthImage().size;
		options.position = {left: 0, top: 0};
		options.setImageSize = false;
		options.resizedElement = true;

		this.open(options);
	},

	fitImage: function(e){
		e.preventDefault();
		e.stopPropagation();

		if(!this.fitImageButton){
			var button = $('#image-edit-button-fit');
			button.text('Fit to Element');
			this.fitImageButton = true;

			return this.resetImage();
		}

		var canvas = this.$('#uimage-canvas'),
			mask = this.$('#uimage-mask'),
			handler = this.$('#uimage-drag-handle'),
			size = this.getResizeImageDimensions(this.fullSize, {width: mask.width(), height: mask.height()}, 'inner', 0)
		;

		if(this.invert){
			size = {
				width: size.height,
				height: size.width
			};
		}

		canvas.css(size);
		handler.css(size);

		this.setImageSize(size);
		this.centerImage(true);

		this.selectMode(size, true);

		this.centerImage(true);

		this.setResizingLimits();
		$('#uimage-drag-handle').draggable('option', 'containment', this.getContainment());

		$('#image-edit-button-fit')
			.attr('data-tooltip', 'Restore image size')
			.text('Reset image size')
		;
		$('#image-edit-button-reset')
			.attr('class', 'image-edit-button')
			.attr('data-tooltip', 'Expand image')
		;
		this.fitImageButton = false;

	},
	//TODO: remove this. This method is deprecated, since the fit mask button is not used anymore
	fitMask: function(){
		var canvas = $('#uimage-canvas'),
			mask = $('#uimage-mask'),
			columnWidth = Math.round((mask.width() + 30) / this.options.fitMaskColumns),
			halfBorder = this.bordersWidth / 2,
			canvasSize = {width: canvas.width(), height: canvas.height()},
			rowHeight = 15,
			elementColumns = Math.ceil((canvasSize.width + 30) / columnWidth),
			maskNewSize = {
				height: Math.ceil(canvasSize.height / rowHeight) * rowHeight,
				width: elementColumns * columnWidth - 30,
			},
			optionsNew = this.options
		;

		optionsNew.position = {top: 0, left: 0};
		optionsNew.size = canvasSize;
		optionsNew.maskSize = maskNewSize;
		optionsNew.align = 'left';
		optionsNew.setImageSize = false;
		optionsNew.rotation = this.rotation;
		optionsNew.elementColumns = elementColumns;

		this.open(optionsNew);

		console.log(canvasSize);
	},

	setImageFullSize: function(e, alert) {
		if(e)
			e.preventDefault();

		var img = this.$('.uimage-img'),
			mask = this.$('#uimage-mask'),
			canvas = this.$('#uimage-canvas'),
			handle = this.$('#uimage-drag-handle'),
			size = this.initialImageSize(100, false, {width: mask.width(), height: mask.height()})
		;

		canvas.css(size);
		handle.css(size);

		img.css({
			height: '100%',
			width: '100%'
		});

		this.selectMode(size, true);

		this.setResizingLimits();
		$('#uimage-drag-handle').draggable('option', 'containment', this.getContainment());
	},

	centerImage: function(vertical) {
		var canvas = this.$('#uimage-canvas'),
			mask = this.$('#uimage-mask'),
			handle = this.$('#uimage-drag-handle'),
			border = this.bordersWidth / 2,
			position = {
				top: canvas.offset().top,
			}
		;
		if(vertical)
			position.top = mask.offset().top - ((canvas.height() - mask.height()) / 2) + border;

		if((this.mode != 'vertical' && this.mode != 'small') || this.align == 'center')
			position.left = mask.offset().left - ((canvas.width() -  mask.width()) / 2);
		else if(this.align == 'left')
			position.left = mask.offset().left;
		else
			position.left = mask.offset().left + mask.width() - canvas.width();

		position.left += border;

		canvas.css(position);
		handle.css(position);
	},

	getFullWidthImage: function(fullSize) {
		var grid = $(document.querySelector('.upfront-grid-layout')),
			gridWidth = grid.width() - 30,
			gridMaxWidth = grid.css('max-width'),
			size = fullSize || this.fullSize
		;

		if(size.width > gridWidth)
			size = {width: gridWidth, height: Math.round(size.height / (size.width / gridWidth))};


		return {
			size: size,
			left: grid.offset().left + 15
		};
	},

	initialImageSize: function(overflow, stretch, maskDimensions) {
		var mask = this.$('#uimage-mask'),
			size = {
				width: 0,
				height: 0
			},
			maskSize = maskDimensions ? maskDimensions : {
				width: mask.width(),
				height: mask.height()
			},
			pivot, factor, invertPivot,
			stretchImage = !!stretch
		;

		//prevent strange behaviors
		overflow = overflow ? overflow : 0;

		//this.fullSize = this.getImageFullSize();

		pivot = maskSize.width / maskSize.height < this.fullSize.width / this.fullSize.height ? 'height' : 'width';
		invertPivot = this.invert ? (pivot == 'width' ? 'height' : 'width') : pivot;

		factor = this.fullSize[pivot] / (maskSize[invertPivot] + overflow);

		if(!stretchImage && factor < 1)
			size = this.fullSize;
		else
			size = {
				width: Math.ceil(this.fullSize.width / factor),
				height: Math.ceil(this.fullSize.height / factor)
			};

		return size;
	},

	getResizeImageDimensions: function(imageDim, wrapperDim, fittingType, overflow){
		var imageFactor = imageDim.width / imageDim.height,
			wrapperFactor = wrapperDim.width / wrapperDim.height,
			type = fittingType && fittingType == 'outer' ? 'outer' : 'inner',
			pivot = type == 'inner'  ? (imageFactor > wrapperFactor ? 'width' : 'height') : (imageFactor > wrapperFactor ? 'height' : 'width'),
			padding = overflow || 0,
			targetDim = wrapperDim[pivot] + padding
		;
/*
		if(imageDim[pivot] <= targetDim)
			return imageDim;
*/
		var factor = targetDim / imageDim[pivot];

		return {width: Math.round(imageDim.width * factor), height: Math.round(imageDim.height * factor)};
	},

	getImageData: function(ids, customImageSize, element_id) {
		var me = this,
			options = {
				action: 'upfront-media-image_sizes',
				item_id: JSON.stringify(ids),
				element_id: element_id,
			}
		;

		if(customImageSize)
			options.customSize = customImageSize;

		return Upfront.Util.post(options);
	},

	saveImageEdition: function(imageId, rotate, resize, crop){
		var me = this,
			opts = {
				action: 'upfront-media-image-create-size',
				images: [{
					element_id: this.element_id,
					id: imageId,
					rotate: rotate,
					resize: resize,
					crop: crop
				}]
			}
		;

		return Upfront.Util.post(opts);
	},
	selectAlign: function(){
		if(this.align == 'left')
			this.setAlign('center');

		else if(this.align == 'center')
			this.setAlign('right');

		else if(this.align == 'right')
			this.setAlign('left');
	},

	setAlign: function(direction){
		var mask = this.$('#uimage-mask'),
			canvas = this.$('#uimage-canvas'),
			handle = this.$('#uimage-drag-handle'),
			position = canvas.position()
		;

		this.$('#image-edit-button-align').removeClass('align-left align-right align-center').addClass('align-' + direction);

		if(direction != 'left' && direction != 'center' && direction != 'right')
			return false;
		this.align = direction;

		if(this.align == 'center')
			position.left = mask.offset().left - ((canvas.width() -  mask.width()) / 2);
		else if(this.align == 'left')
			position.left = mask.offset().left;
		else
			position.left = mask.offset().left + mask.width() - canvas.width();

		position.left += this.bordersWidth / 2;

		canvas.css(position);
		handle.css(position);

		this.$('#uimage-drag-handle').draggable('option', 'containment', this.getContainment());
	},

	showTooltip: function(e){
		var button = $(e.target),
			tt = this.$('#uimage-tooltip')
				.text(button.attr('data-tooltip'))
				.show()
			;

		tt.css({
			top: button.offset().top - Math.round(1.5*tt.height()),
			left: button.offset().left + button.width() / 2 - tt.width() / 2 + 5
		});
	},

	hideTooltip: function(e) {
		this.$('#uimage-tooltip').hide();
	},

	keyMove: function(e) {
		switch(e.which){
			case 40: //down
				this.maskOffset.top--;
				this.positionEditorElements();
				break;
			case 39: //right
				this.maskOffset.left--;
				this.positionEditorElements();
				break;
			case 37: //left
				this.maskOffset.left++;
				this.positionEditorElements();
				break;
			case 38: //up
				this.maskOffset.top++;
				this.positionEditorElements();
		}
	},

	fixImageTop: function(offset){
		if(offset && typeof offset.top != 'undefined'){
			if(offset.top < 120){
				var margin = $('body').css('marginTop');
				margin = parseInt(margin.replace('px', ''), 10);
				if(!isNaN(margin)){
					this.fixTop = 120 - offset.top;
					$('body').css(('marginTop'), margin + this.fixTop);
					return this.fixTop;
				}
			}
		}
		return 0;
	},

	unfixImageTop: function(){
		if(this.fixTop){
			var margin = $('body').css('marginTop');
			margin = parseInt(margin.replace('px', ''), 10);
			if(!isNaN(margin)){
				$('body').css(('marginTop'), margin - this.fixTop);
			}
			this.fixTop = 0;
		}
	}
});

var ImageSelector = Backbone.View.extend({
	selectorTpl: _.template($(editorTpl).find('#selector-tpl').html()),
	progressTpl: _.template($(editorTpl).find('#progress-tpl').html()),
	formTpl: _.template($(editorTpl).find('#upload-form-tpl').html()),
	deferred: false,
	defaultOptions: {multiple: false, preparingText: 'Preparing image'},
	options: {},

	initialize: function(){
		var me = this;
		//Set the form up
		if(! $('#upfront-upload-image').length){
			$('body').append(me.formTpl({url: Upfront.Settings.ajax_url}));

			$('#upfront-image-file-input').on('change', function(e){
				if(this.files.length){
					var size = this.files[0].size;
					if(size > 2048000){
						if(confirm('You are trying to upload a file bigger than 2MB. It will take long time. Are you sure?')){
							me.openProgress(function(){
								me.uploadImage();
							});
						}
					}
					else
						me.openProgress(function(){
							me.uploadImage();
						});
				}
			});
		}
	},

	open: function(options){
		var me = this;
		this.deferred = $.Deferred();

		if(! _.isObject(options))
			options = {};

		this.options = _.extend({}, this.defaultOptions, options);

		this.openSelector();

    Upfront.Events.trigger('upfront:element:edit:start', 'media-upload');

		return this.deferred.promise();
	},

	openSelector: function(){
		var me = this;
		this.openOverlaySection(this.selectorTpl, {}, function(overlay){

			$('#upront-image-placeholder')
                .on('dragenter', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragleave', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).css('border-color', '#C3DCF1');
                    $(this).css('background', 'none');
                })
                .on('dragover', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).css('border-color', '#1fcd8f');
                    $(this).css('background', 'rgba(255,255,255,.1)');
                    $(this).find()
                })
                .on('drop', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.originalEvent.dataTransfer){
                    	var files = e.originalEvent.dataTransfer.files,
                    		input = $('#upfront-image-file-input')
                		;
	                    // Only call the handler if 1 or more files was dropped.
	                    if (files.length && input.length){
	                    	input[0].files = files;
	                    }
                    }

                })
            ;
            me.resizeOverlay();
		});
	},

	openProgress: function(callback){
		var me = this;
		this.openOverlaySection(this.progressTpl, {}, function(){
            me.resizeOverlay();
            callback();
		});
	},

	resizeOverlay: function(){
		var overlay = $('#upfront-image-overlay');
		if(!overlay.length)
			return;

		var placeholder = $('#upront-image-placeholder'),
			uploading = $('#upfront-image-uploading'),
			phcss = {},
			left = $('#sidebar-ui').width(),
			style = {
				left: left,
				width: $(window).width() - left,
				height: $(window).height()
			},
			ptop = (style.height / 2 - 220)
		;

		if(ptop > 0){
			overlay.removeClass('small_placeholder');
			ptop += 'px';
		}
		else {
			overlay.addClass('small_placeholder');
			ptop = (style.height / 2 - 140) + 'px';
		}

		overlay.css(style);
		phcss = {
			height: style.height - 100,
			'padding-top':  ptop,
		};

		placeholder.css(phcss);
		uploading.css(phcss);
	},

	close: function() {
		this.closeOverlay();
	},

	cancelOverlay: function(e) {
		if(e.target == e.currentTarget)
			this.closeOverlay(e);
	},
	closeOverlay: function(e){
		var me = this;
		$('#upfront-image-overlay')
			.off('click')
			.fadeOut('fast', function(){
				$(this).remove();
				$('#upfront-image-overlay').remove();
			})
		;

		$('html').css({
			overflow: this.bodyOverflow ? this.bodyOverflow : 'auto',
			height: 'auto',
			width: 'auto'
		});

		$('body').removeClass('upfront-image-upload-open');

		if(this.reopenSettings){
			$('#settings').fadeIn();
			this.reopenSettings = false;
		}

		//Restart draggable
		//this.parent_module_view.$('.upfront-editable_entity:first').draggable('enable');

		$(window).off('resize', this.resizeOverlay);
    Upfront.Events.trigger('upfront:element:edit:stop');
	},

	openOverlaySection: function(tpl, tplOptions, callback){
		var me = this,
			settings = $('#settings'),
			overlay = $('#upfront-image-overlay')
			//,parent = this.parent_module_view.$('.upfront-editable_entity:first')
		;

		/*
		if(!this.elementSize.width)
			this.setElementSize();
		*/
		if(overlay.length){
			$('.upfront-image-section').fadeOut('fast', function(){
				var content = $(tpl(tplOptions)).hide();
				overlay.append(content);
				content.fadeIn('fast');
				$(this).remove();
				if(callback){
					callback(overlay);
				}
			});
			return;
		}

		this.bodyOverflow = $('html').css('overflow');
		$('html')
			.css({
				overflow: 'hidden',
				width: $(window).width() + 'px',
				height: $(window).height() + 'px'
			})
		;

		//Stop draggable
		/*
		if (parent.is(".ui-draggable"))
			parent.draggable('disable');
		*/

		overlay = $('<div id="upfront-image-overlay"></div>').append(tpl(tplOptions)).hide();

		$('body')
			.append(overlay)
			.addClass('upfront-image-upload-open')
		;


		this.setOverlayEvents();

		overlay.fadeIn('fast');
		this.resizeOverlay();

		$(window)
			.on('resize', function(e){
				if(e.target == window){
					me.resizeOverlay();
				}
			})
		;

		if(settings.is(':visible')){
			settings.fadeOut();
			this.reopenSettings = true;
		}

		if(callback)
			callback(overlay);

		//$('#upfront-image-overlay').fadeIn('fast');
	},

	setOverlayEvents: function() {
		var me = this;
		$('#upfront-image-overlay')
			.on('click', function(e){
				me.cancelOverlay(e);
			})
			.on('click', 'a.select-files', function(e){
				me.openFileBrowser(e);
			})
			.on('click', 'a.image-edit-change', function(e){
				me.openImageSelector(e);
			})
			.on('click', 'a.open-media-gallery', function(e){
				me.openMediaGallery(e);
			})
		;
	},

	openMediaGallery: function(e) {
		var me = this;
		e.preventDefault();
		Upfront.Media.Manager.open({
			multiple_selection: this.options.multiple,
			media_type:['images']
		}).done(function(popup, result){
			if(result && result.length > 0){
				var ids = [];
				result.each(function(image){
					ids.push(image.get('ID'));
				});
				// We really should be having the element_id in our context by now...
				Upfront.Views.Editor.ImageEditor.getImageData(ids, me.options.customImageSize, me.options.element_id)
					.done(function(response){
						me.deferred.resolve(response.data.images, response);
					})
				;

				me.openProgress(function(){
					$('#upfront-image-uploading h2').html(me.options.preparingText);
				});
			}
		});
	},
	openFileBrowser: function(e){
		e.preventDefault();
	    console.log('clicking');
		$('#upfront-image-file-input').click();
	},
	checkFileUpdate: function(e){
	     console.log('here we are');
	     return true;
	},

	uploadImage: function(e){
		if(e)
			e.preventDefault();

		var me = this,
			progress = $('#upfront-progress'),
			fileInput = $('#upfront-image-file-input'),
			form = $('#upfront-upload-image')
		;

		form.ajaxSubmit({
			beforeSend: function() {
				progress.css('width', '0');
			},
			uploadProgress: function(e, position, total, percent) {
				progress.css('width', percent + '%');
				console.log(percent);
			},
			complete: function() {
				$('#upfront-image-uploading h2').html('Preparing Image');
			},
			success: function(response){
				progress.css('width', '100%');
				console.log(response);
				Upfront.Views.Editor.ImageEditor.getImageData(response.data, me.options.customImageSize)
					.done(function(response){
						me.deferred.resolve(response.data.images, response);
					})
					.error(function(){
						Upfront.Views.Editor.notify("There was an error uploading the file. Please try again.", 'error');
						me.openSelector();
					})
				;
				form[0].reset();
			},
			error: function(response){
				Upfront.Views.Editor.notify(response.responseJSON.error, 'error');
				me.openSelector();
				form[0].reset();
			},
			dataType: 'json'
		});
	}


});

var Control = Upfront.Views.Editor.InlinePanels.Item.extend({
	events: {
		'click': 'clicked'
	},
	clicked: function(e){
		e.preventDefault();
		this.$el
			.siblings('.upfront-inline-panel-subitem-active')
			.removeClass('upfront-inline-panel-subitem-active')
		;
		this.trigger('click', e);
	}
});

var TooltipControl = Control.extend({
	events: {
		'click': 'onClickControl',
		'click .upfront-inline-panel-item': 'selectItem'
	},

	onClickControl: function(e){
		e.preventDefault();
		// Deactivate others controls
		this.clicked(e);
		this.$el.toggleClass('open');
	},

	render: function() {
		Upfront.Views.Editor.InlinePanels.Item.prototype.render.call(this, arguments);
		var tooltip = this.$('.uimage-control-tooltip'),
			me = this
		;
		if(!this.$el.hasClass('uimage-control-tooltip-item'))
			this.$el.addClass('uimage-control-tooltip-item');

		if(!tooltip.length){
			tooltip = $('<div class="uimage-control-tooltip"></div>');
			this.$el.append(tooltip);
		}
		tooltip.html('<div class="uimage-control-tooltip-tip"></div>');
		_.each(this.sub_items, function(item, key){
			if(key != me.selected){
				item.render();
				tooltip.append(item.$el);
			}
		});

		this.$('.upfront-icon-region-caption').addClass('upfront-icon-region-' + this.selected);
	},

	get_selected_item: function () {
		return this.selected;
	},

	selectItem: function(e){
		var found = false,
			target = $(e.target).is('i') ? $(e.target) : $(e.target).find('i')
		;
		_.each(this.sub_items, function(item, key){
			if(target.hasClass('upfront-icon-region-' + item.icon))
				found = key;
		});

		if(found){
			this.selected = found;
			this.render();
			this.trigger('select', found);
		}
	}

});

var MultiControl = Upfront.Views.Editor.InlinePanels.ItemMulti.extend({
	events: {
		'click': 'clicked',
		'click .upfront-inline-panel-item': 'selectItem'
	},
	render: function(){
		Upfront.Views.Editor.InlinePanels.ItemMulti.prototype.render.call(this, arguments);
	},
	clicked: function(e){
		this.trigger('click', e);
		this.toggle_subitem();
	},
	get_selected_item: function () {
		return this.selected;
	},
	selectItem: function(e){
		var found = false,
			target = $(e.target).is('i') ? $(e.target) : $(e.target).find('i')
		;
		_.each(this.sub_items, function(item, key){
			if(target.hasClass('upfront-icon-region-' + item.icon))
				found = key;
		});

		if(found){
			this.selected = found;
			this.render();
			this.trigger('select', found);
		}
	}

});

var CollapsedMultiControl = MultiControl.extend({
	collapsed: true,
	render: function(){
		if(!this.sub_items['collapsedControl']){
			var control = new Control();
			control.icon = 'collapsedControl';
			control.tooltip = 'More tools';
			this.sub_items['collapsedControl'] = control;
		}
		this.selected = 'collapsedControl';

		this.constructor.__super__.render.call(this, arguments);
	},

	selectItem: function(e){
		var found = false,
			foundKey = false,
			target = $(e.target).is('i') ? $(e.target) : $(e.target).find('i')
		;

		_.each(this.sub_items, function(item, key){
			if(target.hasClass('upfront-icon-region-' + item.icon)){
				found = item;
				foundKey = key;
			}
		});

		if(found){
			if(found instanceof MultiControl){
				return false;
			}
			else {
				this.render();
				this.trigger('select', foundKey);
			}
		}
	},

	open_subitem: function () {
		_.each(this.sub_items, function(item, key){
			if(item instanceof MultiControl){
				item.close_subitem();
			}
		});
		this.constructor.__super__.open_subitem.call(this, arguments);
	},

});

var ControlPanel = Upfront.Views.Editor.InlinePanels.Panel.extend({
	setWidth: function(width){
		var itemWidth = 40,
			items = this.items._wrapped,
			collapsed = !!items.collapsed
		;

		if(!collapsed && items.length > 3 && width < items.length * itemWidth){
			var collapsableItems = items.slice(1, items.length -1),
				collapsedControl = new CollapsedMultiControl()
			;

			_.each(collapsableItems, function(item){
				collapsedControl.sub_items[item.icon] = item;
			});

			collapsedControl.icon = 'collapsedControl';
			collapsedControl.tooltip = 'More tools';
			collapsedControl.position = 'left';

			this.items = _([items[0], collapsedControl, items[items.length - 1]]);
			return;
		}
		if(collapsed) {
			var total = 2 + items[1].sub_items.length;
			if(total * itemWidth <= width) {
				var newitems = [items[0]],
					subitems = items[1].subitems
				;
				_.each(subitems, function(it){
					newitems.push(it);
				});
				newitems.push(items[2]);

				this.items = newitems;
			}
		}

	}
});

// Context Menu for the Image element
var ImageMenuList = Upfront.Views.ContextMenuList.extend({
	initialize: function() {
		this.constructor.__super__.initialize.call(this, arguments);
		var me = this;
		var menuitemsarray = [
          new Upfront.Views.ContextMenuItem({
			  get_label: function() {
				  if(me.for_view.$el.find('div.upfront-image-container > img').length > 0)
				  	return 'Edit Image';
				  else
				  	return 'Add Image';
			  },
			  action: function() {
				   if(me.for_view.$el.find('div.upfront-image-container > img').length > 0)
				  		me.for_view.editRequest();
				   else
						me.for_view.openImageSelector();

			  }
		  })
        ];

		if(this.for_view.$el.find('div.upfront-image-container > img').length > 0) {
			menuitemsarray.push( new Upfront.Views.ContextMenuItem({
				  get_label: function() {
					  if(me.for_view.$el.find('div.upfront-image-container div.wp-caption').length > 0)
						return 'Edit Caption';
					  else
					  	return 'Add Caption';
				  },
				  action: function() {
					  if(me.for_view.$el.find('div.upfront-image-container > div.wp-caption').length > 0)
						  me.for_view.$el.find('div.upfront-image-container > div.wp-caption').data("ueditor").start();
					  else {
						 me.for_view.controls.items.value()[2].selected='topOver';
						 me.for_view.controls.items.value()[2].trigger('select');

						 me.for_view.property('include_image_caption', [1]);
						 me.for_view.property('caption_position', 'over_image');
						 me.for_view.property('caption_alignment', 'top');
						 me.for_view.render();

					  }

				  }
			  }));
		}

		this.menuitems = _(menuitemsarray);
	}
});

var ImageMenu = Upfront.Views.ContextMenu.extend({
	initialize: function() {
		this.constructor.__super__.initialize.call(this, arguments);
		this.menulists = _([
          new ImageMenuList({for_view: this.for_view})
        ]);
	}
});

Upfront.Views.Editor.InlinePanels.MultiControl = MultiControl;
Upfront.Views.Editor.InlinePanels.Control = Control;
Upfront.Views.Editor.InlinePanels.ControlPanel = ControlPanel;
Upfront.Views.Editor.InlinePanels.TooltipControl = TooltipControl;

Upfront.Application.LayoutEditor.add_object("Uimage", {
	"Model": UimageModel,
	"View": UimageView,
	"Element": ImageElement,
	"Settings": ImageSettings,
	"ContextMenu": ImageMenu
});

Upfront.Views.Editor.ImageEditor = new ImageEditor();
Upfront.Views.Editor.ImageSelector = new ImageSelector();
Upfront.Models.UimageModel = UimageModel;
Upfront.Views.UimageView = UimageView;

}); //End require

})(jQuery);
