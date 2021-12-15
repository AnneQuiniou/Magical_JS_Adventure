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

  // stockages des informations pour les différents sprites utilisés


  let fondEnCours = 'bg';

  let hauteurDeLaTerre = 24;
  let persoPrincipal = sprite.reference;
  let dialogueEnCours;
  let score = document.querySelector(".score").children[0].children[1];
  score.innerHTML = '0';

  window.addEventListener("keydown", function (evenementSurevenu) {
    let positionDeAnne =
      document.getElementsByClassName(fondEnCours)[2].style["background-position-x"];

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
        if (dialogueEnCours.id == "challenge") {
          dialogueEnCours.remove();
          dialogueVisible = false;
          animationDeux();
        }

        if (dialogueEnCours.id == 'dialoguefin') {
          afficherResultat();
        };

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
      deplacementDuFond(fondEnCours, "droite");
      checkPositionAnnePourDialogue(fondEnCours);
      faireApparaitreLesElementsDuJeu(fondEnCours);
      incrementPosition = -10;
      checkerElementEtDeplacerAvecLeFond();
      recupererBonus();
      lancerLaVerificationPlateforme();
      mouvementDuPerso = parseFloat(persoPrincipal.style.top);

      if (isNaN(mouvementDuPerso)) {
        mouvementDuPerso = sprite.marcherADroite.placement;
      }

      mouvementDuPerso = sprite.marcherADroite.placement;

      persoPrincipal.style.top = mouvementDuPerso + "px";

      marcheDuPersonnage(
        sprite.marcherADroite.nombreDeFrames,
        sprite.frameX,
        sprite.directionDesImages
      );

    }

    if (direction.gauche) {
      deplacementDuFond(fondEnCours, "gauche");
      checkPositionAnnePourDialogue(fondEnCours);
      incrementPosition = 10;
      checkerElementEtDeplacerAvecLeFond();
      faireApparaitreLesElementsDuJeu(fondEnCours);
      recupererBonus();
      lancerLaVerificationPlateforme();


      mouvementDuPerso = parseFloat(persoPrincipal.style.top);

      if (isNaN(mouvementDuPerso)) {
        mouvementDuPerso = sprite.marcherAGauche.placement;
      }

      mouvementDuPerso = sprite.marcherAGauche.placement;
      persoPrincipal.style.top = mouvementDuPerso + "px";

      marcheDuPersonnage(
        sprite.marcherAGauche.nombreDeFrames,
        sprite.frameX,
        sprite.directionDesImages
      );

    }
  };

  var leMoteurPourLIdle = function () {
    //IDLE UNIQUEMENT DU PERSO PRINCIPAL SELON SPRITE UTILISE
    if (direction.idle) {
      mouvementDuPerso = parseFloat(persoPrincipal.style.top);

      if (isNaN(mouvementDuPerso)) {
        mouvementDuPerso = sprite.idle.placement;
      }

      mouvementDuPerso = sprite.idle.placement;
      persoPrincipal.style.top = mouvementDuPerso + "px";

      marcheDuPersonnage(
        sprite.idle.nombreDeFrames,
        sprite.frameX,
        sprite.directionDesImages
      );
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
      "docs/Anne_Quiniou_-_Dev_JS_Fullstack.pdf",
      "CV",
      "location=no,menubar=no"
    );
  });

  let reduceOpacity = 0.017;
  let musiqueFond = new Audio('musique/Pegan Hill - Moments.mp3');

  $("#launch").on("click", function () {
    animationEnCours = true;

    musiqueFond.volume = 0.6;
    musiqueFond.loop = true;
    musiqueFond.play();

    const divIntro = document.querySelector(".opening");
    divIntro.innerHTML = "";
    $('.masque').fadeOut();

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

  let animation2vue = false;

  const animationDeux = function () {
    animationEnCours = true;
    dialogueVisible = true;


    $('.masque').fadeIn('slow').delay(1000).fadeOut('slow');

    let fondsUtilises = document.querySelectorAll('.bg');

    setTimeout(function () {
      fondsUtilises.forEach(function (element) {
        element.className = 'bg_forest';
      })

      $('.pnj_sorcier').hide();
      document.querySelector('#ifocop').style.left = '220px';
      document.querySelector('.score').style.color = '#9dc8f5';
      fondEnCours = 'bg_forest';

      document.getElementsByClassName('bg_nuages')[1].remove();
      document.getElementsByClassName('bg_nuages')[0].remove();

    }, 1000);

    gestionDuSaut.enCours = false;
    animationEnCours = false;
    animation2vue = true;
    dialogueVisible = false;
  };


  // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM animation numero 3 MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM //



  const animationFin = function () {
    animationEnCours = true;
    musiqueFond.pause();
    let musiqueFin = new Audio('musique/cyberending.mp3');
    musiqueFin.volume = 0.5;
    musiqueFin.loop = true;
    musiqueFin.play();

    $('.masque').fadeIn('slow').delay(1000).fadeOut('slow');

    setTimeout(function () {

      $('#diplomeifocop').remove;

      divPersoPrincipal.style.display = 'none';
      document.querySelectorAll('.bg_forest')[2].style.display = 'none';
      document.querySelectorAll('.bg_forest')[1].style.display = 'none';
      document.querySelector('#rocher').style.display = 'none';
      document.querySelector('.score').style.display = 'none';


      let $magicienne = $('.pnj_sorcier');
      $magicienne.show();

      $magicienne.css('left', '400px');
      $magicienne.css('bottom', '100px');

      setTimeout(function () {
        let felicitations = new Audio('sons/cheers.mp3');
        felicitations.volume = 0.5;
        felicitations.play();
        afficherDialogue(dialogues.dialoguefin);
      }, 700);

    }, 800);
  };


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
    const sonDialogue = new Audio('sons/dialogue3.mp3');
    sonDialogue.volume = 0.2;

    if (!dialogueVisible) {
      let dialogue = document.createElement("div");
      dialogue.className = "dialogue";
      dialogue.id = objetTexte.nom;
      dialogue.innerHTML = `
      <p>${objetTexte.perso} :<br>
      ${objetTexte.texte}</p>`;

      document.querySelector("content").append(dialogue);
      sonDialogue.play();
      dialogueVisible = true;
    }
  };
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER score et FIN MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER score et FIN MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER score et FIN MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  const afficherResultat = function () {

    let messageFin = document.querySelector('.scorefinal');
    let scoreTotal = score.innerHTML;
    let messageTotal = document.querySelector('.scorefinal').children[1];

    if (scoreTotal == 6400) {
      messageTotal.innerHTML = `<p>Score parfait! Quel complétiste..;</p>`;
    } else {
      if (scoreTotal == 0) {
        messageTotal.innerHTML = `<p>Vous avez <em>raté</em> tous les bonus. Impressionnant.</p>`;
      } else {
        messageTotal.innerHTML = `<p>Il vous manque quelques bonus !</p>`;
      }
    }

    document.querySelector('.scorefinal').children[0].children[0].innerHTML = scoreTotal;
    messageFin.style.display = 'block';

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
      parseFloat(positionDeAnne) >= -5300 &&
      parseFloat(positionDeAnne) <= -5200
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
      parseFloat(positionDeAnne) <= -5800 && !animation2vue
    ) {
      if (!dialogues.challenge.vu) {
        direction.droite = false;
        direction.gauche = false;
        afficherDialogue(dialogues.challenge);
        dialogueVisible = true;
        dialogues.challenge.vu = true;
      }
    }

    if (parseFloat(positionDeAnne) >= -5800 &&
      parseFloat(positionDeAnne) <= -5700 && animation2vue && direction.droite == false) {
      direction.gauche = false;
      if (direction.gauche) {
        incrementPosition = 0;
      }
      afficherDialogue(dialogues.limiteifocop);
      dialogueVisible = true;
    }

    if (
      parseFloat(positionDeAnne) >= -8800 &&
      parseFloat(positionDeAnne) <= -8750
    ) {
      if (!dialogues.diplomeifocop.vu) {
        direction.droite = false;
        direction.gauche = false;
        afficherDialogue(dialogues.diplomeifocop);
        dialogueVisible = true;
        dialogues.diplomeifocop.vu = true;
      }
    }

    if (
      parseFloat(positionDeAnne) >= -9200 &&
      parseFloat(positionDeAnne) <= -9100 && direction.gauche == false
    ) {
      direction.droite = false;
      if (direction.droite) {
        incrementPosition = 0;
      }
      afficherDialogue(dialogues.limitedroite);
      dialogueVisible = true;
    }

  };




  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM RECUPER LES BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM RECUPER LES BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
  //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM RECUPER LES BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

  var recupererBonus = function () {
    var lesBonus = document.querySelectorAll(".bonus");
    var sonBonus = new Audio('sons/completetask_0.mp3');
    sonBonus.volume = .6;


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

          if (topBonusDansHitBoxPerso || bottomBonusDansHitBoxPerso || BonusDansHitBoxPerso) {
            //revoir les éléments de détection des bonus
            sonBonus.play();
            score.innerHTML = parseFloat(score.innerHTML) + 200;

            if (element.id == 'diplomeifocop') {
              animationFin();
              element.remove();
            } else {
              element.remove();
            }
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
        positionDeDepart = elementsJeu.pnj[reference]["apparitionX"];
      }

      deplacementDeLElementAvecFond(element, positionDeDepart);
    });

    //sorcier
    let tousLesSorciers = document.querySelectorAll(".pnj_sorcier");
    tousLesSorciers.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        let reference = String(element.id);
        positionDeDepart = elementsJeu.pnj[reference]["apparitionX"];
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

    //nuages
    let tousLesNuages = document.querySelectorAll(".bg_nuages");
    tousLesNuages.forEach(function (element) {
      let positionDeDepart = parseFloat(element.style.left);

      if (isNaN(positionDeDepart)) {
        positionDeDepart = 6000;
      }
      deplacementDeLElementAvecFond(element, positionDeDepart);
    });
  };
});
