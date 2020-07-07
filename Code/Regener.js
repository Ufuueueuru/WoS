class Regener extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.radius = 11;
		this.setStats(level);
	}
	
	value() {
		return 5;
	}
	
	setStats(level) {
		this.level = level;
		this.radius += level/30;
		this.speed = min(level/10+0.4, 4);
		this.HP = 25+level*8;
		this.maxHP = 25+level*8;
		this.damage = level/2+0.5 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.97, level-1);
	}
	
	draw() {
		fill(255, 255, 255);
		ellipse(this.x, this.y, this.radius*2);
		fill(255, 0, 25);
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