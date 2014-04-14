$(document).ready(function() {
	var servers = {
		"Web1.JT":{"address":"web1.jackthreads.com","port":3007},
		"PROD11.JT":{"address":"prod-jitr-11-jackthreads.jackthreads.com","port":3007},
		"PROD12.JT":{"address":"prod-jitr-12-jackthreads.jackthreads.com","port":3007},
		"PROD13.JT":{"address":"prod-jitr-13-jackthreads.jackthreads.com","port":3007},
		"PROD14.JT":{"address":"prod-jitr-14-jackthreads.jackthreads.com","port":3007},
		"PROD15.JT":{"address":"prod-jitr-15-jackthreads.jackthreads.com","port":3007},
		"PROD16.JT":{"address":"prod-jitr-16-jackthreads.jackthreads.com","port":3007},
		"PROD17.JT":{"address":"prod-jitr-17-jackthreads.jackthreads.com","port":3007},
		"PROD18.JT":{"address":"prod-jitr-18-jackthreads.jackthreads.com","port":3007},
		// "PL01.JT":{"address":"pinnacle-large-01.jackthreads.com","port":3007},
		// "PL02.JT":{"address":"pinnacle-large-02.jackthreads.com","port":3007},
		// "PL03.JT":{"address":"pinnacle-large-03.jackthreads.com","port":3007},
		// "web1.TL":{"address":"web1.thrillist.com","port":3007},
		// "cloud1.TL":{"address":"cloud1.thrillist.com","port":3007},
		// "cloud2.TL":{"address":"cloud2.thrillist.com","port":3007},
		// "vortex.TL":{"address":"vortex01.thrillist.com","port":3007},
		// "zuul.TL":{"address":"zuul.thrillist.com","port":3007},
		// "artemis.TL":{"address":"artemis-admin.thrillist.com","port":3007},
		// "db3.TL":{"address":"db3.thrillist.com","port":3007},
		// "db4.TL":{"address":"db4.thrillist.com","port":3007},
		// "Vortex1":{"address":"prod-vortex-01.thrillist.com","port":3007},
		// "Vortex2":{"address":"prod-vortex-02.thrillist.com","port":3007}
	};

	for(var name in servers){
		var server = servers[name];
		var port = 3007;
		if(typeof server == 'object'){
			var address = server['address'];
			if(server['port']) port = server['port'];
		}else{
			var split = server.split(':');
			var address = split[0];
			if(split.length > 1) port = split[1];
		}
		Skyfall.addServer(name, address, port);
	}
})