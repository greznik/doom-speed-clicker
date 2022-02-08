const width = window.innerWidth;
const height = window.innerHeight;
const gravity = 4;
const figuresAmount = -1;
let frameRate = 0;
let playerTime = 0;
const figure = [];
const container = new PIXI.Container()


const app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
app.stage.addChild(container)

const createBackground = () => {
  const sprite = PIXI.Sprite.from('/sprites/background.png')
  sprite.width = app.screen.width
  sprite.height = app.screen.height
  container.addChild(sprite)
}

const randomNumber = (min, max) => {
  return +(Math.random() * (max - min) + min).toFixed(1)
}

const drawSprite = () => {
  const inAreaX = width - 100;
  const inAreaY = height - 100;
  const circleY = Math.floor(Math.random() * inAreaY);
  const circleX = Math.floor(Math.random() * inAreaX);
  const sprite = PIXI.Sprite.from('/sprites/bug.png')
  sprite.scale.set(randomNumber(0.5, 1))
  sprite.x = circleX
  sprite.y = circleY
  sprite.interactive = true
  sprite.buttonMode = true
  sprite.alpha = 0
  sprite.live = false
  figure.push(sprite)
  container.addChild(sprite)
  sprite.on('pointerdown', clearFigure)
}

const gameOver = () => {
  app.ticker.stop()
  const style = new PIXI.TextStyle({
    fill: '0xffffff',
    fontSize: 36,
  });
  const gameOverText = new PIXI.Text('Game Over', style);
  gameOverText.x = width / 2;
  gameOverText.y = height / 2;
  gameOverText.pivot.x = 50;
  gameOverText.pivot.y = 50;
  app.stage.addChild(gameOverText);
}

const updateTime = () => {
  if (!window.onfocus) {
    if (frameRate++ >= 300 * 0.5) {
      drawSprite()
      frameRate = 0
    }
  }
}

const loadGame = () => {

  createBackground()
  drawSprite();

  app.ticker.add(() => {
    updateTime()
    for (var i = 0; i < figure.length; i++) {
      if (figure[i].alpha < 1 && !figure[i].live) {
        figure[i].alpha += 0.01
      } else {
        figure[i].live = true
      }
      if (figure[i].live && !figure[i].destroyed) {
        figure[i].alpha -= 0.01
        if (figure[i].alpha <= 0) {
          container.removeChild(figure[i])
          gameOver();
          return false;
        }
      }
      playerTime++
      if (playerTime > 1000) {
        gameOver();
      }
    }
  });
}


function clearFigure() {
  this.destroy();

}

loadGame();
