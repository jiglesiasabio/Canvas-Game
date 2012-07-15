

/*
mecánica del 'paseante'

cada mil ciclos de timer aparece un caminante que recorre el escenario de izda a dcha o viceversa, si le pillas te da un bonus de puntos

cada mil ciclos aparece, durante X siguientes ciclos recorre el escenario --->

de primeras hacer solo sentido --->


EL PASEANTE YA SE MUEVE, AHORA HAY QUE CONTROLAR LA COLISIÓN. Y LA PUNTUACIÓN




Ideas:

	-para hacer niveles de dificultad :
		-ajustar coliders, es decir, hacerlos mas finos para dificultar el coger cosas

Añadir un monstruo rojo que te persiga y si te toca te mate.



EL MOSNTRUO ROJO YA ESTÁ (100,100) AHORA HAY QUE HACER QUE SE MUEVA HACIA EL HÉROE...
FUNCIÓN 'DETERMINAR_DIRECCIÓN_MONSTRUO_ROJO'


*/


var time = 0;
var counter = 0;
var lifePoints = 3;

var gameOver = new Boolean();
gameOver = false;


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Green Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// red Monster image
var redMonsterReady = false;
var redMonsterImage = new Image();
redMonsterImage.onload = function () {
	redMonsterReady = true;
};
redMonsterImage.src = "images/monsterRed.png";


// Paseante image
var paseanteReady = false;
var paseanteImage = new Image();
paseanteImage.onload = function () {
	paseanteReady = true;
};
paseanteImage.src = "images/monje.gif";


// corazon image
var heartReady = false;
var heartImage = new Image();
heartImage.onload = function () {
	heartReady = true;
};
heartImage.src = "images/heart.png";


// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var redMonster = {
	speed:0.4
};
redMonster.x = 100;
redMonster.y = 100;


	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;



var paseanteActivo = new Boolean();
paseanteActivo = false;




var paseante = {
	speed: 0.8
};
paseante.x = -30;
paseante.y = 100;





var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	//hero.x = canvas.width / 2;
	//hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};


// Reset the game when the player catches a monster
var resetPaseante = function () {
	paseante.x = -30;
	paseante.y =  32 + (Math.random() * (canvas.height - 64));
	paseanteActivo = false;
};

// Reset the game when the player catches a monster
var resetRedMonster= function () {
	redMonster.x = 32 + (Math.random() * (canvas.height - 64));
	redMonster.y =  32 + (Math.random() * (canvas.height - 64));
	
};



// Determinar dirección monstruo rojo y moverlo
var moverMonstruoRojo = function () {
	if(redMonster.x <= hero.x){
		redMonster.x += redMonster.speed;
	}else{
		redMonster.x -= redMonster.speed;
	}	
	
	if(redMonster.y <= hero.y){

		redMonster.y += redMonster.speed;
	}else{

		redMonster.y -= redMonster.speed;
	}	
};



// Update game objects
var update = function (modifier) {


	if(!gameOver){
	moverMonstruoRojo();
	//Modificación para que los items no se puedan mover sobre el 'marco' de árboles (50pix)
	if (38 in keysDown) { // Player holding up
		if(hero.y >= 30){
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y <= 415){
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x >= 30){
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x <= 450){
			hero.x += hero.speed * modifier;
		}
	}

	if (paseanteActivo){
		paseante.x += paseante.speed;
	}

	// Are they touching? monster-hero
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		counter += 50;
		reset();
	}


	// Are they touching? paseante-hero
	if (
		hero.x <= (paseante.x + 32)
		&& paseante.x <= (hero.x + 32)
		&& hero.y <= (paseante.y + 32)
		&& paseante.y <= (hero.y + 32)
	) {
		//subir bonus al contador --->>>  ++monstersCaught;
		counter += 150;
		resetPaseante();
		
	}


	// Are they touching? redMonster-hero
	if (
		hero.x <= (redMonster.x + 22)
		&& redMonster.x <= (hero.x + 22)
		&& hero.y <= (redMonster.y + 22)
		&& redMonster.y <= (hero.y + 22)
	) {
		//subir bonus al contador --->>>  ++monstersCaught;
		lifePoints--;
		resetRedMonster();
		
	}

}//game over?
};


// Draw contador corazones
var renderContador = function () {
	if (heartReady) {

		if(lifePoints == 3){
			ctx.drawImage(heartImage, 220, 10);
			ctx.drawImage(heartImage, 245, 10);
			ctx.drawImage(heartImage, 270, 10);
		}else if (lifePoints == 2){

			ctx.drawImage(heartImage, 220, 10);
			ctx.drawImage(heartImage, 245, 10);

		}else if(lifePoints == 1){

			ctx.drawImage(heartImage, 220, 10);

		}

	}




}





// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (redMonsterReady) {
		ctx.drawImage(redMonsterImage, redMonster.x, redMonster.y);
	}

	if (paseanteReady) {
		ctx.drawImage(paseanteImage, paseante.x, paseante.y);
	}


	// Goblins
/*	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);*/

	// Score counter
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + counter, 32, 442);

	// life points
/*	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("LifePoints: " + lifePoints, 352, 442);*/



	// Posición heroe
/*	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("heroe-(" + Math.ceil(hero.x) + "," + Math.ceil(hero.y) + ")", 332, 32);

	// Posición paseante
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("paseante-(" + Math.ceil(paseante.x) + "," + Math.ceil(paseante.y) + ")", 232, 132);*/
	renderContador();

};
// The main game loop
var main = function () {


	var now = Date.now();
	var delta = now - then;
	time++;
	//$('#timer').html(time);	
	

	//aparición paseante
	if(time%500==0){
		paseanteActivo = true;
	}
	//parada del paseante cuando sale de escena
	if(paseante.x>500){
		paseanteActivo = false;
		paseante.x=0;

	}

	//if(lifePoints > 0){
		update(delta / 1000);
		render();
		then = now;
	//}

	if(lifePoints <= 0){
		// GAME OVER
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "34px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Game Over", 170, 200);

		gameOver = true;

	}
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
