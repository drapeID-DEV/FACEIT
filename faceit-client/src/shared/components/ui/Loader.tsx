'use client';

import { useEffect, useState } from 'react';

export function Loader() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		(async () => {
			const { quantum } = await import('ldrs');
			quantum.register();
			setReady(true);
		})();
	}, []);

	if (!ready) return null;

	return <l-quantum size="65" speed="1.75" color="orange" />;
}
