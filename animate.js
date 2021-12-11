"use strict";

window.addEventListener("DOMContentLoaded", function () {
  // stockage des mouvements possibles
  const direction = {
    gauche: false,
    droite: false,
    idle: true,
  };

  let animationEnCours = false;
  let dialogueVisible = false;
  let divPersoPrincipal = document.getElementsByClassName("perso_anne")[0];

  let finDuSaut;

  // stockages des informations pour les différents sprites utilisés
  const sprite = {
    classique: {
      reference: document.querySelectorAll(".perso_anne > img")[0],
      frameX: -128,
      idle: {
        placement: -20,
        nombreDeFrames: 4,
      },
      marcherADroite: {
        placement: -789,
        nombreDeFrames: 8,
      },
      marcherAGauche: {
        placement: -916,
        nombreDeFrames: 8,
      },
      directionDesImages: "left",
    },

    sorcier: {
      referenceAnne: document,
      frameX: 12,
      frameY: 12,
      directionDesImages: "top",
    },

    chien: {
      reference: document.querySelectorAll(".pnj_chien > img")[0],
      div: document.querySelectorAll(".pnj_chien")[0],
      frameX: "67px",
      directionDesImages: "left",
      nombreDeFrames: 2,
      apparitionX: 210,
    }
  };


  const elementsJeux = {
    chiens: {
      chien01: {
        apparitionX: 330,
        apparitionY: 28,
        width: 60,
        id: 'chien01',
        class: 'pnj_chien',
        url: 'images/sprites/chien02.png',
        droite: false,
      },
      chien02: {
        apparitionX: -600,
        apparitionY: 28,
        width: 60,
        id: 'chien02',
        class: 'pnj_chien',
        url: 'images/sprites/chien03.png',
        droite: false,
      },
    },

    panneaux: {
      limitegauche: {
        apparitionX: 500,
        apparitionY: 40,
        width: 140,
        id: 'limitegauche',
        class: 'panneaux',
        url: 'images/panneaux/panneaulimite.png',
        div: document.querySelectorAll(".panneaux")[0],
        droite: false,
      },
      sodexo: {
        div: document.querySelectorAll(".panneaux")[1],
        apparitionX: -1880,
        apparitionY: 40,
        width: 120,
        id: 'sodexo',
        class: 'panneaux',
        url: 'images/panneaux/sodexo.png',
        droite: true,
      },
      datawords: {
        div: document.querySelectorAll(".panneaux")[2],
        apparitionX: -4000,
        apparitionY: 40,
        width: 120,
        id: 'datawords',
        class: 'panneaux',
        url: 'images/panneaux/datawords.png',
        droite: true,
      },
    },

    plateformes: {
      plat1: {
        div: document.querySelectorAll(".plateforme")[0],
        apparitionX: -2200,
        apparitionY: 110,
        width: 70,
        url: 'images/platforms/city_small_clair.png',
        id: "plat1",
        visible: false,
        droite: true,
        class: 'plateforme'
      },
      plat2: {
        div: document.querySelectorAll(".plateforme")[1],
        apparitionX: -2500,
        apparitionY: 200,
        width: 190,
        url: 'images/platforms/city_long_clair.png',
        id: "plat2",
        visible: false,
        droite: true,
        class: 'plateforme'
      },
      plat3: {
        div: document.querySelectorAll(".plateforme")[2],
        apparitionX: -3000,
        apparitionY: 110,
        width: 70,
        url: 'images/platforms/city_small_clair.png',
        id: "plat3",
        visible: false,
        droite: true,
        class: 'plateforme'
      },
      plat4: {
        div: document.querySelectorAll(".plateforme")[3],
        apparitionX: -3200,
        apparitionY: 200,
        width: 190,
        url: 'images/platforms/city_small02.png',
        id: "plat4",
        visible: false,
        droite: true,
        class: 'plateforme'
      },
    },
    bonus: {
      gateau: {
        apparitionX: -200,
        positionY: 28,
        url: 'images/icones/diplome.png',
        id: 'bonus1',
        class: 'bonus',
        visible: true,
        droite: true,
      },
      diplome1: {
        div: document.querySelectorAll(".bonus")[0],
        apparitionX: -1000,
        apparitionY: 28,
        url: 'images/icones/diplome.png',
        id: 'bonus1',
        class: 'bonus',
        visible: true,
        droite: true,
      },
      diplome2: {
        div: document.querySelectorAll(".bonus")[1],
        apparitionX: -1400,
        apparitionY: 28,
        url: 'images/icones/diplome.png',
        id: 'bonus1',
        class: 'bonus',
        visible: true,
        droite: true,
      },
      diplome3: {
        div: document.querySelectorAll(".bonus")[2],
        apparitionX: -3000,
        apparitionY: 80,
        url: 'images/icones/diplome.png',
        id: 'bonus1',
        class: 'bonus',
        visible: true,
        droite: true,
      },
    }
  };

  let persoPrincipal = sprite.classique.reference;
  let dialogueEnCours;
  let divScore = document.querySelector(".score");
  let score = document.querySelector(".score").children[0].children[1];

  const dialogues = {
    limite: {
      perso: "Anne",
      texte:
        "Gif-sur-DotNet ?<br> Mais non, je veux aller à Paris ! Allez, hop, demi-tour !",
    },
    intro0: {
      perso: "<strong>Guide</strong>",
      texte: `Utilisez <strong>D et F</strong> pour aller à gauche et à droite.<br>
            Utilisez <strong>Maj</strong> pour sauter et <strong>Entrée</strong> pour dialoguer.`,
      next: this.intro1,
    },
    intro1: {
      positionVSparallax: "-255",
      perso: "Anne",
      texte: `Wow, Paris. Quelle belle ville. J'ai hâte d'y avoir mes diplômes.`,
    },
    diplome: {
      positionVSparallax: "-255",
      perso: "Anne",
      texte: `Parée pour entrer dans le monde du travail avec mes diplômes!`,
      vu: false,
    },
  };



  window.addEventListener("keydown", function (evenementSurevenu) {
    let positionDeAnne =
      document.getElementsByClassName("bg")[2].style["background-position-x"];

    if (!dialogueVisible && !animationEnCours) {
      if ("KeyF" === evenementSurevenu.code) {
        direction.droite = true;
        direction.idle = false;

      }
      if ("KeyD" === evenementSurevenu.code) {
        if (parseFloat(positionDeAnne) >= 120) {
          direction.gauche = false;
          afficherDialogue(dialogues.limite);
          dialogueVisible = true;
        } else {
          direction.gauche = true;
          direction.idle = false;

          // prevision de la limite de droite pour afficher l'animation
        }
      }
      if ("ShiftRight" === evenementSurevenu.code) {
        if (!gestionDuSaut.enCours) {
          sauter();
        }
      }
      if ("Enter" === evenementSurevenu.code) {
      }
    } else {
      if ("Enter" === evenementSurevenu.code) {
        dialogueEnCours = document.querySelector(".dialogue");
        dialogueEnCours.remove();
        dialogueVisible = false;
      }
    }
  });

  window.addEventListener("keyup", function (evenementSurevenu) {
    if ("KeyF" === evenementSurevenu.code) {
      // yoda condition > voir wiki
      direction.droite = false;
      direction.idle = true;

    }
    if ("KeyD" === evenementSurevenu.code) {
      // yoda condition > voir wiki
      direction.gauche = false;
      direction.idle = true;
    }
  });

  let mouvementDuPerso;
  let incrementPosition;

  var leMoteurPourLesAnimations = function () {
    if (direction.droite) {
      deplacementDuFond("bg", "droite");
      checkPositionAnne("bg");
      faireApparaitreLesElementsDuJeu('bg');
      incrementPosition = -10;
      checkerElementEtDeplacerAvecLeFond();
      recupererBonus();

      if (persoPrincipal == sprite.classique.reference) {
        mouvementDuPerso = parseFloat(persoPrincipal.style.top);

        if (isNaN(mouvementDuPerso)) {
          mouvementDuPerso = sprite.classique.marcherADroite.placement;
        }

        mouvementDuPerso = sprite.classique.marcherADroite.placement;

        persoPrincipal.style.top = mouvementDuPerso + "px";

        marcheDuPersonnage(
          sprite.classique.marcherADroite.nombreDeFrames,
          sprite.classique.frameX,
          sprite.classique.directionDesImages
        );
      } else {
        console.log("tbd");
      }
    }

    if (direction.gauche) {
      deplacementDuFond("bg", "gauche");
      checkPositionAnne("bg");
      incrementPosition = 10;
      checkerElementEtDeplacerAvecLeFond();
      faireApparaitreLesElementsDuJeu('bg');

      recupererBonus();

      if (persoPrincipal == sprite.classique.reference) {
        mouvementDuPerso = parseFloat(persoPrincipal.style.top);

        if (isNaN(mouvementDuPerso)) {
          mouvementDuPerso = sprite.classique.marcherAGauche.placement;
        }

        mouvementDuPerso = sprite.classique.marcherAGauche.placement;
        persoPrincipal.style.top = mouvementDuPerso + "px";

        marcheDuPersonnage(
          sprite.classique.marcherAGauche.nombreDeFrames,
          sprite.classique.frameX,
          sprite.classique.directionDesImages
        );
      } else {
        console.log("tbd");
      }
    }
  };

  var leMoteurPourLIdle = function () {
    //IDLE UNIQUEMENT DU PERSO PRINCIPAL SELON SPRITE UTILISE
    if (direction.idle) {
      if (persoPrincipal == sprite.classique.reference) {
        mouvementDuPerso = parseFloat(persoPrincipal.style.top);

        if (isNaN(mouvementDuPerso)) {
          mouvementDuPerso = sprite.classique.idle.placement;
        }

        mouvementDuPerso = sprite.classique.idle.placement;
        persoPrincipal.style.top = mouvementDuPerso + "px";

        marcheDuPersonnage(
          sprite.classique.idle.nombreDeFrames,
          sprite.classique.frameX,
          sprite.classique.directionDesImages
        );
      } else {
        console.log("tbd");
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

  var deplacementDuFond = function (fondUtilise, direction) {
    if (direction == "droite") {
      incrementParallaxeUn = -1;
      incrementParallaxeDeux = -3;
      incrementParallaxeTrois = -10;
    } else {
      incrementParallaxeUn = 1;
      incrementParallaxeDeux = 3;
      incrementParallaxeTrois = 10;
    }

    premierFond = parseFloat(
      document.getElementsByClassName(fondUtilise)[0].style[
      "background-position-x"
      ]
    );
    deuxiemeFond = parseFloat(
      document.getElementsByClassName(fondUtilise)[1].style[
      "background-position-x"
      ]
    );
    troisiemeFond = parseFloat(
      document.getElementsByClassName(fondUtilise)[2].style[
      "background-position-x"
      ]
    );

    if (isNaN(premierFond)) {
      premierFond = 0;
    }
    if (isNaN(deuxiemeFond)) {
      deuxiemeFond = 0;
    }
    if (isNaN(troisiemeFond)) {
      troisiemeFond = 0;
    }

    premierFond = premierFond + incrementParallaxeUn;
    deuxiemeFond = deuxiemeFond + incrementParallaxeDeux;
    troisiemeFond = troisiemeFond + incrementParallaxeTrois;

    document.getElementsByClassName(fondUtilise)[0].style[
      "background-position-x"
    ] = premierFond + "px";
    document.getElementsByClassName(fondUtilise)[1].style[
      "background-position-x"
    ] = deuxiemeFond + "px";
    document.getElementsByClassName(fondUtilise)[2].style[
      "background-position-x"
    ] = troisiemeFond + "px";
  };

  //Gestion de l'animation de marche du sprite
  let positionImage;
  let ajustement = -40;

  var marcheDuPersonnage = function (
    nbrFrame,
    tailleFrame,
    varianteDeDirection
  ) {
    positionImage = parseFloat(persoPrincipal.style[varianteDeDirection]);

    if (isNaN(positionImage)) {
      positionImage = ajustement;
    }
    positionImage = positionImage + tailleFrame;

    if (positionImage <= ajustement + tailleFrame * nbrFrame) {
      positionImage = ajustement;
    }

    persoPrincipal.style[varianteDeDirection] = positionImage + "px";
  };

  // gestion
  let hauteurDuPerso;

  const gestionDuSaut = {
    enCours: false,
    debut: {
      limite: 45,
      incrementDeSaut: 10,
    },
    milieu: {
      limite: 140,
      incrementDeSaut: 5,
    },
    fin: {
      limite: 180,
      incrementDeSaut: 4,
    },
    monter: true,
    hauteurDeBase: parseFloat(divPersoPrincipal.style.bottom),
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM SAUTS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM SAUTS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM SAUTS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  /* var sautDuPersonnage = function () {
    hauteurDuPerso = parseFloat(divPersoPrincipal.style.bottom);
    // il vaudrait mieux une hauteur de sol de base?
    if (isNaN(hauteurDuPerso)) {
      gestionDuSaut.hauteurDeBase = 25;
      hauteurDuPerso = gestionDuSaut.hauteurDeBase + 1;
    }
 
    let pallierDebut = gestionDuSaut.hauteurDeBase + gestionDuSaut.debut.limite;
    let pallierMilieu =
      gestionDuSaut.hauteurDeBase + gestionDuSaut.milieu.limite;
    let pallierFin = gestionDuSaut.hauteurDeBase + gestionDuSaut.fin.limite;
 
    let incrementDebut = gestionDuSaut.debut.incrementDeSaut;
    let incrementMilieu = gestionDuSaut.milieu.incrementDeSaut;
    let incrementFin = gestionDuSaut.fin.incrementDeSaut;
 
    if (hauteurDuPerso >= pallierFin) {
      gestionDuSaut.monter = false;
    } else {
      if (hauteurDuPerso <= gestionDuSaut.hauteurDeBase) {
        gestionDuSaut.monter = true;
      }
    }
 
    if (
      hauteurDuPerso >= gestionDuSaut.hauteurDeBase &&
      hauteurDuPerso <= pallierDebut
    ) {
      if (gestionDuSaut.monter) {
        hauteurDuPerso = hauteurDuPerso + incrementDebut;
      } else {
        hauteurDuPerso = hauteurDuPerso - incrementDebut;
      }
    }
 
    if (hauteurDuPerso >= pallierDebut && hauteurDuPerso <= pallierMilieu) {
      if (gestionDuSaut.monter) {
        hauteurDuPerso = hauteurDuPerso + incrementMilieu;
      } else {
        hauteurDuPerso = hauteurDuPerso - incrementMilieu;
      }
    }
 
    if (hauteurDuPerso >= pallierMilieu) {
      if (gestionDuSaut.monter) {
        hauteurDuPerso = hauteurDuPerso + incrementFin;
      } else {
        hauteurDuPerso = hauteurDuPerso - incrementFin;
      }
    }
 
    if (hauteurDuPerso < gestionDuSaut.hauteurDeBase) {
      hauteurDuPerso = gestionDuSaut.hauteurDeBase;
    }
 
    divPersoPrincipal.style.bottom = hauteurDuPerso + "px";
 
    gestionDuSaut.enCours = true;
 
    if (hauteurDuPerso <= gestionDuSaut.hauteurDeBase) {
      clearInterval(finDuSaut);
      gestionDuSaut.enCours = false;
      gestionDuSaut.monter = true;
    }
  };*/

  let forceDuSaut = 23;
  let stopForce;

  var sautDuPersonnage = function () {
    stopForce = setInterval(function () {
      if (!gestionDuSaut.enCours) {
        gestionDuSaut.enCours = true;
        hauteurDuPerso = parseFloat(divPersoPrincipal.style.bottom);

        if (isNaN(hauteurDuPerso)) {
          hauteurDuPerso = hauteurDuSol;
        }

        hauteurDuPerso = hauteurDuPerso + forceDuSaut;
        divPersoPrincipal.style.bottom = hauteurDuPerso + "px";

        let elementPlateformes = document.querySelectorAll('.plateforme');
        elementPlateformes.forEach(function (element) {
          let positionXplateforme = parseFloat(element.style.left);
          if (isNaN(positionXplateforme)) {
            GeolocationPosition
          }
          let taillePlateforme = parseFloat(element.style.width);
          let hauteurPlateforme = parseFloat(element.style.bottom) + 20;

          if (positionXplateforme < 290 || positionXplateforme + taillePlateforme > 240 || (positionXplateforme > 240 && positionXplateforme + taillePlateforme < 290)) {
            if (divPersoPrincipal.style.bottom > hauteurPlateforme) {
              hauteurDuSol = hauteurPlateforme;
            }

          }
        }
        )


        if (parseFloat(divPersoPrincipal.style.bottom) <= hauteurDuSol) {
          divPersoPrincipal.style.bottom = (hauteurDuSol + 1) + "px";
          clearInterval(stopForce);
          gestionDuSaut.enCours = false;
          console.log('boucle stop, status: ' + gestionDuSaut.enCours);

        } else {
          forceDuSaut = forceDuSaut - 1;
          console.log('ici');
          console.log('boucle continue, status: ' + gestionDuSaut.enCours);
        }

      }
      else {
        clearInterval(stopForce);
        gestionDuSaut.enCours = false;
        console.log(forceDuSaut);
      }
    }, 10);
  };


  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  let hauteurDuSol = 25;
  /*   const gravite = 1;
    let toucherLeSol;
    let forceEnAction = false;
  
    const forceGravitationnelle = function () {
      if (!forceEnAction) {
        toucherLeSol = setInterval(function () {
          let maHauteur = parseFloat(divPersoPrincipal.style.bottom);
  
          if (isNaN(maHauteur)) {
            maHauteur = hauteurDuSol;
          }
  
          maHauteur = maHauteur - gravite;
  
          divPersoPrincipal.style.bottom = maHauteur + "px";
  
          if (parseFloat(divPersoPrincipal.style.bottom) <= hauteurDuSol) {
            maHauteur = hauteurDuSol;
            clearInterval(toucherLeSol);
          }
  
          forceEnAction = true;
          console.log(maHauteur);
        }, 25);
      } else {
        clearInterval(toucherLeSol);
      }
    };
  
    forceGravitationnelle(); */

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM SETINTERVAL MVMT MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  window.setInterval(function () {
    leMoteurPourLesAnimations();
  }, 25);

  window.setInterval(function () {
    leMoteurPourLIdle();
  }, 250);

  var sauter = function () {
    finDuSaut = setInterval(sautDuPersonnage, 10);
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM ANIMATIONS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM ANIMATIONS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM ANIMATIONS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  // OOOOOOOOOOOOOOOO000OOOOOOOOOOOOOOOOOOO Intro OOOOOO000OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO //
  $("#getcv").on("click", function () {
    window.open(
      "docs/Anne Quiniou - Développeuse JS Fullstack.pdf",
      "CV",
      "location=no,menubar=no"
    );
  });

  let reduceOpacity = 0.017;

  $("#launch").on("click", function () {
    animationEnCours = true;

    const divIntro = document.querySelector(".opening");
    divIntro.innerHTML = "";

    let intro = setInterval(function () {
      direction.droite = true;
      direction.idle = false;

      let opacityIntro = divIntro.style.opacity;
      if (isNaN(opacityIntro)) {
        opacityIntro = 1;
      }

      if (opacityIntro <= 0) {
        opacityIntro = 1;
      }

      opacityIntro = opacityIntro - reduceOpacity;
      divIntro.style.opacity = opacityIntro;

      let deplacement = parseFloat(divPersoPrincipal.style.left);
      if (isNaN(deplacement)) {
        deplacement = 0;
      }
      deplacement = deplacement + 5;
      divPersoPrincipal.style.left = deplacement + "px";

      if (deplacement >= 260) {
        clearInterval(intro);
        divIntro.style.display = "none";
        direction.droite = false;
        direction.idle = true;
        animationEnCours = false;
      }
    }, 25);

    setTimeout(function () {
      afficherDialogue(dialogues.intro0);
    }, 2000);
  });

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM DEPLACER UN ELEMENT AVEC LE FOND MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM DEPLACER UN ELEMENT AVEC LE FOND MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM DEPLACER UN ELEMENT AVEC LE FOND MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  var deplacementDeLElementAvecFond = function (objet, positionDepart) {

    var positionX = parseFloat(objet.style.left);

    if (isNaN(positionX)) {
      positionX = positionDepart;
    } // attention actuellement la position

    positionX = positionX + incrementPosition;

    objet.style.left = positionX + "px";
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER LES DIALOGUES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER LES DIALOGUES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER LES DIALOGUES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  const afficherDialogue = function (objetTexte) {
    if (!dialogueVisible) {
      let dialogue = document.createElement("div");
      dialogue.className = "dialogue";
      dialogue.innerHTML = `
      <p>${objetTexte.perso} :<br>
      ${objetTexte.texte}</p>`;

      document.querySelector("content").append(dialogue);
      dialogueVisible = true;
    }
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER POSITION POUR DIALOGUES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER POSITION POUR DIALOGUES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER POSITION POUR DIALOGUES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  var checkPositionAnne = function (nomDuFond) {
    let positionDeAnne =
      document.getElementsByClassName(nomDuFond)[2].style[
      "background-position-x"
      ];
    if (parseFloat(positionDeAnne) >= 120 && direction.droite == false) {
      direction.gauche = false;
      afficherDialogue(dialogues.limite);
      dialogueVisible = true;

      if (direction.gauche) {
        incrementPosition = 0;
      }
    }

    if (
      parseFloat(positionDeAnne) >= -1200 &&
      parseFloat(positionDeAnne) <= -1140 &&
      score.innerHTML >= 400
    ) {
      if (!dialogues.diplome.vu) {
        direction.gauche = false;
        direction.droite = false;
        afficherDialogue(dialogues.diplome);
        dialogueVisible = true;
        dialogues.diplome.vu = true;
      }
    }
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM RECUPER LES BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM RECUPER LES BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM RECUPER LES BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  var recupererBonus = function () {
    var lesBonus = document.querySelectorAll(".bonus");

    // REVOIR LES FOREACH
    lesBonus.forEach(function (element) {
      let positionXBonus = parseFloat(element.style.left);
      let positionYBonus = parseFloat(element.style.bottom);
      let positionYPerso = parseFloat(divPersoPrincipal.style.bottom);

      if (element.style.display != "none") {
        if (isNaN(positionYPerso)) {
          positionYPerso = 25;
        }

        if (isNaN(positionYBonus)) {
          positionYBonus = 40;
        }

        if (positionXBonus < 290 && positionXBonus > 230) {
          if (positionYPerso <= positionYBonus + 50) {
            score.innerHTML = parseFloat(score.innerHTML) + 200;
            element.remove();
          }
        }
      }
    });
  };


  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CREER les plateformes, chiens, bonus... MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CREER les plateformes, chiens, bonus... MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CREER les plateformes, chiens, bonus... MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  const faireApparaitreLesElementsDuJeu = function (nomDuFond) {
    let positionDeAnne = parseFloat(
      document.getElementsByClassName(nomDuFond)[2].style[
      "background-position-x"
      ]);
    //vérifier et indiquer les éléments
    let decalageAffichage = 600;

    for (const property in elementsJeux) {

      for (const element in elementsJeux[property]) {

        /*         if (elementsJeux[property][element].droite) {
                  decalageAffichage = 600;
                } else {
                  decalageAffichage = -600;
                } */

        /*         if (elementsJeux[property][element].apparitionX + decalageAffichage == positionDeAnne && !elementsJeux[property][element].visible) */
        if (!elementsJeux[property][element].visible) {
          let nouvelleDiv = document.createElement('div');
          nouvelleDiv.id = elementsJeux[property][element].id;
          nouvelleDiv.className = elementsJeux[property][element].class;
          nouvelleDiv.style.bottom = elementsJeux[property][element].apparitionY;
          nouvelleDiv.style.left = elementsJeux[property][element].apparitionX;

          let image = document.createElement('img');
          image.src = elementsJeux[property][element].url;
          image.style.width = elementsJeux[property][element].id;
          nouvelleDiv.appendChild(image);
          document.querySelector('content').appendChild(nouvelleDiv);

          elementsJeux[property][element].visible = true;
        }
      }
    }
  };

  /*       for (const property in chiens) {
  
          if (!chiens[property].droite) {
            decalageAffichage = - decalageAffichage;
          }
  
          if (chiens[property].apparitionX + decalageAffichage == positionDeAnne && !chiens[property].visible) {
            let nouvelleDiv = document.createElement('div');
            nouvelleDiv.id = chiens[property].id;
            nouvelleDiv.className = chiens[property].class;
            nouvelleDiv.style.bottom = chiens[property].apparitionY;
            nouvelleDiv.style.left = chiens[property].apparitionX;
  
            let image = document.createElement('img');
            image.src = chiens[property].url;
            image.style.width = chiens[property].id;
            nouvelleDiv.appendChild(image);
            document.querySelector('content').appendChild(nouvelleDiv);
  
            chiens[property].visible = true;
          }
  
          for (const property in panneaux) {
  
            if (!panneaux[property].droite) {
              decalageAffichage = - decalageAffichage;
            }
  
            if (chiens[property].apparitionX + decalageAffichage == positionDeAnne && !chiens[property].visible) {
              let nouvelleDiv = document.createElement('div');
              nouvelleDiv.id = chiens[property].id;
              nouvelleDiv.className = chiens[property].class;
              nouvelleDiv.style.bottom = chiens[property].apparitionY;
              nouvelleDiv.style.left = chiens[property].apparitionX;
  
              let image = document.createElement('img');
              image.src = chiens[property].url;
              image.style.width = chiens[property].id;
              nouvelleDiv.appendChild(image);
              document.querySelector('content').appendChild(nouvelleDiv);
  
              chiens[property].visible = true;
            }
   */



  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CHEcker LES ELEMEnTS et leS dePlaCEr MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CHEcker LES ELEMEnTS et leS dePlaCEr MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CHEcker LES ELEMEnTS et leS dePlaCEr MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  const checkerElementEtDeplacerAvecLeFond = function () {
    //bonus
    let tousLesBonus = document.querySelectorAll('.bonus');

    if (tousLesBonus) {
      tousLesBonus.forEach(function (element) {
        let positionDeDepart = parseFloat(element.style.left);

        if (isNaN(positionDeDepart)) {

          let reference = String(element.id);

          positionDeDepart = elementsJeux.bonus[reference]['apparitionX'];
        }
        deplacementDeLElementAvecFond(element, parseFloat(element.style.left));
      }
      );
    }


    //chiens
    let tousLesChiens = document.querySelectorAll('.pnj_chien');
    tousLesChiens.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        let reference = String(element.id);
        positionDeDepart = elementsJeux.chiens[reference]['apparitionX'];
      }

      deplacementDeLElementAvecFond(element, positionDeDepart);
    }
    );

    //panneaux
    let tousLesPanneaux = document.querySelectorAll('.panneaux');
    tousLesPanneaux.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        let reference = String(element.id);
        positionDeDepart = elementsJeux.panneaux[reference]['apparitionX'];
        console.log('panneau: ' + positionDeDepart)
      }
      deplacementDeLElementAvecFond(element, element.style.left);
    }
    );

    //plateformes
    let toutesLesPlateformes = document.querySelectorAll('.plateforme');
    toutesLesPlateformes.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        let reference = String(element.id);
        positionDeDepart = elementsJeux.plateformes[reference]['apparitionX'];
      }
      deplacementDeLElementAvecFond(element, element.style.left);
    }
    );

  }

});
