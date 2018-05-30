const DATASETNNG = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const DATASETCNY = "https://data.cityofnewyork.us/api/views/bydc-d8tj/rows.json?accessType=DOWNLOAD";
const DATASETHNYUB = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const DATASETNYDG = 'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
const ULAT = 40.7288625;
const ULON = -73.9964132;

var nng = [];
var cny = [];
var hnyub = [];
var neighborhoodsData = [];
var districtsData = [];
var nydg = [];
var filtro = false;
var map;
var markets = [];
var svg = d3.select('#grap')
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 600,
	height = 500,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function (d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function (d) {
	return d.data.label;
};

var ar = [];

var color = d3.scale.ordinal()
	.domain(ar)
	.range(["#b22222", "#737116", "#660909", "#0A2333", "#0770B2"]);

//inicio funciones

function getData2(URL, arreglo) {
	var data = $.getJSON(URL, function () {})
		.done(function () {
			for (var i = 0; i < data.responseJSON.features.length; i++) {
				arreglo.push(data.responseJSON.features[i]);
			}
		})
}

function getData(URL, arreglo = []) {
	var data = $.get(URL, function () {})
		.done(function () {
			for (var i = 0; i < data.responseJSON.data.length; i++) {
				arreglo.push(data.responseJSON.data[i]);
			}
		})
		.fail(function (error) {
			console.error(error);
		})
}

function getall() {
	getData(DATASETNNG, nng);
	getData(DATASETHNYUB, hnyub);
	getData(DATASETCNY, cny);
	getData2(DATASETNYDG, nydg);
}

function distaciaPuntos(lat1, long1, lat2, long2) {
	return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(long1 - long2, 2));
}

function organiceNeighborhoods() {
	for (var i = 0; i < nng.length; i++) {
		neighborhoodsData[i] = [nng[i][10], nng[i][16], 0, 0, distaciaPuntos(nng[i][9].split("(")[1].split(" ")[1].split(")")[0], nng[i][9].split("(")[1].split(" ")[0], ULAT, ULON), 0];
	}
}

function organiceDistricts() {
	for (var i = 0; i < nydg.length; i++) {
		districtsData[i] = [nydg[i].id, "Condados", 0, 0, 20000000, 0, 0];
	}
	for (var i = 0; i < nydg.length; i++) {
		var poligono = [];
		for (var j = 0; j < nydg[i].geometry.coordinates.length; j++) {
			for (var k = 0; k < nydg[i].geometry.coordinates[j].length; k++) {
				var auxa = new google.maps.LatLng(nydg[i].geometry.coordinates[j][k][1], nydg[i].geometry.coordinates[j][k][0]);
				poligono.push(auxa);
			}
		}
		var poly = new google.maps.Polygon({
			paths: poligono
		});
		for (var l = 0; l < nng.length; l++) {
			var punto = new google.maps.LatLng(nng[l][9].split("(")[1].split(" ")[1].split(")")[0], nng[l][9].split("(")[1].split(" ")[0]);
			if (google.maps.geometry.poly.containsLocation(punto, poly)) {
				districtsData[i][1] = neighborhoodsData[l][1];
				if (districtsData[i][4] > neighborhoodsData[l][4]) {
					districtsData[i][4] = neighborhoodsData[l][4];
					districtsData[i][6] = punto;
				}
			}
		}
		for (var l = 0; l < cny.length; l++) {
			var puntoa = new google.maps.LatLng(cny[l][29], cny[l][30]);
			if (google.maps.geometry.poly.containsLocation(puntoa, poly)) {
				districtsData[i][2]++;
			}
		}
		for (var k = 0; k < hnyub.length; k++) {
			if (hnyub[k][23] != null && hnyub[k][24] != null) {
				var puntoa = new google.maps.LatLng(hnyub[k][23], hnyub[k][24]);
				if (google.maps.geometry.poly.containsLocation(puntoa, poly)) {
					districtsData[i][3] += parseInt(hnyub[k][31]);
				}
			}
		}
	}
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: {
			lat: ULAT,
			lng: ULON
		}
	});

	var image = 'https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_school_black_24dp.png';

	var marker = new google.maps.Marker({
		position: {
			lat: ULAT,
			lng: ULON
		},
		icon: image,
		map: map
	});

	map.data.loadGeoJson(DATASETNYDG);
	map.data.setStyle({
		fillColor: "#212529",
		fillOpacity: 0.1,
		strokeColor: "#212529",
		strokeOpacity: 0.8,
		strokeWeight: 1

	});
	getall();
}

function organizar() {
	var image;
	var aux = [];
	var contador = 0;
	for (var i = 0; i < districtsData.length; i++) {

		if (districtsData[i][1].localeCompare("Condados") != 0) {
			aux.push(districtsData[i]);
		}
	}
	districtsData = aux;
	var checkBoxs = [];
	checkBoxs.push(document.getElementById("distancia"));
	checkBoxs.push(document.getElementById("seguridad"));
	checkBoxs.push(document.getElementById("accesibilidad"));
	if (checkBoxs[0].checked == true) {
		if (contador == 0) {
			image = 'https://raw.githubusercontent.com/google/material-design-icons/master/maps/1x_web/ic_navigation_black_24dp.png';
		}
		contador++;
		districtsData.sort(function (a, b) {
			if (a[4] < b[4]) {
				return -1;
			}
			if (a[4] > b[4]) {
				return 1;
			}
			return 0;
		});
		var cont = 0;
		for (var i = 0; i < districtsData.length; i++) {
			for (var j = 0; j < districtsData.length; j++) {
				if (districtsData[i][4] == districtsData[j][4]) {
					if (i == j) {
						cont++;
						districtsData[i][5] += cont;
						break;
					} else {
						districtsData[i][5] += cont;
						break;
					}
				}
			}
		}
	}
	if (checkBoxs[1].checked == true) {
		if (contador == 0) {
			image = 'https://raw.githubusercontent.com/google/material-design-icons/master/hardware/1x_web/ic_security_black_24dp.png';
		}
		contador++;
		districtsData.sort(function (a, b) {
			if (a[2] < b[2]) {
				return -1;
			}
			if (a[2] > b[2]) {
				return 1;
			}
			return 0;
		});
		var cont = 0;
		for (var i = 0; i < districtsData.length; i++) {
			for (var j = 0; j < districtsData.length; j++) {
				if (districtsData[i][2] == districtsData[j][2]) {
					if (i == j) {
						cont++;
						districtsData[i][5] += cont;
						break;
					} else {
						districtsData[i][5] += cont;
						break;
					}
				}
			}
		}
	}
	if (checkBoxs[2].checked == true) {
		if (contador == 0) {
			image = 'https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_location_city_black_24dp.png';
		}
		contador++;
		districtsData.sort(function (a, b) {
			if (a[3] < b[3]) {
				return 1;
			}
			if (a[3] > b[3]) {
				return -1;
			}
			return 0;
		});
		var cont = 0;
		for (var i = 0; i < districtsData.length; i++) {
			for (var j = 0; j < districtsData.length; j++) {
				if (districtsData[i][3] == districtsData[j][3]) {
					if (i == j) {
						cont++;
						districtsData[i][5] += cont;
						break;
					} else {
						districtsData[i][5] += cont;
						break;
					}
				}
			}
		}
	}
	districtsData.sort(function (a, b) {
		if (a[5] < b[5]) {
			return -1;
		}
		if (a[5] > b[5]) {
			return 1;
		}
		return 0;
	});
	if (contador != 1) {
		image = 'https://raw.githubusercontent.com/google/material-design-icons/master/action/1x_web/ic_bookmark_black_24dp.png';
	}

	for (var i = 0; i < topa(); i++) {
		markets.push(new google.maps.Marker({
			position: {
				lat: districtsData[i][6].lat(),
				lng: districtsData[i][6].lng()
			},
			label: {
				text: (i + 1) + "",
				color: "#FF0004",
				fontSize: "8",
				fontWeight: "bolder"
			},
			icon: image,
			animation: google.maps.Animation.DROP,
			map: map
		}))
	}
}

function download_csv() {
	var csv = 'District ID;Borough name;Number of Crimes;Number of units based on an afforability range; Distance from the closer neighborhood;Ranking Points;LAT,LNG\n';
	districtsData.forEach(function (row) {
		csv += row.join(';');
		csv += "\n";
	});
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'DistrictsRanking.csv';
	hiddenElement.click();
}

//D3.js
function randomData() {
	var labels = color.domain();
	var min = districtsData[0][5];
	var max = districtsData[topa() - 1][5];
	return labels.map(function (label) {
		var a = 0;
		for (var i = 0; i < districtsData.length; i++) {
			if (districtsData[i][0] == parseInt(label.split(" ")[1])) {
				a = max - districtsData[i][5] + min;
				break;
			}
		}
		return {
			label: label,
			value: a
		}
	});
}

function change(data) {
	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function (d) {
			return color(d.data.label);
		})
		.attr("class", "slice");

	slice
		.transition().duration(1000)
		.attrTween("d", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function (d) {
			return d.data.label;
		});

	function midAngle(d) {
		return d.startAngle + (d.endAngle - d.startAngle) / 2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		})
		.styleTween("text-anchor", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function (d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();
};
//fin D3.js

function topa() {
	if (document.getElementById("top").selectedIndex == 0) {
		return 3;
	} else if (document.getElementById("top").selectedIndex == 1) {
		return 5;
	} else if (document.getElementById("top").selectedIndex == 2) {
		return 10;
	} else if (document.getElementById("top").selectedIndex == 3) {
		return districtsData.length;
	}
	return 0;
}

function updateTable() {
	if (nydg.length < 71) {
		alert("Espere a que se cargen los datos");
	} else {
		if (!filtro) {
			organiceNeighborhoods();
			organiceDistricts();
			filtro = true;
		}
		for (var i = 0; i < districtsData.length; i++) {
			districtsData[i][5] = 0;
		}
		for (var i = 0; i < markets.length; i++) {
			markets[i].setMap(null);
		}
		markets = [];
		ar = [];
		var col = [];
		col = ["#b22222", "#737116", "#660909", "#0A2333", "#0770B2"];
		organizar();
		for (var i = 0; i < topa(); i++) {
			ar[i] = "ID: " + districtsData[i][0];
		}
		color = d3.scale.ordinal()
			.domain(ar)
			.range(col);
		change(randomData());
	}
}

$(document).ready(function () {
	$("#filtrar").on("click", updateTable);
	$("#export").on("click", download_csv);
})