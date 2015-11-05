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
	}
}

function peripheral_connect(peripheral)
{
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
			if (characteristics[i].uuid == '00020103672711e5988ef07959ddcdfb') {
				console.log('    ' + i + ' uuid: ' + characteristics[i].uuid);
				characteristic_write(characteristics[i]);
			}
			if (characteristics[i].uuid == '00020102672711e5988ef07959ddcdfb') {
				var en = new Buffer(4);
				en.writeUInt32LE(50, 0);
				characteristics[i].write(en, false, function(error) {
					console.log('write comp...' + error);	
				});
			}
			if (characteristics[i].uuid == '00020101672711e5988ef07959ddcdfb') {
				var en = new Buffer(1);
				en.writeUInt8(1, 0);
				characteristics[i].write(en, false, function(error) {
					console.log('write comp...' + error);	
				});
			}
		}
	});
}

function characteristic_write(characteristic)
{
	var buf = new Buffer(4);
	buf.writeFloatLE(0.25, 0);

	characteristic.write(buf, false, function(error) {
		console.log("Write completed. " + error);
//		characteristic_read(characteristic);
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

function characteristic_notify(characteristic)
{
	characteristic.on('read', function _characteristic_read(data, isNotification) {
		var arr_buf = new ArrayBuffer(36);
		var u8a  = new Uint8Array(arr_buf);
		var i16a = new Int16Array(arr_buf);
		for (var i = 0; i < 36; i++) {
			u8a[i] = data[i];
		}
		console.log('GYRO : x=' + i16a[0] / 16.4 + ' y=' + i16a[1] / 16.4 + ' z=' + i16a[2] / 16.4);
		console.log('ACCEL: x=' + i16a[3] / 2048 + ' y=' + i16a[4] / 2048 + ' z=' + i16a[5] / 2048);
		console.log('MAGM : x=' + i16a[6] + ' y=' + i16a[7] + ' z=' + i16a[8]);
		console.log();

		console.log('GYRO : x=' + i16a[9] / 16.4 + ' y=' + i16a[10] / 16.4 + ' z=' + i16a[11] / 16.4);
		console.log('ACCEL: x=' + i16a[12] / 2048 + ' y=' + i16a[13] / 2048 + ' z=' + i16a[14] / 2048);
		console.log('MAGM : x=' + i16a[15] + ' y=' + i16a[16] + ' z=' + i16a[17]);
		console.log();
	});

	characteristic.notify(true, function(error) {
		console.log('notify on');
	});
}

noble.on('stateChange', noble_on_stateChange);
noble.on('discover', noble_on_discover);
