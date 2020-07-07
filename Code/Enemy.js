class Enemy extends Entity {
	constructor(x=0, y=0, radius=10, health=5, speed=1, damage=1, defense=0) {
		super(x, y, radius);
		
		this.level = 1;
		this.speed = speed;
		this.HP = health;
		this.maxHP = health;
		this.damage = damage;
		this.defense = defense;
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
		return true;
	}
}