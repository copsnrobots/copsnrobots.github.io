function showPackets () {
    var ul = document.getElementById('packets');
    var i = 0;
    for (var packet in packets) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (packet, index) { return function () {
            showRoles(packet, index);
        }; }(packet, i);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/' + packet + '/suspect/back.png';
        img.alt = packet;
        img.title = packets[packet]['description'];
        ul.appendChild(li);
        
        ++i;
    }
}

var xhr = new XMLHttpRequest();
xhr.open('GET', '../cards/packets.json');
xhr.overrideMimeType('text/json');
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState > 3 && xhr.status==200) {
        packets = JSON.parse(xhr.responseText);
        
        xhr.open('GET', '../cards/other.json');
        xhr.overrideMimeType('text/json');
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status==200) {
                otherCards = JSON.parse(xhr.responseText)
                showPackets();
            }
        }
    }
}

function showRoles(packet, index) {
    document.getElementById('choose-packet').className = 'hidden';
    document.getElementById('choose-role').className = '';
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

    var notes = new Set();
    while (notes.size < 2) {
        notes.add(Math.floor(Math.random() * otherCards['notes']))
    }

    var ul = document.getElementById('notes');
    ul.className = '';
    notes.forEach(function (note) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (suspect) { return function () {
            var li = this.parentNode;
            var notes = li.parentNode.childNodes;
            console.log(notes);
            for (var i = notes.length-1; i >=0; --i) {
                if (notes[i] != li) li.parentNode.removeChild(notes[i]);
            }
        }; }(note);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/notes/' + note + '.png';
        ul.appendChild(li);
    });
}
