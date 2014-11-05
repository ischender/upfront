<?php


/**
 * Serves frontend stylesheet.
 */
class Upfront_StylesheetMain extends Upfront_Server {
	public static function serve () {
		$me = new self;
		$me->_add_hooks();
	}

	private function _add_hooks () {
		upfront_add_ajax('upfront_load_styles', array($this, "load_styles"));
		upfront_add_ajax_nopriv('upfront_load_styles', array($this, "load_styles"));

		if (Upfront_Permissions::current(Upfront_Permissions::BOOT)) {
			upfront_add_ajax('upfront_theme_styles', array($this, "theme_styles"));
		}
		if (Upfront_Permissions::current(Upfront_Permissions::SAVE)) {
			upfront_add_ajax('upfront_save_styles', array($this, "save_styles"));
			upfront_add_ajax('upfront_delete_styles', array($this, "delete_styles"));

			upfront_add_ajax('upfront_save_theme_colors_styles', array($this, "save_theme_colors_styles"));
		}
	}

	function load_styles () {
		$grid = Upfront_Grid::get_grid();
		$layout = Upfront_Layout::get_instance();

		$preprocessor = new Upfront_StylePreprocessor($grid, $layout);

		//Add typography styles - rearranging so the imports from Google fonts come first, if needed
		$style = $this->prepare_typography_styles($layout);
	  $style .= $preprocessor->process();

	  // When loading styles in editor mode don't include element styles and colors since they
		// will be loaded separately to the body. If they are included in main style than after
		// style is edited in editor (e.g. some property is removed) inconsistencies may occur
		// especially with rules removal since those would still be defined in main style.
		$base_only = isset($_POST['base_only']) ? filter_var($_POST['base_only'], FILTER_VALIDATE_BOOLEAN) : false;
		if ($base_only) {
			$this->_out(new Upfront_JsonResponse_Success(array('styles' => $style)));
			return;
		}

		//Add theme styles
		$style .= $this->prepare_theme_styles();
	  // Add theme colors styles
	  $style .= $this->_get_theme_colors_styles();
		// Add tab presets styles
		$style .= $this->_get_tab_presets_styles();

	  $this->_out(new Upfront_CssResponse_Success($style));
	}

	function save_styles(){
		if (!Upfront_Permissions::current(Upfront_Permissions::SAVE)) $this->_reject();

		$name = sanitize_key(str_replace(' ', '_', trim($_POST['name'])));
		$styles = trim(stripslashes($_POST['styles']));
		$element_type = isset($_POST['elementType']) ? sanitize_key($_POST['elementType']) : 'unknown';

		// Fix storage key missing _dev in dev mode. Called from ajax, use POST.
		$storage_key = Upfront_Layout::get_storage_key();
		if (isset($_POST['dev']) && $_POST['dev'] === 'true' && strpos($storage_key, '_dev') === false) $storage_key = $storage_key . '_dev';

		$db_option = $storage_key . '_' . get_stylesheet() . '_styles';
		$current_styles = get_option($db_option, array());
    	$current_styles = apply_filters('upfront_get_theme_styles', $current_styles);

		$styles = apply_filters('upfront-save_styles', $styles, $name, $element_type);

		if(!isset($current_styles[$element_type]))
			$current_styles[$element_type] = array();

		$current_styles[$element_type][$name] = $styles;

		global $wpdb;
		update_option($db_option, $current_styles);

		$this->_out(new Upfront_JsonResponse_Success(array(
			'name' => $name,
			'styles' => $styles
		)));
	}

	function delete_styles(){
		if (!Upfront_Permissions::current(Upfront_Permissions::SAVE)) $this->_reject();

		$elementType = isset($_POST['elementType']) ? $_POST['elementType'] : false;
		$styleName = isset($_POST['styleName']) ? $_POST['styleName'] : false;

		if(!$elementType || !$styleName)
			$this->_out(new Upfront_JsonResponse_Error('No element type or style to delete.'));

		$db_option = Upfront_Layout::get_storage_key() . '_' . get_stylesheet() . '_styles';
		$current_styles = get_option($db_option);

		if(!$current_styles || !isset($current_styles[$elementType]) || !isset($current_styles[$elementType][$styleName]))
			$this->_out(new Upfront_JsonResponse_Error("The style doesn\'t exist."));

		unset($current_styles[$elementType][$styleName]);

		update_option($db_option, $current_styles);

		$this->_out(new Upfront_JsonResponse_Success(array()));
	}

	function theme_styles() {
		// Fix storage key missing _dev in dev mode. This is called from ajax calls so use POST.
		$storage_key = Upfront_Layout::get_storage_key();
		if (isset($_POST['dev']) && $_POST['dev'] === 'true' && strpos($storage_key, '_dev') === false) $storage_key = $storage_key . '_dev';
	  $styles = get_option($storage_key . '_' . get_stylesheet() . '_styles');
	  $styles = apply_filters('upfront_get_theme_styles', $styles);

	  $this->_out(new Upfront_JsonResponse_Success(array(
			'styles' => $styles
		)));
	}

	function prepare_theme_styles() {
		// Fix storage key missing _dev in dev mode. This is regular GET request.
		$storage_key = Upfront_Layout::get_storage_key();
		if (isset($_GET['load_dev']) && $_GET['load_dev'] == 1 && strpos($storage_key, '_dev') === false) $storage_key = $storage_key . '_dev';

		$styles = get_option($storage_key . '_' . get_stylesheet() . '_styles', array());
		$out = '';
		$layout = Upfront_Layout::get_cascade();
		$layout_id = ( !empty($layout['specificity']) ? $layout['specificity'] : ( !empty($layout['item']) ? $layout['item'] : $layout['type'] ) );

		if( is_array( $styles ) ){
		  foreach($styles as $type => $elements) {
			foreach($elements as $name => $content) {
			  // If region CSS, only load the one saved matched the layout_id
			  $style_rx = '/^(' . preg_quote("{$layout_id}", '/') . '|' . preg_quote("{$type}", '/') . ')/';
			  if ( preg_match('/^region(-container|)$/', $type) && !preg_match($style_rx, $name) )
				continue;
			  $out .= $content;
			}
		  }
		}


		$out = apply_filters('upfront_prepare_theme_styles', $out);

		return $out;
	}

	function prepare_typography_styles ($layout) {
		$typography = $layout->get_property_value('typography');
		if (!$typography)
			return '';
		$out = '';
		$faces = array();
		foreach ( $typography as $element=>$properties ){
			$properties = wp_parse_args($properties, array(
				'font_face' => false,
				'weight' => false,
				'style' => false,
				'size' => false,
				'line_height' => false,
				'color' => false,
			));
			$face = !empty($properties['font_face'])
				? $properties['font_face']
				: false
			;
			$faces[] = array(
				'face' => $face,
				'weight' => $properties['weight']
			);
			if (!empty($face) && false !== strpos($face, ' '))  $face = '"' . $face . '"';
			$font = $properties['font_face'] ? "{$face}, {$properties['font_family']}" : "inherit";
			$out .= ".upfront-output-object $element {\n" .
					"font-family: {$font};\n" .
					( $properties['weight'] ? "font-weight: {$properties['weight']};\n" : "" ) .
					( $properties['style'] ? "font-style: {$properties['style']};\n" : "" ) .
					( $properties['size'] ? "font-size: {$properties['size']}px;\n" : "" ) .
					( $properties['line_height'] ? "line-height: {$properties['line_height']}em;\n" : "" ) .
					"color: {$properties['color']};\n" .
					"}\n";
		}

		$faces = array_values(array_filter(array_unique($faces, SORT_REGULAR)));
		$google_fonts = new Upfront_Model_GoogleFonts;
		$imports = '';
		foreach ($faces as $face) {
			if (!$google_fonts->is_from_google($face['face'])) continue;
			$imports .= "@import \"https://fonts.googleapis.com/css?family=" .
				preg_replace('/\s/', '+', $face['face']);
			if ($face['weight'] != 400) $imports .= ':' . $face['weight'];
			$imports .= "\";\n";
		}
		if (!empty($imports)) $out = "{$imports}\n\n{$out}";

		$out = apply_filters('upfront_prepare_typography_styles', $out);

		return $out;
	}

    /**
     * Saves theme colors styles
     * Hooks to upfront_save_theme_colors_styles ajax call
     * @access public
     */
    function save_theme_colors_styles(){
        if (!Upfront_Permissions::current(Upfront_Permissions::SAVE)) $this->_reject();

        $styles = trim(stripslashes($_POST['styles']));
        $styles = apply_filters('upfront-save_theme_colors_styles', $styles);

        update_option("upfront_theme_colors_styles", $styles);

        $this->_out(new Upfront_JsonResponse_Success(array(
            'styles' => $styles
        )));
    }

    private function _get_theme_colors_styles(){
        return get_option("upfront_theme_colors_styles");
    }

		private function _get_tab_presets_styles() {
			$presets = json_decode(get_option('upfront_' . get_stylesheet() . '_tab_presets'), true);
			if (empty($presets)) {
				return '';
			}

			$styles = "\n";
			foreach ($presets as $preset) {
				$styles .= ' .tab-preset-' . $preset['id'] . ' .tabs-tab:hover {' . "\n" .
					' color: #' . $preset['hover-font-color'] . ';' . "\n" .
					' font-family: ' . $preset['hover-font-family'] . ';' . "\n" .
					' font-size: ' . $preset['hover-font-size'] . 'px;' . "\n" .
					'}' . "\n" .
					' .tab-preset-' . $preset['id'] . ' .tabs-tab.tabs-tab-active {' . "\n" .
					' color: #' . $preset['active-font-color'] . ';' . "\n" .
					' font-family: ' . $preset['active-font-family'] . ';' . "\n" .
					' font-size: ' . $preset['active-font-size'] . 'px;' . "\n" .
					' transition: none;' . "\n" .
					'}' . "\n" .
					' .tab-preset-' . $preset['id'] . ' .tabs-tab {' . "\n" .
					' color: #' . $preset['static-font-color'] . ';' . "\n" .
					' font-family: ' . $preset['static-font-family'] . ';' . "\n" .
					' font-size: ' . $preset['static-font-size'] . 'px;' . "\n" .
			    ' transition: all ' . $preset['hover-transition-duration'] . 's ' . $preset['hover-transition-easing'] . ';' . "\n" .
					'}' . "\n";
			}

			return $styles;
		}
}
