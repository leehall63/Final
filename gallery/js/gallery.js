var scene, camera, renderer, mesh;
var meshFloor;

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

var textureLoader = new THREE.TextureLoader();

var LOADING_MANAGER = null;
var RESOURCES_LOADED = false;

//Meshes Index
var meshes = {};

function init() {

	scene = new THREE.Scene();
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
	//Exhibit Signs
		var fontLoader = new THREE.FontLoader();

		fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

		var geometry = new THREE.TextGeometry( 'About', {
			font: font,
			size: 80,
			height: 5,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 10,
			bevelSize: 8,
			bevelOffset: 0,
			bevelSegments: 5
		} );
	} );

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
		homeBackdoor1 = new THREE.Mesh (
			new THREE.BoxGeometry (16,20,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeBackdoor1.position.x += 12;
		homeBackdoor1.position.z += 34.5;
		homeBackdoor1.receiveShadow = true;
		homeBackdoor1.castShadow = true;
		scene.add(homeBackdoor1);

		homeBackdoor2 = new THREE.Mesh (
			new THREE.BoxGeometry (16,20,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeBackdoor2.position.x -= 12;
		homeBackdoor2.position.z += 34.5;
		homeBackdoor2.receiveShadow = true;
		homeBackdoor2.castShadow = true;
		scene.add(homeBackdoor2);

		homeBackdoorframe = new THREE.Mesh (
			new THREE.BoxGeometry (10,6,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeBackdoorframe.position.x = 0;
		homeBackdoorframe.position.z += 34.5;
		homeBackdoorframe.position.y += 8;
		homeBackdoorframe.receiveShadow = true;
		homeBackdoorframe.castShadow = true;
		scene.add(homeBackdoorframe);

	//HOME Front Wall
		homeFrontdoor1 = new THREE.Mesh (
			new THREE.BoxGeometry (17,20,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeFrontdoor1.position.x -= 12;
		homeFrontdoor1.position.z += 5.5;
		homeFrontdoor1.receiveShadow = true;
		homeFrontdoor1.castShadow = true;
		scene.add(homeFrontdoor1);

		homeFrontdoor2 = new THREE.Mesh (
			new THREE.BoxGeometry (17,20,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeFrontdoor2.position.x += 12;
		homeFrontdoor2.position.z += 5.5;
		homeFrontdoor2.receiveShadow = true;
		homeFrontdoor2.castShadow = true;
		scene.add(homeFrontdoor2);

		homeFrontdoorframe = new THREE.Mesh (
			new THREE.BoxGeometry (10,4,0.1),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false}) 
			);
		homeFrontdoorframe.position.x = 0;
		homeFrontdoorframe.position.z += 5.5;
		homeFrontdoorframe.position.y += 8;
		homeFrontdoorframe.receiveShadow = true;
		homeFrontdoorframe.castShadow = true;
		scene.add(homeFrontdoorframe);

	//HOME Ceiling
		homeCeiling = new THREE.Mesh (
			new THREE.BoxGeometry (40,0.5,30),
			new THREE.MeshPhongMaterial({color:0x636363, wireframe:false})
			);
		homeCeiling.position.y += 9.5;
		homeCeiling.position.z += 20;
		homeCeiling.position.x = 0;
		homeCeiling.receiveShadow = true;
		homeCeiling.castShadow = true;
		scene.add(homeCeiling);

//create ABOUT ME section


		profiletexture = new textureLoader.load("../images/Edited Headshot-1.jpg");

		profilePic = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,8,12),
		new THREE.MeshBasicMaterial({ map: profiletexture, wireframe: false })
		);
		profilePic.castShadow = true;
		profilePic.position.x += 48.5;
		profilePic.position.y += 4.6;
		profilePic.position.z += 13.5;
		scene.add(profilePic);

		biographyBg = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,8,10),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
		);
		biographyBg.castShadow = true;
		biographyBg.position.x += 48.5;
		biographyBg.position.y += 4.6;
		biographyBg.position.z += 27;
		scene.add(biographyBg);

		contacttexture = new textureLoader.load("../images/camera.jpg");

		contactPic = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,7,10),
		new THREE.MeshBasicMaterial({ map: contacttexture, wireframe: false })
		);
		contactPic.castShadow = true;
		contactPic.position.x += 25;
		contactPic.position.y += 4.6;
		contactPic.position.z += 6.5;
		contactPic.rotation.y += Math.PI/2;
		scene.add(contactPic);

		contactBg = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,2,7),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
		);
		contactBg.castShadow = true;
		contactBg.position.x += 35;
		contactBg.position.y += 7.7;
		contactBg.position.z += 6.5;
		contactBg.rotation.y += Math.PI/2;
		scene.add(contactBg);

		emailBg = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,5,8),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
		);
		emailBg.castShadow = true;
		emailBg.position.x += 35;
		emailBg.position.y += 3.5;
		emailBg.position.z += 6.5;
		emailBg.rotation.y += Math.PI/2;
		scene.add(emailBg);

		twitterBg = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,2.5,2.5),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
		);
		twitterBg.castShadow = true;
		twitterBg.position.x += 41;
		twitterBg.position.y += 6.5;
		twitterBg.position.z += 6.5;
		twitterBg.rotation.y += Math.PI/2;
		scene.add(twitterBg);

		ytBg = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,2.5,2.5),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
		);
		ytBg.castShadow = true;
		ytBg.position.x += 41;
		ytBg.position.y += 3.5;
		ytBg.position.z += 6.5;
		ytBg.rotation.y += Math.PI/2;
		scene.add(ytBg);

		instaBg = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,2.5,2.5),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
		);
		instaBg.castShadow = true;
		instaBg.position.x += 45;
		instaBg.position.y += 6.5;
		instaBg.position.z += 6.5;
		instaBg.rotation.y += Math.PI/2;
		scene.add(instaBg);

		linkedBg = new THREE.Mesh (
		new THREE.BoxGeometry(0.2,2.5,2.5),
		new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
		);
		linkedBg.castShadow = true;
		linkedBg.position.x += 45;
		linkedBg.position.y += 3.5;
		linkedBg.position.z += 6.5;
		linkedBg.rotation.y += Math.PI/2;
		scene.add(linkedBg);

		workBG = new THREE.Mesh (
			new THREE.BoxGeometry (4,3,0.2),
			new THREE.MeshPhongMaterial({color:0xaaaaaa, wireframe:false}) 
			);
		workBG.position.x += 44;
		workBG.position.y += 4.5;
		workBG.position.z += 33;
		workBG.receiveShadow = true;
		workBG.castShadow = true;
		scene.add(workBG);

		educationBG = new THREE.Mesh (
			new THREE.BoxGeometry (4,3,0.2),
			new THREE.MeshPhongMaterial({color:0xaaaaaa, wireframe:false}) 
			);
		educationBG.position.x += 35;
		educationBG.position.y += 4.5;
		educationBG.position.z += 33;
		educationBG.receiveShadow = true;
		educationBG.castShadow = true;
		scene.add(educationBG);

		extracurricularBG = new THREE.Mesh (
			new THREE.BoxGeometry (4,3,0.2),
			new THREE.MeshPhongMaterial({color:0xaaaaaa, wireframe:false}) 
			);
		extracurricularBG.position.x += 25;
		extracurricularBG.position.y += 4.5;
		extracurricularBG.position.z += 33;
		extracurricularBG.receiveShadow = true;
		extracurricularBG.castShadow = true;
		scene.add(extracurricularBG);

	//EXIT SIGN ABOUT
		exittexture = new textureLoader.load("../images/Exit Sign.png");

		exitAbout = new THREE.Mesh (
		new THREE.BoxGeometry(5,2,0.2),
		new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
		);
		exitAbout.position.x += 20.5;
		exitAbout.position.y += 6.5;
		exitAbout.position.z += 20;
		exitAbout.rotation.y += Math.PI/2;
		scene.add(exitAbout);

		exitAboutbg = new THREE.Mesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshPhongMaterial({color:0x000000, wireframe:false}) 
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

//create MUSIC section
	musicDoor1 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false}) 
		);
	musicDoor1.position.x -= 20;
	musicDoor1.position.z += 40;
	musicDoor1.receiveShadow = true;
	musicDoor1.castShadow = true;
	scene.add(musicDoor1);

	musicDoor2 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false}) 
		);
	musicDoor2.position.x -= 20;
	musicDoor2.position.z += 59.2;
	musicDoor2.receiveShadow = true;
	musicDoor2.castShadow = true;
	scene.add(musicDoor2);

	musicFrame = new THREE.Mesh (
		new THREE.BoxGeometry (1,5,10),
		new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false}) 
		);
	musicFrame.position.x -= 20;
	musicFrame.position.z += 50;
	musicFrame.position.y += 8;
	musicFrame.receiveShadow = true;
	musicFrame.castShadow = true;
	scene.add(musicFrame);

	musicBack = new THREE.Mesh (
		new THREE.BoxGeometry (0.5,20,30),
		new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false}) 
		);
	musicBack.position.x -= 49;
	musicBack.position.z += 50;
	musicBack.receiveShadow = true;
	musicBack.castShadow = true;
	scene.add(musicBack);

	musicLeft = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false}) 
		);
	musicLeft.position.x -= 35;
	musicLeft.position.z += 65;
	musicLeft.receiveShadow = true;
	musicLeft.castShadow = true;
	scene.add(musicLeft);

	musicRight = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false}) 
		);
	musicRight.position.x -= 35;
	musicRight.position.z += 36;
	musicRight.receiveShadow = true;
	musicRight.castShadow = true;
	scene.add(musicRight);

	musicCeiling = new THREE.Mesh (
			new THREE.BoxGeometry (30,0.5,30),
			new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false})
			);
		musicCeiling.position.y += 9.5;
		musicCeiling.position.z += 50;
		musicCeiling.position.x -= 35;
		musicCeiling.receiveShadow = true;
		musicCeiling.castShadow = true;
		scene.add(musicCeiling);

	musicFloor = new THREE.Mesh (
			new THREE.BoxGeometry (30,1,30),
			new THREE.MeshPhongMaterial({color:0xa53d30, wireframe:false})
			);
		musicFloor.position.y -= .3;
		musicFloor.position.z += 50;
		musicFloor.position.x -= 35;
		musicFloor.receiveShadow = true;
		musicFloor.castShadow = true;
		scene.add(musicFloor);

	//EXIT SIGN Music
		exitMusic = new THREE.Mesh (
		new THREE.BoxGeometry(5,2,0.2),
		new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
		);
		exitMusic.castShadow = true;
		exitMusic.position.x -= 20.5;
		exitMusic.position.y += 6.5;
		exitMusic.position.z += 20;
		exitMusic.rotation.y += Math.PI/2;
		scene.add(exitMusic);

		exitMusicbg = new THREE.Mesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshPhongMaterial({color:0x000000, wireframe:false}) 
			);
		exitMusicbg.position.x -= 20.5;
		exitMusicbg.position.y += 6.5;
		exitMusicbg.position.z += 20;
		exitMusicbg.rotation.y += Math.PI/2;
		exitMusicbg.receiveShadow = true;
		exitMusicbg.castShadow = true;
		scene.add(exitMusicbg);

		exitLight3 = new THREE.PointLight(0xff0000, 0.,10);
		exitLight3.position.set(-21,5.5,20);
		exitLight3.shadow.camera.near = 0.1;
		exitLight3.shadow.camera.far = 25;
		scene.add(exitLight3);

//create INTERACTIVE Section

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

		//EXIT SIGN INTERACT
			exitinteract = new THREE.Mesh (
			new THREE.BoxGeometry(5,2,0.2),
			new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
			);
			exitinteract.castShadow = true;
			exitinteract.position.x -= 20.5;
			exitinteract.position.y += 6.5;
			exitinteract.position.z += 20;
			exitinteract.rotation.y += Math.PI/2;
			scene.add(exitinteract);

			exitInteractbg = new THREE.Mesh (
				new THREE.BoxGeometry (5,2,0.2),
				new THREE.MeshPhongMaterial({color:0x000000, wireframe:false}) 
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
	//create MUSIC section
	photoDoor1 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false}) 
		);
	photoDoor1.position.x += 20;
	photoDoor1.position.z += 40;
	photoDoor1.receiveShadow = true;
	photoDoor1.castShadow = true;
	scene.add(photoDoor1);

	photoDoor2 = new THREE.Mesh (
		new THREE.BoxGeometry (1,20,12),
		new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false}) 
		);
	photoDoor2.position.x += 20;
	photoDoor2.position.z += 59.2;
	photoDoor2.receiveShadow = true;
	photoDoor2.castShadow = true;
	scene.add(photoDoor2);

	photoFrame = new THREE.Mesh (
		new THREE.BoxGeometry (1,5,10),
		new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false}) 
		);
	photoFrame.position.x += 20;
	photoFrame.position.z += 50;
	photoFrame.position.y += 8;
	photoFrame.receiveShadow = true;
	photoFrame.castShadow = true;
	scene.add(photoFrame);

	photoBack = new THREE.Mesh (
		new THREE.BoxGeometry (0.5,20,30),
		new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false}) 
		);
	photoBack.position.x += 49;
	photoBack.position.z += 50;
	photoBack.receiveShadow = true;
	photoBack.castShadow = true;
	scene.add(photoBack);

	photoLeft = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false}) 
		);
	photoLeft.position.x += 35;
	photoLeft.position.z += 65;
	photoLeft.receiveShadow = true;
	photoLeft.castShadow = true;
	scene.add(photoLeft);

	photoRight = new THREE.Mesh (
		new THREE.BoxGeometry (30,20,0.5),
		new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false}) 
		);
	photoRight.position.x += 35;
	photoRight.position.z += 36;
	photoRight.receiveShadow = true;
	photoRight.castShadow = true;
	scene.add(photoRight);

	photoCeiling = new THREE.Mesh (
			new THREE.BoxGeometry (30,0.5,30),
			new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false})
			);
		photoCeiling.position.y += 9.5;
		photoCeiling.position.z += 50;
		photoCeiling.position.x += 35;
		photoCeiling.receiveShadow = true;
		photoCeiling.castShadow = true;
		scene.add(photoCeiling);

	photoFloor = new THREE.Mesh (
			new THREE.BoxGeometry (30,1,30),
			new THREE.MeshPhongMaterial({color:0xd86b27, wireframe:false})
			);
		photoFloor.position.y -= .3;
		photoFloor.position.z += 50;
		photoFloor.position.x += 35;
		photoFloor.receiveShadow = true;
		photoFloor.castShadow = true;
		scene.add(photoFloor);

	//EXIT SIGN Music
		exitPhoto = new THREE.Mesh (
		new THREE.BoxGeometry(5,2,0.2),
		new THREE.MeshBasicMaterial({ map: exittexture, wireframe: false, transparent: true })
		);
		exitPhoto.castShadow = true;
		exitPhoto.position.x += 20.5;
		exitPhoto.position.y += 6.5;
		exitPhoto.position.z += 20;
		exitPhoto.rotation.y += Math.PI/2;
		scene.add(exitPhoto);

		exitPhotobg = new THREE.Mesh (
			new THREE.BoxGeometry (5,2,0.2),
			new THREE.MeshPhongMaterial({color:0x000000, wireframe:false}) 
			);
		exitPhotobg.position.x += 20.5;
		exitPhotobg.position.y += 6.5;
		exitPhotobg.position.z += 20;
		exitPhotobg.rotation.y += Math.PI/2;
		exitPhotobg.receiveShadow = true;
		exitPhotobg.castShadow = true;
		scene.add(exitMusicbg);

		exitLight4 = new THREE.PointLight(0xff0000, 0.,10);
		exitLight4.position.set(21,5.5,20);
		exitLight4.shadow.camera.near = 0.1;
		exitLight4.shadow.camera.far = 25;
		scene.add(exitLight4);

//create first sectional wall
	//create first green wall
		greenWall1 = new THREE.Mesh (
				new THREE.BoxGeometry (46,20,1),
				new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false}) 
				);
			greenWall1.position.x += 27;
			greenWall1.position.z += 35;
			greenWall1.receiveShadow = true;
			greenWall1.castShadow = true;
			scene.add(greenWall1);

	//create second green wall
		greenWall2 = new THREE.Mesh (
				new THREE.BoxGeometry (46,20,1),
				new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false}) 
				);
			greenWall2.position.x -= 27;
			greenWall2.position.z += 35;
			greenWall2.receiveShadow = true;
			greenWall2.castShadow = true;
			scene.add(greenWall2);

	//create top of door frame for green wall
		greenWall3 = new THREE.Mesh (
				new THREE.BoxGeometry (25,5,1),
				new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false}) 
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
	homeLight = new THREE.PointLight(0xffffff, 0.9,30);
	homeLight.position.set(0,6,20);
	homeLight.castShadow = true;
	homeLight.shadow.camera.near = 0.1;
	homeLight.shadow.camera.far = 25;
	scene.add(homeLight);
//ABOUT Light
	aboutLight = new THREE.PointLight(0xffffff, 0.7,20);
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

//MUSIC LIGHT
	musicLight = new THREE.PointLight(0xffffff, 0.5,20);
	musicLight.position.set(-35,6,50);
	musicLight.castShadow = true;
	musicLight.shadow.camera.near = 0.1;
	musicLight.shadow.camera.far = 25;
	scene.add(musicLight);


//PHOTO LIGHT
	photoLight = new THREE.PointLight(0xffffff, 0.5,20);
	photoLight.position.set(35,6,50);
	photoLight.castShadow = true;
	photoLight.shadow.camera.near = 0.1;
	photoLight.shadow.camera.far = 25;
	scene.add(photoLight);

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

	meshes["tree4"].position.set (-50, 0.5, 110);
	meshes["tree4"].scale.set(2,2,2);
	scene.add(meshes["tree4"]);

	meshes["tree5"].position.set (-50, 0.5, 110);
	meshes["tree5"].scale.set(2,2,2);
	scene.add(meshes["tree5"]);

	meshes["tree6"].position.set (-50, 0.5, 110);
	meshes["tree6"].scale.set(2,2,2);
	scene.add(meshes["tree6"]);

	meshes["tree7"].position.set (-50, 0.5, 110);
	meshes["tree7"].scale.set(2,2,2);
	scene.add(meshes["tree7"]);

	meshes["tree8"].position.set (-50, 0.5, 110);
	meshes["tree8"].scale.set(2,2,2);
	scene.add(meshes["tree8"]);

	meshes["tree9"].position.set (-50, 0.5, 110);
	meshes["tree9"].scale.set(2,2,2);
	scene.add(meshes["tree9"]);

	meshes["tree10"].position.set (-50, 0.5, 110);
	meshes["tree10"].scale.set(2,2,2);
	scene.add(meshes["tree10"]);

	meshes["tree11"].position.set (-50, 0.5, 110);
	meshes["tree11"].scale.set(2,2,2);
	scene.add(meshes["tree11"]);

	meshes["tree12"].position.set (-50, 0.5, 110);
	meshes["tree12"].scale.set(2,2,2);
	scene.add(meshes["tree12"]);

	meshes["tree13"].position.set (-50, 0.5, 110);
	meshes["tree13"].scale.set(2,2,2);
	scene.add(meshes["tree13"]);

	meshes["tree14"].position.set (-50, 0.5, 110);
	meshes["tree14"].scale.set(2,2,2);
	scene.add(meshes["tree14"]);

	meshes["tree15"].position.set (-50, 0.5, 110);
	meshes["tree15"].scale.set(2,2,2);
	scene.add(meshes["tree15"]);

	meshes["tree16"].position.set (-50, 0.5, 110);
	meshes["tree16"].scale.set(2,2,2);
	scene.add(meshes["tree16"]);

	meshes["tree17"].position.set (-50, 0.5, 110);
	meshes["tree17"].scale.set(2,2,2);
	scene.add(meshes["tree17"]);

	meshes["tree18"].position.set (-50, 0.5, 110);
	meshes["tree18"].scale.set(2,2,2);
	scene.add(meshes["tree18"]);

	meshes["tree19"].position.set (-30, 0.5, -20);
	meshes["tree19"].scale.set(2,2,2);
	scene.add(meshes["tree19"]);

	meshes["tree20"].position.set (50, 0.5, -100);
	meshes["tree20"].scale.set(4,4,4);
	scene.add(meshes["tree20"]);
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