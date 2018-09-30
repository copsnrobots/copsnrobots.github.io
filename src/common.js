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

var modulus = 27011;
var multiplier = 17468;
var inverse = 10968;
var limit = 30;

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
    n = (n*multiplier) % modulus;
    return luhn(n) + '' + n;
}

function decode(n) {
    n = String(n);
    var check = n[0];
    n = Number(n.slice(1));
    if (luhn(n) != check) return undefined;
    n *= inverse;
    n %= modulus;
    var arr = [];
    while (n > 0) {
        arr.unshift(n % (limit + 1) - 1);
        n = Math.floor(n / (limit+1));
    }
    return arr;
}

function choose (k, n) {
    var set = new Set();
    while (set.size < k) {
        set.add(Math.floor(Math.random() * n))
    }
    return set;
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
