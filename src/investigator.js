function showSuspectId () {
    document.getElementById('investigator').className = '';
    document.getElementById('suspect-id-input').focus();
}

initialize(showSuspectId)

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
