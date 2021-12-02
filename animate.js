window.addEventListener('DOMContentLoaded', function() {

var direction = {
    gauche: false,
    droite: false,
    bas: false,
}

var sprite = {
    classique: {
        frameX:,
        frameY:,
        direction: left
    },

    sorcier: {
        frameX:,
        frameY:,
        direction: top;
    },

    chien: {
        frameX: '95px',
        line1:,
        line2:,
        line3:,
        direction: left
    }

}

window.addEventListener('keydown', function(evenementSurevenu){
    if ('ArrowRight' === evenementSurevenu.code) {// yoda condition > voir wiki
        direction.droite = true;
    }
    if ('ArrowLeft' === evenementSurevenu.code) {// yoda condition > voir wiki      
        direction.gauche = true;
    }
    if ('ArrowDown' === evenementSurevenu.code) {// yoda condition > voir wiki     
        direction.bas = true;
    }
});    

window.addEventListener('keyup', function(evenementSurevenu){
    if ('ArrowRight' === evenementSurevenu.code) {// yoda condition > voir wiki     
        direction.droite = false;
    }
    if ('ArrowLeft' === evenementSurevenu.code) {// yoda condition > voir wiki     
        direction.gauche = false;
    }
    if ('ArrowDown' === evenementSurevenu.code) {// yoda condition > voir wiki     
        direction.bas = false;
    }
});

var lemoteurPourLesAnimations = function(tempsEcoule) {
    if(direction.droite) {
        incrementationDeLaPosition('left',1);
    }
    if(direction.gauche) {
        incrementationDeLaPosition('left',-1);
    }
};






});