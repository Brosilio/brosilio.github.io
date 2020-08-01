const man = {};
man.isSpeaking = false;
man.last = 0;
man.say = null;

man.mansounds = [
    new Audio('./res/audio/hhhhrn.ogg'),
    new Audio('./res/audio/hn.ogg')
];

man.brain = [
    "I like to think that I do stuff, but really, I only think about doing stuff.",
    "It smells like I'm running out of oxygen.",
    "Hello!",
    "Welcome!",
    "Stay a while?",
    "*scchhh pssshh* p--ase h-lp -e *shhhhpfff*",
    "Would you like some space tea?",
    "This website is still under construction!"
];

man.think = function () {
    do {
        var next = rand(man.brain.length);
    } while (next == man.last);
    man.last = next;

    man.speak(man.brain[next], true);
};

man.speak = function (thing, doSpeak) {

    if(doSpeak == undefined)
        doSpeak = false;

    let textElem = document.getElementById('mantext');
    
    if(man.say != null)
        clearInterval(man.say);

    let i = 0;
    man.say = function() {
        if(i >= thing.length) {
            clearInterval(man.say);
            man.say = null;
        }

        textElem.textContent += thing.charAt(i);
        i++;
    }

    textElem.innerText = '';
    clearInterval(man.say);
    man.say = setInterval(man.say, 40);

    if(doSpeak)
        man.mansounds[rand(man.mansounds.length)].play();
};

function rand(max) {
    return Math.floor(Math.random() * max);
}