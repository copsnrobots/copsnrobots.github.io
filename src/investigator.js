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

function addCard(path, list, func) {
    var li = document.createElement('li');
    var link = document.createElement('a');
    li.appendChild(link);
    link.onclick = func;
    var img = document.createElement('img');
    link.appendChild(img);
    img.src = '../cards/'+path+'.png';
    list.appendChild(li);
}

function showPrompts(packet) {
    instruct('Choose two primary and two secondary interrogation prompts.');
    var ulRest = document.getElementById('prompts');
    var ulChosen = document.getElementById('prompts-chosen');
    unhide(document.getElementById('prompts-separator'));
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
