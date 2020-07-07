let logoPath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUElEQVRYR+VXQRLDIAjEe/7/0tztQKOjVGDVeGoOyUyLCsuyYCKinImIbn79Puki4v8TG574ZqIsmxsO0HXwcA4o3xJYfWYj1sjNru8cQBdb6SpRoPsw8tUBaJGTpmUkOAXQ4ZqoFjeKkyB3vggAxl2Ejn2xQ4MSByDjBn7X/jQCkbPnEYjS9dcIoERtZR3WASi3k/BLb6lSvJtbtEpUQ+t7gXYCbVDaLgqmdYK7YaTtovGX3bK7Jj5zeHHEbMVl57KphYi2m5kb6jwwsWiF7dYwIxVxZNJBJ6hpBBbZvo3A0syI6AKCQFQlVoNCxAvjgAV7lI5XEEAP4SpSI/wrCCCbVB1pRAgu1ZADAIxDJ4F1MhVHOrCLQDRBJQ8BFMZzCEQEdEZ17dSwlJkzOxxwLyNR43qqBubA+O78/Dpowa5ytgQNEXCu7mVOGF7dwSr4ADVg8gBQq6EzAAAAAElFTkSuQmCC";
let logoLength = 240;

let readyPlay;

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
		requirement: "y r u hacking this is a small game???!?!?!?"
	},
	easy: {
		unlocked: false,
		name: "Easy",
		id: "easy",
		description: "You regenerate health more, so it's much easier to survive!",
		requirement: "Start 3 rounds on normal mode."
	},
	hard: {
		unlocked: false,
		name: "Hard",
		id: "hard",
		description: "Enemies spawn very fast - a much harder experience!",
		requirement: "Reach 5k points on normal mode."
	},
	impossible: {
		unlocked: false,
		name: "Impossible",
		id: "impossible",
		description: "No regen gained from leveling up = no way to survive.",
		requirement: "Reach Healers on hard mode."
	},
	drain: {
		unlocked: false,
		name: "Deflation",
		id: "drain",
		description: "Drainers cannot die! Expect a much shorter game.",
		requirement: "Reach drainers on any mode."
	},
	pacifist: {
		unlocked: false,
		name: "Pacifist",
		id: "pacifist",
		description: "Defeating enemies hurts you, but enemies have poison effect.",
		requirement: "Die with no points after a while."
	},
	sandbox: {
		unlocked: false,
		name: "Sandbox",
		id: "sandbox",
		description: "Melt hoards of enemies with no threat - start with lots of EXP.",
		requirement: "Reach Healers on normal mode."
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
let logo;

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
}

function reset() {
	hazeValue = 0;
	
	roundsPlayed ++;
	enemies = [];
	score = 0;
	
	swarmSpawner = new Clock(0, 0, 250, 50);
	swarmSpawner2 = new Clock(0, 20, 190, 50);
	swarmSpawner3 = new Clock(0, 60, 120, 50);
	drainSpawner = new Clock(1, 27, 350, 200);
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
	
	dt = deltaTime/15;
	
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
			text((floor((loadedFiles+file2)/requiredFiles*100)) + "%", 10, 100);
		
		if(loadedFiles+file2 >= requiredFiles)
			menu = "intro";
		
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
		if(mouseIsPressed && mouseX > 500 && mouseX < 555 && mouseY > 125 && mouseY < 160) {
			gameSetting.volume = ceil((mouseX - 500)/11);
			mainSong.setVolume((gameSetting.volume-1)/4);
		}
		
		fill(50, 50, 80);
		textSize(20 + ((mouseX>80 && mouseX < 280 && mouseY > 135 && mouseY < 160)?5:0));
		text("Screen haze: " + gameSetting.screenHaze, 80, 150);
		textSize(18);
		text("(recommended off in case of epilepsy)", 30, 180);
		
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
		text("You, for playing this game!", 300, 410);
		
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
		if(readyPlay > -1) {
			mainSong.loop();
			readyPlay = -1;
		}
		
		mainButtonRadius = mainButtonRadius + ((dist(mouseX, mouseY, 300, 250)<mainButtonRadius?110:80)-mainButtonRadius)/20;
		creditsButtonRadius = creditsButtonRadius + ((dist(mouseX, mouseY, 150, 350)<creditsButtonRadius?90:60)-creditsButtonRadius)/20;
		settingsButtonRadius = settingsButtonRadius + ((dist(mouseX, mouseY, 450, 350)<settingsButtonRadius?90:60)-settingsButtonRadius)/20;
		
		g.background(11, 152, 35);
		
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
		textSize(30 + 10*(dist(mouseX, mouseY, 200, 250) < 50?1:0));
		text("Resume", 200, 250);
		textSize(30 + 10*(dist(mouseX, mouseY, 400, 250) < 50?1:0));
		text("Main\nMenu", 400, 235);
		textAlign(LEFT);
	}
	if(menu === "game") {
		if(!tutorialOn) {
		
			frameDamage = player.HP;//Make red screen when taking high damage

			swarmSpawner.run();
			swarmSpawner2.run();
			swarmSpawner3.run();
			drainSpawner.run();
			fuseSpawner.run();
			regenSpawner.run();
			healSpawner.run();
			
			if(mode === "normal") {
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
			}

			player.run();

			for(let i = enemies.length-1;i >= 0;i --) {
				enemies[i].run(player);
				for(let u = enemies.length-1;u >= 0;u --) {
					if(i !== u)
						enemies[i].collideEntity(enemies[u]);
				}
				if(enemies[i].HP <= 0) {
					player.EXP += floor(log(0.8 * enemies[i].level * enemies[i].level * enemies[i].level + 20)/2 + enemies[i].level/3);
					score += enemies[i].level * enemies[i].value();
					enemies.splice(i, 1);
				}
			}
			
		}
		
		if(keyIsDown(80))
			menu = "paused";

		background(11, 152, 35);




		for(let i = enemies.length-1;i >= 0;i --) {
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
		unlockedTime = 120;
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
		if(mouseX>80 && mouseX < 280 && mouseY > 135 && mouseY < 160) {
			gameSetting.screenHaze = !gameSetting.screenHaze;
		}
	}
}

function done() {
	loadedFiles = 1;
}

function file1Percent(p) {
	loadedFiles = p;
	//alert(loadedFiles);
}

function error() {
	
}
