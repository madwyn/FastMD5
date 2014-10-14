;!function() {
	var d = document;

	function $(id) { return d.getElementById(id); }

	var win = $("win"),
		loading = $("loading"),
		menu = {
			elem: $("menu"),
			tests: $("menu-tests"),
			benchmark: $("menu-benchmark")
		},
		content = {
			elem: $("content"),
			tests: $("content-tests"),
			tests_table: $("content-tests-table"),
			benchmark: $("content-benchmark"),
			benchmark_table: $("content-benchmark-table")
		},
		info_tests = $("info-tests"),
		info_benchmark = $("info-benchmark"),
		run_tests = $("run-tests"),
		run_benchmark = $("run-benchmark");

	// loading

	var loadingInterval = setInterval(function() {
		if(typeof md5 !== "function") return;

		clearInterval(loadingInterval);
		content.elem.className = "visible";
		win.removeChild(loading);

		initUI();
	}, 10);

	// UI
	var tabs = ["tests", "benchmark"],
		activeTab = null;

	function initUI() {
		menu.tests.setAttribute("count", tests.length);

		// init tabs
		tabs.forEach(function(tab) {
			menu[tab].onclick = function() {
				selectTab(tab);
			};
		});

		selectTab("tests");

		initTests();
		initBenchmark();
	}

	function selectTab(tab) {
		if(tabs.indexOf(tab) === -1 || activeTab === tab) return;

		if(activeTab !== null) {
			menu[activeTab].className = "";
			content[activeTab].className = "";
		}

		menu[tab].className = "active";
		content[tab].className = "visible";
		activeTab = tab;
	}

	// tests

	var testsRunning = false,
		completeTests = 0;

	var tests = [
		{
			name: "MD5 hash strings: length 0 to 55",
			func: function() {
				var string = "";

				for(var i = 0;i < 55;i++) {
					if(md5(string) !== md5jkm(string)) return false;

					string += "a";
				}

				return true;
			}
		},
		{
			name: "MD5 hash strings: length 55 to 64",
			func: function() {
				var string = "";

				for(var i = 0;i < 55;i++)
					string += "a";

				for(;i < 64;i++) {
					if(md5(string) !== md5jkm(string)) return false;

					string += "a";
				}

				return true;
			}
		},
		{
			name: "MD5 hash strings: length 64 to 1000",
			func: function() {
				var string = "";

				for(var i = 0;i < 64;i++)
					string += "a";

				for(;i < 1000;i++) {
					if(md5(string) !== md5jkm(string)) return false;

					string += "a";
				}

				return true;
			}
		},
		{
			name: "MD5 UTF-8 hash",
			func: function() {
				var string1 = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
					string2 = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
					string3 = string1 + string2;

				if(md5(string1) !== md5utf(string1)) return false;
				if(md5(string2) !== md5utf(string2)) return false;

				return md5(string3) === md5utf(string3);
			}
		}
	];

	function initTests() {
		for(var i = 0, j = tests.length;i < j;i++) {
			var tr = d.createElement("tr"),
				name = d.createElement("td"),
				state = d.createElement("td");

			tr.id = "test-" + i;
			name.id = "test-name-" + i;
			state.id = "test-state-" + i;

			name.innerHTML = tests[i].name;
			state.innerHTML = "?";

			tr.appendChild(name);
			tr.appendChild(state);
			content.tests_table.appendChild(tr);
		}

		run_tests.onclick = runTests;

		// info init

		var close = d.createElement("div");
		close.className = "close";
		close.onclick = function() {
			store.set("infoTestsClosed", true);
			content.tests.removeChild(info_tests);
		};
		info_tests.appendChild(close);

		// localStorage init
		if(store.get("infoTestsClosed"))
			content.tests.removeChild(info_tests);
	}

	function runTests() {
		if(testsRunning) return;
		testsRunning = true;

		clearTests();

		run_tests.className = "button-1 active";
		run_tests.innerHTML = "Running...";

		for(var i = 0, j = tests.length;i < j;i++)
			startTest(i);
	}

	function clearTests() {
		completeTests = 0;
		for(var i = 0, j = tests.length;i < j;i++) {
			$("test-" + i).className = "";
			$("test-state-" + i).innerHTML = "?";
		}
	}

	function startTest(i) {
		setTimeout(function() {
			var tr = $("test-" + i),
				state = $("test-state-" + i),
				correct = tests[i].func();

			if(!correct) {
				tr.className = "error";
				state.innerHTML = "ERROR";
				run_tests.innerHTML = "ERROR";
				return;
			}

			tr.className = "ok";
			state.innerHTML = "OK";

			if(++completeTests === tests.length) {
				run_tests.className = "button-1";
				run_tests.innerHTML = "Run Tests";
				testsRunning = false;
			}
		}, i * 100);
	}

	// benchmark

	var benchmarkRunning = false,
		completeBenchmarks = 0;

	var benchmarks = [
		{
			name: "FastMD5 — 1 000 000 hashes",
			func: function() {
				var start = new Date();
				for(var i = 0;i < 1000000;i++)
					md5("Hello World", true);
				var end = new Date();

				return end - start;
			}
		},
		{
			name: "Joseph Myers's MD5 — 1 000 000 hashes",
			func: function() {
				var start = new Date();
				for(var i = 0;i < 1000000;i++)
					md5jkm("Hello World");
				var end = new Date();

				return end - start;
			}
		},
		{
			name: "Joseph Myers's MD5 + UTF — 1 000 000 hashes",
			func: function() {
				var start = new Date();
				for(var i = 0;i < 1000000;i++)
					md5utf("Hello World");
				var end = new Date();

				return end - start;
			}
		}
	];

	function initBenchmark() {
		for(var i = 0, j = benchmarks.length;i < j;i++) {
			var tr = d.createElement("tr"),
				name = d.createElement("td"),
				time = d.createElement("td"),
				efficiency = d.createElement("td");

			tr.id = "benchmark-" + i;
			name.id = "benchmark-name-" + i;
			time.id = "benchmark-time-" + i;
			efficiency.id = "benchmark-efficiency-" + i;

			name.innerHTML = benchmarks[i].name;
			time.innerHTML = "?";
			efficiency.innerHTML = "?";

			tr.appendChild(name);
			tr.appendChild(time);
			tr.appendChild(efficiency);
			content.benchmark_table.appendChild(tr);
		}

		run_benchmark.onclick = runBenchmark;

		// info init

		var close = d.createElement("div");
		close.className = "close";
		close.onclick = function() {
			store.set("infoBenchmarkClosed", true);
			content.benchmark.removeChild(info_benchmark);
		};
		info_benchmark.appendChild(close);

		// localStorage init
		if(store.get("infoBenchmarkClosed"))
			content.benchmark.removeChild(info_benchmark);
	}

	// todo: make asynchronous
	function runBenchmark() {
		if(benchmarkRunning) return;
		benchmarkRunning = true;

		clearBenchmark();

		run_benchmark.className = "button-1 active";
		run_benchmark.innerHTML = "Running...";

		var timeArray = [];
		for(var i = 0, j = benchmarks.length;i < j;i++)
			startBenchmark(i, timeArray);

		var maxTime = Math.max.apply(Math, timeArray),
			minTime = Math.min.apply(Math, timeArray),
			maxTimeIndex = timeArray.indexOf(maxTime),
			minTimeIndex = timeArray.indexOf(minTime);

		for(i = 0, j = timeArray.length;i < j;i++)
			getEfficiency(i, timeArray, maxTime);

		$("benchmark-" + maxTimeIndex).className = "error";
		$("benchmark-" + minTimeIndex).className = "ok";
	}

	function clearBenchmark() {
		completeBenchmarks = 0;
		for(var i = 0, j = benchmarks.length;i < j;i++) {
			$("benchmark-" + i).className = "";
			$("benchmark-time-" + i).innerHTML = "?";
			$("benchmark-efficiency-" + i).innerHTML = "?";
		}
	}

	function startBenchmark(i, timeArray) {
		var tr = $("benchmark-" + i),
			time = $("benchmark-time-" + i),
			timeValue = benchmarks[i].func();

		time.innerHTML = timeValue + "ms";
		timeArray.push(timeValue);

		if(++completeBenchmarks === benchmarks.length) {
			run_benchmark.className = "button-1";
			run_benchmark.innerHTML = "Run Benchmark";
			benchmarkRunning = false;
		}

		//console.log(i, time);
	}

	function getEfficiency(i, timeArray, maxTime) {
		$("benchmark-efficiency-" + i).innerHTML = Math.floor(maxTime * 100 / timeArray[i]) + "%";
	}
}();