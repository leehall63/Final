var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;


var keyboard = {};
var player = { 
height:3, 
speed:0.5, 
turnSpeed:Math.PI*0.01,
}; //player attributes

var loadingScreen = {
	scene: new THREE.Scene (),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 90),
	box: new THREE.Mesh (
		new THREE.BoxGeometry (0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({color: 0x4444ff})
		)
};

var LOADING_MANAGER = null;
var RESOURCES_LOADED = false;

function init() {

	scene = new THREE.Scene(); 
	scene.background = new THREE.Color( 0x8CD9FF );
	camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.5, 500);

	loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};

	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};

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

	var textureLoader = new THREE.TextureLoader ();
		whiteTexture = new textureLoader.load ("images/brick.jpg");
//create front walls
	//create first white wall
		whiteWall1 = new THREE.Mesh (
				new THREE.BoxGeometry (47,20,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, map: whiteTexture, wireframe:false}) 
				);
			whiteWall1.position.x += 27;
			whiteWall1.position.z += 5;
			whiteWall1.receiveShadow = true;
			whiteWall1.castShadow = true;
			scene.add(whiteWall1);

	//create second white wall
		whiteWall2 = new THREE.Mesh (
				new THREE.BoxGeometry (47,20,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, map: whiteTexture, wireframe:false}) 
				);
			whiteWall2.position.x -= 27;
			whiteWall2.position.z += 5;
			whiteWall2.receiveShadow = true;
			whiteWall2.castShadow = true;
			scene.add(whiteWall2);

	//create top of door frame for white wall
		whiteWall3 = new THREE.Mesh (
				new THREE.BoxGeometry (25,4,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, map: whiteTexture, wireframe:false}) 
				);
			whiteWall3.position.y += 8;
			whiteWall3.position.z += 5;
			whiteWall3.receiveShadow = true;
			whiteWall3.castShadow = true;
			scene.add(whiteWall3);

//create yellow wall
	rightWall = new THREE.Mesh (
			new THREE.BoxGeometry (1,20,100),
			new THREE.MeshPhongMaterial({color:0xffffff, map: whiteTexture, wireframe:false})
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

//create the grass floor
	grassTexture = new textureLoader.load ("models/textures/grass/Tree Top_COLOR.png");
	grassNormal = new textureLoader.load ("models/textures/grass/Tree Top_NRM.png");

	meshFloor = new THREE.Mesh(
			new THREE.PlaneGeometry(200,225,9,9), //9,9 = how many "segments" of the floor there are
			//more segments can mean more detail in some cases
			new THREE.MeshPhongMaterial({color:0x808080, map: grassTexture, normalMap: grassNormal, wireframe:false}) 
			/* try toggling the wireframes every so often to see the true geometry of things in the early stages*/
		);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
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

// MTL AND OBJ LOADERS
	//TREE 1
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.load ("models/Tree_02.mtl", function(materials){

			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);

			objLoader.load("models/Tree_02.obj", function(tree){
				tree.position.y += .5;
				tree.position.x += 50;
				tree.scale.set (5, 5, 5);
				scene.add( tree );

			});

		});

	//TREE 2
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.load ("models/Tree_02.mtl", function(materials){

			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);

			objLoader.load("models/Tree_02.obj", function(tree){
				tree.position.y += .5;
				tree.position.x -= 50;
				tree.scale.set (5, 5, 5);
				scene.add( tree );

			});

		});

	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	animate();

}

function animate(){

	// Play the loading screen until resources are loaded.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}

	requestAnimationFrame(animate);

	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	
	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

/* Notes*/
/* MeshBasicMaterial vs. MeshPhongMaterial - Basic does not react to light, but Phong does.*/