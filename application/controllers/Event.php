<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Event extends CI_Controller {

	public function __construct() {

		header('Access-Control-Allow-Origin: *');
    	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, X-PINGOTHER");
    	// header("Access-Control-Allow-Methods: *");
    	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    	// header("Content-Type: application/json");

		parent:: __construct();
		$this->load->model('EventModel');
	}

	public function index() {
	}

	public function getEventsForUserId($id) {
		if($event = $this->EventModel->getEventsForUserId($id)) {
			echo json_encode($event);
		}

		else {
			echo '';
		}
	}
	public function getEventsForBetId($id) {
		if($event = $this->EventModel->getEventsForBetId($id)) {
			echo json_encode($event);
		}

		else {
			echo '';
		}
	}
	public function getFriendEventsForUserId($id) {
		if($event = $this->EventModel->getFriendEventsForUserId($id)) {
			echo json_encode($event);
		}

		else {
			echo '';
		}
	}

	public function addEvent() {
		if($newEvent = $this->EventModel->addEvent()) {
			echo json_encode($newEvent);
		}
		else {
			echo '';
		}
	}

}
