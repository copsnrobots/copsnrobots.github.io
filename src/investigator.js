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
            hide(document.getElementById('suspect-id'));
            unhide(document.getElementById('select-suspect'));
            document.getElementById('penalty-id').innerHTML = 'Interview #' + encode(Array.from(penalties));
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
            console.log(params);
            if (params[0] < otherCards['penalties']
                && params[1] < packetList.length
                && params[2] < otherCards['notes']
                && penalties.has(params[0])
            ) {
                hide(document.getElementById('select-suspect'));
                var ul = document.getElementById('penalties');
                for (var i = ul.children.length-1; i >= 0; --i) {
                    if (ul.children[i].id !== 'penalty-'+params[0]) ul.removeChild(ul.children[i])
                }
                document.getElementById('suspect-id').appendChild(document.createTextNode('Suspect #'+n));
                showSuspect(params[2]);
                showPrompts(packetList[params[1]]);
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

function showPrompts(packet) {
}
