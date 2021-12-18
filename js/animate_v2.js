"use strict";

window.addEventListener("DOMContentLoaded", function () {


    let stopForce;
    let divPersoPrincipal = document.getElementsByClassName("perso_anne")[0];

    let musiqueFond = new Audio('musique/Pegan Hill - Moments.mp3');
    let persoPrincipal = sprite.reference;


    const jeu = {
        elementsCommuns: {
            fondUtilise: 'bg',
            animationEnCours: false,
            dialogueVisible: false,
            animation2vue: false,
            surPlateforme: false,
            incrementPosition: 10,
            score: document.querySelector(".score").children[0].children[1],
        },
        direction: {
            gauche: false,
            droite: false,
            idle: true,
        },

        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO MOUVEMENT PERSONNAGE OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO MOUVEMENT PERSONNAGE OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO MOUVEMENT PERSONNAGE OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//

        mouvementPersonnage: {
            leMoteurPourLesAnimations: function () {
                if (jeu.direction.droite) {
                    jeu.mouvementPersonnage.deplacementDuFond(jeu.elementsCommuns.fondUtilise, "droite");
                    jeu.dialogues.checkPositionAnnePourDialogue(jeu.elementsCommuns.fondUtilise);
                    jeu.gestionDesElementsDuJeu.faireApparaitreLesElementsDuJeu(jeu.elementsCommuns.fondUtilise);
                    jeu.elementsCommuns.incrementPosition = -10;
                    jeu.gestionDesElementsDuJeu.checkerElementEtDeplacerAvecLeFond();
                    jeu.gestionDesElementsDuJeu.recupererBonus();
                    jeu.saut.lancerLaVerificationPlateforme();

                    let mouvementDuPerso = parseFloat(persoPrincipal.style.top);

                    if (isNaN(mouvementDuPerso)) {
                        mouvementDuPerso = sprite.marcherADroite.placement;
                    }

                    mouvementDuPerso = sprite.marcherADroite.placement;

                    persoPrincipal.style.top = mouvementDuPerso + "px";

                    jeu.mouvementPersonnage.marcheDuPersonnage(
                        sprite.marcherADroite.nombreDeFrames,
                        sprite.frameX,
                        sprite.directionDesImages
                    );

                }

                if (jeu.direction.gauche) {
                    jeu.mouvementPersonnage.deplacementDuFond(jeu.elementsCommuns.fondUtilise, "gauche");
                    jeu.dialogues.checkPositionAnnePourDialogue(jeu.elementsCommuns.fondUtilise);
                    jeu.gestionDesElementsDuJeu.faireApparaitreLesElementsDuJeu(jeu.elementsCommuns.fondUtilise);
                    jeu.elementsCommuns.incrementPosition = 10;
                    jeu.gestionDesElementsDuJeu.checkerElementEtDeplacerAvecLeFond();
                    jeu.gestionDesElementsDuJeu.recupererBonus();
                    jeu.saut.lancerLaVerificationPlateforme();



                    let mouvementDuPerso = parseFloat(persoPrincipal.style.top);

                    if (isNaN(mouvementDuPerso)) {
                        mouvementDuPerso = sprite.marcherAGauche.placement;
                    }

                    mouvementDuPerso = sprite.marcherAGauche.placement;
                    persoPrincipal.style.top = mouvementDuPerso + "px";

                    jeu.mouvementPersonnage.marcheDuPersonnage(
                        sprite.marcherAGauche.nombreDeFrames,
                        sprite.frameX,
                        sprite.directionDesImages
                    );
                }
            },
            leMoteurPourLIdle: function () {
                if (jeu.direction.idle) {
                    let mouvementDuPerso = parseFloat(persoPrincipal.style.top);

                    if (isNaN(mouvementDuPerso)) {
                        mouvementDuPerso = sprite.idle.placement;
                    }

                    mouvementDuPerso = sprite.idle.placement;
                    persoPrincipal.style.top = mouvementDuPerso + "px";

                    jeu.mouvementPersonnage.marcheDuPersonnage(
                        sprite.idle.nombreDeFrames,
                        sprite.frameX,
                        sprite.directionDesImages
                    );
                }
            },
            ajustementPerso: -40,
            marcheDuPersonnage: function (
                nbrFrame,
                tailleFrame,
                varianteDeDirection
            ) {
                let positionImage = parseFloat(persoPrincipal.style[varianteDeDirection]);

                if (isNaN(positionImage)) {
                    positionImage = jeu.mouvementPersonnage.ajustementPerso;
                }
                positionImage = positionImage + tailleFrame;

                if (positionImage <= jeu.mouvementPersonnage.ajustementPerso + tailleFrame * nbrFrame) {
                    positionImage = jeu.mouvementPersonnage.ajustementPerso;
                }

                persoPrincipal.style[varianteDeDirection] = positionImage + "px";
            },
            //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO PARALLAXE DES FONDS OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
            //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO PARALLAXE DES FONDS OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
            //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO PARALLAXE DES FONDS OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
            deplacementDuFond: function (fondUtilise, direction) {
                let incrementParallaxeUn, incrementParallaxeDeux, incrementParallaxeTrois;

                if (direction == "droite") {
                    incrementParallaxeUn = -1;
                    incrementParallaxeDeux = -3;
                    incrementParallaxeTrois = -10;
                } else {
                    incrementParallaxeUn = 1;
                    incrementParallaxeDeux = 3;
                    incrementParallaxeTrois = 10;
                }

                let premierFond = parseFloat(
                    document.getElementsByClassName(fondUtilise)[0].style[
                    "background-position-x"
                    ]
                );
                let deuxiemeFond = parseFloat(
                    document.getElementsByClassName(fondUtilise)[1].style[
                    "background-position-x"
                    ]
                );
                let troisiemeFond = parseFloat(
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
            }
        },
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO GESTION DU SAUT ET COLLISIONS PLATEFORMES OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO GESTION DU SAUT ET COLLISIONS PLATEFORMES OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO GESTION DU SAUT ET COLLISIONS PLATEFORMES OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        saut: {
            gestionDuSaut: {
                enCours: false,
                forceDuSaut: 14,
                hauteurDuSol: 24,
                graviteDescente: 1,
                hauteurDeLaTerre: 20,
                forceEnAction: false,
            },

            sautDuPersonnage: function () {
                jeu.saut.gestionDuSaut.enCours = true;
                let positionYPerso = parseFloat(divPersoPrincipal.style.bottom);
                jeu.gestionDesElementsDuJeu.recupererBonus();
                if (isNaN(positionYPerso)) {
                    positionYPerso = jeu.saut.gestionDuSaut.hauteurDuSol;
                }

                positionYPerso = positionYPerso + jeu.saut.gestionDuSaut.forceDuSaut;
                divPersoPrincipal.style.bottom = positionYPerso + "px";

                if (
                    jeu.saut.gestionDuSaut.enCours &&
                    parseFloat(divPersoPrincipal.style.bottom) <= jeu.saut.gestionDuSaut.hauteurDuSol
                ) {
                    divPersoPrincipal.style.bottom = jeu.saut.gestionDuSaut.hauteurDuSol + 1 + "px";
                    jeu.saut.gestionDuSaut.enCours = false;
                    jeu.saut.gestionDuSaut.forceDuSaut = 20;
                    clearInterval(stopForce);
                } else {
                    jeu.saut.gestionDuSaut.forceDuSaut = jeu.saut.gestionDuSaut.forceDuSaut - 1;
                    if (jeu.saut.gestionDuSaut.forceDuSaut <= 0) {
                        jeu.saut.detecterSiPlateformeEnSaut();
                    }
                }
            },
            lancerLeSaut: function () {
                stopForce = setInterval(jeu.saut.sautDuPersonnage, 15);
            },
            verifierSiPlateformeEnMarche: function () {
                let plateformes = document.querySelectorAll(".plateforme");
                let informationsPerso = document.querySelector('.perso_anne').getBoundingClientRect();
                let hauteurDuPerso = parseInt(document.querySelector('.perso_anne').style.bottom);

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
                            jeu.saut.gestionDuSaut.hauteurDuSol = hauteurPlateforme;
                            jeu.elementsCommuns.surPlateforme = true;
                            start = false;

                        }
                    } else {
                        compte++;
                    }

                    if (compte == plateformes.length) {
                        jeu.saut.gestionDuSaut.hauteurDuSol = jeu.saut.gestionDuSaut.hauteurDeLaTerre;
                        jeu.elementsCommuns.surPlateforme = false;

                        jeu.saut.rejoindreLeSol();
                    }


                    if (i + 1 == plateformes.length) {
                        start = false;

                    }
                }
            },
            lancerLaVerificationPlateforme: function () {
                requestAnimationFrame(jeu.saut.verifierSiPlateformeEnMarche);
            },
            detecterSiPlateformeEnSaut: function () {
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
                        jeu.elementsCommuns.surPlateforme = true;
                        jeu.saut.gestionDuSaut.hauteurDuSol = hauteurPlateforme;
                        start = false;

                    } else {
                        jeu.saut.gestionDuSaut.hauteurDuSol = jeu.saut.gestionDuSaut.hauteurDeLaTerre;
                        jeu.elementsCommuns.surPlateforme = false;
                        if (i + 1 == plateformes.length) {
                            start = false;
                        }


                    }
                }
            },

            rejoindreLeSol: function () {
                let maHauteur = parseFloat(divPersoPrincipal.style.bottom);

                if (!jeu.saut.gestionDuSaut.enCours && maHauteur > jeu.saut.gestionDuSaut.hauteurDeLaTerre + 10) {
                    if (!jeu.elementsCommuns.surPlateforme) {
                        jeu.saut.gestionDuSaut.forceEnAction = true;
                        jeu.saut.activerForceGravitionnelle();
                    }
                }
            },
            activerForceGravitionnelle: function () {
                requestAnimationFrame(function () {
                    let maHauteur = parseFloat(divPersoPrincipal.style.bottom);
                    maHauteur = maHauteur - jeu.saut.gestionDuSaut.graviteDescente;

                    jeu.saut.gestionDuSaut.graviteDescente = jeu.saut.gestionDuSaut.graviteDescente + 1;

                    if (jeu.saut.gestionDuSaut.graviteDescente > 23) {
                        jeu.saut.gestionDuSaut.graviteDescente = 23;
                    }

                    divPersoPrincipal.style.bottom = maHauteur + "px";

                    if (maHauteur <= jeu.saut.gestionDuSaut.hauteurDeLaTerre) {
                        jeu.saut.gestionDuSaut.forceEnAction = false;
                        divPersoPrincipal.style.bottom = jeu.saut.gestionDuSaut.hauteurDeLaTerre + 1 + "px";
                    }

                    if (maHauteur > jeu.saut.gestionDuSaut.hauteurDeLaTerre) {
                        requestAnimationFrame(jeu.saut.activerForceGravitionnelle);
                    }
                });
            }
        },
        gestionDesElementsDuJeu: {
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GENERER LES ELEMENTS PLATEFORMES, BONUS, CHIENS... AU DEBUT DU JEU MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GENERER LES ELEMENTS PLATEFORMES, BONUS, CHIENS... AU DEBUT DU JEU MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM GENERER LES ELEMENTS PLATEFORMES, BONUS, CHIENS... AU DEBUT DU JEU MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

            faireApparaitreLesElementsDuJeu: function (nomDuFond) {
                let positionDeAnne = parseFloat(
                    document.getElementsByClassName(nomDuFond)[2].style[
                    "background-position-x"
                    ]
                );

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
            },
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER SI PERSO SUR BONUS, AUGMENTER SCOREn DISPARItION BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER SI PERSO SUR BONUS, AUGMENTER SCOREn DISPARItION BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM VERIFIER SI PERSO SUR BONUS, AUGMENTER SCOREn DISPARItION BONUS MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            recupererBonus: function () {
                const lesBonus = document.querySelectorAll(".bonus");
                const sonBonus = new Audio('sons/completetask_0.mp3');
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
                            bottomPerso = jeu.saut.gestionDuSaut.hauteurDuSol + 1;
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
                                jeu.elementsCommuns.score.innerHTML = parseFloat(jeu.elementsCommuns.score.innerHTML) + 200;

                                if (element.id == 'diplomeifocop') {
                                    jeu.scenesAnimees.animationFin();
                                    element.remove();
                                } else {
                                    element.remove();
                                }
                            }
                        }
                    }
                })
            },

            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM LISTER LES ELEMENTS ET LANCER LE DEPLACEMENT AVEC LE PARALLAXE MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM LISTER LES ELEMENTS ET LANCER LE DEPLACEMENT AVEC LE PARALLAXE MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM LISTER LES ELEMENTS ET LANCER LE DEPLACEMENT AVEC LE PARALLAXE MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

            checkerElementEtDeplacerAvecLeFond: function () {
                //bonus
                let tousLesBonus = document.querySelectorAll(".bonus");

                if (tousLesBonus) {
                    tousLesBonus.forEach(function (element) {
                        let positionDeDepart = parseFloat(element.style.left);

                        if (isNaN(positionDeDepart)) {
                            let reference = String(element.id);

                            positionDeDepart = elementsJeu.bonus[reference]["apparitionX"];
                        }
                        jeu.gestionDesElementsDuJeu.deplacementDeLElementAvecFond(element, positionDeDepart);
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

                    jeu.gestionDesElementsDuJeu.deplacementDeLElementAvecFond(element, positionDeDepart);
                });

                //sorcier
                let tousLesSorciers = document.querySelectorAll(".pnj_sorcier");
                tousLesSorciers.forEach(function (element) {
                    let positionDeDepart = parseFloat(element.style.left);

                    if (isNaN(positionDeDepart)) {
                        let reference = String(element.id);
                        positionDeDepart = elementsJeu.pnj[reference]["apparitionX"];
                    }

                    jeu.gestionDesElementsDuJeu.deplacementDeLElementAvecFond(element, positionDeDepart);
                });

                //panneaux
                let tousLesPanneaux = document.querySelectorAll(".panneaux");
                tousLesPanneaux.forEach(function (element) {
                    let positionDeDepart = parseFloat(element.style.left);

                    if (isNaN(positionDeDepart)) {
                        let reference = String(element.id);
                        positionDeDepart = elementsJeu.panneaux[reference]["apparitionX"];
                    }
                    jeu.gestionDesElementsDuJeu.deplacementDeLElementAvecFond(element, positionDeDepart);
                });

                //plateformes
                let toutesLesPlateformes = document.querySelectorAll(".plateforme");
                toutesLesPlateformes.forEach(function (element) {
                    let positionDeDepart = parseFloat(element.style.left);

                    if (isNaN(positionDeDepart)) {
                        let reference = String(element.id);
                        positionDeDepart = elementsJeu.plateformes[reference]["apparitionX"];
                    }
                    jeu.gestionDesElementsDuJeu.deplacementDeLElementAvecFond(element, positionDeDepart);
                });

                //nuages
                let tousLesNuages = document.querySelectorAll(".bg_nuages");
                tousLesNuages.forEach(function (element) {
                    let positionDeDepart = parseFloat(element.style.left);

                    if (isNaN(positionDeDepart)) {
                        positionDeDepart = 6000;
                    }
                    jeu.gestionDesElementsDuJeu.deplacementDeLElementAvecFond(element, positionDeDepart);
                });
            },
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM DEPLACER UN ELEMENT EN MEME TEMPS QUE LE PARALLAXE MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM DEPLACER UN ELEMENT EN MEME TEMPS QUE LE PARALLAXE MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM DEPLACER UN ELEMENT EN MEME TEMPS QUE LE PARALLAXE MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//

            deplacementDeLElementAvecFond: function (objet, positionDepart) {
                let positionX = parseFloat(objet.style.left);

                if (isNaN(positionX)) {
                    positionX = positionDepart;
                } // attention actuellement la position

                positionX = positionX + jeu.elementsCommuns.incrementPosition;

                objet.style.left = positionX + "px";
            }

        },
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ANIMATIONS OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ANIMATIONS OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        //OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ANIMATIONS OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO//
        scenesAnimees: {
            reduceOpacity: 0.017,

            animationIntro: function () {
                jeu.elementsCommuns.animationEnCours = true;

                musiqueFond.volume = 0.6;
                musiqueFond.loop = true;
                musiqueFond.play();

                jeu.elementsCommuns.score.innerHTML = '0';

                const divIntro = document.querySelector(".opening");
                divIntro.innerHTML = "";
                $('.masque').fadeOut();

                let intro = setInterval(function () {
                    jeu.direction.droite = true;
                    jeu.direction.idle = false;

                    let opacityIntro = divIntro.style.opacity;
                    if (isNaN(opacityIntro)) {
                        opacityIntro = 1;
                    }

                    if (opacityIntro <= 0) {
                        opacityIntro = 1;
                    }

                    opacityIntro = opacityIntro - jeu.scenesAnimees.reduceOpacity;
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
                        jeu.direction.droite = false;
                        jeu.direction.idle = true;
                        jeu.elementsCommuns.animationEnCours = false;
                    }
                }, 25);

                setTimeout(function () {
                    jeu.dialogues.afficherDialogue(dialogues.intro0);
                }, 2000);
            },

            animationDeux: function () {
                jeu.elementsCommuns.animationEnCours = true;
                jeu.elementsCommuns.dialogueVisible = true;
                jeu.direction.gauche = false;
                jeu.direction.droite = false;


                $('.masque').fadeIn('slow').delay(1000).fadeOut('slow');

                let fondsUtilises = document.querySelectorAll('.bg');

                setTimeout(function () {
                    fondsUtilises.forEach(function (element) {
                        element.className = 'bg_forest';
                    })

                    $('.pnj_sorcier').hide();
                    document.querySelector('#ifocop').style.left = '220px';
                    document.querySelector('.score').style.color = '#9dc8f5';
                    jeu.elementsCommuns.fondUtilise = 'bg_forest';

                    document.getElementsByClassName('bg_nuages')[1].remove();
                    document.getElementsByClassName('bg_nuages')[0].remove();

                }, 1000);

                jeu.saut.gestionDuSaut.enCours = false;
                jeu.elementsCommuns.animationEnCours = false;
                jeu.elementsCommuns.animation2vue = true;
                jeu.elementsCommuns.dialogueVisible = false;
            },

            animationFin: function () {
                jeu.elementsCommuns.animationEnCours = true;
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

                    $magicienne.css('left', '370px');
                    $magicienne.css('bottom', '40px');

                    setTimeout(function () {
                        let felicitations = new Audio('sons/cheers.mp3');
                        felicitations.volume = 0.5;
                        felicitations.play();
                        jeu.dialogues.afficherDialogue(dialogues.dialoguefin);
                    }, 700);

                }, 800);
            },
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER score et MESSAGE FIN MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER score et MESSAGE FIN MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            //MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM AFFICHER score et MESSAGE FIN MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
            afficherResultat: function () {

                let messageFin = document.querySelector('.scorefinal');
                let scoreTotal = jeu.elementsCommuns.score.innerHTML;
                let messageTotal = document.querySelector('.scorefinal').children[1];

                if (scoreTotal == 6400) {
                    messageTotal.innerHTML = `<p>Score parfait ! Bonus "Complétiste" unlocked !</p>`;
                } else {
                    if (scoreTotal == 200) {
                        messageTotal.innerHTML = `<p>Vous avez <em>raté</em> tous les bonus. Impressionnant.</p>`;
                    } else {
                        messageTotal.innerHTML = `<p>Il vous manque quelques bonus !</p>`;
                    }
                }

                document.querySelector('.scorefinal').children[0].children[0].innerHTML = scoreTotal;
                messageFin.style.display = 'block';

            },

        },
        dialogues: {
            afficherDialogue: function (objetTexte) {
                const sonDialogue = new Audio('sons/dialogue3.mp3');
                sonDialogue.volume = 0.2;

                if (!jeu.elementsCommuns.dialogueVisible) {
                    let dialogue = document.createElement("div");
                    dialogue.className = "dialogue";
                    dialogue.id = objetTexte.nom;
                    dialogue.innerHTML = `
              <p>${objetTexte.perso} :<br>
              ${objetTexte.texte}</p>`;

                    document.querySelector("content").append(dialogue);
                    sonDialogue.play();
                    jeu.elementsCommuns.dialogueVisible = true;
                }
            },
            checkPositionAnnePourDialogue: function (nomDuFond) {
                let positionDeAnne =
                    document.getElementsByClassName(nomDuFond)[2].style[
                    "background-position-x"
                    ];
                if (parseFloat(positionDeAnne) >= 120 && jeu.direction.droite == false) {
                    jeu.direction.gauche = false;
                    jeu.dialogues.afficherDialogue(dialogues.limite);
                    jeu.elementsCommuns.dialogueVisible = true;

                    if (jeu.direction.gauche) {
                        jeu.elementsCommuns.incrementPosition = 0;
                    }
                }

                if (
                    parseFloat(positionDeAnne) >= -1200 &&
                    parseFloat(positionDeAnne) <= -1140 &&
                    !document.getElementById("bonus1") &&
                    !document.getElementById("bonus2")
                ) {
                    if (!dialogues.diplome.vu) {
                        jeu.direction.gauche = false;
                        jeu.direction.droite = false;
                        jeu.dialogues.afficherDialogue(dialogues.diplome);
                        jeu.elementsCommuns.dialogueVisible = true;
                        dialogues.diplome.vu = true;
                    }
                }



                if (
                    parseFloat(positionDeAnne) >= -3100 &&
                    parseFloat(positionDeAnne) <= -3000
                ) {
                    if (!dialogues.sodexo.vu) {
                        jeu.direction.gauche = false;
                        jeu.direction.droite = false;
                        jeu.dialogues.afficherDialogue(dialogues.sodexo);
                        jeu.elementsCommuns.dialogueVisible = true;
                        dialogues.sodexo.vu = true;
                    }
                }


                if (
                    parseFloat(positionDeAnne) >= -5300 &&
                    parseFloat(positionDeAnne) <= -5200
                ) {
                    if (!dialogues.reflexion.vu) {
                        jeu.direction.gauche = false;
                        jeu.direction.droite = false;
                        jeu.dialogues.afficherDialogue(dialogues.reflexion);
                        jeu.elementsCommuns.dialogueVisible = true;
                        dialogues.reflexion.vu = true;
                    }
                }

                if (
                    parseFloat(positionDeAnne) >= -5600 &&
                    parseFloat(positionDeAnne) <= -5500
                ) {
                    if (!dialogues.surprise.vu) {
                        jeu.direction.gauche = false;
                        jeu.direction.droite = false;
                        jeu.dialogues.afficherDialogue(dialogues.surprise);
                        jeu.elementsCommuns.dialogueVisible = true;
                        dialogues.surprise.vu = true;
                    }
                }

                if (
                    parseFloat(positionDeAnne) >= -5900 &&
                    parseFloat(positionDeAnne) <= -5800 && !jeu.elementsCommuns.animation2vue
                ) {
                    if (!dialogues.challenge.vu) {
                        jeu.direction.gauche = false;
                        jeu.direction.droite = false;
                        jeu.dialogues.afficherDialogue(dialogues.challenge);
                        jeu.elementsCommuns.dialogueVisible = true;
                        dialogues.challenge.vu = true;
                    }
                }

                if (parseFloat(positionDeAnne) >= -5800 &&
                    parseFloat(positionDeAnne) <= -5700 && jeu.elementsCommuns.animation2vue && jeu.direction.droite == false) {
                    jeu.direction.gauche = false;
                    if (jeu.direction.gauche) {
                        jeu.elementsCommuns.incrementPosition = 0;
                    }
                    jeu.dialogues.afficherDialogue(dialogues.limiteifocop);
                    jeu.elementsCommuns.dialogueVisible = true;
                }

                if (
                    parseFloat(positionDeAnne) >= -8800 &&
                    parseFloat(positionDeAnne) <= -8750
                ) {
                    if (!dialogues.diplomeifocop2.vu) {
                        jeu.direction.gauche = false;
                        jeu.direction.droite = false;
                        jeu.dialogues.afficherDialogue(dialogues.diplomeifocop2);
                        jeu.elementsCommuns.dialogueVisible = true;
                        dialogues.diplomeifocop2.vu = true;
                    }
                }

                if (
                    parseFloat(positionDeAnne) >= -9200 &&
                    parseFloat(positionDeAnne) <= -9100 && jeu.direction.gauche == false
                ) {
                    jeu.direction.droite = false;
                    if (jeu.direction.droite) {
                        jeu.elementsCommuns.incrementPosition = 0;
                    }
                    jeu.dialogues.afficherDialogue(dialogues.limitedroite);
                    jeu.elementsCommuns.dialogueVisible = true;
                }

            }
        }
    };


    window.addEventListener("keydown", function (evenementSurevenu) {
        let positionDeAnne =
            document.getElementsByClassName(jeu.elementsCommuns.fondUtilise)[2].style["background-position-x"];

        if (!jeu.elementsCommuns.dialogueVisible && !jeu.elementsCommuns.animationEnCours) {
            if ("KeyD" === evenementSurevenu.code) {
                jeu.direction.droite = true;
                jeu.direction.idle = false;
            }

            if ("KeyA" === evenementSurevenu.code || "KeyQ" === evenementSurevenu.code) {
                if (parseFloat(positionDeAnne) >= 120) {
                    jeu.direction.gauche = false;
                    jeu.dialogues.afficherDialogue(dialogues.limite);
                    jeu.dialogueVisible = true;
                } else {
                    jeu.direction.gauche = true;
                    jeu.direction.idle = false;

                    // prevision de la limite de droite pour afficher l'animation
                }
            }
            if ("ShiftRight" === evenementSurevenu.code) {
                if (!jeu.saut.gestionDuSaut.enCours) {
                    jeu.saut.lancerLeSaut();
                }
            }
            if ("Enter" === evenementSurevenu.code) {
            }
        } else {
            if ("Enter" === evenementSurevenu.code) {
                let dialogueEnCours = document.querySelector(".dialogue");
                if (dialogueEnCours.id == "challenge") {
                    dialogueEnCours.remove();
                    jeu.elementsCommuns.dialogueVisible = false;
                    jeu.scenesAnimees.animationDeux();
                }

                if (dialogueEnCours.id == 'dialoguefin') {
                    jeu.scenesAnimees.afficherResultat();
                };

                dialogueEnCours.remove();
                jeu.elementsCommuns.dialogueVisible = false;
            }
        }
    });

    window.addEventListener("keyup", function (evenementSurevenu) {
        if ("KeyD" === evenementSurevenu.code) {
            jeu.direction.droite = false;
            jeu.direction.idle = true;
        }
        if ("KeyA" === evenementSurevenu.code || "KeyQ" === evenementSurevenu.code) {
            jeu.direction.gauche = false;
            jeu.direction.idle = true;
        }
    });


    $("#getcv").on("click", function () {
        window.open(
            "docs/Anne_Quiniou_-_Dev_JS_Fullstack.pdf",
            "CV",
            "location=no,menubar=no"
        );
    });

    $("#launch").on("click", jeu.scenesAnimees.animationIntro);

    window.setInterval(function () {
        jeu.mouvementPersonnage.leMoteurPourLesAnimations();
    }, 25);

    window.setInterval(function () {
        jeu.mouvementPersonnage.leMoteurPourLIdle();
    }, 250);
});
