<?php
class BetModel extends CI_Model {
	public function __construct() {
		$this->load->database();
	}

	// TEST FUNCTION ---------------------------------------------------------------------------------

	public function getOne($id) {
		$q = $this->db->get_where('tbl_bets', array('bet_id' => $id));
		
		if($q->num_rows() ==1) {
			return $q->row_array();
		}
		else {
			// echo 'didnt authenticate';
			return false;
		}

	}

	public function createBet() {
		$betInfo = json_decode($this->input->post('bet'), true);

		$newBetData = array(
			'bet_name' => $betInfo['bet_name'],
			'bet_status' => 5,
			'start_date' => date("Y-m-d H:i:s", strtotime($betInfo['start_date'])),
			'end_date' => date("Y-m-d H:i:s", strtotime($betInfo['end_date'])),
			'wager_amount' => $betInfo['wager_amount'],
			'bet_image' => '',
			'bet_terms' => $betInfo['bet_terms']
		);

		$insert = $this->db->insert('tbl_bets', $newBetData);

		$id = $this->db->insert_id();
		$q = $this->db->get_where('tbl_bets', array('bet_id' => $id));

		$bet_result = $q->row_array();
		$bet_id = $bet_result['bet_id'];

		// need to create bet participants
		$partipants = $betInfo['bet_particpants'];
		$moderators = $betInfo['bet_moderators'];

		// hard coding in the values here, we probably want to go to the db to get the actual id each time

		foreach($partipants as $participant) {

			$newPartipantData = array( 
				'bet_id' => $bet_id,
				'user_id' => $participant['user_id'],
				'role_id' => 2,
				'accepted_bet' => 3
			);

			$insert_participant = $this->db->insert('tbl_bet_participants', $newPartipantData);

		}

		foreach($moderators as $moderator) {

			$newPartipantData = array( 
				'bet_id' => $bet_id,
				'user_id' => $moderator['user_id'],
				'role_id' => 3,
				'accepted_bet' => 3
			);

			$insert_moderator = $this->db->insert('tbl_bet_participants', $newPartipantData);

		}


		$creatorData = array(
			'bet_id' => $bet_id,
			'user_id' => $betInfo['creator_user_id'],
			'role_id' => 1,
			'accepted_bet' => 1
		);

		$insert_creator = $this->db->insert('tbl_bet_participants', $creatorData);

		return $bet_result;

	}

	public function getAllBets($userID) {

		$this->db->select('*');
		$this->db->from('tbl_bets');
		$this->db->join('tbl_bet_participants', 'tbl_bets.bet_id = tbl_bet_participants.bet_id');
		$this->db->where(array('tbl_bet_participants.user_id' => $userID));

		$query = $this->db->get();
		return $query->result_array();
	}

	public function getAllBetsLegacy($userID) {
		$this->db->select('bet_id');
		$this->db->where(array('user_id' => $userID));
		$q = $this->db->get('tbl_bet_participants');
		// return $q->result();

		$IDarray = array();

		foreach($q->result_array() as $row) {
			$IDarray[] = $row['bet_id'];
			// echo $row;
		}

		$this->db->where_in('bet_id', $IDarray);
		$r = $this->db->get('tbl_bets');
		return $r->result_array();
	}

	public function getBetMembers($id) {
		$this->db->from('tbl_bet_participants');
		$this->db->where(array('bet_id' => $id));
		$this->db->join('tbl_users', 'tbl_bet_participants.user_id = tbl_users.user_id');
		$q = $this->db->get();

		return $q->result_array();
	}

	public function respondToBetInvitation($userID, $betID, $responseCode) {
		// $this->db->from('tbl_bet_participants');
		$this->db->set('accepted_bet', $responseCode);
		$this->db->where(array('user_id' => $userID, 'bet_id' => $betID, 'accepted_bet' => 3));
		$q = $this->db->update('tbl_bet_participants');
		return $q;

	}

	public function checkBetStatus($betID) {
		$this->db->where(array('bet_id' => $betID));
		$q = $this->db->get('tbl_bet_participants');
		$q = $q->result_array();

		$foundANo = false;
		$foundAPending = false;
		foreach($q as $row) {
			if($row['accepted_bet'] == 1) {
				// echo 'found a 1';
				continue;
			} else if($row['accepted_bet'] == 2) {
				// echo 'found a 2';
				$foundANo = true;
			} else if($row['accepted_bet'] == 3) {
				// echo 'found a 3';
				$foundAPending = true;
			} else {
				return "PROBLEM";
			}
		}

		if($foundANo) {
			return "DENIED";
		} 
		else if($foundAPending) {
			return "PENDING";
		} 
		else {
			return "ACCEPTED";
		}
	}

	public function checkBetVoteStatus($betID) {

		$this->db->where(array('bet_id' => $betID));
		$users = $this->db->get('tbl_bet_participants');
		$users = $users->result_array();

		$this->db->where(array('bet_id' => $betID));
		$votes = $this->db->get('tbl_votes');
		$votes = $votes->result_array();

		$missingVote = false;

		echo json_encode($users);
		echo json_encode($votes);

		if(count($users) != count($votes)) {
			echo 'missing';
			return "MISSING_VOTES";
		}

		$unanimousVote = -1;
		$foundUnanimousVote = false;
		$moderatorVote = -1;
		foreach($users as $user) {

			foreach($votes as $vote) {

				if($user['user_id'] == $vote['user_id']) {
					echo 'found match';
					if($unanimousVote == -1) {
						$unanimousVote = $vote['vote_selection'];
						$foundUnanimousVote = true;
					} else if($unanimousVote != $vote['vote_selection']) {
						$foundUnanimousVote = false;
					}

					if($user['role_id'] == 3) {
						$moderatorVote = $vote['vote_selection'];
					}
				}
			}
		}

		echo 'unanimous?'.$foundUnanimousVote;

		if($foundUnanimousVote) {
			return $unanimousVote;
		} else {
			if($moderatorVote != -1) {
				return $moderatorVote;
			} else {
				return "NO_MODERATOR_VOTE";
			}
		}
	}

	public function getVotes($betId) {

		$this->db->where(array('bet_id' => $betId));
		$q = $this->db->get('tbl_votes');
		return $q->result_array();		
	}

	public function updateStatus($betID, $statusID) {
		$this->db->set('bet_status', $statusID);
		$this->db->where(array('bet_id' => $betID));
		$q = $this->db->update('tbl_bets');
		$id = $this->db->get_where('tbl_bets', array('bet_id' => $betID));
		return $id->row_array();
		// return $q;
	}

	public function addProof() {

		$proof = json_decode($this->input->post('proof'), true);

		$newProofData = array(
			'bet_id' => $proof['bet_id'],
			'user_id' => $proof['user_id'],
			'proof_name' => $proof['proof_name'],
			'video_path' => $proof['video_path'],
			'text_content' => $proof['text_content'],
			'image_path' => $proof['image_path']
		);

		$insert = $this->db->insert('tbl_proof', $newProofData);

		$id = $this->db->insert_id();
		$q = $this->db->get_where('tbl_proof', array('proof_id' => $id));
		return $q->row_array();
	}

	public function getProof($betID) {

		$this->db->select('*');
		$this->db->from('tbl_proof');
		$this->db->join('tbl_users', 'tbl_proof.user_id = tbl_users.user_id');
		$this->db->where(array('bet_id' => $betID));
		$q = $this->db->get();

		// $this->db->where(array('bet_id' => $betID));
		// $q = $this->db->get('tbl_proof');
		return $q->result_array();
	}

	public function submitVote($betID, $userID, $userRoleID, $winnerID) {
		$data = array(
			'bet_id' => $betID,
			'user_id' => $userID,
			'role_id' => $userRoleID,
			'vote_selection' => $winnerID
		);

		$this->db->where(array('bet_id' => $betID, 'user_id' => $userID));
		$q = $this->db->get('tbl_votes');

		if ($q->num_rows() == 0) {
			$insert = $this->db->insert('tbl_votes', $data);
			return $insert;
		}
		else {
			return false;
		}
	}

	public function addWinner($betID, $winnerID) {

		$this->db->set(array('winner_id' => $winnerID));
		$this->db->where(array('bet_id' => $betID));
		$q = $this->db->update('tbl_bets');


		$this->db->where(array('bet_id' => $betID));
		$insertedRow = $this->db->get('tbl_bets');

		return $insertedRow->row_array();
	}

	public function addImageProof($betId, $userId, $proofName, $filename) {

		$proof = json_decode($this->input->post('proof'), true);

		$newProofData = array(
			'bet_id' => $betId,
			'user_id' => $userId,
			'proof_name' => $proofName,
			'image_path' => $filename
		);

		$insert = $this->db->insert('tbl_proof', $newProofData);

		$id = $this->db->insert_id();
		$q = $this->db->get_where('tbl_proof', array('proof_id' => $id));
		return $q->row_array();

	}
}

?>
