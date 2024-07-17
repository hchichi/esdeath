if ($response.statusCode !== 200) {
  $done(null);
}
const emojis = ['🆘', '🈲', '⚠️', '🔞', '📵', '🚦', '🏖', '🖥', '📺', '🐧', '🐬', '🦉', '🍄', '⛳️', '🚴', '🤑', '👽', '🤖', '🎃', '👺', '👁', '🐶', '🐼', '🐌', '👥'];
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function ValidCheck(para) {
  return para ? para : emojis[getRandomInt(emojis.length)];
}
const flags = new Map([
  ["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"], ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧urkina Faso"], ["BG", "🇧ulgaria"], ["BH", "🇧🇭"], ["BI", "🇧🇮"], ["BJ", "🇧🇯"], ["BM", "🇧ermuda"], ["BN", "🇧runei"], ["BO", "🇧olivia"], ["BR", "🇧razil"], ["BS", "🇧ahamas"], ["BT", "🇧hutan"], ["BV", "🇧ouvet Island"], ["BW", "🇧otswana"], ["BY", "🇧elarus"], ["BZ", "🇧elize"], ["CA", "🇨anada"], ["CF", "🇨entral African Republic"], ["CH", "🇨witzerland"], ["CK", "🇨ook Islands"], ["CL", "🇨hile"], ["CM", "🇨ameroon"], ["CN", "🇨hina"], ["CO", "🇨olombia"], ["CP", "🇨lipperton Island"], ["CR", "🇨osta Rica"], ["CU", "🇨uba"], ["CV", "🇨ape Verde"], ["CW", "🇨uracao"], ["CX", "🇨hristmas Island"], ["CY", "🇨yprus"], ["CZ", "🇨zech Republic"], ["DE", "🇩ermany"], ["DG", "🇩iego Garcia"], ["DJ", "🇩jibouti"], ["DK", "🇩enmark"], ["DM", "🇩ominica"], ["DO", "🇩ominican Republic"], ["DZ", "🇩zmir"], ["EA", "🇪a"], ["EC", "🇪cuador"], ["EE", "🇪stonia"], ["EG", "🇪gypt"], ["EH", "🇪estern Sahara"], ["ER", "🇪ritrea"], ["ES", "🇪pain"], ["ET", "🇪thiopia"], ["EU", "🇪uropean Union"], ["FI", "🇫inland"], ["FJ", "🇫iji"], ["FK", "🇫alkland Islands"], ["FM", "🇫ederated States of Micronesia"], ["FO", "🇫aroe Islands"], ["FR", "🇫rance"], ["GA", "🇬abon"], ["GB", "🇬reat Britain"], ["HK", "🇭ong Kong"], ["HU", "🇭ungary"], ["ID", "🇮ndonesia"], ["IE", "🇮reland"], ["IL", "🇮srael"], ["IM", "🇮sle of Man"], ["IN", "🇮ndia"], ["IS", "🇮celand"], ["IT", "🇮taly"], ["JP", "🇯apan"], ["KR", "🇰orea"], ["LU", "🇱uxembourg"], ["MO", "🇲acau"], ["MX", "🇲exico"], ["MY", "🇲alaysia"], ["NL", "🇳etherlands"], ["PH", "🇵hilippines"], ["RO", "🇷omania"], ["RS", "🇷ussia"], ["RU", "🇷ussia"], ["RW", "🇷wanda"], ["SA", "🇸audi Arabia"], ["SB", "🇸olomon Islands"], ["SC", "🇸eychelles"], ["SD", "🇸udan"], ["SE", "🇸weden"], ["SG", "🇸ingapore"], ["TH", "🇹hailand"], ["TN", "🇹unisia"], ["TO", "🇹onga"], ["TR", "🇹urkey"], ["TV", "🇹uvalu"], ["TW", "🇹aiwan"], ["UK", "🇬reat Britain"], ["UM", "🇺nited States Minor Outlying Islands"], ["US", "🇺nited States"], ["UY", "🇺ruguay"], ["UZ", "🇺zbekistan"], ["VA", "🇻atican City"], ["VE", "🇻enezuela"], ["VG", "🇻irgin Islands"], ["VI", "🇻irgin Islands"], ["VN", "🇻ietnam"], ["ZA", "🇿outh Africa"]
]);
var body = $response.body;
var obj = JSON.parse(body);
var countryFlag = flags.get(obj['country']) || '';
// 修改title的逻辑
var title = `${countryFlag} | ${obj['colo']}, ${ValidCheck(obj['city'])}`;
// 修改subtitle的逻辑
var asn = obj['asn'];
var asOrganization = obj['asOrganization'];
var subtitle = `${emojis[getRandomInt(emojis.length)]} ASN${asn} ${asOrganization}`;
// 修改description的逻辑
var description = `IP: ${obj['clientIp']}
GEO: ${ValidCheck(obj['city'])}, ${obj['country']}
ASN: ${asn}
ORG: ${asOrganization}`;
$done({ title, subtitle, ip: obj['clientIp'], description });