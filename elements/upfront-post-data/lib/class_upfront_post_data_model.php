<?php

/**
 * Post data model factory class.
 */
class Upfront_Post_Data_Model {


	/**
	 * Fetch post
	 * @param  integer $post_id Raw data (element properties)
	 */
	public static function get_post ($post_id = null) {
		$post = get_post($post_id);
			
		return $post;
	}

	public static function spawn_post ($data) {
		$post = Upfront_Post_Data_Model::get_post( !empty($data['post_id']) && is_numeric($data['post_id']) && $data['post_id'] > 0 ? $data['post_id'] : null );
		$post = apply_filters('upfront-post_data-unknown_post', $post, $data);
		// Let's override author id if requested, this is to support rendering different author while editing post
		if ( !empty($data['author_id']) && is_numeric($data['author_id']) && $data['author_id'] > 0 && $data['author_id'] != $post->post_author ){
			$author = get_userdata($data['author_id']);
			if ( $author ) $post->post_author = $data['author_id'];
		}
		// Also override date if requested, to support rendering date while editing
		if ( ! empty($data['post_date']) && strtotime($data['post_date']) != strtotime($post->post_date) ){
			$post->post_date = date('Y-m-d H:i:s', strtotime($data['post_date']));
		}
		return $post;
	}
}
