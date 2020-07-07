class Fuser extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.radius = 15;
		this.setStats(level);
	}
	
	value() {
		return 3;
	}
	
	setStats(level) {
		this.level = level;
		this.radius += level/10;
		this.speed = min(level/10+0.9, 5);
		this.HP = 5+level*7;
		this.maxHP = 5+level*7;
		this.damage = level+2.5 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.99, level-1);
	}
	
	draw() {
		fill(80, 25, 80);
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
		if(!(ent instanceof Fuser) && !(ent instanceof Healer))
			ent.collideEntity = this.collideEntityProto;
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
		if(this.HP / this.maxHP > this.maxHP / 4) {
			if(this instanceof Regener)
				this.HP -= this.maxHP / 40;
			this.HP -= this.maxHP / 500;
		}
		this.run(player);
		return true;
	}
}
