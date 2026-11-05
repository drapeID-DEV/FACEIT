'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormButton } from '@/shared/components/ui/FormButton';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { TApiError } from '@/shared/types/api/responses';
import { IMatch } from '@/shared/types/match';
import { notification } from '@/shared/utils/notifications';
import { useFinishMatchMutation } from '@/store/api/matchApi';

import {
	FinishMatchSchema,
	TFinishMatchSchema
} from '../schemes/finish-match.schema';

interface Props {
	match: IMatch;
	team1Name: string;
	team2Name: string;
	onClose: () => void;
}

const STAT_FIELDS = [
	{ name: 'kills', label: 'K' },
	{ name: 'deaths', label: 'D' },
	{ name: 'assists', label: 'A' },
	{ name: 'headshots', label: 'HS' },
	{ name: 'mvpRounds', label: 'MVP' }
] as const;

export function FinishMatchForm({
	match,
	team1Name,
	team2Name,
	onClose
}: Props) {
	const [finishMatch, { isLoading }] = useFinishMatchMutation();

	// The cached match already holds the latest live scores and player stats
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<TFinishMatchSchema>({
		resolver: zodResolver(FinishMatchSchema),
		defaultValues: {
			winnerTeam: match.team1Score >= match.team2Score ? 1 : 2,
			team1Score: match.team1Score,
			team2Score: match.team2Score,
			playerStats: match.participants.map((participant) => ({
				userId: participant.userId,
				kills: participant.kills,
				deaths: participant.deaths,
				assists: participant.assists,
				headshots: participant.headshots,
				mvpRounds: participant.mvpRounds
			}))
		}
	});

	const onSubmit = async (values: TFinishMatchSchema) => {
		try {
			await finishMatch({ matchId: match.id, data: values }).unwrap();
			notification.info('Match finished!');
			onClose();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-5 overflow-y-auto rounded-2xl border border-zinc-800 bg-[#171717] p-8 text-sm shadow-2xl"
			>
				<h2 className="text-2xl font-bold text-white">Finish match</h2>
				<Controller
					control={control}
					name="winnerTeam"
					render={({ field }) => (
						<Select
							label="Winner"
							options={[
								{ label: team1Name, value: '1' },
								{ label: team2Name, value: '2' }
							]}
							value={String(field.value)}
							onChange={(value) => field.onChange(Number(value))}
							error={errors.winnerTeam && 'Select the winner'}
						/>
					)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<Input
						label={`${team1Name} score`}
						type="number"
						min={0}
						{...register('team1Score', { valueAsNumber: true })}
						error={errors.team1Score?.message}
					/>
					<Input
						label={`${team2Name} score`}
						type="number"
						min={0}
						{...register('team2Score', { valueAsNumber: true })}
						error={errors.team2Score?.message}
					/>
				</div>
				{match.participants.map((participant, index) => (
					<div key={participant.id} className="flex flex-col gap-2">
						<p className="font-semibold">
							{participant.user.nickname}
						</p>
						<div className="grid grid-cols-5 gap-2">
							{STAT_FIELDS.map(({ name, label }) => (
								<Input
									key={name}
									label={label}
									type="number"
									min={0}
									{...register(
										`playerStats.${index}.${name}`,
										{ valueAsNumber: true }
									)}
									error={
										errors.playerStats?.[index]?.[name]
											?.message
									}
								/>
							))}
						</div>
					</div>
				))}
				<div className="flex gap-3">
					<FormButton
						title="Finish match"
						type="submit"
						disabled={isLoading}
					/>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md px-5 py-2 text-lg text-neutral-400 duration-200 hover:bg-accent"
					>
						Close
					</button>
				</div>
			</form>
		</div>
	);
}
