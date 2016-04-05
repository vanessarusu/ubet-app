<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

	public function __construct() {

		header('Access-Control-Allow-Origin: *');
    	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, X-PINGOTHER");
    	header("Access-Control-Allow-Methods: *");
    	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    	// header("Content-Type: application/json");

		parent:: __construct();
		$this->load->model('LoginModel');
		$this->load->library('session');
	}

	public function index() {
		// $this->load->view('welcome_message');
	}

	public function login() {
		if($data['authUser'] = $this->LoginModel->authenticateUser()) {
			// $this->session->set_userdata('userInfo', $data['authUser']);
			// var_dump($this->session);
			echo json_encode($data['authUser']);
		}
		else {
			echo 'I didnt validate';
		}
		session_write_close();
	}

	public function register() {
		if($newUser = $this->LoginModel->registerUser()) {
			echo json_encode($newUser);
		}
		else {
			echo 'didnt register user';
		}
	}


	



	public function checkUsername($checkUser = null) {
		// echo $checkUser. 'is chechUser in ci';
		if($data['userExists'] = $this->LoginModel->checkUsername($checkUser)) {
			// echo 'there is a user with this username';
			echo $data['userExists'];
		}
		else {
			return false;
		}
	}
	// public function test() {
	// 	$data['test'] = 'hello';
	// 	echo 'hello';
	// 	// return json_encode($data['test']);
	// 	return $data['test'];
	// }
	public function test() {
		$data['vanessa'] = $this->LoginModel->getVanessa();
		print_r(json_encode($data['vanessa']));
	}
}
