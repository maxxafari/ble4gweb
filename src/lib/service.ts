interface BLEService<T> {
	getVal: () => Promise<T>;
	setValRaw: (value: ArrayBuffer) => Promise<void>;
	setVal: (value: T) => Promise<void>;
}

interface BLEServiceOptions<T> {
	serviceId: string;
	characteristicId: string;

	readParser: (dataView: DataView) => T;
	setParser: (value: T) => ArrayBuffer;
}
interface BleServiceBuilder<T> {
	(bleServer: BluetoothRemoteGATTServer, options: BLEServiceOptions<T>): BLEService<T>;
}

export const createBLEService = async <T>(
	bleServer: BluetoothRemoteGATTServer,
	options: BLEServiceOptions<T>
): Promise<BLEService<T>> => {
	const { serviceId, characteristicId, readParser, setParser } = options;

	if (!bleServer.connected) throw new Error('BLE Server not connected');
	const service = await bleServer.getPrimaryService(serviceId);
	const characteristic = await service.getCharacteristic(characteristicId);

	// todo: add a check to see if the characteristic is writable
	// todo: add a check to see if the characteristic is readable
	// todo: add a check to see if the characteristic is notifiable
	// todo: add a check to validate value type

	async function getVal() {
		return await readParser(await characteristic.readValue());
	}
	async function setValRaw(value: ArrayBuffer) {
		await characteristic.writeValue(value);
	}
	async function setVal(value: T) {
		await characteristic.writeValue(setParser(value));
	}

	// todo add listeners for notifications
	/*
      //This is responding to notifications sent by the peripheral of changes to the value.
    await batteryLevelCharacteristic.startNotifications();
    batteryLevelCharacteristic.addEventListener('characteristicvaluechanged', event => { //an event is returned
      log(event.target.value.getUint8(0)+'%, t=' + event.timeStamp );
      console.log(event); //we can use this in the console to see all the goodies in the event object.
    })
    */

	return {
		getVal,
		setVal,
		setValRaw
	};
};
