interface BLEService<T> {
	serviceId: string;
	connect: (bleServer: BluetoothRemoteGATTServer) => Promise<void>;
	getVal: () => Promise<T>;
	setValRaw?: (value: ArrayBuffer) => Promise<void>;
	setVal: (value: T) => Promise<void>;
	onNotification: (func: (value: T) => void) => void;
}

interface BLEServiceOptions<T> {
	name: string;
	serviceId: string;
	characteristicId: string;

	readParser?: (dataView: DataView) => T;
	setParser?: (value: T) => ArrayBuffer;

	isSettable?: boolean;
	isReadable?: boolean;
	isNotifiable?: boolean;
}

export const createBleDevice = (bleServices: BLEService<any>[]) => {
	let bleDevice: BluetoothDevice | undefined = undefined;
	//let bleServer: BluetoothRemoteGATTServer | undefined = undefined;

	const connect = async () => {
		bleDevice = await navigator.bluetooth.requestDevice({
			filters: [{ namePrefix: 'nrf52' }],
			optionalServices: bleServices.map((service) => service.serviceId)
		});
		if (!bleDevice.gatt) throw new Error('No GATT server');
		const bleServer = await bleDevice.gatt?.connect();
		if (!bleServer) throw new Error('No connect to GATT server');
		bleServices.forEach(async (service) => await service.connect(bleServer));
	};

	const disconnect = async () => {
		await bleDevice?.gatt?.disconnect();
	};

	const ble = {
		connect,
		disconnect,
		bleDevice
	};
	return ble;
};

export const createBLEService = <T>(options: BLEServiceOptions<T>): BLEService<T> => {
	const { name, serviceId, characteristicId, readParser, setParser } = options;
	let characteristic: BluetoothRemoteGATTCharacteristic;

	const connect = async (bleServer: BluetoothRemoteGATTServer) => {
		if (!bleServer.connected) throw new Error('BLE Server not connected');
		console.info('getPrimaryService', serviceId);
		const service = await bleServer.getPrimaryService(serviceId);
		console.log('got primary service', serviceId);
		characteristic = await service.getCharacteristic(characteristicId);
		console.log('connected to: ', { name });
		if (options.isNotifiable) {
			console.log('add notification for: ', options.characteristicId);
			await characteristic.startNotifications();
			characteristic.addEventListener('characteristicvaluechanged', (event) => {
				const target = event.target as BluetoothRemoteGATTCharacteristic;
				console.log('event', { name, event });

				if (!readParser) throw new Error('readParser not defined');
				if (target.value) {
					notificationHandler(readParser(target.value));
				}
			});
		}
	};

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
		const parsedValue = setParser(value);
		console.log('setVal', { value, parsedValue });
		await characteristic.writeValue(parsedValue);
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
		connect,
		serviceId,
		getVal,
		setVal,
		setValRaw,
		onNotification
	};
};
