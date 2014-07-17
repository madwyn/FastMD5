(function() {
	var d = document;

	var loading = d.getElementById("loading");
	var content = d.getElementById("content");
	var content_tests = d.getElementById("content-tests");
	var content_tests_table = d.getElementById("content-tests-table");
	var info_tests = d.getElementById("info-tests");
	var run_tests = d.getElementById("run-tests");
	var testsRunning = false;
	var currentTest = 0;

	// loading
	
	var loadingInterval = setInterval(function() {
		if(typeof md5 === "function") {
			clearInterval(loadingInterval);
			content.style.display = "block";
			loading.style.display = "none";
		}
	}, 10);

	// tests

	var tests = [
		{
			name: "MD5 hash strings: length 0 to 100",
			func: function() {
				var string = "";

				for(var i = 0;i < 100;i++) {
					if(md5(string) === md5jkm(string)) {
						string += "1";
						currentTest++;
					}else{
						return false;
					}
				}

				return true;
			}
		}
	];

	function initTests() {
		for(var i = 0, j = tests.length;i < j;i++) {
			var testTR = d.createElement("tr");
			var nameTD = d.createElement("td");
			var stateTD = d.createElement("td");
			testTR.id = "test-" + i;
			nameTD.id = "test-name-" + i;
			stateTD.id = "test-state-" + i;

			nameTD.innerHTML = tests[i].name;
			stateTD.innerHTML = "?";

			testTR.appendChild(nameTD);
			testTR.appendChild(stateTD);
			content_tests_table.appendChild(testTR);
		}

		run_tests.onclick = runTests;
	}

	var testsRunning = false;
	function runTests() {
		if(testsRunning) return;
		testsRunning = true;

		clearTests();

		run_tests.className = "button-1 active";
		run_tests.innerHTML = "Running...";

		for(var i = 0, j = tests.length;i < j;i++) {
			runTest(i);
		}
	}

	function runTest(i) {
		setTimeout(function() {
			var correct = tests[i].func();
			if(!correct) {
				document.getElementById("test-" + i).className = "error";
				document.getElementById("test-state-" + i).innerHTML = "ERROR";
				run_tests.innerHTML = "ERROR";
				return;
			}else{
				document.getElementById("test-" + i).className = "ok";
				document.getElementById("test-state-" + i).innerHTML = "OK";

				if(i == tests.length - 1) {
					run_tests.className = "button-1";
					run_tests.innerHTML = "Run Tests";
					testsRunning = false;
				}
			}
		}, i * 100);
	}

	function clearTests() {
		for(var i = 0, j = tests.length;i < j;i++) {
			document.getElementById("test-" + i).className = "";
			document.getElementById("test-state-" + i).innerHTML = "?";
		}
	}

	var info_tests_close = d.createElement("div");
	info_tests_close.className = "close";
	info_tests_close.onclick = function() {
		// TODO: localStorage save
		content_tests.removeChild(info_tests);
	};
	info_tests.appendChild(info_tests_close);

	initTests();
})();