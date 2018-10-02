function showInterviewForm () {
    unhide(document.getElementById('suspect'));
}

initialize(showInterviewForm);

function submitInterviewId () {
    var n = document.getElementById('interview-id-input').value;
    if (Number.isInteger(Number(n)) && n.length > 1) {
        var penalties = decode(n);
        if (undefined !== penalties && penalties.length === 2) {
            if (penalties[0] < otherCards['penalties'] && penalties[1] < otherCards['penalties']) {
                hide(document.getElementById('select-interview'));
                showPenalties(penalties);
                return;
            }
        }
    }

    unhide(document.getElementById('suspect-id-error'));
}

var chosenPenalty;
function showPenalties (penalties) {
    var ul = document.getElementById('penalties');
    penalties.forEach(function (penalty) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (penalty) { return function () {
            var ul = this.parentNode.parentNode;
            for (var i = ul.children.length-1; i >= 0; --i) {
                if (ul.children[i] != this.parentNode) ul.removeChild(ul.children[i]);
            }
            chosenPenalty = penalty;
            showPackets();
        }; }(penalty);
        var img = document.createElement('img');
        link.appendChild(img);
        img.src = '../cards/penalties/' + penalty + '.png';
        ul.appendChild(li);
    });
}

var chosenPacket;
function showPackets () {
    var ul = document.getElementById('packets');
    for (var packet in packets) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (packet) { return function () {
            chosenPacket = packets[packet]['index'];
            showRoles(packet);
        }; }(packet);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/' + packet + '/suspect/back.png';
        img.alt = packet;
        img.title = packets[packet]['description'];
        ul.appendChild(li);
    }
}

function showRoles(packet) {
    hide(document.getElementById('packets'));
    unhide(document.getElementById('roles'));
    var roles = new Map();
    var humans = packets[packet]['humans'];
    while (roles.size < 3) {
        var role = Math.floor(Math.random()*(humans+packets[packet]['robots']));
        if (role < humans) {
            roles.set('human-' + role, 'human');
        } else {
            card = 'robot-' + (role-humans)
            roles.set(card, card);
        }
    }

    var ul = document.getElementById('roles');
    roles.forEach(function (card) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (packet, role) { return function () {
            this.onclick = undefined;
            showNotes(this.parentNode, packet, role);
        }; }(packet, card);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/' + packet + '/suspect/' + card + '.png';
        ul.appendChild(li);
    });
}

function showNotes(li, packet, role) {
    var cards = li.parentNode.childNodes;
    for (var i = cards.length-1; i >=0; --i) {
        if (cards[i] != li) li.parentNode.removeChild(cards[i]);
    }

    var ul = document.getElementById('notes');
    unhide(ul);
    choose(2, otherCards['notes']).forEach(function (note) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (suspect) { return function () {
            this.onclick = undefined;
            var li = this.parentNode;
            var notes = li.parentNode.childNodes;
            console.log(notes);
            for (var i = notes.length-1; i >=0; --i) {
                if (notes[i] != li) li.parentNode.removeChild(notes[i]);
            }
            document.getElementById('suspect-id').appendChild(
                document.createTextNode('Suspect #'+encode([chosenPenalty, chosenPacket, suspect]))
            );
        }; }(note);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/notes/' + note + '.png';
        ul.appendChild(li);
    });
}
