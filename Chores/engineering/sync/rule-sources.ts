import { RuleGroup, SpecialRuleConfig } from './rule-types.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const REPO_PATH = path.join(__dirname, '../../..');

export const ruleGroups: RuleGroup[] = [
  {
    name: 'GeoIP',
    files: [
      {
        path: 'GeoIP/CN_Country.mmdb',
        url: 'https://raw.githubusercontent.com/Masaiki/GeoIP2-CN/release/Country.mmdb',
      },
      {
        path: 'GeoIP/Global_Country.mmdb',
        url: 'https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb',
      },
      {
        path: 'GeoIP/IPInfo_Country.mmdb',
        url: 'https://github.com/xream/geoip/releases/latest/download/ipinfo.country.mmdb',

      },
      {
        path: 'GeoIP/IP2Location_Country.mmdb',
        url: 'https://github.com/xream/geoip/releases/latest/download/ip2location.country.mmdb',
      }
    ]
  },
  {
    name: 'Apple',
    files: [
      {
        path: 'Surge/Ruleset/Apple/APNs.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/ApplePushNotificationService.list',
      },
      {
        path: 'Surge/Ruleset/Apple/Apple.list',
        url: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Apple.list',
      },
      {
        path: 'Surge/Ruleset/Apple/AppStore.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/AppStore/AppStore.list',
      },
      {
        path: 'Surge/Ruleset/Apple/AppleID.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleID/AppleID.list',
      },
      {
        path: 'Surge/Ruleset/Apple/AppleMusic.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleMusic/AppleMusic.list',
      },
      {
        path: 'Surge/Ruleset/Apple/iCloud.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/iCloud/iCloud.list',
      },
      {
        path: 'Surge/Ruleset/Apple/TestFlight.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/TestFlight/TestFlight.list',
      },
      {
        path: 'Surge/Ruleset/Apple/AppleProxy.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleProxy/AppleProxy.list',
      },
      {
        path: 'Surge/Ruleset/Apple/AppleMedia.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleMedia/AppleMedia.list',
      }
    ]
  },
  {
    name: 'AI',
    files: [
      {
        path: 'Surge/Ruleset/AI/AI.list',
        url: 'https://ruleset.skk.moe/List/non_ip/ai.conf',
      },
      {
        path: 'Surge/Ruleset/AI/AI_KELI.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/AI.list',
      },
      {
        path: 'Surge/Ruleset/AI/AI_ConnersHua.list',
        url: 'https://github.com/ConnersHua/RuleGo/raw/master/Surge/Ruleset/Extra/AI.list',
      },
      {
        path: 'Surge/Ruleset/AI/AI_Hiven.list',
        url: 'https://raw.githubusercontent.com/hiven425/hiven/master/config/AI.list',
      }
    ]
  },
  {
    name: 'Streaming',
    files: [
      {
        path: 'Surge/Ruleset/Streaming/Video/Netflix.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Netflix.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Disney.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Disney/Disney.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/Music/Spotify.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/PrimeVideo.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PrimeVideo/PrimeVideo.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Bahamut.list',
        url: 'https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Ruleset/Bahamut.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/ProxyMedia.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyMedia.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/YouTube.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/YouTube.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/GlobalMedia.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/GlobalMedia.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/Music/NeteaseMusic.list',
        url: 'https://ruleset.skk.moe/List/non_ip/neteasemusic.conf',
      },
      {
        path: 'Surge/Ruleset/Streaming/Music/NeteaseMusic_NoIP.list',
        url: 'https://ruleset.skk.moe/List/ip/neteasemusic.conf',
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Emby.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Emby.list',
        description: 'This file contains rules for EmbyServer.'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/EmbyTest.list',
        url: 'https://github.com/1120109856/lynn/raw/main/fxw',
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/EmbyTest2.list',
        url: 'https://github.com/1120109856/lynn/raw/main/zl',
        description: 'This file contains test rules for EmbyServer.'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/BiliBiliIntl.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/BiliBiliIntl/BiliBiliIntl.list',

      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Bilibili.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bilibili.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/TikTok.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/TikTok.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/CN.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Streaming/CN.list',
      },
      {
        path: 'Surge/Ruleset/Streaming/!CN.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Streaming/!CN.list',
      }
    ]
  },
  {
    name: 'Reject',
    files: [
      {
        path: 'Surge/Ruleset/Reject/Advertising.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Reject/Advertising.list',
      },
      {
        path: 'Surge/Ruleset/Reject/Malicious.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Reject/Malicious.list',
      },
      {
        path: 'Surge/Ruleset/Reject/Tracking.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Reject/Tracking.list',
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_fmz200.list',
        url: 'https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/filter/fenliu.list',
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW.list',
        url: 'https://ruleset.skk.moe/List/domainset/reject.conf',
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW_NoIP.list',
        url: 'https://ruleset.skk.moe/List/non_ip/reject.conf',
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW_Extra.list',
        url: 'https://ruleset.skk.moe/List/domainset/reject_extra.conf',
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW_IP.list',
        url: 'https://ruleset.skk.moe/List/ip/reject.conf',
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_limbopro.list',
        url: 'https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adblock4limbo_surge.list',
      }
    ]
  },
  {
    name: 'Direct',
    files: [
      {
        path: 'Surge/Ruleset/Direct/Direct_fmz200.list',
        url: 'https://github.com/fmz200/wool_scripts/raw/main/QuantumultX/filter/fenliuxiuzheng.list',
      },
      {
        path: 'Surge/Ruleset/Direct/Direct_Sukkaw.list',
        url: 'https://ruleset.skk.moe/List/non_ip/direct.conf',
      },
      {
        path: 'Surge/Ruleset/Direct/MyDirect_Sukkaw.list',
        url: 'https://ruleset.skk.moe/List/non_ip/my_direct.conf',
      }
    ]
  },
  {
    name: 'Anti',
    files: [
      {
        path: 'Surge/Ruleset/Anti/Direct.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/generated/rule-set-direct.list',
        title: 'DIRECT (Anti-IP Attribution)',
        description: 'Anti IP attribution direct rules',
        header: {
          enable: true  // 明确启用 header
        } 
      },
      {
        path: 'Surge/Ruleset/Anti/Proxy.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/generated/rule-set-proxy.list',
        title: 'PROXY (Anti-IP Attribution)',
        description: 'Anti IP attribution proxy rules',
        header: {
          enable: true  // 明确启用 header
        } 
      },
      {
        path: 'Surge/Ruleset/Anti/Reject.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/generated/rule-set-reject.list',
        title: 'REJECT (Anti-IP Attribution)',
        description: 'Anti IP attribution reject rules',
        header: {
          enable: true  // 明确启用 header
        } 
      }
    ]
  },
  {
    name: 'Domestic',
    files: [
      {
        path: 'Surge/Ruleset/Domestic/WeChat.list',
        url: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/WeChat.list',
      },
      {
        path: 'Surge/Ruleset/ChinaDomain.list',
        url: 'https://ruleset.skk.moe/List/non_ip/domestic.conf',
      },
      {
        path: 'Surge/Ruleset/Domestic_Sukkaw_NoIP.list',
        url: 'https://ruleset.skk.moe/List/non_ip/domestic.conf',
      },
      {
        path: 'Surge/Ruleset/Domestic_Sukkaw_IP.list',
        url: 'https://ruleset.skk.moe/List/ip/domestic.conf',
      },
      {
        path: 'Surge/Ruleset/Domestic_Sukkaw_Direct.list',
        url: 'https://ruleset.skk.moe/List/non_ip/direct.conf',
      },
      {
        path: 'Surge/Ruleset/China.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/China/China.list',
      },
      {
        path: 'Surge/Ruleset/Domestic/ChinaMax.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ChinaMax/ChinaMax.list',
      },
      {
        path: 'Surge/Ruleset/Domestic.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/Domestic.list',
      },
    ]
  },
  {
    name: 'CDN',
    files: [
      {
        path: 'Surge/Ruleset/CDN/DownloadCDN_Global.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/InternationalDownloadCDN.list',
      },
      {
        path: 'Surge/Ruleset/CDN/DownloadCDN_CN.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/ChinaDownloadCDN.list',
      },
      {
        path: 'Surge/Ruleset/CDN/CDN.list',
        url: 'https://ruleset.skk.moe/List/domainset/cdn.conf',
      },
      {
        path: 'Surge/Ruleset/CDN/CDN_NoIP.list',
        url: 'https://ruleset.skk.moe/List/non_ip/cdn.conf',
      },
      {
        path: 'Surge/Ruleset/CDN/CDN_IP.list',
        url: 'https://ruleset.skk.moe/List/ip/cdn.conf',
      }
    ]
  },
  {
    name: 'IPCIDR',
    files: [
      {
        path: 'Surge/Ruleset/ChinaIP_Sukkaw.list',
        url: 'https://ruleset.skk.moe/List/ip/china_ip.conf',
      },
      {
        path: 'Surge/Ruleset/ChinaIP.list',
        url: 'https://raw.githubusercontent.com/DH-Teams/DH-Geo_AS_IP_CN/main/Geo_AS_IP_CN.txt',
        title: '🌐 IPv4+IPv6 China Rules by DH',
        description: '匹配中国大陆IPv4和IPv6的域名与IP全部直连'
      },
      {
        path: 'Surge/Ruleset/ChinaIPv4.DH.list',
        url: 'https://raw.githubusercontent.com/DH-Teams/DH-Geo_AS_IP_CN/main/Geo_AS_IP_CN_V4_Surge.list',
        title: '🌐 IPv4 China Rules by DH',
        description: '匹配中国大陆IPv4的域名与IP全部直连'
      },
      {
        path: 'Surge/Ruleset/ChinaASN.Fries.list',
        url: 'https://raw.githubusercontent.com/VirgilClyne/GetSomeFries/main/ruleset/ASN.China.list',
      },
      {
        path: 'Surge/Ruleset/ChinaASN.missuo.list',
        url: 'https://raw.githubusercontent.com/missuo/ASN-China/main/ASN.China.list',
        title: '🌐 ASN China Rules by Missuo',
        description: '匹配中国大陆ASN的域名与IP全部直连'
      },
      {
        path: 'Surge/Ruleset/ChinaASN.DH.list',
        url: 'https://raw.githubusercontent.com/DH-Teams/DH-Geo_AS_IP_CN/main/Geo_AS_CN.list',
        title: '🌐 ASN China Rules by DH',
        description: '匹配中国大陆ASN的域名与IP全部直连'
      }
    ]
  },
  {
    name: 'Lan',
    files: [
      {
        path: 'Surge/Ruleset/Lan.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/Special/Local-LAN.list',
      }
    ]
  },
  {
    name: 'Social',
    files: [
      {
        path: 'Surge/Ruleset/Social/Twitter.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Twitter.list',
      },
      {
        path: 'Surge/Ruleset/Social/Instagram.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Instagram.list',
      },
      {
        path: 'Surge/Ruleset/Social/Facebook.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Facebook.list',
      },
      {
        path: 'Surge/Ruleset/Telegram.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Telegram.list',
      }
    ]
  },
  {
    name: 'Extra',
    files: [
      {
        path: 'Surge/Ruleset/Extra/Direct.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Direct.list',
      },
      {
        path: 'Surge/Ruleset/Extra/Reject.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Reject.list',
      },
      {
        path: 'Surge/Ruleset/Extra/Proxy.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Proxy.list',
      },
      {
        path: 'Surge/Ruleset/Extra/Prevent_DNS_Leaks.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Prevent_DNS_Leaks.list',
      }
    ]
  },
  {
    name: 'GFW',
    files: [
      {
        path: 'Surge/Ruleset/Blocked.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list',
      },
      /** 
      {
        path: 'Surge/Ruleset/ProxyLite_ACL4SSR.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyLite.list',
      },
      */
      {
        path: 'Surge/Ruleset/ProxyLite.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ProxyLite/ProxyLite.list',
      },
      {
        path: 'Surge/Ruleset/Foreign.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/PROXY.list',
      },
      {
        path: 'Surge/Ruleset/Proxy.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Proxy/Proxy.list',
      },
      {
        path: 'Surge/Ruleset/Global.list',
        url: 'https://github.com/Tartarus2014/For-own-use/raw/master/Ruleset/Proxy.list',
      }
    ]
  },
  {
    name: 'Google',
    files: [
      {
        path: 'Surge/Ruleset/Google/Google.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Google.list',
      }
    ]
  },
  {
    name: 'Microsoft',
    files: [
      {
        path: 'Surge/Ruleset/Microsoft/Github.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Github.list',
      },
      {
        path: 'Surge/Ruleset/Microsoft/Microsoft.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Microsoft.list',
      }
    ]
  },
];

// Special rules configuration
export const specialRules: SpecialRuleConfig[] = [
  {
    name: 'SukkaW Ads',
    targetFile: 'Surge/Ruleset/Reject/Ads_SukkaW_Combined.list',
    sourceFiles: [
      'Surge/Ruleset/Reject/Ads_SukkaW.list',
      'Surge/Ruleset/Reject/Ads_SukkaW_NoIP.list',
      'Surge/Ruleset/Reject/Ads_SukkaW_Extra.list'
    ],
    cleanup: true,
    header: {
      enable: true,  // 明确启用 header
      title: 'SukkaW Ads Reject Rules (Combined)',
      description: 'This file contains rules for advertising, privacy protection, malware, and phishing.'
    }
  },
  {
    name: 'Emby',
    targetFile: 'Surge/Ruleset/Streaming/Video/EmbyTest.list',
    sourceFiles: [
      'Surge/Ruleset/Streaming/Video/EmbyTest.list',
      'Surge/Ruleset/Streaming/Video/EmbyTest2.list'
    ],
    cleanup: true,
    header: {
      enable: true,  // 明确启用 header
      title: 'EMBY (FOR TESTING ONLY)',
      description: 'This file contains EMBY testing rules.'
    }
  },
  {
    name: 'CDN',
    targetFile: 'Surge/Ruleset/CDN/CDN.list',
    sourceFiles: [
      'Surge/Ruleset/CDN/CDN.list',  // domain-set
      'Surge/Ruleset/CDN/CDN_NoIP.list',
      'Surge/Ruleset/CDN/CDN_IP.list'
    ],
    cleanup: true,
    header: {
      enable: true,  // 明确启用 header
      title: 'CDN',
      description: 'This file contains rules for common static CDNs.'
    }
  },
  {
    name: 'Reject',
    targetFile: 'Surge/Ruleset/Reject/Reject.list',
    sourceFiles: [
      'Surge/Ruleset/Reject/Advertising.list',
      'Surge/Ruleset/Reject/Malicious.list',
      'Surge/Ruleset/Reject/Tracking.list'
    ],
    cleanup: true,
    header: {
      enable: true,  // 明确启用 header
      title: 'REJECT',
      description: 'This file contains rules for advertising, hijacking, and tracking.'
    }
  },
  {
    name: 'AI',
    targetFile: 'Surge/Ruleset/AI.list',
    sourceFiles: [
      'Surge/Ruleset/AI/AI_KELI.list',
      'Surge/Ruleset/AI/AI_ConnersHua.list',
      'Surge/Ruleset/AI/AI_Hiven.list'
    ],
    extraRules: ['DOMAIN-SUFFIX,openrouter.ai'],
    cleanup: true,
    header: {
      title: 'AIGC',
      description: 'This file contains rules for AIGC services, including OpenAI, Google Gemini, Claude, Perplexity, etc.'
    }
  },

  {
    name: 'NeteaseMusic',
    targetFile: 'Surge/Ruleset/Streaming/Music/NeteaseMusic.list',
    sourceFiles: [
      'Surge/Ruleset/Streaming/Music/NeteaseMusic_NoIP.list'
    ],
    cleanup: true,
    header: {
      title: '网易云音乐',
    }
  },
  {
    name: 'Domestic_Sukkaw',
    targetFile: 'Surge/Ruleset/Domestic/Domestic_Sukkaw.list',
    sourceFiles: [
      'Surge/Ruleset/Domestic_Sukkaw_NoIP.list',
      'Surge/Ruleset/Domestic_Sukkaw_IP.list',
      'Surge/Ruleset/Domestic_Sukkaw_Direct.list'
    ],
    cleanup: true,  // 启用清理和排序
    header: {
      enable: true,  // 启用头部信息
      title: 'Domestic Rules (Sukkaw)',
      description: 'This file contains known domains and IPs that are avaliable in the Mainland China.'
    }
  }
];

export const config = {
  repoPath: REPO_PATH,
  defaultFormat: 'Surge' as const,
  cleanup: false,
  stats: true,
  ipRules: {
    generateResolveVersion: false,
    resolveVersionSuffix: '_Resolve'
  }
}; 