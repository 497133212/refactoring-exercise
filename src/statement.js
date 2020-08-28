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

function switchPlayType(play, thisAmount, performance) {
    switch (play.type) {
        case 'tragedy':
            thisAmount = calculateTragedyThisAmount(thisAmount, performance.audience);
            break;
        case 'comedy':
            thisAmount = calculateComedyThisAmount(thisAmount, performance.audience);
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


function calculateThisAmount(invoice, plays, performance) {
    let thisAmount = 0;
    thisAmount = switchPlayType(plays[performance.playID], thisAmount, performance);
    return thisAmount;
}

function calculateTotalAmount(invoice, plays) {
    let totalAmount = 0;
    for (let performance of invoice.performances) {
        let thisAmount = calculateThisAmount(invoice, plays, performance)
        totalAmount += thisAmount;
    }
    return totalAmount;
}

function calculateVolumeCredits(invoice, plays) {
    let volumeCredits = 0;
    for (let performance of invoice.performances) {
        volumeCredits += Math.max(performance.audience - 30, 0);
        if ('comedy' === plays[performance.playID].type) volumeCredits += Math.floor(performance.audience / 5);
    }
    return volumeCredits;
}

function createStatementData(invoice, plays) {
    let data = {};
    data.customer = invoice.customer;
    for (let performance of invoice.performances) {
        performance.play = plays[performance.playID];
        performance.amount = calculateThisAmount(invoice, plays, performance);
    }
    data.performances = invoice.performances;
    data.totalAmount = calculateTotalAmount(invoice, plays);
    data.totalVolumeCreadits = calculateVolumeCredits(invoice, plays);
    return data;
}

function printResult(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let performance of data.performances) {
        result += ` ${performance.play.name}: ${usdFormat(performance.amount)} (${performance.audience} seats)\n`;
    }
    result += `Amount owed is ${usdFormat(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCreadits} credits \n`;
    return result;
}

function generateHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += '<table>\n';
    result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
    for(let performance of data.performances) {
        result += ` <tr><td>${performance.play.name}</td><td>${performance.audience}</td>`;
        result += `<td>${usdFormat(performance.amount)}</td></tr>\n`;
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
