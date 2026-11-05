// Every socket of a user joins this room, so all of their tabs get the event
export function userRoom(userId: string) {
	return `user:${userId}`
}
