function showPenalties () {
    unhide(document.getElementById('investigator'));
    var ul = document.getElementById('penalties');
    unhide(ul);
    var penalties = choose(3, otherCards['penalties']);
    penalties.forEach(function (penalty) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (penalty) { return function () {
            var ul = this.parentNode.parentNode;
            ul.removeChild(this.parentNode);
            penalties.delete(penalty);
            for (var i = 0; i < ul.children.length; ++i) {
                ul.children[i].firstChild.onclick = undefined;
            }
            document.getElementById('penalty-id').innerHTML = '';
            showPackets(Array.from(penalties));
        }; }(penalty);
        var img = document.createElement('img');
        link.appendChild(img);
        img.src = '../cards/penalties/' + penalty + '.png';
        ul.appendChild(li);
    });

}

initialize(showPenalties);

function showPackets(penalties) {
    var ul = document.getElementById('packets');
    for (var packet in packets) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (packet) { return function () {
            penalties.unshift(packets[packet]['index']);
            unhide(document.getElementById('select-suspect'));
            document.getElementById('penalty-id').innerHTML = 'Interview #' + encode(penalties);
        }; }(packet);
        var img = document.createElement('img');
        link.appendChild(img)
        img.src = '../cards/' + packet + '/investigator/primary-back.png';
        img.alt = packet;
        img.title = packets[packet]['description'];
        ul.appendChild(li);
    }
}

function showSuspectId () {
    document.getElementById('suspect-id-input').focus();
}

function submitSuspectId () {
    var n = Number(document.getElementById('suspect-id-input').value);
    if (Number.isInteger(n) && n >= 10) {
        var suspect = decode(n);
        if (undefined !== suspect && suspect.length === 1) {
            console.log(suspect);
            suspect = suspect.shift();
            if (suspect < otherCards['notes']) {
                document.getElementById('select-suspect').className = 'hidden';
                showSuspect(suspect, n);
                return;
            }
        }
    }

    unhide(document.getElementById('suspect-id-error').className);
}

function showSuspect(suspect, suspectId) {
    document.getElementById('select-suspect').onsubmit = undefined;
    hide(document.getElementById('suspect-id-input'));
    hide(document.getElementById('suspect-id-submit'));
    document.getElementById('suspect-id').appendChild(document.createTextNode('Suspect #'+suspectId));
    var img = document.getElementById('suspect-note');
    img.src = '../cards/notes/'+suspect+'.png';
    img.className = ''

}
