import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchReadyPayload {
	acceptanceId: string;
	expiresAt: string;
	acceptedPlayers: number;
	totalPlayers: number;
}

interface AcceptedUpdatedPayload {
	acceptedPlayers: number;
	totalPlayers: number;
}

interface AcceptanceState {
	isMatchReady: boolean;
	isAccepted: boolean;
	acceptanceId: string | null;
	expiresAt: string | null;
	acceptedPlayers: number;
	totalPlayers: number;
}

const initialState: AcceptanceState = {
	isMatchReady: false,
	isAccepted: false,
	acceptanceId: null,
	expiresAt: null,
	acceptedPlayers: 0,
	totalPlayers: 0
};

export const acceptanceSlice = createSlice({
	name: 'matchmaking',
	initialState,
	reducers: {
		matchReady(state, action: PayloadAction<MatchReadyPayload>) {
			state.isMatchReady = true;
			state.isAccepted = false;

			state.acceptanceId = action.payload.acceptanceId;
			state.expiresAt = action.payload.expiresAt;

			state.acceptedPlayers = action.payload.acceptedPlayers;
			state.totalPlayers = action.payload.totalPlayers;
		},

		acceptedUpdated(state, action: PayloadAction<AcceptedUpdatedPayload>) {
			state.acceptedPlayers = action.payload.acceptedPlayers;
			state.totalPlayers = action.payload.totalPlayers;
		},

		markAccepted(state) {
			state.isAccepted = true;
		},

		resetMatchmaking(state) {
			Object.assign(state, initialState);
		}
	}
});

export const { matchReady, acceptedUpdated, markAccepted, resetMatchmaking } =
	acceptanceSlice.actions;

export default acceptanceSlice.reducer;
