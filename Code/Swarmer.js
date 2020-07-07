class Swarmer extends Enemy {
	constructor(level=1, x=0, y=0) {
		super(x, y);
		
		this.setStats(level);
	}
	
	value() {
		return 1;
	}
	
	setStats(level) {
		this.level = level;
		this.radius += level/20;
		this.speed = min(level/10+0.9, 5);
		this.HP = 3+level*3;
		this.maxHP = 3+level*3;
		this.damage = 1.2*level+1.8 + (mode==="pacifist"?6*this.level:0);
		this.defense = 1 - Math.pow(0.99, level-1);
	}
	
	draw() {
		fill(255, 50, 50);
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