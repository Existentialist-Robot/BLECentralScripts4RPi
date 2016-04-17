/*
 * BLE central sample script
 * BlueNinja HyouRowGan PWM Service
 */

var noble = require('noble');

function noble_on_stateChange(state)
{
	if (state === 'poweredOn') {
		noble.startScanning();
	} else {
		noble.stopScanning();
	}
}

function noble_on_discover(peripheral)
{
	var localname = peripheral.advertisement.localName;
	if (localname == null) {
		return;
	}
	if (localname.indexOf('HyouRowGan') === 0) {
		console.log('Found device with local name: ' + peripheral.advertisement.localName);
		console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
		console.log();
		peripheral_connect(peripheral);
		noble.stopScanning();
	}
}

function peripheral_connect(peripheral)
{
	/* Register disconnect event handler. */
	peripheral.once('disconnect', function _peripheral_on_disconnect() {
		console.log('Disconnected: ' + peripheral.uuid);
		noble.startScanning();
	});
	/* Connect */
	peripheral.connect(function _peripheral_connect(error) {
		console.log('Connected: ' + peripheral.uuid);
		peripheral_discoverServices(peripheral);
	});
}

function peripheral_discoverServices(peripheral)
{
	peripheral.discoverServices(['00020000672711e5988ef07959ddcdfb'], function _peripheral_discoverServices(error, services) {
		console.log('discoverd services:');
		for (var i in services) {
			console.log('  ' + i + ' uuid: ' + services[i].uuid);
			service_discoverCharacteristics(services[i]);
			break;
		}
	});
}

function service_discoverCharacteristics(service)
{
	service.discoverCharacteristics(null, function _service_discoverCharacteristics(error, characteristics) {
		console.log('  discoverd characteristics:');
		for (var i in characteristics) {
			/* Duty */
			if (characteristics[i].uuid == '00020103672711e5988ef07959ddcdfb') {
				var duty = new Buffer(4);
				duty.writeFloatLE(0.25, 0);
				characteristics[i].write(duty, false, function(error) {
					console.log("  Duty write completed: error=" + error);

				});
			}
			/* Clock */
			if (characteristics[i].uuid == '00020102672711e5988ef07959ddcdfb') {
				var en = new Buffer(4);
				en.writeUInt32LE(50, 0);
				characteristics[i].write(en, false, function(error) {
					console.log('  Frequency write completed: error=' + error);
				});
			}
			/* ON/OFF */
			if (characteristics[i].uuid == '00020101672711e5988ef07959ddcdfb') {
				var onoff = new Buffer(1);
				onoff.writeUInt8(1, 0);
				characteristics[i].write(onoff, false, function(error) {
					console.log('  ON/OFF write completed: error=' + error);
				});
			}
		}
	});

}

function characteristic_read(characteristic)
{
	characteristic.read(function(error, data) {
		var arr_buf = new ArrayBuffer(4);
		var u8a = new Uint8Array(arr_buf);
		var f32a = new Float32Array(arr_buf);

		for (var i = 0; i < 4; i++) {
			u8a[i] = data[i];
		}

		console.log('PWM0 Duty: ' + f32a[0]);
		process.exit();
	});
}

noble.on('stateChange', noble_on_stateChange);
noble.on('discover', noble_on_discover);
