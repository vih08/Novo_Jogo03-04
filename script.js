const canvas = document.getElementById('JogoCanvas')
const ctx = canvas.getContext('2d')

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x
        this.y = y
        this.largura = largura
        this.altura = altura
        this.cor = cor
    }
    desenhar() {
        ctx.fillStyle = this.cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

class Personagem extends Entidade {
    #velocidade_y
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor)
        this.#velocidade_y = 0
        this.pulando = false
    }
    saltar() {
        this.#velocidade_y = 15
        this.pulando = true
        console.log("saltar")
    }
    atualizar() {
        if (this.pulando) {
            this.y -= this.#velocidade_y
            this.#velocidade_y -= Jogo.gravidade
            if (this.y >= canvas.height - this.altura) {
                this.#velocidade_y = 0
                this.y = canvas.height - this.altura
                this.pulando = false
            }
        }
    }
}

class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, cor, velocidade_x) {
        super(x, y, largura, altura, cor)
        this.velocidade_x = velocidade_x
    }
    atualizar() {
        
        this.x -= this.velocidade_x
        if (this.x + this.largura < 0) {
            this.x = canvas.width
            this.altura = Math.random() * (150 - 50) + 50
        }
    }
}

function detectarColisao(personagem, obstaculo) {
    return (
        personagem.x < obstaculo.x + obstaculo.largura &&
        personagem.x + personagem.largura > obstaculo.x &&
        personagem.y < obstaculo.y + obstaculo.altura &&
        personagem.y + personagem.altura > obstaculo.y
    )
} 

class Jogo {
    static gravidade = 0.5
    constructor() {
        this.loop = this.loop.bind(this)
        this.gameOver = false
    }
    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        personagem.desenhar()
        obstaculo.desenhar()
        personagem.atualizar()
        obstaculo.atualizar()

        if (detectarColisao(personagem, obstaculo)) {
            this.gameOver = true
            console.log("GAME OVER")
            return
        }

        requestAnimationFrame(this.loop)
    }
}

const personagem = new Personagem(100, canvas.height - 50, 50, 50, 'purple')
const obstaculo = new Obstaculo(canvas.width - 50, canvas.height - 100, 50, 100, 'black', 5)
const jogo = new Jogo()

document.addEventListener('keypress', (e) => {
    if (e.code == 'Space' && !jogo.gameOver) {
        personagem.saltar()
    }
})

jogo.loop()