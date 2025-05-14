import k from "./engine.js";
import game from "./scenes/game.js";
import lose from "./scenes/lose.js";
import splash from "./scenes/splash.js";
import win from "./scenes/win.js";

k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("coin", "/sprites/coin.png");
k.loadSprite("spike", "/sprites/spike.png");
k.loadSprite("grass", "/sprites/grass.png");
k.loadSprite("ghosty", "/sprites/ghosty.png");
k.loadSprite("portal", "/sprites/portal.png");

k.loadMusic("background", "/sounds/background.mp3");
k.loadSound("score", "/sounds/score.mp3");
k.loadSound("portal", "/sounds/portal.mp3");
k.loadSound("hit", "/sounds/hit.mp3");
k.loadSound("bell", "/sounds/bell.mp3");

k.scene("splash", splash);
k.scene("game", game);
k.scene("win", win);
k.scene("lose", lose);

k.setLayers(["obj", "ui"], "obj");

k.go("splash");
