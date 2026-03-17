import Obj, {Personagem, Coletaveis} from './models/Obj.js'

let desenho = document.getElementById('desenho').getContext('2d')

let mainChar = new Personagem(250, 720, 80,80, 'img/IMG_2440.jpg')
let item1 = new Coletaveis(5500, 60, 80, 80, '/img/IMG_2440.jpg')
let item2 = new Coletaveis(530, 60, 80, 80, '/img/IMG_2440.jpg')
let item3 = new Coletaveis(200, 600, 80, 80, '/img/IMG_2440.jpg')

const keys = {}

document.addEventListener('keydown', (e)=>{
    keys[e.key] = true
})
document.addEventListener('keyup', (e)=>{
    keys[e.key] = false
})

function atualiza(){
    mainChar.mov_char(keys)
    item1.mov_it()
    item2.mov_it()
    item3.mov_it()
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
    requestAnimationFrame(main)
}

main()