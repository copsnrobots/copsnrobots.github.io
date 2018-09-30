packet_ids = []
function showPackets () {
    var ul = document.getElementById('packets');
    for (var packet in packets) {
        packet_ids[packets[packet]['index']] = packet;
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (packet, index) { return function () {
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

function showRoles(packet) {
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
            this.onclick = undefined;
            showNotes(this.parentNode, packet, role);
        }; }(packet, card);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/' + packet + '/suspect/' + card + '.png';
        ul.appendChild(li);
    });
}

function luhn(n) {
    var d = 1;
    var sum = 0;
    while (n > 0) {
        digit = (n%10)*d;
        if (digit > 9) {
            digit = digit % 10;
            if (digit == 0) digit = 9;
        }
        sum += digit;
        n = Math.floor(n/10);
        d = d == 1 ? 2 : 1
    }
    return sum % 10;
}

var modulus = 12119;
var multiplier = 10468;
var inverse = 5887;
var limit = 100;

function encode(arr) {
    var n = 0;
    for (var i = 0; i < arr.length; ++i) {
        n *= limit+1;
        console.assert(Number.isInteger(arr[i]));
        console.assert(0 <= arr[i]);
        console.assert(arr[i] < limit);
        n += arr[i]+1;
    }
    console.assert(n < modulus);
    return luhn(n) + '' + (n*multiplier) % modulus;
}

function luhnify(n) {
    return luhn(n) + '' + n;
}

function decode(n) {
    var check = n[0];
    n = Number(n.slice(1));
    if (luhn(n) != check) return undefined;
    n *= inverse;
    var arr = [];
    while (n > 0) {
        arr.unshift(n % (limit + 1));
        n = Math.floor(n / (limit+1));
    }
    return arr;
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
            this.onclick = undefined;
            var li = this.parentNode;
            var notes = li.parentNode.childNodes;
            console.log(notes);
            for (var i = notes.length-1; i >=0; --i) {
                if (notes[i] != li) li.parentNode.removeChild(notes[i]);
            }
            document.getElementById('suspect-id').appendChild(
                document.createTextNode('Suspect #'+encode([suspect]))
            );
        }; }(note);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/notes/' + note + '.png';
        ul.appendChild(li);
    });
}
