let frameX = 224;
let monImage = document.body.children[1].children[4].children [0].children[0];

const animateMe = function() {
maPosition = parseInt(monImage.style.marginLeft);

if(isNaN(maPosition) || maPosition == -frameX*3) {
    maPosition = +frameX;
} 

maPosition = maPosition - frameX;
monImage.style.marginLeft = maPosition + 'px';
};

let vitesseDAnimation = 300;
const bouclerLAnimation = function(){
    setInterval(animateMe,vitesseDAnimation);
};

bouclerLAnimation();