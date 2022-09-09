export interface CheckInCreation {
    ticket_uuid: string;
    vaccine_pass: boolean;
}

export interface CheckIn {
    id: number;
    attendee_id: number;
    checked_in_at: Date;
    checkin_user_id: number;
    vaccine_pass: boolean;
}
 
export interface CheckInError {
    error: string
}