import { INews } from './news';
import { IPartyUser } from './party';

export interface ISearchRes {
	players: IPartyUser[];
	playersTotal: number;
	news: INews[];
	newsTotal: number;
}
