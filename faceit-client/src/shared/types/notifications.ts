export type TNotificationType =
	| 'FRIEND_REQUEST'
	| 'FRIEND_ACCEPTED'
	| 'MATCH_FINISHED';

export interface INotificationActor {
	id: string;
	nickname: string;
	profilePic: string | null;
}

export interface INotification {
	id: string;
	type: TNotificationType;
	matchId: string | null;
	eloChange: number | null;
	isRead: boolean;
	createdAt: string;
	actor: INotificationActor | null;
}

export interface INotificationsRes {
	notifications: INotification[];
	unreadCount: number;
}
