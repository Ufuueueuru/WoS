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
		if(enemies.length < 200) {
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
					}
				} else {
					this.startBuffer --;
					this.waiting = 0;
				}
			}
		}
	}
}