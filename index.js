import { Personagem, Inimigo, Bonus } from "./models/Obj.js";

const canvas = document.getElementById("desenho");
const ctx = canvas.getContext("2d");

const W = 600;
const H = 800;

const imgJomvet = new Image()
imgJomvet.src = 'img/jomvet8bit.png'

const ST = {
  INICIO: 0,
  TRANS: 1, // transição entre fases
  JOGO: 2,
  OVER: 3,
  VITORIA: 4,
  SOBRE: 5,
};

let estado = ST.INICIO;

let p1, p2; // os dois players
let inimigos; // array de inimigos
let bonus; // array de bônus
let pontuacao = 0;
let faseAtual = 0;
let tick = 0; // contador geral de frames
let tickTrans = 0;
let modoJogadores = 1;
let selecaoMenu = 1; // Para controlar o cursor no menu

const FASES = [
  {
    nome: "FASE 1",
    sub: "Trabalhem juntos!",
    meta: 100, // pontos para avançar
    num: 4, // quantidade de inimigos
    vMin: 2.5, // velocidade mínima dos inimigos
    vMax: 5.5, // velocidade máxima
    zigzag: false, // inimigos em zigzag?
    ceuA: "#0a1628", // cor do topo do céu
    ceuB: "#162d4a", // cor da base do céu
    chao: "#1b4332",
    chaoAcc: "#2d6a4f",
  },
  {
    nome: "FASE 2",
    sub: "Estão mais rápidos!",
    meta: 200,
    num: 5,
    vMin: 5.5,
    vMax: 8.5,
    zigzag: true,
    ceuA: "#180a2e",
    ceuB: "#351252",
    chao: "#4a1942",
    chaoAcc: "#6d2e6d",
  },
  {
    nome: "FASE 3",
    sub: "MODO CAOS!",
    meta: 500,
    num: 6,
    vMin: 8.0,
    vMax: 11,
    zigzag: true,
    ceuA: "#2a0808",
    ceuB: "#521212",
    chao: "#7b1616",
    chaoAcc: "#9c2626",
  },
];

const keys = {};

//e.key retorna o caractere, e.code retorna a posição física da tecla

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  // Impede a tela de rolar (boa prática que você já tinha colocado!)
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
    e.preventDefault();
  }

  // Lógica da Tela de Início
  if (estado === ST.INICIO) {
    if (e.code === "ArrowUp") selecaoMenu = Math.max(1, selecaoMenu - 1);
    if (e.code === "ArrowDown") selecaoMenu = Math.min(3, selecaoMenu + 1);

    if (e.code === "Enter") {
      if (selecaoMenu === 1 || selecaoMenu === 2) {
        modoJogadores = selecaoMenu;
        iniciarJogo();
      } else if (selecaoMenu === 3) {
        estado = ST.SOBRE;
      }
    }
  } 
  // Lógica da Tela "Sobre" (Note o ELSE IF aqui)
  else if (estado === ST.SOBRE) {
    if (e.code === "Enter") estado = ST.INICIO;
  } 
  // Lógica de Fim de Jogo (Game Over ou Vitória)
  else if (estado === ST.OVER || estado === ST.VITORIA) {
    if (e.code === "Enter") {
      estado = ST.INICIO; // Volta para o menu
      selecaoMenu = 1; // Opcional: reseta o cursor do menu para a opção 1
    }
  }
});

function desenha() {
  ctx.clearRect(0, 0, W, H);

  if (estado === ST.INICIO) desenhaInicio();
  else if (estado === ST.TRANS) desenhaTrans();
  else if (estado === ST.JOGO) desenhaJogo();
  else if (estado === ST.OVER) desenhaOver();
  else if (estado === ST.VITORIA) desenhaVitoria();
  else if (estado === ST.SOBRE) desenhaSobre();
}

function desenhaJogo() {
  desenhaBG();

  bonus.forEach((b) => b.draw(ctx));
  inimigos.forEach((en) => en.draw(ctx));
  p1.draw(ctx);
  p2.draw(ctx);

  desenhaHUD();
}

function desenhaBG() {
  const f = FASES[faseAtual];

  // gradiente do céu
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, f.ceuA);
  g.addColorStop(1, f.ceuB);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // chão
  ctx.fillStyle = f.chao;
  ctx.fillRect(0, H - 40, W, 40);
}

function desenhaInicio() {
  ctx.fillStyle = "#060d18";
  ctx.fillRect(0, 0, W, H);

  // Título com sombra
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#FFD700";
  ctx.fillStyle = "#FFD700";
  ctx.font = '30px monospace';
  ctx.textAlign = "center";
  ctx.fillText("JOMVETSCAPE", W / 2, 100);
  ctx.shadowBlur = 0;

  ctx.drawImage(imgJomvet, W/2 - 60, 150, 120, 120)
  // Opções de Menu
  const opcoes = ["1 JOGADOR", "2 JOGADORES", "SOBRE"];
  opcoes.forEach((texto, i) => {
    const atual = i + 1;
    ctx.font = '20px monospace';

    if (selecaoMenu === atual) {
      ctx.fillStyle = "#fff";
      ctx.fillText("> " + texto + " <", W / 2, 350 + i * 50);
    } else {
      ctx.fillStyle = "#555";
      ctx.fillText(texto, W / 2, 350 + i * 50);
    }
  });

    ctx.fillStyle = "#FFD700";
  ctx.font = '13px monospace';
  ctx.fillText("CONTROLES", W / 2, 530);
  ctx.fillStyle = "#4fc3f7";
  ctx.font = '13px "Courier New", monospace';
  ctx.fillText("P1  A / D para mover", W / 2, 560);
  ctx.fillStyle = "#ff8a65";
  ctx.fillText("P2  ← / → para mover", W / 2, 590);
  ctx.fillStyle = "#b30b0b";
  ctx.fillText("❤  Aumenta em 1 a vida", W / 2, 630);
  ctx.fillStyle = "#d8d511";
  ctx.fillText("⭐ 🦴 bonus de pontos", W / 2, 650);
  

  ctx.fillStyle = "#aaaaaa";
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText("Desvie dos inimigos e colete itens!", W / 2, 720);

  ctx.font = '15px, monospace';
  ctx.fillStyle = "#888";
  ctx.fillText("Use SETAS para escolher e ENTER", W / 2, 770);
}

function desenhaHUD() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, W, 60);

  ctx.fillStyle = "#FFD700";
  ctx.font = '18px monospace';
  ctx.textAlign = "center";
  ctx.fillText(pontuacao + " PTS", W / 2, 38);

  // P1 sempre aparece
  ctx.textAlign = "left";
  ctx.fillStyle = "#4fc3f7";
  ctx.fillText("P1 " + "❤".repeat(p1.vida), 20, 38);

  // P2 só aparece se o modo for 2 jogadores
  if (modoJogadores === 2) {
    ctx.textAlign = "right";
    ctx.fillStyle = "#ff8a65";
    ctx.fillText("P2 " + "❤".repeat(p2.vida), W - 20, 38);
  }
}

function desenhaOver() {
  ctx.fillStyle = "rgba(20, 0, 0, 0.9)";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#ff4444";
  ctx.font = '40px monospace';
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", W / 2, 300);

  ctx.fillStyle = "#fff";
  ctx.font = '16px monospace';
  ctx.fillText("SCORE: " + pontuacao, W / 2, 380);

  ctx.font = '10px monospace';
  ctx.fillText("PRESSIONE ENTER PARA VOLTAR AO MENU", W / 2, 500);
}

function desenhaVitoria() {
  ctx.fillStyle = "#050d05";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#FFD700";
  ctx.font = 'bold 40px, monospace';
  ctx.textAlign = "center";
  ctx.fillText("VITÓRIA!", W / 2, 280);

  ctx.fillStyle = "#ffffff";
  ctx.font = '12px, monospace';
  ctx.fillText("Pontuação: " + pontuacao, W / 2, 360);

  ctx.fillStyle = "#aaaaaa";
  ctx.font = '10px, monospace';
  ctx.fillText("Pressione ENTER para jogar de novo", W / 2, 460);
}

function desenhaTrans() {
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#FFD700";
  ctx.font = 'bold 40px monospace';
  ctx.textAlign = "center";
  ctx.fillText(FASES[faseAtual].nome, W / 2, 350);

  ctx.fillStyle = "#eeeeee";
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText(FASES[faseAtual].sub, W / 2, 410);
}

function desenhaSobre() {
  ctx.fillStyle = "#060d18";
  ctx.fillRect(0, 0, W, H);

  // Foto do Jomvet
  ctx.drawImage(imgJomvet, W/2 - 60, 80, 120, 120)

  // Título
  ctx.fillStyle = "#FFD700";
  ctx.font = '16px monospace';
  ctx.textAlign = "center";
  ctx.fillText("SOBRE", W / 2, 250);

  // Texto sobre o criador
  ctx.fillStyle = "#ffffff";
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText("Feito por Matheus Steingraber", W / 2, 320);
  ctx.fillText("Github Twy1m", W / 2, 340);
  ctx.fillText("Gmail matheusg.stein@gmail.com", W / 2, 360);
  ctx.fillText("Product Owner Carlos Roberto da Silva Filho", W / 2, 420);

  // Voltar
  ctx.fillStyle = "#555";
  ctx.font = '15px, monospace';
  ctx.fillText("ENTER para voltar", W / 2, 720);
}

function checarColisoes() {
  for (const pl of [p1, p2]) {
    if (!pl.vivo) continue; // ignora player morto

    // colisão com inimigos
    inimigos.forEach((en) => {
      if (pl.colide(en) && pl.recebeDano()) {
        en.reset();
      }
    });

    // colisão com bônus
    bonus.forEach((b) => {
      if (!b.ativo || !pl.colide(b)) return;

      b.coletar();

      if (b.tipo === "coracao") {
        pl.vida = Math.min(5, pl.vida + 1);
      } else if (b.tipo === "osso") {
        pontuacao += 10;
      } else {
        pontuacao += 15;
      }
    });
  }
}

function atualiza() {
  tick++;

  if (estado === ST.TRANS) {
    tickTrans++;
    if (tickTrans >= 180) {
      estado = ST.JOGO;
      tickTrans = 0;
    }
    return;
  }
  if (estado !== ST.JOGO) return;

  p1.update(keys);
  p2.update(keys);

  inimigos.forEach((en) => {
    if (en.update(FASES[faseAtual])) pontuacao += 5;
  });

  bonus.forEach((b) => b.update());

  checarColisoes();

  if (pontuacao >= FASES[faseAtual].meta) {
    faseAtual++;
    if (faseAtual >= FASES.length) {
      estado = ST.VITORIA;
    } else {
      setupFase();
      estado = ST.TRANS;
    }
  }
  if (!p1.vivo && !p2.vivo) {
    estado = ST.OVER;
  }
}

function iniciarJogo() {
  faseAtual = 0;
  pontuacao = 0;

  if (modoJogadores === 1) {
    p1 = new Personagem(
      W / 2 - 30,
      "img/jomvet8bit.png",
      "#4fc3f7",
      "KeyA",
      "KeyD",
      1,
    );
    p2 = new Personagem(
      W + 100,
      "img/jomvet8bit.png",
      "#ff8a65",
      "ArrowLeft",
      "ArrowRight",
      2,
    );
    p2.vida = 0;
    p2.vivo = false;
  } else {
    p1 = new Personagem(
      150,
      "img/jomvet8bit.png",
      "#4fc3f7",
      "KeyA",
      "KeyD",
      1,
    );
    p2 = new Personagem(
      374,
      "img/jomvet8bit.png",
      "#ff8a65",
      "ArrowLeft",
      "ArrowRight",
      2,
    );
  }

  setupFase();
  estado = ST.JOGO;
}

function setupFase() {
  const f = FASES[faseAtual];

  inimigos = Array.from({ length: f.num }, (_, i) => new Inimigo(f, i));

  bonus = [new Bonus(80), new Bonus(250), new Bonus(440)];
}

function loop() {
  atualiza();
  desenha();
  requestAnimationFrame(loop);
}

loop();
