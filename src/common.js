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

var packets;
var otherCards;
function initialize(func) {
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
                    document.getElementById('loading').className = 'hidden';
                    otherCards = JSON.parse(xhr.responseText)
                    func();
                }
            }
        }
    }
}
