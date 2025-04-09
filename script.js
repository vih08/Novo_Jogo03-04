const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space') {
        personagem.saltar();
    }
});

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Personagem extends Entidade {
    #velocidade_y;

    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor);
        this.#velocidade_y = 0;
        this.pulando = false;
    }

    saltar() {
        this.#velocidade_y = 15; // Velocidade do salto
        this.pulando = true;
        console.log('saltar');
    }

    atualizar() {
        if (this.pulando) {
            this.y -= this.#velocidade_y;
            this.#velocidade_y -= Jogo.gravidade;

            if (this.y >= canvas.height - 50) {
                this.#velocidade_y = 0;
                this.y = canvas.height - 50;
                this.pulando = false;
            }
        }
    }

    verificaColisão() {
        if (
            obstaculo.x < this.x + this.largura &&
            obstaculo.x + obstaculo.largura > this.x &&
            this.y < obstaculo.y + obstaculo.altura &&
            this.y + this.altura > obstaculo.y
        ) {
            obstaculo.resetar();
            ctx.fillStyle = 'black';
            ctx.font = '50px Arial';
            ctx.fillText('GAME OVER', 50, 100);
            Jogo.gameOver = true;
            {
                gameOver = false
                setTimeout(reiniciarJogo, 3000)
            }
            ctx.font = '20px Arial';
            if (pontuacao_atual > pontuacao_maxima) {
                localStorage.setItem('PM', pontuacao_atual);
                ctx.fillText(`Novo Record: ${pontuacao_atual}`, 50, 150);
            } else {
                ctx.fillText(`Pontos Da Jogada: ${pontuacao_atual}`, 50, 150);
            }
        }
    }
}

class Obstaculo extends Entidade {
    #velocidade_x;

    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor);
        this.#velocidade_x = 3;
    }

    atualizar() {
        this.x -= this.#velocidade_x;

        if (this.x <= 0 - this.largura) {
            this.x = canvas.width;
            this.#velocidade_x += 1;
            let nova_altura = Math.random() * (150 - 90) + 90;
            this.altura = nova_altura;
            this.y = canvas.height - nova_altura;
        }
    }

    resetar() {
        this.x = canvas.width - 50;
        this.#velocidade_x = 3; // Reiniciando velocidade
    }
}

class Jogo {
    static gameOver = false;
    static gravidade = 0.5;

    constructor() {
        this.loop = this.loop.bind(this);
    }

    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        personagem.desenhar();
        obstaculo.desenhar();
        personagem.atualizar();
        obstaculo.atualizar();
        personagem.verificaColisão();

        if (!Jogo.gameOver) {
            requestAnimationFrame(this.loop);
        }
    }
}
const personagem = new Personagem(100, canvas.height - 50, 50, 50, 'blue');
const obstaculo = new Obstaculo(canvas.width - 50, canvas.height - 100, 50, 100, 'red');
const jogo = new Jogo();
jogo.loop();