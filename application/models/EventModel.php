<?php
class EventModel extends CI_Model {
	public function __construct() {
		$this->load->database();
	}

	// TEST FUNCTION ---------------------------------------------------------------------------------

	public function getEventsForBetId($betId) {

		$this->db->from('tbl_events');
		$this->db->join('tbl_users', 'tbl_users.user_id = tbl_events.user_id');
		$this->db->where(array('bet_id' => $betId));
		$this->db->order_by('tbl_events.event_datetime', 'DESC');
		$q = $this->db->get();
		return $q->result_array();
	}

	public function getEventsForUserId($userID) {
		
		$this->db->from('tbl_events');
		$this->db->join('tbl_users', 'tbl_users.user_id = tbl_events.user_id');
		$this->db->where(array('tbl_users.user_id' => $userID));
		$this->db->order_by('tbl_events.event_datetime', 'DESC');
		$q = $this->db->get();
		return $q->result_array();
	}

	public function getFriendEventsForUserID($userID) {

		$this->db->select('to_user');
		$this->db->where(array('from_user' => $userID));
		$users = $this->db->get('tbl_friends');
		$users->result_array();

		$this->db->select('from_user');
		$this->db->where(array('to_user' => $userID));
		$users2 = $this->db->get('tbl_friends');
		$users2->result_array();

		$all_friends = array();

		foreach($users->result_array() as $user) {
			$all_friends[] = $user['to_user'];
		}
		foreach($users2->result_array() as $user) {
			$all_friends[] = $user['from_user'];
		}

		$this->db->from('tbl_events');
		$this->db->join('tbl_users', 'tbl_users.user_id = tbl_events.user_id');
		$this->db->where_in('tbl_events.user_id', $all_friends);
		$this->db->order_by('tbl_events.event_datetime', 'DESC');
		$r = $this->db->get();
		return $r->result_array();
	}

	public function addEvent() {

		$event = json_decode($this->input->post('event'), true);
		$newEventData = array(
			'bet_id' => $event['bet_id'],
			'user_id' => $event['user_id'],
			'event_type' => $event['event_type'],
			'event_content' => $event['event_content'],
			'link' => $event['link']
		);

		$insert = $this->db->insert('tbl_events', $newEventData);

		$id = $this->db->insert_id();
		$q = $this->db->get_where('tbl_events', array('event_id' => $id));
		return $q->row_array();
	}

}

?>
