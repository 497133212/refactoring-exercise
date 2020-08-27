function calculateTragedyThisAmount(thisAmount, audience) {
    thisAmount = 40000;
    if (audience > 30) {
        thisAmount += 1000 * (audience - 30);
    }
    return thisAmount;
}

function calculateComedyThisAmount(thisAmount, audience) {
    thisAmount = 30000;
    if (audience > 20) {
        thisAmount += 10000 + 500 * (audience - 20);
    }
    thisAmount += 300 * audience;
    return thisAmount;
}

function switchPlayType(play, thisAmount, perf) {
    switch (play.type) {
        case 'tragedy':
            thisAmount = calculateTragedyThisAmount(thisAmount, perf.audience);
            break;
        case 'comedy':
            thisAmount = calculateComedyThisAmount(thisAmount, perf.audience);
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function usdFormat(thisAmount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(thisAmount / 100);
}


function calculateThisAmount(invoice, plays, perf) {
    let thisAmount = 0;
    thisAmount = switchPlayType(plays[perf.playID], thisAmount, perf);
    return thisAmount;
}

function calculateTotalAmount(invoice, plays) {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
        let thisAmount = calculateThisAmount(invoice, plays, perf)
        totalAmount += thisAmount;
    }
    return totalAmount;
}

function calculateVolumeCredits(invoice, plays) {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        volumeCredits += Math.max(perf.audience - 30, 0);
        if ('comedy' === plays[perf.playID].type) volumeCredits += Math.floor(perf.audience / 5);
    }
    return volumeCredits;
}

function createStatementData(invoice, plays) {
    let data = {};
    data.customer = invoice.customer;
    for (let perf of invoice.performances) {
        perf.play = plays[perf.playID];
        perf.amount = calculateThisAmount(invoice, plays, perf);
    }
    data.performances = invoice.performances;
    data.totalAmount = calculateTotalAmount(invoice, plays);
    data.totalVolumeCreadits = calculateVolumeCredits(invoice, plays);
    return data;
}

function printResult(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usdFormat(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usdFormat(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCreadits} credits \n`;
    return result;
}

function generateHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += '<table>\n';
    result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
    for(let perf of data.performances) {
        result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${usdFormat(perf.amount)}</td></tr>\n`;
    }
    result += '</table>\n';
    result += `<p>Amount owed is <em>${usdFormat(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCreadits}</em> credits</p>\n`;
    return result;
}

function statement(invoice, plays) {
    return printResult(createStatementData(invoice, plays));
}


function createHtmlStatement(invoice, plays) {
    return generateHtml(createStatementData(invoice, plays));
}

module.exports = {
    statement,
    createHtmlStatement
};
