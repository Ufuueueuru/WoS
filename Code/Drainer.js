class Drainer extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.radius = 5;
		this.setStats(level);
	}
	
	value() {
		return 3;
	}
	
	setStats(level) {
		this.level = level;
		this.radius += level/30;
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
		strokeWeight(8);
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
		
		player.regenPercent -= (90 - (80*(mode==="drain"?1:0)))*this.level/player.level;
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