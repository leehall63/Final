Physijs.scripts.worker = 'js/Physijs/physijs_worker.js';
Physijs.scripts.ammo = '/Physijs/examples/js/ammo.js';

var scene, camera, controls, renderer, mesh;
var meshFloor;
var video;

var profilePic,profiletexture;

var keyboard = {};
var player = {
	height:3,
	speed: 0.5,
	turnSpeed: Math.PI*0.01
}
var USE_WIREFRAME = false;

var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera (70, window.innerWidth/window.innerHeight, 0.5, 500),
	box: new Physijs.BoxMesh (
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({color: 0x4444ff})
		)
};

var objects = [];
var raycaster;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

var models = {
	tree:{
		obj:"models/Tree_02.obj", 
		mtl:"models/Tree_02.mtl", 
		mesh: null
	}
};

var textureLoader = new THREE.TextureLoader();

var LOADING_MANAGER = null;
var RESOURCES_LOADED = false;

//Meshes Index
var meshes = {};

exittexture = new textureLoader.load("../images/Exit Sign.png");

function instructionsRemove(id, className) {
  var element = document.getElementById(id);
  element.classList.add(className);
}

function init() {

	scene = new Physijs.Scene();
	scene.background = new THREE.Color (0x94ccf7)
	camera = new THREE.PerspectiveCamera (70, window.innerWidth/window.innerHeight, 0.5, 500);


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

//create MAIN GALLERY Frame
	//CONTENT
		mainsignTexture = new textureLoader.load("../images/main_gallery.png");

		mainSignbg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.05,3,13),
				new THREE.MeshBasicMaterial({map: mainsignTexture, wireframe:false, transparent: true}) 
				);
			mainSignbg.position.x = 0;
			mainSignbg.position.y += 7.5;
			mainSignbg.position.z += 4;
			mainSignbg.rotation.y += Math.PI/2;
			scene.add(mainSignbg);

		logoTexture = new textureLoader.load("../images/black_logo.png");

		logobg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,4,4),
				new THREE.MeshBasicMaterial({map: logoTexture, wireframe:false, transparent: true}) 
				);
			logobg.position.x += 5.5;
			logobg.position.y += 3.5;
			logobg.position.z += 4;
			logobg.rotation.y += Math.PI/2;
			scene.add(logobg);

	leftWall = new Physijs.BoxMesh (
		new THREE.BoxGeometry (1,20,100),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false}) 
		);
	leftWall.position.x += 50;
	leftWall.position.z += 55;
	leftWall.receiveShadow = true;
	leftWall.castShadow = true;
	scene.add(leftWall);

	//create first white wall
		whiteWall1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (47,20,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false}) 
				);
			whiteWall1.position.x += 27;
			whiteWall1.position.z += 5;
			whiteWall1.receiveShadow = true;
			whiteWall1.castShadow = true;
			scene.add(whiteWall1);

	//create second white wall
		whiteWall2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (47,20,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false}) 
				);
			whiteWall2.position.x -= 27;
			whiteWall2.position.z += 5;
			whiteWall2.receiveShadow = true;
			whiteWall2.castShadow = true;
			scene.add(whiteWall2);

	//create top of door frame for white wall
		whiteWall3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (25,4,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false}) 
				);
			whiteWall3.position.y += 8;
			whiteWall3.position.z += 5;
			whiteWall3.receiveShadow = true;
			whiteWall3.castShadow = true;
			scene.add(whiteWall3);

	//create right wall
		rightWall = new Physijs.BoxMesh (
				new THREE.BoxGeometry (1,20,100),
				new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
				);
			rightWall.position.x -= 50;
			rightWall.position.z += 55;
			rightWall.receiveShadow = true;
			rightWall.castShadow = true;
			scene.add(rightWall);

	//create blue wall
		blueWall = new Physijs.BoxMesh (
				new THREE.BoxGeometry (101,20,1),
				new THREE.MeshPhongMaterial({color:0xf0f0f0, wireframe:false})
				);
			blueWall.position.z += 105;
			blueWall.receiveShadow = true;
			blueWall.castShadow = true;
			scene.add(blueWall);

	//create ceiling
		ceiling = new Physijs.BoxMesh (
				new THREE.BoxGeometry (101,1,101),
				new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
				);
			ceiling.position.y += 10;
			ceiling.position.z += 55;
			ceiling.receiveShadow = true;
			ceiling.castShadow = true;
			scene.add(ceiling);


	//create the gallery floor
		floor = new Physijs.BoxMesh (
				new THREE.BoxGeometry (100,1,100),
				new THREE.MeshBasicMaterial({color:0xffffff, wireframe:false})
				);
			floor.position.y -= .4;
			floor.position.z += 55;
			floor.receiveShadow = true;
			floor.castShadow = true;
			scene.add(floor);

	//create the "grass"
		meshFloor = new THREE.Mesh(
				new THREE.PlaneGeometry (250,225, 9, 9),
				new THREE.MeshPhongMaterial({ color: 0x539e1a, wireframe: false})
			);
		meshFloor.receiveShadow = true;
		meshFloor.rotation.x -= Math.PI / 2;
		scene.add(meshFloor);

//create HOME section
	//CONTENT
		//BACK WALL
			hometexture1 = new textureLoader.load("../images/home/seattle tree.jpg");

			homePicback1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(11,8,0.2),
				new THREE.MeshBasicMaterial({ map: hometexture1, wireframe: false })
				);
				homePicback1.castShadow = true;
				homePicback1.position.x += 12;
				homePicback1.position.y += 4.7;
				homePicback1.position.z += 34.5;
				scene.add(homePicback1);

			hometexture2 = new textureLoader.load("../images/home/aquarium.jpg");

			homePicback2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(11,8,0.2),
				new THREE.MeshBasicMaterial({ map: hometexture2, wireframe: false })
				);
				homePicback2.castShadow = true;
				homePicback2.position.x -= 12;
				homePicback2.position.y += 4.7;
				homePicback2.position.z += 34.5;
				scene.add(homePicback2);

		//FRONT WALL
			hometexture3 = new textureLoader.load("../images/home/mcHenry.jpg");

			homePicfront1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(11,8,0.2),
				new THREE.MeshBasicMaterial({ map: hometexture3, wireframe: false })
				);
				homePicfront1.castShadow = true;
				homePicfront1.position.x += 12;
				homePicfront1.position.y += 4.7;
				homePicfront1.position.z += 6;
				scene.add(homePicfront1);

			hometexture4 = new textureLoader.load("../images/home/lanterns.jpg");

			homePicfront2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(11,8,0.2),
				new THREE.MeshBasicMaterial({ map:hometexture4, wireframe: false })
				);
				homePicfront2.castShadow = true;
				homePicfront2.position.x -= 12;
				homePicfront2.position.y += 4.7;
				homePicfront2.position.z += 6;
				scene.add(homePicfront2);

	//Exhibit Signs
		aboutSignbg = new Physijs.BoxMesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
			);
		aboutSignbg.position.x += 19.5;
		aboutSignbg.position.y += 6.5;
		aboutSignbg.position.z += 20;
		aboutSignbg.rotation.y += Math.PI/2;
		scene.add(aboutSignbg);

		aboutTexture = textureLoader.load ('../images/signs/about.png');

		aboutSign = new Physijs.BoxMesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshBasicMaterial({map: aboutTexture, wireframe:false, transparent: true}) 
			);
		aboutSign.position.x += 19.5;
		aboutSign.position.y += 6.5;
		aboutSign.position.z += 20;
		aboutSign.rotation.y += Math.PI/2;
		scene.add(aboutSign);

		interactiveSignbg = new Physijs.BoxMesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
			);
		interactiveSignbg.position.x -= 19.5;
		interactiveSignbg.position.y += 6.5;
		interactiveSignbg.position.z += 20;
		interactiveSignbg.rotation.y += Math.PI/2;
		scene.add(interactiveSignbg);

		interactiveTexture = textureLoader.load ('../images/signs/interactive-media.png');

		interactiveSign = new Physijs.BoxMesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshBasicMaterial({map: interactiveTexture, wireframe:false, transparent: true}) 
			);
		interactiveSign.position.x -= 19.5;
		interactiveSign.position.y += 6.5;
		interactiveSign.position.z += 20;
		interactiveSign.rotation.y += Math.PI/2;
		scene.add(interactiveSign);



		mediaSignbg = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.2,2,5),
			new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
			);
		mediaSignbg.position.x = 0;
		mediaSignbg.position.y += 6.5;
		mediaSignbg.position.z += 34.5;
		mediaSignbg.rotation.y += Math.PI/2;
		scene.add(mediaSignbg);

		mediaTexture = textureLoader.load ('../images/signs/media.png');

		mediaSign = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.2,2,5),
			new THREE.MeshBasicMaterial({map: mediaTexture, wireframe:false, transparent: true}) 
			);
		mediaSign.position.x = 0;
		mediaSign.position.y += 6.5;
		mediaSign.position.z += 34.5;
		mediaSign.rotation.y += Math.PI/2;
		scene.add(mediaSign);


	//WALLS
		//HOME Left Wall
			homeLeftdoor1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,20,12),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeLeftdoor1.position.x += 19.5;
			homeLeftdoor1.position.z += 29;
			homeLeftdoor1.receiveShadow = true;
			homeLeftdoor1.castShadow = true;
			scene.add(homeLeftdoor1);

			homeLeftdoor2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,20,12),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeLeftdoor2.position.x += 19.5;
			homeLeftdoor2.position.z += 11;
			homeLeftdoor2.receiveShadow = true;
			homeLeftdoor2.castShadow = true;
			scene.add(homeLeftdoor2);

			homeLeftdoorframe = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,5,10),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeLeftdoorframe.position.x += 19.5;
			homeLeftdoorframe.position.z += 20;
			homeLeftdoorframe.position.y += 8;
			homeLeftdoorframe.receiveShadow = true;
			homeLeftdoorframe.castShadow = true;
			scene.add(homeLeftdoorframe);

		//HOME Right Wall
			homeRightdoor1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,20,12),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeRightdoor1.position.x -= 19.5;
			homeRightdoor1.position.z += 29;
			homeRightdoor1.receiveShadow = true;
			homeRightdoor1.castShadow = true;
			scene.add(homeRightdoor1);

			homeRightdoor2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,20,12),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeRightdoor2.position.x -= 19.5;
			homeRightdoor2.position.z += 11;
			homeRightdoor2.receiveShadow = true;
			homeRightdoor2.castShadow = true;
			scene.add(homeRightdoor2);

			homeRightdoorframe = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,5,10),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeRightdoorframe.position.x -= 19.5;
			homeRightdoorframe.position.z += 20;
			homeRightdoorframe.position.y += 8;
			homeRightdoorframe.receiveShadow = true;
			homeRightdoorframe.castShadow = true;
			scene.add(homeRightdoorframe);

		//HOME Back Wall
			homeBackdoor1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (16,20,0.1),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeBackdoor1.position.x += 12;
			homeBackdoor1.position.z += 34.5;
			homeBackdoor1.receiveShadow = true;
			homeBackdoor1.castShadow = true;
			scene.add(homeBackdoor1);

			homeBackdoor2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (16,20,0.1),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeBackdoor2.position.x -= 12;
			homeBackdoor2.position.z += 34.5;
			homeBackdoor2.receiveShadow = true;
			homeBackdoor2.castShadow = true;
			scene.add(homeBackdoor2);

			homeBackdoorframe = new Physijs.BoxMesh (
				new THREE.BoxGeometry (10,6,0.1),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeBackdoorframe.position.x = 0;
			homeBackdoorframe.position.z += 34.5;
			homeBackdoorframe.position.y += 8;
			homeBackdoorframe.receiveShadow = true;
			homeBackdoorframe.castShadow = true;
			scene.add(homeBackdoorframe);

		//HOME Front Wall
			homeFrontdoor1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (17,20,0.1),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeFrontdoor1.position.x -= 12;
			homeFrontdoor1.position.z += 5.5;
			homeFrontdoor1.receiveShadow = true;
			homeFrontdoor1.castShadow = true;
			scene.add(homeFrontdoor1);

			homeFrontdoor2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (17,20,0.1),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeFrontdoor2.position.x += 12;
			homeFrontdoor2.position.z += 5.5;
			homeFrontdoor2.receiveShadow = true;
			homeFrontdoor2.castShadow = true;
			scene.add(homeFrontdoor2);

			homeFrontdoorframe = new Physijs.BoxMesh (
				new THREE.BoxGeometry (10,4,0.1),
				new THREE.MeshBasicMaterial({color:0x636363, wireframe:false}) 
				);
			homeFrontdoorframe.position.x = 0;
			homeFrontdoorframe.position.z += 5.5;
			homeFrontdoorframe.position.y += 8;
			homeFrontdoorframe.receiveShadow = true;
			homeFrontdoorframe.castShadow = true;
			scene.add(homeFrontdoorframe);

		//HOME Ceiling
			homeCeiling = new Physijs.BoxMesh (
				new THREE.BoxGeometry (40,0.5,30),
				new THREE.MeshBasicMaterial({color:0x444444, wireframe:false})
				);
			homeCeiling.position.y += 9.5;
			homeCeiling.position.z += 20;
			homeCeiling.position.x = 0;
			homeCeiling.receiveShadow = true;
			homeCeiling.castShadow = true;
			scene.add(homeCeiling);

		//HOME Floor
			homeFloor = new Physijs.BoxMesh (
				new THREE.BoxGeometry (40,0.5,30.7),
				new THREE.MeshBasicMaterial({color:0x444444, wireframe:false})
				);
			homeFloor.position.y -= 0.1;
			homeFloor.position.z += 20;
			homeFloor.position.x = 0;
			homeFloor.receiveShadow = true;
			homeFloor.castShadow = true;
			scene.add(homeFloor);

	//EXIT SIGN HOME
			exitHome = new Physijs.BoxMesh (
			new THREE.BoxGeometry(0.2,2,5),
			new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
			);
			exitHome.castShadow = true;
			exitHome.position.x = 0;
			exitHome.position.y += 7.1;
			exitHome.position.z += 5.6;
			exitHome.rotation.y += Math.PI/2;
			scene.add(exitHome);

			exitHomebg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			exitHomebg.position.x = 0;
			exitHomebg.position.y += 7.1;
			exitHomebg.position.z += 5.6;
			exitHomebg.rotation.y += Math.PI/2;
			scene.add(exitHomebg);

//create ABOUT ME section

	profiletexture = new textureLoader.load("../images/Edited Headshot-1.jpg");

	profilePic = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,8,12),
	new THREE.MeshBasicMaterial({ map: profiletexture, wireframe: false })
	);
	profilePic.castShadow = true;
	profilePic.position.x += 48.5;
	profilePic.position.y += 4.6;
	profilePic.position.z += 13.5;
	scene.add(profilePic);

	bioTexture = textureLoader.load ('../images/about/Biography.png');
	biographyBg = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,8,9),
	new THREE.MeshBasicMaterial({ map: bioTexture, wireframe: false })
	);
	biographyBg.castShadow = true;
	biographyBg.position.x += 48.5;
	biographyBg.position.y += 4.6;
	biographyBg.position.z += 27;
	scene.add(biographyBg);

	contacttexture = new textureLoader.load("../images/camera.jpg");

	contactPic = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,7,10),
	new THREE.MeshBasicMaterial({ map: contacttexture, wireframe: false })
	);
	contactPic.castShadow = true;
	contactPic.position.x += 25;
	contactPic.position.y += 4.6;
	contactPic.position.z += 6.5;
	contactPic.rotation.y += Math.PI/2;
	scene.add(contactPic);

	contactTexture = textureLoader.load ('../images/signs/contact.png');
	contactBg = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,2,7),
	new THREE.MeshBasicMaterial({ map: contactTexture, wireframe: false })
	);
	contactBg.castShadow = true;
	contactBg.position.x += 35;
	contactBg.position.y += 7.7;
	contactBg.position.z += 6.5;
	contactBg.rotation.y += Math.PI/2;
	scene.add(contactBg);

	emailTexture = textureLoader.load ('../images/about/email.png');
	emailBg = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,2,8),
	new THREE.MeshBasicMaterial({ map: emailTexture, wireframe: false })
	);
	emailBg.castShadow = true;
	emailBg.position.x += 35;
	emailBg.position.y += 3.5;
	emailBg.position.z += 6.5;
	emailBg.rotation.y += Math.PI/2;
	scene.add(emailBg);

	twitterTexture = textureLoader.load ('../images/about/twitter.png');
	twitterBg = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,2.5,2.5),
	new THREE.MeshBasicMaterial({ map: twitterTexture, wireframe: false })
	);
	twitterBg.castShadow = true;
	twitterBg.position.x += 41;
	twitterBg.position.y += 6.5;
	twitterBg.position.z += 6.5;
	twitterBg.rotation.y += Math.PI/2;
	scene.add(twitterBg);

	ytTexture = textureLoader.load ('../images/about/youtube.png');
	ytBg = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,2.5,2.5),
	new THREE.MeshBasicMaterial({ map: ytTexture, wireframe: false })
	);
	ytBg.castShadow = true;
	ytBg.position.x += 41;
	ytBg.position.y += 3.5;
	ytBg.position.z += 6.5;
	ytBg.rotation.y += Math.PI/2;
	scene.add(ytBg);

	instaTexture = textureLoader.load ('../images/about/instagram.png');
	instaBg = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,2.5,2.5),
	new THREE.MeshBasicMaterial({ map: instaTexture, wireframe: false })
	);
	instaBg.castShadow = true;
	instaBg.position.x += 45;
	instaBg.position.y += 6.5;
	instaBg.position.z += 6.5;
	instaBg.rotation.y += Math.PI/2;
	scene.add(instaBg);

	linkedTexture = textureLoader.load ('../images/about/linkedin.png');
	linkedBg = new Physijs.BoxMesh (
	new THREE.BoxGeometry(0.2,2.5,2.5),
	new THREE.MeshBasicMaterial({ map: linkedTexture, wireframe: false })
	);
	linkedBg.castShadow = true;
	linkedBg.position.x += 45;
	linkedBg.position.y += 3.5;
	linkedBg.position.z += 6.5;
	linkedBg.rotation.y += Math.PI/2;
	scene.add(linkedBg);

	//RESUME WALL
		worktexture = new textureLoader.load("../images/Work.png");
		workBG = new Physijs.BoxMesh (
			new THREE.BoxGeometry (8,8,0.2),
			new THREE.MeshBasicMaterial({map: worktexture, wireframe:false}) 
			);
		workBG.position.x += 44;
		workBG.position.y += 4.6;
		workBG.position.z += 33;
		workBG.receiveShadow = true;
		workBG.castShadow = true;
		scene.add(workBG);

		educationtexture = new textureLoader.load("../images/Education.png");
		educationBG = new Physijs.BoxMesh (
			new THREE.BoxGeometry (7,4,0.2),
			new THREE.MeshBasicMaterial({map: educationtexture, wireframe:false}) 
			);
		educationBG.position.x += 35;
		educationBG.position.y += 6.8;
		educationBG.position.z += 33;
		educationBG.receiveShadow = true;
		educationBG.castShadow = true;
		scene.add(educationBG);

		skilltexture = new textureLoader.load("../images/Skills.png");
		extracurricularBG = new Physijs.BoxMesh (
			new THREE.BoxGeometry (9,4,0.2),
			new THREE.MeshBasicMaterial({map: skilltexture, wireframe:false}) 
			);
		extracurricularBG.position.x += 35;
		extracurricularBG.position.y += 2.5;
		extracurricularBG.position.z += 33;
		extracurricularBG.receiveShadow = true;
		extracurricularBG.castShadow = true;
		scene.add(extracurricularBG);

	//EXIT SIGN ABOUT

		exitAbout = new Physijs.BoxMesh (
		new THREE.BoxGeometry(5,2,0.2),
		new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
		);
		exitAbout.position.x += 20.5;
		exitAbout.position.y += 6.5;
		exitAbout.position.z += 20;
		exitAbout.rotation.y += Math.PI/2;
		scene.add(exitAbout);

		exitAboutbg = new Physijs.BoxMesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
			);
		exitAboutbg.position.x += 20.5;
		exitAboutbg.position.y += 6.5;
		exitAboutbg.position.z += 20;
		exitAboutbg.rotation.y += Math.PI/2;
		exitAboutbg.receiveShadow = true;
		exitAboutbg.castShadow = true;
		scene.add(exitAboutbg);

		exitLight1 = new THREE.PointLight(0xff0000, 0.2,10);
		exitLight1.position.set(21,5.5,20);
		exitLight1.shadow.camera.near = 0.1;
		exitLight1.shadow.camera.far = 25;
		scene.add(exitLight1);


	//ABOUT WALLS
		aboutDoor2 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,20,12),
			new THREE.MeshBasicMaterial({color:0x772fe2, wireframe:false}) 
			);
		aboutDoor2.position.x += 20;
		aboutDoor2.position.z += 29;
		aboutDoor2.receiveShadow = true;
		aboutDoor2.castShadow = true;
		scene.add(aboutDoor2);

		aboutDoor1 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,20,12),
			new THREE.MeshBasicMaterial({color:0x772fe2, wireframe:false}) 
			);
		aboutDoor1.position.x += 20;
		aboutDoor1.position.z += 11;
		aboutDoor1.receiveShadow = true;
		aboutDoor1.castShadow = true;
		scene.add(aboutDoor1);

		aboutFrame = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,5,10),
			new THREE.MeshBasicMaterial({color:0x772fe2, wireframe:false}) 
			);
		aboutFrame.position.x += 20;
		aboutFrame.position.z += 20;
		aboutFrame.position.y += 8;
		aboutFrame.receiveShadow = true;
		aboutFrame.castShadow = true;
		scene.add(aboutFrame);

		aboutBack = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.5,20,30),
			new THREE.MeshBasicMaterial({color:0x772fe2, wireframe:false}) 
			);
		aboutBack.position.x += 49;
		aboutBack.position.z += 20;
		aboutBack.receiveShadow = true;
		aboutBack.castShadow = true;
		scene.add(aboutBack);

		aboutLeft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (30,20,0.5),
			new THREE.MeshBasicMaterial({color:0x772fe2, wireframe:false}) 
			);
		aboutLeft.position.x += 35;
		aboutLeft.position.z += 6;
		aboutLeft.receiveShadow = true;
		aboutLeft.castShadow = true;
		scene.add(aboutLeft);

		aboutRight = new Physijs.BoxMesh (
			new THREE.BoxGeometry (30,20,0.5),
			new THREE.MeshBasicMaterial({color:0x772fe2, wireframe:false}) 
			);
		aboutRight.position.x += 35;
		aboutRight.position.z += 34;
		aboutRight.receiveShadow = true;
		aboutRight.castShadow = true;
		scene.add(aboutRight);

		aboutCeiling = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,0.5,30),
				new THREE.MeshBasicMaterial({color:0x4e0893, wireframe:false})
				);
			aboutCeiling.position.y += 9.5;
			aboutCeiling.position.z += 20;
			aboutCeiling.position.x += 35;
			aboutCeiling.receiveShadow = true;
			aboutCeiling.castShadow = true;
			scene.add(aboutCeiling);

		aboutFloor = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,1,30),
				new THREE.MeshBasicMaterial({color:0x4e0893, wireframe:false})
				);
			aboutFloor.position.y -= .3;
			aboutFloor.position.z += 20;
			aboutFloor.position.x += 35;
			aboutFloor.receiveShadow = true;
			aboutFloor.castShadow = true;
			scene.add(aboutFloor);

//create MUSIC section
	//CONTENT
		//FRONT WALL
			//POLYLANE (BACK WALL)

				// create an AudioListener and add it to the camera
				var listener = new THREE.AudioListener();
				camera.add( listener );

				// create the PositionalAudio object (passing in the listener)
				var sunbreak = new THREE.PositionalAudio( listener );

				// load a sound and set it as the PositionalAudio object's buffer
				var audioLoader = new THREE.AudioLoader();
				audioLoader.load( 'sounds/Sunbreak-polylane.wav', function( buffer ) {
					sunbreak.setBuffer( buffer );
					sunbreak.setRefDistance( 0.1 );
					sunbreak.setMaxDistance( 0.1 );
					sunbreak.setLoop ( true );
					sunbreak.play();
				});

				polylane1texture = new textureLoader.load("../images/music/polylane-logo.png");

				polylane1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,6,9),
				new THREE.MeshBasicMaterial({ map:polylane1texture, wireframe: false })
				);
				polylane1.castShadow = true;
				polylane1.position.x -= 48.7;
				polylane1.position.y += 4.75
				polylane1.position.z += 51;
				scene.add(polylane1);

				polylane1.add(sunbreak);


				polylane2texture = new textureLoader.load("../images/music/Retrograde.png")

				polylane2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,7),
				new THREE.MeshBasicMaterial({ map:polylane2texture, wireframe: false })
				);
				polylane2.castShadow = true;
				polylane2.position.x -= 48.7;
				polylane2.position.y += 4.5;
				polylane2.position.z += 61;
				scene.add(polylane2);

				polylane3texture = new textureLoader.load("../images/music/Fullset.png");

				polylane3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,7),
				new THREE.MeshBasicMaterial({ map: polylane3texture, wireframe: false })
				);
				polylane3.castShadow = true;
				polylane3.position.x -= 48.7;
				polylane3.position.y += 4.5;
				polylane3.position.z += 41;
				scene.add(polylane3);

			//TSBU (LEFT WALL)
				bandcamptexture = new textureLoader.load("../images/music/bandcamp.png");

				tsbuDemo1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,9,0.2),
				new THREE.MeshBasicMaterial({map: bandcamptexture, wireframe: false })
				);
				tsbuDemo1.castShadow = true;
				tsbuDemo1.position.x -= 25;
				tsbuDemo1.position.y += 4.7;
				tsbuDemo1.position.z += 64.5;
				scene.add(tsbuDemo1);

				tsbuDemo2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,9,0.2),
				new THREE.MeshBasicMaterial({ map: bandcamptexture, wireframe: false })
				);
				tsbuDemo2.castShadow = true;
				tsbuDemo2.position.x -= 43;
				tsbuDemo2.position.y += 4.7;
				tsbuDemo2.position.z += 64.5;
				scene.add(tsbuDemo2);

			//RIGHT WALL
				drumtexture = new textureLoader.load("../images/music/drumsPic.jpg");

				drums1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: drumtexture, wireframe: false })
				);
				drums1.castShadow = true;
				drums1.position.x -= 35;
				drums1.position.y += 4.5;
				drums1.position.z += 36.5;
				scene.add(drums1);

				basstexture = new textureLoader.load("../images/music/bassPic.jpg");

				bass1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:basstexture, wireframe: false })
				);
				bass1.castShadow = true;
				bass1.position.x -= 45;
				bass1.position.y += 4.5;
				bass1.position.z += 36.5;
				scene.add(bass1);

				guitartexture = new textureLoader.load("../images/music/bass2.jpg");

				guitar1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:guitartexture, wireframe: false })
				);
				guitar1.castShadow = true;
				guitar1.position.x -= 25;
				guitar1.position.y += 4.5;
				guitar1.position.z += 36.5;
				scene.add(guitar1);
	
	//WALLS
		musicDoor1 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,20,12),
			new THREE.MeshBasicMaterial({color:0xa53d30, wireframe:false}) 
			);
		musicDoor1.position.x -= 20;
		musicDoor1.position.z += 40;
		musicDoor1.receiveShadow = true;
		musicDoor1.castShadow = true;
		scene.add(musicDoor1);

		musicDoor2 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,20,12),
			new THREE.MeshBasicMaterial({color:0xa53d30, wireframe:false}) 
			);
		musicDoor2.position.x -= 20;
		musicDoor2.position.z += 59.2;
		musicDoor2.receiveShadow = true;
		musicDoor2.castShadow = true;
		scene.add(musicDoor2);

		musicFrame = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,5,10),
			new THREE.MeshBasicMaterial({color:0xa53d30, wireframe:false}) 
			);
		musicFrame.position.x -= 20;
		musicFrame.position.z += 50;
		musicFrame.position.y += 8;
		musicFrame.receiveShadow = true;
		musicFrame.castShadow = true;
		scene.add(musicFrame);

		musicBack = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.5,20,30),
			new THREE.MeshBasicMaterial({color:0xa53d30, wireframe:false}) 
			);
		musicBack.position.x -= 49;
		musicBack.position.z += 50;
		musicBack.receiveShadow = true;
		musicBack.castShadow = true;
		scene.add(musicBack);

		musicLeft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (30,20,0.5),
			new THREE.MeshBasicMaterial({color:0xa53d30, wireframe:false}) 
			);
		musicLeft.position.x -= 35;
		musicLeft.position.z += 65;
		musicLeft.receiveShadow = true;
		musicLeft.castShadow = true;
		scene.add(musicLeft);

		musicRight = new Physijs.BoxMesh (
			new THREE.BoxGeometry (30,20,0.5),
			new THREE.MeshBasicMaterial({color:0xa53d30, wireframe:false}) 
			);
		musicRight.position.x -= 35;
		musicRight.position.z += 36;
		musicRight.receiveShadow = true;
		musicRight.castShadow = true;
		scene.add(musicRight);

		musicCeiling = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,0.5,30),
				new THREE.MeshBasicMaterial({color:0x772c22, wireframe:false})
				);
			musicCeiling.position.y += 9.5;
			musicCeiling.position.z += 50;
			musicCeiling.position.x -= 35;
			scene.add(musicCeiling);

		musicFloor = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,1,30),
				new THREE.MeshBasicMaterial({color:0x772c22, wireframe:false})
				);
			musicFloor.position.y -= .3;
			musicFloor.position.z += 50;
			musicFloor.position.x -= 35;
			scene.add(musicFloor);

		//EXIT SIGN MUSIC

			exitMusic = new Physijs.BoxMesh (
			new THREE.BoxGeometry(5,2,0.2),
			new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
			);
			exitMusic.position.x -= 20.5;
			exitMusic.position.y += 6.5;
			exitMusic.position.z += 49.5;
			exitMusic.rotation.y += Math.PI/2;
			scene.add(exitMusic);

			exitMusicbg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (5,2,0.2),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			exitMusicbg.position.x -= 20.5;
			exitMusicbg.position.y += 6.5;
			exitMusicbg.position.z += 49.5;
			exitMusicbg.rotation.y += Math.PI/2;
			scene.add(exitMusicbg);

//create INTERACTIVE Section

		interactDoor2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (1,20,12),
				new THREE.MeshBasicMaterial({color:0xffb6ad, wireframe:false}) 
				);
			interactDoor2.position.x -= 20;
			interactDoor2.position.z += 29;
			interactDoor2.receiveShadow = true;
			interactDoor2.castShadow = true;
			scene.add(interactDoor2);

			interactDoor1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (1,20,12),
				new THREE.MeshBasicMaterial({color:0xffb6ad, wireframe:false}) 
				);
			interactDoor1.position.x -= 20;
			interactDoor1.position.z += 11;
			interactDoor1.receiveShadow = true;
			interactDoor1.castShadow = true;
			scene.add(interactDoor1);

			interactFrame = new Physijs.BoxMesh (
				new THREE.BoxGeometry (1,5,10),
				new THREE.MeshBasicMaterial({color:0xffb6ad, wireframe:false}) 
				);
			interactFrame.position.x -= 20;
			interactFrame.position.z += 20;
			interactFrame.position.y += 8;
			interactFrame.receiveShadow = true;
			interactFrame.castShadow = true;
			scene.add(interactFrame);

			interactBack = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.5,20,30),
				new THREE.MeshBasicMaterial({color:0xffb6ad, wireframe:false}) 
				);
			interactBack.position.x -= 49;
			interactBack.position.z += 20;
			interactBack.receiveShadow = true;
			interactBack.castShadow = true;
			scene.add(interactBack);

			interactLeft = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,20,0.5),
				new THREE.MeshBasicMaterial({color:0xffb6ad, wireframe:false}) 
				);
			interactLeft.position.x -= 35;
			interactLeft.position.z += 6;
			interactLeft.receiveShadow = true;
			interactLeft.castShadow = true;
			scene.add(interactLeft);

			interactRight = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,20,0.5),
				new THREE.MeshBasicMaterial({color:0xffb6ad, wireframe:false}) 
				);
			interactRight.position.x -= 35;
			interactRight.position.z += 34;
			interactRight.receiveShadow = true;
			interactRight.castShadow = true;
			scene.add(interactRight);

			interactCeiling = new Physijs.BoxMesh (
					new THREE.BoxGeometry (30,0.5,30),
					new THREE.MeshBasicMaterial({color:0xd69991, wireframe:false})
					);
				interactCeiling.position.y += 9.5;
				interactCeiling.position.z += 20;
				interactCeiling.position.x -= 35;
				interactCeiling.receiveShadow = true;
				interactCeiling.castShadow = true;
				scene.add(interactCeiling);

			interactFloor = new Physijs.BoxMesh (
					new THREE.BoxGeometry (30,1,30),
					new THREE.MeshBasicMaterial({color:0xd69991, wireframe:false})
					);
				interactFloor.position.y -= .3;
				interactFloor.position.z += 20;
				interactFloor.position.x -= 35;
				interactFloor.receiveShadow = true;
				interactFloor.castShadow = true;
				scene.add(interactFloor);

			//EXIT SIGN INTERACT
				exitinteract = new Physijs.BoxMesh (
				new THREE.BoxGeometry(5,2,0.2),
				new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
				);
				exitinteract.castShadow = true;
				exitinteract.position.x -= 20.5;
				exitinteract.position.y += 6.5;
				exitinteract.position.z += 20;
				exitinteract.rotation.y += Math.PI/2;
				scene.add(exitinteract);

				exitInteractbg = new Physijs.BoxMesh (
					new THREE.BoxGeometry (5,2,0.2),
					new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
					);
				exitInteractbg.position.x -= 20.5;
				exitInteractbg.position.y += 6.5;
				exitInteractbg.position.z += 20;
				exitInteractbg.rotation.y += Math.PI/2;
				exitInteractbg.receiveShadow = true;
				exitInteractbg.castShadow = true;
				scene.add(exitInteractbg);

				exitLight2 = new THREE.PointLight(0xff0000, 0.,10);
				exitLight2.position.set(-21,5.5,20);
				exitLight2.shadow.camera.near = 0.1;
				exitLight2.shadow.camera.far = 25;
				scene.add(exitLight2);

//create PHOTO Section
	//CONTENT

		//LEFT WALL
			//TOP ROW
				gallery1texture = new textureLoader.load("../images/photo/gallery1.jpg");

				galleryPiclefttop1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery1texture, wireframe: false })
				);
				galleryPiclefttop1.castShadow = true;
				galleryPiclefttop1.position.x += 24;
				galleryPiclefttop1.position.y += 7;
				galleryPiclefttop1.position.z += 36.5;
				scene.add(galleryPiclefttop1);

				gallery2texture = new textureLoader.load("../images/photo/gallery2.jpg");

				galleryPiclefttop2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery2texture, wireframe: false })
				);
				galleryPiclefttop2.castShadow = true;
				galleryPiclefttop2.position.x += 31;
				galleryPiclefttop2.position.y += 7;
				galleryPiclefttop2.position.z += 36.5;
				scene.add(galleryPiclefttop2);

				gallery3texture = new textureLoader.load("../images/photo/gallery3.jpg");

				galleryPiclefttop3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery3texture, wireframe: false })
				);
				galleryPiclefttop3.castShadow = true;
				galleryPiclefttop3.position.x += 38;
				galleryPiclefttop3.position.y += 7;
				galleryPiclefttop3.position.z += 36.5;
				scene.add(galleryPiclefttop3);

				gallery4texture = new textureLoader.load("../images/photo/gallery4.jpg");

				galleryPiclefttop4 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery4texture, wireframe: false })
				);
				galleryPiclefttop4.castShadow = true;
				galleryPiclefttop4.position.x += 45;
				galleryPiclefttop4.position.y += 7;
				galleryPiclefttop4.position.z += 36.5;
				scene.add(galleryPiclefttop4);

			//BOTTOM ROW
				gallery5texture = new textureLoader.load("../images/photo/gallery5.jpg");

				galleryPicleftbottom1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery5texture, wireframe: false })
				);
				galleryPicleftbottom1.castShadow = true;
				galleryPicleftbottom1.position.x += 24;
				galleryPicleftbottom1.position.y += 2.5;
				galleryPicleftbottom1.position.z += 36.5;
				scene.add(galleryPicleftbottom1);

				gallery6texture = new textureLoader.load("../images/photo/gallery6.jpg");

				galleryPicleftbottom2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery6texture, wireframe: false })
				);
				galleryPicleftbottom2.castShadow = true;
				galleryPicleftbottom2.position.x += 31;
				galleryPicleftbottom2.position.y += 2.5;
				galleryPicleftbottom2.position.z += 36.5;
				scene.add(galleryPicleftbottom2);

				gallery7texture = new textureLoader.load("../images/photo/gallery7.jpg");

				galleryPicleftbottom3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery7texture, wireframe: false })
				);
				galleryPicleftbottom3.castShadow = true;
				galleryPicleftbottom3.position.x += 38;
				galleryPicleftbottom3.position.y += 2.5;
				galleryPicleftbottom3.position.z += 36.5;
				scene.add(galleryPicleftbottom3);

				gallery8texture = new textureLoader.load("../images/photo/gallery8.jpg");

				galleryPicleftbottom4 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery8texture, wireframe: false })
				);
				galleryPicleftbottom4.castShadow = true;
				galleryPicleftbottom4.position.x += 45;
				galleryPicleftbottom4.position.y += 2.5;
				galleryPicleftbottom4.position.z += 36.5;
				scene.add(galleryPicleftbottom4);

		//BACK WALL
			//TOP ROW
				gallery9texture = new textureLoader.load("../images/photo/gallery9.jpg");

				galleryPictop1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map:gallery9texture, wireframe: false })
				);
				galleryPictop1.castShadow = true;
				galleryPictop1.position.x += 48.5;
				galleryPictop1.position.y += 7;
				galleryPictop1.position.z += 40;
				scene.add(galleryPictop1);

				gallery10texture = new textureLoader.load("../images/photo/gallery10.jpg");

				galleryPictop2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map: gallery10texture, wireframe: false })
				);
				galleryPictop2.castShadow = true;
				galleryPictop2.position.x += 48.5;
				galleryPictop2.position.y += 7;
				galleryPictop2.position.z += 47;
				scene.add(galleryPictop2);

				gallery11texture = new textureLoader.load("../images/photo/gallery11.jpg");

				galleryPictop3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map: gallery11texture, wireframe: false })
				);
				galleryPictop3.castShadow = true;
				galleryPictop3.position.x += 48.5;
				galleryPictop3.position.y += 7;
				galleryPictop3.position.z += 54;
				scene.add(galleryPictop3);

				gallery12texture = new textureLoader.load("../images/photo/gallery12.jpg");

				galleryPictop4 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map: gallery12texture, wireframe: false })
				);
				galleryPictop4.castShadow = true;
				galleryPictop4.position.x += 48.5;
				galleryPictop4.position.y += 7;
				galleryPictop4.position.z += 61;
				scene.add(galleryPictop4);

			//BOTTOM ROW
				gallery13texture = new textureLoader.load("../images/photo/gallery13.jpg");

				galleryPicbottom1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map: gallery13texture, wireframe: false })
				);
				galleryPicbottom1.castShadow = true;
				galleryPicbottom1.position.x += 48.5;
				galleryPicbottom1.position.y += 2.5;
				galleryPicbottom1.position.z += 40;
				scene.add(galleryPicbottom1);

				gallery14texture = new textureLoader.load("../images/photo/gallery14.jpg");

				galleryPicbottom2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map:gallery14texture, wireframe: false })
				);
				galleryPicbottom2.castShadow = true;
				galleryPicbottom2.position.x += 48.5;
				galleryPicbottom2.position.y += 2.5;
				galleryPicbottom2.position.z += 47;
				scene.add(galleryPicbottom2);

				gallery15texture = new textureLoader.load("../images/photo/gallery15.jpg");

				galleryPicbottom3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map:gallery15texture, wireframe: false })
				);
				galleryPicbottom3.castShadow = true;
				galleryPicbottom3.position.x += 48.5;
				galleryPicbottom3.position.y += 2.5;
				galleryPicbottom3.position.z += 54;
				scene.add(galleryPicbottom3);

				gallery16texture = new textureLoader.load("../images/photo/gallery16.jpg");

				galleryPicbottom4 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map:gallery16texture, wireframe: false })
				);
				galleryPicbottom4.castShadow = true;
				galleryPicbottom4.position.x += 48.5;
				galleryPicbottom4.position.y += 2.5;
				galleryPicbottom4.position.z += 61;
				scene.add(galleryPicbottom4);

		//RIGHT WALL
			//TOP ROW
				gallery17texture = new textureLoader.load("../images/photo/gallery17.jpg");

				galleryPicrighttop1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery17texture, wireframe: false })
				);
				galleryPicrighttop1.castShadow = true;
				galleryPicrighttop1.position.x += 24;
				galleryPicrighttop1.position.y += 7;
				galleryPicrighttop1.position.z += 64.5;
				scene.add(galleryPicrighttop1);

				gallery18texture = new textureLoader.load("../images/photo/gallery18.jpg");

				galleryPicrighttop2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery18texture, wireframe: false })
				);
				galleryPicrighttop2.castShadow = true;
				galleryPicrighttop2.position.x += 31;
				galleryPicrighttop2.position.y += 7;
				galleryPicrighttop2.position.z += 64.5;
				scene.add(galleryPicrighttop2);

				gallery19texture = new textureLoader.load("../images/photo/gallery19.jpg");

				galleryPicrighttop3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery19texture, wireframe: false })
				);
				galleryPicrighttop3.castShadow = true;
				galleryPicrighttop3.position.x += 38;
				galleryPicrighttop3.position.y += 7;
				galleryPicrighttop3.position.z += 64.5;
				scene.add(galleryPicrighttop3);

				gallery20texture = new textureLoader.load("../images/photo/gallery20.jpg");

				galleryPicrighttop4 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery20texture, wireframe: false })
				);
				galleryPicrighttop4.castShadow = true;
				galleryPicrighttop4.position.x += 45;
				galleryPicrighttop4.position.y += 7;
				galleryPicrighttop4.position.z += 64.5;
				scene.add(galleryPicrighttop4);

			//BOTTOM ROW
				gallery21texture = new textureLoader.load("../images/photo/gallery21.jpg");

				galleryPicrightbottom1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery21texture, wireframe: false })
				);
				galleryPicrightbottom1.castShadow = true;
				galleryPicrightbottom1.position.x += 24;
				galleryPicrightbottom1.position.y += 2.5;
				galleryPicrightbottom1.position.z += 64.5;
				scene.add(galleryPicrightbottom1);

				gallery22texture = new textureLoader.load("../images/photo/gallery22.jpg");

				galleryPicrightbottom2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:gallery22texture, wireframe: false })
				);
				galleryPicrightbottom2.castShadow = true;
				galleryPicrightbottom2.position.x += 31;
				galleryPicrightbottom2.position.y += 2.5;
				galleryPicrightbottom2.position.z += 64.5;
				scene.add(galleryPicrightbottom2);

				gallery23texture = new textureLoader.load("../images/photo/gallery23.jpg");

				galleryPicrightbottom3 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery23texture, wireframe: false })
				);
				galleryPicrightbottom3.castShadow = true;
				galleryPicrightbottom3.position.x += 38;
				galleryPicrightbottom3.position.y += 2.5;
				galleryPicrightbottom3.position.z += 64.5;
				scene.add(galleryPicrightbottom3);

				gallery24texture = new textureLoader.load("../images/photo/gallery24.jpg");

				galleryPicrightbottom4 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: gallery24texture, wireframe: false })
				);
				galleryPicrightbottom4.castShadow = true;
				galleryPicrightbottom4.position.x += 45;
				galleryPicrightbottom4.position.y += 2.5;
				galleryPicrightbottom4.position.z += 64.5;
				scene.add(galleryPicrightbottom4);

		//FRONT WALL
			//TOP ROW
				galleryfront1texture = new textureLoader.load("../images/photo/front1.jpg");

				galleryPicfront1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,9,6),
				new THREE.MeshBasicMaterial({ map: galleryfront1texture, wireframe: false })
				);
				galleryPicfront1.castShadow = true;
				galleryPicfront1.position.x += 20.5;
				galleryPicfront1.position.y += 4.7;
				galleryPicfront1.position.z += 41;
				scene.add(galleryPicfront1);

				galleryfront2texture = new textureLoader.load("../images/photo/front2.jpg");

				galleryPicfront2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,9,6),
				new THREE.MeshBasicMaterial({ map: galleryfront2texture, wireframe: false })
				);
				galleryPicfront2.castShadow = true;
				galleryPicfront2.position.x += 20.5;
				galleryPicfront2.position.y += 4.7;
				galleryPicfront2.position.z += 59;
				scene.add(galleryPicfront2);

	//WALLS
		photoDoor1 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,20,12),
			new THREE.MeshBasicMaterial({color:0xd86b27, wireframe:false}) 
			);
		photoDoor1.position.x += 20;
		photoDoor1.position.z += 40;
		photoDoor1.receiveShadow = true;
		photoDoor1.castShadow = true;
		scene.add(photoDoor1);

		photoDoor2 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,20,12),
			new THREE.MeshBasicMaterial({color:0xd86b27, wireframe:false}) 
			);
		photoDoor2.position.x += 20;
		photoDoor2.position.z += 59.2;
		photoDoor2.receiveShadow = true;
		photoDoor2.castShadow = true;
		scene.add(photoDoor2);

		photoFrame = new Physijs.BoxMesh (
			new THREE.BoxGeometry (1,5,10),
			new THREE.MeshBasicMaterial({color:0xd86b27, wireframe:false}) 
			);
		photoFrame.position.x += 20;
		photoFrame.position.z += 50;
		photoFrame.position.y += 8;
		photoFrame.receiveShadow = true;
		photoFrame.castShadow = true;
		scene.add(photoFrame);

		photoBack = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.5,20,30),
			new THREE.MeshBasicMaterial({color:0xd86b27, wireframe:false}) 
			);
		photoBack.position.x += 49;
		photoBack.position.z += 50;
		photoBack.receiveShadow = true;
		photoBack.castShadow = true;
		scene.add(photoBack);

		photoLeft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (30,20,0.5),
			new THREE.MeshBasicMaterial({color:0xd86b27, wireframe:false}) 
			);
		photoLeft.position.x += 35;
		photoLeft.position.z += 65;
		photoLeft.receiveShadow = true;
		photoLeft.castShadow = true;
		scene.add(photoLeft);

		photoRight = new Physijs.BoxMesh (
			new THREE.BoxGeometry (30,20,0.5),
			new THREE.MeshBasicMaterial({color:0xd86b27, wireframe:false}) 
			);
		photoRight.position.x += 35;
		photoRight.position.z += 36;
		photoRight.receiveShadow = true;
		photoRight.castShadow = true;
		scene.add(photoRight);

		photoCeiling = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,0.5,30),
				new THREE.MeshBasicMaterial({color:0xb2571e, wireframe:false})
				);
			photoCeiling.position.y += 9.5;
			photoCeiling.position.z += 50;
			photoCeiling.position.x += 35;
			photoCeiling.receiveShadow = true;
			photoCeiling.castShadow = true;
			scene.add(photoCeiling);

		photoFloor = new Physijs.BoxMesh (
				new THREE.BoxGeometry (30,1,30),
				new THREE.MeshBasicMaterial({color:0xb2571e, wireframe:false})
				);
			photoFloor.position.y -= .3;
			photoFloor.position.z += 50;
			photoFloor.position.x += 35;
			photoFloor.receiveShadow = true;
			photoFloor.castShadow = true;
			scene.add(photoFloor);

		//EXIT SIGN PHOTO

			exitPhoto = new Physijs.BoxMesh (
			new THREE.BoxGeometry(5,2,0.2),
			new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
			);
			exitPhoto.position.x += 20.5;
			exitPhoto.position.y += 6.5;
			exitPhoto.position.z += 49.5;
			exitPhoto.rotation.y += Math.PI/2;
			scene.add(exitPhoto);

			exitPhotobg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (5,2,0.2),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			exitPhotobg.position.x += 20.5;
			exitPhotobg.position.y += 6.5;
			exitPhotobg.position.z += 49.5;
			exitPhotobg.rotation.y += Math.PI/2;
			scene.add(exitPhotobg);

//create PROJECTIONS Section
	//CONTENT
		// walwaVideo = document.getElementById( 'walwaVideo' );
		// walwaVideo.play();

		// walwaTexture = new THREE.VideoTexture( walwaVideo );

		walwa = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,8,14),
				new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false })
				);
				walwa.castShadow = true;
				walwa.position.x -= 48.5;
				walwa.position.y += 4.7;
				walwa.position.z += 83;
				scene.add(walwa);

			walwatexture1 = new textureLoader.load("../images/projections/projection-walwa1.jpg");

			walwaPictop1 = new Physijs.BoxMesh (
			new THREE.BoxGeometry(11.5,8.5,0.2),
			new THREE.MeshBasicMaterial({ map:walwatexture1, wireframe: false })
			);
			walwaPictop1.castShadow = true;
			walwaPictop1.position.x -= 20;
			walwaPictop1.position.y += 4.6;
			walwaPictop1.position.z += 66;
			scene.add(walwaPictop1);

			walwatexture6 = new textureLoader.load("../images/projections/projection-walwa6.jpg");

			walwaPic6 = new Physijs.BoxMesh (
			new THREE.BoxGeometry(12,8.5,0.2),
			new THREE.MeshBasicMaterial({ map:walwatexture6, wireframe: false })
			);
			walwaPic6.castShadow = true;
			walwaPic6.position.x -= 42;
			walwaPic6.position.y += 4.6;
			walwaPic6.position.z += 101.5;
			scene.add(walwaPic6);

			walwatexture3 = new textureLoader.load("../images/projections/projection-nd1.jpg");

			walwaPictop3 = new Physijs.BoxMesh (
			new THREE.BoxGeometry(12,8.5,0.2),
			new THREE.MeshBasicMaterial({ map:walwatexture3, wireframe: false })
			);
			walwaPictop3.castShadow = true;
			walwaPictop3.position.x -= 34;
			walwaPictop3.position.y += 4.6;
			walwaPictop3.position.z += 66;
			scene.add(walwaPictop3);

			walwatexture4 = new textureLoader.load("../images/projections/projection-walwa4.jpg");

			walwaPictop4 = new Physijs.BoxMesh (
			new THREE.BoxGeometry(5.5,8.5,0.2),
			new THREE.MeshBasicMaterial({ map:walwatexture4, wireframe: false })
			);
			walwaPictop4.castShadow = true;
			walwaPictop4.position.x -= 44;
			walwaPictop4.position.y += 4.6;
			walwaPictop4.position.z += 66;
			scene.add(walwaPictop4);

			walwatexture7 = new textureLoader.load("../images/projections/projection-walwa7.jpg");

			walwaPic7 = new Physijs.BoxMesh (
			new THREE.BoxGeometry(12,8.5,0.2),
			new THREE.MeshBasicMaterial({ map:walwatexture7, wireframe: false })
			);
			walwaPic7.castShadow = true;
			walwaPic7.position.x -= 25;
			walwaPic7.position.y += 4.6;
			walwaPic7.position.z += 101.5;
			scene.add(walwaPic7);

			scorchedTexture1 = new textureLoader.load("../images/projections/projection-scorched4.jpg");

			scorchedPic1 = new Physijs.BoxMesh (
			new THREE.BoxGeometry(12,8.5,0.2),
			new THREE.MeshBasicMaterial({ map:scorchedTexture1, wireframe: false })
			);
			scorchedPic1.castShadow = true;
			scorchedPic1.position.x -= 9;
			scorchedPic1.position.y += 4.6;
			scorchedPic1.position.z += 101.5;
			scene.add(scorchedPic1);

			rcsTexture1 = new textureLoader.load("../images/projections/projection2.jpg");
			rcs1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,8,20),
				new THREE.MeshBasicMaterial({map: rcsTexture1, wireframe: false })
				);
			rcs1.castShadow = true;
			rcs1.position.x -= 0.5;
			rcs1.position.y += 4.7;
			rcs1.position.z += 85;
			scene.add(rcs1);

	//WALLS
		projectionsDoorleft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (40,20,0.5),
			new THREE.MeshBasicMaterial({color:0x13b0db, wireframe:false}) 
			);
		projectionsDoorleft.position.x += 30;
		projectionsDoorleft.position.z += 65.5;
		projectionsDoorleft.receiveShadow = true;
		projectionsDoorleft.castShadow = true;
		scene.add(projectionsDoorleft);

		projectionsDoorright = new Physijs.BoxMesh (
			new THREE.BoxGeometry (3,20,0.5),
			new THREE.MeshBasicMaterial({color:0x13b0db, wireframe:false}) 
			);
		projectionsDoorright.position.x += 1;
		projectionsDoorright.position.z += 65.5;
		projectionsDoorright.receiveShadow = true;
		projectionsDoorright.castShadow = true;
		scene.add(projectionsDoorright);

		projectionsFrame = new Physijs.BoxMesh (
			new THREE.BoxGeometry (10,5,0.5),
			new THREE.MeshBasicMaterial({color:0x13b0db, wireframe:false}) 
			);
		projectionsFrame.position.y += 8;
		projectionsFrame.position.x += 5;
		projectionsFrame.position.z += 65.5;
		projectionsFrame.receiveShadow = true;
		projectionsFrame.castShadow = true;
		scene.add(projectionsFrame);

		projectionsBack = new Physijs.BoxMesh (
			new THREE.BoxGeometry (50,20,0.5),
			new THREE.MeshBasicMaterial({color:0x13b0db, wireframe:false}) 
			);
		projectionsBack.position.x += 25;
		projectionsBack.position.z += 102;
		projectionsBack.receiveShadow = true;
		projectionsBack.castShadow = true;
		scene.add(projectionsBack);

		projectionsLeft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.5,20,40),
			new THREE.MeshBasicMaterial({color:0x13b0db, wireframe:false}) 
			);
		projectionsLeft.position.x += 49;
		projectionsLeft.position.z += 85;
		projectionsLeft.receiveShadow = true;
		projectionsLeft.castShadow = true;
		scene.add(projectionsLeft);

		projectionsRight = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.5,20,39),
			new THREE.MeshBasicMaterial({color:0x13b0db, wireframe:false}) 
			);
		projectionsRight.position.x += 0.25;
		projectionsRight.position.z += 85;
		projectionsRight.receiveShadow = true;
		projectionsRight.castShadow = true;
		scene.add(projectionsRight);

		projectionsFloor = new Physijs.BoxMesh (
				new THREE.BoxGeometry (49,1,39),
				new THREE.MeshBasicMaterial({color:0x119dc4, wireframe:false})
				);
			projectionsFloor.position.y -= .3;
			projectionsFloor.position.z += 85;
			projectionsFloor.position.x += 25;
			projectionsFloor.receiveShadow = true;
			projectionsFloor.castShadow = true;
			scene.add(projectionsFloor);

		projectionsCeiling = new Physijs.BoxMesh (
				new THREE.BoxGeometry (49,1,39),
				new THREE.MeshBasicMaterial({color:0x119dc4, wireframe:false})
				);
			projectionsCeiling.position.y += 9.5;
			projectionsCeiling.position.z += 85;
			projectionsCeiling.position.x += 25;
			projectionsCeiling.receiveShadow = true;
			projectionsCeiling.castShadow = true;
			scene.add(projectionsCeiling);

		//EXIT SIGN PROJECTIONS
			exitProjections = new Physijs.BoxMesh (
			new THREE.BoxGeometry(0.2,2,5),
			new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
			);
			exitProjections.castShadow = true;
			exitProjections.position.x += 6.5;
			exitProjections.position.y += 6.5;
			exitProjections.position.z += 66;
			exitProjections.rotation.y += Math.PI/2;
			scene.add(exitProjections);

			exitProjectionsbg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			exitProjectionsbg.position.x += 6.5;
			exitProjectionsbg.position.y += 6.5;
			exitProjectionsbg.position.z += 66;
			exitProjectionsbg.rotation.y += Math.PI/2;
			exitProjectionsbg.receiveShadow = true;
			exitProjectionsbg.castShadow = true;
			scene.add(exitProjectionsbg);

//create VIDEO Section
	//CONTENT
		// playitbyearVideo = document.getElementById( 'Video' );
		// playitbyearVideo.play();

		// playitbyearTexture = new THREE.VideoTexture( playitbyearVideo );

		playitbyear = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,8,14),
				new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false })
				);
				playitbyear.castShadow = true;
				playitbyear.position.x += 48.5;
				playitbyear.position.y += 4.7;
				playitbyear.position.z += 80;
				scene.add(playitbyear);

	//WALLS
		videoDoorright = new Physijs.BoxMesh (
			new THREE.BoxGeometry (40,20,0.5),
			new THREE.MeshBasicMaterial({color:0x12e8bd, wireframe:false}) 
			);
		videoDoorright.position.x -= 30;
		videoDoorright.position.z += 65.5;
		videoDoorright.receiveShadow = true;
		videoDoorright.castShadow = true;
		scene.add(videoDoorright);

		videoDoorleft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (3,20,0.5),
			new THREE.MeshBasicMaterial({color:0x12e8bd, wireframe:false}) 
			);
		videoDoorleft.position.x -= 1;
		videoDoorleft.position.z += 65.5;
		videoDoorleft.receiveShadow = true;
		videoDoorleft.castShadow = true;
		scene.add(videoDoorleft);

		videoFrame = new Physijs.BoxMesh (
			new THREE.BoxGeometry (10,5,0.5),
			new THREE.MeshBasicMaterial({color:0x12e8bd, wireframe:false}) 
			);
		videoFrame.position.y += 8;
		videoFrame.position.x -= 5;
		videoFrame.position.z += 65.5;
		videoFrame.receiveShadow = true;
		videoFrame.castShadow = true;
		scene.add(videoFrame);

		videoBack = new Physijs.BoxMesh (
			new THREE.BoxGeometry (50,20,0.5),
			new THREE.MeshBasicMaterial({color:0x12e8bd, wireframe:false}) 
			);
		videoBack.position.x -= 25;
		videoBack.position.z += 102;
		videoBack.receiveShadow = true;
		videoBack.castShadow = true;
		scene.add(videoBack);

		videoLeft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.5,20,39),
			new THREE.MeshBasicMaterial({color:0x12e8bd, wireframe:false}) 
			);
		videoLeft.position.x -= 0.25;
		videoLeft.position.z += 85;
		videoLeft.receiveShadow = true;
		videoLeft.castShadow = true;
		scene.add(videoLeft);

		videoRight = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.5,20,39),
			new THREE.MeshBasicMaterial({color:0x12e8bd, wireframe:false}) 
			);
		videoRight.position.x -= 49;
		videoRight.position.z += 85;
		videoRight.receiveShadow = true;
		videoRight.castShadow = true;
		scene.add(videoRight);

		videoFloor = new Physijs.BoxMesh (
				new THREE.BoxGeometry (49,1,39),
				new THREE.MeshBasicMaterial({color:0x0dc6a1, wireframe:false})
				);
			videoFloor.position.y -= .3;
			videoFloor.position.z += 85;
			videoFloor.position.x -= 25;
			videoFloor.receiveShadow = true;
			videoFloor.castShadow = true;
			scene.add(videoFloor);

		videoCeiling = new Physijs.BoxMesh (
				new THREE.BoxGeometry (49,1,39),
				new THREE.MeshBasicMaterial({color:0x0dc6a1, wireframe:false})
				);
			videoCeiling.position.y += 9.5;
			videoCeiling.position.z += 85;
			videoCeiling.position.x -= 25;
			videoCeiling.receiveShadow = true;
			videoCeiling.castShadow = true;
			scene.add(videoCeiling);

		//EXIT SIGN VIDEO
			exitVideo = new Physijs.BoxMesh (
			new THREE.BoxGeometry(0.2,2,5),
			new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
			);
			exitVideo.castShadow = true;
			exitVideo.position.x -= 6.5;
			exitVideo.position.y += 6.5;
			exitVideo.position.z += 66;
			exitVideo.rotation.y += Math.PI/2;
			scene.add(exitVideo);

			exitVideobg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			exitVideobg.position.x -= 6.5;
			exitVideobg.position.y += 6.5;
			exitVideobg.position.z += 66;
			exitVideobg.rotation.y += Math.PI/2;
			exitVideobg.receiveShadow = true;
			exitVideobg.castShadow = true;
			scene.add(exitVideobg);

//create MEDIA section
	//EXHIBIT SIGNS
		videoTitlebg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			videoTitlebg.position.x += 6.5;
			videoTitlebg.position.y += 6.5;
			videoTitlebg.position.z += 65;
			videoTitlebg.rotation.y += Math.PI/2;
			videoTitlebg.castShadow = true;
			scene.add(videoTitlebg);

		videoTexture = textureLoader.load ('../images/signs/videos.png');
		videoTitle = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({map: videoTexture, wireframe:false, transparent: true}) 
				);
			videoTitle.position.x += 6.5;
			videoTitle.position.y += 6.5;
			videoTitle.position.z += 65;
			videoTitle.rotation.y += Math.PI/2;
			videoTitle.castShadow = true;
			scene.add(videoTitle);



		projectionsTitlebg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			projectionsTitlebg.position.x -= 6.5;
			projectionsTitlebg.position.y += 6.5;
			projectionsTitlebg.position.z += 65;
			projectionsTitlebg.rotation.y += Math.PI/2;
			projectionsTitlebg.castShadow = true;
			scene.add(projectionsTitlebg);

		projectionsTexture = textureLoader.load ('../images/signs/projections.png');
		projectionsTitle = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({map: projectionsTexture, wireframe:false, transparent: true}) 
				);
			projectionsTitle.position.x -= 6.5;
			projectionsTitle.position.y += 6.5;
			projectionsTitle.position.z += 65;
			projectionsTitle.rotation.y += Math.PI/2;
			projectionsTitle.castShadow = true;
			scene.add(projectionsTitle);


		photoTitlebg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (5,2,0.2),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			photoTitlebg.position.x += 19.5;
			photoTitlebg.position.y += 6.5;
			photoTitlebg.position.z += 49.5;
			photoTitlebg.rotation.y += Math.PI/2;
			photoTitlebg.castShadow = true;
			scene.add(photoTitlebg);

		photoTexture = textureLoader.load ('../images/signs/photography.png');
		photoTitle = new Physijs.BoxMesh (
				new THREE.BoxGeometry (5,2,0.2),
				new THREE.MeshBasicMaterial({map: photoTexture, wireframe:false, transparent: true}) 
				);
			photoTitle.position.x += 19.5;
			photoTitle.position.y += 6.5;
			photoTitle.position.z += 49.5;
			photoTitle.rotation.y += Math.PI/2;
			photoTitle.castShadow = true;
			scene.add(photoTitle);

		musicTitlebg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (5,2,0.2),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			musicTitlebg.position.x -= 19.5;
			musicTitlebg.position.y += 6.5;
			musicTitlebg.position.z += 49.5;
			musicTitlebg.rotation.y += Math.PI/2;
			musicTitlebg.castShadow = true;
			scene.add(musicTitlebg);

		musicTexture = textureLoader.load ('../images/signs/music.png');
		musicTitle = new Physijs.BoxMesh (
				new THREE.BoxGeometry (5,2,0.2),
				new THREE.MeshBasicMaterial({map: musicTexture, wireframe:false, transparent: true}) 
				);
			musicTitle.position.x -= 19.5;
			musicTitle.position.y += 6.5;
			musicTitle.position.z += 49.5;
			musicTitle.rotation.y += Math.PI/2;
			musicTitle.castShadow = true;
			scene.add(musicTitle);

	//CONTENT
		//BACK WALL
			media1texture = new textureLoader.load("../images/media/pic1.jpg");

			mediaPicback1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: media1texture, wireframe: false })
				);
				mediaPicback1.castShadow = true;
				mediaPicback1.position.x += 15;
				mediaPicback1.position.y += 4;
				mediaPicback1.position.z += 65;
				scene.add(mediaPicback1);

			media2texture = new textureLoader.load("../images/media/pic2.jpg");

			mediaPicback2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map:media2texture, wireframe: false })
				);
				mediaPicback2.castShadow = true;
				mediaPicback2.position.x -= 15;
				mediaPicback2.position.y += 4;
				mediaPicback2.position.z += 65;
				scene.add(mediaPicback2);

		//FRONT WALL
			media3texture = new textureLoader.load("../images/media/pic3.jpg");

			mediaPicfront1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: media3texture, wireframe: false })
				);
				mediaPicfront1.castShadow = true;
				mediaPicfront1.position.x += 12;
				mediaPicfront1.position.y += 4;
				mediaPicfront1.position.z += 35.5;
				scene.add(mediaPicfront1);

			media4texture = new textureLoader.load("../images/media/pic4.jpg");

			mediaPicfront2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(6,4,0.2),
				new THREE.MeshBasicMaterial({ map: media4texture, wireframe: false })
				);
				mediaPicfront2.castShadow = true;
				mediaPicfront2.position.x -= 12;
				mediaPicfront2.position.y += 4;
				mediaPicfront2.position.z += 35.5;
				scene.add(mediaPicfront2);

		//LEFT WALL
			media5texture = new textureLoader.load("../images/media/pic5.jpg");

			mediaPicleft1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map: media5texture, wireframe: false })
				);
				mediaPicleft1.castShadow = true;
				mediaPicleft1.position.x += 19.4;
				mediaPicleft1.position.y += 4;
				mediaPicleft1.position.z += 40;
				scene.add(mediaPicleft1);

			media6texture = new textureLoader.load("../images/media/pic6.jpg");

			mediaPicleft2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map:media6texture, wireframe: false })
				);
				mediaPicleft2.castShadow = true;
				mediaPicleft2.position.x += 19.4;
				mediaPicleft2.position.y += 4;
				mediaPicleft2.position.z += 60;
				scene.add(mediaPicleft2);

		//RIGHT WALL
			media7texture = new textureLoader.load("../images/media/pic7.JPG");

			mediaPicright1 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map:media7texture, wireframe: false })
				);
				mediaPicright1.castShadow = true;
				mediaPicright1.position.x -= 19;
				mediaPicright1.position.y += 4;
				mediaPicright1.position.z += 40;
				scene.add(mediaPicright1);

			media8texture = new textureLoader.load("../images/media/pic8.JPG");

			mediaPicright2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry(0.2,4,6),
				new THREE.MeshBasicMaterial({ map:media8texture, wireframe: false })
				);
				mediaPicright2.castShadow = true;
				mediaPicright2.position.x -= 19;
				mediaPicright2.position.y += 4;
				mediaPicright2.position.z += 60;
				scene.add(mediaPicright2);

	//WALLS
		//create first media wall
			mediaDoor1 = new Physijs.BoxMesh (
					new THREE.BoxGeometry (46,20,1),
					new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
					);
				mediaDoor1.position.x += 27;
				mediaDoor1.position.z += 35;
				mediaDoor1.receiveShadow = true;
				mediaDoor1.castShadow = true;
				scene.add(mediaDoor1);

		//create second media wall
			mediaDoor2 = new Physijs.BoxMesh (
					new THREE.BoxGeometry (46,20,1),
					new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
					);
				mediaDoor2.position.x -= 27;
				mediaDoor2.position.z += 35;
				mediaDoor2.receiveShadow = true;
				mediaDoor2.castShadow = true;
				scene.add(mediaDoor2);

		//create top of door frame for media wall
			mediaFrame = new Physijs.BoxMesh (
					new THREE.BoxGeometry (25,5,1),
					new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
					);
				mediaFrame.position.y += 7.5;
				mediaFrame.position.z += 35;
				mediaFrame.receiveShadow = true;
				mediaFrame.castShadow = true;
				scene.add(mediaFrame);

			mediaFloor = new Physijs.BoxMesh (
			new THREE.BoxGeometry (40,0.5,32),
			new THREE.MeshBasicMaterial({color:0xd1bf00, wireframe:false})
			);
				mediaFloor.position.y -= 0.1;
				mediaFloor.position.z += 51;
				mediaFloor.position.x = 0;
				mediaFloor.receiveShadow = true;
				mediaFloor.castShadow = true;
				scene.add(mediaFloor);

			mediaCeiling = new Physijs.BoxMesh (
			new THREE.BoxGeometry (40,0.5,32),
			new THREE.MeshBasicMaterial({color:0xd1bf00, wireframe:false})
			);
				mediaCeiling.position.y += 9.5;
				mediaCeiling.position.z += 51;
				mediaCeiling.position.x = 0;
				mediaCeiling.receiveShadow = true;
				mediaCeiling.castShadow = true;
				scene.add(mediaCeiling);

		//MEDIA LEFT door
			mediaLeft1 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.1,20,11),
			new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
			);
			mediaLeft1.position.x += 19.5;
			mediaLeft1.position.z += 40.5;
			mediaLeft1.receiveShadow = true;
			mediaLeft1.castShadow = true;
			scene.add(mediaLeft1);

			mediaLeft2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,20,12),
				new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
				);
			mediaLeft2.position.x += 19.5;
			mediaLeft2.position.z += 59.2;
			mediaLeft2.receiveShadow = true;
			mediaLeft2.castShadow = true;
			scene.add(mediaLeft2);

			mediaLeftframe = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,5,10),
				new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
				);
			mediaLeftframe.position.x += 19.5;
			mediaLeftframe.position.z += 51;
			mediaLeftframe.position.y += 8;
			mediaLeftframe.receiveShadow = true;
			mediaLeftframe.castShadow = true;
			scene.add(mediaLeftframe);

		//MEDIA RIGHT DOOR
			mediaRight1 = new Physijs.BoxMesh (
			new THREE.BoxGeometry (0.1,20,11),
			new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
			);
			mediaRight1.position.x -= 19.5;
			mediaRight1.position.z += 40.5;
			mediaRight1.receiveShadow = true;
			mediaRight1.castShadow = true;
			scene.add(mediaRight1);

			mediaRight2 = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,20,12),
				new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
				);
			mediaRight2.position.x -= 19.5;
			mediaRight2.position.z += 59.2;
			mediaRight2.receiveShadow = true;
			mediaRight2.castShadow = true;
			scene.add(mediaRight2);

			mediaRightframe = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.1,5,10),
				new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
				);
			mediaRightframe.position.x -= 19.5;
			mediaRightframe.position.z += 51;
			mediaRightframe.position.y += 8;
			mediaRightframe.receiveShadow = true;
			mediaRightframe.castShadow = true;
			scene.add(mediaRightframe);

		//MEDIA BACK
			mediaBackmiddle = new Physijs.BoxMesh (
			new THREE.BoxGeometry (5,20,0.1),
			new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
			);
			mediaBackmiddle.position.x = 0;
			mediaBackmiddle.position.z += 65.2;
			mediaBackmiddle.receiveShadow = true;
			mediaBackmiddle.castShadow = true;
			scene.add(mediaBackmiddle);

			mediaBackleft = new Physijs.BoxMesh (
			new THREE.BoxGeometry (10,20,0.1),
			new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
			);
			mediaBackleft.position.x += 15;
			mediaBackleft.position.z += 65.2;
			mediaBackleft.receiveShadow = true;
			mediaBackleft.castShadow = true;
			scene.add(mediaBackleft);

			mediaBackright = new Physijs.BoxMesh (
			new THREE.BoxGeometry (10,20,0.1),
			new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
			);
			mediaBackright.position.x -= 15;
			mediaBackright.position.z += 65.2;
			mediaBackright.receiveShadow = true;
			mediaBackright.castShadow = true;
			scene.add(mediaBackright);

		//MEDIA door frame
			mediaFrame = new Physijs.BoxMesh (
			new THREE.BoxGeometry (30,5,0.1),
			new THREE.MeshBasicMaterial({color:0xffe900, wireframe:false}) 
			);
			mediaFrame.position.y += 8;
			mediaFrame.position.x -= 5;
			mediaFrame.position.z += 65.2;
			mediaFrame.receiveShadow = true;
			mediaFrame.castShadow = true;
			scene.add(mediaFrame);

		//EXIT SIGN MEDIA
			exitMedia = new Physijs.BoxMesh (
			new THREE.BoxGeometry(0.2,2,5),
			new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
			);
			exitMedia.castShadow = true;
			exitMedia.position.x = 0;
			exitMedia.position.y += 6.5;
			exitMedia.position.z += 35.6;
			exitMedia.rotation.y += Math.PI/2;
			scene.add(exitMedia);

			exitMediabg = new Physijs.BoxMesh (
				new THREE.BoxGeometry (0.2,2,5),
				new THREE.MeshBasicMaterial({color:0x000000, wireframe:false}) 
				);
			exitMediabg.position.x = 0;
			exitMediabg.position.y += 6.5;
			exitMediabg.position.z += 35.5;
			exitMediabg.rotation.y += Math.PI/2;
			scene.add(exitMediabg);

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
						if ( node instanceof Physijs.BoxMesh ){
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

	mediaLight = new THREE.PointLight(0xffffff, 0.5,60);
	mediaLight.position.set(0,6,50);
	mediaLight.castShadow = true;
	mediaLight.shadow.camera.near = 0.1;
	mediaLight.shadow.camera.far = 25;
	scene.add(mediaLight);

	//HOME Light
		homeLight = new THREE.PointLight(0xffffff, 0.9,30);
		homeLight.position.set(0,6,20);
		homeLight.castShadow = true;
		homeLight.shadow.camera.near = 0.1;
		homeLight.shadow.camera.far = 25;
		scene.add(homeLight);

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

// TREE MESH CLONES
	function onResourcesLoaded() {
		//clone models into meshes
		meshes["tree1"] = models.tree.mesh.clone();
		meshes["tree2"] = models.tree.mesh.clone();
		meshes["tree3"] = models.tree.mesh.clone();
		meshes["tree4"] = models.tree.mesh.clone();
		meshes["tree5"] = models.tree.mesh.clone();
		meshes["tree6"] = models.tree.mesh.clone();
		meshes["tree7"] = models.tree.mesh.clone();
		meshes["tree8"] = models.tree.mesh.clone();
		meshes["tree9"] = models.tree.mesh.clone();
		meshes["tree10"] = models.tree.mesh.clone();
		meshes["tree11"] = models.tree.mesh.clone();
		meshes["tree12"] = models.tree.mesh.clone();
		meshes["tree13"] = models.tree.mesh.clone();
		meshes["tree14"] = models.tree.mesh.clone();
		meshes["tree15"] = models.tree.mesh.clone();
		meshes["tree16"] = models.tree.mesh.clone();
		meshes["tree17"] = models.tree.mesh.clone();
		meshes["tree18"] = models.tree.mesh.clone();
		meshes["tree19"] = models.tree.mesh.clone();
		meshes["tree20"] = models.tree.mesh.clone();
		meshes["tree21"] = models.tree.mesh.clone();
		meshes["tree22"] = models.tree.mesh.clone();
		meshes["tree23"] = models.tree.mesh.clone();
		meshes["tree24"] = models.tree.mesh.clone();
		meshes["tree25"] = models.tree.mesh.clone();
		meshes["tree26"] = models.tree.mesh.clone();
		meshes["tree27"] = models.tree.mesh.clone();
		meshes["tree28"] = models.tree.mesh.clone();
		meshes["tree29"] = models.tree.mesh.clone();
		meshes["tree30"] = models.tree.mesh.clone();
		meshes["tree31"] = models.tree.mesh.clone();
		meshes["tree32"] = models.tree.mesh.clone();
		meshes["tree33"] = models.tree.mesh.clone();
		meshes["tree34"] = models.tree.mesh.clone();
		meshes["tree35"] = models.tree.mesh.clone();
		meshes["tree36"] = models.tree.mesh.clone();
		meshes["tree37"] = models.tree.mesh.clone();
		meshes["tree38"] = models.tree.mesh.clone();
		meshes["tree39"] = models.tree.mesh.clone();
		meshes["tree40"] = models.tree.mesh.clone();
		meshes["tree41"] = models.tree.mesh.clone();
		meshes["tree42"] = models.tree.mesh.clone();
		meshes["tree43"] = models.tree.mesh.clone();
		meshes["tree44"] = models.tree.mesh.clone();
		meshes["tree45"] = models.tree.mesh.clone();
		meshes["tree46"] = models.tree.mesh.clone();
		meshes["tree47"] = models.tree.mesh.clone();
		meshes["tree48"] = models.tree.mesh.clone();
		meshes["tree49"] = models.tree.mesh.clone();
		meshes["tree50"] = models.tree.mesh.clone();

		//reposition individual meshes
		meshes["tree1"].position.set (35, 1.5, -30);
		meshes["tree1"].scale.set(3,3,3);
		scene.add(meshes["tree1"]);

		meshes["tree2"].position.set (60, 1.5, -10);
		meshes["tree2"].scale.set(6,6,6);
		scene.add(meshes["tree2"]);

		meshes["tree3"].position.set (55, 1.5, -20);
		meshes["tree3"].scale.set(3,3,3);
		scene.add(meshes["tree3"]);

		meshes["tree4"].position.set (-100, 1.5, -65);
		meshes["tree4"].scale.set(6,6,6);
		scene.add(meshes["tree4"]);

		meshes["tree5"].position.set (-75, 1.5, -20);
		meshes["tree5"].scale.set(3,3,3);
		scene.add(meshes["tree5"]);

		meshes["tree6"].position.set (-30, 1.5, -30);
		meshes["tree6"].scale.set(3,3,3);
		scene.add(meshes["tree6"]);

		meshes["tree7"].position.set (-20, 1.5, -35);
		meshes["tree7"].scale.set(6,6,6);
		scene.add(meshes["tree7"]);

		meshes["tree8"].position.set (-55, 1.5, -75);
		meshes["tree8"].scale.set(3,3,3);
		scene.add(meshes["tree8"]);

		meshes["tree9"].position.set (75, 1.5, -110);
		meshes["tree9"].scale.set(3,3,3);
		scene.add(meshes["tree9"]);

		meshes["tree10"].position.set (55, 1.5, -45);
		meshes["tree10"].scale.set(6,6,6);
		scene.add(meshes["tree10"]);

		meshes["tree11"].position.set (-65, 1.5, -55);
		meshes["tree11"].scale.set(3,3,3);
		scene.add(meshes["tree11"]);

		meshes["tree12"].position.set (-39, 1.5, -37);
		meshes["tree12"].scale.set(3,3,3);
		scene.add(meshes["tree12"]);

		meshes["tree13"].position.set (39, 1.5, -92);
		meshes["tree13"].scale.set(3,3,3);
		scene.add(meshes["tree13"]);

		meshes["tree14"].position.set (100, 1.5, -110);
		meshes["tree14"].scale.set(3,3,3);
		scene.add(meshes["tree14"]);

		meshes["tree15"].position.set (23, 1.5, -50);
		meshes["tree15"].scale.set(3,3,3);
		scene.add(meshes["tree15"]);

		meshes["tree16"].position.set (-89, 1.5, -76);
		meshes["tree16"].scale.set(6,6,6);
		scene.add(meshes["tree16"]);

		meshes["tree17"].position.set (40, 1.5, -58);
		meshes["tree17"].scale.set(3,3,3);
		scene.add(meshes["tree17"]);

		meshes["tree18"].position.set (-50, 1.5, 110);
		meshes["tree18"].scale.set(4,4,4);
		scene.add(meshes["tree18"]);

		meshes["tree19"].position.set (-30, 1.5, -20);
		meshes["tree19"].scale.set(6,6,6);
		scene.add(meshes["tree19"]);

		meshes["tree20"].position.set (58, 1.5, 86);
		meshes["tree20"].scale.set(6,6,6);
		scene.add(meshes["tree20"]);

		meshes["tree21"].position.set (17, 1.5, -100);
		meshes["tree21"].scale.set(3,3,3);
		scene.add(meshes["tree21"]);

		meshes["tree22"].position.set (-10, 1.5, -86);
		meshes["tree22"].scale.set(3,3,3);
		scene.add(meshes["tree22"]);

		meshes["tree23"].position.set (-40, 1.5, -15);
		meshes["tree23"].scale.set(5,6,5);
		scene.add(meshes["tree23"]);

		meshes["tree24"].position.set (40, 1.5, -58);
		meshes["tree24"].scale.set(3,3,3);
		scene.add(meshes["tree24"]);

		meshes["tree25"].position.set (50, 1.5, -58);
		meshes["tree25"].scale.set(3,3,3);
		scene.add(meshes["tree25"]);

		meshes["tree26"].position.set (75, 1.5, -40);
		meshes["tree26"].scale.set(6,6,6);
		scene.add(meshes["tree26"]);

		meshes["tree27"].position.set (9, 1.5, -95);
		meshes["tree27"].scale.set(3,3,3);
		scene.add(meshes["tree27"]);

		meshes["tree28"].position.set (40, 1.5, -58);
		meshes["tree28"].scale.set(3,3,3);
		scene.add(meshes["tree28"]);

		meshes["tree29"].position.set (79, 1.5, -65);
		meshes["tree29"].scale.set(4,4,4);
		scene.add(meshes["tree29"]);

		meshes["tree30"].position.set (25, 1.5, -10);
		meshes["tree30"].scale.set(5,5,5);
		scene.add(meshes["tree30"]);

		meshes["tree31"].position.set (90, 1.5, 90);
		meshes["tree31"].scale.set(3,3,3);
		scene.add(meshes["tree31"]);

		meshes["tree32"].position.set (55, 1.5, 67);
		meshes["tree32"].scale.set(7,7,7);
		scene.add(meshes["tree32"]);

		meshes["tree33"].position.set (85, 1.5, 103);
		meshes["tree33"].scale.set(4,4,4);
		scene.add(meshes["tree33"]);

		meshes["tree34"].position.set (77, 1.5, 30);
		meshes["tree34"].scale.set(5,5,5);
		scene.add(meshes["tree34"]);

		meshes["tree35"].position.set (114, 1.5, 63);
		meshes["tree35"].scale.set(3,3,3);
		scene.add(meshes["tree35"]);

		meshes["tree36"].position.set (93, 1.5, 50);
		meshes["tree36"].scale.set(4,4,4);
		scene.add(meshes["tree36"]);

		meshes["tree37"].position.set (107, 1.5, 113);
		meshes["tree37"].scale.set(4,4,4);
		scene.add(meshes["tree37"]);

		meshes["tree38"].position.set (105, 1.5, 54);
		meshes["tree38"].scale.set(6,6,6);
		scene.add(meshes["tree38"]);

		meshes["tree39"].position.set (115, 1.5, 26);
		meshes["tree39"].scale.set(6,6,6);
		scene.add(meshes["tree39"]);

		meshes["tree40"].position.set (-60, 1.5, 81);
		meshes["tree40"].scale.set(3,3,3);
		scene.add(meshes["tree40"]);

		meshes["tree41"].position.set (-90, 1.5, 90);
		meshes["tree41"].scale.set(3,3,3);
		scene.add(meshes["tree41"]);

		meshes["tree42"].position.set (-76, 1.5, 67);
		meshes["tree42"].scale.set(7,7,7);
		scene.add(meshes["tree42"]);

		meshes["tree43"].position.set (-85, 1.5, 103);
		meshes["tree43"].scale.set(4,4,4);
		scene.add(meshes["tree43"]);

		meshes["tree44"].position.set (-77, 1.5, 30);
		meshes["tree44"].scale.set(5,5,5);
		scene.add(meshes["tree44"]);

		meshes["tree45"].position.set (-114, 1.5, 63);
		meshes["tree45"].scale.set(3,3,3);
		scene.add(meshes["tree45"]);

		meshes["tree46"].position.set (-93, 1.5, 50);
		meshes["tree46"].scale.set(4,4,4);
		scene.add(meshes["tree46"]);

		meshes["tree47"].position.set (-107, 1.5, 113);
		meshes["tree47"].scale.set(4,4,4);
		scene.add(meshes["tree47"]);

		meshes["tree48"].position.set (-105, 1.5, 54);
		meshes["tree48"].scale.set(6,6,6);
		scene.add(meshes["tree48"]);

		meshes["tree49"].position.set (-115, 1.5, 26);
		meshes["tree49"].scale.set(6,6,6);
		scene.add(meshes["tree49"]);

		meshes["tree50"].position.set (-60, 1.5, 81);
		meshes["tree50"].scale.set(3,3,3);
		scene.add(meshes["tree50"]);
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

	scene.simulate();
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