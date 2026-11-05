import { AccountPopup } from '@/features/popups/components/AccountPopup';
import { FriendsPopup } from '@/features/popups/components/FriendsPopup';
import { MatchesPopup } from '@/features/popups/components/MatchesPopup';
import { NewsPopup } from '@/features/popups/components/NewsPopup';
import { NotificationsPopup } from '@/features/popups/components/NotificationsPopup';
import { IMenuItem } from '@/shared/types/menu';

export const POPUPS = {
	account: AccountPopup,
	matches: MatchesPopup,
	notifications: NotificationsPopup,
	friends: FriendsPopup,
	news: NewsPopup
} as const;

export type PopupType =
	| 'account'
	| 'matches'
	| 'notifications'
	| 'friends'
	| 'news';

export const ACCOUNT_MENU: IMenuItem[] = [
	{
		title: 'Account Settings',
		link: '/settings/account',
		icon: 'settings'
	},
	{
		title: 'Rewards',
		link: '/rewards',
		icon: 'rewards'
	},
	{
		title: 'Subscription',
		link: '/subscriptions',
		icon: 'subscriptions'
	}
];

export const SUPPORT_MENU: IMenuItem[] = [
	{
		title: 'Support',
		link: '/support',
		icon: 'support'
	}
];
