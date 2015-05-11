<?php


/**
 * Individual post item markup generation.
 * Takes care of the post parts template expanstion.
 */
abstract class Upfront_Post_Data_PartView extends Upfront_PostPart_View {

	const DEFAULT_DATA_TYPE = 'post_data';
	
	protected $_data = array();
	protected $_post;

	protected static $_parts = array();

	public function __construct ($data=array()) {
		$this->_data = $data;
	}

	/**
	 * Main public method.
	 * Expands each part of the post parts and constructs markup string,
	 * then wraps it in post wrapper.
	 * @param object WP_Post object instance
	 * @return string Rendered post markup
	 */
	public function get_markup ($post) {
		if (empty($post)) return false;
		$this->_post = $post;

		$post_parts = self::get_default_parts($this->_data);
		$enabled_post_parts = $this->_get_parts_from_objects();
		$parts = array();
		foreach ($post_parts as $part) {
			if (!in_array($part, $enabled_post_parts)) continue;
			$method = "expand_{$part}_template";
			if (method_exists($this, $method)) $parts[$part] = $this->$method();
			else $parts[$part] = apply_filters('upfront_posts-' . $method, '', $post);
		}

		// Also expand postmeta codes outside the meta element
		//$out = Upfront_Codec::get('postmeta')->expand_all($out, $post);

		return $parts;
	}

	/**
	 * Fetches array of supported post parts.
	 * @return array A list of known parts.
	 */
	public static function get_default_parts ($data) {
		$class_name = self::_get_view_class($data);
		$class_vars = get_class_vars($class_name);
		return $class_vars['_parts'];
	}

	/**
	 * Loads post part template from a file.
	 * @param string $slug Post part template slug
	 * @return string Loaded template
	 */
	protected function _get_template ($slug) {
		return Upfront_Post_Data_Data::get_template($slug, $this->_data);
	}
	
	protected function _get_parts_from_objects () {
		if ( empty($this->_data['objects']) )
			return array();
		$parts = array();
		foreach ( $this->_data['objects'] as $object ) {
			$part = upfront_get_property_value('part_type', $object);
			$parts[] = $part;
		}
		return $parts;
	}

	public static function _get_view_class ($data) {
		$data_type = !empty($data['data_type']) ? $data['data_type'] : self::DEFAULT_DATA_TYPE;
		$class_name = get_class() . '_' . self::_normalize_type_to_class($data_type);
		if (!class_exists($class_name)) $class_name = get_class() . '_' . self::_normalize_type_to_class(self::DEFAULT_DATA_TYPE);
		return $class_name;
	}
	
	private static function _normalize_type_to_class ($type) {
		$type_strings = explode('_', $type);
		$type_strings = array_map('ucfirst', $type_strings);
		return join('_', $type_strings);
	}
}

class Upfront_Post_Data_PartView_Post_data extends Upfront_Post_Data_PartView {
	protected static $_parts = array(
		0 => 'date_posted',
		1 => 'title',
		2 => 'content'
	);
}

class Upfront_Post_Data_PartView_Author extends Upfront_Post_Data_PartView {
	protected static $_parts = array(
		0 => 'author',
		1 => 'gravatar'
	);
}

class Upfront_Post_Data_PartView_Taxonomy extends Upfront_Post_Data_PartView {
	protected static $_parts = array(
		0 => 'tags',
		1 => 'categories'
	);
}

class Upfront_Post_Data_PartView_Featured_Image extends Upfront_Post_Data_PartView {
	protected static $_parts = array(
		0 => 'featured_image',
	);
}

class Upfront_Post_Data_PartView_Comments extends Upfront_Post_Data_PartView {
	protected static $_parts = array(
		0 => 'comment_count',
		1 => 'comments',
		2 => 'comment_form'
	);
}
