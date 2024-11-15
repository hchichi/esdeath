import { RuleGroup, SpecialRuleConfig } from './types';
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
        title: 'China GeoIP Database',
        description: 'GeoIP database for China regions'
      },
      {
        path: 'GeoIP/Global_Country.mmdb',
        url: 'https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb',
        title: 'Global GeoIP Database',
        description: 'Global GeoIP database'
      },
      {
        path: 'GeoIP/IPInfo_Country.mmdb',
        url: 'https://github.com/xream/geoip/releases/latest/download/ipinfo.country.mmdb',
        title: 'IPInfo Country Database',
        description: 'IPInfo country database'
      },
      {
        path: 'GeoIP/IP2Location_Country.mmdb',
        url: 'https://github.com/xream/geoip/releases/latest/download/ip2location.country.mmdb',
        title: 'IP2Location Country Database',
        description: 'IP2Location country database'
      }
    ]
  },
  /** 
  {
    name: 'CCC',
    files: [
      {
        path: 'Surge/Ruleset/CCC-Global/Akamai.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/CCC-Global/Akamai.list',
        title: 'Akamai Rules',
        description: 'Rules for Akamai CDN'
      },
      {
        path: 'Surge/Ruleset/CCC-Global/Amazon.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/CCC-Global/Amazon.list',
        title: 'Amazon Rules',
        description: 'Rules for Amazon services'
      },
      {
        path: 'Surge/Ruleset/CCC-Global/CloudFlare.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/CCC-Global/CloudFlare.list',
        title: 'CloudFlare Rules',
        description: 'Rules for CloudFlare CDN'
      },
      {
        path: 'Surge/Ruleset/CCC-Global/HiNet.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/CCC-Global/HiNet.list',
        title: 'HiNet Rules',
        description: 'Rules for HiNet services'
      },
      {
        path: 'Surge/Ruleset/CCC-Global/VerizonMediaPlatform.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/CCC-Global/VerizonMediaPlatform.list',
        title: 'Verizon Media Platform Rules',
        description: 'Rules for Verizon Media Platform'
      }
    ]
  },
   */
  {
    name: 'Apple',
    files: [
      {
        path: 'Surge/Ruleset/Apple/APNs.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/ApplePushNotificationService.list',
        title: 'Apple Push Notification Rules',
        description: 'Rules for Apple Push Notification service'
      },
      {
        path: 'Surge/Ruleset/Apple/Apple.list',
        url: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Apple.list',
        title: 'Apple General Rules',
        description: 'General rules for Apple services'
      },
      {
        path: 'Surge/Ruleset/Apple/AppStore.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/source/rule/AppStore/AppStore.list',
        title: 'App Store Rules',
        description: 'Rules for Apple App Store'
      },
      {
        path: 'Surge/Ruleset/Apple/AppleID.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleID/AppleID.list',
        title: 'Apple ID Rules',
        description: 'Rules for Apple ID services'
      },
      {
        path: 'Surge/Ruleset/Apple/AppleMusic.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleMusic/AppleMusic.list',
        title: 'Apple Music Rules',
        description: 'Rules for Apple Music'
      },
      {
        path: 'Surge/Ruleset/Apple/iCloud.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/iCloud/iCloud.list',
        title: 'iCloud Rules',
        description: 'Rules for iCloud services'
      },
      {
        path: 'Surge/Ruleset/Apple/TestFlight.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/TestFlight/TestFlight.list',
        title: 'TestFlight Rules',
        description: 'Rules for TestFlight'
      },
      {
        path: 'Surge/Ruleset/Apple/AppleProxy.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleProxy/AppleProxy.list',
        title: 'Apple Proxy Rules',
        description: 'Rules for Apple Proxy'
      },
      {
        path: 'Surge/Ruleset/Apple/AppleMedia.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleMedia/AppleMedia.list',
        title: 'Apple Media Rules',
        description: 'Rules for Apple Media services'
      },
      {
        path: 'Surge/Ruleset/Apple/FitnessPlus.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/FitnessPlus/FitnessPlus.list',
        title: 'Fitness Plus Rules',
        description: 'Rules for Apple Fitness Plus'
      }
    ]
  },
  {
    name: 'AI',
    files: [
      /** 
      {
        path: 'Surge/Ruleset/AI/OpenAI.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Rules/OpenAi.list',
        title: 'OpenAI Rules',
        description: 'Rules for OpenAI services'
      },
      //{
      //  path: 'Surge/Ruleset/AI/Claude.list',
      //  url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Claude.list',
      //  title: 'Claude Rules',
      //  description: 'Rules for Claude AI'
      //},
      */
      {
        path: 'Surge/Ruleset/AI/AI.list',
        url: 'https://ruleset.skk.moe/List/non_ip/ai.conf',
        title: 'General AI Rules',
        description: 'General rules for AI services'
      },
      {
        path: 'Surge/Ruleset/AI/AI_KELI.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/AI.list',
        title: 'AI KELI Rules',
        description: 'Rules for AI KELI'
      },
      {
        path: 'Surge/Ruleset/AI/AI_ConnersHua.list',
        url: 'https://github.com/ConnersHua/RuleGo/raw/master/Surge/Ruleset/Extra/AI.list',
        title: 'AI ConnersHua Rules',
        description: 'Rules for AI ConnersHua'
      },
      {
        path: 'Surge/Ruleset/AI/AI_Hiven.list',
        url: 'https://raw.githubusercontent.com/hiven425/hiven/master/config/AI.list',
        title: 'AI Hiven Rules',
        description: 'Rules for AI Hiven'
      }
    ]
  },
  {
    name: 'Streaming',
    files: [
      {
        path: 'Surge/Ruleset/Streaming/Video/Netflix.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Netflix.list',
        title: 'Netflix Rules',
        description: 'Rules for Netflix'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Disney.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Disney/Disney.list',
        title: 'Disney+ Rules',
        description: 'Rules for Disney+'
      },
      {
        path: 'Surge/Ruleset/Streaming/Music/Spotify.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.list',
        title: 'Spotify Rules',
        description: 'Rules for Spotify'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/PrimeVideo.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PrimeVideo/PrimeVideo.list',
        title: 'Prime Video Rules',
        description: 'Rules for Amazon Prime Video'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/AppleMedia.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/AppleMedia/AppleMedia.list',
        title: 'Apple Media Rules',
        description: 'Rules for Apple Media'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Bahamut.list',
        url: 'https://github.com/ACL4SSR/ACL4SSR/raw/master/Clash/Ruleset/Bahamut.list',
        title: 'Bahamut Rules',
        description: 'Rules for Bahamut'
      },
      {
        path: 'Surge/Ruleset/Streaming/ProxyMedia.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyMedia.list',
        title: 'Proxy Media Rules',
        description: 'Rules for Proxy Media'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/YouTube.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/YouTube.list',
        title: 'YouTube Rules',
        description: 'Rules for YouTube'
      },
      {
        path: 'Surge/Ruleset/Streaming/GlobalMedia.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/GlobalMedia.list',
        title: 'Global Media Rules',
        description: 'Rules for Global Media'
      },
      {
        path: 'Surge/Ruleset/Streaming/Music/NeteaseMusic.list',
        url: 'https://ruleset.skk.moe/List/non_ip/neteasemusic.conf',
        title: 'NetEase Music Rules',
        description: 'Rules for NetEase Music'
      },
      {
        path: 'Surge/Ruleset/Streaming/Music/NeteaseMusic_NoIP.list',
        url: 'https://ruleset.skk.moe/List/ip/neteasemusic.conf',
        title: 'NetEase Music No IP Rules',
        description: 'Rules for NetEase Music without IP'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Emby.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Emby.list',
        title: 'Emby Rules',
        description: 'Rules for Emby'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/EmbyTest.list',
        url: 'https://github.com/1120109856/lynn/raw/main/fxw',
        title: 'Emby Test Rules',
        description: 'Test rules for Emby'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/EmbyTest2.list',
        url: 'https://github.com/1120109856/lynn/raw/main/zl',
        title: 'Emby Test 2 Rules',
        description: 'Second test rules for Emby'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/BiliBiliIntl.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/BiliBiliIntl/BiliBiliIntl.list',
        title: 'BiliBili International Rules',
        description: 'Rules for BiliBili International'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/Bilibili.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bilibili.list',
        title: 'Bilibili Rules',
        description: 'Rules for Bilibili'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/TikTok.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/TikTok.list',
        title: 'TikTok Rules',
        description: 'Rules for TikTok'
      },
      {
        path: 'Surge/Ruleset/Streaming/Video/HBO.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/HBO/HBO.list',
        title: 'HBO Rules',
        description: 'Rules for HBO'
      },
      {
        path: 'Surge/Ruleset/Streaming/CN.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Streaming/CN.list',
        title: 'China Streaming Rules',
        description: 'Streaming rules for China services'
      },
      {
        path: 'Surge/Ruleset/Streaming/!CN.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Streaming/!CN.list',
        title: 'Non-China Streaming Rules',
        description: 'Streaming rules for non-China services'
      }
    ]
  },
  {
    name: 'Reject',
    files: [
      {
        path: 'Surge/Ruleset/Reject/Advertising.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Reject/Advertising.list',
        title: 'Advertising Reject Rules',
        description: 'Rules to reject advertising'
      },
      {
        path: 'Surge/Ruleset/Reject/Malicious.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Reject/Malicious.list',
        title: 'Malicious Reject Rules',
        description: 'Rules to reject malicious content'
      },
      {
        path: 'Surge/Ruleset/Reject/Tracking.list',
        url: 'https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/Reject/Tracking.list',
        title: 'Tracking Reject Rules',
        description: 'Rules to reject tracking'
      },
      /**
      {
        path: 'Surge/Ruleset/Reject/Ads_EasyListChina.list',
        url: 'https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/rule/Surge/easylistchina_surge.list',
        title: 'EasyList China Ads Reject Rules',
        description: 'Rules to reject ads from EasyList China'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_EasyListPrivacy.list',
        url: 'https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/rule/Surge/easyprivacy_surge.list',
        title: 'EasyList Privacy Ads Reject Rules',
        description: 'Rules to reject ads from EasyList Privacy'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_Dlerio.list',
        url: 'https://raw.githubusercontent.com/dler-io/Rules/main/Surge/Surge%203/Provider/Reject.list',
        title: 'Dlerio Ads Reject Rules',
        description: 'Rules to reject ads from Dlerio'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_AWAvenue.list',
        url: 'https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Surge.list',
        title: 'AWAvenue Ads Reject Rules',
        description: 'Rules to reject ads from AWAvenue'
      },
      {
        path: 'Surge/Ruleset/Reject/AdGuardChinese.list',
        url: 'https://raw.githubusercontent.com/geekdada/surge-list/master/domain-set/chinese-filter.txt',
        title: 'AdGuard Chinese Reject Rules',
        description: 'Rules to reject ads from AdGuard Chinese'
      },
      */
      {
        path: 'Surge/Ruleset/Reject/Ads_fmz200.list',
        url: 'https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/filter/fenliu.list',
        title: 'FMZ200 Ads Reject Rules',
        description: 'Rules to reject ads from FMZ200'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW.list',
        url: 'https://ruleset.skk.moe/List/domainset/reject.conf',
        title: 'SukkaW Ads Reject Rules',
        description: 'Rules to reject ads from SukkaW'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW_NoIP.list',
        url: 'https://ruleset.skk.moe/List/non_ip/reject.conf',
        title: 'SukkaW No IP Ads Reject Rules',
        description: 'Rules to reject ads from SukkaW without IP'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW_Extra.list',
        url: 'https://ruleset.skk.moe/List/domainset/reject_extra.conf',
        title: 'SukkaW Extra Ads Reject Rules',
        description: 'Extra rules to reject ads from SukkaW'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_SukkaW_IP.list',
        url: 'https://ruleset.skk.moe/List/ip/reject.conf',
        title: 'SukkaW IP Ads Reject Rules',
        description: 'Rules to reject ads from SukkaW with IP'
      },
      {
        path: 'Surge/Ruleset/Reject/Ads_limbopro.list',
        url: 'https://raw.githubusercontent.com/limbopro/Adblock4limbo/main/Adblock4limbo_surge.list',
        title: 'Limbopro Ads Reject Rules',
        description: 'Rules to reject ads from Limbopro'
      }
    ]
  },
  {
    name: 'Direct',
    files: [
      {
        path: 'Surge/Ruleset/Direct/Direct_fmz200.list',
        url: 'https://github.com/fmz200/wool_scripts/raw/main/QuantumultX/filter/fenliuxiuzheng.list',
        title: 'FMZ200 Direct Rules',
        description: 'Direct rules from FMZ200'
      },
      {
        path: 'Surge/Ruleset/Direct/Direct_Sukkaw.list',
        url: 'https://ruleset.skk.moe/List/non_ip/direct.conf',
        title: 'SukkaW Direct Rules',
        description: 'Direct rules from SukkaW'
      },
      {
        path: 'Surge/Ruleset/Direct/MyDirect_Sukkaw.list',
        url: 'https://ruleset.skk.moe/List/non_ip/my_direct.conf',
        title: 'My Direct SukkaW Rules',
        description: 'My direct rules from SukkaW'
      }
    ]
  },
  {
    name: 'Anti',
    files: [
      {
        path: 'Surge/Ruleset/Anti/Direct.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/generated/rule-set-direct.list',
        title: 'Anti Direct Rules',
        description: 'Anti IP attribution direct rules'
      },
      {
        path: 'Surge/Ruleset/Anti/Proxy.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/generated/rule-set-proxy.list',
        title: 'Anti Proxy Rules',
        description: 'Anti IP attribution proxy rules'
      },
      {
        path: 'Surge/Ruleset/Anti/Reject.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/generated/rule-set-reject.list',
        title: 'Anti Reject Rules',
        description: 'Anti IP attribution reject rules'
      }
    ]
  },
  {
    name: 'AntiApp',
    files: [
      {
        path: 'Surge/Ruleset/Anti/App/QQMusic.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/rules/QQ音乐.yaml',
        title: 'Anti QQMusic Rules',
        description: 'Anti IP attribution rules for QQMusic'
      },
      {
        path: 'Surge/Ruleset/Anti/App/Bilibili.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/rules/哔哩哔哩.yaml',
        title: 'Anti Bilibili Rules',
        description: 'Anti IP attribution rules for Bilibili'
      },
      {
        path: 'Surge/Ruleset/Anti/App/Xiaohongshu.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/rules/小红书.yaml',
        title: 'Anti Xiaohongshu Rules',
        description: 'Anti IP attribution rules for Xiaohongshu'
      },
      {
        path: 'Surge/Ruleset/Anti/App/Douban.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/rules/豆瓣.yaml',
        title: 'Anti Douban Rules',
        description: 'Anti IP attribution rules for Douban'
      },
      {
        path: 'Surge/Ruleset/Anti/App/NeteaseMusic.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/rules/网易云音乐.yaml',
        title: 'Anti NeteaseMusic Rules',
        description: 'Anti IP attribution rules for NeteaseMusic'
      },
      {
        path: 'Surge/Ruleset/Anti/App/WeChat.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/rules/微信.yaml',
        title: 'Anti WeChat Rules',
        description: 'Anti IP attribution rules for WeChat'
      },
      {
        path: 'Surge/Ruleset/Anti/App/Douyin.list',
        url: 'https://github.com/SunsetMkt/anti-ip-attribution/raw/main/rules/抖音.yaml',
        title: 'Anti Douyin Rules',
        description: 'Anti IP attribution rules for Douyin'
      }
    ]
  },
  {
    name: 'Domestic',
    files: [
      {
        path: 'Surge/Ruleset/Domestic/WeChat.list',
        url: 'https://raw.githubusercontent.com/NobyDa/Script/master/Surge/WeChat.list',
        title: 'WeChat Rules',
        description: 'Rules for WeChat'
      },
      {
        path: 'Surge/Ruleset/ChinaDomain.list',
        url: 'https://ruleset.skk.moe/List/non_ip/domestic.conf',
        title: 'China Domain Rules',
        description: 'Rules for China domains'
      },
      {
        path: 'Surge/Ruleset/Domestic_Sukkaw_NoIP.list',
        url: 'https://ruleset.skk.moe/List/non_ip/domestic.conf',
        title: 'Domestic SukkaW No IP Rules',
        description: 'Domestic rules from SukkaW without IP'
      },
      {
        path: 'Surge/Ruleset/Domestic_Sukkaw_IP.list',
        url: 'https://ruleset.skk.moe/List/ip/domestic.conf',
        title: 'Domestic SukkaW IP Rules',
        description: 'Domestic rules from SukkaW with IP'
      },
      {
        path: 'Surge/Ruleset/China.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/China/China.list',
        title: 'China Rules',
        description: 'Rules for China'
      },
      {
        path: 'Surge/Ruleset/Domestic/ChinaMax.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ChinaMax/ChinaMax.list',
        title: 'China Max Rules',
        description: 'Max rules for China'
      },
      {
        path: 'Surge/Ruleset/Domestic/cn.list',
        url: 'https://raw.githubusercontent.com/Blankwonder/surge-list/master/cn.list',
        title: 'CN Rules',
        description: 'Rules for CN'
      },
      {
        path: 'Surge/Ruleset/Domestic.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/Domestic.list',
        title: 'Domestic Rules',
        description: 'General domestic rules'
      },
    ]
  },
  {
    name: 'CDN',
    files: [
      {
        path: 'Surge/Ruleset/CDN/DownloadCDN_Global.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/InternationalDownloadCDN.list',
        title: 'Global Download CDN Rules',
        description: 'Rules for global download CDN'
      },
      {
        path: 'Surge/Ruleset/CDN/DownloadCDN_CN.list',
        url: 'https://proxyresource.pages.dev/Tool/Loon/Rule/ChinaDownloadCDN.list',
        title: 'China Download CDN Rules',
        description: 'Rules for China download CDN'
      },
      {
        path: 'Surge/Ruleset/CDN/CDN.list',
        url: 'https://ruleset.skk.moe/List/domainset/cdn.conf',
        title: 'CDN Rules',
        description: 'Rules for CDN'
      },
      {
        path: 'Surge/Ruleset/CDN/CDN_NoIP.list',
        url: 'https://ruleset.skk.moe/List/non_ip/cdn.conf',
        title: 'CDN No IP Rules',
        description: 'Rules for CDN without IP'
      }
    ]
  },
  {
    name: 'IPCIDR',
    files: [
      {
        path: 'Surge/Ruleset/IPCIDR/ChinaIP_Sukkaw.list',
        url: 'https://ruleset.skk.moe/List/ip/china_ip.conf',
        title: 'China IP SukkaW Rules',
        description: 'IP rules for China from SukkaW'
      },
      {
        path: 'Surge/Ruleset/IPCIDR/ChinaIPv6.list',
        url: 'https://raw.githubusercontent.com/missuo/ASN-China/main/IPv6.China.list',
        title: 'China IP Rules',
        description: 'IP rules for China'
      },
      {
        path: 'Surge/Ruleset/IPCIDR/ChinaIPv4.list',
        url: 'https://raw.githubusercontent.com/missuo/ASN-China/main/IPv4.China.list',
        title: 'China IPv4 Rules',
        description: 'IPv4 rules for China'
      },
      {
        path: 'Surge/Ruleset/IPCIDR/ChinaIPv4.DH.list',
        url: 'https://raw.githubusercontent.com/DH-Teams/DH-Geo_AS_IP_CN/main/Geo_AS_IP_CN_V4_Surge.list',
        title: 'China IPv4 DH Rules',
        description: 'IPv4 rules for China from DH'
      },
      {
        path: 'Surge/Ruleset/ChinaASN.Fries.list',
        url: 'https://raw.githubusercontent.com/VirgilClyne/GetSomeFries/main/ruleset/ASN.China.list',
        title: 'China ASN Fries Rules',
        description: 'ASN rules for China'
      },
      {
        path: 'Surge/Ruleset/ChinaASN.missuo.list',
        url: 'https://raw.githubusercontent.com/missuo/ASN-China/main/ASN.China.list',
        title: 'China ASN Missuo Rules',
        description: 'ASN rules for China from Missuo'
      },
      {
        path: 'Surge/Ruleset/ChinaASN.DH.list',
        url: 'https://raw.githubusercontent.com/DH-Teams/DH-Geo_AS_IP_CN/main/Geo_AS_CN.list',
        title: 'China ASN DH Rules',
        description: 'ASN rules for China from DH'
      }
    ]
  },
  {
    name: 'Lan',
    files: [
      {
        path: 'Surge/Ruleset/Lan.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/Special/Local-LAN.list',
        title: 'LAN Rules',
        description: 'Rules for local LAN'
      }
    ]
  },
  {
    name: 'Social',
    files: [
      {
        path: 'Surge/Ruleset/Social/Twitter.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Twitter.list',
        title: 'Twitter Rules',
        description: 'Rules for Twitter'
      },
      {
        path: 'Surge/Ruleset/Social/Instagram.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Instagram.list',
        title: 'Instagram Rules',
        description: 'Rules for Instagram'
      },
      {
        path: 'Surge/Ruleset/Social/Facebook.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Facebook.list',
        title: 'Facebook Rules',
        description: 'Rules for Facebook'
      },
      {
        path: 'Surge/Ruleset/Telegram.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Telegram.list',
        title: 'Telegram Rules',
        description: 'Rules for Telegram'
      }
    ]
  },
  {
    name: 'Extra',
    files: [
      {
        path: 'Surge/Ruleset/Extra/Direct.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Direct.list',
        title: 'Extra Direct Rules',
        description: 'Extra direct routing rules'
      },
      {
        path: 'Surge/Ruleset/Extra/Reject.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Reject.list',
        title: 'Extra Reject Rules',
        description: 'Extra reject rules'
      },
      {
        path: 'Surge/Ruleset/Extra/Proxy.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Proxy.list',
        title: 'Extra Proxy Rules',
        description: 'Extra proxy rules'
      },
      {
        path: 'Surge/Ruleset/Extra/Prevent_DNS_Leaks.list',
        url: 'https://raw.githubusercontent.com/Repcz/Tool/X/Surge/Rules/Prevent_DNS_Leaks.list',
        title: 'Prevent DNS Leaks Rules',
        description: 'Rules to prevent DNS leaks'
      }
    ]
  },
  {
    name: 'GFW',
    files: [
      {
        path: 'Surge/Ruleset/Blocked.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list',
        title: 'GFW Proxy Rules',
        description: 'GFW proxy rules list'
      },
      /** 
      {
        path: 'Surge/Ruleset/ProxyLite_ACL4SSR.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyLite.list',
        title: 'Lite Proxy Rules',
        description: 'Lite proxy rules list'
      },
      */
      {
        path: 'Surge/Ruleset/ProxyLite.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ProxyLite/ProxyLite.list',
        title: 'Lite Proxy Rules',
        description: 'Lite proxy rules list'
      },
      {
        path: 'Surge/Ruleset/Foreign.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/PROXY.list',
        title: 'Foreign Rules',
        description: 'Rules for foreign services'
      },
      {
        path: 'Surge/Ruleset/Proxy.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Proxy/Proxy.list',
        title: 'General Proxy Rules',
        description: 'General proxy routing rules'
      },
      {
        path: 'Surge/Ruleset/Global.list',
        url: 'https://github.com/Tartarus2014/For-own-use/raw/master/Ruleset/Proxy.list',
        title: 'Global Rules',
        description: 'Global proxy rules'
      }
    ]
  },
  {
    name: 'Google',
    files: [
      {
        path: 'Surge/Ruleset/Google/Google.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Google.list',
        title: 'Google Rules',
        description: 'Rules for Google services'
      }
    ]
  },
  {
    name: 'Microsoft',
    files: [
      {
        path: 'Surge/Ruleset/Microsoft/Github.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Github.list',
        title: 'GitHub Rules',
        description: 'Rules for GitHub'
      },
      {
        path: 'Surge/Ruleset/Microsoft/OneDrive.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/OneDrive.list',
        title: 'OneDrive Rules',
        description: 'Rules for OneDrive'
      },
      {
        path: 'Surge/Ruleset/Microsoft/Microsoft.list',
        url: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Microsoft.list',
        title: 'Microsoft Rules',
        description: 'Rules for Microsoft services'
      }
    ]
  },
  /** 
  {
    name: 'Developer',
    files: [
      {
        path: 'Surge/Ruleset/Developer/Gitlab.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/PROXY/Gitlab.list',
        title: 'GitLab Rules',
        description: 'Rules for GitLab'
      },
      {
        path: 'Surge/Ruleset/Developer/App-Activation.list',
        url: 'https://raw.githubusercontent.com/LM-Firefly/Rules/master/Special/App-Activation.list',
        title: 'App Activation Rules',
        description: 'Rules for app activation'
      }
    ]
  },
  {
    name: 'Oracle',
    files: [
      {
        path: 'Surge/Ruleset/Oracle/Oracle.list',
        url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Oracle/Oracle.list',
        title: 'Oracle Rules',
        description: 'Rules for Oracle services'
      }
    ]
  }
    */
];

// Special rules configuration
export const specialRules: SpecialRuleConfig[] = [
  {
    name: 'IP',
    targetFile: 'Surge/Ruleset/ChinaIP.list',
    sourceFiles: [
      'Surge/Ruleset/IPCIDR/ChinaIPv4.list',
    ],
    generateResolveVersion: true,
    cleanup: true
  },
  {
    name: 'Reject',
    targetFile: 'Surge/Ruleset/Reject/Reject.list',
    sourceFiles: [
      'Surge/Ruleset/Reject/Advertising.list',
      'Surge/Ruleset/Reject/Malicious.list',
      'Surge/Ruleset/Reject/Tracking.list'
    ],
    cleanup: true
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
    cleanup: true
  },
  {
    name: 'CDN',
    targetFile: 'Surge/Ruleset/CDN/CDN.list',
    sourceFiles: [
      'Surge/Ruleset/CDN/CDN_NoIP.list'
    ],
    cleanup: true
  },
  {
    name: 'NeteaseMusic',
    targetFile: 'Surge/Ruleset/Streaming/Music/NeteaseMusic.list',
    sourceFiles: [
      'Surge/Ruleset/Streaming/Music/NeteaseMusic_NoIP.list'
    ],
    generateResolveVersion: true,
    cleanup: true
  }
];

export const config = {
  repoPath: REPO_PATH,
  defaultFormat: 'Surge' as const,
  cleanup: true,
  stats: true,
  ipRules: {
    generateResolveVersion: true,
    resolveVersionSuffix: '_Resolve'
  }
}; 