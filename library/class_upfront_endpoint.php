<?php

abstract class Upfront_Endpoint extends Upfront_Server {

	abstract public function create_endpoint ();
	abstract public function apply_endpoint ();


	protected function _add_hooks () {
		add_action('init', array($this, "create_endpoint"));
		add_action('template_redirect', array($this, "apply_endpoint"));
	}

}

abstract class Upfront_VirtualPage extends Upfront_Server {

	protected $_subpages = array();

	abstract public function get_slug ();
	abstract public function render ($request);
	
	protected function _add_hooks () {
		$this->_add_subpages();
		add_action('template_redirect', array($this, "intercept_page"), 0);
	}

	protected function _add_subpages () {}

	public function intercept_page () {
		if (!$this->_parse_request()) return false;
		//if ($this->get_slug() != get_query_var('name')) return false;
		$this->render();
	}

	public static function redirect ($request) {
		$url = get_option('permalink_structure')
			? site_url($request)
			: site_url() . '?name=' . $request
		;
		wp_safe_redirect($url);
		die;
	}

	private function _parse_request () {
		$raw_request = get_option('permalink_structure')
			? $this->_parse_pretty_permalink_request()
			: $this->_parse_default_request()
		;
		if (!$raw_request) return false;
		$request = array_map('trim', explode('/', $raw_request));
		if (empty($request) || empty($request[0])) return false;
		if ($this->get_slug() !== $request[0]) return false;

		if (!empty($request[1]) && !empty($this->_subpages)) {
			foreach($this->_subpages as $subpage) {
				if ($subpage->get_slug() !== $request[1]) continue;
				status_header(200);
				$subpage->render($request);
				break;
			}
		} else {
			status_header(200);
			$this->render($request);
		}
	}

	public static function get_url ($request) {
		return get_option('permalink_structure')
			? site_url($request)
			: site_url() . '?name=' . $request
		;
	}

	private function _parse_pretty_permalink_request () {
		global $wp;
		return $wp->request;
	}

	private function _parse_default_request () {
		return !empty($_GET['name']) ? $_GET['name'] : false;
	}
}

abstract class Virtual_Content_Page extends Upfront_VirtualPage {

	protected function _add_hooks () {
		if (!current_user_can('edit_posts')) return false;
		parent::_add_hooks();
	}

}

abstract class Upfront_VirtualSubpage {
	abstract public function get_slug ();
	abstract public function render ($request);
}

// ----- Implementations

// --- Creators

class Upfront_NewPage_VirtualSubpage extends Upfront_VirtualSubpage {
	
	public function get_slug () {
		return 'page';
	}

	public function render ($request) {
		$page = Upfront_PostModel::create('page', __('Change me, please', 'upfront'), __('Super awesome content', 'upfront'));
		Upfront_VirtualPage::redirect('edit/page/' . $page->ID);
	}
}

class Upfront_NewPost_VirtualSubpage extends Upfront_VirtualSubpage {
	
	public function get_slug () {
		return 'post';
	}

	public function render ($request) {
		$page = Upfront_PostModel::create('post', __('I am a post title - change me, please', 'upfront'), __('Super awesome post content', 'upfront'));
		Upfront_VirtualPage::redirect('edit/post/' . $page->ID);
	}
}

class Upfront_ContentCreator_VirtualPage extends Virtual_Content_Page {
	
	public static function serve () {
		$me = new self;
		$me->_add_hooks();
	}

	protected function _add_subpages () {
		$this->_subpages = array(
			new Upfront_NewPage_VirtualSubpage(),
			new Upfront_NewPost_VirtualSubpage(),
		);
	}

	public function get_slug () {
		return 'create';
	}

	public function render ($request) {}

}
Upfront_ContentCreator_VirtualPage::serve();


// --- Editors


class Upfront_EditPage_VirtualSubpage extends Upfront_VirtualSubpage {
	
	public function get_slug () {
		return 'page';
	}

	public function render ($request) {
		$post_id = end($request);
		$post = Upfront_PostModel::get($post_id);
		add_filter('wp_title', array($this, 'get_title'));
		require_once('templates/edit.php');
		die;
	}

	public function get_title () {
		return 'Edit page';
	}
}

class Upfront_EditPost_VirtualSubpage extends Upfront_VirtualSubpage {
	
	public function get_slug () {
		return 'post';
	}

	public function render ($request) {
		$post_id = end($request);
		global $post, $wp_query;
		$wp_query = new WP_Query(array(
			'p' => $post_id,
		));
		//add_filter('wp_title', array($this, 'get_title'));
		add_action('wp_footer', array($this, 'start_editor'), 999);
		add_filter('upfront-data-post_id', create_function('', "return $post_id;"));
		load_template(get_single_template());
		die;
	}

	public function get_title () {
		return 'Edit post';
	}

	public function start_editor () {
		echo <<<EOSEJS
<script>
(function ($) {

$(window).load(function () {
	$("body").append("<a class='upfront-edit_layout' />");
	$(".upfront-edit_layout:first").trigger("click");
	var c1 = function (view, model) {
			var objects = model.get("objects"),
				is_this_post = objects.find(function (obj) { return 'ThisPostView' == obj.get_property_value_by_name('view_class'); })
			;
			if (is_this_post) {
				Upfront.Events.on("elements:this_post:loaded", c2);
				Upfront.Events.off("entity:module:after_render", c1);
			}
		},
		c2 = function (view) {
			var el = $("#" + view.model.get_property_value_by_name("element_id"));
			el.trigger('dblclick');
			Upfront.Events.off("elements:this_post:loaded", c2);
		}
	;
	Upfront.Events.on("entity:module:after_render", c1);
});
})(jQuery);
</script>
EOSEJS;
	}
}

class Upfront_ContentEditor_VirtualPage extends Virtual_Content_Page {
	
	public static function serve () {
		$me = new self;
		$me->_add_hooks();
	}

	protected function _add_subpages () {
		$this->_subpages = array(
			new Upfront_EditPage_VirtualSubpage(),
			new Upfront_EditPost_VirtualSubpage(),
		);
	}

	public function get_slug () {
		return 'edit';
	}

	public function render ($request) {}

}
Upfront_ContentEditor_VirtualPage::serve();

// --- Save handlers

class Upfront_Editor_Ajax extends Upfront_Server {
	public static function serve () {
		$me = new self;
		$me->_add_hooks();
	}

	private function _add_hooks () {
		add_action('wp_ajax_upfront-edit-publish', array($this, "publish_post"));
		add_action('wp_ajax_upfront-edit-draft', array($this, "draft_post"));
		
		add_action('wp_ajax_upfront-post-get_taxonomy', array($this, "get_post_taxonomy"));
		add_action('wp_ajax_upfront-post-create_term', array($this, "create_new_term"));
		add_action('wp_ajax_upfront-post-update_terms', array($this, "update_post_terms"));
		
		//add_action('wp_ajax_upfront-get_page_data', array($this, "get_page_data"));
		//add_action('wp_ajax_upfront-get_post_data', array($this, "get_post_data"));
		
		add_action('wp_ajax_upfront-post-update_slug', array($this, "update_post_slug"));
		add_action('wp_ajax_upfront-post-update_status', array($this, "update_post_status"));
		add_action('wp_ajax_upfront-post-update_password', array($this, "update_post_password"));
		
		add_action('wp_ajax_upfront-comments-approve', array($this, "approve_comment"));
		add_action('wp_ajax_upfront-comments-unapprove', array($this, "unapprove_comment"));
		add_action('wp_ajax_upfront-comments-thrash', array($this, "thrash_comment"));
		add_action('wp_ajax_upfront-comments-unthrash', array($this, "unthrash_comment"));
		add_action('wp_ajax_upfront-comments-spam', array($this, "spam_comment"));
		add_action('wp_ajax_upfront-comments-unspam', array($this, "unthrash_comment"));
		
		add_action('wp_ajax_upfront-comments-reply_to', array($this, "post_comment"));
		add_action('wp_ajax_upfront-comments-update_comment', array($this, "update_comment"));

		add_action('wp_ajax_upfront-wp-model', array($this, "handle_model_request"));
	}

	function handle_model_request(){
		$data = stripslashes_deep($_POST);
		$action = $data['model_action'];
		
		if(!method_exists($this, $action))
			$this->_out(new Upfront_JsonResponse_Error($action . ' not implemented.'));
		
		call_user_func(array($this, $action), $data);
	}

	function publish_post () {
		$this->_process_post('publish');
	}

	function draft_post () {
		$this->_process_post('draft');
	}

	private function _process_post ($status) {
		$data = stripslashes_deep($_POST['data']);
		$post_id = !empty($data['id']) ? $data['id'] : false;
		if (!$post_id) $this->_out(new Upfront_JsonResponse_Error("No post id"));

		if (!current_user_can('edit_post', $post_id)) $this->_out(new Upfront_JsonResponse_Error("You can't do this"));

		$post = (array)Upfront_PostModel::get($post_id);
		if (empty($post)) $this->_out(new Upfront_JsonResponse_Error("Invalid post"));

		$post['post_status'] = $status;
		$post['post_title'] = $data['title'];
		$post['post_content'] = $data['body'];

		$updated = Upfront_PostModel::save($post);
		$updated->permalink = get_permalink($updated->ID);
		$this->_out(new Upfront_JsonResponse_Success($updated));
	}

	function update_post_slug () {
		$data = stripslashes_deep($_POST);
		$post_id = !empty($data['post_id']) ? $data['post_id'] : false;
		if (!$post_id) $this->_out(new Upfront_JsonResponse_Error("No post id"));

		$slug = !empty($data['slug']) ? $data['slug'] : false;
		if (!$slug) $this->_out(new Upfront_JsonResponse_Error("No slug"));

		if (!current_user_can('edit_post', $post_id)) $this->_out(new Upfront_JsonResponse_Error("You can't do this"));

		$post = (array)Upfront_PostModel::get($post_id);
		if (empty($post)) $this->_out(new Upfront_JsonResponse_Error("Invalid post"));
		$post['post_name'] = $slug;

		$updated = Upfront_PostModel::save($post);
		$updated->permalink = get_permalink($updated->ID);
		$this->_out(new Upfront_JsonResponse_Success($updated));
	}

	function update_post_status () {
		$data = stripslashes_deep($_POST);
		$post_id = !empty($data['post_id']) ? $data['post_id'] : false;
		if (!$post_id) $this->_out(new Upfront_JsonResponse_Error("No post id"));

		$status = !empty($data['status']) ? $data['status'] : false;
		if (!$status) $this->_out(new Upfront_JsonResponse_Error("No status"));

		if (!current_user_can('edit_post', $post_id)) $this->_out(new Upfront_JsonResponse_Error("You can't do this"));

		$post = (array)Upfront_PostModel::get($post_id);
		if (empty($post)) $this->_out(new Upfront_JsonResponse_Error("Invalid post"));
		$post['post_status'] = $status;

		$updated = Upfront_PostModel::save($post);
		$updated->permalink = get_permalink($updated->ID);
		$this->_out(new Upfront_JsonResponse_Success($updated));
	}

	function update_post_password () {
		$data = stripslashes_deep($_POST);
		$post_id = !empty($data['post_id']) ? $data['post_id'] : false;
		if (!$post_id) $this->_out(new Upfront_JsonResponse_Error("No post id"));

		$password = !empty($data['password']) ? $data['password'] : '';

		if (!current_user_can('edit_post', $post_id)) $this->_out(new Upfront_JsonResponse_Error("You can't do this"));

		$post = (array)Upfront_PostModel::get($post_id);
		if (empty($post)) $this->_out(new Upfront_JsonResponse_Error("Invalid post"));
		$post['post_password'] = $password;

		$updated = Upfront_PostModel::save($post);
		$updated->permalink = get_permalink($updated->ID);
		$this->_out(new Upfront_JsonResponse_Success($updated));
	}

	function fetch_term($data) {
		if(!$data['taxonomy'])
			$this->_out(new Upfront_JsonResponse_Error("Invalid taxonomy."));
		if(!$data['id'])
			$this->_out(new Upfront_JsonResponse_Error("Invalid id."));

		$term = get_term(intval($data['id']), $data['taxonomy']);

		if(is_wp_error($term))
			$this->_out(new Upfront_JsonResponse_Error($term->get_error_message()));
		if(!$term)
			$this->_out(new Upfront_JsonResponse_Error("Term not found."));
		$this->_out(new Upfront_JsonResponse_Success($term));
	}



	function save_term($data){
		if(!current_user_can('manage_categories'))
			$this->_out(new Upfront_JsonResponse_Error("You can't do this"));
		if(!$data['taxonomy'])
			$this->_out(new Upfront_JsonResponse_Error("Invalid taxonomy."));
		
		$term = get_term(intval($data['term_id']), $data['taxonomy']);

		if(!$term || is_wp_error($term)){
			$term = wp_insert_term($data['name'], $data['taxonomy'], $data);
		}
		else{
			$term = wp_update_term($data['term_id'], $data['taxonomy'], $data);
		}

		if($data['postId'])
			wp_set_object_terms($data['postId'], $term['term_id'], $data['taxonomy']);

		if(is_wp_error($term))
			$this->_out(new Upfront_JsonResponse_Error($term->get_error_message()));
		if(!$term)
			$this->_out(new Upfront_JsonResponse_Error("Term not found."));
		$this->_out(new Upfront_JsonResponse_Success($term));
	}

	function fetch_term_list($data){
		if(!$data['taxonomy'])
			$this->_out(new Upfront_JsonResponse_Error("Invalid taxonomy."));
		$response = array();
		if($data['postId']){
			$response['results'] = get_the_terms($data['postId'], $data['taxonomy']);
			if($data['allTerms']){
				$response['allTerms'] = array_values(get_terms($data['taxonomy'], array('hide_empty' => false)));
			}
		}	
		else{
			$response['results'] = array_values(get_terms($data['taxonomy'], array('hide_empty' => true)));
		}

		if(! $response['results'])
			$response['results'] = array();

		$response['taxonomy'] = get_taxonomy($data['taxonomy']);

		$this->_out(new Upfront_JsonResponse_Success($response));
	}

	function save_term_list($data){
		if(!$data['taxonomy'])
			$this->_out(new Upfront_JsonResponse_Error("Invalid taxonomy."));

		if(!$data['postId'])
			$this->_out(new Upfront_JsonResponse_Error("No post id."));

		foreach($data['all'] as $term){
			$terms[] = $term['slug'] ? $term['slug'] : $term['name'];
		}

		$terms = wp_set_object_terms($data['postId'], $terms, $data['taxonomy']);
		if(is_wp_error($terms))
			$this->_out(new Upfront_JsonResponse_Error($terms->get_error_message()));

		$this->_out(new Upfront_JsonResponse_Success(get_the_terms($data['postId'], $data['taxonomy'])));
	}
	
	/**
	 * Updates the template file for a page.
	 * @param  Object $data The data sent to update the template, at least a postId and a template name are needed.
	 * @return null       Json response {postId, template}
	 */
	function update_page_template($data){
		if(!current_user_can('edit_pages'))
			$this->_out(new Upfront_JsonResponse_Error("You can't do this."));

		if(!$data['postId'])
			$this->_out(new Upfront_JsonResponse_Error("No page id."));
		if(!$data['template'])
			$this->_out(new Upfront_JsonResponse_Error("No template given."));

		$key = '_wp_page_template';
		$post_id = $data['postId'];
		$template = $data['template'];
		$success_response = new Upfront_JsonResponse_Success(array(
			'template' => $data['template'],
			'postId' => $data['postId']
		));

		$tpl = get_post_meta($post_id, $key, true);
		if($template){
			if(update_post_meta($post_id, $key, $template))
				$this->_out($success_response);
		}
		else if(add_post_meta($post_id, $key, $template, true))
				$this->_out($success_response);

		$this->_out(new Upfront_JsonResponse_Error("There was an error saving the template." . $post_id . $key . $template));

	}

	function fetch_post($data) {
		$post = get_post($data['id']);

		if($post){
			if($data['filterContent']){
				$post->post_content = apply_filters('the_content', $post->post_content);
				$post->post_title = apply_filters('the_title', $post->post_title);
				$post->post_excerpt = apply_filters('the_excerpt', $post->post_excerpt);
			}
			if($data['withAuthor']){
				$post->author = $this->remove_private_user_fields(new WP_User($post->post_author));
			}
			if($data['withMeta']){
				$post->meta = $this->parse_single_meta(get_metadata('post', $post->ID));
			}
			$this->_out(new Upfront_JsonResponse_Success($post));
		}
		else if( $data['id'] === '0') { //New post
			$post_type = $data['post_type'] ? $data['post_type'] : 'post';
			$post = Upfront_PostModel::create($post_type, 'Please enter your new ' . $post_type . ' title here', 'Your ' . $post_type . ' content goes here. Have fun writing :)');
			
			if($post_type == 'page'){
				$post->post_content = 'Type your page content here. Feel free to add some elements from the left sidebar.';
			}
			$this->_out(new Upfront_JsonResponse_Success($post));
		}
		
		$this->_out(new Upfront_JsonResponse_Error("Post not found."));
	}

	function remove_private_user_fields($user) {
		$user->gravatar = md5($user->data->user_email);
		unset($user->data->user_pass);
		unset($user->data->user_registered);
		unset($user->data->user_activation_key);
		unset($user->data->user_email);
		return $user;
	}

	function fetch_post_list($data){
		if(!$data['postType'])
			$this->_out(new Upfront_JsonResponse_Error("Invalid post type."));

		$query = $this->_spawn_query($data['postType'], $data);
		$posts = $query->posts;
		$limit = isset($data['limit']) ? (int)$data['limit'] : 10;
		$page = isset($data['page']) ? (int)$data['page'] : 0;

		if($posts) {
			for ($i=0; $i < sizeof($posts); $i++) { 
				if($data['filterContent']){
					$posts[$i]->post_content = apply_filters('the_content', $posts[$i]->post_content);
					$posts[$i]->post_title = apply_filters('the_title', $posts[$i]->post_title);
					$posts[$i]->post_excerpt = apply_filters('the_excerpt', $posts[$i]->post_excerpt);
				}

				if($data['withAuthor']){
					$posts[$i]->author = $this->remove_private_user_fields(new WP_User($posts[$i]->post_author));
				}

				if($data['withMeta']){
					$posts[$i]->meta = $this->parse_single_meta(get_metadata('post', $posts[$i]->ID));
				}
			}
		}

		$this->_out(new Upfront_JsonResponse_Success(array(
			"results" => $posts,
			"pagination" => array(
				"total" => $query->found_posts,
				"page_size" => $limit,
				"page" => $page,
			)
		)));

	}

	function parse_single_meta($metadata){
		$parsed = array();
		foreach($metadata as $key => $val){
			if(is_array($val) && sizeof($val) == 1)
				$parsed[] = array('meta_key' => $key, 'meta_value' => $val[0]);
			else
				$parsed[] = array('meta_key' => $key, 'meta_value' => $val);
		}
		return $parsed;
	}

	function save_post($data) {
		if(!current_user_can('edit_posts'))
			$this->_out(new Upfront_JsonResponse_Error("You can't do this."));

		if($data['post_type'] == 'page' && !current_user_can('edit_pages'))
			$this->_out(new Upfront_JsonResponse_Error("You can't do this."));

		if($data['post_status'] == 'publish'){
			if($data['post_type'] == 'post' && !current_user_can('publish_posts') || $data['post_type'] == 'page' && !current_user_can('publish_pages'))
			$this->_out(new Upfront_JsonResponse_Error("You can't do this."));
		}

		unset($data['post_modified']);
		unset($data['post_modified_gmt']);

		if(!$data['ID']){
			unset($data['ID']);
			$id = wp_insert_post($data);
		}
		else {
			$post = get_post($data['ID']);
			if($post->post_status == 'trash' && $data['post_status'] != 'trash')
				$post = wp_untrash_post($post['ID']);
			else if($post->post_status != 'trash' && $data['post_status'] == 'trash')
				$post = wp_trash_post($post['ID']);
			
			// Update if not deleted
			if($post)
				$id = wp_update_post($data);
			else
				$id = 0;
		}

		if(is_wp_error($id))
			$this->_out(new Upfront_JsonResponse_Error($id->get_error_message()));

		$post = get_post($id);

		$this->_out(new Upfront_JsonResponse_Success(array(
			'id' => $id,
			'post_name' => $post->post_name,
		)));
	}

	function fetch_user($data) {
		if(!$data['ID'])
			$data['ID'] = get_current_user_id();

		$user = $this->remove_private_user_fields(new WP_User(wp_get_current_user()));

		$this->_out(new Upfront_JsonResponse_Success($user));
	}

	function fetch_comment ($data) {
		if(!$data['id'])
			$this->_out(new Upfront_JsonResponse_Error("No comment id given."));

		$comment = get_comment( $data['id'] );

		if(!$comment)
			$this->_out(new Upfront_JsonResponse_Error("Comment not found."));

		$comment->gravatar = md5($comment->comment_author_email);

		$this->_out(new Upfront_JsonResponse_Success($comment));
	}

	function save_comment ($data) {
		if (!current_user_can('moderate_comments')) $this->_out(new Upfront_JsonResponse_Error("You can't do this"));

		if($data['comment_ID']){
			if(wp_update_comment($data))
				$this->_out(new Upfront_JsonResponse_Success(array('comment_ID' => $data['comment_ID'])));
			$this->_out(new Upfront_JsonResponse_Error("Error saving the comment."));
		}
		else {
			$comment_id = wp_new_comment($data);
				$this->_out(new Upfront_JsonResponse_Success(array('comment_ID' => $comment_id)));
		}

	}

	function fetch_comment_list ($data) {
		$post_id = !empty($data['postId']) ? $data['postId'] : false;
		$orderby = !empty($data['orderby']) ? $data['orderby'] : 'comment_date';
		$order = !empty($data['order']) ? $data['order'] : 'ASC';
		$limit = isset($data['limit']) ? (int)$data['limit'] : 10;
		$page = isset($data['page']) ? (int)$data['page'] : 0;
		$search = !empty($data['search']) ? $data['search'] : false;
		
		if(!isset($data['commentType']) || $data['commentType'] == 'all')
			$comment_type = false;
		else if ($data['commentType'] == 'comment')
			$comment_type = '';
		else
			$comment_type = $data['commentType'];
		$comment_approved = !empty($data['comment_approved']) ? $data['comment_approved'] : false;

		global $wpdb;
		$where_query = array();

		if($post_id)
			$where_query[] = $wpdb->prepare('comment_post_ID=%d', $post_id);
		if($comment_type !== false)
			$where_query[] = $wpdb->prepare('comment_type=%s', $comment_type);
		if($comment_approved)
			$where_query[] = $wpdb->prepare('comment_approved=%s', $comment_approved);
		if($search)
			$where_query[] = "comment_content LIKE '%" . esc_sql(like_escape($search)) . "%'";

		$where = sizeof($where_query) ? 'WHERE ' . implode(' AND ', $where_query) : '';

		$sql = "SELECT * FROM {$wpdb->comments} "  . $where . $wpdb->prepare(" ORDER BY {$orderby} {$order} LIMIT %d, %d", ($page*$limit), $limit);

		$comments = $wpdb->get_results(
			$sql
		);

		foreach ($comments as $idx => $comment) {
			$comment->gravatar = md5($comment->comment_author_email);
		}

		$comments_count = $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->comments} " . $where
		);

		$this->_out(new Upfront_JsonResponse_Success(array(
			"results" => $comments,
			"pagination" => array(
				"total" => $comments_count,
				"page_size" => $limit,
				"page" => $page,
			),
			"sql" => $sql,
			"comment_type" => $comment_type
		)));
	}

	function fetch_meta_list($data) {
		$meta_type = $data['metaType'];
		if(!$meta_type && array_search($meta_type, array('comment', 'post', 'user')) == FALSE)
			$this->_out(new Upfront_JsonResponse_Error("Invalid meta type"));

		$object_id = $data['objectId'];
		if(!$object_id)
			$this->_out(new Upfront_JsonResponse_Error("No object id given"));

		$meta = $this->parse_single_meta(get_metadata($meta_type, $object_id));

		// Extract values
		foreach($meta as $key => $val){
			if(is_array($val) && sizeof($val) == 1)
				$meta[$key] = $val[0];
		}
		$this->_out(new Upfront_JsonResponse_Success($meta));
	}

	function save_meta_list($data){
		$meta_type = $data['metaType'];
		if(!$meta_type && array_search($meta_type, array('comment', 'post', 'user')) == FALSE)
			$this->_out(new Upfront_JsonResponse_Error("Invalid meta type"));

		$object_id = $data['objectId'];
		if(!$object_id)
			$this->_out(new Upfront_JsonResponse_Error("No object id given"));

		if(
			($meta_type == 'post' && !current_user_can('edit_posts')) ||
			($meta_type == 'comment' && !current_user_can('moderate_comments')) ||
			($meta_type == 'user' && !current_user_can('edit_users'))
			){
			$this->_out(new Upfront_JsonResponse_Error("You can't do this"));
		}

		$updated = array();

		if($data['removed']){
			foreach($data['removed'] as $meta)
				delete_metadata($meta_type, $object_id, $meta['meta_key']);
		}	

		if($data['added']){
			foreach($data['added'] as $meta)
				update_metadata($meta_type, $object_id, $meta['meta_key'], $meta['meta_value']);
		}	

		if($data['changed']){
			foreach($data['changed'] as $meta)
				update_metadata($meta_type, $object_id, $meta['meta_key'], $meta['meta_value']);
					
		}

		$meta = $this->parse_single_meta(get_metadata($meta_type, $object_id));

		$this->_out(new Upfront_JsonResponse_Success($meta));
	}

	function get_post_extra($data) {
		if(!$data['postId'])
			$this->_out(new Upfront_JsonResponse_Error("No post id."));

		$post_id = $data['postId'];

		$extra = array('postId' => $post_id);
		if($data['allTemplates'])
			$extra['allTemplates'] = get_page_templates();
		if($data['template'])
			$extra['template'] = get_page_template_slug($post_id);
		if($data['thumbnail']){
			$size = $data['thumbnail'] ? $data['thumbnail'] : 'post-thumbnail';
				$extra['thumbnail'] = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), $size );
		}

		$this->_out(new Upfront_JsonResponse_Success($extra));
	}

	private function _spawn_query ($post_type, $data=array()) {
		$sort = !empty($data['orderby']) ? str_replace('post_', '', $data['orderby']) : 'date';
		$direction = !empty($data['order']) ? $data['order'] : 'desc';
		$limit = isset($data['limit']) ? (int)$data['limit'] : 10;
		$page = isset($data['page']) ? (int)$data['page'] + 1 : 1;
		$search = !empty($data['search']) ? $data['search'] : false;

		$args = array(
			'orderby' => $sort,
			'order' => strtoupper($direction),
			'post_type' => $post_type,
			'posts_per_page' => $limit,
			'paged' => $page,
		);
		if ($search) $args['s'] = $search;

		return new WP_Query($args);
	}

	private function _get_post_hierarchy ($post) {
		if ($post->post_parent) return $this->_get_post_info($post->post_parent);
	}

	private function _get_post_featured_image ($post) {
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ) );
		if (!empty($image[0])) return $image[0];
		return 'http://imgsrc.hubblesite.org/hu/db/images/hs-2012-49-a-small_web.jpg';
	}

	private function _get_post_info ($post_id) {
		$post = get_post($post_id);
		$post->permalink = get_permalink($post->ID);
		$post->hierarchy = $this->_get_post_hierarchy($post);
		$post->featured_image = $this->_get_post_featured_image($post);
		return $post;
	}
}
Upfront_Editor_Ajax::serve();