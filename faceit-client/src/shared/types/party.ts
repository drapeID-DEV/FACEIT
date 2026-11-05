export interface IPartyUser {
	id: string;
	nickname: string;
	profilePic: string | null;
	elo: number;
}

export interface IParty {
	id: string;
	leaderId: string;
	maxSize: number;
	members: IPartyUser[];
	pendingInvites: IPartyUser[];
}

export interface IPartyInvite {
	partyId: string;
	expiresAt: string;
	inviter: IPartyUser;
}

export interface IPartyStateRes {
	party: IParty | null;
	invites: IPartyInvite[];
}
