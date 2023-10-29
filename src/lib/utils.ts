let wakeLock: WakeLockSentinel | null = null;

export const preventScreenLock = async () => {
	if (window)
		window?.navigator.wakeLock
			.request('screen')
			.then((wl) => {
				wakeLock = wl;
				return wakeLock;
			})
			.catch((e) => {
				console.log('wakeLock error', e);
				return null;
			});
};
