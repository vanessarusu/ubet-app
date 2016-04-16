<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bet extends CI_Controller {

	public function __construct() {

		header('Access-Control-Allow-Origin: *');
    	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, X-PINGOTHER");
    	header("Access-Control-Allow-Methods: *");
    	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    	// header("Content-Type: application/json");

		parent:: __construct();
		$this->load->model('BetModel');
		// $this->load->library('session');
	}

	public function index() {
		// $this->load->view('welcome_message');
	}

	public function create() {
		if($newBet = $this->BetModel->createBet()) {
			echo json_encode($newBet);
		}
		else {
			echo 'failed to create bet';
		}
	}

	public function getAll($userID) {
		if($allBets = $this->BetModel->getAllBets($userID)){
			echo json_encode($allBets);
			// var_dump($allBets);
		}
	}

	

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
