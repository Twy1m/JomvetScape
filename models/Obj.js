export class Personagem {
  constructor(x, imageSrc, cor, lk, rk, num) {
    this.x = x
    this.imageSrc = imageSrc
    this.cor = cor
    this.lk = lk
    this.rk = rk
    this.num = num

    this.vx = 0
    this.vida = 3
    this.tick = 0
    this.inv = 0
    this.vivo = true

    this.imagem = new Image()
    this.imagem.src = imageSrc

    this.w = 76
    this.h = 76
    this.y = 690
    this.damage = new Audio('../audio/damage.mp3')
    this.damage.volume = 0.2
  }

  
  update(keys) {

    if (this.vida <= 0) {
        this.vivo = false
        return // Para de processar movimento se estiver morto
    }
    const A = keys[this.lk]
    const D = keys[this.rk]

    //Velocidade X
    if (D && !A) {
      this.vx = 3.5
      // this.vx = 6
    } else if (A && !D) {
      this.vx = -3.5
      // this.vx = -6
    } else {
      this.vx *= 0.3
    }

    //definir X como velocidade
    this.x += this.vx

    //Teleporte
    if (this.x > 600) {
      this.x = -20
    }

    if (this.x < -20) {
      this.x = 590
    }

    //Invencibilidade
    if (this.inv > 0) {
      this.inv--
    }

    this.tick++
  }

  draw(ctx) {
      if (!this.vivo) return // Se estiver morto, sai da função e não desenha nada

    // pisca quando invencível, A cada 5 frames alterna entre mostrar e esconder, cria o efeito de piscar.
    const bob = Math.sin(this.tick * 0.08) * 3


    if (this.inv > 0 && Math.floor(this.inv / 5) % 2 === 1) return

    // desenha a imagem
    ctx.save()
    ctx.drawImage(this.imagem, this.x, this.y + bob, this.w, this.h)
    ctx.restore()

    // badge P1 / P2
    ctx.font = "bold 8px monospace"
    ctx.textAlign = "center"
    ctx.fillStyle = this.cor
    ctx.fillText("P" + this.num, this.x + this.w / 2, this.y + bob - 5)
  }

  colide(outro) {
    return (
      this.x < outro.x + outro.w &&
      this.x + this.w > outro.x &&
      this.y < outro.y + outro.h &&
      this.y + this.h > outro.y
    )
  }

  recebeDano() {
    if (this.inv > 0) return false
    this.vida--
    this.inv = 90 // ~1.5s de invencibilidade
    this.damage.currentTime = 0; 
    this.damage.play()
    return true
  }
}

export class Inimigo {
  constructor(faseAtual, stagger = 0) {
    //Stagger, número que espaça os inimigos no spawn inicial (0, 1, 2, 3...)

    this.faseAtual = faseAtual

    //Tamanho do inimigo
    this.w = 76
    this.h = 62

    //frame do inimigo
    this.fi = Math.floor(Math.random() * 4)
    this.ft = 0
    this.spriteSpd = faseAtual.spriteSpd

    //ZigZag dos inimigos
    this.zigOff = Math.random() * Math.PI * 2
    this.zigAmp = 18 + Math.random() * 38
    this.zigSpd = 0.02 + Math.random() * 0.020

    this.frames = [
      "img/sprite1.png",
      "img/sprite2.png",
      "img/sprite3.png",
      "img/sprite4.png",
    ].map((src) => {
      const i = new Image()
      i.src = src
      return i
    })

    this._spawn(stagger * 160)
    this.vel =
      faseAtual.vMin + Math.random() * (faseAtual.vMax - faseAtual.vMin) //
  }

  _spawn(yOff) {
    this.bx = 18 + Math.random() * (600 - this.w - 36)
    this.x = this.bx
    this.y = -this.h - yOff
  }

  update(faseAtual) {
    // 1. Move pra baixo
    this.y += this.vel

    // 2. Zigzag
    if (faseAtual.zigzag) {
      this.zigOff += this.zigSpd
      this.x = this.bx + Math.sin(this.zigOff) * this.zigAmp
    }

    // 3. Avança o frame de animação
    this.ft++
    if (this.ft >= this.spriteSpd) {
      this.ft = 0
      this.fi = (this.fi + 1) % this.frames.length
    }

    // 4. Saiu da tela por baixo
    if (this.y > 820) {
      this.vel =
        faseAtual.vMin + Math.random() * (faseAtual.vMax - faseAtual.vMin)
      this._spawn(0)
      return true // sinal pro index.js somar pontos
    }

    return false
  }

  draw(ctx) {
    const img = this.frames[this.fi]
    if (img.complete && img.naturalWidth > 0) {
      ctx.save()
      // ctx.globalCompositeOperation = "screen"
      ctx.drawImage(img, this.x, this.y, this.w, this.h)
      ctx.restore()
    }
  }

  reset() {
    this._spawn(0)
  }
}

export class Bonus {
  constructor(yOff = 0) {
    this.w = 36
    this.h = 36
    this.ativo = true
    this.cd = 0
    this.tick = 0
    this.spin = 0
    this._spawn(yOff)
  }

  update() {
    // Se não estiver ativo, conta o cooldown
    if (!this.ativo) {
        this.cd--
        if (this.cd <= 0) this._spawn(Math.random() * 250)
        return
    }
    
    if (this.vida <= 0) {
        this.vivo = false
        return
    }

    // Se estiver ativo, move pra baixo
    this.y += this.vel
    this.spin += 0.04
    this.tick++

    // Saiu da tela por baixo
    if (this.y > 820) this._spawn(0)
  }

  coletar() {
    this.ativo = false
    this.cd = 110 + Math.floor(Math.random() * 150)
  }

  draw(ctx) {
    if (!this.ativo) return

    ctx.save()
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2)
    ctx.rotate(Math.sin(this.tick * 0.05) * 0.2)

    if (this.tipo === "coracao") desenhaCoracao(ctx)
    else if (this.tipo === "osso") {
      ctx.rotate(this.spin)
      desenhaOsso(ctx)
    } else {
      ctx.rotate(this.spin)
      desenhaStar(ctx)
    }

    ctx.restore()
  }
  
  _spawn(yOff) {
    this.x = 30 + Math.random() * (600 - 96)
    this.y = -this.h - yOff
    this.vel = 1.2 + Math.random() * 1.6
    this.ativo = true
    this.spin = Math.random() * Math.PI * 2
    const r = Math.random()
    this.tipo = r < 0.28 ? "coracao" : r < 0.58 ? "osso" : "estrela"
  }
}

function desenhaCoracao(ctx) {
    ctx.fillStyle = "#ff4081"
    ctx.beginPath()
    // Desenho centralizado no 0,0 (pois usamos translate no Bonus.draw)
    ctx.moveTo(0, 10)
    ctx.bezierCurveTo(-15, -15, -30, 5, 0, 20)
    ctx.bezierCurveTo(30, 5, 15, -15, 0, 10)
    ctx.fill()
    ctx.closePath()
}

function desenhaOsso(ctx) {
    ctx.fillStyle = "#f5f5dc"
    // Retângulo central
    ctx.fillRect(-12, -4, 24, 8)
    // As 4 pontas (círculos)
    const pts = [[-12, -6], [-12, 6], [12, -6], [12, 6]]
    pts.forEach(p => {
        ctx.beginPath()
        ctx.arc(p[0], p[1], 6, 0, Math.PI * 2)
        ctx.fill()
    })
}

function desenhaStar(ctx) {
    ctx.fillStyle = "#FFD700"
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * 15,
                   -Math.sin((18 + i * 72) / 180 * Math.PI) * 15)
        ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 7,
                   -Math.sin((54 + i * 72) / 180 * Math.PI) * 7)
    }
    ctx.closePath()
    ctx.fill()
}