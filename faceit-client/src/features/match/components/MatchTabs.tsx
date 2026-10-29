'use client';

export type MatchTab = 'overview' | 'scoreboard';

const TABS: { value: MatchTab; label: string }[] = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'scoreboard', label: 'Scoreboard' }
];

interface Props {
	activeTab: MatchTab;
	onChange: (tab: MatchTab) => void;
}

export function MatchTabs({ activeTab, onChange }: Props) {
	return (
		<div className="flex shrink-0 justify-center gap-2 border-b border-white/10">
			{TABS.map((tab) => (
				<button
					key={tab.value}
					type="button"
					onClick={() => onChange(tab.value)}
					className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition ${
						activeTab === tab.value
							? 'border-b-2 border-widget text-white'
							: 'border-b-2 border-transparent text-gray-400 hover:text-white'
					}`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}
