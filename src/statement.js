const COMEDY = 'comedy';
const TRAGEDY = 'tragedy';

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
        case TRAGEDY:
            thisAmount = calculateTragedyThisAmount(thisAmount, perf.audience);
            break;
        case COMEDY:
            thisAmount = calculateComedyThisAmount(thisAmount, perf.audience);
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

function calculateCredits(invoice, plays, volumeCredits, result, format, totalAmount) {
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
    return {volumeCredits, result, totalAmount};
}

function printResult(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = usdFomfat();
    const ret = calculateCredits(invoice, plays, volumeCredits, result, format, totalAmount);
    ret.result += `Amount owed is ${format(ret.totalAmount / 100)}\n`;
    ret.result += `You earned ${ret.volumeCredits} credits \n`;
    return ret.result;
}

function statement(invoice, plays) {
    return printResult(invoice, plays);
}

module.exports = {
    statement,
};
