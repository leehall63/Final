var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = {
	height:1.8,
	speed: 0.5,
}

function init(){
	// VUE.JS
		function ready(f) {
		  /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f();
		}

		ready(function() {
			let weatherApp = new Vue({
			  el: '#myCanvas',
			  data: {
			    apiKey: '52c792106fa2847de54d585ad6e9a49f',
			    currentTemp: '',
			    minTemp: '',
			    maxTemp:'',
			    sunrise: '',
			    sunset: '',
			    pressure: '',
			    humidity: '',
			    wind: '',
			    overcast: '', 
			    icon: '',
			    location: 'Northridge'
			  },
			  methods: {
			    getWeather() {
			      let url = "https://api.openweathermap.org/data/2.5/weather?q="+this.location+"&units=imperial&APPID="+this.apiKey;
			      axios
			        .get(url)
			        .then(response => {
			          this.currentTemp = response.data.main.temp;
			          this.minTemp = response.data.main.temp_min;
			          this.maxTemp = response.data.main.temp_max;
			          this.pressure = response.data.main.pressure;
			          this.humidity = response.data.main.humidity + '';
			          this.wind = response.data.wind.speed + 'm/s';
			          this.overcast = response.data.weather[0].description;
			      })
			      .catch(error => {
			        console.log(error);
			      });
			    },
			  },
			  updated() {
			    this.getWeather();
			  },
			})
		});

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera (90, window.innerWidth/window.innerHeight, 0.1, 10);


	//IF ELSE FOR VUE
		if (this.currentTemp > 75) {
  			scene.background = new THREE.Color( 0xFF7023 );
		} else if (75 > this.currentTemp > 50) {
			scene.background = new THREE.Color( 0x23B2FF );
		} else {
  			scene.background = new THREE.Color( 0x9E9E9E );
		};

		if (this.overcast > 80) {
			scene.fog = new THREE.FogExp2( 0x9e9e9e, 0.0025 );
		} else {
			scene.fog = new THREE.FogExp2 (0x000000, 0);
		};

	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshBasicMaterial ({color: 0x000000, wireframe: false})
		);
	scene.add(mesh);

	meshFloor = new THREE.Mesh(
			new THREE.PlaneGeometry (10,10, 2, 2),
			new THREE.MeshBasicMaterial({ color: 0xff9999, wireframe: false})
		);

	meshFloor.rotation.x -= Math.PI / 2;
	scene.add(meshFloor);

	camera.position.set (0,player.height,-5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	animate();
}



function animate(){
	requestAnimationFrame(animate);


	if (keyboard[87]){//left arrow key
		camera.rotation.y -= Math.PI * 0.01;
	}

	if (keyboard[37]){//left arrow key
		camera.rotation.y -= Math.PI * 0.01;
	}

	if (keyboard[39]){//right arrow key
		camera.rotation.y += Math.PI * 0.01;
	}

	renderer.render(scene,camera);
}

function keyDown(event) {
	keyboard[event.keyCode] = true;

}

function keyUp(event) {
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;