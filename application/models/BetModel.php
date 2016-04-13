<?php
class BetModel extends CI_Model {
	public function __construct() {
		$this->load->database();
	}

	// TEST FUNCTION ---------------------------------------------------------------------------------

	public function getBet($id) {
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
			'bet_status' => 1,
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
				'role_id' => 2
			);

			$insert_participant = $this->db->insert('tbl_bet_participants', $newPartipantData);

		}

		foreach($moderators as $moderator) {

			$newPartipantData = array( 
				'bet_id' => $bet_id,
				'user_id' => $moderator['user_id'],
				'role_id' => 3
			);

			$insert_moderator = $this->db->insert('tbl_bet_participants', $newPartipantData);

		}


		$creatorData = array(
			'bet_id' => $bet_id,
			'user_id' => $betInfo['creator_user_id'],
			'role_id' => 1
		);

		$insert_creator = $this->db->insert('tbl_bet_participants', $creatorData);

		return $bet_result;

	}

}

?>