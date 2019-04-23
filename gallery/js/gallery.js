var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = {
	height:3,
	speed: 0.5,
	turnSpeed: Math.PI*0.02
}

function init() {
	// VUE.JS
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
			});

	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0x8CD9FF );
	camera = new THREE.PerspectiveCamera (90, window.innerWidth/window.innerHeight, 0.5, 500);

	// if (main.temp > 75) {
	// 	scene.background = new THREE.Color( 0xDB0300 );
	// } else {
	// 	scene.background = new THREE.Color( 0x8CD9FF );
	// };

	//create red wall
	redWall = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,100),
		new THREE.MeshPhongMaterial({color:0xff9999, wireframe:false}) 
		);
	redWall.position.x += 50;
	redWall.position.z += 55;
	redWall.receiveShadow = true;
	redWall.castShadow = true;
	scene.add(redWall);

	// var textureLoader = new THREE.TextureLoader ();
	// 	whiteTexture = new textureLoader.load ("images/brick.jpg");
//create front walls
	//create first white wall
		whiteWall1 = new THREE.Mesh (
				new THREE.BoxGeometry (47,20,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false}) 
				);
			whiteWall1.position.x += 27;
			whiteWall1.position.z += 5;
			whiteWall1.receiveShadow = true;
			whiteWall1.castShadow = true;
			scene.add(whiteWall1);

	//create second white wall
		whiteWall2 = new THREE.Mesh (
				new THREE.BoxGeometry (47,20,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false}) 
				);
			whiteWall2.position.x -= 27;
			whiteWall2.position.z += 5;
			whiteWall2.receiveShadow = true;
			whiteWall2.castShadow = true;
			scene.add(whiteWall2);

	//create top of door frame for white wall
		whiteWall3 = new THREE.Mesh (
				new THREE.BoxGeometry (25,4,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false}) 
				);
			whiteWall3.position.y += 8;
			whiteWall3.position.z += 5;
			whiteWall3.receiveShadow = true;
			whiteWall3.castShadow = true;
			scene.add(whiteWall3);

//create yellow wall
	rightWall = new THREE.Mesh (
			new THREE.BoxGeometry (1,20,100),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
			);
		rightWall.position.x -= 50;
		rightWall.position.z += 55;
		rightWall.receiveShadow = true;
		rightWall.castShadow = true;
		scene.add(rightWall);

//create blue wall
	blueWall = new THREE.Mesh (
			new THREE.BoxGeometry (100,20,1),
			new THREE.MeshPhongMaterial({color:0x5085FF, wireframe:false})
			);
		blueWall.position.z += 105;
		blueWall.receiveShadow = true;
		blueWall.castShadow = true;
		scene.add(blueWall);

//create green wall
	//create first green wall
		greenWall1 = new THREE.Mesh (
				new THREE.BoxGeometry (46,20,1),
				new THREE.MeshPhongMaterial({color:0x458B00, wireframe:false}) 
				);
			greenWall1.position.x += 27;
			greenWall1.position.z += 35;
			greenWall1.receiveShadow = true;
			greenWall1.castShadow = true;
			scene.add(greenWall1);

	//create second green wall
		greenWall2 = new THREE.Mesh (
				new THREE.BoxGeometry (46,20,1),
				new THREE.MeshPhongMaterial({color:0x458B00, wireframe:false}) 
				);
			greenWall2.position.x -= 27;
			greenWall2.position.z += 35;
			greenWall2.receiveShadow = true;
			greenWall2.castShadow = true;
			scene.add(greenWall2);

	//create top of door frame for green wall
		greenWall3 = new THREE.Mesh (
				new THREE.BoxGeometry (25,5,1),
				new THREE.MeshPhongMaterial({color:0x458B00, wireframe:false}) 
				);
			greenWall3.position.y += 7.5;
			greenWall3.position.z += 35;
			greenWall3.receiveShadow = true;
			greenWall3.castShadow = true;
			scene.add(greenWall3);

//create ceiling
	ceiling = new THREE.Mesh (
			new THREE.BoxGeometry (100,1,100),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
			);
		ceiling.position.y += 10;
		ceiling.position.z += 55;
		ceiling.receiveShadow = true;
		ceiling.castShadow = true;
		scene.add(ceiling);


//create the gallery floor
	floor = new THREE.Mesh (
			new THREE.BoxGeometry (100,1,100),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
			);
		floor.position.y -= .4;
		floor.position.z += 55;
		floor.receiveShadow = true;
		floor.castShadow = true;
		scene.add(floor);

	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshBasicMaterial ({color: 0x000000, wireframe: false})
		);
	mesh.position.y += 1;
	scene.add(mesh);

	meshFloor = new THREE.Mesh(
			new THREE.PlaneGeometry (250,225, 9, 9),
			new THREE.MeshBasicMaterial({ color: 0xff9999, wireframe: false})
		);
	meshFloor.rotation.x -= Math.PI / 2;
	scene.add(meshFloor);


// LIGHTS
	ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 1, 100);
	light.position.set(0,6,50);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 100;
	scene.add(light);

	homeLight = new THREE.PointLight(0xffff33, 0.9, 20);
	homeLight.position.set(0,6,0);
	homeLight.castShadow = true;
	homeLight.shadow.camera.near = 0.1;
	homeLight.shadow.camera.far = 25;
	scene.add(homeLight);

	camera.position.set (0,player.height,-5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setClearColor( 0x000000, 0 );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	animate();
}


function animate(){
	requestAnimationFrame(animate);


	if (keyboard[87]){//W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}

	if (keyboard[83]){//S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}

	if (keyboard[65]){//A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}

	if (keyboard[68]){//D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}

	if (keyboard[37]){//left arrow key
		camera.rotation.y -= player.turnSpeed;
	}

	if (keyboard[39]){//right arrow key
		camera.rotation.y += player.turnSpeed;
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