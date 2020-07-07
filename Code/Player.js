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
		this.maxHP += 6+floor(this.level*5/4);
		this.HP += 6+floor(this.level*5/4);
		this.regen += 0.45 * (mode==="easy"?2:1) * (mode==="impossible"?0:1);
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
		if(keyIsDown(16))
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