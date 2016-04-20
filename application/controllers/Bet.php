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
		$this->load->model('CurrencyModel');
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
		else {
			echo 'failed to get one bet';
		}
	}

	public function getOne($id) {
		if($bet = $this->BetModel->getOne($id)) {
			echo json_encode($bet);
		}
	}

	public function getBetMembers($id) {
		if($members = $this->BetModel->getBetMembers($id)) {
			echo json_encode($members);
		}
		else {
			echo 'failed to get the members of the bet';
		}
	}

	public function response($userID, $betID, $responseCode) {
		if($response = $this->BetModel->respondToBetInvitation($userID, $betID, $responseCode)) {
			echo json_encode($response);
		}
	}
	
	public function getVotes($betId) {

		if($response = $this->BetModel->getVotes($betId)) {
			echo json_encode($response);
		} else {
			echo 'failed to get the votes';
		}

	}

	private function countVotes($betID) {

		if($voteStatus = $this->BetModel->checkBetVoteStatus($betID)) {
			echo $voteStatus;
			if($voteStatus != "MISSING_VOTES" && $voteStatus != "NO_MODERATOR_VOTE") {
				$updatedStatus = $this->BetModel->updateStatus($betID, 3);
				$this->handleWinner($betID, $voteStatus);

			} else if($voteStatus == "NO_MODERATOR_VOTE") {
				$updatedStatus = $this->BetModel->updateStatus($betID, 4);
			} else {
				$updatedStatus = $this->BetModel->getOne($betID);
			}
		}
	}

	public function handleWinner($betID, $winnerID) {

		// TODO: add conditionals to ensure the winner can't win twice
		if($logEntries = $this->CurrencyModel->getAllWagerEntries($betID)) {
			$amountToAdd = 0;
			foreach($logEntries as $entry) {
				$amountToAdd=$amountToAdd+$entry['transaction_amount'];
			}
			$amountToAdd = $amountToAdd *(-1);
			echo $amountToAdd;

			$lastEndingBalance = $this->CurrencyModel->getLatestCurrencyLog($winnerID);

			if($updateBalance = $this->CurrencyModel->addDepositLog($winnerID, $betID, $amountToAdd, $lastEndingBalance['ending_balance'], 3)) {

				if($updatedUserBalance = $this->CurrencyModel->updateCurrency($winnerID, $updateBalance['ending_balance'])) {

					if($updatedBet = $this->BetModel->addWinner($betID, $winnerID)) {

						echo json_encode($updatedBet);
						return;
					}

				} else {
					echo 'didnt update user balance';
				}

			} else {
				echo 'didnt update balance';
			}
		}
		echo '';
		return;
	}

	public function refundWagers($betID) {
		if($refund = $this->CurrencyModel->getAllWagerEntries($betID)) {

			if(count($refund) < 1) {
				echo 'nothing to refund';
				return;
			}

			foreach ($refund as $row) {
				$lastEndingBalance = $this->CurrencyModel->getLatestCurrencyLog($row['user_id']);
				$newBalance = $this->CurrencyModel->addDepositLog($row['user_id'], $betID, $row['transaction_amount'] * (-1), $lastEndingBalance['ending_balance'], 4);

				$updatedUser = $this->CurrencyModel->updateCurrency($row['user_id'], $newBalance['ending_balance']);
			}
			$updatedValues = $this->db->get_where('tbl_currency_log', array('bet_id' => $betID));
			$updatedValues = $updatedValues->result_array();
			echo json_encode($updatedValues);
		}
		else {
			echo 'couldnt refund';
		}
	}	

	public function withdrawForBet($betId, $userId, $betAmount) {

		if($previousBalance = $this->CurrencyModel->getLatestCurrencyLog($userId)) {
			if($betAmount > $previousBalance['ending_balance']) {
				echo 'not enough funds to bet';
				echo false;
				return;
			} else {
				echo 'we have the funds';
			}

			if($withdrawResult = $this->CurrencyModel->addWithdrawLog($userId, $betId, $betAmount, $previousBalance['ending_balance'])) {

				if($updatedUserCurrency = $this->CurrencyModel->updateCurrency($userId, $withdrawResult['ending_balance'])) {

					echo 'updated the balance correctly';
					echo json_encode($updatedUserCurrency);
					return;
				} 
				else {
					echo 'failed to update user balance. big problem';
				}

			} 
			else {
				echo 'failed to add withdraw row';
			}
 
		} 
		else {
			echo 'failed to get any rows for user';
		}

		echo false;
		return;
	}

	public function refreshBetStatus($betID) {
		if($status = $this->BetModel->checkBetStatus($betID)) {

			// do we now have to do anything with the bet itself?
			if($status == "DENIED") {
				$updatedStatus = $this->BetModel->updateStatus($betID, 6);
				//refund money
				$refundParticipants = $this->refundWagers($betID);
			} 
			else if($status == "ACCEPTED") {
				$updatedStatus = $this->BetModel->updateStatus($betID, 1);
			}
			else if($status == "PENDING"){
				$updatedStatus = $this->BetModel->updateStatus($betID, 5);
			} else {
				echo 'BAD, SHOUDLNT BE HERE';
			}

			$this->countVotes($betID);

			echo json_encode($updatedStatus);
		}
		else {
			echo 'didnt get the status of the bet';
		}
	}

	public function updateBetStatus($betId, $status) {

		if($updatedBet = $this->BetModel->updateStatus($betId, $status)) {

			if($status == 6) {
				refundWagers($betID);
			} 

			echo json_encode($updatedBet);
		} else {
			echo 'bad response';
		}

	}

	public function addProof() {
		if($newProof = $this->BetModel->addProof()) {
			echo json_encode($newProof);
		}
		else {
			echo 'couldnt add newProof';
		}
	}

	public function getProof($betId) {
		if($betProof = $this->BetModel->getProof($betId)) {
			echo json_encode($betProof);
		}
		else {
			echo 'couldnt get proof';
		}
	}

	public function submitVote($betID, $userID, $userRoleID, $winnerID) {
		// echo 'made it';
		if($vote = $this->BetModel->submitVote($betID, $userID, $userRoleID, $winnerID)) {
			echo json_encode($vote);
		}
		else {
			echo 'couldnt submit vote';
		}
	}

	public function getCurrency($userID) {
		if($currency = $this->CurrencyModel->getCurrency($userID)) {
			echo json_encode($currency);
		}
	}

	public function updateCurrency($userID, $value) {
		if($updatedCurrency = $this->CurrencyModel->updateCurrency($userID, $value)) {
			echo json_encode($updatedCurrency);
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

	public function do_upload_proof($betId, $userId, $proofName) {

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

				if(!$this->BetModel->addImageProof($betId, $userId, $proofName, $filename)) {
					echo 'didnt update the file';
				}
				else {
					echo 'updated the file';
				}

			}
		}
	}

}
