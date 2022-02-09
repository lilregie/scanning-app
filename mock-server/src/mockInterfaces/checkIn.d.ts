export interface CheckInCreation {
    ticket_id?: string;
}

export interface CheckIn {
    id: number;
    attendee_id: number;
    checked_in_at: Date;
    checkin_user_id: number;
 }
 