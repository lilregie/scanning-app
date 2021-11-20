import { get } from "svelte/store";
import { eventAttendees } from "./store";
import { newestCheckIns } from "./utill";

import {formatDistance} from "date-fns";


export function newestCheckInsTable(): [string[],string[][]] {
    let checkIns = newestCheckIns(get(eventAttendees));
    let tableHeaders = ["Name","ID","Check In Time"];
	let tableData = checkIns.map(check_in=>[
			`${check_in[1].first_name}  ${check_in[1].last_name}`,
			`#${check_in[1].id}`,
			`${formatDistance (check_in[0].time, new Date(),{addSuffix: true})}`
		]);
    return [tableHeaders,tableData]
}