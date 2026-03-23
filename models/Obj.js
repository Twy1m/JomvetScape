export default class Personagem{
    constructor(x,imageSrc,cor,lk,rk,num){
        this.x = x
        this.imageSrc = imageSrc
        this.cor = cor
        this.lk = lk
        this.rk = rk
        this.num = num

        vida = 3
        vx = 0
        inv = 0
        tick = 0
        vivo = true

        this.imagem = new Image()
        this.imagem.src = imageSrc  
        
    }

    update(keys){
        const A = keys[this.lk]
        const D = keys[this.rk]

        //Velocidade X
        if(D && !A){
            this.vx =  6
        }else if (A && !D){
            this.vx = -6
        }else{
            this.vx *= 0.7
        }

        //definir X como velocidade
        this.x += this.vx


        //Teleporte
        if (this.x > 600){
                this.x = -this.w 
        }     

        if (this.x < -this.w) {
                this.x = 600     
        }

        //Invencibilidade
        if (this.inv > 0){
            this.inv--
        }

        this.tick++

    }

    recebeDano() {
        if (this.inv > 0) return false;
        this.vida--;
        this.inv = 90;  // ~1.5s de invencibilidade
        return true;
    }

}

export class Inimigo{
constructor(){

}

}

export class Bonus{
    constructor(){

    }
}
