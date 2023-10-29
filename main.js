//캔버스세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx =  canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver=false; // true이면 게임이 끝남, false이면 게임이 안끝남
let score=0;
//우주선좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

let bulletList = []; //총알들을 저장하는 리스트
function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX + 18; //총알시작좌표
        this.y = spaceshipY;
        this.alive=true; // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };
    this.checkHit=function(){
    // 총알.y <= 적군.y and(&&)
    // 총알.x >= 적군.x and(&&) 총알.x <= 적군.x + 적군의 넓이    
        for(let i=0;i<enemyList.length;i++){
            if(
                this.y <=enemyList[i].y &&
                this.x >=enemyList[i].x &&
                this.x <=enemyList[i].x + 40
                ){
                //총알이 죽게됨 적군의 우주선이 없어짐, 점수획득
                score++;
                this.alive=false; //죽은 총알
                enemyList.splice(i,1);
                }
            }
        };
    }

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}
let enemyList=[];
function Enemy(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.y=0;
        this.x=generateRandomValue(0,canvas.width-48);
        enemyList.push(this);
    };
    this.update=function(){
        this.y += 3; //적군 속도 조절

        if(this.y >= canvas.height-48){
            gameOver = true;
            console.log("gameover")
        }
    };
}
//이미지로드
function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.gif";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameOver.png";
}

let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
       keysDown[event.keyCode] = true;
    });
}
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet(); //총알 생성
            
        }
    });

function createBullet(){
    console.log("총알 생성!");
    let b = new Bullet(); //총알 하나 생성
    b.init();
    console.log("새로운 총알 리스트,bulletList");
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },500) //호출하고싶은함수,시간 1초=1000
}

function update(){
    if( 39 in keysDown){
        spaceshipX += 5; //우주선의속도
    } //right
    if(37 in keysDown){
        spaceshipX -= 5;
    } //left
    
    //우주선의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만 있게 하려면?
    if(spaceshipX <=0){
        spaceshipX=0;
    } //left
    if(spaceshipX >= canvas.width-64){
        spaceshipX=canvas.width-64;
    } //right
    
    // 총알의 y좌표 업데이트하는 함수 호출
    for(let i=0;i<bulletList.length;i++){
        if (bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
    }
}
    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update();
    }
}
    

    function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
    ctx.fillText(`Score:${score}`,5,20);
    ctx.fillStyle="white";
    ctx.font="20px Arial";    
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
   
}
function main(){
    if(!gameOver){
    update(); //좌표값을 업데이트하고
    render(); //그려주고
    requestAnimationFrame(main);
}else{
    ctx.drawImage(gameOverImage,10,100,380,380);
}
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

//방향키를 누르면
//우주선의 xy 좌표가 바뀌고
//다시 render 그려준다

//총알만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사 = 총알의 y값이 -- , 총알의 x 값은? 스페이스를 누른 순간의 우주선의 x좌표
//3. 발사된 총알들은 총알 배열에 저장을 한다
//4. 총알들은 x,y좌표값이 있어야 한다
//5. 총알 배열을 가지고 render 그려준다

//적군만들기
//1. x,y,init,update
//2. 위치 랜덤
//3. 밑으로 내려온다
//4. 1초마다 하나씩 나온다
//5. 바닥에 닿으면 게임오버
//6. 총알에 맞으면 사라지면서 1점 획득

//적군죽이기
//1. 