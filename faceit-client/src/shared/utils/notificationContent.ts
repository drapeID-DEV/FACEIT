import { INotification } from '../types/notifications';

interface INotificationContent {
	title: string;
	text: string;
	link: string;
}

export function getNotificationContent(
	notification: INotification
): INotificationContent {
	const { type, actor, matchId, eloChange } = notification;
	const nickname = actor?.nickname ?? 'A player';
	const profileLink = actor ? `/players/${actor.nickname}` : '/';

	switch (type) {
		case 'FRIEND_REQUEST':
			return {
				title: 'FRIEND REQUEST',
				text: `${nickname} sent you a friend request`,
				link: profileLink
			};

		case 'FRIEND_ACCEPTED':
			return {
				title: 'NEW FRIEND',
				text: `${nickname} accepted your friend request`,
				link: profileLink
			};

		case 'MATCH_FINISHED': {
			const change = eloChange ?? 0;

			return {
				title: 'MATCH FINISHED',
				text: `${change > 0 ? 'Victory' : 'Defeat'}, ${change > 0 ? '+' : ''}${change} ELO`,
				link: matchId ? `/match/${matchId}` : '/'
			};
		}
	}
}
