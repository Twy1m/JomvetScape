import { Personagem, Inimigo, Bonus } from './models/Obj.js'

const canvas = document.getElementById('desenho')
const ctx    = canvas.getContext('2d')

const W = 600
const H = 800

const ST = {
    INICIO:  0,
    TRANS:   1,   // transição entre fases
    JOGO:    2,
    OVER:    3,
    VITORIA: 4
}

let estado = ST.INICIO

let p1, p2          // os dois players
let inimigos        // array de inimigos
let bonus           // array de bônus
let pontuacao = 0
let faseAtual = 0
let tick      = 0   // contador geral de frames
let tickTrans = 0


const FASES = [
    {
        nome:    'FASE 1',
        sub:     'Trabalhem juntos!',
        meta:    80,        // pontos para avançar
        num:     4,         // quantidade de inimigos
        vMin:    2.5,       // velocidade mínima dos inimigos
        vMax:    4.5,       // velocidade máxima
        zigzag:  false,     // inimigos em zigzag?
        ceuA:    '#0a1628', // cor do topo do céu
        ceuB:    '#162d4a', // cor da base do céu
        chao:    '#1b4332',
        chaoAcc: '#2d6a4f'
    },
    {
        nome:    'FASE 2',
        sub:     'Estão mais rápidos!',
        meta:    200,
        num:     6,
        vMin:    4.5,
        vMax:    7.5,
        zigzag:  true,
        ceuA:    '#180a2e',
        ceuB:    '#351252',
        chao:    '#4a1942',
        chaoAcc: '#6d2e6d'
    },
    {
        nome:    'FASE 3',
        sub:     'MODO CAOS!',
        meta:    380,
        num:     8,
        vMin:    6.0,
        vMax:    11,
        zigzag:  true,
        ceuA:    '#2a0808',
        ceuB:    '#521212',
        chao:    '#7b1616',
        chaoAcc: '#9c2626'
    },
]

const keys = {}

//e.key retorna o caractere, e.code retorna a posição física da tecla

document.addEventListener('keyup', (e) => {
    keys[e.code] = false
})
document.addEventListener('keydown', (e) => {
    keys[e.code] = true

    if (e.code === 'Enter') {
        if (estado === ST.INICIO) iniciarJogo()
        if (estado === ST.OVER)   iniciarJogo()
        if (estado === ST.VITORIA) iniciarJogo()
    }

    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) {
        e.preventDefault()
    }
})


function desenha() {
    ctx.clearRect(0, 0, W, H)

    if (estado === ST.INICIO)       desenhaInicio()
    else if (estado === ST.TRANS)   desenhaTrans()
    else if (estado === ST.JOGO)    desenhaJogo()
    else if (estado === ST.OVER)    desenhaOver()
    else if (estado === ST.VITORIA) desenhaVitoria()
}

function checarColisoes() {
    for (const pl of [p1, p2]) {
        if (!pl.vivo) continue  // ignora player morto

        // colisão com inimigos
        inimigos.forEach(en => {
            if (pl.colide(en) && pl.recebeDano()) {
                en.reset()
            }
        })

        // colisão com bônus
        bonus.forEach(b => {
            if (!b.ativo || !pl.colide(b)) return

            b.coletar()

            if (b.tipo === 'coracao') {
                pl.vida = Math.min(5, pl.vida + 1)
            } else if (b.tipo === 'osso') {
                pontuacao += 10
            } else {
                pontuacao += 15
            }
        })
    }
}

function atualiza() {
    tick++

    if (estado === ST.TRANS) {
        tickTrans++
        if (tickTrans >= 180) {
            estado = ST.JOGO
            tickTrans = 0
        }
        return
    }
    if (estado !== ST.JOGO) return

    p1.update(keys)
    p2.update(keys)

    inimigos.forEach(en => {
        if (en.update(FASES[faseAtual])) pontuacao += 5
    })

    bonus.forEach(b => b.update())

    checarColisoes()  

    if (pontuacao >= FASES[faseAtual].meta) {
        faseAtual++
        if (faseAtual >= FASES.length) {
            estado = ST.VITORIA
        } else {
            setupFase()
            estado = ST.TRANS
        }
    }
    if (!p1.vivo && !p2.vivo) {
        estado = ST.OVER
    }
}

function desenhaJogo() {
    desenhaBG()

    bonus.forEach(b => b.draw(ctx))
    inimigos.forEach(en => en.draw(ctx))
    p1.draw(ctx)
    p2.draw(ctx)

    desenhaHUD()
}

function desenhaBG() {
    const f = FASES[faseAtual]

    // gradiente do céu
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, f.ceuA)
    g.addColorStop(1, f.ceuB)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    // chão
    ctx.fillStyle = f.chao
    ctx.fillRect(0, H - 40, W, 40)
}

function desenhaHUD() {
    // fundo da barra
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, W, 50)

    // pontuação
    ctx.fillStyle = '#FFD700'
    ctx.font = '16px "Press Start 2P", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(pontuacao + ' pts', W / 2, 35)

    // vidas P1
    ctx.fillStyle = '#4fc3f7'
    ctx.font = '14px "Press Start 2P", monospace'
    ctx.textAlign = 'left'
    ctx.fillText('P1  ' + '❤'.repeat(p1.vida), 10, 40)

    // vidas P2
    ctx.fillStyle = '#ff8a65'
    ctx.textAlign = 'right'
    ctx.fillText('P2  ' + '❤'.repeat(p2.vida), W - 10, 32)
}

function desenhaInicio() {
    // fundo
    ctx.fillStyle = '#060d18'
    ctx.fillRect(0, 0, W, H)

    // título
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 32px "Press Start 2P", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('JomvetScape', W / 2, 200)

    // subtítulo
    ctx.fillStyle = '#ff8a65'
    ctx.font = 'bold 16px "Press Start 2P", monospace'
    ctx.fillText('2 PLAYERS', W / 2, 250)

    // instrução
    ctx.fillStyle = '#ffffff'
    ctx.font = '10px "Press Start 2P", monospace'
    ctx.fillText('Pressione ENTER para iniciar', W / 2, 400)

    // controles
    ctx.fillStyle = '#4fc3f7'
    ctx.fillText('P1 — A / D', W / 2, 500)
    ctx.fillStyle = '#ff8a65'
    ctx.fillText('P2 — ← / →', W / 2, 530)
}

function desenhaOver() {
    ctx.fillStyle = '#150505'
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = '#ff4444'
    ctx.font = 'bold 40px "Press Start 2P", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', W / 2, 280)

    ctx.fillStyle = '#ffffff'
    ctx.font = '12px "Press Start 2P", monospace'
    ctx.fillText('Pontuação: ' + pontuacao, W / 2, 360)

    ctx.fillStyle = '#aaaaaa'
    ctx.font = '10px "Press Start 2P", monospace'
    ctx.fillText('Pressione ENTER para tentar de novo', W / 2, 460)
}

function desenhaVitoria() {
    ctx.fillStyle = '#050d05'
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 40px "Press Start 2P", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('VITÓRIA!', W / 2, 280)

    ctx.fillStyle = '#ffffff'
    ctx.font = '12px "Press Start 2P", monospace'
    ctx.fillText('Pontuação: ' + pontuacao, W / 2, 360)

    ctx.fillStyle = '#aaaaaa'
    ctx.font = '10px "Press Start 2P", monospace'
    ctx.fillText('Pressione ENTER para jogar de novo', W / 2, 460)
} 

function desenhaTrans() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 40px "Press Start 2P", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(FASES[faseAtual].nome, W / 2, 350)

    ctx.fillStyle = '#eeeeee'
    ctx.font = '12px "Courier New", monospace'
    ctx.fillText(FASES[faseAtual].sub, W / 2, 410)
}

function iniciarJogo() {
    faseAtual  = 0
    pontuacao  = 0

    p1 = new Personagem(150, 'img/jomvet8bit.png', '#4fc3f7', 'KeyA',       'KeyD',        1)
    p2 = new Personagem(374, 'img/jomvet8bit.png', '#ff8a65', 'ArrowLeft',  'ArrowRight',  2)

    setupFase()
    estado = ST.JOGO
}

function setupFase() {
    const f = FASES[faseAtual]

    inimigos = Array.from({ length: f.num }, (_, i) => new Inimigo(f, i))

    bonus = [
        new Bonus(80),
        new Bonus(250),
        new Bonus(440)
    ]
}

function loop() {
    atualiza()
    desenha()
    requestAnimationFrame(loop)
}

loop()