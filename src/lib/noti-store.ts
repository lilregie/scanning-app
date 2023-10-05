// notification-store.ts
import { store } from '@svelte-put/noti';

import Notification from '$lib/components/Notification.svelte'
import type { Errors } from './errors';

export const notiStore = store()
  .variant('alert', Notification)
  .build();

export type NotificationProps = {
	content?: string;
	closeable?: boolean;
	errors?: Errors;
	timeout?: number;
}

export const alert = ({ timeout = 4000, ...props }: NotificationProps) => {
	notiStore.push('alert', { props, timeout })
}
