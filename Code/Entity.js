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