var Skyfall = {
	_servers: {}
	, _settings: {
		animate: true
		, warningLevel: 40
	}
	
	, getServer: function(serverName){
		if(this._servers[serverName]) return this._servers[serverName];
		return null;
	}
	
	, addServer: function(serverName, ip, port, start){
		if(!port) port = 3007;
		if(!start) start = true;
		
		var socket = io.connect('http://' + ip + ':' + port, {
			'reconnect': true
			, 'reconnection delay': 500
			, 'max reconnection attempts': 5
		});

		var el = $("#clone > div").clone();
		$(el).appendTo("#servers");
		
		var server = this._servers[serverName] = {
			name: serverName
			, ip: ip
			, port: port
			, socket: socket
			, el: el
			, cpuTimes: {}
			, settings: {}
		};
		
		// sysInfo
		socket.on('sysInfo', $.proxy(this.sysInfo, server));
		// loadInfo
		socket.on('loadInfo', $.proxy(this.loadInfo, server));
		// diskspace
		socket.on('diskspace', $.proxy(this.diskspace, server));
		
		this.addListeners(server);
		if(start) this.startServer(serverName);
	}
	
	, addListeners: function(server){
		var socket = server.socket;
		/*
		var el = server.el;
		// connecting
		socket.on('connecting', $.proxy(function(){
			this.el.addClass('inactive');
		}, server));
		// connect
		socket.on('connect', $.proxy(function(){
			this.el.removeClass('inactive');
			this.el.find('.icon-refresh').hide();
		}, server));
		// connect_failed
		socket.on('connect_failed', $.proxy(function(){
			Skyfall.displayError('Failed to connect to ' + this.name);
			this.el.find('.icon-refresh').hide();
		}, server));
		// disconnect
		socket.on('disconnect', $.proxy(function(){
			Skyfall.log('disconnected from ' + this.name);
			this.el.addClass('inactive');
		}, server));
		// reconnecting
		socket.on('reconnecting', $.proxy(function(){
			this.el.find('.icon-refresh').show();
		}, server));
		// reconnect
		socket.on('reconnect', $.proxy(function(transport_type, reconnectionAttempts){
			Skyfall.log('reconnected to ' + this.name);
			Skyfall.startServer(this.name, server.settings);
			this.el.find('.icon-refresh').hide();
		}, server));
		// reconnect_failed
		socket.on('reconnect_failed', $.proxy(function(){
			Skyfall.displayError('Failed to reconnect to ' + this.name);
			this.el.find('.icon-refresh').hide();
		}, server));
		// error
		socket.on('error', $.proxy(function(msg){
			Skyfall.displayError(msg);
		}, server));
		// message
		socket.on('message', $.proxy(function(msg, callback){
			Skyfall.displayMessage(msg);
		}, server));
		*/
	}
	
	, sysInfo: function(data){
		console.log("sysInfo: " + data);
		
		this.el.find('.name').text(this.name);
		// var cpuContainer = this.el.find('.cpu');
		// if(Object.keys(this.cpuTimes).length) return;
		
		// this.el.find('.cpu').addClass('cpu-' + data.cpus.length);
		// $('#cloneBox .cpu-bar').clone().addClass('cpu-bar-all').appendTo(this.el.find('.cpu-all'));
		
		for(var i=0; i<data.cpus.length; i++){
			//var el = $('#cloneBox .cpu-bar').clone().addClass('cpu-bar-' + i).attr('title', 'CPU Load (#' + (i + 1) + ')');
			//el.appendTo(cpuContainer);
			this.cpuTimes[i] = {};
		}
		
	}
	
	, loadInfo: function(data){
		//console.log("loadInfo: " + data);

		//this.el.find('.load').text(data.loadavg[0].toFixed(2));
		
		var el = this.el;
		el.find('.load_1min').html(data.loadavg[0].toFixed(2));
		el.find('.load_5min').html(data.loadavg[1].toFixed(2));
		el.find('.load_15min').html(data.loadavg[2].toFixed(2));

		if(data.loadavg[0] >= Skyfall._settings.warningLevel){
			el.addClass('warning');
		}else{
			el.removeClass('warning');
		}
		
		var uptime = Skyfall._convertTime(data.uptime);
		el.find('.uptime').html(uptime);
		
		var totalAll = 0, timesAll = {};
		
		for(var i = 0; i < data.cpus.length; i++) {
			var cpu = data.cpus[i], total = 0;
			var prevTimes = this.cpuTimes[i];
			//var cpuBar = el.find('.cpu-bar-' + i);
			var times = cpu.times;
			for(type in times){
				var time = Math.abs(times[type]);
				if(prevTimes[type]){
					var typeTime = Math.abs(time - prevTimes[type]);
				}else{
					var typeTime = time;
				}
				total += typeTime;
				this.cpuTimes[i][type] = time;
				times[type] = typeTime;
				totalAll += typeTime;
				if(!timesAll[type]) timesAll[type] = 0;
				timesAll[type] += typeTime;
			}
		}
		//var cpuBar = el.find('.cpu-bar-all');
		var user = Math.round(100 * timesAll['user'] / (total * data.cpus.length));
		var sys = Math.round(100 * timesAll['sys'] / (total * data.cpus.length));
		//cpuBar.find('.cpu-pct').html((user + sys) + '%');
		el.find('.cpu-pct').text((user + sys) + '%');
		el.find('.cpu-load-bar').css({width: (user + sys) + '%', backgroundColor: getColor(user+sys)});
		console.log(user+sys);
		// el.find('.cpu-load-bar').animate({width: (user + sys) + '%'})
		
		// if(Skyfall._settings.animate === true){
		// 	cpuBar.find('.user').animate({width: user + '%'});
		// 	cpuBar.find('.system').animate({width: sys + '%'});
		// }else{
		// 	cpuBar.find('.user').css({width: user + '%'});
		// 	cpuBar.find('.system').css({width: sys + '%'});
		// }

		var used = data.totalmem - data.freemem;
		var pct = data.totalmem > 0 ? Math.round((used / data.totalmem) * 100) : 0;

		el.find('.memory').html('Memory: ' + pct + '%');
		//this.el.find('.memory-bar').css({width: pct + '%'});
	}
	
	, diskspace: function(data){
		console.log("diskspace: " + data);
		/*
		var used = data.total - data.free;
		var pct = data.total > 0 ? Math.round((used / data.total) * 100) : 0;
		this.el.find('.diskspace').html('D: ' + pct + '%');
		this.el.find('.diskspace-bar').css({width: pct + '%'});
		*/
	}
	
	, processes: function(data){
		console.log("processes: " + data);
		/*
		var p = data.toString('utf8').trim().split("\n");
		var processes = [];
		var flds = p[0].toString('utf8').trim().split(/\s+/);
		var len = flds.length;
		for(var i=1; i<p.length; i++){
			var proc = p[i].split(/\s+/);
			var process = {};
			for(var j=0; j<flds.length; j++){
				var fld = flds[j];
				var pr = proc[j];
				if(j+1 == flds.length)
					pr = proc.slice(j).join(' ');
				
				process[fld] = pr;
			}
			processes.push(process);
		}
		
		var table = $('<table class="table table-condensed table-bordered table-striped"></table>');
		var tr = $('<tr></tr>').appendTo(table);
		for(var i=0; i<flds.length; i++){
			$('<th>' + flds[i] + '</th>').appendTo(tr);
		}
		
		for(var i=0; i<processes.length; i++){
			var process = processes[i];
			var tr = $('<tr></tr>');
			for(var j=0; j<flds.length; j++){
				$('<td>' + process[flds[j]] + '</td>').appendTo(tr);
			}
			tr.appendTo(table);
		}
		
		var el = $('.processes');
		el.html('');
		table.appendTo(el);
		*/
	}
	
	, startServer: function(serverName, opts){
		if(!opts) opts = {};
		var server = Skyfall.getServer(serverName);
		server.socket.emit('start', opts);
	}
	
	, stopServer: function(serverName){
		var server = Skyfall.getServer(serverName);
		server.socket.emit('stop', {});
	}
	
	, removeServer: function(serverName){
		var server = Skyfall.getServer(serverName);
		server.socket.emit('stop', {});
		server.socket.disconnect();
		server.el.remove();
		delete this._servers[serverName];
	}
	
	, startAll: function(){
		for(var i=0; i<this._servers.length; i++){
			var server = this._servers[i];
			this.startServer(server.name, server.settings);
		}
	}
	
	, stopAll: function(){
		for(var i=0; i<this._servers.length; i++){
			this.stopServer(this._servers[i].name);
		}
	}
	
	, _convertTime: function(ts){
		var totalSec = ts;
		days = parseInt(totalSec / 86400);
		hours = parseInt(totalSec / 3600) % 24;
		minutes = parseInt(totalSec / 60) % 60;
		seconds = parseInt(totalSec % 60);
		
		result = (days > 0 ? '<strong>' + days + '</strong>days ' : '') + (hours < 10 ? "<strong>0" + hours + "</strong>" : "<strong>" + hours + "</strong>") + "hrs " + (minutes < 10 ? "<strong>0" + minutes + "</strong>" : "<strong>" + minutes + "</strong>") + "min "/* + (seconds  < 10 ? "0" + seconds : seconds) + 'sec'*/;
		return result;
	}
};