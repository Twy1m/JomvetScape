export default class Obj{
    constructor(x,y,w,h,a){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        this.imagem = new Image()
        this.imagem.src = a
    }
    des_char(ctx){
        ctx.drawImage(this.imagem, this.x, this.y, this.w, this.h);
    }

}

export class Personagem extends Obj{
    
    dir = 0
    vida = 5
    pontos = 0
    frame = 1
    tempo = 0

    mov_char(keys){
        const esq = keys['a']
        const direi = keys['d']

        if(!direi && !esq || esq && direi){
            this.dir = 0
        }
        if(direi && !esq){
            this.dir = 5
        }
        if(!direi && esq){
            this.dir = -5
        }
        this.x += this.dir

        if(this.x < -40){
            this.x = 540
        }else if(this.x > 580){
            this.x = -40
        }
    }

    colid(objeto){
        if((this.x < objeto.x + objeto.w)&&
          (this.x + this.w > objeto.x)&&
          (this.y < objeto.y + objeto.h)&&
          (this.y + this.h > objeto.y)){
            return true
        }else{
            return false
        }
    }

    point(objeto){
        if(objeto.y >= 800){
            return true
        }else{
            return false
        }
    }
}

export class Coletaveis extends Obj{
    vel = 4

    recomeca(){
        this.y = -100
        this.x = Math.floor(Math.random() * (520 - 80) + 80)
    }

    mov_it(){
        this.y += this.vel
        if(this.y >= 900){            
            this.recomeca()         
        }
    }
}
