<?php
class UserModel extends CI_Model {
	public function __construct() {
		$this->load->database();
	}

	// TEST FUNCTION ---------------------------------------------------------------------------------

	public function getUser($id) {
		$q = $this->db->get_where('tbl_users', array('user_id' => $id));
		
		if($q->num_rows() ==1) {
			return $q->row_array();
		}
		else {
			// echo 'didnt authenticate';
			return false;
		}

	}

	public function getAllUsers() {
		$q = $this->db->get('tbl_users');

		return $q->result_array();
	}
	
	public function uploadImage($data) {
		echo 'called the file uploading function';
	}

	public function updateImage($filename) {
		// return true;
		// $activeUser = $this->session->userInfo['user_id'];
		$this->session->userdata('userInfo');
		return $activeUser;

	// 	$q = $this->db->get_where('tbl_users', array('username' => $activeUser));
	// 	return  $q->row_array();
	}

	public function newFname() {
		$userToUpdate = $this->input->post('user');
		$userNewFname = $this->input->post('newName');

		$this->db->where('user_id', $userToUpdate);
		$q = $this->db->update('tbl_users', array('username' => $userNewFname));
		// if($q->num_rows() ==1) {
			// return $q->row_array();
		// }
		// else {
			// return false;
		// }
		return $q;
	}

	public function updateUser() {

		$userPostValues = json_decode($this->input->post('user'));
		$userToUpdate = array();

		foreach($userPostValues as $key => $value) {
			$userToUpdate[$key]  = $value;
		}

		$newPostValues = json_decode($this->input->post('updatedInfo'));
		$fieldsToUpdate = array();


		foreach($newPostValues as $x => $y) {
			$fieldsToUpdate[$x] = $y;
		}

		$this->db->where('user_id', $userToUpdate['user_id']);

		$q = $this->db->update('tbl_users', $fieldsToUpdate);
		$u = $this->db->get_where('tbl_users', array('user_id' => $userToUpdate['user_id']));
		return $u->row_array();
	}
}

?>
