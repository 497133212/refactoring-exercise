const COMEDY = 'comedy';
const TRAGEDY = 'tragedy';

function calculateTragedyThisAmount(thisAmount, perf) {
    thisAmount = 40000;
    if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
    }
    return thisAmount;
}

function calculateComedyThisAmount(thisAmount, perf) {
    thisAmount = 30000;
    if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
    }
    thisAmount += 300 * perf.audience;
    return thisAmount;
}

function switchPlayType(play, thisAmount, perf) {
    switch (play.type) {
        case TRAGEDY:
            thisAmount = calculateTragedyThisAmount(thisAmount, perf);
            break;
        case COMEDY:
            thisAmount = calculateComedyThisAmount(thisAmount, perf);
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function usdFomfat() {
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
    return format;
}

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = usdFomfat();
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        thisAmount = switchPlayType(play, thisAmount, perf);
        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees

        if (COMEDY === play.type) volumeCredits += Math.floor(perf.audience / 5);
        //print line for this order
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result;
}

module.exports = {
    statement,
};
