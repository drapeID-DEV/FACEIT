'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';
import { MatchTooltip } from './MatchTooltip';
import { IEloHistoryItem } from '@/shared/types/api/responses';

type MatchChartPoint = IEloHistoryItem & {
	y: number;
};

interface Props {
	history: IEloHistoryItem[];
}

export function EloChart({ history }: Props) {
	const eloValues = history.map((match) => match.eloAfter);

	const minElo = Math.min(...eloValues);
	const maxElo = Math.max(...eloValues);
	const padding = 25;

	const chartData: MatchChartPoint[] = [...history]
		.reverse()
		.map((match) => ({
			...match,
			y: match.eloAfter
		}));

	const [tooltip, setTooltip] = useState<{
		x: number;
		y: number;
		match: (typeof history)[number];
	} | null>(null);

	const options: Highcharts.Options = {
		chart: {
			type: 'area',
			backgroundColor: 'transparent',
			height: 360,
			spacing: [0, 0, 0, 0],
			margin: [20, 15, 30, 50]
		},
		title: {
			text: undefined
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		xAxis: {
			categories: chartData.map((_, i) => `${i + 1}`),
			lineWidth: 0,
			tickLength: 0,
			gridLineWidth: 0,
			labels: {
				enabled: false
			}
		},
		yAxis: {
			min: minElo - padding,
			max: maxElo + padding,
			title: {
				text: undefined
			},
			gridLineColor: '#262626',
			gridLineDashStyle: 'Dash',
			lineWidth: 0,
			labels: {
				style: {
					color: '#777',
					fontSize: '12px'
				}
			}
		},
		tooltip: {
			enabled: false
		},
		plotOptions: {
			area: {
				lineWidth: 3,
				color: '#E44D01',
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, 'rgba(255,122,0,.35)'],
						[1, 'rgba(255,122,0,0)']
					]
				},
				marker: {
					enabled: true,
					radius: 4,
					fillColor: '#E44D01',
					lineColor: '#E44D01',
					lineWidth: 2
				}
			},
			series: {
				point: {
					events: {
						mouseOver() {
							const point = this.options as MatchChartPoint;
							setTooltip({
								x:
									(this.plotX ?? 0) +
									this.series.chart.plotLeft,
								y:
									(this.plotY ?? 0) +
									this.series.chart.plotTop,
								match: point
							});
						},
						mouseOut() {
							setTooltip(null);
						}
					}
				}
			}
		},
		series: [
			{
				type: 'area',
				data: chartData
			}
		]
	};

	return (
		<div className="relative rounded-xl border border-zinc-800 bg-primary p-6">
			<HighchartsReact highcharts={Highcharts} options={options} />
			{tooltip && (
				<div
					className="pointer-events-none absolute z-50"
					style={{
						left: tooltip.x + 40,
						top: tooltip.y
					}}
				>
					<MatchTooltip match={tooltip.match} />
				</div>
			)}
		</div>
	);
}
