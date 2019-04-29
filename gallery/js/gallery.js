var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = {
	height:3,
	speed: 0.5,
	turnSpeed: Math.PI*0.01
}
var USE_WIREFRAME = false;

var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera (90, window.innerWidth/window.innerHeight, 0.5, 500),
	box: new THREE.Mesh (
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({color: 0x4444ff})
		)
};

var models = {
	tree:{
		obj:"models/Tree_02.obj", 
		mtl:"models/Tree_02.mtl", 
		mesh: null
	}
};

var LOADING_MANAGER = null;
var RESOURCES_LOADED = false;

//Meshes Index
var meshes = {};

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
	camera = new THREE.PerspectiveCamera (90, window.innerWidth/window.innerHeight, 0.5, 500);

	loadingScreen.box.position.set (0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);

	loadingManager = new THREE.LoadingManager();

	loadingManager.onProgress = function (item, loaded, total){
		console.log(item, loaded, total);
	};

	loadingManager.onLoad = function() {
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};

	// if (main.temp > 75) {
	// 	scene.background = new THREE.Color( 0xDB0300 );
	// } else {
	// 	scene.background = new THREE.Color( 0x8CD9FF );
	// };

//create left wall
	leftWall = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,100),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false}) 
		);
	leftWall.position.x += 50;
	leftWall.position.z += 55;
	leftWall.receiveShadow = true;
	leftWall.castShadow = true;
	scene.add(leftWall);

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

//create right wall
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
			new THREE.BoxGeometry (101,20,1),
			new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false})
			);
		blueWall.position.z += 105;
		blueWall.receiveShadow = true;
		blueWall.castShadow = true;
		scene.add(blueWall);

//create HOME section
	//HOME Left Wall
		homeLeftdoor1 = new THREE.Mesh (
			new THREE.BoxGeometry (0.1,20,12),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeLeftdoor1.position.x += 19.5;
		homeLeftdoor1.position.z += 29;
		homeLeftdoor1.receiveShadow = true;
		homeLeftdoor1.castShadow = true;
		scene.add(homeLeftdoor1);

		homeLeftdoor2 = new THREE.Mesh (
			new THREE.BoxGeometry (0.1,20,12),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeLeftdoor2.position.x += 19.5;
		homeLeftdoor2.position.z += 11;
		homeLeftdoor2.receiveShadow = true;
		homeLeftdoor2.castShadow = true;
		scene.add(homeLeftdoor2);

		homeLeftdoorframe = new THREE.Mesh (
			new THREE.BoxGeometry (0.1,5,10),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeLeftdoorframe.position.x += 19.5;
		homeLeftdoorframe.position.z += 20;
		homeLeftdoorframe.position.y += 8;
		homeLeftdoorframe.receiveShadow = true;
		homeLeftdoorframe.castShadow = true;
		scene.add(homeLeftdoorframe);

	//HOME Right Wall
		homeRightdoor1 = new THREE.Mesh (
			new THREE.BoxGeometry (0.1,20,12),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeRightdoor1.position.x -= 19.5;
		homeRightdoor1.position.z += 29;
		homeRightdoor1.receiveShadow = true;
		homeRightdoor1.castShadow = true;
		scene.add(homeRightdoor1);

		homeRightdoor2 = new THREE.Mesh (
			new THREE.BoxGeometry (0.1,20,12),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeRightdoor2.position.x -= 19.5;
		homeRightdoor2.position.z += 11;
		homeRightdoor2.receiveShadow = true;
		homeRightdoor2.castShadow = true;
		scene.add(homeRightdoor2);

		homeRightdoorframe = new THREE.Mesh (
			new THREE.BoxGeometry (0.1,5,10),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeRightdoorframe.position.x -= 19.5;
		homeRightdoorframe.position.z += 20;
		homeRightdoorframe.position.y += 8;
		homeRightdoorframe.receiveShadow = true;
		homeRightdoorframe.castShadow = true;
		scene.add(homeRightdoorframe);

	//HOME Back Wall
		homeRightdoor1 = new THREE.Mesh (
			new THREE.BoxGeometry (16,20,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeRightdoor1.position.x += 12;
		homeRightdoor1.position.z += 34.5;
		homeRightdoor1.receiveShadow = true;
		homeRightdoor1.castShadow = true;
		scene.add(homeRightdoor1);

		homeRightdoor2 = new THREE.Mesh (
			new THREE.BoxGeometry (16,20,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeRightdoor2.position.x -= 12;
		homeRightdoor2.position.z += 34.5;
		homeRightdoor2.receiveShadow = true;
		homeRightdoor2.castShadow = true;
		scene.add(homeRightdoor2);

		homeRightdoorframe = new THREE.Mesh (
			new THREE.BoxGeometry (10,6,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeRightdoorframe.position.x = 0;
		homeRightdoorframe.position.z += 34.5;
		homeRightdoorframe.position.y += 8;
		homeRightdoorframe.receiveShadow = true;
		homeRightdoorframe.castShadow = true;
		scene.add(homeRightdoorframe);

//create ABOUT ME section
	aboutDoor2 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false}) 
		);
	aboutDoor2.position.x += 20;
	aboutDoor2.position.z += 29;
	aboutDoor2.receiveShadow = true;
	aboutDoor2.castShadow = true;
	scene.add(aboutDoor2);

	aboutDoor1 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false}) 
		);
	aboutDoor1.position.x += 20;
	aboutDoor1.position.z += 11;
	aboutDoor1.receiveShadow = true;
	aboutDoor1.castShadow = true;
	scene.add(aboutDoor1);

	aboutFrame = new THREE.Mesh (
		new THREE.BoxGeometry (1,5,10),
		new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false}) 
		);
	aboutFrame.position.x += 20;
	aboutFrame.position.z += 20;
	aboutFrame.position.y += 8;
	aboutFrame.receiveShadow = true;
	aboutFrame.castShadow = true;
	scene.add(aboutFrame);

	aboutBack = new THREE.Mesh (
		new THREE.BoxGeometry (0.5,20,30),
		new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false}) 
		);
	aboutBack.position.x += 49;
	aboutBack.position.z += 20;
	aboutBack.receiveShadow = true;
	aboutBack.castShadow = true;
	scene.add(aboutBack);

	aboutLeft = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false}) 
		);
	aboutLeft.position.x += 35;
	aboutLeft.position.z += 6;
	aboutLeft.receiveShadow = true;
	aboutLeft.castShadow = true;
	scene.add(aboutLeft);

	aboutRight = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false}) 
		);
	aboutRight.position.x += 35;
	aboutRight.position.z += 34;
	aboutRight.receiveShadow = true;
	aboutRight.castShadow = true;
	scene.add(aboutRight);

	aboutCeiling = new THREE.Mesh (
			new THREE.BoxGeometry (30,0.5,30),
			new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false})
			);
		aboutCeiling.position.y += 9.5;
		aboutCeiling.position.z += 20;
		aboutCeiling.position.x += 35;
		aboutCeiling.receiveShadow = true;
		aboutCeiling.castShadow = true;
		scene.add(aboutCeiling);

	aboutFloor = new THREE.Mesh (
			new THREE.BoxGeometry (30,1,30),
			new THREE.MeshPhongMaterial({color:0x772fe2, wireframe:false})
			);
		aboutFloor.position.y -= .3;
		aboutFloor.position.z += 20;
		aboutFloor.position.x += 35;
		aboutFloor.receiveShadow = true;
		aboutFloor.castShadow = true;
		scene.add(aboutFloor);

//create INTERACTIVE section
	interactDoor2 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false}) 
		);
	interactDoor2.position.x -= 20;
	interactDoor2.position.z += 29;
	interactDoor2.receiveShadow = true;
	interactDoor2.castShadow = true;
	scene.add(interactDoor2);

	interactDoor1 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false}) 
		);
	interactDoor1.position.x -= 20;
	interactDoor1.position.z += 11;
	interactDoor1.receiveShadow = true;
	interactDoor1.castShadow = true;
	scene.add(interactDoor1);

	interactFrame = new THREE.Mesh (
		new THREE.BoxGeometry (1,5,10),
		new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false}) 
		);
	interactFrame.position.x -= 20;
	interactFrame.position.z += 20;
	interactFrame.position.y += 8;
	interactFrame.receiveShadow = true;
	interactFrame.castShadow = true;
	scene.add(interactFrame);

	interactBack = new THREE.Mesh (
		new THREE.BoxGeometry (0.5,20,30),
		new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false}) 
		);
	interactBack.position.x -= 49;
	interactBack.position.z += 20;
	interactBack.receiveShadow = true;
	interactBack.castShadow = true;
	scene.add(interactBack);

	interactLeft = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false}) 
		);
	interactLeft.position.x -= 35;
	interactLeft.position.z += 6;
	interactLeft.receiveShadow = true;
	interactLeft.castShadow = true;
	scene.add(interactLeft);

	interactRight = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false}) 
		);
	interactRight.position.x -= 35;
	interactRight.position.z += 34;
	interactRight.receiveShadow = true;
	interactRight.castShadow = true;
	scene.add(interactRight);

	interactCeiling = new THREE.Mesh (
			new THREE.BoxGeometry (30,0.5,30),
			new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false})
			);
		interactCeiling.position.y += 9.5;
		interactCeiling.position.z += 20;
		interactCeiling.position.x -= 35;
		interactCeiling.receiveShadow = true;
		interactCeiling.castShadow = true;
		scene.add(interactCeiling);

	interactFloor = new THREE.Mesh (
			new THREE.BoxGeometry (30,1,30),
			new THREE.MeshPhongMaterial({color:0xffb6ad, wireframe:false})
			);
		interactFloor.position.y -= .3;
		interactFloor.position.z += 20;
		interactFloor.position.x -= 35;
		interactFloor.receiveShadow = true;
		interactFloor.castShadow = true;
		scene.add(interactFloor);


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
			new THREE.BoxGeometry (101,1,101),
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

	meshFloor = new THREE.Mesh(
			new THREE.PlaneGeometry (250,225, 9, 9),
			new THREE.MeshPhongMaterial({ color: 0xff9999, wireframe: false})
		);
	meshFloor.receiveShadow = true;
	meshFloor.rotation.x -= Math.PI / 2;
	scene.add(meshFloor);


// Model/Material Loader

	// var mtlLoader = new THREE.MTLLoader(loadingManager);
	// mtlLoader.load("models/Tree_02.mtl", function(materials){

	// 	materials.preload();
	// 	var objLoader = new THREE.OBJLoader(loadingManager);
	// 	objLoader.setMaterials(materials);

	// 	objLoader.load("models/Tree_02.obj", function(mesh){

	// 		mesh.traverse(function(node){
	// 		if ( node instanceof THREE.Mesh){
	// 			node.castShadow = true;
	// 			node.receiveShadow = true;
	// 		}
	// 	});

	// 		mesh.position.set (50, 1, 3);
	// 		mesh.scale.set(3,3,3);
	// 		scene.add(mesh);

	// 	});

	// });

	//load models!
	for ( var _key in models){
		(function(key){

			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				var objLoader = new THREE.OBJLoader(loadingManager);
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){


					mesh.traverse(function(node){
						if ( node instanceof THREE.Mesh ){
							node.castShadow = true;
							node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;

				});
			});

		})(_key);
	}

// LIGHTS

	ambientLight = new THREE.AmbientLight(0x999999, 0.8);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 1,20);
	light.position.set(0,6,50);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

//HOME Light
	homeLight = new THREE.PointLight(0xffffff, 0.9,20);
	homeLight.position.set(0,6,20);
	homeLight.castShadow = true;
	homeLight.shadow.camera.near = 0.1;
	homeLight.shadow.camera.far = 25;
	scene.add(homeLight);
//ABOUT Light
	aboutLight = new THREE.PointLight(0xffffff, 0.5,20);
	aboutLight.position.set(35,6,20);
	aboutLight.castShadow = true;
	aboutLight.shadow.camera.near = 0.1;
	aboutLight.shadow.camera.far = 25;
	scene.add(aboutLight);

//INTERACTIVE MEDIA Light
	interactLight = new THREE.PointLight(0xffffff, 0.5,20);
	interactLight.position.set(-35,6,20);
	interactLight.castShadow = true;
	interactLight.shadow.camera.near = 0.1;
	interactLight.shadow.camera.far = 25;
	scene.add(interactLight);

//FRONT DOOR Light
	frontLight = new THREE.PointLight(0xffff33, 0.9, 20);
	frontLight.position.set(0,6,0);
	frontLight.castShadow = true;
	frontLight.shadow.camera.near = 0.1;
	frontLight.shadow.camera.far = 25;
	scene.add(frontLight);

	camera.position.set (0,player.height,-5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setClearColor( 0x000000, 0 );
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	document.body.appendChild(renderer.domElement);

	animate();
}

// Runs when all resources are loaded
function onResourcesLoaded() {
	//clone models into meshes
	meshes["tree1"] = models.tree.mesh.clone();
	meshes["tree2"] = models.tree.mesh.clone();
	meshes["tree3"] = models.tree.mesh.clone();

	//reposition individual meshes
	meshes["tree1"].position.set (5, 0.5, -30);
	meshes["tree1"].scale.set(3,3,3);
	scene.add(meshes["tree1"]);

	meshes["tree2"].position.set (100, 0.5, 10);
	meshes["tree2"].scale.set(3,3,3);
	scene.add(meshes["tree2"]);

	meshes["tree3"].position.set (50, 0.5, -20);
	meshes["tree3"].scale.set(3,3,3);
	scene.add(meshes["tree3"]);
}



function animate(){

	if (RESOURCES_LOADED === false) {
		requestAnimationFrame(animate);
		renderer.render (loadingScreen.scene, loadingScreen.camera)

		return;
	}
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