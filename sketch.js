var dog;
var happyDog;
var database;
var foodS;
var foodStock;
var washroom;
var bedroom;
var garden;
var gameState;
var readState;

function preload(){
  dogImg=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
  washroomImg=loadImage("Images/Wash Room.png");
  bedroomImg=loadImage("Images/Bed Room.png");
  gardenImg=loadImage("Images/Garden.png");
}

function setup() {
  database=firebase.database();
	createCanvas(500, 500);

  foodObj = newFood

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);

  feed = createButton("Feed the dog")
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  readState=database.ref('gamestate');
  readState.on("value", function(data){
    gameState=data.val();
  }) 
}


function draw() {  
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed=data.val()
   });

  fill(255,255,254);
  textsize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM", 350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM", 350,30);
  }else{
    text("Last Feed : ", lastFed + "AM", 350,30);
  }


  if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
  }else {
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
  }

  currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
update("Hungry");
foodObj.display();}






  drawSprites();
}

function readStock(data){
  foodS=data.val();
}
function feedDog(){
    dog.addImage(happyDog);


  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function writeStock(x){

  if(x<=0){
    x=0
  }else{
    x=x-1
  }

  database.ref('/').update({
    Food:x
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
