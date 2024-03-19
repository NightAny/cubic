class game{
    constructor(){
        this.lanterna = false;
        this.gameStart = false;
        this.energia = 128;
        this.lucidez = 128;
        this.horas = 0;
        this.dia = localStorage.getItem("dia");
        this.pause = false;
        this.local = 1;
        this.music = 0;
    }

    ligarLanterna(){
        this.lanterna = !this.lanterna;
    }

    diminuirEnergia(){
        this.energia = this.energia - 0.5;
    }

    diminuirLucidez(){
        this.lucidez = this.lucidez - (this.dia / 3);
    }

    comecarJogo(){
        this.gameStart = true;
        this.music = 2;
    }

    mudarHora(){
        this.horas = this.horas + 1;
    }

    mudarDia(){
        this.dia = parseInt(this.dia) + 1;
        localStorage.setItem("dia", this.dia.toString());
    }

    pausar(){
        this.pause = !this.pause;
    }

    tocarMusica(){
        let musica = document.querySelectorAll(".backgroundMusic audio");
        for(let i = 0; i < musica.length; i++){
            musica[i].volume = 0.1;
            if (i === this.music){
                musica[i].play();
            } else if(!musica[i].paused){
                musica[i].pause();
            }
        }
    }
}

let jogador1 = new game();

const comecarJogo = () => {
    jogador1 = new game();

    jogador1.comecarJogo();

    if(!localStorage.getItem("dia")){
        jogador1.dia = 1;
        localStorage.setItem("dia", "1");
    }

    document.getElementById("homeScreen").classList.toggle("hidden");
    document.getElementById("gameScreen").classList.toggle("hidden");

    jogador1.music = 1;
    document.getElementById("dia").textContent = jogador1.dia;
    jogador1.tocarMusica();
};

const novoJogo = () =>{
    localStorage.setItem("dia", "1");
    comecarJogo();
}

//
//energia
//

const diminuirEnergia = () =>{
    if(!jogador1.lanterna) return;
    if(!jogador1.gameStart) return;
    if(jogador1.pause) return;

    jogador1.diminuirEnergia();
    document.getElementById("energia").style.width = jogador1.energia + "px";
    // desliga lanterna
    if(jogador1.energia <= 0){
        document.getElementById("lanterna").classList.remove("lanternaLigada");
        document.getElementById("lanterna").classList.add("lanternaDesligada");
    }
}

setInterval(diminuirEnergia, 1000);

//
//lucidez
//

const diminuirLucidez = () => {
    if(jogador1.lanterna) return;
    if(!jogador1.gameStart) return;
    if(jogador1.pause) return;

    jogador1.diminuirLucidez();
    document.getElementById("lucidez").style.width = jogador1.lucidez + "px";
}

setInterval(diminuirLucidez, 1000);

//
//horas
//

const mudarHora = () => {
    if(!jogador1.gameStart) return;
    if(jogador1.pause) return;

    jogador1.mudarHora();
    document.getElementById("horas").textContent = jogador1.horas;

    if(jogador1.horas == 6){
        document.getElementById("gameScreen").classList.toggle("hidden");
        document.getElementById("diaScreen").classList.toggle("hidden");

        jogador1.mudarDia();
        jogador1 = new game();
        document.getElementById("horas").textContent = jogador1.horas == 0 ? 12 : jogador1.horas;
        document.getElementById("dia").textContent = jogador1.dia;
        document.getElementById("diaItem").textContent = jogador1.dia;

        setTimeout(() =>{
            jogador1.comecarJogo();
            document.getElementById("lucidez").style.width = "128px";
            document.getElementById("energia").style.width = "128px";
            document.getElementById("gameScreen").classList.toggle("hidden");
            document.getElementById("diaScreen").classList.toggle("hidden");

            if(document.getElementById("lanterna").classList.contains("lanternaDesligada")) return;

            document.getElementById("lanterna").classList.toggle("lanternaLigada");
            document.getElementById("lanterna").classList.toggle("lanternaDesligada");
        }, 5000);
    };
}

setInterval(mudarHora, 50000);

//
//mapa
//

const mudarMapa = (decisao) => {
    if(jogador1.pause) return;
    if(jogador1.local === posisaoMonstro){
        endGame();
        return;
    }
    if(jogador1.local + decisao <= 0) return;
    if(jogador1.local + decisao == 5) return;

    jogador1.local = jogador1.local + decisao;
    document.getElementById("gameScreen").style.backgroundImage = `url('./assets/cenarios/${jogador1.local}.png')`;
    if(jogador1.local !== posisaoMonstro) return;

    document.getElementById("gameScreen").style.backgroundImage = `url('./assets/monstro/${jogador1.local}.png')`;
    setTimeout(() => {
        jumpscare();
    }, 1500);
}

document.addEventListener("keydown", (e) => {
    if(e.key == "ArrowLeft"){
        mudarMapa(-1);
    } else if(e.key == "ArrowRight"){
        mudarMapa(1);
    }
});

//
//music
//

const musicIntro = () => {
    jogador1.tocarMusica();
};

musicIntro();

//
//monstro
//

let posisaoMonstro = 5;
const aparecerMonstro = () =>{
    if(!jogador1.gameStart) return;
    if(jogador1.pause) return;
    if(jogador1.horas < 1 && jogador1.dia === 1) return;

    let numRandom = parseInt(Math.random() * 2);

    if(numRandom){
        posisaoMonstro += posisaoMonstro < jogador1.local ? 1 : -1;
    };

    if(jogador1.local !== posisaoMonstro) return;

    document.getElementById("rugidoSound").play();
    document.getElementById("gameScreen").style.backgroundImage = `url('./assets/monstro/${jogador1.local}.png')`;

    setTimeout(() => {
        desaparecerMonstro();
    }, 6000);

    setTimeout(() => {
        jumpscare();
    }, 2000);
}

setInterval(aparecerMonstro, 10000);

const desaparecerMonstro = () =>{
    if(jogador1.lanterna) return;

    posisaoMonstro += Math.random() * 2 ? 1 : -1;
    
    document.getElementById("gameScreen").style.backgroundImage = `url('./assets/cenarios/${jogador1.local}.png')`;
}

const jumpscare = () =>{
    if(!jogador1.lanterna) return;
    if(jogador1.local !== posisaoMonstro) return;

    endGame();
}

//
//fimjogo
//

const endGame = () =>{
    document.getElementById("endSound").play();
    document.getElementById("gameScreen").style.backgroundImage = "url('./assets/home/endgame.png')";
    jogador1.pausar();

    setTimeout(() => {
        location.reload();
    }, 6000);
}

//
//teclado
//
document.addEventListener("keydown", (e) => {
    if(e.key != "Escape") return;
    
    jogador1.pausar();
    document.getElementById("pause").classList.toggle("hidden");
});

document.addEventListener("keydown", (e) => {
    if(e.key != "l" && e.key != " ") return;
    if(jogador1.pause) return;
    if(jogador1.energia <= 0) return;
    
    jogador1.ligarLanterna();
    jogador1.lanterna && document.getElementById("lanternaSound").play();
    document.getElementById("lanterna").classList.toggle("lanternaLigada");
    document.getElementById("lanterna").classList.toggle("lanternaDesligada");
});

document.getElementById("toqueLanterna").addEventListener("touchstart", () => {
    if(jogador1.pause) return;
    if(jogador1.energia <= 0) return;
    
    jogador1.ligarLanterna();
    jogador1.lanterna && document.getElementById("lanternaSound").play();
    document.getElementById("lanterna").classList.toggle("lanternaLigada");
    document.getElementById("lanterna").classList.toggle("lanternaDesligada");
});