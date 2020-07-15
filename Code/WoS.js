let logoPath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUElEQVRYR+VXQRLDIAjEe/7/0tztQKOjVGDVeGoOyUyLCsuyYCKinImIbn79Puki4v8TG574ZqIsmxsO0HXwcA4o3xJYfWYj1sjNru8cQBdb6SpRoPsw8tUBaJGTpmUkOAXQ4ZqoFjeKkyB3vggAxl2Ejn2xQ4MSByDjBn7X/jQCkbPnEYjS9dcIoERtZR3WASi3k/BLb6lSvJtbtEpUQ+t7gXYCbVDaLgqmdYK7YaTtovGX3bK7Jj5zeHHEbMVl57KphYi2m5kb6jwwsWiF7dYwIxVxZNJBJ6hpBBbZvo3A0syI6AKCQFQlVoNCxAvjgAV7lI5XEEAP4SpSI/wrCCCbVB1pRAgu1ZADAIxDJ4F1MhVHOrCLQDRBJQ8BFMZzCEQEdEZ17dSwlJkzOxxwLyNR43qqBubA+O78/Dpowa5ytgQNEXCu7mVOGF7dwSr4ADVg8gBQq6EzAAAAAElFTkSuQmCC";
let logoLength = 0;

let readyPlay = 0;

let swarmSpawner;
let swarmSpawner2;
let swarmSpawner3;
let drainSpawner;
let fuseSpawner;
let regenSpawner;
let healSpawner;

let roundsPlayed = 0;

let cheated = false;

let unlockedText = "";
let unlockedTime = 0;

let gear;

let gameSetting = {
	screenHaze: true,
	volume: 5
};

let mode = "normal";//normal, easy, drain
let modes = {
	normal: {
		unlocked: true,
		name: "Normal",
		id: "normal",
		description: "The original way to play the game!",
		requirement: "???!?!?!?",
		highscore: 0
	},
	easy: {
		unlocked: false,
		name: "Easy",
		id: "easy",
		description: "You regenerate health more, so it's much easier to survive!",
		requirement: "Start 3 rounds on normal mode.",
		highscore: 0
	},
	hard: {
		unlocked: false,
		name: "Hard",
		id: "hard",
		description: "Enemies spawn very fast - a much harder experience!",
		requirement: "Reach 5k points on normal mode.",
		highscore: 0
	},
	impossible: {
		unlocked: false,
		name: "Impossible",
		id: "impossible",
		description: "No regen gained from leveling up = no way to survive.",
		requirement: "Reach Healers on hard mode.",
		highscore: 0
	},
	drain: {
		unlocked: false,
		name: "Deflation",
		id: "drain",
		description: "Drainers cannot die! Expect a much shorter game.",
		requirement: "Reach drainers on any mode.",
		highscore: 0
	},
	pacifist: {
		unlocked: false,
		name: "Pacifist",
		id: "pacifist",
		description: "Defeating enemies hurts you, but enemies have poison effect.",
		requirement: "Die with no points after a while.",
		highscore: 0
	},
	sandbox: {
		unlocked: false,
		name: "Sandbox",
		id: "sandbox",
		description: "Melt hoards of enemies with no threat - start with lots of EXP.",
		requirement: "Reach Healers on normal mode.",
		highscore: 0
	}
};

let tutorialOn = false;
let tutorialNum = 0;
let tutorial = [
	"Use arrows or WASD to move.\nClick to continue from tutorial screens.",
	"A Swarmer has appeared!\nTouch them to lower their health.\nBe careful of your health bar!",
	"Your EXP went up!\nGet enough EXP to level up\nand become stronger!",
	"This is a Drainer.\nThey slow your health regeneration,\nso don't let them build up!",
	"A Fuser has appeared!\nThey fuse with other enemies to\nachieve ludicrous speeds.",
	"This is a Regen.\nThey regenerate their health if\nyou don't finish them off.",
	"Healers heal adjacent enemies rather than\nthemselves."
];

let selectedMode = modes.normal;

let loadedFiles = 0;
let file2 = 0;
let file3 = 0;
let requiredFiles = 0;//number of files needed

let score = 0;

let frameDamage = 0;

let dt;

let enemies = [];

let player;

let swarm;

let hazeValue = 0;

let menu = "loading";

let menuVids = [];

let creditsBackground = [];

let mainSong;
let hurt;
let logo;

let sfxOn = true;

let g;

function setup() {
	canvas = createCanvas(600, 500);
	canvas.parent("game");
	frameRate(60);
	noStroke();
	
	gear = createGraphics(100, 100);
	
	gear.noStroke();
	gear.fill(178);
	for(let i = 0;i < 8;i ++) {
		gear.push();
		gear.translate(50, 50);
		gear.rotate(i * PI / 4);
		gear.translate(0, -34);
		gear.rect(-10, -10, 20, 20, 5);
		gear.pop();
	}
	gear.stroke(128);
	gear.strokeWeight(50);
	gear.noFill();
	gear.ellipse(50, 50, 20, 20);
	gear.stroke(178);
	gear.ellipse(50, 50, 10, 10);
	
	g = createGraphics(600, 500, WEBGL);
	
	swarmSpawner = new Clock(0, 1, 250, 50);
	swarmSpawner2 = new Clock(0, 20, 150, 50);
	swarmSpawner3 = new Clock(0, 50, 120, 50);
	drainSpawner = new Clock(1, 27, 350, 200);
	fuseSpawner = new Clock(2, 75, 200, 50);
	regenSpawner = new Clock(3, 160, 100, 50);
	healSpawner = new Clock(4, 120, 190, 70);
	
	//menuVids[0] = createVideo("Assets/menu1.webm", loaded);//requiredFiles ++;
	mainSong = loadSound("Assets/War%20of%20Spheres.mp3", done, error, file1Percent);requiredFiles ++;
	hurt = loadSound("Assets/Hit.wav", hurtDone, error, file2Percent);requiredFiles ++;
	logo = loadImage(logoPath, loadedFile, error);requiredFiles ++;
	
	/*mainSong = {
		loop: function(){},
		stop: function(){},
		isPlaying: function(){return true},
		volume: function(){}
	};*/
	
	//enemies.push(new Swarmer(1, random(0, 600), random(0, 500)));
	//enemies.push(new Swarmer(2, random(0, 600), random(0, 500)));
	//enemies.push(new Swarmer(3, random(0, 600), random(0, 500)));
	//enemies.push(new Swarmer(40, random(0, 600), random(0, 500)));
	
	player = new Player(width/2, height/2);
	
	noSmooth();
	
	if(typeof(Storage) !== "undefined") {
		if (localStorage.normal) {
			modes.normal.highscore = Number(localStorage.normal);
		} else {
			localStorage.normal = 0;
		}
		if (localStorage.easy) {
			modes.easy.highscore = Number(localStorage.easy);
		} else {
			localStorage.easy = 0;
		}
		if (localStorage.hard) {
			modes.hard.highscore = Number(localStorage.hard);
		} else {
			localStorage.hard = 0;
		}
		if (localStorage.impossible) {
			modes.impossible.highscore = Number(localStorage.impossible);
		} else {
			localStorage.impossible = 0;
		}
		if (localStorage.drain) {
			modes.drain.highscore = Number(localStorage.drain);
		} else {
			localStorage.drain = 0;
		}
		if (localStorage.pacifist) {
			modes.pacifist.highscore = Number(localStorage.pacifist);
		} else {
			localStorage.pacifist = 0;
		}
		if (localStorage.sandbox) {
			modes.sandbox.highscore = Number(localStorage.sandbox);
		} else {
			localStorage.sandbox = 0;
		}
		
		if (localStorage.nun) {//normal unlocked
			modes.normal.unlocked = (localStorage.nun === "true");
		} else {
			localStorage.nun = false;
		}
		if (localStorage.eun) {//normal unlocked
			modes.easy.unlocked = (localStorage.eun === "true");
		} else {
			localStorage.eun = false;
		}
		if (localStorage.hun) {//normal unlocked
			modes.hard.unlocked = (localStorage.hun === "true");
		} else {
			localStorage.hun = false;
		}
		if (localStorage.iun) {//normal unlocked
			modes.impossible.unlocked = (localStorage.iun === "true");
		} else {
			localStorage.iun = false;
		}
		if (localStorage.dun) {//normal unlocked
			modes.drain.unlocked = (localStorage.dun === "true");
		} else {
			localStorage.dun = false;
		}
		if (localStorage.pun) {//normal unlocked
			modes.pacifist.unlocked = (localStorage.pun === "true");
		} else {
			localStorage.pun = false;
		}
		if (localStorage.sun) {//normal unlocked
			modes.sandbox.unlocked = (localStorage.sun === "true");
		} else {
			localStorage.sun = false;
		}
		
		if (localStorage.tutorial) {//normal unlocked
			tutorialNum = Number(localStorage.tutorial);
		} else {
			localStorage.tutorial = 0;
		}
	}
}

function reset() {
	hazeValue = 0;
	
	roundsPlayed ++;
	enemies = [];
	score = 0;
	
	swarmSpawner = new Clock(0, 0, 250, 50);
	swarmSpawner2 = new Clock(0, 20, 190, 50);
	swarmSpawner3 = new Clock(((mode === "hard"||mode==="impossible"||mode ==="sandbox")?5:0), 60, 120, 50);
	drainSpawner = new Clock(1, 27 - ((mode==="drain")?22:0), 350, 200);
	fuseSpawner = new Clock(2, 75, 200, 50);
	regenSpawner = new Clock(3, 160, 100, 40);
	healSpawner = new Clock(4, 120, 190, 70);
	
	player = new Player(width/2, height/2);
}

let mainButtonRadius = 80;
let creditsButtonRadius = 60;
let settingsButtonRadius = 60;
let introWait = 0;

function draw() {
	if(typeof(Storage) !== "undefined") {
		localStorage.normal = modes.normal.highscore;
		localStorage.easy = modes.easy.highscore;
		localStorage.hard = modes.hard.highscore;
		localStorage.impossible = modes.impossible.highscore;
		localStorage.drain = modes.drain.highscore;
		localStorage.pacifist = modes.pacifist.highscore;
		localStorage.sandbox = modes.sandbox.highscore;
		
		localStorage.nun = modes.normal.unlocked;
		localStorage.eun = modes.easy.unlocked;
		localStorage.hun = modes.hard.unlocked;
		localStorage.iun = modes.impossible.unlocked;
		localStorage.dun = modes.drain.unlocked;
		localStorage.pun = modes.pacifist.unlocked;
		localStorage.sun = modes.sandbox.unlocked;
		
		localStorage.tutorial = tutorialNum;
	}
	
	if(menu === "game") {
		if(mode === "normal" && score > modes.normal.highscore) {
			modes.normal.highscore = score;
		}
		if(mode === "hard" && score > modes.hard.highscore) {
			modes.hard.highscore = score;
		}
		if(mode === "impossible" && score > modes.impossible.highscore) {
			modes.impossible.highscore = score;
		}
		if(mode === "drain" && score > modes.drain.highscore) {
			modes.drain.highscore = score;
		}
		if(mode === "pacifist" && score > modes.pacifist.highscore) {
			modes.pacifist.highscore = score;
		}
		if(mode === "easy" && score > modes.easy.highscore) {
			modes.easy.highscore = score;
		}
		if(mode === "sandbox" && score > modes.sandbox.highscore) {
			modes.sandbox.highscore = score;
		}
	}
	
	dt = min(deltaTime/15, 7);
	
	if(unlockedTime > 0)
		unlockedTime --;
	
	/*if(!mainSong.isPlaying() && menu === "menu") {
		mainSong.loop();
	}*/
	
	if(menu === "loading") {
		background(0);
		fill(255);
		textSize(50);
		text("Loading" + "...".substring(0, floor(frameCount/10) % 4), 10, 50);
		if(requiredFiles > 0)
			text((floor((loadedFiles+file2 + file3)/requiredFiles*100)) + "%", 10, 100);
		
		if(loadedFiles+file2+file3 >= requiredFiles) {
			/*if(mouseIsPressed && mouseX > 220 && mouseX < 380 && mouseY > 200 && mouseY < 260)
				menu = "intro";*/
			fill(178);
			rect(220, 200, 160, 60, 4);
			fill(0 + (mouseX > 220 && mouseX < 380 && mouseY > 200 && mouseY < 260)?100:0);
			textAlign(CENTER);
			text("Start", 295, 245);
			textAlign(LEFT);
		}
		
		if(logoPath === "") {
			file2 = 1;
		}
	}
	if(menu === "intro") {
		background(0);
		
		//display Cool Math Games intro here
		
		//try {
			//imageAlign(CENTER);
			image(logo, 0, 0, 600, 500);
		//} catch(ex) {}
		if(logoPath === "") {
			introWait = 241;
		}
		
		//image(gear, 100, 100);
		
		introWait ++;
		
		if(introWait > logoLength) {
			
			menu = "menu";
		}
	}
	if(menu === "settings") {
		if(dist(mouseX, mouseY, 0, 250)<100 && mouseIsPressed)
			menu = "menu";
		
		background(11, 152, 35);
		
		if(creditsBackground.length < 40) {
			creditsBackground.push({x:random(0, 600), y:random(-600, -50), speed:random(1, 5)});
		}
		
		fill(50, 255, 50, 100);
		for(let i = creditsBackground.length-1;i >= 0;i --) {
			push();
			translate(creditsBackground[i].x, creditsBackground[i].y);
			rotate(frameCount/20 + creditsBackground[i].x/100);
			image(gear, 0, 0, 30, 30);
			pop();
			creditsBackground[i].y += creditsBackground[i].speed;
			creditsBackground[i].x += 1.2*sin(frameCount/10 + creditsBackground[i].x/100);
			if(creditsBackground[i].y > 540) {
				creditsBackground.splice(i, 1);
			}
		}
		
		fill(0, 120, 0, 150);
		rect(0, 100, 600, 95);
		
		fill(0);
		textSize(50);
		textAlign(CENTER);
		text("Settings", 300, 70);
		textAlign(LEFT);
		
		textSize(20);
		text("Volume:", 420, 160);
		
		fill(50, 255, 50, 100);
		for(let i = 0;i < 5;i ++) {
			rect(500 + 11*i, 150 - 5*i, 10, 10 + 5*i);
		}
		fill(50, 255, 200);
		for(let i = 0;i < gameSetting.volume;i ++) {
			rect(500 + 11*i, 150 - 5*i, 10, 10 + 5*i);
		}
		if(mouseIsPressed && mouseX > 500 && mouseX < 555 && mouseY > 125 && mouseY < 160 && gameSetting.volume !== ceil((mouseX - 500)/11)) {
			gameSetting.volume = ceil((mouseX - 500)/11);
			mainSong.setVolume((gameSetting.volume-1)/4);
			hurt.setVolume((gameSetting.volume-1)/4);
		}
		
		fill(50, 50, 80);
		textSize(20 + ((mouseX>80 && mouseX < 258 && mouseY > 135 && mouseY < 160)?5:0));
		text("Screen haze: " + gameSetting.screenHaze, 80 - ((mouseX>80 && mouseX < 258 && mouseY > 135 && mouseY < 160)?20:0), 150);
		textSize(18);
		text("(Red warning effect)", 60, 180);
		
		textAlign(CENTER);
		fill(0);
		textSize(20 + ((mouseX > 265 && mouseX < 335 && mouseY > 120 && mouseY < 150)?5:0));
		text("SFX: " + (sfxOn?"On":"Off"), 300, 140);
		textAlign(LEFT);
		
		fill(128);
		rect(250, 200, 100, 100, 10);
		
		fill(128 - (dist(mouseX, mouseY, 230, 250) < 20?64:0));
		rect(220, 235, 20, 30, 3);
		
		fill(128 - (dist(mouseX, mouseY, 370, 250) < 20?64:0));
		rect(360, 235, 20, 30, 3);
		
		fill(128 - (selectedMode.unlocked?(dist(mouseX, mouseY, 255, 340) + dist(mouseX, mouseY, 345, 340) < 100?64:0):0));
		rect(250, 320, 100, 30, 4);
		
		stroke(255);
		strokeWeight(2)
		line(225, 250, 235, 240);
		line(225, 250, 235, 260);
		
		line(375, 250, 365, 240);
		line(375, 250, 365, 260);
		noStroke();
		
		fill(0);
		textSize(20);
		textAlign(CENTER);
		text(selectedMode.description, 300, 400);
		text(selectedMode.name, 300, 290);
		text("High Score: " + floor(selectedMode.highscore), 300, 316);
		text(selectedMode.unlocked?(mode===selectedMode.id?"Selected":"Select"):"Locked", 300, 345);
		if(!selectedMode.unlocked)
			text("To unlock: " + selectedMode.requirement, 300, 430);
		
		textAlign(LEFT);
		
		fill(255, 50, 50);
		ellipse(0, 250, 100);
		
		fill(0);
		textSize(15);
		text("Back", 0, 255);
		
		if(!selectedMode.unlocked) {
			noFill();
			stroke(100);
			strokeWeight(10);
			ellipse(300, 240, 20, 30);
			noStroke();
			fill(80);
			rect(280, 240, 40, 30, 5);
		} else {
			if(selectedMode === modes.normal) {
				fill(255, 50, 50);
				ellipse(300, 250, 40, 40);
			}
			if(selectedMode === modes.easy) {
				fill(0, 0, 178);
				ellipse(300, 250, 40, 40);
			}
			if(selectedMode === modes.hard) {
				fill(190, 50, 50);
				ellipse(300, 250, 40, 40);
			}
			if(selectedMode === modes.impossible) {
				fill(150, 50, 50);
				ellipse(300, 250, 40, 40);
			}
			if(selectedMode === modes.drain) {
				fill(255, 255, 50);
				ellipse(300, 250, 20, 20);
			}
			if(selectedMode === modes.pacifist) {
				fill(255, 0, 0);
				//ellipse(290, 230, 20, 20);
				//ellipse(310, 230, 20, 20);
				noFill();
				stroke(255, 0, 0);
				strokeWeight(20);
				line(290, 235, 300, 250);
				line(310, 235, 300, 250);
				noStroke();
			}
			if(selectedMode === modes.sandbox) {
				fill(255, 50, 50);
				ellipse(300, 235, 40, 40);

				fill(255, 255, 50);
				for(let i = 0;i < 50;i ++) {
					ellipse(275+i, 245+5*sin(i*3/20+2/5), 10);
				}
				rect(270, 245, 60, 20, 7);
			}
		}
	}
	if(menu === "credits") {
		if(dist(mouseX, mouseY, 600, 250)<100 && mouseIsPressed)
			menu = "menu";
		
		background(11, 152, 35);
		
		if(creditsBackground.length < 40) {
			creditsBackground.push({x:random(0, 600), y:random(-600, 0), speed:random(1, 5)});
		}
		
		fill(50, 255, 50, 100);
		for(let i = creditsBackground.length-1;i >= 0;i --) {
			ellipse(creditsBackground[i].x, creditsBackground[i].y, 20, 20);
			creditsBackground[i].y += creditsBackground[i].speed;
			creditsBackground[i].x += sin(frameCount/10 + creditsBackground[i].x/100);
			if(creditsBackground[i].y > 510) {
				creditsBackground.splice(i, 1);
			}
		}
		
		fill(0);
		textSize(50);
		textAlign(CENTER);
		
		text("Credits", 300, 70);
		
		textSize(20);
		text("Game made by Justin Wise", 300, 150);
		text("Music: Musenet\nPayne, Christine. \"MuseNet.\" OpenAI, 25\nApr. 2019, openai.com/blog/musenet", 300, 180);
		
		textSize(30);
		text("Special thanks to:", 300, 300);
		textSize(20);
		text("p5.js library", 300, 330);
		text("audiotrimmer.com", 300, 370);
		text("bfxr.net", 300, 410);
		text("You, for playing this game!", 300, 450);
		
		textAlign(LEFT);
		
		if(keyIsDown(76) && keyIsDown(67) && keyIsDown(75) && (!modes.easy.unlocked || !modes.hard.unlocked || !modes.impossible.unlocked || !modes.pacifist.unlocked || !modes.sandbox.unlocked || !modes.drain.unlocked)) {//lock
			modes.easy.unlocked = true;
			modes.hard.unlocked = true;
			modes.impossible.unlocked = true;
			modes.pacifist.unlocked = true;
			modes.sandbox.unlocked = true;
			modes.drain.unlocked = true;
		}
		
		fill(255, 50, 50);
		ellipse(600, 250, 100);
		
		fill(0);
		textSize(15);
		text("Back", 565, 255);
	}
	if(menu === "menu") {
		background(11, 152, 35);
		if(readyPlay > -1) {
			mainSong.loop();
			readyPlay = -1;
		}
		
		mainButtonRadius = mainButtonRadius + ((dist(mouseX, mouseY, 300, 250)<mainButtonRadius?110:80)-mainButtonRadius)/20;
		creditsButtonRadius = creditsButtonRadius + ((dist(mouseX, mouseY, 150, 350)<creditsButtonRadius?90:60)-creditsButtonRadius)/20;
		settingsButtonRadius = settingsButtonRadius + ((dist(mouseX, mouseY, 450, 350)<settingsButtonRadius?90:60)-settingsButtonRadius)/20;
		
		g.clear();
		
		g.stroke(0, 0, 178);
		g.noFill();
		g.push();
		g.translate(0, 0);
		g.rotateY(frameCount/40);
		g.sphere(mainButtonRadius);
		g.pop();
		
		g.stroke(0);
		g.push();
		g.translate(-150, 100);
		g.rotateY(frameCount/40);
		g.sphere(creditsButtonRadius);
		g.pop();
		
		g.stroke(255, 50, 50);
		g.push();
		g.translate(150, 100);
		g.rotateY(frameCount/40);
		g.sphere(settingsButtonRadius);
		g.pop();
		
		image(g, 0, 0);
		
		fill(255, 50, 50);
		textSize(80);
		textAlign(CENTER);
		text("War of", 300, 60);
		fill(0, 0, 178);
		text("Spheres", 300, 130);
		
		fill(255);
		text("Play", 300, 275);
		textSize(30);
		text("Credits", 150, 365);
		text("Settings/\nOther", 450, 350);
		
		textAlign(LEFT);
	}
	if(menu === "paused") {
		background(11, 152, 35);




		for(let i = enemies.length-1;i >= 0;i --) {
			enemies[i].draw();
		}

		player.draw();

		player.drawHUD();
		
		
		//text(fuseSpawner.startBuffer, 100, 120);
		
		//frameDamage -= player.HP;
		//text(frameDamage/player.HP, 100, 100);
		
		if(gameSetting.screenHaze) {
			screenHaze();
		}
		
		fill(128, 128, 128, 128);
		rect(0, 0, 600, 500);
		
		fill(255);
		textAlign(CENTER);
		textSize(30);
		let current;
		switch(mode) {
			case "normal":
				current = "Normal";
				break;
			case "easy":
				current = "Easy";
				break;
			case "hard":
				current = "Hard";
				break;
			case "impossible":
				current = "Impossible";
				break;
			case "drain":
				current = "Deflation";
				break;
			case "pacifist":
				current = "Pacifist";
				break;
			case "sandbox":
				current = "Sandbox";
				break;
		}
		text(current + " mode", 300, 100);
		textSize(30 + 10*(dist(mouseX, mouseY, 200, 250) < 50?1:0));
		text("Resume", 200, 250);
		textSize(30 + 10*(dist(mouseX, mouseY, 400, 250) < 50?1:0));
		text("Main\nMenu", 400, 235);
		textAlign(LEFT);
	}
	if(menu === "game") {
		enemies.sort((a, b) => {return a.y-b.y});
		
		if(!tutorialOn) {
		
			frameDamage = player.HP;//Make red screen when taking high damage

			swarmSpawner.run();
			swarmSpawner2.run();
			swarmSpawner3.run();
			drainSpawner.run();
			fuseSpawner.run();
			regenSpawner.run();
			healSpawner.run();
			
			if(tutorialNum === 0) {
				tutorialOn = true;
			}
			if(tutorialNum === 1 && enemies.length === 1) {
				tutorialOn = true;
			}
			if(tutorialNum === 2 && player.EXP === 1) {
				tutorialOn = true;
			}
			if(tutorialNum === 3 && drainSpawner.spawned) {
				tutorialOn = true;
			}
			if(tutorialNum === 4 && fuseSpawner.spawned) {
				tutorialOn = true;
			}
			if(tutorialNum === 5 && regenSpawner.spawned) {
				tutorialOn = true;
			}
			if(tutorialNum === 6 && healSpawner.spawned) {
				tutorialOn = true;
			}

			player.run();

			for(let i = enemies.length-1;i >= 0;i --) {
				enemies[i].run(player);
				for(let u = enemies.length-1;u >= 0;u --) {
					if(i !== u) {
						if(enemies[u].y <= enemies[i].y - enemies[i].radius - 20) {
							break;
						} else {
							enemies[i].collideEntity(enemies[u]);
						}
					}
				}
				if(enemies[i].HP <= 0) {
					//player.EXP += floor(log(0.8 * enemies[i].level * enemies[i].level * enemies[i].level + 20)/2 + enemies[i].level/3);
					player.EXP += enemies[i].level * 0.7 + 0.3;
					score += enemies[i].level * enemies[i].value();
					enemies.splice(i, 1);
				}
			}
			
			player.constrain();
			
		}
		
		if(keyIsDown(80))
			menu = "paused";

		background(11, 152, 35);




		for(let i = 0;i < enemies.length;i ++) {
			enemies[i].draw();
		}

		player.draw();

		player.drawHUD();
		
		
		//text(fuseSpawner.startBuffer, 100, 120);
		
		frameDamage -= player.HP;
		
		if(gameSetting.screenHaze) {
			screenHaze();
		}
		
		if(tutorialOn) {
			
			fill(0, 0, 0, 150);
			rect(0, 0, 600, 500);
			
			fill(255);
			textSize(25);
			text(tutorial[tutorialNum], 50, 100);
			
			if(mouseIsPressed) {
				tutorialNum ++;
				tutorialOn = false;
			}
			
		}
		
		if(player.HP <= 0) {
			menu = "dead";
		}
	}
	if(!tutorialOn && menu === "game") {
		if(roundsPlayed >= 3 && !modes.easy.unlocked && mode === "normal") {
			modes.easy.unlocked = true;
			unlockedTime = 160;
			unlockedText = "Easy mode unlocked!";
		}

		if(drainSpawner.spawned && !modes.drain.unlocked) {
			modes.drain.unlocked = true;
			unlockedTime = 160;
			unlockedText = "Deflation mode unlocked!";
		}

		if(score >= 5000 && !modes.hard.unlocked && mode === "normal") {
			modes.hard.unlocked = true;
			unlockedTime = 160;
			unlockedText = "Hard mode unlocked!";
		}

		if(healSpawner.spawned && !modes.impossible.unlocked && mode === "hard") {
			modes.impossible.unlocked = true;
			unlockedTime = 160;
			unlockedText = "Impossible mode unlocked!";
		}
		
		if(healSpawner.spawned && !modes.sandbox.unlocked && mode === "normal") {
			modes.sandbox.unlocked = true;
			unlockedTime = 160;
			unlockedText = "Sandbox mode unlocked!";
		}
	}
	
	if(menu === "dead" && score === 0 && !modes.pacifist.unlocked && swarmSpawner.level >= 3) {
		modes.pacifist.unlocked = true;
		unlockedTime = 160;
		unlockedText = "Pacifist mode unlocked!";
	}
	
	if(menu === "credits" && modes.easy.unlocked && modes.hard.unlocked && modes.impossible.unlocked && modes.drain.unlocked && modes.pacifist.unlocked && modes.sandbox.unlocked && !cheated && unlockedTime === 0) {
		cheated = true;
		unlockedTime = 300;
		unlockedText = "All modes unlocked!\nPress L, C, and K at the same time\nin this menu to unlock them if you restart.";
		tutorialNum = 10;
	}
	
	if(menu === "dead") {
		background(11, 152, 35);
		
		
		
		
		for(let i = enemies.length-1;i >= 0;i --) {
			enemies[i].draw();
		}

		player.draw();

		player.drawHUD();
		
		
		//text(fuseSpawner.startBuffer, 100, 120);
		
		//frameDamage -= player.HP;
		//text(frameDamage/player.HP, 100, 100);
		
		if(gameSetting.screenHaze) {
			screenHaze();
		}
		
		fill(255, 128, 128, 128);
		rect(0, 0, 600, 500);
		
		
		textAlign(CENTER);
		textSize(40);
		fill(178, 0, 0);
		text("You Lost", 300, 100);
		textSize(20);
		text("Final Score:\n" + score, 300, 150);
		fill(255);
		textSize(30 + 10*(dist(mouseX, mouseY, 200, 250) < 50?1:0));
		text("Retry", 200, 250);
		textSize(30 + 10*(dist(mouseX, mouseY, 400, 250) < 50?1:0));
		text("Main\nMenu", 400, 235);
		textAlign(LEFT);
	}
	
	if(unlockedTime > 0) {
		fill(0, 150);
		rect(0, min(3*unlockedTime-180, 0), 600, 150);
		fill(255);
		textSize(30);
		textAlign(CENTER);
		text(unlockedText, 300, min(3*unlockedTime-180, 0)+60);
		textAlign(LEFT);
	}
}

function screenHaze() {//Warns the player when they are about to die
	let damageVariant = frameDamage/player.HP*300;
	if(damageVariant < 180)
		damageVariant = 0;
	let healthVariant = min((0.3-player.HP/player.maxHP)/0.4*300, 300);
	
	hazeValue -= 2;
	hazeValue = min(100, max(hazeValue, max(healthVariant, damageVariant)));
	
	fill(150, 0, 0, hazeValue);
	rect(0, 0, width, height);
}

function displayNumber(num) {
	if(num < 1000) {
		return floor(num) + "";
	} else if(num < 1000000) {
		return floor(num/100)/10 + "k";
	} else if(num < 1000000000) {
		return floor(num/100000)/10 + "m";
	} else {
		return floor(num/100000000)/10 + "b";
	}
}


function loadedFile() {
	file2 = 1;
}

function mouseClicked() {
	//hurt.play();
	if(menu === "loading") {
		if(loadedFiles+file2+file3 >= requiredFiles) {
			if(mouseX > 220 && mouseX < 380 && mouseY > 200 && mouseY < 260)
				menu = "intro";
		}
	}
	if(menu === "paused") {
		if(dist(mouseX, mouseY, 200, 250) < 50)
			menu = "game";
		if(dist(mouseX, mouseY, 400, 250) < 50)
			menu = "menu";
	} else if(menu === "dead") {
		if(dist(mouseX, mouseY, 200, 250) < 50) {
			reset();
			menu = "game";
		}
		if(dist(mouseX, mouseY, 400, 250) < 50)
			menu = "menu";
	} else if(menu === "menu") {
		if(dist(mouseX, mouseY, 300, 250)<mainButtonRadius) {
			reset();
			menu = "game";
		}
		if(dist(mouseX, mouseY, 150, 350)<mainButtonRadius)
			menu = "credits";
		if(dist(mouseX, mouseY, 450, 350)<mainButtonRadius)
			menu = "settings";
	}
	if(menu === "settings") {
		if(dist(mouseX, mouseY, 230, 250) < 20) {
			if(selectedMode === modes.pacifist) {
				selectedMode = modes.drain;
			} else if(selectedMode === modes.drain) {
				selectedMode = modes.impossible;
			} else if(selectedMode === modes.impossible) {
				selectedMode = modes.hard;
			} else if(selectedMode === modes.hard) {
				selectedMode = modes.easy;
			} else if(selectedMode === modes.easy) {
				selectedMode = modes.normal;
			} else if(selectedMode === modes.normal) {
				selectedMode = modes.sandbox;
			} else if(selectedMode === modes.sandbox) {
				selectedMode = modes.pacifist;
			}
		}
		if(dist(mouseX, mouseY, 370, 250) < 20) {
			if(selectedMode === modes.sandbox) {
				selectedMode = modes.normal;
			} else if(selectedMode === modes.normal) {
				selectedMode = modes.easy;
			} else if(selectedMode === modes.easy) {
				selectedMode = modes.hard;
			} else if(selectedMode === modes.hard) {
				selectedMode = modes.impossible;
			} else if(selectedMode === modes.impossible) {
				selectedMode = modes.drain;
			} else if(selectedMode === modes.drain) {
				selectedMode = modes.pacifist;
			} else if(selectedMode === modes.pacifist) {
				selectedMode = modes.sandbox;
			}
		}
		if(dist(mouseX, mouseY, 255, 340) + dist(mouseX, mouseY, 345, 340) < 100 && selectedMode.unlocked) {//select mode
			mode = selectedMode.id;
		}
		if(mouseX>80 && mouseX < 258 && mouseY > 135 && mouseY < 160) {
			gameSetting.screenHaze = !gameSetting.screenHaze;
		}
		if(mouseX > 265 && mouseX < 335 && mouseY > 120 && mouseY < 150) {
			sfxOn = !sfxOn;
		}
	}
}

function done() {
	loadedFiles = 1;
}

function hurtDone() {
	file3 = 1;
}

function file1Percent(p) {
	loadedFiles = p;
}

function file2Percent(p) {
	file3 = p;
}

function error() {
	
}

class Clock {
	constructor(type=0, startBuffer=0, wait=300, minWait=50) {
		this.startBuffer = startBuffer;
		this.level = 1;//what level enemies spawn
		this.levelup = 0;//counts how many spawns before leveling up
		this.wait = wait;//how many frames between spawning
		if(mode === "hard" || mode === "impossible") {
			this.wait *= 2/3;
			this.wait = floor(this.wait);
			this.minWait /= 2;
			this.minWait = floor(this.minWait);
		}
		this.minWait = minWait;//fastest spawn speed
		this.waiting = 0;//counts frames passed
		this.type = type;
		this.spawned = false;
		if(mode === "sandbox") {
			this.wait = this.minWait/2;
			this.wait = floor(this.wait);
			this.minWait /= 2;
			this.minWait = floor(this.minWait);
			this.startBuffer /= 2;
			this.startBuffer = floor(this.startBuffer);
		}
	}
	
	run() {
		if(enemies.length < 150) {
			this.waiting ++ * dt;
			if(enemies.length === 0 && this.wait > this.minWait && this.startBuffer === 0) {
				this.waiting += 2 * dt;
				if(this.waiting % 100 < 3) {
					this.wait --;
				}
			}

			if(this.waiting >= this.wait) {//if waited long enough, try to spawn an enemy
				if(this.startBuffer === 0) {//check to make sure this clock has started yet
					if(this.levelup > min(10 + floor(this.level/3), 15)) {//level up after enough spawned enemies
						this.levelup = 0;
						this.level ++;
					}
					if(this.levelup % 2 === 1 && this.wait > this.minWait) {
						this.wait --;
					}

					this.levelup ++;
					this.waiting = 0;
					let x = random(0, 600);
					let y = random(80, 500);
					while(dist(x, y, player.x, player.y) < player.radius + 50) {
						x = random(0, 600);
						y = random(80, 500);
					}
					
					this.spawned = true;
					switch(this.type) {
						case 0:
							enemies.push(new Swarmer(this.level, x, y));
							break;
						case 1:
							enemies.push(new Drainer(this.level, x, y));
							break;
						case 2:
							enemies.push(new Fuser(this.level, x, y));
							break;
						case 3:
							enemies.push(new Regener(this.level, x, y));
							break;
						case 4:
							enemies.push(new Healer(this.level, x, y));
							break;
						case 5:
							enemies.push(new Shifter(this.level, x, y));
					}
				} else {
					this.startBuffer --;
					this.waiting = 0;
				}
			}
		}
	}
}

class Entity {
	constructor(x, y, radius) {
		this.x = x;	
		this.y = y;
		this.radius = radius;
	}
	
	draw() {
		
	}
	
	run() {
		
	}
	
	constrain() {
		this.x = constrain(this.x, this.radius, width-this.radius);
		this.y = constrain(this.y, this.radius, height-this.radius);
	}
	
	static collide(ent1, ent2) {
		if(dist(ent1.x, ent1.y, ent2.x, ent2.y) < ent1.radius + ent2.radius)//check if distance is close enough to touch
			return true;
		return false;
	}
}

class Player extends Entity {
	constructor(x=0, y=0) {
		super(x, y, 25);
		
		this.speed = 1;
		this.EXP = (mode==="sandbox"?47420:0);
		this.maxEXP = 10;
		this.HP = 10;
		this.maxHP = 10;
		this.defense = 0;
		this.regen = 1 * (mode==="easy"?2:1);
		this.damage = 1;
		this.level = 1;
		this.regenPercent = 100;
	}
	
	levelUp() {
		if(this.speed < 5)
			this.speed += 0.1;
		this.maxHP += 9+floor(this.level*5/4);
		this.HP += 9+floor(this.level*5/4);
		this.regen += 0.45 * (mode==="easy"?2:1) * (mode==="impossible"?0:1) + (this.level > 16?this.maxHP/1000:0);
		this.damage += 0.2*this.level;
		this.defense = 1-(1-this.defense)*0.992;
		this.level ++;
	}
	
	draw() {
		fill(0, 0, 178);
		ellipse(this.x, this.y, this.radius*2);
	}
	
	drawHUD() {
		let visibility = 255;
		if(player.y < 120) {
			visibility -= (120 - player.y)*1.5;
		}
		
		textSize(15);
		blendMode(BLEND);
		fill(0, 0, 25, visibility);
		rect(10, 10, 150, 50, 15);
		
		fill(255, 0, 25, visibility);
		rect(20, 15, 130*this.HP/this.maxHP, 40, 10);
		fill(0, 255, 150, visibility);
		blendMode(EXCLUSION);
		text("HP: " + displayNumber(ceil(this.HP)) + "/" + displayNumber(ceil(this.maxHP)), 20, 45);
		blendMode(BLEND);
		
		fill(0, 0, 25, visibility);
		rect(170, 10, 150, 50, 15);
		
		fill(0, 0, 178, visibility);
		rect(180, 15, 130*this.EXP/this.maxEXP, 40, 10);
		fill(255, 255, 0, visibility);
		blendMode(EXCLUSION);
		text("EXP: " + displayNumber(this.EXP) + "/" + displayNumber(ceil(this.maxEXP)), 180, 45);
		blendMode(BLEND);
		
		textSize(30);
		fill(0, 0, 25);
		text("Level: " + this.level, 320, 25);
		
		text("Points: " + displayNumber(score), 320, 70);
	}
	
	emergencyDefense() {
		if(this.HP/this.maxHP < 0.4) {
			return 0.25;
		} else {
			return 0;
		}
	}
	
	run() {
		//debug
		
		if(keyIsDown(16) && cheated)
			this.EXP += this.maxEXP/10;
		
		this.HP += this.regen/10 * this.regenPercent/100 * dt;
		this.HP = min(this.HP, this.maxHP);
		
		this.regenPercent = 100;//reset regen amount
		
		while(this.EXP >= this.maxEXP) {
			this.EXP -= this.maxEXP;
			this.maxEXP += floor(this.level*10/3);
			
			this.levelUp();
		}
		
		if(keyIsDown(37) || keyIsDown(65))
			this.x -= this.speed * dt;
		if(keyIsDown(39) || keyIsDown(68))
			this.x += this.speed * dt;
		if(keyIsDown(38) || keyIsDown(87))
			this.y -= this.speed * dt;
		if(keyIsDown(40) || keyIsDown(83))
			this.y += this.speed * dt;
		
		this.constrain();
	}
}

class Enemy extends Entity {
	constructor(x=0, y=0, radius=10, health=5, speed=1, damage=1, defense=0) {
		super(x, y, radius);
		
		this.level = 1;
		this.speed = speed;
		this.HP = health;
		this.maxHP = health;
		this.damage = damage;
		this.defense = defense;
		this.transparency = 255;
		this.size = 0;
		this.fused = false;
	}
	
	drawHP() {
		let widthHP = ceil(2.5*this.radius*this.HP/this.maxHP);
		fill(0, 255, 50);
		rect(this.x - widthHP/2, this.y + this.radius, widthHP, 10);
	}
	
	collideEntity(ent) {
		if(!Entity.collide(this, ent))
			return false;
		let angle = atan2(ent.y-this.y, ent.x-this.x);
		let error = ent.radius + this.radius - dist(ent.x, ent.y, this.x, this.y);
		this.x -= cos(angle) * error/2;//move me
		this.y -= sin(angle) * error/2;
		ent.x += cos(angle) * error/2;//move other entity
		ent.y += sin(angle) * error/2;
		return true;
	}
	
	collidePlayer(player) {
		if(!Entity.collide(this, player))
			return false;
		let angle = atan2(player.y-this.y, player.x-this.x);
		let error = player.radius + this.radius - dist(player.x, player.y, this.x, this.y) + 10;
		this.x -= cos(angle) * error/2;//move me
		this.y -= sin(angle) * error/2;
		player.x += cos(angle) * error/2;//move player
		player.y += sin(angle) * error/2;
		
		this.HP -= player.damage - player.damage * this.defense;//damage each other
		player.HP -= this.damage - this.damage * min(player.defense + player.emergencyDefense(), 0.9);
		
		if(mode === "pacifist" && this.HP <= 0) {
			player.HP -= player.maxHP/3;
		}
		
		if(sfxOn) {
			hurt.play();
		}
		
		return true;
	}
}

class Swarmer extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.size = 3;
		this.setStats(level);
	}
	
	value() {
		return 1;
	}
	
	setStats(level) {
		this.level = level;
		//this.radius += level/20;
		this.speed = min(level/10+0.9, 5);
		this.HP = 3+level*3;
		this.maxHP = 3+level*3;
		this.damage = 1.2*level+1.8 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.99, level-1);
	}
	
	draw() {
		fill(255, 50, 50, this.transparency);
		ellipse(this.x, this.y, this.radius*2);
		
		fill(0);
		textSize(12);
		textAlign(CENTER);
		text(this.level, this.x, this.y+5);
		textAlign(LEFT);
		this.drawHP();
	}
	
	run(player) {
		this.x = this.x + (player.x - this.x)/500*this.speed * dt;
		this.y = this.y + (player.y - this.y)/500*this.speed * dt;
		
		this.constrain();
		this.collidePlayer(player);
		
		if(mode === "pacifist") {
			this.HP -= this.maxHP/1000;
		}
	}
}

class Drainer extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.size = 5;
		this.radius = 5;
		this.setStats(level);
	}
	
	value() {
		return 3;
	}
	
	setStats(level) {
		this.level = level;
		//this.radius += level/30;
		this.speed = 0.2;
		this.HP = 5+level*5;
		this.maxHP = 5+level*5;
		this.damage = 1 + (mode==="pacifist"?6*this.level:0);
		this.defense = 0.2;
	}
	
	draw() {
		fill(255, 255, 50);
		ellipse(this.x, this.y, this.radius*2);
		
		stroke(255, 255, 90, 100*sin(frameCount/20 + this.x/100 + this.y/100) + 100);
		strokeWeight(1 + min(10, (90 - (85*(mode==="drain"?1:0)))*this.level/player.level/100*19));
		line(this.x, this.y, player.x, player.y);
		noStroke();
		
		//fill(0);
		//text(this.HP, this.x, this.y);
		this.drawHP();
	}
	
	run(player) {
		let angle = atan2(this.y - player.y, this.x - player.x);
		this.x += cos(angle)*this.speed * dt;
		this.y += sin(angle)*this.speed * dt;
		
		player.regenPercent -= (90 - (85*(mode==="drain"?1:0)))*this.level/player.level;
		player.regenPercent = max(0, player.regenPercent);
		
		if(mode === "drain")
			this.HP = this.maxHP;
		
		this.constrain();
		this.collidePlayer(player);
		
		if(mode === "pacifist") {
			this.HP -= this.maxHP/1000;
		}
	}
}

class Fuser extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.size = 1;
		this.transparency = 128;
		this.radius = 15;
		this.setStats(level);
	}
	
	value() {
		return 3;
	}
	
	setStats(level) {
		this.level = level;
		//this.radius += level/10;
		this.speed = min(level/10+0.9, 5);
		this.HP = 15+level*7;
		this.maxHP = 15+level*7;
		this.damage = level+2.5 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.99, level-1);
	}
	
	draw() {
		fill(80, 25, 80, this.transparency);
		ellipse(this.x, this.y, this.radius*2);
		
		fill(0);
		textSize(12);
		textAlign(CENTER);
		text(this.level, this.x, this.y+5);
		textAlign(LEFT);
		this.drawHP();
	}
	
	run(player) {
		let angle = atan2(player.y - this.y, player.x - this.x);
		this.x += cos(angle)*this.speed * dt;
		this.y += sin(angle)*this.speed * dt;
		
		this.constrain();
		this.collidePlayer(player);
		
		if(mode === "pacifist") {
			this.HP -= this.maxHP/1000;
		}
	}
	
	collideEntity(ent) {
		if(!Entity.collide(this, ent))
			return false;
		let angle = atan2(ent.y-this.y, ent.x-this.x);
		let error = ent.radius + this.radius - dist(ent.x, ent.y, this.x, this.y);
		this.x += cos(angle) * error/50 * min(dt, 7);//move me
		this.y += sin(angle) * error/50 * min(dt, 7);
		ent.x -= cos(angle) * error/50 * min(dt, 7);//move other entity
		ent.y -= sin(angle) * error/50 * min(dt, 7);
		if(!(ent instanceof Fuser) && !(ent instanceof Healer)) {
			ent.collideEntity = this.collideEntityProto;
			ent.fused = true;
			//ent.transparency = 128;
		}
		this.run(player);
		return true;
	}
	
	collideEntityProto(ent) {
		if(!Entity.collide(this, ent))
			return false;
		let angle = atan2(ent.y-this.y, ent.x-this.x);
		let error = ent.radius + this.radius - dist(ent.x, ent.y, this.x, this.y);
		this.x += cos(angle) * error/50 * min(dt, 7);//move me
		this.y += sin(angle) * error/50 * min(dt, 7);
		ent.x -= cos(angle) * error/50 * min(dt, 7);//move other entity
		ent.y -= sin(angle) * error/50 * min(dt, 7);
		//ent.collideEntity = this.collideEntityProto;
		if(this.HP / this.maxHP > 0.25) {
			if(this instanceof Regener)
				this.HP -= this.maxHP / 40;
			this.HP -= this.maxHP / 500;
		}
		this.run(player);
		return true;
	}
}

class Regener extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.size = 2;
		this.radius = 11;
		this.setStats(level);
	}
	
	value() {
		return 5;
	}
	
	setStats(level) {
		this.level = level;
		//this.radius += level/30;
		this.speed = min(level/10+0.4, 4);
		this.HP = 25+level*8;
		this.maxHP = 25+level*8;
		this.damage = level/2+0.5 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.97, level-1);
	}
	
	draw() {
		fill(255, 255, 255, this.transparency);
		ellipse(this.x, this.y, this.radius*2);
		fill(255, 0, 25, this.transparency);
		rect(this.x - 7, this.y - 3, 14, 6);
		rect(this.x - 3, this.y - 7, 6, 14);
		
		fill(0);
		textSize(12);
		textAlign(CENTER);
		text(this.level, this.x, this.y+5);
		textAlign(LEFT);
		this.drawHP();
	}
	
	run(player) {
		let angle = atan2(player.y - this.y, player.x - this.x);
		this.x += cos(angle)*this.speed * dt;
		this.y += sin(angle)*this.speed * dt;
		
		if(this.HP < this.maxHP && mode !== "pacifist") {
			this.HP += this.maxHP/80;
		}
		if(this.HP > this.maxHP)
			this.HP = this.maxHP;
		
		this.constrain();
		this.collidePlayer(player);
		
		if(mode === "pacifist") {
			this.HP -= this.maxHP/1000;
		}
	}
}

class Healer extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.size = 0;
		this.radius = 19;
		this.setStats(level);
	}
	
	value() {
		return 4;
	}
	
	setStats(level) {
		this.level = level;
		//this.radius += level/10;
		this.speed = min(level/10+0.2, 3);
		this.HP = 35+6*level;
		this.maxHP = 35+6*level;
		this.damage = level+4.5 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.93, level-1);
	}
	
	draw() {
		fill(100, 255, 100);
		ellipse(this.x, this.y, this.radius*2);
		fill(255, 0, 90);
		rect(this.x - 17, this.y - 7, 34, 14);
		rect(this.x - 7, this.y - 17, 14, 34);
		
		fill(0);
		textSize(12);
		textAlign(CENTER);
		text(this.level, this.x, this.y+5);
		textAlign(LEFT);
		this.drawHP();
	}
	
	run(player) {
		let angle = atan2(player.y - this.y, player.x - this.x);
		this.x += cos(angle)*this.speed * dt;
		this.y += sin(angle)*this.speed * dt;
		
		this.constrain();
		this.collidePlayer(player);
		
		if(mode === "pacifist") {
			this.HP -= this.maxHP/1000;
		}
	}
	
	collideEntity(ent) {
		if(!Entity.collide(this, ent))
			return false;
		let angle = atan2(ent.y-this.y, ent.x-this.x);
		let error = ent.radius + this.radius - dist(ent.x, ent.y, this.x, this.y);
		if(ent instanceof Healer) {
			this.x -= cos(angle) * error/2;//move me
			this.y -= sin(angle) * error/2;
			ent.x += cos(angle) * error/2;//move other entity
			ent.y += sin(angle) * error/2;
		} else {
			this.x += cos(angle) * error/90 * dt;//move me
			this.y += sin(angle) * error/90 * dt;
		}
		
		if(!(ent instanceof Healer)) {
			if(ent.HP < ent.maxHP*2.1) {
				ent.HP += ent.maxHP/10;
			}
			if(ent.HP > ent.maxHP*2.1)
				ent.HP = ent.maxHP*2.1;
		}
		
		return true;
	}
}

class Shifter extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.size = 4;
		this.radius = 9;
		this.setStats(level);
	}
	
	value() {
		return 1;
	}
	
	setStats(level) {
		this.level = level;
		//this.radius += level/20;
		this.speed = min(level/7+1.3, 7);
		this.HP = 3+level*2;
		this.maxHP = 3+level*2;
		this.damage = 1.1*level+1.3 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.99, level-1);
	}
	
	draw() {
		fill(255*noise(frameCount/50+this.x/50), 255*noise(frameCount/51+this.y/50+10), 255*noise(frameCount/52+this.x/100+this.y/100+20), this.transparency);
		ellipse(this.x, this.y, this.radius*2);
		
		fill(0);
		textSize(12);
		textAlign(CENTER);
		text(this.level, this.x, this.y+5);
		textAlign(LEFT);
		this.drawHP();
	}
	
	run(player) {
		let angle = atan2(player.y - this.y, player.x - this.x) + PI/3;
		this.x += cos(angle)*this.speed * dt;
		this.y += sin(angle)*this.speed * dt;
		
		this.constrain();
		this.collidePlayer(player);
		
		if(mode === "pacifist") {
			this.HP -= this.maxHP/1000;
		}
	}
}
