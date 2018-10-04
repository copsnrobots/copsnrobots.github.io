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
        console.assert(Number.isInteger(arr[i]), arr);
        console.assert(0 <= arr[i], arr);
        console.assert(arr[i] < limit, arr);
        n += arr[i]+1;
    }
    console.assert(n < modulus);
    n = (n*multiplier) % modulus;
    return n + '' + luhn(n);
}

function decode(n) {
    var check = n[n.length-1];
    n = Number(n.slice(0, n.length-1));
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
var packetList = [];
function initialize(func) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../cards/packets.json');
    xhr.overrideMimeType('text/json');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status==200) {
            packets = JSON.parse(xhr.responseText);
            for (var packet in packets) {
                packets[packet]['name'] = packet;
                packetList[packets[packet]['index']] = packets[packet];
            }
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

function hide (node) {
    node.classList.add('hidden')
}

function unhide (node) {
    node.classList.remove('hidden')
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
    return {'img': img, 'li': li};
}


