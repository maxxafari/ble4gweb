interface BLEService<T> {
	serviceId: string;
	addServiceTo: (bleServer: BluetoothRemoteGATTServer) => Promise<boolean>;
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
	const connect = async () => {
		bleDevice = await navigator.bluetooth.requestDevice({
			filters: [{ namePrefix: 'nrf52' }],
			optionalServices: bleServices.map((service) => service.serviceId)
		});

		if (!bleDevice.gatt) throw new Error('No GATT server');
		const bleServer = await bleDevice.gatt?.connect();
		if (!bleServer) throw new Error('No connect to GATT server');
		await bleServices.forEach(async (service) => await service.addServiceTo(bleServer));
		return true;
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
	let bleServer: BluetoothRemoteGATTServer | undefined = undefined;

	const addServiceTo = async (new_bleServer: BluetoothRemoteGATTServer) => {
		bleServer = new_bleServer;
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
		return true;
	};

	// todo: add a check to see if the characteristic is writable
	// todo: add a check to see if the characteristic is readable
	// todo: add a check to see if the characteristic is notifiable
	// todo: add a check to validate value type

	async function getVal() {
		if (!readParser) throw new Error('readParser not defined');
		if (!bleServer?.connected) {
			console.warn('setVal, no connection', { name });
			return readParser(new DataView(new ArrayBuffer(0)));
		}
		return await readParser(await characteristic.readValue());
	}
	async function setValRaw(value: ArrayBuffer) {
		await characteristic.writeValue(value);
	}
	async function setVal(value: T) {
		if (!setParser) throw new Error('setParser not defined');
		if (!bleServer?.connected) {
			return console.error(`${name} setVal, no connection`);
		}
		const parsedValue = setParser(value);
		console.log('setVal', { value, parsedValue });
		await characteristic.writeValue(parsedValue);
	}

	let notificationHandler: (value: T) => void = (value) => {
		console.warn('onNotification not implemented:', { name, value });
	};

	const onNotification = (func: (value: T) => void): void => {
		if (!options.isNotifiable) throw new Error(`${name} Characteristic is not set as notifiable`);
		notificationHandler = func;
	};

	// todo add listeners for notifications
	/*
      //This is responding to notifications sent by the peripheral of changes to the value.
    await batteryLevelCharacteristic.startNotifications();

    */

	return {
		addServiceTo,
		serviceId,
		getVal,
		setVal,
		setValRaw,
		onNotification
	};
};
