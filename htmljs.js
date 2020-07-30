const hjs = {};
const hjsprocs = {};

hjs.run = async function () {
    console.log("htmljs running");

    let currentNode = null;
    let ni = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT);

    while (currentNode = ni.nextNode()) {
        if (!currentNode.nodeName.startsWith('X-')) {
            continue;
        }

        if (hjsprocs[currentNode.nodeName] != undefined) {
            const repeatCount = currentNode.attributes['repeat'] == undefined ? 1 : +currentNode.attributes['repeat'].value;
            let reps = 0;
            do {
                reps++;
                function process() {
                    return new Promise((resolve, reject) => {
                        hjsprocs[currentNode.nodeName](currentNode, currentNode.parentNode, () => {
                            resolve();
                        });
                    });
                }

                await process().then(() => {
                    if (reps >= repeatCount)
                        currentNode.remove();
                });
            } while (reps < repeatCount);
        }
    }
};

hjsprocs['X-WRITE'] = function (node, parent, onNodeComplete) {
    const html = node.attributes['html'] != undefined;
    const from = node.attributes['from'] == undefined ? undefined : node.attributes['from'].value;
    const speed = node.attributes['speed'] == undefined ? 0 : (1000 / +node.attributes['speed'].value);
    const repeatCount = node.attributes['count'] == undefined ? 1 : +node.attributes['count'].value;

    let text = document.createTextNode('');
    parent.insertBefore(text, node);

    let iters = 0;

    function onIterComplete() {
        iters++;
        if (iters >= repeatCount) {
            onNodeComplete();
            return;
        }

        doIteration();
    }

    function doIteration() {
        if (html) {
            node.insertAdjacentHTML('afterend', node.innerHTML);
            if (from != undefined) {
                node.insertAdjacentHTML('afterend', eval(from));
            }

            onIterComplete();
            return;
        }

        if (speed <= 0) {
            node.insertAdjacentText('afterend', node.innerText);
            if (from != undefined) {
                node.insertAdjacentText('afterend', eval(from));
            }

            onIterComplete();
            return;
        }

        function doWrite(string, whenDone) {
            let i = 0;
            let loop = function () {
                if (i >= string.length) {
                    clearInterval(loop);
                    if (whenDone != undefined && whenDone != null) {
                        whenDone();
                    }
                    return;
                }

                text.appendData(string.charAt(i));
                i++;
            };
            loop = setInterval(loop, speed);
        }

        if (from != undefined) {
            doWrite(node.innerText, () => {
                doWrite(eval(from), () => {
                    onIterComplete();
                });
            });
        }

        doWrite(node.innerText, () => {
            onIterComplete();
        });
    }

    if (iters < repeatCount)
        doIteration();
};

hjsprocs['X-SLEEP'] = function (node, parent, onNodeComplete) {
    const time = node.attributes['for'] == undefined ? 0 : +node.attributes['for'].value;
    setTimeout(onNodeComplete, time);
};

hjsprocs['X-SPINNER'] = function (node, parent, onNodeComplete) {
    const time = node.attributes['time'] == undefined ? 0 : +node.attributes['time'].value;
    const speed = node.attributes['speed'] == undefined ? 0 : (1000 / +node.attributes['speed'].value);

    if (time == 0) {
        onNodeComplete();
        return;
    }

    let text = document.createTextNode('');
    parent.insertBefore(text, node);

    let anim = ['*----', '-*---', '--*--', '---*-', '----*'];
    let frame = 0;
    let dir = 1;

    let spin = function () {
        text.data = anim[frame];
        frame += dir;
        if(frame >= anim.length) {
            dir = -1;
            frame--;
        }

        if(frame < 0) {
            dir = 1;
            frame++;
        }
    };

    spin = setInterval(spin, speed);
    setTimeout(() => {
        clearInterval(spin);
        onNodeComplete();
    }, time);
};