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
        apparitionX: 3330,
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
        apparitionX: 3600,
        apparitionY: 40,
        width: 120,
        id: "datawords",
        class: "panneaux",
        url: "images/panneaux/datawords.png",
        droite: true,
      },
      ifocop: {
        div: document.querySelectorAll(".panneaux")[3],
        apparitionX: 10000,
        apparitionY: 40,
        width: 120,
        id: "ifocop",
        class: "panneaux",
        url: "images/panneaux/ifocop.png",
        droite: true,
      },
    },

    plateformes: {
      plat0: {
        div: document.getElementById("plat0"),
        apparitionX: 1700,
        apparitionY: 140,
        width: 290,
        url: "images/platforms/city_verylong_clair.png",
        id: "plat0",
        visible: false,
        droite: true,
        class: "plateforme plat-long",
      },
      plat1: {
        div: document.getElementById("plat1"),
        apparitionX: 2200,
        apparitionY: 110,
        width: 100,
        url: "images/platforms/city_small_clair.png",
        id: "plat1",
        visible: false,
        droite: true,
        class: "plateforme plat-small",
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
        class: "plateforme plat-med",
      },
      plat2a: {
        div: document.getElementById("plat2"),
        apparitionX: 2800,
        apparitionY: 100,
        width: 290,
        url: "images/platforms/city_verylong_clair.png",
        id: "plat2a",
        visible: false,
        droite: true,
        class: "plateforme plat-long",
      },
      plat3: {
        div: document.getElementById("plat3"),
        apparitionX: 3920,
        apparitionY: 110,
        width: 100,
        url: "images/platforms/city_small_clair.png",
        id: "plat3",
        visible: false,
        droite: true,
        class: "plateforme plat-small",
      },
      plat4: {
        div: document.getElementById("plat4"),
        apparitionX: 4200,
        apparitionY: 110,
        width: 100,
        url: "images/platforms/city_small_clair.png",
        id: "plat4",
        visible: false,
        droite: true,
        class: "plateforme plat-small",
      },
      plat5: {
        div: document.getElementById("plat5"),
        apparitionX: 4600,
        apparitionY: 140,
        width: 290,
        url: "images/platforms/city_verylong_clair.png",
        id: "plat5",
        visible: false,
        droite: true,
        class: "plateforme plat-long",
      },
      plat6: {
        div: document.getElementById("plat6"),
        apparitionX: 5000,
        apparitionY: 300,
        width: 190,
        url: "images/platforms/city_long_clair.png",
        id: "plat6",
        visible: false,
        droite: true,
        class: "plateforme plat-med",
      },
    },
    bonus: {
      explorateur: {
        apparitionX: 145,
        apparitionY: 220,
        url: "images/icones/bonus_explo.png",
        id: "explorateur",
        class: "bonus",
        visible: false,
        droite: false,
        titre: `Bonus Explorateur`,
      },
      diplome1: {
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
        apparitionX: 1400,
        apparitionY: 28,
        url: "images/icones/diplome_2.png",
        id: "bonus2",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Master d'allemand`,
      },
      defendre: {
        apparitionX: 1800,
        apparitionY: 300,
        url: "images/icones/defendre.png",
        id: "defendre",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Défendre ses idées`,
      },
      lourd: {
        apparitionX: 2000,
        apparitionY: 380,
        url: "images/icones/lourd.png",
        id: "lourd",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Forger le caractère`,
      },
      stratego: {
        apparitionX: 2450,
        apparitionY: 350,
        url: "images/icones/strategie.png",
        id: "stratego",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Planning stratégique`,
      },
      marketing: {
        apparitionX: 2200,
        apparitionY: 310,
        url: "images/icones/marketing.png",
        id: "marketing",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Marketing`,
      },
      entraide: {
        apparitionX: 2400,
        apparitionY: 30,
        url: "images/icones/entraide.png",
        id: "entraide",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Esprit d'entraide`,
      },
      planning: {
        apparitionX: 2800,
        apparitionY: 260,
        url: "images/icones/planning.png",
        id: "planning",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Gérer les plannings`,
      },
      multilingue: {
        apparitionX: 3050,
        apparitionY: 200,
        url: "images/icones/multilingue.png",
        id: "multilingue",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Equipes multilingues`,
      },
      vba: {
        apparitionX: 3250,
        apparitionY: 200,
        url: "images/icones/vba.png",
        id: "vba",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Programmation VBA`,
      },
      diplome3: {
        apparitionX: 4030,
        apparitionY: 300,
        url: "images/icones/diplome_3.png",
        id: "bonus3",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Gestion de projet`,
      },
      estomac: {
        apparitionX: 4200,
        apparitionY: 300,
        url: "images/icones/estomac.png",
        id: "estomac",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Estomac bien accroché`,
      },
      seo: {
        apparitionX: 4400,
        apparitionY: 30,
        url: "images/icones/seo.png",
        id: "seo",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `SEO`,
      },
      budget: {
        apparitionX: 4510,
        apparitionY: 320,
        url: "images/icones/budget.png",
        id: "budget",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Gestion des budgets`,
      },
      commercial: {
        apparitionX: 5000,
        apparitionY: 350,
        url: "images/icones/commercial.png",
        id: "estomac",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Présenter aux clients`,
      },
      coeur: {
        apparitionX: 4700,
        apparitionY: 380,
        url: "images/icones/coeur.png",
        id: "coeur",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Résister au stress`,
      },
      plante: {
        apparitionX: 5080,
        apparitionY: 30,
        url: "images/icones/plante.png",
        id: "plante",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Main verte`,
      },
      equipe: {
        apparitionX: 5200,
        apparitionY: 300,
        url: "images/icones/partage.png",
        id: "equipe",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Esprit d'équipe`,
      },

      javascript: {
        apparitionX: 400,
        apparitionY: 300,
        url: "images/icones/javascript.png",
        id: "javascript",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Vanilla JS`,
      },
      jquery: {
        apparitionX: 400,
        apparitionY: 300,
        url: "images/icones/jquery.png",
        id: "jquery",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `jquery`,
      },
      meteor: {
        apparitionX: 400,
        apparitionY: 300,
        url: "images/icones/meteor.png",
        id: "meteor",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `meteor`,
      },
      mongo: {
        apparitionX: 400,
        apparitionY: 300,
        url: "images/icones/mongo.png",
        id: "mongo",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `mongo`,
      },
      expressjs: {
        apparitionX: 400,
        apparitionY: 300,
        url: "images/icones/expressjs.png",
        id: "expressjs",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `expressJS`,
      },
      angular: {
        apparitionX: 400,
        apparitionY: 300,
        url: "images/icones/angular.png",
        id: "angular",
        class: "bonus",
        visible: false,
        droite: true,
        titre: `Angular JS`,
      },
    },
  };
  let hauteurDeLaTerre = 24;
  let persoPrincipal = sprite.classique.reference;
  let dialogueEnCours;
  let divScore = document.querySelector(".score");
  let score = document.querySelector(".score").children[0].children[1];
  score.innerHTML = '0';

  const dialogues = {
    limite: {
      perso: "Anne",
      texte:
        "Gif-sur-DotNet ?<br> Mais non, je veux aller à Paris ! Allez, hop, demi-tour !",
      nom: 'limite',
    },
    intro0: {
      perso: "<strong>Guide</strong>",
      texte: `Utilisez <strong>D et F</strong> pour aller à gauche et à droite.<br>
            Utilisez <strong>Maj</strong> pour sauter et <strong>Entrée</strong> pour dialoguer.`,
      nom: 'intro0',
    },
    intro1: {
      positionVSparallax: "-255",
      perso: "Anne",
      texte: `Wow, Paris. Quelle belle ville. J'ai hâte d'y avoir mes diplômes.`,
      nom: 'intro1',
    },
    diplome: {
      positionVSparallax: "-255",
      perso: "Anne",
      texte: `Parée pour entrer dans le monde du travail avec mes diplômes!`,
      vu: false,
      nom: 'diplome',
    },
    sodexo: {
      positionVSparallax: "-255",
      perso: "Anne",
      texte: `C'était cool chez Sodexo mais j'ai envie de projets plus courts et concrets. Peut être en changeant d'environnement?`,
      vu: false,
      nom: 'sodexo',
    },
    reflexion: {
      positionVSparallax: '-255',
      perso: "Anne",
      texte: "Ca fait bizarre toutes ces années. Même Paris n'est plus la même, on a 4 sortes de pigeons bicolores maintenant. Et moi, j'ai l'impression d'avoir fait le tour de la gestion de projet...",
      vu: false,
      nom: 'reflexion',
    },
    surprise: {
      positionVSparallax: '-255',
      perso: "Anne",
      texte: "???",
      vu: false,
      nom: 'surprise',
    },
    challenge: {
      positionVSparallax: '-255',
      perso: "????",
      texte: "Oseras-tu...<br>Tester tes limites...<br>Risquer de casser ton clavier...<br>Pour devenir...<br> Magicienne du JavaScript??",
      vu: false,
      nom: 'challenge',
    },
    challenge2: {
      positionVSparallax: '-255',
      perso: "Anne",
      texte: "Gandalf ????",
      vu: false,
      nom: 'challenge2',
    },
    challenge3: {
      positionVSparallax: '-255',
      perso: "Anne du futur",
      texte: "Oulà malheureuse, tu veux qu'on se fasse poursuivre par les héritiers de JRR Tolkien? Non, je suis toi du futur! Viens avec moi et deviens plus puissante que tu n'imaginais!",
      vu: false,
      nom: 'challenge3',
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
      checkPositionAnnePourDialogue("bg");
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
      checkPositionAnnePourDialogue("bg");
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
    recupererBonus();
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
      if (forceDuSaut <= 0) {
        detecterSiPlateformeEnSaut();
      }

    }
  };

  const lancerLeSaut = function () {
    stopForce = setInterval(sautDuPersonnage, 15);
  };

  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER SI PLATEFORMES MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  let hauteurDuSol = 24;
  let surPlateforme;


  const verifierSiPlateformeEnMarche = function () {
    let plateformes = document.querySelectorAll(".plateforme");
    let informationsPerso = document.querySelector('.perso_anne').getBoundingClientRect();
    hauteurDuPerso = parseInt(document.querySelector('.perso_anne').style.bottom);

    let start = true;
    let compte = 1;
    for (let i = 0; start; i++) {
      let informationsPlateforme = plateformes[i].getBoundingClientRect();

      let hauteurPlateforme =
        parseFloat(document.querySelectorAll(".plateforme")[i].style.bottom) + 20;

      let siDroitePersoSurPlateforme = parseInt(informationsPerso.right - 20) > parseInt(informationsPlateforme.left) && parseInt(informationsPerso.right - 20) < parseInt(informationsPlateforme.right);

      let siGauchePersoSurPlateforme = parseInt(informationsPerso.left + 5) > parseInt(informationsPlateforme.left) && parseInt(informationsPerso.left + 5) < parseInt(informationsPlateforme.right);

      let siPersoSurPlateforme = parseInt(informationsPerso.left + 5) > parseInt(informationsPlateforme.left) && parseInt(informationsPerso.right - 20) < parseInt(informationsPlateforme.right);

      if (siGauchePersoSurPlateforme || siDroitePersoSurPlateforme || siPersoSurPlateforme) {
        if (hauteurDuPerso >= hauteurPlateforme) {
          hauteurDuSol = hauteurPlateforme;
          surPlateforme = true;
          start = false;

        }
      } else {
        compte++;
      }

      if (compte == plateformes.length) {
        hauteurDuSol = hauteurDeLaTerre;
        surPlateforme = false;

        rejoindreLeSol();
      }


      if (i + 1 == plateformes.length) {
        start = false;

      }
    }

  };

  const lancerLaVerificationPlateforme = function () {
    requestAnimationFrame(verifierSiPlateformeEnMarche);
  };

  const detecterSiPlateformeEnSaut = function () {
    let plateformes = document.querySelectorAll(".plateforme");
    let informationsPerso = document.querySelector('.perso_anne').getBoundingClientRect();

    let start = true;
    for (let i = 0; start; i++) {
      let informationsPlateforme = plateformes[i].getBoundingClientRect();

      let hauteurPlateforme =
        parseFloat(document.querySelectorAll(".plateforme")[i].style.bottom) + 20;

      let siDroitePersoSurPlateforme = parseInt(informationsPerso.right - 20) > parseInt(informationsPlateforme.left) && parseInt(informationsPerso.right - 20) < parseInt(informationsPlateforme.right);

      let siGauchePersoSurPlateforme = parseInt(informationsPerso.left + 5) > parseInt(informationsPlateforme.left) && parseInt(informationsPerso.left + 5) < parseInt(informationsPlateforme.right);

      let siPersoSurPlateforme = parseInt(informationsPerso.left + 5) > parseInt(informationsPlateforme.left) && parseInt(informationsPerso.right - 20) < parseInt(informationsPlateforme.right);

      if ((siGauchePersoSurPlateforme || siDroitePersoSurPlateforme || siPersoSurPlateforme)) {
        surPlateforme = true;
        hauteurDuSol = hauteurPlateforme;
        start = false;

      } else {
        hauteurDuSol = hauteurDeLaTerre;
        surPlateforme = false;
        if (i + 1 == plateformes.length) {
          start = false;
        }


      }
    };
  };



  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GRAVITE? MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  let gravite = 23;
  let forceEnAction = false;
  let stopDescente;
  let graviteDescente = 1;

  const rejoindreLeSol = function () {
    let maHauteur = parseFloat(divPersoPrincipal.style.bottom);

    if (!gestionDuSaut.enCours && maHauteur > hauteurDeLaTerre + 10) {
      if (!surPlateforme) {
        forceEnAction = true;
        activerForceGravitionnelle();
      }
    }
  };

  const activerForceGravitionnelle = function () {
    requestAnimationFrame(function () {
      let maHauteur = parseFloat(divPersoPrincipal.style.bottom);
      maHauteur = maHauteur - graviteDescente;

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
        requestAnimationFrame(activerForceGravitionnelle);
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

  // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM animation numero 2 MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM //

  const animationDeux = function () {
    let fondsNuage = document.querySelectorAll('.bg_nuages');
    fondsNuage.forEach(function (element) {
      element.style.left = '750px';
      element.style.display = 'inline';
    });

    lancerLesNuages();

    let sorcier = document.createElement('div');
    sorcier.className = 'pnj_sorcier';
    sorcier.style = '{bottom: 350px; left: 750px;}';

    let image = document.createElement('img');
    image.src = 'images/sprites/whitewitch.png';
    sorcier.appendChild(image);

    document.querySelector('content').appendChild(sorcier);
    lancerLeSorcier();

    if (document.querySelector('.pnj_sorcier').style.left == stopSorcier) {
      afficherDialogue(dialogues.challenge);
    };










    gestionDuSaut.enCours = false;
  };

  let stopDeplacementNuage;
  let premierStopNuage = 260;
  let positionXNuage;

  const deplacerNuages = function () {
    let fondsNuage = document.querySelectorAll('.bg_nuages');
    let increment = 5;

    fondsNuage.forEach(function (element) {
      positionXNuage = parseFloat(element.style.left);
      if (isNaN(positionXNuage)) {
        positionXNuage = 750;
      }
      positionXNuage = positionXNuage - increment;
      element.style.left = positionXNuage + 'px';
    });

    if (positionXNuage == premierStopNuage) {
      clearInterval(stopDeplacementNuage);
    }
  };

  const lancerLesNuages = function () {
    stopDeplacementNuage = setInterval(deplacerNuages, 25);
  };


  let stopDeplacementSorcier;
  let positionXSorcier;
  let stopSorcier = 340;
  let positionOKpourDialogue = false;

  const lancerLeSorcier = function () {
    stopDeplacementSorcier = setInterval(deplacerSorcier, 25);
  };
  const deplacerSorcier = function () {
    let sorcier = document.querySelector('.pnj_sorcier');
    let increment = 10;

    positionXSorcier = parseFloat(sorcier.style.left);
    if (isNaN(positionXSorcier)) {
      positionXSorcier = 750;
    }
    positionXSorcier = positionXSorcier - increment;
    sorcier.style.left = positionXSorcier + 'px';

    if (positionXSorcier == stopSorcier) {
      clearInterval(stopDeplacementSorcier);
      positionOKpourDialogue = true;
    };
  }


  // ne marche pas, à finir



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
      dialogue.id = objetTexte.nom;
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

  var checkPositionAnnePourDialogue = function (nomDuFond) {
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



    if (
      parseFloat(positionDeAnne) >= -3100 &&
      parseFloat(positionDeAnne) <= -3000
    ) {
      if (!dialogues.sodexo.vu) {
        direction.gauche = false;
        direction.droite = false;
        afficherDialogue(dialogues.sodexo);
        dialogueVisible = true;
        dialogues.sodexo.vu = true;
      }
    }


    if (
      parseFloat(positionDeAnne) >= -5200 &&
      parseFloat(positionDeAnne) <= -5100
    ) {
      if (!dialogues.reflexion.vu) {
        direction.gauche = false;
        direction.droite = false;
        afficherDialogue(dialogues.reflexion);
        dialogueVisible = true;
        dialogues.reflexion.vu = true;
      }
    }

    if (
      parseFloat(positionDeAnne) >= -5600 &&
      parseFloat(positionDeAnne) <= -5500
    ) {
      if (!dialogues.surprise.vu) {
        direction.gauche = false;
        direction.droite = false;
        afficherDialogue(dialogues.surprise);
        dialogueVisible = true;
        dialogues.surprise.vu = true;
      }
    }

    if (
      parseFloat(positionDeAnne) >= -5900 &&
      parseFloat(positionDeAnne) <= -5800
    ) {
      direction.droite = false;
      direction.gauche = false;
      animationEnCours = true;
      animationDeux();
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
      let topBonus = parseInt(element.children[1].getBoundingClientRect().top);
      let bottomBonus = parseInt(element.children[1].getBoundingClientRect().bottom);
      let topPerso = parseInt(divPersoPrincipal.getBoundingClientRect().top);
      let bottomPerso = parseInt(divPersoPrincipal.getBoundingClientRect().bottom);

      if (element.style.display != "none") {
        if (isNaN(bottomPerso)) {
          bottomPerso = hauteurDuSol + 1;
        }

        if (isNaN(positionYBonus)) {
          positionYBonus = elementJeu.bonus[string(element.id)].apparitionY;
        }

        if (positionXBonus < 300 && positionXBonus > 220) {
          let topBonusDansHitBoxPerso = topBonus > topPerso && topBonus < bottomPerso;
          let bottomBonusDansHitBoxPerso = bottomBonus < bottomPerso && bottomBonus > topPerso;
          let BonusDansHitBoxPerso = topBonus > topPerso && bottomBonus < bottomPerso;
          console.log('top bonus: ' + topBonus);
          console.log('bottom bonus: ' + bottomBonus);
          console.log('top perso: ' + topPerso);
          console.log('bottom pser: ' + bottomPerso);

          if (topBonusDansHitBoxPerso || bottomBonusDansHitBoxPerso || BonusDansHitBoxPerso) {
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
