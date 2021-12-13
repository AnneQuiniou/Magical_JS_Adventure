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

  const elementsJeu = {
    chiens: {
      chien01: {
        apparitionX: 330,
        apparitionY: 28,
        width: 60,
        id: "chien01",
        class: "pnj_chien",
        url: "images/sprites/chien02.png",
        droite: false,
      },
      chien02: {
        apparitionX: -600,
        apparitionY: 28,
        width: 60,
        id: "chien02",
        class: "pnj_chien",
        url: "images/sprites/chien03.png",
        droite: false,
      },
    },

    panneaux: {
      limitegauche: {
        apparitionX: 120,
        apparitionY: 40,
        width: 140,
        id: "limitegauche",
        class: "panneaux",
        url: "images/panneaux/panneaulimite.png",
        div: document.querySelectorAll(".panneaux")[0],
        droite: false,
      },
      sodexo: {
        div: document.querySelectorAll(".panneaux")[1],
        apparitionX: 1400,
        apparitionY: 40,
        width: 120,
        id: "sodexo",
        class: "panneaux",
        url: "images/panneaux/sodexo.png",
        droite: true,
      },
      datawords: {
        div: document.querySelectorAll(".panneaux")[2],
        apparitionX: 2000,
        apparitionY: 40,
        width: 120,
        id: "datawords",
        class: "panneaux",
        url: "images/panneaux/datawords.png",
        droite: true,
      },
    },

    plateformes: {
      plat1: {
        div: document.getElementById("plat1"),
        apparitionX: 2200,
        apparitionY: 110,
        width: 100,
        url: "images/platforms/city_small_clair.png",
        id: "plat1",
        visible: false,
        droite: true,
        class: "plateforme",
      },
      plat2: {
        div: document.getElementById("plat2"),
        apparitionX: 2500,
        apparitionY: 200,
        width: 190,
        url: "images/platforms/city_long_clair.png",
        id: "plat2",
        visible: false,
        droite: true,
        class: "plateforme",
      },
      plat3: {
        div: document.getElementById("plat3"),
        apparitionX: 2920,
        apparitionY: 110,
        width: 100,
        url: "images/platforms/city_small_clair.png",
        id: "plat3",
        visible: false,
        droite: true,
        class: "plateforme",
      },
      plat4: {
        div: document.getElementById("plat4"),
        apparitionX: -3200,
        apparitionY: 200,
        width: 190,
        url: "images/platforms/city_small02.png",
        id: "plat4",
        visible: false,
        droite: true,
        class: "plateforme",
      },
    },
    bonus: {
      diplome1: {
        div: document.querySelectorAll(".bonus")[0],
        apparitionX: 1000,
        apparitionY: 28,
        url: "images/icones/diplome_1.png",
        id: "bonus1",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Master d'anglais`,
      },
      diplome2: {
        div: document.querySelectorAll(".bonus")[1],
        apparitionX: 1400,
        apparitionY: 28,
        url: "images/icones/diplome_2.png",
        id: "bonus2",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Master d'allemand`,
      },
      diplome3: {
        div: document.querySelectorAll(".bonus")[2],
        apparitionX: 3000,
        apparitionY: 80,
        url: "images/icones/diplome_3.png",
        id: "bonus3",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Gestion de projet`,
      },
      explorateur: {
        div: document.querySelectorAll(".bonus")[3],
        apparitionX: 130,
        apparitionY: 100,
        url: "images/icones/bonus_explo.png",
        id: "explorateur",
        class: "bonus",
        visible: false,
        droite: false,
        titre: `Bonus Explorateur`,
      },
    },
  };
  let hauteurDeLaTerre = 24;
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
          lancerLeSaut();
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
      direction.droite = false;
      direction.idle = true;
    }
    if ("KeyD" === evenementSurevenu.code) {
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
      faireApparaitreLesElementsDuJeu("bg");
      incrementPosition = -10;
      checkerElementEtDeplacerAvecLeFond();
      recupererBonus();
      lancerLaVerificationPlateforme();

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
      faireApparaitreLesElementsDuJeu("bg");
      recupererBonus();
      lancerLaVerificationPlateforme();

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
  let positionYPerso;

  const gestionDuSaut = {
    enCours: false,
    monter: true,
    hauteurDeBase: parseFloat(divPersoPrincipal.style.bottom),
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM SAUTS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM SAUTS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM SAUTS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  let forceDuSaut = 23;
  let stopForce;

  var sautDuPersonnage = function () {
    gestionDuSaut.enCours = true;
    positionYPerso = parseFloat(divPersoPrincipal.style.bottom);

    if (isNaN(positionYPerso)) {
      positionYPerso = hauteurDuSol;
    }

    positionYPerso = positionYPerso + forceDuSaut;
    divPersoPrincipal.style.bottom = positionYPerso + "px";

    if (
      gestionDuSaut.enCours &&
      parseFloat(divPersoPrincipal.style.bottom) <= hauteurDuSol
    ) {
      divPersoPrincipal.style.bottom = hauteurDuSol + 1 + "px";
      gestionDuSaut.enCours = false;
      forceDuSaut = 23;
      clearInterval(stopForce);
    } else {
      forceDuSaut = forceDuSaut - 1;
    }
  };

  const lancerLeSaut = function () {
    stopForce = setInterval(sautDuPersonnage, 15);
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER SI PLATEFORMES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  let hauteurDuSol = 24;
  let surPlateforme = false;
  const verifierSiPlateforme = function () {
    let elementPlateformes = document.querySelectorAll(".plateforme");

    let start = true;
    for (let i = 0; start; i++) {
      let limiteGauchePlateforme = parseFloat(elementPlateformes[i].style.left);
      let nomElement = elementPlateformes[i].id;
      let limiteDroitePlateforme =
        limiteGauchePlateforme -
        parseFloat(elementsJeu.plateformes[nomElement].width);
      let taillePlateforme = parseFloat(
        elementsJeu.plateformes[nomElement].width
      );
      let hauteurPlateforme =
        parseFloat(elementPlateformes[i].style.bottom) + 20;

      // UTILISER GETBOUDING CLIENT RECT
      console.log("limiteDroitePlateforme" + limiteDroitePlateforme);
      let limiteHitboxGauche = 300;
      let limiteHitboxDroite = 200;

      let test1 =
        limiteGauchePlateforme > limiteHitboxDroite && //teste si bout gauche dans hitbox
        limiteGauchePlateforme < limiteHitboxGauche;

      let test2 =
        limiteDroitePlateforme > limiteHitboxDroite && //test si bout droite dans hitbox
        limiteDroitePlateforme < limiteHitboxGauche;

      let test3 =
        limiteGauchePlateforme > limiteHitboxGauche && //test si centre dans hitbox
        limiteDroitePlateforme < limiteHitboxDroite;

      console.log(test1);
      console.log(test2);
      console.log(test3);

      if (test1 || test2 || test3) {
        hauteurDuSol = hauteurPlateforme;
        surPlateforme = true;
        start = false;
      } else {
        hauteurDuSol = hauteurDeLaTerre;
        surPlateforme = false;
        rejoindreLeSol();
      }

      if (i + 1 == elementPlateformes.length) {
        start = false;
      }
    }
  };

  const lancerLaVerificationPlateforme = function () {
    requestAnimationFrame(verifierSiPlateforme);
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  let gravite = 23;
  let forceEnAction = false;

  /*  const forceGravitationnelle = function () {
    hauteurDuSol = 24;
    let maHauteur = parseFloat(divPersoPrincipal.style.bottom);
    forceEnAction = true;

    if (isNaN(maHauteur)) {
      maHauteur = hauteurDuSol + 1;
    }

    maHauteur = maHauteur - gravite;
    gravite = gravite - 1;

    if (parseFloat(divPersoPrincipal.style.bottom) <= hauteurDuSol) {
      maHauteur = hauteurDuSol;
      forceEnAction = false;
      gravite = 23;
    }

    divPersoPrincipal.style.bottom = maHauteur + "px";

    if (forceEnAction) {
      requestAnimationFrame(forceGravitationnelle);
    }
  };

  const lancerLaGravitation = function () {
    requestAnimationFrame(forceGravitationnelle);
  }; */
  let stopDescente;
  let graviteDescente = 1;

  const rejoindreLeSol = function () {
    let maHauteur = parseFloat(divPersoPrincipal.style.bottom);
    console.log("rejoindre le sol : ici");
    if (!gestionDuSaut.enCours && maHauteur > hauteurDeLaTerre + 10) {
      if (!surPlateforme) {
        forceEnAction = true;
        console.log("rejoindre le sol : là");
        forceGravitionnelle();
      }
    }
  };

  const forceGravitionnelle = function () {
    requestAnimationFrame(function () {
      let maHauteur = parseFloat(divPersoPrincipal.style.bottom);
      maHauteur = maHauteur - graviteDescente;
      console.log("rejoindre le sol : dans la boucle");
      graviteDescente = graviteDescente + 1;

      if (graviteDescente > 23) {
        graviteDescente = 23;
      }

      divPersoPrincipal.style.bottom = maHauteur + "px";

      if (maHauteur <= hauteurDeLaTerre) {
        forceEnAction = false;
        divPersoPrincipal.style.bottom = hauteurDeLaTerre + 1 + "px";
      }

      if (maHauteur > hauteurDeLaTerre) {
        requestAnimationFrame(forceGravitionnelle);
      }
    });
  };

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
      divPersoPrincipal.style.bottom = "25px";

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
      !document.getElementById("bonus1") &&
      !document.getElementById("bonus2")
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
          positionYPerso = hauteurDuSol + 1;
        }

        if (isNaN(positionYBonus)) {
          positionYBonus = elementJeu.bonus[string(element.id)].apparitionY;
        }

        if (positionXBonus < 290 && positionXBonus > 230) {
          if (positionYPerso <= positionYBonus + 50) {
            //revoir les éléments de détection des bonus
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
      ]
    );
    //vérifier et indiquer les éléments
    let decalageAffichage = 600;

    for (const property in elementsJeu) {
      for (const element in elementsJeu[property]) {
        if (!elementsJeu[property][element].visible) {
          let nouvelleDiv = document.createElement("div");
          nouvelleDiv.id = elementsJeu[property][element].id;
          nouvelleDiv.className = elementsJeu[property][element].class;
          nouvelleDiv.style.bottom =
            elementsJeu[property][element].apparitionY + "px";
          nouvelleDiv.style.left =
            elementsJeu[property][element].apparitionX + "px";

          if (elementsJeu[property][element].titre) {
            let p = document.createElement("p");
            p.innerHTML = elementsJeu[property][element].titre;
            nouvelleDiv.appendChild(p);
          }

          let image = document.createElement("img");
          image.src = elementsJeu[property][element].url;
          image.style.width = elementsJeu[property][element].id + "px";
          nouvelleDiv.appendChild(image);
          document.querySelector("content").appendChild(nouvelleDiv);

          elementsJeu[property][element].visible = true;
        }
      }
    }
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CHEcker LES ELEMEnTS et leS dePlaCEr MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CHEcker LES ELEMEnTS et leS dePlaCEr MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM CHEcker LES ELEMEnTS et leS dePlaCEr MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  const checkerElementEtDeplacerAvecLeFond = function () {
    //bonus
    let tousLesBonus = document.querySelectorAll(".bonus");

    if (tousLesBonus) {
      tousLesBonus.forEach(function (element) {
        let positionDeDepart = parseFloat(element.style.left);

        if (isNaN(positionDeDepart)) {
          let reference = String(element.id);

          positionDeDepart = elementsJeu.bonus[reference]["apparitionX"];
        }
        deplacementDeLElementAvecFond(element, positionDeDepart);
      });
    }

    //chiens
    let tousLesChiens = document.querySelectorAll(".pnj_chien");
    tousLesChiens.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        let reference = String(element.id);
        positionDeDepart = elementsJeu.chiens[reference]["apparitionX"];
      }

      deplacementDeLElementAvecFond(element, positionDeDepart);
    });

    //panneaux
    let tousLesPanneaux = document.querySelectorAll(".panneaux");
    tousLesPanneaux.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        let reference = String(element.id);
        positionDeDepart = elementsJeu.panneaux[reference]["apparitionX"];
        console.log("panneau: " + positionDeDepart);
      }
      deplacementDeLElementAvecFond(element, positionDeDepart);
    });

    //plateformes
    let toutesLesPlateformes = document.querySelectorAll(".plateforme");
    toutesLesPlateformes.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        let reference = String(element.id);
        positionDeDepart = elementsJeu.plateformes[reference]["apparitionX"];
      }
      deplacementDeLElementAvecFond(element, positionDeDepart);
    });
  };
});
