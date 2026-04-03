# 🎮 JomvetScape

> **Desenvolvedor:** Matheus Gomes Steingräber  
> **GitHub:** [Twy1m](https://github.com/Twy1m)  
> **Contato:** matheusg.stein@gmail.com  
> **Product Owner:** Carlos Roberto da Silva Filho

---

![JomvetScape Banner](./img/jomvet8bit.png)

---

## 📋 Visão Geral do Sistema

**JomvetScape** é um jogo desenvolvido em JavaScript puro utilizando a API Canvas do HTML5. O jogador controla o personagem **Jomvet** em uma tela vertical, desviando de inimigos que descem pela tela e coletando itens especiais para acumular pontos e sobreviver até o final.

### 🎯 Objetivo

O objetivo do jogo é desviar dos inimigos que aparecem na tela, coletar itens de bônus e acumular pontuação suficiente para avançar por todas as **3 fases** e alcançar a vitória. O jogo acaba quando todos os jogadores perdem todas as suas vidas.

### 🌍 Tema

O jogo tem como tema um estilo **retro pixel art / arcade**, com o personagem Jomvet navegando por cenários noturnos que vão ficando progressivamente mais caóticos e desafiadores. A cada fase, o ambiente muda de cor e os inimigos ficam mais rápidos e imprevisíveis.

---

## 🕹️ Instruções de Jogabilidade

### Controles

| Jogador | Mover para Esquerda | Mover para Direita |
|---------|--------------------|--------------------|
| **P1**  | `A`                | `D`                |
| **P2**  | `←`                | `→`                |

### Navegação nos Menus

| Tecla       | Ação                            |
|-------------|---------------------------------|
| `↑` / `↓`  | Navegar entre as opções do menu |
| `Enter`     | Confirmar seleção               |

### 🎁 Coletáveis

| Item | Símbolo | Efeito |
|------|---------|--------|
| Coração | ❤ | Recupera **+1 vida** (máximo de 5) |
| Osso | 🦴 | Concede **+10 pontos** |
| Estrela | ⭐ | Concede **+15 pontos** |

> **Dica:** Os inimigos que passam pela tela sem te acertar também concedem **+5 pontos**!

---

## ⚙️ Especificações Técnicas

### Modos de Jogo

- **1 Jogador:** Apenas P1 está ativo, controlado com `A` e `D`.
- **2 Jogadores:** P1 e P2 jogam simultaneamente no mesmo teclado (modo cooperativo).

### Sistema de Vidas

- Cada jogador começa com **3 vidas** (❤❤❤).
- Ao colidir com um inimigo, o jogador perde **1 vida** e fica **invencível por ~1,5 segundo** (efeito de piscar).
- O jogo termina quando **todos os jogadores** ficam sem vida.

### Progressão de Fases

O jogo possui **3 fases**, cada uma com dificuldade crescente:

| Fase | Meta de Pontos | Inimigos | Velocidade | Movimento |
|------|---------------|----------|------------|-----------|
| **Fase 1** — Modo Normal | 100 pts | 4 | Lenta | Reto |
| **Fase 2** — Modo Hard! | 200 pts | 4 | Média | Zigzag |
| **Fase 3** — MODO CAOS! | 500 pts | 5 | Alta | Zigzag intenso |

- Ao atingir a **meta de pontos** da fase atual, uma tela de transição é exibida e o jogador avança.
- Ao completar a **Fase 3**, a tela de **Vitória** é exibida.

### Animações e Efeitos

- Os inimigos possuem **animação por spritesheet** (4 frames).
- Os bônus têm **efeito de rotação** e **balanço suave**.
- Cada fase possui um **esquema de cores** de céu e chão exclusivo.

### Trilha Sonora

- Música de fundo em loop durante o jogo.
- Efeitos sonoros para: dano recebido, coleta de vida, coleta de pontos, game over e vitória.

---

## 🏆 Créditos

### Sobre o Desenvolvedor

| Campo | Informação |
|-------|------------|
| **Nome** | Matheus Gomes Steingraber |
| **GitHub** | [Twy1m](https://github.com/Twy1m) |
| **E-mail** | matheusg.stein@gmail.com |

### Product Owner

| Campo | Informação |
|-------|------------|
| **Nome** | Carlos Roberto da Silva Filho |
| **Função** | Professor Orientador |

---

## 🌐 Link de Produção

> 🔗 **[Jogar JomvetScape Online](https://jomvet-scape.vercel.app/)**  


---

## 🚀 Instruções de Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone https://github.com/Twy1m/JomvetScape.git
```

### 2. Instalar Dependências

```bash
cd JomvetScape
npm install
```

> **Nota:** O projeto utiliza JavaScript puro com módulos ES6, sem frameworks externos. O `npm install` é necessário apenas se houver um servidor local configurado no `package.json`.

### 3. Executar o Projeto

Como o projeto usa **módulos ES6** (`type="module"` no script), é necessário servir os arquivos por um servidor local — abrir o `index.html` diretamente no navegador não funcionará.

**Opção A — Live Server (VS Code):**  
Instale a extensão *Live Server* no VS Code, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

**Opção B — http-server via npm:**

```bash
npx http-server .
```

Depois acesse `http://localhost:8080` no navegador.

### 4. Link do Sistema em Produção (Vercel)

> 🔗 **[https://jomvetscape.vercel.app](https://jomvet-scape.vercel.app/)**  
