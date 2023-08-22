interface BLEService<T> {
	getVal?: () => Promise<T>;
	setValRaw?: (value: ArrayBuffer) => Promise<void>;
	setVal?: (value: T) => Promise<void>;
	onNotification: (func: (value: T) => void) => void;
}

interface BLEServiceOptions<T> {
	serviceId: string;
	characteristicId: string;

	readParser?: (dataView: DataView) => T;
	setParser?: (value: T) => ArrayBuffer;

	isSettable?: boolean;
	isReadable?: boolean;
	isNotifiable?: boolean;
}
/*
// interface BLEServiceOptions<T> extends BLEBaseOptionsServiceOptions<T> {
// 	isSettable: true;
// 	setParser: (value: T) => ArrayBuffer;
// }
// interface BLEServiceOptions<T> extends BLEBaseOptionsServiceOptions<T> {
// 	isReadable: true;
// 	readParser: (dataView: DataView) => T;
// }

// interface BLEServiceOptions<T> extends BLEBaseOptionsServiceOptions<T> {
// 	isNotifiable: true;
// 	readParser: (dataView: DataView) => T;
// 	//onNotification: (func: (value: T) => void) => void;
// }
/*
interface BleServiceBuilder<T> {
	(bleServer: BluetoothRemoteGATTServer, options: BLEServiceOptions<T>): BLEService<T>;
}*/

export const createBLEService = async <T>(
	bleServer: BluetoothRemoteGATTServer,
	options: BLEServiceOptions<T>
): Promise<BLEService<T>> => {
	const { serviceId, characteristicId, readParser, setParser } = options;

	if (!bleServer.connected) throw new Error('BLE Server not connected');
	const service = await bleServer.getPrimaryService(serviceId);
	const characteristic = await service.getCharacteristic(characteristicId);

	if (options.isNotifiable) {
		await characteristic.startNotifications();
		console.log('add notification for: ', options.characteristicId);
		await characteristic.startNotifications();
		characteristic.addEventListener('characteristicvaluechanged', (event) => {
			const target = event.target as BluetoothRemoteGATTCharacteristic;
			// console.log('event', event);

			if (!readParser) throw new Error('readParser not defined');
			if (target.value) {
				notificationHandler(readParser(target.value));
			}
		});
	}
	// todo: add a check to see if the characteristic is writable
	// todo: add a check to see if the characteristic is readable
	// todo: add a check to see if the characteristic is notifiable
	// todo: add a check to validate value type

	async function getVal() {
		if (!readParser) throw new Error('readParser not defined');
		return await readParser(await characteristic.readValue());
	}
	async function setValRaw(value: ArrayBuffer) {
		await characteristic.writeValue(value);
	}
	async function setVal(value: T) {
		if (!setParser) throw new Error('setParser not defined');
		await characteristic.writeValue(setParser(value));
	}

	let notificationHandler: (value: T) => void = (value) => {
		console.warn('onNotification not implemented:', { serviceId, characteristicId, value });
	};

	const onNotification = (func: (value: T) => void): void => {
		if (!options.isNotifiable) throw new Error('Characteristic is not notifiable');
		notificationHandler = func;
	};

	// todo add listeners for notifications
	/*
      //This is responding to notifications sent by the peripheral of changes to the value.
    await batteryLevelCharacteristic.startNotifications();

    */

	return {
		getVal,
		setVal,
		setValRaw,
		onNotification
	};
};
