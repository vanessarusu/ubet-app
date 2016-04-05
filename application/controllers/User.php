<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller {

	public function __construct() {

		header('Access-Control-Allow-Origin: *');
    	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, X-PINGOTHER");
    	header("Access-Control-Allow-Methods: *");
    	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    	// header("Content-Type: application/json");

		parent:: __construct();
		$this->load->model('UserModel');
		$this->load->library('session');
	}

	public function index() {
		// $this->load->view('welcome_message');
	}

	public function user($id) {
		if($user = $this->UserModel->getUser($id)) {
			echo json_encode($user);
		}

		else {
			echo 'didnt get user';
		}

	}

	public function all() {
		if($allUsers = $this->UserModel->getAllUsers()) {
			echo json_encode($allUsers);
		}
		else {
			echo 'failed to get all users';
		}
	}


	public function do_upload() {
		// if($this->input->is_ajax_request()) {
		// 	echo 'it is ajax';
		// }
		// else {
		// 	echo 'its not ajax';
		// }

		$uploadPath = './testUploads';

		$config['upload_path'] = $uploadPath;
		$config['allowed_types'] = 'gif|jpg|jpeg|png';

		$this->load->library('upload', $config);
		if(!$this->upload->do_upload('file')) {
			$error = array('error' => $this->upload->display_errors());
			print_r($error);
		}
		else {
			$upload_data = array('upload_data' =>$this->upload->data());
			foreach($upload_data as $value) {
				$filename = $value['file_name'];
			}
			// if ($this->session->userInfo) {
			// 	echo 'if is true';
			// }
			// else {
			// 	echo 'in the else';
			// 	// var_dump($this->session->userdata());
			// }
			// $upload_data[0]['file_name'];
			// echo $filename;
			// if(!$this->UserModel->updateImage($filename)) {
			// 	echo 'didnt update the file';
			// }
			// else {
			// 	echo 'updated the file';
			// }
			// echo var_dump($this->session->userdata());
			// echo 'updated the file';
			// var_dump($upload_data['file_name']);
			// $file_name = $upload_data['file_name'];
			// echo $file_name;
			// var_dump($this->session->userdata());
			// echo 'successfully uploaded data';
		}

		// if($this->UserModel->)
		// $data['file'] = $_POST;
		// print_r($_FILES);

	}

	// public function updateFname() {
	// 	var_dump($this->input->post('user'));
	// 	if($updatedUser = $this->UserModel->newFname()) {
	// 		// echo $this->input->post();
	// 		echo json_encode($updatedUser);
	// 	}
	// 	else {
	// 		echo 'didnt update user fname';
	// 	}
	// // }

	// }

	public function update() {


		// echo "hello";


		// $userToUpdate = array($this->input->post('user'));
		// foreach($userToUpdate as $key => $value) {
			// echo 'key is '. $key . 'value is '. $value;
		// }
		// echo $userToUpdate[0].['user_id'];

		if($updatedUser = $this->UserModel->updateUser()) {
			echo json_encode($updatedUser);
		}
		else {
			echo 'didnt update user';
		}
		// var_dump($this->input->post());
	}
}
