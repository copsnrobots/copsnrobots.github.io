function showPenalties () {
    document.getElementById('investigator').className = '';
    var ul = document.getElementById('penalties');
    ul.className = '';
    var penalties = choose(3, otherCards['penalties']);
    penalties.forEach(function (penalty) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        li.appendChild(link);
        link.onclick = function (penalty) { return function () {
            var ul = this.parentNode.parentNode;
            ul.removeChild(this.parentNode);
            penalties.delete(penalty);
            for (var i = 0; i < ul.childNodes.length; ++i) {
                ul.childNodes[i].onclick = undefined;
            }
            document.getElementById('penalty-id').innerHTML = 'Interview #' + encode(Array.from(penalties));
            document.getElementById('select-suspect').className = '';
        }; }(penalty);
        var img = document.createElement('img');
        link.appendChild(img);
        img.src = '../cards/penalties/' + penalty + '.png';
        ul.appendChild(li);
    });

}

initialize(showPenalties);

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

    document.getElementById('suspect-id-error').className = '';
}

function showSuspect(suspect, suspectId) {
    document.getElementById('select-suspect').onsubmit = undefined;
    document.getElementById('suspect-id-input').className = 'hidden';
    document.getElementById('suspect-id-submit').className = 'hidden';
    document.getElementById('suspect-id').appendChild(document.createTextNode('Suspect #'+suspectId));
    var img = document.getElementById('suspect-note');
    img.src = '../cards/notes/'+suspect+'.png';
    img.className = ''

}
