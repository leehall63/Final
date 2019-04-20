var scene, camera, renderer, mesh;



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
			    location: ''
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

	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshBasicMaterial ({color: 0xff9999, wireframe: true})
		);

	scene.add(mesh);

	renderer = new THREE.WebGLRenderer( {alpha: true } );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	animate();
}



function animate(){
	requestAnimationFrame(animate);



	renderer.render(scene,camera);
}

window.onload = init;