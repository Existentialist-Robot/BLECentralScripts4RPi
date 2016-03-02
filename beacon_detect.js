var noble = require('noble');
require('date-utils');

function noble_on_stateChange(state)
{
	if (state === 'poweredOn') {
		noble.startScanning(["feaa"], true);
	} else {
		noble.stopScanning();
	}
}

function noble_on_discover(peripheral)
{
	var dt_now = new Date();
	var dt_now_str = dt_now.toFormat("YYYYMMDD-HH24MISS: ");
	var srvData = peripheral.advertisement.serviceData[0];
	if (srvData) {
		if (srvData.uuid == "feaa") {
			switch (srvData.data[0]) {
			case 0x00: //UID
				console.log(dt_now_str + 'Detect Eddystone-UID.');
				//Namespace
				var name_space = ' Namespace: 0x';
				srvData.data.slice( 2, 12).forEach(function(val, index, array) {
					name_space += val.toString(16);
				});
				console.log(name_space);
				//Instance
				var instance = ' Instance : 0x';
				srvData.data.slice(12, 18).forEach(function(val, index, array) {
					instance += val.toString(16);
				});
				console.log(instance);
				break;
			case 0x10: //URL
				console.log(dt_now_str + 'Detect Eddystone-URL.');
				var url = ' URL :';
				switch (srvData.data[2]) {
				case 0x00:
					url += 'http://www.';
					break;
				case 0x01:
					url += 'https://www.';
					break;
				case 0x02:
					url += 'http://';
					break;
				case 0x03:
					url += 'https://';
					break;
				}
				var dec_table = [
					'.com/', '.org/', '.edu/', '.net/', '.info/', '.biz/', '.gov/',
					'.com', '.org', '.edu', '.net', '.info', '.biz', '.gov'
				];
				srvData.data.slice(3).forEach(function(val, index, array) {
					if (val < dec_table.length) {
						url += dec_table[val];
					} else {
						url += String.fromCharCode(val);
					}
				});
				console.log(url);
				break;
			case 0x20: //TLM
				console.log(dt_now_str + 'Detect Eddystone-TLM.');
				break;
			}
		}
	} else {
		console.log(dt_now_str + 'Detect Eddystone(no service data)');
	}
	console.log(' RSSI: ' + peripheral.rssi);
	console.log();
}

noble.on('stateChange', noble_on_stateChange);
noble.on('discover', noble_on_discover);
