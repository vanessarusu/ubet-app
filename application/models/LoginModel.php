<?php
class LoginModel extends CI_Model {
	public function __construct() {
		$this->load->database();
	}

	// TEST FUNCTION ---------------------------------------------------------------------------------
	
	public function test($array) {
		echo 'beginning';
		foreach($array as $v) {
			echo $v.' ';
		}
		echo 'done';
	}

	public function getVanessa() {
		$q =$this->db->get_where('tbl_users', array('fname' => 'Vanessa'));
		return $q->row_array();
	}

	// LOGIN USER ---------------------------------------------------------------------------------


	public function authenticateUser() {

		// $user = $this->input->post('username');
		// $pass = $this->input->post('password');
		$loginInfo = json_decode($this->input->post('user'), true);
		// print_r($loginInfo);
		// print_r($data['loginInfo']['username']);
		$user = $loginInfo['username'];
		$pass = $loginInfo['password'];

		$q = $this->db->get_where('tbl_users', array('username' => $user, 'password' => $pass));
		if($q->num_rows() ==1) {
			return $q->row_array();
		}
		else {
			// echo 'didnt authenticate';
			return false;
		}
	}

	// CREATE A USER ---------------------------------------------------------------------------------

	public function createUser($userInfo) {
		$config = array(
			array(
				'field' => 'fname',
				'label' => 'First Name',
				'rules' => 'required|trim'
				),
			array(
				'field' => 'lname',
				'label' => 'Last Name',
				'rules' => 'required|trim'
				),
			array(
				'field' => 'email',
				'label' => 'Email Address',
				'rules' => 'required|trim|valid_email|is_unique[tbl_users.email]'
				),
			array(
				'field' => 'username',
				'label' => 'Username',
				'rules' => 'required|trim|is_unique[tbl_users.username]'
				),
			array(
				'field' => 'password',
				'label' => 'Password',
				'rules' => 'required|trim|min_length[8]| max_length[25]'
				),
			array(
				'field' => 'passwordConfirm',
				'label' => 'Confirm Password',
				'rules' => 'required|trim|matches[password]'
				),
			);
		$this->form_validation->set_rules($config);

		if($this->form_validation->run() === FALSE) {
			return false;
		}

		else {
			$username = $this->input->post('fname');
			$newUserData = array(
					'fname' =>$this->input->post('fname'),
					'lname' =>$this->input->post('lname'),
					'email' =>$this->input->post('email'),
					'username' =>$username,
					'password' =>$this->input->post('password'),
					'profile_image' =>$this->input->post('profile_img'),
					'currency' =>$this->input->post('currency')
				);
			$insert = $this->db->insert('tbl_users', $newUserData);
			return $insert;
		}
	}

	public function checkUsername($username) {
		$username = $username;
		$q = $this->db->get_where('tbl_users', array('username' => $username));
		return $q->row_array();
	}

}

?>