let my_screen = document.getElementById('game_screen') as HTMLCanvasElement;
const context = my_screen.getContext('2d') as CanvasRenderingContext2D;

let rectY = my_screen.height / 2; // Posição inicial da base retangular
let circles: {
    x: number;y: number;radius: number
} [] = []; // Armazenar os círculos

let gameRunning = false; // Variável para controlar o estado do jogo
let score = 0; // Variável para armazenar a pontuação


// Função para desenhar a base retangular móvel
function drawRect() {
    context.fillStyle = 'red';
    context.fillRect(my_screen.width - 20, rectY, 20, 40); // Posição e tamanho da base retangular
}


// Função para verificar a colisão entre os círculos e a base retangular
function checkCollision() {
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];

        // Verificar se houve colisão com a base retangular
        if (
            circle.x + circle.radius >= my_screen.width - 20 &&
            circle.y + circle.radius >= rectY &&
            circle.y - circle.radius <= rectY + 40 // Altura da base retangular
        ) {
            circles.splice(i, 1); // Remover o círculo colidido
        }
    }
}


function checkCollisionWithRect(circle: {
    x: number;y: number;radius: number
}) {
    return (
        circle.x + circle.radius >= my_screen.width - 20 &&
        circle.y + circle.radius >= rectY &&
        circle.y - circle.radius <= rectY + 40 // Altura da base retangular
    );
}

// Função para movimentar os círculos, verificar colisões e encerrar o jogo
function moveCircles() {
    context.clearRect(0, 0, my_screen.width, my_screen.height);

    drawRect(); // Desenhar a base retangular

    function stopGame() {
        gameRunning = false;
    }

    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        circle.x += 1; // Movimento para a direita

        drawCircle(circle.x, circle.y, circle.radius);

        if (checkCollisionWithRect(circle)) {
            circles.splice(i, 1); // Remover o círculo colidido
            i--; // Decrementar o índice para compensar a remoção do círculo
            score += 10; // Incrementar a pontuação
            const gameText = document.getElementById('gameText');
            if (gameText) {
                gameText.innerHTML = `Score: ${score}pts`; // Exibir a pontuação
            }
        } else if (circle.x + circle.radius >= my_screen.width) {
            stopGame(); // Encerrar o jogo se o círculo atingir a base da tela sem colidir
            const gameText = document.getElementById('gameText');
            if (gameText) {
                gameText.innerHTML = `Game Over`; // game over
            }
            let game_over = new Audio('sounds/game_over.mp3');
            game_over.play();
            document.querySelector('canvas')?.classList.add('game-over');
            setTimeout(() => { document.querySelector('canvas')?.classList.remove('game-over'); }, 200);
            return;
        }
    }

    if (gameRunning) {
        requestAnimationFrame(moveCircles); // Continuar movendo os círculos
    }
}

// Evento ao clicar no botão
let my_button = document.getElementById('redraw_button') as HTMLElement;

function generateRandomCircle() {
    // Gera um círculo aleatório
    const x = 0;
    const y = Math.random() * (my_screen.height - 40);
    const radius = 10;

    // armazena o círculo gerado
    circles.push({
        x,
        y,
        radius
    });

    // desenha o círculo
    drawCircle(x, y, radius);
}

function drawCircle(x: number, y: number, radius: number) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = 'White';
    context.fill();
    context.closePath();
}
function soundTrack() {
    let sound = new Audio('sounds/soundtrack.mp3');
    sound.play();    // tocar a música
    sound.loop = true;  // loop infinito
    sound.volume = 0.1; // 10% do volume
    if (gameRunning === false) {
        sound.pause();
    }
}


my_button.onclick = function () {
    gameRunning = true;
    circles = []; // limpa os círculos
    score = 0; // zera a pontuação
    soundTrack();
    
    setInterval(() => {
        if (gameRunning) {
            generateRandomCircle();
        }
    }, 3000);
    const gameText = document.getElementById('gameText');
    if (gameText) {
        gameText.innerHTML = `Score: ${score}pts`; // Exibir a pontuação
    }
    // começar a mover os círculos
    moveCircles();
};


// Eventos do teclado para mover a base retangular
document.onkeydown = function (event) {
    var name = event.key;

    if (name === 'ArrowUp') {
        rectY -= 10; // Movimento para cima
    } else if (name === 'ArrowDown') {
        rectY += 10; // Movimento para baixo
    }
};