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



function calculateCredits(invoice, plays, result) {
    let totalAmount = calculateTotalAmount(invoice, plays);
    let volumeCredits = calculateVolumeCredits(invoice, plays);
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = calculateThisAmount(invoice, plays,perf);
        result += ` ${play.name}: ${usdFormat(thisAmount)} (${perf.audience} seats)\n`;
    }
    return {volumeCredits, result, totalAmount};
}

function calculateThisAmount(invoice, plays,perf) {
    let thisAmount = 0;
    thisAmount = switchPlayType(plays[perf.playID], thisAmount, perf);
    return thisAmount;
}

function calculateTotalAmount(invoice, plays) {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
        let thisAmount = calculateThisAmount(invoice, plays,perf)
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


function printResult(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    const ret = calculateCredits(invoice, plays, result);
    ret.result += `Amount owed is ${usdFormat(ret.totalAmount)}\n`;
    ret.result += `You earned ${ret.volumeCredits} credits \n`;
    return ret.result;
}

function statement(invoice, plays) {
    return printResult(invoice, plays);
}

module.exports = {
    statement,
};
