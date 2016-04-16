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

	public function getAllFriends($id) {
		$this->db->where(array('from_user' => $id, 'status' => 3));
		$this->db->or_where(array('to_user' => $id));
		$this->db->where("(from_user=".$this->db->escape($id)." OR to_user=".$this->db->escape($id).") AND status=3");

		$q = $this->db->get('tbl_friends');
		// print_r($q);

		$q = $q->result_array();
		// if($q == null)

		$friendsIDList = array();
		$count = 0;

		if(is_array($q) && count($q)<=0)
		{
			return $q;
		} 

		foreach($q as $key => $value) {
			if($value['to_user'] == $id) {
				$friendsIDList[$count++]=($value['from_user']);
			}
			else if($value['from_user'] == $id) {
				$friendsIDList[$count++]=($value['to_user']);
			}
			else {
			}
		}

		$this->db->where_in('user_id', $friendsIDList);
		$r = $this->db->get('tbl_users');
		return $r->result_array();
	}

	public function removeFriend($userID, $friendID) {
		$this->db->where(array('from_user' => $userID, 'to_user' => $friendID));
		$this->db->or_where(array('from_user' => $friendID));
		$q = $this->db->delete('tbl_friends');
		return $q;
	}

	public function addFriend($userID, $friendID) {
		$q = $this->db->insert('tbl_friends', array('from_user' => $userID, 'to_user' => $friendID, 'status' =>3));
			return $q;
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
