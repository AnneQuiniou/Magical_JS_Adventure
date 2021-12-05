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
var hauteurDeBase;


var gestionDuSaut = {
    debut: {
        limite:40,
        incrementDeSaut: 10,
    },
    milieu: {
        limite:140,
        incrementDeSaut:5,
    },
    fin: {
        limite:180,
        incrementDeSaut:4,
    },
    monter: true,
    hauteurDeBase: parseFloat(divPersoPrincipal.style.bottom),
}


var sautDuPersonnage = function() {
    hauteurDuPerso = parseFloat(divPersoPrincipal.style.bottom);

    if(isNaN(gestionDuSaut.hauteurDeBase)) {
        gestionDuSaut.hauteurDeBase = 25;
        hauteurDuPerso = gestionDuSaut.hauteurDeBase;
    }

    console.log(gestionDuSaut.hauteurDeBase);
    
    let pallierDebut = gestionDuSaut.hauteurDeBase + gestionDuSaut.debut.limite;
    let pallierMilieu = gestionDuSaut.hauteurDeBase + gestionDuSaut.milieu.limite;
    let pallierFin = gestionDuSaut.hauteurDeBase + gestionDuSaut.fin.limite;

    let incrementDebut = gestionDuSaut.debut.incrementDeSaut;
    let incrementMilieu = gestionDuSaut.milieu.incrementDeSaut;
    let incrementFin = gestionDuSaut.fin.incrementDeSaut;
    
    if(hauteurDuPerso >= pallierFin) {
        gestionDuSaut.monter = false;
        console.log('ici0');
    } else {
        if(hauteurDuPerso <= gestionDuSaut.hauteurDeBase) {
            gestionDuSaut.monter = true;
            console.log('ici1');
        }
    }
    
    if(hauteurDuPerso >= gestionDuSaut.hauteurDeBase && hauteurDuPerso < pallierDebut) {
        if(gestionDuSaut.monter) {
            hauteurDuPerso = hauteurDuPerso + incrementDebut;
            console.log('ici3');
        } else {
            hauteurDuPerso = hauteurDuPerso - incrementDebut;
            console.log('ici4');
        }
    }
    
    if(hauteurDuPerso >= pallierDebut && hauteurDuPerso < pallierMilieu) {
        if(gestionDuSaut.monter) {
            hauteurDuPerso = hauteurDuPerso + incrementMilieu;
            console.log('ici5');
        } else {
            hauteurDuPerso = hauteurDuPerso - incrementMilieu;
            console.log('ici6');
        }
    }
    
    if(hauteurDuPerso >= pallierMilieu && hauteurDuPerso <= pallierFin) {
        
        if(gestionDuSaut.monter) {
            hauteurDuPerso = hauteurDuPerso + incrementFin;
            console.log('ici7');
        } else {
            hauteurDuPerso = hauteurDuPerso - incrementFin;
            console.log('ici8');
        }
    }
    
    divPersoPrincipal.style.bottom = hauteurDuPerso + 'px';
    console.log(hauteurDuPerso);
    
    if(sautEnCours == true && hauteurDuPerso <= gestionDuSaut.hauteurDeBase) {
        clearInterval(finDuSaut);
        sautEnCours = false;
        gestionDuSaut.monter = true;
        console.log('ici9');
    }
    
    sautEnCours = true;

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