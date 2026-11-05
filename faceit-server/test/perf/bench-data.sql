-- Test data for performance measurements. Run only against the throwaway faceit_bench database,
-- after `prisma db push` and src/scripts/seed-demo-users.ts.

INSERT INTO users (id, email, nickname, elo, method, isverified, updated_at)
SELECT gen_random_uuid()::text, 'bench_' || n || '@bench.local', 'bench_' || n,
	500 + floor(random() * 2000)::int, 'CREDENTIALS', true, now()
FROM generate_series(1, 5000) AS n;

INSERT INTO news (id, title, description, author_id, updated_at)
SELECT gen_random_uuid()::text, 'Bench news ' || n, 'Generated description number ' || n,
	(SELECT id FROM users WHERE nickname = 'demo_1'), now()
FROM generate_series(1, 500) AS n;

CREATE TEMP TABLE bench_matches AS
SELECT gen_random_uuid()::text AS id, n FROM generate_series(1, 2000) AS n;

INSERT INTO matches (id, "matchType", "maxPlayersPerTeam", status, "availableMaps", "selectedMap",
	"winnerTeam", "team1Score", "team2Score", "updatedAt", "finishedAt")
SELECT id, 'ONE_VS_ONE', 1, 'FINISHED', '{}', 'de_dust2', 1, 13, 7, now(), now()
FROM bench_matches;

-- demo_1 plays every twentieth match so the AI recommendations have statistics to work with
INSERT INTO match_participants (id, "matchId", "userId", team, "isWinner", "eloBefore", "eloAfter",
	kills, deaths, assists, headshots)
SELECT gen_random_uuid()::text, m.id,
	CASE WHEN m.n % 20 = 0
		THEN (SELECT id FROM users WHERE nickname = 'demo_1')
		ELSE (SELECT id FROM users WHERE nickname = 'bench_' || (m.n % 5000 + 1))
	END,
	1, true, 1000, 1025, 20, 12, 4, 9
FROM bench_matches m;

INSERT INTO match_participants (id, "matchId", "userId", team, "isWinner", "eloBefore", "eloAfter",
	kills, deaths, assists, headshots)
SELECT gen_random_uuid()::text, m.id, (SELECT id FROM users WHERE nickname = 'bench_' || ((m.n + 1) % 5000 + 1)),
	2, false, 1000, 975, 12, 20, 2, 3
FROM bench_matches m;

UPDATE player_stats SET "totalMatches" = 100, "totalWins" = 100, "totalKills" = 2000, "totalDeaths" = 1200,
	"totalAssists" = 400, "totalHeadshots" = 900
WHERE "userId" = (SELECT id FROM users WHERE nickname = 'demo_1');

-- A LIVE match for the log stream timing; the SteamIDs match [U:1:1001] and [U:1:1002] in the log lines
UPDATE users SET "steamId" = '76561197960266729' WHERE nickname = 'demo_1';
UPDATE users SET "steamId" = '76561197960266730' WHERE nickname = 'demo_2';

INSERT INTO matches (id, "matchType", "maxPlayersPerTeam", status, "availableMaps", "selectedMap", "updatedAt")
VALUES ('bench-live', 'ONE_VS_ONE', 1, 'LIVE', '{}', 'de_dust2', now());

INSERT INTO match_participants (id, "matchId", "userId", team, "isWinner", "eloBefore", "eloAfter")
SELECT gen_random_uuid()::text, 'bench-live', id, CASE nickname WHEN 'demo_1' THEN 1 ELSE 2 END, false, elo, elo
FROM users WHERE nickname IN ('demo_1', 'demo_2');

ANALYZE;
