import { INotification } from '@/shared/types/notifications'
import Image from 'next/image'

interface Props {
	notif: INotification
}

export function NotificationItem({ notif }: Props) {
	return (
		<div className="flex gap-2 w-full items-center">
			<div className="w-max">
				<div className="w-10 h-10 bg-amber-950 rounded-4xl"></div>
			</div>
			<div className="flex flex-col gap-1 w-max">
				<h2 className="text-xs text-neutral-400">{notif.title}</h2>
				<p className="text-xs">{notif.content}</p>
			</div>
		</div>
	)
}
