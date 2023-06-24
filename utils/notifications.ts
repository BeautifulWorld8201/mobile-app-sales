import * as Notifications from 'expo-notifications';

export const scheduleSaleReminderNotification = async (overrideExisting: boolean = false) => {
	// check if user has already scheduled notification with identifier 'sale-reminder'
	const notificationContent = {
		content: {
			title: `What's up ?`,
			body: `We haven't seen you in a while`,
		},
		trigger: new Date(Date.now() + 7 * 24 * 3600 * 1e3),
		identifier: 'sale-reminder',
	};

	const notifications = await Notifications.getAllScheduledNotificationsAsync();

	const saleReminderNotification = notifications.find(
		(notification) => notification.identifier === 'sale-reminder'
	);
	if (!saleReminderNotification) {
		// if not, schedule notification
		await Notifications.scheduleNotificationAsync(notificationContent);
	} else if (overrideExisting) {
		// if so, cancel existing notification and schedule new one
		await Notifications.cancelScheduledNotificationAsync('sale-reminder');
		await Notifications.scheduleNotificationAsync(notificationContent);
	}
};

// cancel notification
export const cancelNotification = async (identifier: any) => {
	await Notifications.cancelScheduledNotificationAsync(identifier);
};

// cancel all notifications
export const cancelAllNotifications = async () => {
	await Notifications.cancelAllScheduledNotificationsAsync();
};

export const rescheduleNotification = async (
	identifier: any,
	title: string,
	body: string,
	data: any,
	time: any
) => {
	await Notifications.cancelScheduledNotificationAsync(identifier);
	const newIdentifier = await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			data,
		},
		trigger: time,
	});
	return newIdentifier;
};
