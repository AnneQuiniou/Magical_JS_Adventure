'use strict';

window.addEventListener('DOMContentLoaded', function() {
    
    // stockage des mouvements possibles
    const direction = {
        gauche: false,
        droite: false,
        idle: true,
    };
    
    let animationEnCours = false;
    let dialogueVisible = false; 
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
            reference: document.querySelectorAll('.pnj_chien > img')[0],
            div: document.querySelectorAll('.pnj_chien')[0],
            frameX: '67px',
            directionDesImages: 'left',
            nombreDeFrames: 2
        }
        
    };

    let obstacles = {
        limitegauche: {
            apparitionX: -305,
            div: document.querySelectorAll('.panneaux')[0]
        },
        city: {
            boite: {
                hauteur: 48,
                largeur: 40,
                apparitionX: -200,
                visible: false
            }
        },
        forest: {

        }
    }
    
    var ici= 'this';
    const dialogues = {
        limite: {
            perso: 'Anne',
            texte: 'Gif-sur-DotNet? Mais non, je veux aller à Paris!',
        },
        intro0: {
            perso: '<strong>Guide</strong>',
            texte:`Utilisez <strong>D et F</strong> pour aller à gauche et droite.<br>
            Utilisez <strong>Maj</strong> pour sauter et <strong>Entrée</strong> pour dialoguer.`,
            next: this.intro1,
        },
        intro1: {
            positionVSparallax: '-255',
            perso: 'Anne',
            texte: `Wow, Paris. Quelle belle ville. J'ai hâte d'y avoir mes diplômes.`,
        },
    }

    let bonus = {
        gateau: {
            positionX:-200,
            positionY:23,
            sprite: `url('images/icones/pie.png')`,
        },
        diplome1: {
            positionX: -150,
            positionY: 23,
            message: {
                perso: 'Bonus',
                texte: `Vous recevez un <strong>Master d'Anglais</strong>!<br>
                <em>Good work!</em>`,
            },
            sprite: `url('images/icones/diplome_1.png')`,
            visible: false,
        },
    }


    let persoPrincipal = sprite.classique.reference;

    
    
    window.addEventListener('keydown', function(evenementSurevenu){
    if(!dialogueVisible && !animationEnCours) {
        if ('KeyF' === evenementSurevenu.code) {
            direction.droite = true;
            direction.idle = false;
        }
        if ('KeyD' === evenementSurevenu.code) {     
            direction.gauche = true;
            direction.idle = false;
        }
        if ('ShiftRight' === evenementSurevenu.code) {      
            if(!gestionDuSaut.enCours) {
                sauter();

            }
        }
        if ('Enter' === evenementSurevenu.code) {      

        }
    } else {
        if('Enter' === evenementSurevenu.code) {
            let dialogueEnCours = this.document.querySelector('.dialogue');
            dialogueEnCours.remove();
            dialogueVisible = false;
        }
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
        deplacementDeLElementAvecFond(sprite.chien.div);
        deplacementDeLElementAvecFond(obstacles.limitegauche.div);

        if(persoPrincipal == sprite.classique.reference) {
            mouvementDuPerso = parseFloat(persoPrincipal.style.top);
            
            if(isNaN(mouvementDuPerso)) {
                mouvementDuPerso = sprite.classique.marcherADroite.placement;
            }

            mouvementDuPerso = sprite.classique.marcherADroite.placement;

            persoPrincipal.style.top = mouvementDuPerso + 'px';

            marcheDuPersonnage(sprite.classique.marcherADroite.nombreDeFrames, sprite.classique.frameX, sprite.classique.directionDesImages);
        } else {
            console.log('tbd');
        }
    }

    if(direction.gauche) {
        deplacementDuFond('bg','gauche');
        deplacementDeLElementAvecFond(sprite.chien.div);
        deplacementDeLElementAvecFond(obstacles.limitegauche.div);
        if(persoPrincipal == sprite.classique.reference) {
            mouvementDuPerso = parseFloat(persoPrincipal.style.top);
            
            if(isNaN(mouvementDuPerso)) {
                mouvementDuPerso = sprite.classique.marcherAGauche.placement;
            }

            mouvementDuPerso = sprite.classique.marcherAGauche.placement;
            persoPrincipal.style.top = mouvementDuPerso + 'px';
    
            marcheDuPersonnage(sprite.classique.marcherAGauche.nombreDeFrames, sprite.classique.frameX, sprite.classique.directionDesImages);
        } else {
            console.log('tbd');
        }
    }

};


var leMoteurPourLIdle = function() {  //IDLE UNIQUEMENT DU PERSO PRINCIPAL SELON SPRITE UTILISE
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


let incrementParallaxeUn;
let incrementParallaxeDeux;
let incrementParallaxeTrois;

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
var hauteurDuPerso;
var hauteurDuSol;


var gestionDuSaut = {
    enCours: false,
    debut: {
        limite:45,
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
// il vaudrait mieux une hauteur de sol de base?
    if(isNaN(hauteurDuPerso)) {
        gestionDuSaut.hauteurDeBase = 25;
        hauteurDuPerso = gestionDuSaut.hauteurDeBase + 1;
    }
    
    let pallierDebut = gestionDuSaut.hauteurDeBase + gestionDuSaut.debut.limite;
    let pallierMilieu = gestionDuSaut.hauteurDeBase + gestionDuSaut.milieu.limite;
    let pallierFin = gestionDuSaut.hauteurDeBase + gestionDuSaut.fin.limite;

    let incrementDebut = gestionDuSaut.debut.incrementDeSaut;
    let incrementMilieu = gestionDuSaut.milieu.incrementDeSaut;
    let incrementFin = gestionDuSaut.fin.incrementDeSaut;
    
    if(hauteurDuPerso >= pallierFin) {
        gestionDuSaut.monter = false;
    } else {
        if(hauteurDuPerso <= gestionDuSaut.hauteurDeBase) {
            gestionDuSaut.monter = true;
        }
    }
    
    if(hauteurDuPerso >= gestionDuSaut.hauteurDeBase && hauteurDuPerso <= pallierDebut) {
        if(gestionDuSaut.monter) {
            hauteurDuPerso = hauteurDuPerso + incrementDebut;
        } else {
            hauteurDuPerso = hauteurDuPerso - incrementDebut;
        }
    }
    
    if(hauteurDuPerso >= pallierDebut && hauteurDuPerso <= pallierMilieu) {
        if(gestionDuSaut.monter) {
            hauteurDuPerso = hauteurDuPerso + incrementMilieu;
        } else {
            hauteurDuPerso = hauteurDuPerso - incrementMilieu;
        }
    }
    
    if(hauteurDuPerso >= pallierMilieu) {
        
        if(gestionDuSaut.monter) {
            hauteurDuPerso = hauteurDuPerso + incrementFin;
        } else {
            hauteurDuPerso = hauteurDuPerso - incrementFin;
        }
    }

    if(hauteurDuPerso < gestionDuSaut.hauteurDeBase) {
        hauteurDuPerso = gestionDuSaut.hauteurDeBase;
    }
    
    divPersoPrincipal.style.bottom = hauteurDuPerso + 'px';
    
    gestionDuSaut.enCours = true;

    if(hauteurDuPerso <= gestionDuSaut.hauteurDeBase) {
        clearInterval(finDuSaut);
        gestionDuSaut.enCours = false;
        gestionDuSaut.monter = true;
    }
    
};




const apparitionObstacle = function () {

}

var apparitionPNJ = function() {
    
}


window.setInterval(function(){
    leMoteurPourLesAnimations();
},25);

window.setInterval(function(){
    leMoteurPourLIdle();
},250);

var sauter = function() {
    finDuSaut = setInterval(sautDuPersonnage,10);
};

// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM Intro MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM //
$('#getcv').on('click', function() {
    window.open('/docs/Anne Quiniou - Développeuse JS Fullstack.pdf','CV','location=no,menubar=no');
    
});

let reduceOpacity = 0.017;

$('#launch').on('click', function() {
    animationEnCours = true;

    const divIntro = document.querySelector('.opening');
    divIntro.innerHTML='';
    
    let intro = setInterval(function(){
        direction.droite = true;
        direction.idle = false;
        
        let opacityIntro = divIntro.style.opacity;
        if(isNaN(opacityIntro)) {
            opacityIntro = 1;
        }

        if(opacityIntro <= 0) {
            opacityIntro = 1;
        }
        
        opacityIntro = opacityIntro - reduceOpacity;
        divIntro.style.opacity = opacityIntro;

        
        let deplacement = parseFloat(divPersoPrincipal.style.left);
        if(isNaN(deplacement)) {
            deplacement = 0;
        }
        deplacement = deplacement + 5;
        divPersoPrincipal.style.left = deplacement + 'px';

        if(deplacement >= 260) {
            clearInterval(intro);
            divIntro.style.display = 'none';
            direction.droite = false;
            direction.idle = true;
            animationEnCours = false;
        }
    },25);

    setTimeout(function() {afficherDialogue(dialogues.intro0)},2000);
});


// gestion des dialogues
var afficherDialogue= function(objetTexte) {
    let dialogue = document.createElement('div');
    dialogue.className = "dialogue";
    dialogue.innerHTML= `
    <p>${objetTexte.perso} :<br>
    ${objetTexte.texte}</p>`;

    document.querySelector('content').append(dialogue);
    dialogueVisible = true;
};



var apparitionBonus = function(obj) {

obj.forEach(function() {
    if(obj.positionX == parseFloat(troisiemeFond)) {
        
    }

})

}

// deplacement d'un element avec le fond mais ça ne marche pas encore

var deplacementDeLElementAvecFond = function(objet) {
    let elementChoisi = objet;
    let positionClasse = elementChoisi.style.left;
    
    var incrementElement;
    if(direction == 'droite') {
        incrementElement = -5;
    }
    
    if(direction == 'gauche') {
        incrementElement = 5;
    }
    
    var positionX = parseFloat(elementChoisi.style.left);
    
    if(isNaN(positionX)) {
        positionX = 0;
    }
    
    positionX = positionX + incrementElement;
    
    elementChoisi.style.left = positionX + 'px';
    };
    
    

    
    


});