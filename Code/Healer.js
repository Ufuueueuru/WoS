class Healer extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.radius = 19;
		this.setStats(level);
	}
	
	value() {
		return 4;
	}
	
	setStats(level) {
		this.level = level;
		this.radius += level/10;
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