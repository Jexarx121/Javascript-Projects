let canvas;
let context;
let request_id;

let fpsInterval = 1000/30;
let now;
let then = Date.now();

let lives = 5;
let lives_image = new Image();
let player_image = new Image();
let player = {
    width: 48,
    height: 48,
    frameX: 0,
    frameY: 0
};

//Values for x and y were hardcoded for ease of collision checking
let barrier = {
    x: 206, //left x value
    x_mid: 226, // x value for north and south barriers
    x3: 306, // right x value
    y: 206, // top y value
    y_mid: 226, //y value for west and east barriers
    y2: 306, // bottom y value
    width: 60,
    height: 5,
}

let list_length = 1;
let zombie_list = [];
let boss_list = [];
let low_speed = 3;
let high_speed = 4;
let colour_list = ["yellow", "purple"];

let background_image = new Image(); // image from opengameart.org
let tilesPerRow = 10;
let tileSize = 16;
let background = [
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 11, 11, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 11, 11, 11, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 11, 11, 10, 10, 10, 11, 11, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 11, 10, 10, 10, 11, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10],
    [10, 10, 10, 10, 11, 10, 10, 11, 11, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 11, 11, 10],
    [10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 10],
    [10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 11, 11, 11, 10, 10, 10, 10, 10],
    [10, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7], // 16
    [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 10, 10, 7, 7, 7, 7, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 11, 11, 11, 10, 10, 10, 10, 10, 11, 10, 10, 7, 7, 7, 7, 10, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10],
    [10, 10, 10, 10, 11, 11, 10, 10, 10, 11, 11, 11, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 11, 10, 11, 10, 10, 11, 11, 11],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 11, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 11, 11, 11, 11, 11, 10, 10, 11, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10],
    [10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 10, 10, 11, 10, 10, 11, 10, 10, 10, 10, 10],
    [10, 10, 10, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 10, 11, 11, 10, 10, 10, 10, 11, 11, 10, 10, 10, 10],
    [10, 10, 10, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 11, 11, 10, 10, 10, 10, 11, 11, 11, 11, 10, 10, 10],
    [10, 10, 11, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 7, 7, 7, 7, 10, 11, 11, 10, 10, 10, 10, 10, 11, 11, 11, 10, 10, 10]
];

let zombie_image = new Image(); // image from sithjester resources
let b_zombie_image = new Image(); // image from sithjester resources
let boss_image = new Image();
let b_boss_image = new Image();

let bullet = false;
let h_bullet_image = new Image();
let v_bullet_image = new Image();
let bullets = {
    x: 232,
    x_mid: 248,
    x2: 266,
    y: 232,
    y_mid: 248,
    y2: 266,
    velocity: 40,
    size: 16
};

let collision_audio = new Audio('audio/ding.mp3'); // audio from youtube.com
let gunshot_audio = new Audio('audio/gunshot.mp3'); // audio from zapsplat.com 
let reload_audio = new Audio('audio/reload.mp3'); // audio from zapsplat.com
let hurt_audio = new Audio('audio/hurt.mp3'); // audio from zapsplat.com
let death_audio = new Audio('audio/death.mp3'); // audio from zapsplat.com
let boss_audio = new Audio('audio/boss.mp3'); // audio from zapsplat.com

let combo = 0;
let score = 0;
let easy;
let normal;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

document.querySelector("canvas").style.visibility = "hidden";

// difficulty choosing here;
document.getElementById('easy').onclick = function() {
    easy = true;
    normal = false;
    start();
}

document.getElementById('normal').onclick = function() {
    easy = false;
    normal = true;
    start();
}


function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    lives_image.src = "images/player.png";
    h_bullet_image.src = "images/bullet_1.png"; // image from opengameart.org
    v_bullet_image.src = "images/bullet_2.png"; // image from opengameart.org
    zombie_image.src = "images/zombie.png"; //sprite from https://untamed.wild-refuge.net/rmxpresources.php?characters
    b_zombie_image.src = "images/czombie.png"; //sprite from https://untamed.wild-refuge.net/rmxpresources.php?characters
    player_image.src = "images/winchester.png" //sprite from https://untamed.wild-refuge.net/rmxpresources.php?characters 
    boss_image.src = "images/ifrit.png" // sprite from sithjester resources
    b_boss_image.src = "images/b_ifrit.png" // sprite from sithjester resources
    background_image.src = "images/town_tiles.png"; // image from opengameart.org

    if (easy) {
        lives = 9999;
    }

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    draw()
}

function draw() {
    request_id = window.requestAnimationFrame(draw);

    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return; 
    }
    then = now - (elapsed % fpsInterval);

    //drawing in all the MAIN objects 
    //background
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < 32; r+=1) {
        for (let c = 0; c < 32; c+=1) {
            let tile = background[r][c];
            if (tile >= 0)  {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(background_image,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }

    //player
    context.drawImage(player_image,
        player.width * player.frameX, player.height * player.frameY, player.width, player.height,
        canvas.width/2 - player.width/2, canvas.height/2 - player.height/2, player.width, player.height);

    //barrier
    context.fillStyle = "cyan";
    if (moveDown) {
        context.fillRect(barrier.x_mid, barrier.y2, barrier.width, barrier.height);
        player.frameX = 0;
        player.frameY = 0;
    } else if (moveLeft) {
        context.fillRect(barrier.x, barrier.y_mid, barrier.height, barrier.width);
        player.frameY = 0;
        player.frameX = 3;
    } else if (moveRight) {
        context.fillRect(barrier.x3, barrier.y_mid, barrier.height, barrier.width);
        player.frameX = 0;
        player.frameY = 3;
    } else if (moveUp) {
        context.fillRect(barrier.x_mid, barrier.y, barrier.width, barrier.height);
        player.frameX = 0;
        player.frameY = 2;
    }

    //bullets
    // left
    if (bullet && moveLeft) {
        context.drawImage(h_bullet_image, bullets.x, bullets.y_mid);
        gunshot_audio.currentTime = 0;
        gunshot_audio.play();
        bullets.x -= bullets.velocity;
        // image disappear after reaching left side of canvas
        if (bullets.x <= 0) {
            bullets.x = 232;
            bullet = false;
        }
    // right
    } else if (bullet && moveRight) {
        context.drawImage(h_bullet_image, bullets.x2, bullets.y_mid);
        gunshot_audio.currentTime = 0;
        gunshot_audio.play();
        bullets.x2 += bullets.velocity;
        // image disappear after reaching right side of canvas
        if (bullets.x2 >= canvas.width) {
            bullets.x2 = 266;
            bullet = false;
        }
    // up
    } else if (bullet && moveUp) {
        context.drawImage(v_bullet_image, bullets.x_mid, bullets.y);
        gunshot_audio.currentTime = 0;
        gunshot_audio.play();
        bullets.y -= bullets.velocity;
        // image dissappear after reaching top side of canvas
        if (bullets.y <= 0) {
            bullets.y = 232;
            bullet = false;
        }
    // down
    } else if (bullet && moveDown) {
        context.drawImage(v_bullet_image, bullets.x_mid, bullets.y2);
        gunshot_audio.currentTime = 0;
        gunshot_audio.play();
        bullets.y2 += bullets.velocity;
        // image dissappear after reaching bottom side of canvas
        if (bullets.y2 >= canvas.height) {
            bullets.y2 = 266;
            bullet = false;
        }
    }

    context.font = "25px Arial";
    //combo
    context.fillStyle = "black";
    context.fillText("x" + combo, 0, canvas.height);

    // lives
    context.fillStyle = "red";
    context.fillText(lives, 0, canvas.height - 25);
    if (lives === 0) {
        stop();
        document.getElementById("message").innerHTML = "DEFEAT!"
    }

    //increase in difficulty with score
    if (score > 10 && score < 20) {
        high_speed = 7; 
    } else if (score > 20 && score < 30) {
        high_speed = 8;
    } else if (score > 30 && score < 40) {
        high_speed = 9;
        low_speed = 5;
    } else if (score > 40 && score < 60) {
        list_length = 2;
    } else if (score > 60 && score < 70) {
        low_speed = 6; 
        high_speed = 10;
    } else if (score > 70 && normal) {
        list_length = 3;
    }
    
    // minus numbers give illusion of coming off canvas screen rather than appearing inside immediately
    let z = [[0 - 32, canvas.height/2], [canvas.width, canvas.height/2], [canvas.width/2, 0 - 48], [canvas.width/2, canvas.height]]
    let dir = choice(z)
    
    // level 1 here
    if (score < 80) {
        // zombie
        if (zombie_list.length < list_length) {
            let zombie = {
                width: 32,
                height: 48,
                speed: parseFloat((Math.random() + randint(low_speed, high_speed)).toFixed(1)),
                x: dir[0],
                y: dir[1],
                colour: "yellow",
                frameX: 0,
                frameY: 0
            };
            zombie_list.push(zombie);
        }
        
        //creating the zombies
        for (let z of zombie_list) {
            if (z.colour === "yellow") {
                context.drawImage(zombie_image,
                    z.width * z.frameX, z.height * z.frameY, z.width, z.height,
                    z.x, z.y, z.width, z.height);
            } else {
                context.drawImage(b_zombie_image,
                    z.width * z.frameX, z.height * z.frameY, z.width, z.height,
                    z.x, z.y, z.width, z.height);
            }

            //calling function to make zombies move
            movement(z);
            
            //barrier and bullet collision checking
            if (bullet_col(z) || barrier_col(z)) {
                z.x = dir[0];
                z.y = dir[1];
                if (score >= 20 && score < 75) {
                    z.colour = choice(colour_list); 
                }
                z.speed = parseFloat((Math.random() + randint(low_speed, high_speed)).toFixed(1))
                combo += 1;
                score += 1;
                collision_audio.currentTime = 0;
                collision_audio.play();
            } else if (player_col(z)) {
                lives -= 1;
                combo = 0;
                z.x = dir[0];
                z.y = dir[1];
                if (score >= 20 && score < 70) {
                    z.colour = choice(colour_list); 
                } 
                z.speed = parseFloat((Math.random() + randint(low_speed, high_speed)).toFixed(1));
                hurt_audio.currentTime = 0;
                hurt_audio.play();
            }
        }

    // level 3 - final boss
    } else {
        boss_audio.play();
        if (boss_list.length < 1) {
            //boss 
            let boss = {
                width: 80,
                height: 80,
                speed: 5,
                colour: choice(colour_list),
                x: dir[0],
                y: dir[1],
                frameX: 0,
                frameY: 0,
                life: easy ? 40 : 30
            }
            boss_list.push(boss);
        }
        
        for (let b of boss_list) {
            if (b.colour === "yellow") {
                context.drawImage(boss_image,
                    b.width * b.frameX, b.height* b.frameY, b.width, b.height,
                    b.x, b.y, b.width, b.height);
            } else {
                context.drawImage(b_boss_image,
                    b.width * b.frameX, b.height* b.frameY, b.width, b.height,
                    b.x, b.y, b.width, b.height);
            }

            // calling function to make boss move    
            movement(b);

            if (barrier_col(b) || bullet_col(b)) {
                b.x = dir[0];
                b.y = dir[1];
                combo += 1;
                b.colour = choice(colour_list);
                b.speed += 0.25;
                b.life -= 1;
                collision_audio.currentTime = 0;
                collision_audio.play();
            } else if (player_col(b)) {
                lives -= 1;
                combo = 0;
                b.x = dir[0];
                b.y = dir[1];
                hurt_audio.currentTime = 0;
                hurt_audio.play();
            }

            if (b.life < 10) {
                b.colour = "yellow";
            }

            if (b.life === 0) {
                stop();
                document.getElementById("message").innerHTML = "VICTORY!"
            }

        }

    }
}


function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
    if (key === ' ') {
        bullet = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === 'ArrowLeft') {
        moveLeft = false;
    } else if ( key === 'ArrowUp') { 
        moveUp = false;
    } else if (key === 'ArrowRight') {
        moveRight = false;
    } else if (key === 'ArrowDown') {
        moveDown = false;
    }
}

// making objects move and be animated
function movement(z) {
    // centering the zombies
    if (z.x === canvas.width/2) {
        z.x -= z.width/2
    } else if (z.y === canvas.height/2) {
        z.y -= z.height/2
    }
    //movement of west and east
    if (z.x === canvas.width/2 - z.width/2) {
        if (z.y >= -48 && z.y < canvas.height/2) {
            z.frameY = 0;
            z.frameX += 1;
            z.y += z.speed;
        } else {
            z.frameX += 1;
            z.frameY = 3;
            z.y -= z.speed;
        }
    } else if (z.y === canvas.height/2 - z.height/2) {
        if (z.x >= -32 && z.x < canvas.width/2) {
            z.frameX += 1;
            z.frameY = 2;
            z.x += z.speed;
        } else {
            z.frameX += 1;
            z.frameY = 1;
            z.x -= z.speed;
        } 
    }

    if (z.frameX > 3) {
        z.frameX = 0;
    } 
}

// barrier collision
function barrier_col(z) {
    if (z.colour === "yellow") {
        if (z.y === canvas.height/2 - z.height/2) {
            //left
            if (z.x >= 0 && z.x < canvas.width/2) {
                if ((moveLeft) && ((z.x + z.width >= barrier.x) && (z.x <= barrier.x))) {
                    return true;
                }
            }
            //right
            if (z.x <= canvas.width && z.x > canvas.width/2) {
                if ((moveRight) && ((z.x <= barrier.x3) && (z.x + z.width >= barrier.x3))) {
                    return true;
                } 
            }
        } else if (z.x === canvas.width/2 - z.width/2) {
            //up
            if (z.y >= 0 && z.y < canvas.height/2) {
                if ((moveUp) && ((z.y + z.height >= barrier.y) && (z.y <= barrier.y))) {
                    return true;
                }
            }
            //down
            if (z.y <= canvas.height && z.y > canvas.height/2) {
                if ((moveDown) && ((z.y <= barrier.y2) && (z.y + z.height >= barrier.y2))) {
                    return true;
                } 
            }
        }
    }
}

// player collsion
function player_col(z) {
    if (z.y === canvas.height/2 - z.height/2) {
        //left
        if (z.x >= 0 && z.x < canvas.width/2) {
            if (z.x + z.width >= canvas.width/2 - player.width/2 ) {
                return true;
            } 
        }
        //right
        if (z.x <= canvas.width && z.x > canvas.width/2) {
            if (z.x <= canvas.width/2 + player.width/2) {
                return true;
            } 
        }
    } else if (z.x === canvas.width/2 - z.width/2) {
        //up
        if (z.y >= 0 && z.y < canvas.height/2) {
            if (z.y + z.height >= canvas.height/2 - player.height/2) {
                return true;
            }
        }
        //down
        if (z.y <= canvas.height && z.y > canvas.height/2) {
            if (z.y <= canvas.height/2 + player.height/2) {
                return true;
            }
        }
    }
}

// bullet collision
function bullet_col(z) {
    if (z.colour === "purple") {
        if (z.y === canvas.height/2 - z.height/2 ) {
            // left
            if (z.x >= 0 && z.x < canvas.width/2) {
                if (bullets.x <= z.x + z.width && bullet) {
                    return true;
                } 
            }
            //right
            if (z.x <= canvas.width && z.x > canvas.width/2) {
                if (bullets.x2 >= z.x && bullet) {
                    return true;
                }
            }
        } else if (z.x === canvas.width/2 - z.width/2) {
            //up
            if (z.y >= 0 && z.y < canvas.height/2) {
                if (bullets.y <= z.y + z.height && bullet) {
                    return true;
                }
            }
            //down
            if (z.y <= canvas.height && z.y > canvas.height/2) {
                if (bullets.y2 + bullets.size >= z.y && bullet) {
                    return true;
                }
            }
        }
    }   
}

// taking a random item from list
function choice(list) {
    let index = Math.floor(Math.random() * list.length);
    return list[index];
}

function randint(min, max) {
    return Math.round(Math.random() * (max-min)) + min;
}

function start() {
    document.querySelector("canvas").style.visibility = "visible";
    document.getElementById("easy").remove();
    document.getElementById("normal").remove();
    document.querySelector("section").remove();
    reload_audio.play();
    init(); 
}

function stop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);
    death_audio.play();
}
