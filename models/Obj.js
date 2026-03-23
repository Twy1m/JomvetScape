export class Personagem{
    constructor(x,imageSrc,cor,lk,rk,num){
        this.x = x
        this.imageSrc = imageSrc
        this.cor = cor
        this.lk = lk
        this.rk = rk
        this.num = num

        this.vx   = 0
        this.vida = 3
        this.tick = 0
        this.inv  = 0
        this.vivo = true

        this.imagem = new Image()
        this.imagem.src = imageSrc  
        
        this.w = 76
        this.h = 76
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

    draw(ctx) {
    // pisca quando invencível, A cada 5 frames alterna entre mostrar e esconder, cria o efeito de piscar.
    const bob = Math.sin(this.tick * 0.08) * 3

    if (this.inv > 0 && Math.floor(this.inv / 5) % 2 === 1) {
        return    ctx.drawImage(this.imagem, this.x, this.y + bob, this.w, this.h)
    }

    // desenha a imagem
    ctx.save()
    ctx.globalCompositeOperation = 'screen' // remove o fundo preto das imagens dos sprites. save() e restore() garantem que esse efeito não vaze para outros elementos.
    ctx.drawImage(this.imagem, this.x, this.y + bob, this.w, this.h)
    ctx.restore()

    // badge P1 / P2
    ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = this.cor
    ctx.fillText('P' + this.num, this.x + this.w / 2, this.y + bob - 5)
    }

    colide(outro) {
        return (
            this.x < outro.x + outro.w &&
            this.x + this.w > outro.x  &&
            this.y < outro.y + outro.h &&
            this.y + this.h > outro.y
        )
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
