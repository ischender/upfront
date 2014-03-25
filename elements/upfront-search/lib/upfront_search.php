<?php

/**
 * Object implementation for Search entity.
 * A fairly simple implementation, with applied settings.
 */
class Upfront_UsearchView extends Upfront_Object {

	public function get_markup () {
		$element_id = $this->_get_property('element_id');
		$element_id = $element_id ? "id='{$element_id}'" : '';

		$label = $this->_get_property("label");
		$iconClass = ($label == '__image__' || !$label) ? ' search-icon' : ' search-text';
		$label = !empty($label) && '__image__' != $label
			? $label
			: '<i class="icon-search"></i>'
		;
    $show_button = $this->_get_property('search_type');


		$placeholder = $this->_get_property("placeholder");
		$placeholder = $placeholder ? "placeholder='{$placeholder}'" : '';

		$rounded = $this->_get_property("is_rounded") ? 'rounded' : '';

		$color = $this->_get_property("color");
		$color = $color ? "style='background-color:{$color};'" : '';

    $markup = "<div class=' upfront-search {$rounded}' {$color} {$element_id}>" .
			"<form action='" . esc_url( home_url( '/' ) ) . "' method='GET'>" .
			"<input type='search' class='search-field{$iconClass}' name='s' value='' $placeholder  />";
    if ($show_button !== false) {
      $markup .= !empty($label)?"<button class='search-button{$iconClass}".($label == '<i class="icon-search"></i>'?" image":"") ."'>{$label}</button>":"";
    }
    $markup .= '</form>' .
		"</div>";

    return $markup;
	}

	public static function add_js_defaults($data){
        $data['usearch'] = array(
            'defaults' => self::default_properties(),
         );
        return $data;
    }

    //Defaults for properties
    public static function default_properties(){
        return array(
            'type' => 'UsearchModel',
            'view_class' => 'UsearchView',
            'class' => 'c24 upfront-search',
            'has_settings' => 1,
            'id_slug' => 'usearch',

            'placeholder' => 'Search',
            'label' => 'Custom text',
            'is_rounded' => 0,
            'color' => ''
        );
    }
}
