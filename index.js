import Obj, {Personagem, Coletaveis} from './models/Obj.js'

let desenho = document.getElementById('desenho').getContext('2d')

let mainChar = new Personagem(250, 720, 80,80, 'img/jomvet8bit.png')
let item1 = new Coletaveis(5500, 60, 80, 80, '/img/sprite1.png')
let item2 = new Coletaveis(530, 60, 80, 80, '/img/sprite1.png')
let item3 = new Coletaveis(200, 600, 80, 80, '/img/sprite1.png')
// let item4 = new Coletaveis(200, 600, 80, 80, '/img/inimigo.png')

const keys = {}

document.addEventListener('keydown', (e)=>{
    keys[e.key] = true
})
document.addEventListener('keyup', (e)=>{
    keys[e.key] = false
})

function colisao() {
    if (mainChar.colid(item1)) {
        item1.recomeca()
        mainChar.vida -= 1

    }
    if (mainChar.colid(item2)) {
        item2.recomeca()
        mainChar.vida -= 1
    }
    if (mainChar.colid(item3)) {
        item3.recomeca()
        
        mainChar.vida -= 1
    }
    console.log('vida: ', mainChar.vida)
}

function pontuacao() {
    if (mainChar.point(item1)) {
        mainChar.pontos += 5
        item1.recomeca()
    }
    if (mainChar.point(item2)) {
        mainChar.pontos += 5
        item2.recomeca()
    }
    if (mainChar.point(item3)) {
        mainChar.pontos += 5
        item3.recomeca()
    }
    console.log(mainChar.pontos)
}

function atualiza(){
    mainChar.mov_char(keys)
    item1.mov_it()
    item2.mov_it()
    item3.mov_it()
    colisao()
    pontuacao()
}

function desenhar(){
    mainChar.des_char(desenho)
    item1.des_char(desenho)
    item2.des_char(desenho)
    item3.des_char(desenho)
}   

function main(){
    desenho.clearRect(0,0,600,800)
    desenhar()
    atualiza()
    console.log(mainChar.vida)
    requestAnimationFrame(main)
}

main()