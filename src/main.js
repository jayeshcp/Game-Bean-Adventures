import k from "./engine.js";
import game from "./scenes/game.js";
import splash from "./scenes/splash.js";

k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("coin", "/sprites/coin.png");
k.loadSprite("spike", "/sprites/spike.png");
k.loadSprite("grass", "/sprites/grass.png");
k.loadSprite("ghosty", "/sprites/ghosty.png");
k.loadSprite("portal", "/sprites/portal.png");
k.loadSound("score", "/sounds/score.mp3");
k.loadSound("portal", "/sounds/portal.mp3");

k.scene("splash", splash);
k.scene("game", game);

k.go("splash");
