function instruct (html) {
    document.getElementById('instruction').innerHTML = html;
}

var penalties;
function showPenalties () {
    unhide(document.getElementById('investigator'));
    var ul = document.getElementById('penalties');
    unhide(ul);
    penalties = choose(3, otherCards['penalties']);
    penalties.forEach(function (penalty) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        li.id = 'penalty-'+penalty
        link.onclick = function (penalty) { return function () {
            var ul = this.parentNode.parentNode;
            ul.removeChild(this.parentNode);
            penalties.delete(penalty);
            for (var i = 0; i < ul.children.length; ++i) {
                ul.children[i].firstChild.onclick = undefined;
            }
            unhide(document.getElementById('suspect-id'));
            document.getElementById('interview-id').innerHTML = encode(Array.from(penalties));
            instruct('Tell suspect the interview number. Agree on a topic. Enter suspect number in form VK-82s.');

            var ulChosen = document.getElementById('prompts-chosen');
            for (var packet in packets) {
                addCard(packet + '/investigator/primary-back', ulChosen, undefined);
            }
        }; }(penalty);
        var img = document.createElement('img');
        link.appendChild(img);
        img.src = '../cards/penalties/' + penalty + '.png';
        ul.appendChild(li);
    });
}

initialize(showPenalties);

function submitSuspectId () {
    var n = document.getElementById('suspect-id-input').value;
    if (Number.isInteger(Number(n)) && n >= 10) {
        var params = decode(n);
        if (undefined !== params && params.length === 3) {
            if (params[0] < otherCards['penalties']
                && params[1] < packetList.length
                && params[2] < otherCards['notes']
                && penalties.has(params[0])
            ) {
                var ul = document.getElementById('penalties');
                for (var i = ul.children.length-1; i >= 0; --i) {
                    if (ul.children[i].id !== 'penalty-'+params[0]) ul.removeChild(ul.children[i])
                }
                var packet = packetList[params[1]];
                document.getElementById('suspect-id').innerHTML = n;
                document.getElementById('packet').innerHTML = '<img src="../cards/' + packet['name'] + '/icon.png" class="icon">';
                showSuspect(params[2]);
                showPrompts(packet);
                return;
            }
        }
    }

    unhide(document.getElementById('suspect-id-error'));
}

function showSuspect(suspect, suspectId) {
    var img = document.getElementById('suspect-note');
    img.src = '../cards/notes/'+suspect+'.png';
    unhide(img);
}

function enable(node) {
    node.disabled = false;
    node.parentNode.classList.remove('disabled');
}

function showPrompts(packet) {
    instruct('Choose two primary and two secondary interrogation prompts.');
    var ulRest = document.getElementById('prompts');
    var ulChosen = document.getElementById('prompts-chosen');
    unhide(document.getElementById('prompts-separator'));
    for (var i = ulChosen.children.length-1; i >= 0; --i) {
        ulChosen.removeChild(ulChosen.children[i]);
    }
    var chosen = {'primary': 0, 'secondary': 0}
    function swapListFunc (type) { return function swapLists() {
        var ul = this.parentNode.parentNode;
        ul.removeChild(this.parentNode);
        var choosing = ul === ulRest;
        var ulOther = choosing ? ulChosen : ulRest;
        ulOther.appendChild(this.parentNode);

        if (choosing) ++chosen[type];
        else --chosen[type];

        if (chosen.primary === 2 && chosen.secondary === 2) {
            hide(document.getElementById('prompts-separator'));
            hide(ulRest);
            for (var i = 0; i < ulChosen.children.length; ++i) {
                ulChosen.children[i].firstChild.onclick = null;
            }
            instruct('Calibrate penalty and confirm suspect identity. Check form VK-82s.');
            enable(document.getElementById('penalty-check'));
            enable(document.getElementById('identity-check'));
        }
    }; };

    for (var i = 0; i < Math.max(packet['primary'], packet['secondary']); ++i) {
        if (i < packet['primary']) {
            addCard(packet['name'] + '/investigator/primary-' + i, ulRest, swapListFunc('primary'));
        }
        if (i < packet['secondary']) {
            addCard(packet['name'] + '/investigator/secondary-' + i, ulRest, swapListFunc('secondary'));
        }
    }
}

function onChecked () {
    if (
        document.getElementById('penalty-check').checked &&
        document.getElementById('identity-check').checked
    ) {
        document.getElementById('penalty-check').disabled = true;
        document.getElementById('identity-check').disabled = true;
        enable(document.getElementById('minutes'));
        enable(document.getElementById('seconds'));
        enable(document.getElementById('clock-start'));
        instruct('Start the clock when ready.');
    }
}

function pip (n) {
    var pip = document.getElementById('pip');
    pip.play();
    --n;
    var interval = setInterval(function () {
        if (n == 0) {
            clearInterval(interval);
        } else {
            --n;
            pip.play();
        }
    }, 500);
}

var intervalClock;
function startClock () {
    document.getElementById('clock-start').disabled = true;
    var minutes = 5;
    var seconds = 0;
    instruct('Interrogate suspect.');
    pip(minutes);
    intervalClock = setInterval(function () {
        if (seconds === 0) {
            if (minutes === 0) {
                finish();
                return;
            } else {
                seconds = 59;
                minutes -= 1;
            }
        } else {
            seconds -= 1;
            if (seconds === 0 && minutes != 0) pip(minutes);
        }
        document.getElementById('minutes').innerHTML = minutes;
        document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);
    enable(document.getElementById('robot-check'));
    enable(document.getElementById('certify'));
}

function stopClock () {
    document.getElementById('minutes').innerHTML = '-';
    document.getElementById('seconds').innerHTML = '--';
    if (intervalClock) {
        clearInterval(intervalClock);
        intervalClock = null;
        return true;
    } else {
        return false;
    }
}

function finish () {
    stopClock();
    document.getElementById('flatline').play();
    enable(document.getElementById('human-check'));
    instruct('Ask final question and complete form VK-82s.');
}

function certified () {
    if (stopClock()) document.getElementById('flatline').play();
    if (document.getElementById('robot-check').checked) {
        instruct('Send suspect for disassembly.');
    } else {
        console.assert(document.getElementById('human-check').checked);
        instruct("Shake suspect's hand and apologize for the inconvenience.");
    }
}

function enableCertify () {
    enable(document.getElementById('certify'));
}
