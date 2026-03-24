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
document.addEventListener('keydown', (e) => {
    keys[e.code] = true
})
document.addEventListener('keyup', (e) => {
    keys[e.code] = false
})

function atualiza() {
    tick++

    if (estado !== ST.JOGO) return  // só atualiza durante o jogo

    p1.update(keys)
    p2.update(keys)

    inimigos.forEach(en => {
        if (en.update(FASES[faseAtual])) pontuacao += 5
    })

    bonus.forEach(b => b.update())
}

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
            if (pl.colide(en) && pl.hit()) {
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
    if (estado !== ST.JOGO) return

    p1.update(keys)
    p2.update(keys)

    inimigos.forEach(en => {
        if (en.update(FASES[faseAtual])) pontuacao += 5
    })

    bonus.forEach(b => b.update())

    checarColisoes()  // ← adiciona aqui
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