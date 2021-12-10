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
    },
  };

  const panneaux = {
    limitegauche: {
      apparitionX: 0,
      div: document.querySelectorAll(".panneaux")[0],
    },
    sodexo: {
      div: document.querySelectorAll(".panneaux")[1],
      apparitionX: 1880,
      apparitionY: 28,
    },
    datawords: {
      div: document.querySelectorAll(".panneaux")[2],
      apparitionX: 4000,
      apparitionY: 28,
    },
  };

  const plateformes = {
    plat1: {
      div: document.querySelectorAll(".plateforme")[0],
      apparitionX: 2200,
      apparitionY: 110,
    },
    plat2: {
      div: document.querySelectorAll(".plateforme")[1],
      apparitionX: 2500,
      apparitionY: 200,
    },
    plat3: {
      div: document.querySelectorAll(".plateforme")[2],
      apparitionX: 4000,
      apparitionY: 110,
    },
    plat4: {
      div: document.querySelectorAll(".plateforme")[3],
      apparitionX: 4000,
      apparitionY: 200,
    },
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

  let bonus = {
    gateau: {
      apparitionX: -200,
      positionY: 23,
      sprite: `url('images/icones/pie.png')`,
    },
    diplome1: {
      div: document.querySelectorAll(".bonus")[0],
      apparitionX: 1000,
      apparitionY: 28,
    },
    diplome2: {
      div: document.querySelectorAll(".bonus")[1],
      apparitionX: 1400,
      apparitionY: 28,
    },
    diplome3: {
      div: document.querySelectorAll(".bonus")[2],
      apparitionX: 3000,
      apparitionY: 80,
    },
  };

  window.addEventListener("keydown", function (evenementSurevenu) {
    let positionDeAnne =
      document.getElementsByClassName("bg")[2].style["background-position-x"];

    if (!dialogueVisible && !animationEnCours) {
      if ("KeyF" === evenementSurevenu.code) {
        if (parseFloat(positionDeAnne) >= 120) {
          direction.gauche = false;
          afficherDialogue(dialogues.limite);
          dialogueVisible = true;
          direction.droite = true;
          direction.idle = false;
        } else {
          direction.droite = true;
          direction.idle = false;
        }
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
      incrementPosition = -10;
      deplacementDeLElementAvecFond(sprite.chien.div, sprite.chien.apparitionX);
      deplacementDeLElementAvecFond(
        panneaux.limitegauche.div,
        panneaux.limitegauche.apparitionX
      );
      deplacementDeLElementAvecFond(
        panneaux.sodexo.div,
        panneaux.sodexo.apparitionX
      );
      deplacementDeLElementAvecFond(
        panneaux.datawords.div,
        panneaux.datawords.apparitionX
      );
      deplacementDeLElementAvecFond(
        bonus.diplome1.div,
        bonus.diplome1.apparitionX
      );
      deplacementDeLElementAvecFond(
        bonus.diplome2.div,
        bonus.diplome2.apparitionX
      );
      deplacementDeLElementAvecFond(
        bonus.diplome3.div,
        bonus.diplome3.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat1.div,
        plateformes.plat1.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat2.div,
        plateformes.plat2.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat3.div,
        plateformes.plat3.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat4.div,
        plateformes.plat4.apparitionX
      );
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
      incrementPosition = 10;
      deplacementDeLElementAvecFond(sprite.chien.div);
      deplacementDeLElementAvecFond(panneaux.limitegauche.div);
      deplacementDeLElementAvecFond(
        panneaux.sodexo.div,
        panneaux.sodexo.apparitionX
      );
      deplacementDeLElementAvecFond(
        panneaux.datawords.div,
        panneaux.datawords.apparitionX
      );
      deplacementDeLElementAvecFond(
        bonus.diplome1.div,
        bonus.diplome1.apparitionX
      );
      deplacementDeLElementAvecFond(
        bonus.diplome2.div,
        bonus.diplome2.apparitionX
      );
      deplacementDeLElementAvecFond(
        bonus.diplome3.div,
        bonus.diplome3.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat1.div,
        plateformes.plat1.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat2.div,
        plateformes.plat2.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat3.div,
        plateformes.plat3.apparitionX
      );
      deplacementDeLElementAvecFond(
        plateformes.plat4.div,
        plateformes.plat4.apparitionX
      );
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
  var hauteurDuPerso;

  var gestionDuSaut = {
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

  var forceDuSaut = 2;
  var stopForce;

  var sautDuPersonnage = function () {
    if (!gestionDuSaut.enCours) {
      stopForce = setInterval(function () {
        hauteurDuPerso = parseFloat(divPersoPrincipal.style.bottom);

        if (isNaN(hauteurDuPerso)) {
          hauteurDuPerso = hauteurDuSol;
        }

        hauteurDuPerso = hauteurDuPerso + forceDuSaut;
        divPersoPrincipal.style.bottom = hauteurDuPerso + "px";
        gestionDuSaut.enCours = true;

        if (hauteurDuPerso >= forceDuSaut * 30) {
          clearInterval(stopForce);
          gestionDuSaut.enCours = false;
        }
      }, 10);
    } else {
      clearInterval(stopForce);
      gestionDuSaut.enCours = false;
    }
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  const gravite = 1;
  let toucherLeSol;
  let hauteurDuSol = 25;
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

  forceGravitationnelle();

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
    let elementChoisi = objet;
    let positionClasse = elementChoisi.style.left;

    var positionX = parseFloat(elementChoisi.style.left);

    if (isNaN(positionX)) {
      positionX = positionDepart;
    } // attention actuellement la position

    positionX = positionX + incrementPosition;

    elementChoisi.style.left = positionX + "px";
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
    if (parseFloat(positionDeAnne) >= 120 && !direction.droite) {
      direction.gauche = false;
      afficherDialogue(dialogues.limite);
      dialogueVisible = true;

      if (direction.gauche) {
        incrementPosition = 0;
      }
    }

    if (
      parseFloat(positionDeAnne) <= -1140 &&
      parseFloat(positionDeAnne) >= -1200 &&
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
});
