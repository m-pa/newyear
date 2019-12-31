
const rockets = []
const explosions = []
let points = 0;
let img
let name
let streak = 0
let lastAction
let multiplier = 1

function preload() {
  img = loadImage('assets/skyline.png');
}

function setup() {
  frameRate(25)
  createCanvas(window.innerWidth, window.innerHeight);
  background(30, 30, 55)
  noStroke();
  fill(102);
  name = getQueryVariable('name')
}

function draw() {
  background(30, 30, 55)

  rockets
    .filter(rocket => rocket.active)
    .map(rocket => rocket.draw())
    .map(rocket => rocket.move())

  explosions
    .filter(expl => expl.active)
    .map(expl => expl.draw())
  
    
  fill('darkred')
  textAlign(LEFT)
  textSize(32)
  text('Points:', 30, 40)
  fill(0, 102, 153)
  text(Math.floor(points), 150, 40)
  fill(0, 102, 153)

  fill(30, 30, 55)
  textSize(55);
  textStyle(BOLD)
  textAlign(CENTER, BOTTOM)
  text('Happy New Year', window.innerWidth / 2, 200)
  if (name) {
    text(name+'!', window.innerWidth / 2, 275)
  }
  image(img, 0, window.innerHeight - window.innerWidth * 0.4, window.innerWidth, window.innerWidth * 0.4);
  
  if (streak) {
    fill('darkred')
    textAlign(LEFT)
    textSize(24)
    text('Streak:', 30, window.innerHeight * .6)
  
    fill(0, 102, 153)
    textAlign(LEFT)
    textSize(24)
    text(streak, 150, window.innerHeight * .6)
  
    multiplier = Math.floor(streak / 50) 

    if (Date.now() - lastAction > 1500) {
      streak = 0
      multiplier = 1
    }
  }

  if (multiplier > 1) {
    fill('darkred')
    textAlign(LEFT)
    textSize(24)
    text('Points x', 30, (window.innerHeight * .6) - 30)
  
    fill(0, 102, 153)
    textAlign(LEFT)
    textSize(24)
    text(multiplier, 150, (window.innerHeight * .6) - 30)
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
  return false
}

function mousePressed() {
  const p = {
    x: mouseX,
    y: mouseY
  }
  lastAction = Date.now()
  streak = streak +  1
  rockets.push(new Rocket(p))
}

function drawPoint(point) {
  fill('red')
  circle(point.x, point.y, 20)  
}

class Rocket {
  constructor(point) {
    this.x = point.x
    this.y = point.y
    this.range = Math.random() * 100 + window.innerHeight - 400
    this.travled = 0
    this.color = randomColor({ luminosity: 'bright' })
    this.oldPositions = []
    this.size = Math.random()
    this.active = true
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: Math.random() * -2 + -6
    }
  }

  draw() {
    fill(this.color)
    circle(this.x, this.y, (Math.random() * 4 + 5))  
    this.oldPositions.map(pos => circle(pos.x, pos.y, Math.random() * 4) +3)

    if (Math.abs(this.travled) > this.range) {
      explosions.push(new Explosion({ x: this.x, y: this.y })) 
      this.active = false
    }
    return this
  }

  move() {
    this.oldPositions.unshift({ x: this.x, y: this.y })
    if(this.oldPositions.length > 20) this.oldPositions.pop()
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.travled += (this.velocity.x + this.velocity.y)
    return this
  }

}

class Explosion {
  constructor(point) {
    this.x = point.x
    this.y = point.y
    this.lifeTime = Math.random() * 200 + 1500
    this.age = 0
    this.baseRadius = Math.random() * 100
    this.birthDate = Date.now()
    this.active = true
    this.color = randomColor({ luminosity: 'bright' })
    points += this.baseRadius * multiplier
  }
  
  draw() {
    this.age = Date.now() - this.birthDate 
    if (this.age > this.lifeTime) {
      this.active = false
    }
    fill(this.color)
    circle(this.x, this.y, Math.random() * 100 + this.baseRadius)
  }

}