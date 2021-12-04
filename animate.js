'use strict';

window.addEventListener('DOMContentLoaded', function() {
    
    // stockage des directions possibles
    const direction = {
        gauche: false,
        droite: false,
        idle: true,
    };
    
    let divPersoPrincipal = document.getElementsByClassName('perso_anne')[0];
    let finDuSaut;

    // stockages des informations pour les différents sprites utilisés
    const sprite = {
        classique: {
            reference: document.querySelectorAll('.perso_anne > img')[0],
            frameX: -128,
            idle: {
                placement: -20,
                nombreDeFrames: 4
            },
            marcherADroite: {
                placement: -789,
                nombreDeFrames: 8,
            },
            marcherAGauche:{
                placement: -916,
                nombreDeFrames: 8,
            },
            directionDesImages: 'left'
        },
        
        sorcier: {
            referenceAnne: document,
            frameX:12,
            frameY:12,
            directionDesImages: 'top'
        },
        
        chien: {
            frameX: '95px',
            line1:12,
            line2:12,
            line3:12,
            directionDesImages: 'left'
        }
        
    };
    
    let persoPrincipal = sprite.classique.reference;

    
    
    window.addEventListener('keydown', function(evenementSurevenu){
    if ('KeyF' === evenementSurevenu.code) {
            direction.droite = true;
            direction.idle = false;
        }
        if ('KeyD' === evenementSurevenu.code) {     
            direction.gauche = true;
            direction.idle = false;
        }
        if ('ShiftRight' === evenementSurevenu.code) {      
            console.log('touche');
            sauter();
        }
        if ('Enter' === evenementSurevenu.code) {      

        }
    });    
    
    window.addEventListener('keyup', function(evenementSurevenu){
        if ('KeyF' === evenementSurevenu.code) {// yoda condition > voir wiki     
            direction.droite = false;
            direction.idle = true;
        }
        if ('KeyD' === evenementSurevenu.code) {// yoda condition > voir wiki     
            direction.gauche = false;
            direction.idle = true;
    }
});

let mouvementDuPerso;

var leMoteurPourLesAnimations = function() {
    if(direction.droite) {
        deplacementDuFond('bg','droite');
        if(persoPrincipal == sprite.classique.reference) {
            mouvementDuPerso = parseFloat(persoPrincipal.style.top);
            
            if(isNaN(mouvementDuPerso)) {
                mouvementDuPerso = sprite.classique.marcherADroite.placement;
            }

            mouvementDuPerso = sprite.classique.marcherADroite.placement;

            persoPrincipal.style.top = mouvementDuPerso + 'px';

            marcheDuPersonnage(sprite.classique.marcherADroite.nombreDeFrames,sprite.classique.frameX,sprite.classique.directionDesImages);
        } else {
            console.log('tbd');
        }
    }

    if(direction.gauche) {
        deplacementDuFond('bg','gauche');
        
        if(persoPrincipal == sprite.classique.reference) {
            mouvementDuPerso = parseFloat(persoPrincipal.style.top);
            
            if(isNaN(mouvementDuPerso)) {
                mouvementDuPerso = sprite.classique.marcherAGauche.placement;
            }

            mouvementDuPerso = sprite.classique.marcherAGauche.placement;
            persoPrincipal.style.top = mouvementDuPerso + 'px';
    
            marcheDuPersonnage(sprite.classique.marcherAGauche.nombreDeFrames,sprite.classique.frameX,sprite.classique.directionDesImages);
        } else {
            console.log('tbd');
        }
    }

};


var leMoteurPourLIdle = function() {
    if(direction.idle) {
        if(persoPrincipal == sprite.classique.reference) {
            mouvementDuPerso = parseFloat(persoPrincipal.style.top);
            
            if(isNaN(mouvementDuPerso)) {
                mouvementDuPerso = sprite.classique.idle.placement;
            }

            mouvementDuPerso = sprite.classique.idle.placement;
            persoPrincipal.style.top = mouvementDuPerso + 'px';
            
            marcheDuPersonnage(sprite.classique.idle.nombreDeFrames,sprite.classique.frameX,sprite.classique.directionDesImages);
        
        } else {
            console.log('tbd');
        }
    }
};

let incrementParallaxeUn = -3;
let incrementParallaxeDeux= - 10;
let incrementParallaxeTrois = -20;

var premierFond;
var deuxiemeFond;
var troisiemeFond;

// Gestion du parallaxe des 3 divs BG contenant les fonds

var deplacementDuFond = function(fondUtilise, direction) {
    
    if(direction == 'droite') {
        incrementParallaxeUn = -1;
        incrementParallaxeDeux= - 3;
        incrementParallaxeTrois = -5;
    } else {
        incrementParallaxeUn = 1;
        incrementParallaxeDeux= 3;
        incrementParallaxeTrois = 5;
    }

    premierFond = parseFloat(document.getElementsByClassName(fondUtilise)[0].style['background-position-x']);
    deuxiemeFond = parseFloat(document.getElementsByClassName(fondUtilise)[1].style['background-position-x']);
    troisiemeFond = parseFloat(document.getElementsByClassName(fondUtilise)[2].style['background-position-x']);

    if(isNaN(premierFond)) {
        premierFond = 0;
    }
    if(isNaN(deuxiemeFond)) {
        deuxiemeFond = 0;
    }
    if(isNaN(troisiemeFond)) {
        troisiemeFond = 0;
    }

    premierFond = premierFond + incrementParallaxeUn;
    deuxiemeFond = deuxiemeFond + incrementParallaxeDeux;
    troisiemeFond = troisiemeFond + incrementParallaxeTrois;

    document.getElementsByClassName(fondUtilise)[0].style['background-position-x'] = premierFond + 'px';
    document.getElementsByClassName(fondUtilise)[1].style['background-position-x'] = deuxiemeFond + 'px';
    document.getElementsByClassName(fondUtilise)[2].style['background-position-x'] = troisiemeFond + 'px';

};


//Gestion de l'animation de marche du sprite
let positionImage;
let ajustement = -40;

var marcheDuPersonnage = function(nbrFrame,tailleFrame,varianteDeDirection) {
    positionImage = parseFloat(persoPrincipal.style[varianteDeDirection])
    
    if(isNaN(positionImage)) {
        positionImage = ajustement;
    }
    positionImage = positionImage + tailleFrame;

    if(positionImage <= (ajustement + tailleFrame*nbrFrame)) {
        positionImage = ajustement;
    }

    persoPrincipal.style[varianteDeDirection] = positionImage + 'px';
};


// gestion 
var sautEnCours = false;
var hauteurDuPerso;
var incrementDeSaut = -5;
var stockageDeLaHauteurDeBase;
var limiteHaute = 290;

var sautDuPersonnage = function() {
    stockageDeLaHauteurDeBase = parseFloat(divPersoPrincipal.style.top);

    hauteurDuPerso = parseFloat(divPersoPrincipal.style.top);
    if(isNaN(stockageDeLaHauteurDeBase)) {
        stockageDeLaHauteurDeBase = 420;
        hauteurDuPerso = 420;
    }

    if(hauteurDuPerso > limiteHaute) { // si le perso est moins haut que la limite
            if(hauteurDuPerso < stockageDeLaHauteurDeBase){
                hauteurDuPerso = hauteurDuPerso + incrementDeSaut;} // si le perso est moins haut mais qu'on descend

        hauteurDuPerso = hauteurDuPerso + incrementDeSaut; // on monte

    } else {
        hauteurDuPerso = hauteurDuPerso - incrementDeSaut;} // on descend
    
    // ALGO DE SAUT QUI PETE VOIR EXO DU RECTANGLE QUI GRANDIT
    // FAIRE VARIER L'INCREMENT EN FONCTION DE L'AVANCEE DANS LE SAUT
    // DEBUT DU SAUT : GROS INCREMENT, FIN DU SAUT, PETIT INCREMENT

    divPersoPrincipal.style.top = hauteurDuPerso + 'px';
    sautEnCours = true;

    if(sautEnCours == true && hauteurDuPerso == stockageDeLaHauteurDeBase) {
        clearInterval(finDuSaut);
        sautEnCours = false;
    }

};



window.setInterval(function(){
    leMoteurPourLesAnimations();
  },25);

window.setInterval(function(){
    leMoteurPourLIdle();
  },250);

 var sauter = function() {
    finDuSaut = setInterval(sautDuPersonnage,25);
};




});