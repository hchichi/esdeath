const $ = new Env('IP Info');
const emojis = ['🆘','🈲','⚠️','🔞','📵','🚦','🏖','🖥','📺','🐧','🐬','🦉','🍄','⛳️','🚴','🤑','👽','🤖','🎃', '👺', '👁', '🐶', '🐼','🐌', '👥'];
const weatherEmojis = ['☀️','🌤','⛅️','🌥','☁️','🌦','🌧','⛈','🌩','🌨','❄️','🌬','💨','🌪','🌫','🌊','🌁'];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomEmoji(emojiList) {
  return emojiList[getRandomInt(emojiList.length)];
}

const flags = new Map([["AC","🇦🇨"],["AE","🇦🇪"],["AF","🇦🇫"],["AI","🇦🇮"],["AL","🇦🇱"],["AM","🇦🇲"],["AQ","🇦🇶"],["AR","🇦🇷"],["AS","🇦🇸"],["AT","🇦🇹"],["AU","🇦🇺"],["AW","🇦🇼"],["AX","🇦🇽"],["AZ","🇦🇿"],["BA","🇧🇦"],["BB","🇧🇧"],["BD","🇧🇩"],["BE","🇧🇪"],["BF","🇧🇫"],["BG","🇧🇬"],["BH","🇧🇭"],["BI","🇧🇮"],["BJ","🇧🇯"],["BM","🇧🇲"],["BN","🇧🇳"],["BO","🇧🇴"],["BR","🇧🇷"],["BS","🇧🇸"],["BT","🇧🇹"],["BV","🇧🇻"],["BW","🇧🇼"],["BY","🇧🇾"],["BZ","🇧🇿"],["CA","🇨🇦"],["CF","🇨🇫"],["CH","🇨🇭"],["CK","🇨🇰"],["CL","🇨🇱"],["CM","🇨🇲"],["CN","🇨🇳"],["CO","🇨🇴"],["CP","🇨🇵"],["CR","🇨🇷"],["CU","🇨🇺"],["CV","🇨🇻"],["CW","🇨🇼"],["CX","🇨🇽"],["CY","🇨🇾"],["CZ","🇨🇿"],["DE","🇩🇪"],["DG","🇩🇬"],["DJ","🇩🇯"],["DK","🇩🇰"],["DM","🇩🇲"],["DO","🇩🇴"],["DZ","🇩🇿"],["EA","🇪🇦"],["EC","🇪🇨"],["EE","🇪🇪"],["EG","🇪🇬"],["EH","🇪🇭"],["ER","🇪🇷"],["ES","🇪🇸"],["ET","🇪🇹"],["EU","🇪🇺"],["FI","🇫🇮"],["FJ","🇫🇯"],["FK","🇫🇰"],["FM","🇫🇲"],["FO","🇫🇴"],["FR","🇫🇷"],["GA","🇬🇦"],["GB","🇬🇧"],["HK","🇭🇰"],["HU","🇭🇺"],["ID","🇮🇩"],["IE","🇮🇪"],["IL","🇮🇱"],["IM","🇮🇲"],["IN","🇮🇳"],["IS","🇮🇸"],["IT","🇮🇹"],["JP","🇯🇵"],["KR","🇰🇷"],["LU","🇱🇺"],["MO","🇲🇴"],["MX","🇲🇽"],["MY","🇲🇾"],["NL","🇳🇱"],["PH","🇵🇭"],["RO","🇷🇴"],["RS","🇷🇸"],["RU","🇷🇺"],["RW","🇷🇼"],["SA","🇸🇦"],["SB","🇸🇧"],["SC","🇸🇨"],["SD","🇸🇩"],["SE","🇸🇪"],["SG","🇸🇬"],["TH","🇹🇭"],["TN","🇹🇳"],["TO","🇹🇴"],["TR","🇹🇷"],["TV","🇹🇻"],["TW","🇨🇳"],["UK","🇬🇧"],["UM","🇺🇲"],["US","🇺🇸"],["UY","🇺🇾"],["UZ","🇺🇿"],["VA","🇻🇦"],["VE","🇻🇪"],["VG","🇻🇬"],["VI","🇻🇮"],["VN","🇻🇳"],["ZA","🇿🇦"]]);

if ($response.statusCode != 200) {
  $done(null);
}

const body = JSON.parse($response.body);
const ip = body.ip;

$httpClient.get(`https://ipapi.is/json/${ip}`, function(error, response, data){
  if (error) {
    $done({title: 'Error', subtitle: 'Failed to fetch IP info', ip: ip});
  } else {
    const obj = JSON.parse(data);
    const randomWeatherEmoji = getRandomEmoji(weatherEmojis);
    
    let title = `${flags.get(obj.location.country_code)} | ${obj.location.city}, ${obj.location.state}`;
    let subtitle = `${randomWeatherEmoji} | ASN ${obj.asn.asn} · ${obj.asn.org}`;
    
    let risks = [];
    if (obj.is_datacenter) risks.push("DC");
    if (obj.is_tor) risks.push("TOR");
    if (obj.is_proxy) risks.push("PROXY");
    if (obj.is_vpn) risks.push("VPN");
    if (obj.is_abuser) risks.push("ABUSER");
    
    let riskString = risks.length > 0 ? '| ' + risks.join(' | ') : '';
    
    let description = `IP: ${obj.ip} (${obj.asn.rir})
ASN: ${obj.asn.asn} · ${obj.asn.org}
RISK: ${obj.company.abuser_score.split(' ')[1]} ${riskString}`;
    
    $done({title, subtitle, ip: obj.ip, description});
  }
});
