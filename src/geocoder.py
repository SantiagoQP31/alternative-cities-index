import geonamescache
import unicodedata
import re

# Initialize GeoNames Cache
gc = geonamescache.GeonamesCache()
cities_db = gc.get_cities()

# Build geo index (lowercase name -> list of city entries)
geo_index = {}
for gid, data in cities_db.items():
    name_clean = unicodedata.normalize('NFKD', data['name']).encode('ASCII', 'ignore').decode('utf-8').lower().strip()
    if name_clean not in geo_index:
        geo_index[name_clean] = []
    geo_index[name_clean].append({
        'lat': float(data['latitude']),
        'lng': float(data['longitude']),
        'cc':  data['countrycode'],
        'pop': data.get('population', 0),
        'name': data['name']
    })

# Country ISO code map
iso_map = {
    'korea': 'KR', 'japan': 'JP', 'china': 'CN', 'singapore': 'SG',
    'malaysia': 'MY', 'vietnam': 'VN', 'thailand': 'TH', 'philippines': 'PH',
    'indonesia': 'ID', 'india': 'IN', 'saudi arabia': 'SA',
    'united arab emirates': 'AE', 'turkey': 'TR', 'brazil': 'BR',
    'mexico': 'MX', 'colombia': 'CO', 'argentina': 'AR', 'chile': 'CL',
    'peru': 'PE', 'ecuador': 'EC', 'cuba': 'CU', 'bolivia': 'BO',
    'venezuela': 'VE', 'paraguay': 'PY', 'uruguay': 'UY',
    'kenya': 'KE', 'south africa': 'ZA', 'ghana': 'GH', 'algeria': 'DZ',
    'morocco': 'MA', 'egypt': 'EG', 'nigeria': 'NG', 'ethiopia': 'ET',
    'tanzania': 'TZ', 'uganda': 'UG', 'cameroon': 'CM', 'senegal': 'SN',
    'tunisia': 'TN', 'libya': 'LY', 'sudan': 'SD', 'angola': 'AO',
    'mozambique': 'MZ', 'zimbabwe': 'ZW', 'zambia': 'ZM',
    'germany': 'DE', 'united kingdom': 'GB', 'france': 'FR', 'italy': 'IT',
    'spain': 'ES', 'poland': 'PL', 'netherlands': 'NL', 'russia': 'RU',
    'ukraine': 'UA', 'romania': 'RO', 'czech republic': 'CZ',
    'united states': 'US', 'canada': 'CA',
    'australia': 'AU', 'new zealand': 'NZ',
    'kazakhstan': 'KZ', 'uzbekistan': 'UZ', 'azerbaijan': 'AZ',
    'mongolia': 'MN', 'bangladesh': 'BD', 'pakistan': 'PK',
    'sri lanka': 'LK', 'nepal': 'NP', 'iran': 'IR', 'iraq': 'IQ',
    'israel': 'IL', 'jordan': 'JO', 'kuwait': 'KW', 'qatar': 'QA',
    'bahrain': 'BH', 'oman': 'OM', 'taiwan': 'TW',
    'myanmar': 'MM', 'cambodia': 'KH', 'laos': 'LA',
    'congo, dem. rep.': 'CD', 'south sudan': 'SS', 'somalia': 'SO',
    'tajikistan': 'TJ', 'yemen': 'YE', 'syria': 'SY', 'benin': 'BJ',
    'gambia': 'GM', 'malawi': 'MW', 'eritrea': 'ER', 'niger': 'NE',
    'madagascar': 'MG', 'burundi': 'BI', 'chad': 'TD', 'burkina faso': 'BF',
    'haiti': 'HT', 'central african republic': 'CF', 'equatorial guinea': 'GQ',
    'cote d\'ivoire': 'CI', 'guinea-bissau': 'GW', 'afghanistan': 'AF',
    'armenia': 'AM', 'azerbaijan': 'AZ', 'georgia': 'GE', 'kyrgyzstan': 'KG',
    'turkmenistan': 'TM'
}

# Manual corrections (lowercase cleaned name -> geonamescache name or alias)
manual_corrections = {
    'bangalore': 'bengaluru',
    'ha noi': 'hanoi',
    'hai phong': 'haiphong',
    'xian': "xi'an",
    'urumi': 'urumqi',
    'vale do aco': 'ipatinga',
    'porto alegre': 'porto alegre',
    'queretaro': 'santiago de queretaro',
    'marrakech': 'marrakesh',
    'fes': 'fez',
    'bien hoa': 'bien hoa',
    'ho chi minh': 'ho chi minh city',
    'izmir': 'izmir',
    'uijeongbu': 'uijeongbu',
    'goyang': 'goyang-si',
    'gimhae': 'gimhae',
    'daejon': 'daejeon',
    'cheongju': 'cheongju-si',
    'jeju': 'jeju',
    'yongin': 'yongin',
    'wonju': 'wonju',
    'seongnam': 'seongnam-si',
    'suweon': 'suwon',
    'bucheon': 'bucheon-si',
    'siheung': 'siheung-si',
    'ansan': 'ansan-si',
    'yangju': 'yangju-si',
    'gunpo': 'gunpo-si',
    'gwangju': 'gwangju-si',
    'iksan': 'iksan-si',
    'mokpo': 'mokpo-si',
    'wonju': 'wonju-si',
    'chuncheon': 'chuncheon-si',
    'gumi': 'gumi-si',
    'yeosu': 'yeosu-si',
    'gunsan': 'gunsan-si',
    'suncheon': 'suncheon-si',
    'gyeongju': 'gyeongju-si',
    'pohang': 'pohang-si',
    'tongyeong': 'tongyeong-si',
    'sacheon': 'sacheon-si',
    'geoje': 'geoje-si',
    'miryang': 'miryang-si',
    'andong': 'andong-si',
    'yeongju': 'yeongju-si',
    'sangju': 'sangju-si',
    'gimcheon': 'gimcheon-si',
    'mungyeong': 'mungyeong-si',
    'asan': 'asan-si',
    'cheonan': 'cheonan-si',
    'gongju': 'gongju-si',
    'boryeong': 'boryeong-si',
    'seosan': 'seosan-si',
    'nonsan': 'nonsan-si',
    'gyeryong': 'gyeryong-si',
    'jeongeup': 'jeongeup-si',
    'gwangyang': 'gwangyang-si',
    'naju': 'naju-si',
    'sunchon': 'suncheon-si',
    'kochi': 'kochi',
    'urumqi': 'urumqi',
    'macapa': 'macapa',
    'sao luis': 'sao luis',
    'teresina': 'teresina',
    'fortaleza': 'fortaleza',
    'natal': 'natal',
    'joao pessoa': 'joao pessoa',
    'recife': 'recife',
    'maceio': 'maceio',
    'aracaju': 'aracaju',
    'salvador': 'salvador',
    'belo horizonte': 'belo horizonte',
    'vitoria': 'vitoria',
    'rio de janeiro': 'rio de janeiro',
    'sao paulo': 'sao paulo',
    'curitiba': 'curitiba',
    'florianopolis': 'florianopolis',
    'porto alegre': 'porto alegre',
    'cuiaba': 'cuiaba',
    'campo grande': 'campo grande',
    'goiania': 'goiania',
    'brasilia': 'brasilia',
    'manaus': 'manaus',
    'belem': 'belem',
    'popayan': 'popayan',
    'ucua': 'uige',
    'uige': 'uige',
    'ndjamena': "n'djamena",
    'yaounde': 'yaounde',
    'san cristobal': 'san cristobal',
    'ciudad guayana': 'ciudad guayana',
    'merida': 'merida',
    'acarigua araure': 'acarigua',
    'barcelona puerto la cruz': 'barcelona',
    'guarenas guatire': 'guarenas',
    'sanaa': "sana'a",
    'taizz': "ta'izz",
    'al hudaydah': 'al hudaydah',
    'al mukalla': 'al mukalla',
    'shymkent': 'shymkent',
    'thiruvananthapuram': 'thiruvananthapuram',
    'mysuru': 'mysore',
    'santiago de queretaro': 'santiago de queretaro',
    'buraidah': 'buraidah',
    'bariduh': 'buraidah',
    'santos': 'santos',
    'la serena': 'la serena',
    'chattogram': 'chattogram',
    'chittagong': 'chattogram',
    'isifahan': 'isfahan',
    'esfahan': 'isfahan',
    'ganja': 'ganja',
    'gence': 'ganja',
    'sumqayit': 'sumqayit',
    'sumquayit': 'sumqayit',
    'sulaymaniyah': 'sulaymaniyah',
    'sulaimaniya': 'sulaymaniyah',
    'gonder': 'gandar',
    'gondar': 'gandar',
    'al amarah': 'al amarah',
    'amara': 'al amarah',
    'al fallujah': 'al fallujah',
    'faloojah': 'al fallujah',
    'al kut': 'al kut',
    'kut': 'al kut',
    'ad diwaniyah': 'ad diwaniyah',
    'diwaniyah': 'ad diwaniyah',
    'baqubah': 'baqubah',
    'baaqoobah': 'baqubah',
    'mekele': "mek'ele",
    'ar raqqah': 'ar raqqah',
    'al raqqa': 'ar raqqah',
    'latakia': 'latakia',
    'lattakia': 'latakia',
    'kismayo': 'kismayo',
    'kismaayo': 'kismayo',
    'al ubayyid': 'al ubayyid',
    'al obeid': 'al ubayyid',
    'al qadarif': 'al qadarif',
    'al gadarif': 'al qadarif',
    'hufuf mubarraz': 'al hofuf',
    'sta maria': 'santa maria',
    'sta rosa': 'santa rosa',
    'neuquen plottier cipolletti': 'neuquen',
    'ekurhuleni': 'germiston',
    'quy nhon': 'qui nhon',
    'khon kaen': 'khon kaen',
    'ar rusayfah': 'ar rusayfah',
    'aktyubinsk': 'aktobe',
    'haora': 'howrah',
    'qacentina': 'constantine',
    'safaqis': 'sfax',
    'wuzhong': 'wuzhong',
    'ras al khimah': 'ras al-khaimah',
    'hafar albatin': 'hafar al-batin',
    'grande sao luis': 'sao luis',
    'kubang pasu': 'jitra',
    'bur said': 'port said',
    'kafr ad dawwar': 'kafr ad-dawwar',
    'diyarbakir': 'diyarbakir',
    'ahmadnager': 'ahmednagar',
    'andizhan': 'andijan',
    'tan uyen': 'tan uyen',
    'vasai virar': 'vasai',
    'semipalatinsk': 'semey',
    'gqeberha (port elizabeth)': 'port elizabeth',
    'fujairah': 'al fujayrah',
    'sanliurfa': 'sanliurfa',
    'as suways': 'suez',
    'asyut': 'asyut',
    'irbil': 'erbil',
    'al ismailiyah': 'ismailia',
    '10th of ramadan': '10th of ramadan city',
    'wulanchabu': 'jining',
    'solapur': 'sholapur',
    'az zaqazig': 'zagazig',
    'faizabad': 'fyzabad',
    'rae bareli': 'rae bareli',
    'blantyre limbe': 'blantyre',
    'raurkela': 'rourkela',
    'hospet': 'hosapete',
    'elazig': 'elazig',
    'west rand': 'krugersdorp',
    'english bazar': 'english bazar',
    'el djelfa': 'djelfa',
    'banghazi': 'benghazi',
}

# Country capital centers (fallback)
capital_centers = {
    'KR': (37.5665, 126.9780),
    'JP': (35.6762, 139.6503),
    'CN': (39.9042, 116.4074),
    'SG': (1.3521, 103.8198),
    'MY': (3.1390, 101.6869),
    'VN': (21.0285, 105.8542),
    'TH': (13.7563, 100.5018),
    'PH': (14.5995, 120.9842),
    'ID': (-6.2088, 106.8456),
    'IN': (28.6139, 77.2090),
    'SA': (24.7136, 46.6753),
    'AE': (24.4539, 54.3773),
    'TR': (39.9334, 32.8597),
    'BR': (-15.7975, -47.8919),
    'MX': (19.4326, -99.1332),
    'CO': (4.7110, -74.0721),
    'AR': (-34.6037, -58.3816),
    'CL': (-33.4489, -70.6693),
    'PE': (-12.0464, -77.0428),
    'EC': (-0.1807, -78.4678),
    'CU': (23.1136, -82.3666),
    'BO': (-16.4897, -68.1193),
    'VE': (10.4806, -66.9036),
    'PY': (-25.2637, -57.5759),
    'UY': (-34.9011, -56.1645),
    'KE': (-1.2921, 36.8219),
    'ZA': (-25.7479, 28.2293),
    'GH': (5.6037, -0.1870),
    'DZ': (36.7538, 3.0588),
    'MA': (33.5731, -7.5898),
    'EG': (30.0444, 31.2357),
    'NG': (9.0765, 7.3986),
    'ET': (9.0222, 38.7468),
    'TZ': (-6.7924, 39.2083),
    'UG': (0.3476, 32.5825),
    'CM': (3.8480, 11.5021),
    'SN': (14.7167, -17.4677),
    'TN': (36.8065, 10.1815),
    'LY': (32.8790, 13.1913),
    'SD': (15.5007, 32.5599),
    'AO': (-8.8390, 13.2894),
    'MZ': (-25.9692, 32.5732),
    'ZW': (-17.8252, 31.0530),
    'ZM': (-15.3875, 28.3228),
    'DE': (52.5200, 13.4050),
    'GB': (51.5074, -0.1278),
    'FR': (48.8566, 2.3522),
    'IT': (41.9028, 12.4964),
    'ES': (40.4168, -3.7038),
    'PL': (52.2297, 21.0122),
    'NL': (52.3676, 4.9041),
    'RU': (55.7558, 37.6173),
    'UA': (50.4501, 30.5234),
    'RO': (44.4268, 26.1025),
    'CZ': (50.0755, 14.4378),
    'US': (38.9072, -77.0369),
    'CA': (45.4215, -75.6972),
    'AU': (-35.2809, 149.1300),
    'NZ': (-41.2865, 174.7762),
    'KZ': (51.1605, 71.4704),
    'UZ': (41.2995, 69.2401),
    'AZ': (40.4093, 49.8671),
    'MN': (47.8864, 106.9057),
    'BD': (23.8103, 90.4125),
    'PK': (33.6844, 73.0479),
    'LK': (6.9271, 79.8612),
    'NP': (27.7172, 85.3240),
    'IR': (35.6892, 51.3890),
    'IQ': (33.3152, 44.3661),
    'IL': (31.7683, 35.2137),
    'JO': (31.9454, 35.9284),
    'KW': (29.3759, 47.9774),
    'QA': (25.2854, 51.5310),
    'BH': (26.2285, 50.5860),
    'OM': (23.5859, 58.4059),
    'TW': (25.0330, 121.5654),
    'MM': (19.7633, 96.0785),
    'KH': (11.5564, 104.9282),
    'LA': (17.9757, 102.6331),
    'CD': (-4.4419, 15.2663),
    'SS': (4.8517, 31.5822),
    'SO': (2.0469, 45.3182),
    'TJ': (38.5598, 68.7870),
    'YE': (15.3694, 44.1910),
    'SY': (33.5138, 36.2765),
    'BJ': (6.3703, 2.4262),
    'GM': (13.4549, -16.5790),
    'MW': (-13.9626, 33.7741),
    'ER': (15.3390, 38.9371),
    'NE': (13.5116, 2.1254),
    'MG': (-18.8792, 47.5079),
    'BI': (-3.3822, 29.3644),
    'TD': (12.1348, 15.0557),
    'BF': (12.3714, -1.5197),
    'HT': (18.5944, -72.3074),
    'CF': (4.3947, 18.5582),
    'GQ': (3.7504, 8.7832),
    'CI': (6.8276, -5.2793),
    'GW': (11.8632, -15.5977),
    'AF': (34.5553, 69.2075)
}

def clean_name(city_str):
    if not isinstance(city_str, str):
        return ""
    
    # Strip accents
    s = unicodedata.normalize('NFKD', city_str).encode('ASCII', 'ignore').decode('utf-8')
    
    # Replace non-alphanumeric characters with spaces or clean known patterns
    s = s.replace('?', ' ')
    s = s.replace('\ufffd', ' ')
    
    # Clean double spaces
    s = ' '.join(s.split())
    s = s.lower().strip()
    
    # Clean corrupt substrings from encoding glitches
    s = s.replace('popayn', 'popayan')
    s = s.replace('prto alegre', 'porto alegre')
    s = s.replace('quertaro', 'queretaro')
    s = s.replace('uge', 'uige')
    s = s.replace('ndjamna', 'ndjamena')
    s = s.replace('yaound', 'yaounde')
    s = s.replace('san cristbal', 'san cristobal')
    s = s.replace('guantnamo', 'guantanamo')
    s = s.replace('taizz', 'taizz')
    s = s.replace('sanaa', 'sanaa')
    s = s.replace('grande vitria', 'vitoria')
    s = s.replace('grande vitria', 'vitoria')
    
    return s

def geocode_city(city_str):
    """
    Geocodes a city string (e.g. 'Seoul, Korea' or 'Popayán, Colombia')
    returns (latitude, longitude) as a tuple of floats.
    """
    if not isinstance(city_str, str):
        return None, None
        
    parts = city_str.split(',')
    name_raw = parts[0].strip()
    country_raw = parts[-1].strip() if len(parts) > 1 else ''
    
    name = clean_name(name_raw)
    country = clean_name(country_raw)
    
    # Check manual corrections
    if name in manual_corrections:
        name = manual_corrections[name]
        
    cc_target = iso_map.get(country, '')
    
    # Try direct name lookup
    candidates = geo_index.get(name, [])
    
    # Try adding '-si' if Korean city
    if not candidates and cc_target == 'KR' and not name.endswith('-si'):
        candidates = geo_index.get(name + '-si', [])
        
    # Try fallback to first word
    if not candidates:
        first_word = name.split()[0] if name.split() else ''
        candidates = geo_index.get(first_word, [])
        if not candidates and cc_target == 'KR' and not first_word.endswith('-si'):
            candidates = geo_index.get(first_word + '-si', [])
            
    if candidates:
        if cc_target:
            filtered = [c for c in candidates if c['cc'] == cc_target]
            if filtered:
                best = max(filtered, key=lambda x: x['pop'])
                return best['lat'], best['lng']
        best = max(candidates, key=lambda x: x['pop'])
        return best['lat'], best['lng']
        
    # Fallback to country capital center
    if cc_target in capital_centers:
        return capital_centers[cc_target]
        
    # Generic center fallback
    return 0.0, 0.0
