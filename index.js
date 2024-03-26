class Game {
    constructor() {
        this.table = document.querySelector('table');
        this.as = [];
        this.y = 0; // Define a posição inicial do jogador
        this.x = 0; // Define a posição inicial do jogador
        this.lives = 3;
        this.livesInicial = this.lives; // Armazena o número inicial de vidas
        this.points = 0;
        this.testCount = 0; 
        // this.numPoints = this.table.rows.length * this.table.rows.length / 16 
        this.addEventListeners();
        this.createTable();
        this.updateScore();
        this.hasBomb = this.hasBomb.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        // Configura a cor da célula do jogador para vermelho
        let initialValueCell = this.as[this.y].querySelectorAll('th')[this.x];
        initialValueCell.style.backgroundColor = 'red';

        // Adiciona as entidades (bombas e pontos) na tabela durante a inicialização
        this.addEntities();
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    createTable(size) {
        // Limpa a tabela atual
        this.table.innerHTML = '';
    
        // Cria a nova tabela com o tamanho especificado
        for (let i = 0; i < size; i++) {
            var row = document.createElement('tr');
            this.table.appendChild(row);
            for (let j = 0; j < size; j++) {
                var cell = document.createElement('th');
                row.appendChild(cell);
            }
        }
        this.as = this.table.querySelectorAll('tr');
    
        // Chamada para atualizar a pontuação após a criação da tabela
        this.updateScore();
    
        // Adiciona as entidades (bombas e pontos) na tabela durante a criação da nova tabela
        this.addEntities();
    }
    
    addEntities() {
        var numBombs = this.table.rows.length * 2; // Define o número de bombas como o dobro do número de linhas da tabela
        var numPoints = 7; // Define o número de pontos como um quarto do número total de células
    
        // Verifica se a tabela tem pelo menos uma linha e uma célula antes de adicionar entidades
        if (this.table.rows.length > 0 && this.table.rows[0].cells.length > 0) {
            for (let i = 0; i < numBombs; i++) {
                let randomRow = this.getRandomInt(0, this.table.rows.length - 1);
                let randomCol = this.getRandomInt(0, this.table.rows[0].cells.length - 1);
                let row = this.as[randomRow];
                let cell = row.querySelectorAll('th')[randomCol];
                cell.classList.add('bomb');
            }
    
            for (let i = 0; i < numPoints; i++) {
                let randomRow = this.getRandomInt(0, this.table.rows.length - 1);
                let randomCol = this.getRandomInt(0, this.table.rows[0].cells.length - 1);
                let row = this.as[randomRow];
                let cell = row.querySelectorAll('th')[randomCol];
                if (!cell.classList.contains('bomb') && !cell.classList.contains('point')) {
                    cell.classList.add('point');
                } else {
                    i--; // Tenta novamente se a célula já contiver uma bomba ou um ponto
                }
            }
        } else {
            console.error('A tabela está vazia ou não possui células.');
        }
    }
    
    

    updateScore() {
        document.getElementById('lives').textContent = 'Vidas: ' + this.lives;
        document.getElementById('points').textContent = 'Pontos: ' + this.points;
        document.getElementById('testCount').textContent = 'Blocos Percorridos: ' + this.testCount;
    }

    hasBomb(row, col) {
        let tableSize = this.as.length; // Obtem o tamanho da tabela dinamicamente
        if (row >= 0 && row < tableSize && col >= 0 && col < tableSize) {
            let cell = this.as[row].querySelectorAll('th')[col];
            return cell.classList.contains('bomb');
        }
        return false;
    }

    handleKeyDown(e) {
        let tempvaluex = this.x;
        let tempvaluey = this.y;

        let tableSize = this.as.length;

        if (e.key === 'w' && this.y > 0) {
            this.y -= 1;
            this.testCount++; 
        } else if (e.key === 's' && this.y < tableSize - 1) {
            this.y += 1;
            this.testCount++; 
        } else if (e.key === 'a' && this.x > 0) {
            this.x -= 1;
            this.testCount++; // Incrementa o contador de blocos percorridos
        } else if (e.key === 'd' && this.x < tableSize - 1) {
            this.x += 1;
            this.testCount++; 
        }

        let value = this.as[tempvaluey].querySelectorAll('th');
        value[tempvaluex].style.backgroundColor = 'aqua';
        value = this.as[this.y].querySelectorAll('th');
        value[this.x].style.backgroundColor = 'red';

        if (this.hasBomb(this.y, this.x)) {
            this.lives--;
            let cell = this.as[this.y].querySelectorAll('th')[this.x];
            cell.classList.remove('bomb');
            if (this.lives === 0) {
                alert("Você perdeu todas as suas vidas!");
                window.location.reload();
            } else {
                alert("Você perdeu uma vida! Restam " + this.lives + " vidas.");
            }
        }

        if (value[this.x].classList.contains('point')) {
            this.points++;
            this.lives++;
            value[this.x].classList.remove('point');

            // Atualiza a contagem de pontos na interface
            this.updateScore();

            // Verifica se todos os pontos foram coletados
            if (this.points === 7) {
                let pontosPegos = this.points;
                alert(`Parabéns! Você coletou todos os pontos!\n\nTotal de blocos percorridos: ${this.testCount}\nPontos coletados: ${pontosPegos}`);
                window.location.reload();
            }
        }
    }

    addEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Adiciona um evento para alterar o tamanho da tabela quando o botão for clicado
        const changeSizeBtn = document.getElementById('change-size');
        changeSizeBtn.addEventListener('click', () => {
            const newSize = parseInt(document.getElementById('table-size').value);
            this.createTable(newSize);
        });
    }
}


const game = new Game();

