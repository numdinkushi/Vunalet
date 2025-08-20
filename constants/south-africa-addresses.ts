export interface SouthAfricanCity {
    name: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    province: string;
}

export interface SouthAfricanProvince {
    name: string;
    code: string;
    cities: SouthAfricanCity[];
}

export const SOUTH_AFRICAN_PROVINCES: SouthAfricanProvince[] = [
    {
        name: "Gauteng",
        code: "GP",
        cities: [
            { name: "Johannesburg", coordinates: { lat: -26.2041, lng: 28.0473 }, province: "Gauteng" },
            { name: "Pretoria", coordinates: { lat: -25.7479, lng: 28.2293 }, province: "Gauteng" },
            { name: "Centurion", coordinates: { lat: -25.8603, lng: 28.1894 }, province: "Gauteng" },
            { name: "Sandton", coordinates: { lat: -26.1076, lng: 28.0567 }, province: "Gauteng" },
            { name: "Randburg", coordinates: { lat: -26.0944, lng: 27.9983 }, province: "Gauteng" },
            { name: "Roodepoort", coordinates: { lat: -26.1625, lng: 27.8725 }, province: "Gauteng" },
            { name: "Krugersdorp", coordinates: { lat: -26.1011, lng: 27.7697 }, province: "Gauteng" },
            { name: "Boksburg", coordinates: { lat: -26.2111, lng: 28.2592 }, province: "Gauteng" },
            { name: "Benoni", coordinates: { lat: -26.1885, lng: 28.3206 }, province: "Gauteng" },
            { name: "Springs", coordinates: { lat: -26.2549, lng: 28.3984 }, province: "Gauteng" },
            { name: "Brakpan", coordinates: { lat: -26.2366, lng: 28.3694 }, province: "Gauteng" },
            { name: "Kempton Park", coordinates: { lat: -26.1083, lng: 28.2333 }, province: "Gauteng" },
            { name: "Edenvale", coordinates: { lat: -26.1406, lng: 28.1525 }, province: "Gauteng" },
            { name: "Germiston", coordinates: { lat: -26.2217, lng: 28.1700 }, province: "Gauteng" },
            { name: "Alberton", coordinates: { lat: -26.2678, lng: 28.1222 }, province: "Gauteng" },
            { name: "Vereeniging", coordinates: { lat: -26.6731, lng: 27.9261 }, province: "Gauteng" },
            { name: "Vanderbijlpark", coordinates: { lat: -26.6992, lng: 27.8356 }, province: "Gauteng" },
            { name: "Sasolburg", coordinates: { lat: -26.8139, lng: 27.8167 }, province: "Gauteng" },
            { name: "Heidelberg", coordinates: { lat: -26.5047, lng: 28.3592 }, province: "Gauteng" },
            { name: "Meyerton", coordinates: { lat: -26.5500, lng: 28.0167 }, province: "Gauteng" }
        ]
    },
    {
        name: "Western Cape",
        code: "WC",
        cities: [
            { name: "Cape Town", coordinates: { lat: -33.9249, lng: 18.4241 }, province: "Western Cape" },
            { name: "Bellville", coordinates: { lat: -33.9300, lng: 18.6400 }, province: "Western Cape" },
            { name: "Stellenbosch", coordinates: { lat: -33.9321, lng: 18.8602 }, province: "Western Cape" },
            { name: "Paarl", coordinates: { lat: -33.7312, lng: 18.9752 }, province: "Western Cape" },
            { name: "Worcester", coordinates: { lat: -33.6461, lng: 19.4489 }, province: "Western Cape" },
            { name: "George", coordinates: { lat: -33.9715, lng: 22.4571 }, province: "Western Cape" },
            { name: "Mossel Bay", coordinates: { lat: -34.1833, lng: 22.1333 }, province: "Western Cape" },
            { name: "Oudtshoorn", coordinates: { lat: -33.6000, lng: 22.2000 }, province: "Western Cape" },
            { name: "Knysna", coordinates: { lat: -34.0353, lng: 23.0465 }, province: "Western Cape" },
            { name: "Plettenberg Bay", coordinates: { lat: -34.0500, lng: 23.3667 }, province: "Western Cape" },
            { name: "Swellendam", coordinates: { lat: -34.0167, lng: 20.4333 }, province: "Western Cape" },
            { name: "Caledon", coordinates: { lat: -34.2333, lng: 19.4167 }, province: "Western Cape" },
            { name: "Hermanus", coordinates: { lat: -34.4167, lng: 19.2333 }, province: "Western Cape" },
            { name: "Somerset West", coordinates: { lat: -34.0833, lng: 18.8500 }, province: "Western Cape" },
            { name: "Kuils River", coordinates: { lat: -33.9333, lng: 18.6667 }, province: "Western Cape" },
            { name: "Brackenfell", coordinates: { lat: -33.8667, lng: 18.7000 }, province: "Western Cape" },
            { name: "Kraaifontein", coordinates: { lat: -33.8500, lng: 18.7167 }, province: "Western Cape" },
            { name: "Goodwood", coordinates: { lat: -33.9167, lng: 18.5500 }, province: "Western Cape" },
            { name: "Parow", coordinates: { lat: -33.9000, lng: 18.6000 }, province: "Western Cape" },
            { name: "Durbanville", coordinates: { lat: -33.8333, lng: 18.6500 }, province: "Western Cape" }
        ]
    },
    {
        name: "KwaZulu-Natal",
        code: "KZN",
        cities: [
            { name: "Durban", coordinates: { lat: -29.8587, lng: 31.0218 }, province: "KwaZulu-Natal" },
            { name: "Pietermaritzburg", coordinates: { lat: -29.6000, lng: 30.3833 }, province: "KwaZulu-Natal" },
            { name: "Newcastle", coordinates: { lat: -27.7500, lng: 29.9333 }, province: "KwaZulu-Natal" },
            { name: "Ladysmith", coordinates: { lat: -28.5500, lng: 29.7833 }, province: "KwaZulu-Natal" },
            { name: "Richards Bay", coordinates: { lat: -28.7833, lng: 32.0333 }, province: "KwaZulu-Natal" },
            { name: "Empangeni", coordinates: { lat: -28.7500, lng: 31.9000 }, province: "KwaZulu-Natal" },
            { name: "Vryheid", coordinates: { lat: -27.7667, lng: 30.8000 }, province: "KwaZulu-Natal" },
            { name: "Dundee", coordinates: { lat: -28.1667, lng: 30.2333 }, province: "KwaZulu-Natal" },
            { name: "Glencoe", coordinates: { lat: -28.1833, lng: 30.1500 }, province: "KwaZulu-Natal" },
            { name: "Pinetown", coordinates: { lat: -29.8167, lng: 30.8500 }, province: "KwaZulu-Natal" },
            { name: "Westville", coordinates: { lat: -29.8167, lng: 30.9333 }, province: "KwaZulu-Natal" },
            { name: "Amanzimtoti", coordinates: { lat: -30.0500, lng: 30.8833 }, province: "KwaZulu-Natal" },
            { name: "Ballito", coordinates: { lat: -29.5333, lng: 31.2167 }, province: "KwaZulu-Natal" },
            { name: "Umkomaas", coordinates: { lat: -30.2000, lng: 30.8000 }, province: "KwaZulu-Natal" },
            { name: "Scottburgh", coordinates: { lat: -30.2833, lng: 30.7500 }, province: "KwaZulu-Natal" },
            { name: "Margate", coordinates: { lat: -30.8500, lng: 30.3667 }, province: "KwaZulu-Natal" },
            { name: "Port Shepstone", coordinates: { lat: -30.7500, lng: 30.4500 }, province: "KwaZulu-Natal" },
            { name: "Hibberdene", coordinates: { lat: -30.5667, lng: 30.5667 }, province: "KwaZulu-Natal" },
            { name: "Umzinto", coordinates: { lat: -30.3167, lng: 30.6667 }, province: "KwaZulu-Natal" },
            { name: "Kingsburgh", coordinates: { lat: -30.0833, lng: 30.8333 }, province: "KwaZulu-Natal" }
        ]
    },
    {
        name: "Eastern Cape",
        code: "EC",
        cities: [
            { name: "Port Elizabeth", coordinates: { lat: -33.7139, lng: 25.5207 }, province: "Eastern Cape" },
            { name: "East London", coordinates: { lat: -33.0292, lng: 27.8546 }, province: "Eastern Cape" },
            { name: "Mthatha", coordinates: { lat: -31.5889, lng: 28.7844 }, province: "Eastern Cape" },
            { name: "Queenstown", coordinates: { lat: -31.9000, lng: 26.8833 }, province: "Eastern Cape" },
            { name: "King William's Town", coordinates: { lat: -32.8833, lng: 27.4000 }, province: "Eastern Cape" },
            { name: "Grahamstown", coordinates: { lat: -33.3000, lng: 26.5333 }, province: "Eastern Cape" },
            { name: "Uitenhage", coordinates: { lat: -33.7667, lng: 25.4000 }, province: "Eastern Cape" },
            { name: "Jeffreys Bay", coordinates: { lat: -34.0500, lng: 24.9167 }, province: "Eastern Cape" },
            { name: "Port Alfred", coordinates: { lat: -33.6000, lng: 26.9000 }, province: "Eastern Cape" },
            { name: "Graaff-Reinet", coordinates: { lat: -32.2500, lng: 24.5500 }, province: "Eastern Cape" },
            { name: "Cradock", coordinates: { lat: -32.1667, lng: 25.6167 }, province: "Eastern Cape" },
            { name: "Aliwal North", coordinates: { lat: -30.7000, lng: 26.7000 }, province: "Eastern Cape" },
            { name: "Butterworth", coordinates: { lat: -32.3333, lng: 28.1500 }, province: "Eastern Cape" },
            { name: "Mount Frere", coordinates: { lat: -30.9167, lng: 28.9833 }, province: "Eastern Cape" },
            { name: "Lusikisiki", coordinates: { lat: -31.3667, lng: 29.5667 }, province: "Eastern Cape" },
            { name: "Port St Johns", coordinates: { lat: -31.6167, lng: 29.5333 }, province: "Eastern Cape" },
            { name: "Kokstad", coordinates: { lat: -30.5500, lng: 29.4167 }, province: "Eastern Cape" },
            { name: "Matatiele", coordinates: { lat: -30.3333, lng: 28.8167 }, province: "Eastern Cape" },
            { name: "Barkly East", coordinates: { lat: -30.9667, lng: 27.6000 }, province: "Eastern Cape" },
            { name: "Lady Grey", coordinates: { lat: -30.7167, lng: 27.2167 }, province: "Eastern Cape" }
        ]
    },
    {
        name: "Free State",
        code: "FS",
        cities: [
            { name: "Bloemfontein", coordinates: { lat: -29.0852, lng: 26.1596 }, province: "Free State" },
            { name: "Welkom", coordinates: { lat: -27.9833, lng: 26.7333 }, province: "Free State" },
            { name: "Kroonstad", coordinates: { lat: -27.6500, lng: 27.2333 }, province: "Free State" },
            { name: "Bethlehem", coordinates: { lat: -28.2333, lng: 28.3000 }, province: "Free State" },
            { name: "Harrismith", coordinates: { lat: -28.2667, lng: 29.1333 }, province: "Free State" },
            { name: "Sasolburg", coordinates: { lat: -26.8139, lng: 27.8167 }, province: "Free State" },
            { name: "Virginia", coordinates: { lat: -28.1000, lng: 26.8667 }, province: "Free State" },
            { name: "Odendaalsrus", coordinates: { lat: -27.8667, lng: 26.6833 }, province: "Free State" },
            { name: "Bothaville", coordinates: { lat: -27.3833, lng: 26.6167 }, province: "Free State" },
            { name: "Parys", coordinates: { lat: -26.9000, lng: 27.4500 }, province: "Free State" },
            { name: "Vredefort", coordinates: { lat: -27.0167, lng: 27.3667 }, province: "Free State" },
            { name: "Villiers", coordinates: { lat: -27.0333, lng: 28.6000 }, province: "Free State" },
            { name: "Frankfort", coordinates: { lat: -27.2833, lng: 28.4833 }, province: "Free State" },
            { name: "Heilbron", coordinates: { lat: -27.2833, lng: 27.9667 }, province: "Free State" },
            { name: "Lindley", coordinates: { lat: -27.8833, lng: 27.9167 }, province: "Free State" },
            { name: "Senekal", coordinates: { lat: -28.3167, lng: 27.6167 }, province: "Free State" },
            { name: "Ficksburg", coordinates: { lat: -28.8667, lng: 27.8667 }, province: "Free State" },
            { name: "Clarens", coordinates: { lat: -28.5167, lng: 28.4167 }, province: "Free State" },
            { name: "Phuthaditjhaba", coordinates: { lat: -28.5333, lng: 28.8167 }, province: "Free State" },
            { name: "Warden", coordinates: { lat: -27.8500, lng: 28.9833 }, province: "Free State" }
        ]
    },
    {
        name: "Mpumalanga",
        code: "MP",
        cities: [
            { name: "Nelspruit", coordinates: { lat: -25.4753, lng: 30.9694 }, province: "Mpumalanga" },
            { name: "Witbank", coordinates: { lat: -25.8667, lng: 29.2333 }, province: "Mpumalanga" },
            { name: "Secunda", coordinates: { lat: -26.5500, lng: 29.1667 }, province: "Mpumalanga" },
            { name: "Middelburg", coordinates: { lat: -25.7667, lng: 29.4667 }, province: "Mpumalanga" },
            { name: "Standerton", coordinates: { lat: -26.9500, lng: 29.2333 }, province: "Mpumalanga" },
            { name: "Bethal", coordinates: { lat: -26.4500, lng: 29.4667 }, province: "Mpumalanga" },
            { name: "Ermelo", coordinates: { lat: -26.5333, lng: 29.9833 }, province: "Mpumalanga" },
            { name: "Piet Retief", coordinates: { lat: -27.0000, lng: 30.8000 }, province: "Mpumalanga" },
            { name: "Carolina", coordinates: { lat: -26.0667, lng: 30.1167 }, province: "Mpumalanga" },
            { name: "Barberton", coordinates: { lat: -25.7833, lng: 31.0500 }, province: "Mpumalanga" },
            { name: "White River", coordinates: { lat: -25.3333, lng: 31.0167 }, province: "Mpumalanga" },
            { name: "Hazyview", coordinates: { lat: -25.0500, lng: 31.1167 }, province: "Mpumalanga" },
            { name: "Sabie", coordinates: { lat: -25.1000, lng: 30.7833 }, province: "Mpumalanga" },
            { name: "Graskop", coordinates: { lat: -24.9333, lng: 30.8333 }, province: "Mpumalanga" },
            { name: "Lydenburg", coordinates: { lat: -25.1000, lng: 30.4500 }, province: "Mpumalanga" },
            { name: "Belfast", coordinates: { lat: -25.6833, lng: 30.0167 }, province: "Mpumalanga" },
            { name: "Dullstroom", coordinates: { lat: -25.4167, lng: 30.1000 }, province: "Mpumalanga" },
            { name: "Machadodorp", coordinates: { lat: -25.6500, lng: 30.2500 }, province: "Mpumalanga" },
            { name: "Waterval Boven", coordinates: { lat: -25.6500, lng: 30.3333 }, province: "Mpumalanga" },
            { name: "Waterval Onder", coordinates: { lat: -25.6333, lng: 30.3500 }, province: "Mpumalanga" }
        ]
    },
    {
        name: "Limpopo",
        code: "LP",
        cities: [
            { name: "Polokwane", coordinates: { lat: -23.9045, lng: 29.4698 }, province: "Limpopo" },
            { name: "Tzaneen", coordinates: { lat: -23.8333, lng: 30.1667 }, province: "Limpopo" },
            { name: "Phalaborwa", coordinates: { lat: -23.9500, lng: 31.1167 }, province: "Limpopo" },
            { name: "Louis Trichardt", coordinates: { lat: -23.0500, lng: 29.9000 }, province: "Limpopo" },
            { name: "Thohoyandou", coordinates: { lat: -22.9500, lng: 30.4833 }, province: "Limpopo" },
            { name: "Giyani", coordinates: { lat: -23.3167, lng: 30.7167 }, province: "Limpopo" },
            { name: "Modimolle", coordinates: { lat: -24.7000, lng: 28.4000 }, province: "Limpopo" },
            { name: "Bela-Bela", coordinates: { lat: -24.8833, lng: 28.2833 }, province: "Limpopo" },
            { name: "Mokopane", coordinates: { lat: -24.1833, lng: 29.0167 }, province: "Limpopo" },
            { name: "Lephalale", coordinates: { lat: -23.6667, lng: 27.7500 }, province: "Limpopo" },
            { name: "Thabazimbi", coordinates: { lat: -24.6000, lng: 27.4000 }, province: "Limpopo" },
            { name: "Rustenburg", coordinates: { lat: -25.6667, lng: 27.2333 }, province: "Limpopo" },
            { name: "Brits", coordinates: { lat: -25.6333, lng: 27.7833 }, province: "Limpopo" },
            { name: "Warmbaths", coordinates: { lat: -24.8833, lng: 28.2833 }, province: "Limpopo" },
            { name: "Nylstroom", coordinates: { lat: -24.7000, lng: 28.4000 }, province: "Limpopo" },
            { name: "Potgietersrus", coordinates: { lat: -24.1833, lng: 29.0167 }, province: "Limpopo" },
            { name: "Ellisras", coordinates: { lat: -23.6667, lng: 27.7500 }, province: "Limpopo" },
            { name: "Pietersburg", coordinates: { lat: -23.9045, lng: 29.4698 }, province: "Limpopo" },
            { name: "Messina", coordinates: { lat: -22.3500, lng: 30.0333 }, province: "Limpopo" },
            { name: "Sibasa", coordinates: { lat: -22.9500, lng: 30.4833 }, province: "Limpopo" }
        ]
    },
    {
        name: "North West",
        code: "NW",
        cities: [
            { name: "Mahikeng", coordinates: { lat: -25.8652, lng: 25.6442 }, province: "North West" },
            { name: "Klerksdorp", coordinates: { lat: -26.8667, lng: 26.6667 }, province: "North West" },
            { name: "Potchefstroom", coordinates: { lat: -26.7167, lng: 27.1000 }, province: "North West" },
            { name: "Rustenburg", coordinates: { lat: -25.6667, lng: 27.2333 }, province: "North West" },
            { name: "Brits", coordinates: { lat: -25.6333, lng: 27.7833 }, province: "North West" },
            { name: "Lichtenburg", coordinates: { lat: -26.1500, lng: 26.1667 }, province: "North West" },
            { name: "Vryburg", coordinates: { lat: -26.9500, lng: 24.7333 }, province: "North West" },
            { name: "Kuruman", coordinates: { lat: -27.4500, lng: 23.4333 }, province: "North West" },
            { name: "Taung", coordinates: { lat: -27.5333, lng: 24.7833 }, province: "North West" },
            { name: "Christian", coordinates: { lat: -25.8667, lng: 25.6442 }, province: "North West" },
            { name: "Orkney", coordinates: { lat: -26.9833, lng: 26.6667 }, province: "North West" },
            { name: "Stilfontein", coordinates: { lat: -26.8500, lng: 26.7833 }, province: "North West" },
            { name: "Hartbeesfontein", coordinates: { lat: -26.7667, lng: 26.3667 }, province: "North West" },
            { name: "Ventersdorp", coordinates: { lat: -26.3167, lng: 26.8167 }, province: "North West" },
            { name: "Coligny", coordinates: { lat: -26.3333, lng: 26.3167 }, province: "North West" },
            { name: "Delareyville", coordinates: { lat: -26.6833, lng: 25.4667 }, province: "North West" },
            { name: "Sannieshof", coordinates: { lat: -26.5500, lng: 25.6333 }, province: "North West" },
            { name: "Ottosdal", coordinates: { lat: -26.8167, lng: 26.0000 }, province: "North West" },
            { name: "Wolmaransstad", coordinates: { lat: -27.2000, lng: 25.9833 }, province: "North West" },
            { name: "Bloemhof", coordinates: { lat: -27.6500, lng: 25.6000 }, province: "North West" }
        ]
    },
    {
        name: "Northern Cape",
        code: "NC",
        cities: [
            { name: "Kimberley", coordinates: { lat: -28.7282, lng: 24.7499 }, province: "Northern Cape" },
            { name: "Upington", coordinates: { lat: -28.4500, lng: 21.2500 }, province: "Northern Cape" },
            { name: "Springbok", coordinates: { lat: -29.6667, lng: 17.8833 }, province: "Northern Cape" },
            { name: "De Aar", coordinates: { lat: -30.6500, lng: 24.0167 }, province: "Northern Cape" },
            { name: "Colesberg", coordinates: { lat: -30.7167, lng: 25.1000 }, province: "Northern Cape" },
            { name: "Prieska", coordinates: { lat: -29.6833, lng: 22.7500 }, province: "Northern Cape" },
            { name: "Calvinia", coordinates: { lat: -31.4667, lng: 19.7667 }, province: "Northern Cape" },
            { name: "Carnarvon", coordinates: { lat: -30.9667, lng: 22.1333 }, province: "Northern Cape" },
            { name: "Williston", coordinates: { lat: -31.3333, lng: 20.8833 }, province: "Northern Cape" },
            { name: "Fraserburg", coordinates: { lat: -31.9167, lng: 21.5167 }, province: "Northern Cape" },
            { name: "Sutherland", coordinates: { lat: -32.4000, lng: 20.6667 }, province: "Northern Cape" },
            { name: "Victoria West", coordinates: { lat: -31.4000, lng: 23.1167 }, province: "Northern Cape" },
            { name: "Beaufort West", coordinates: { lat: -32.3500, lng: 22.5833 }, province: "Northern Cape" },
            { name: "Laingsburg", coordinates: { lat: -33.2000, lng: 20.8500 }, province: "Northern Cape" },
            { name: "Prince Albert", coordinates: { lat: -33.2167, lng: 22.0333 }, province: "Northern Cape" },
            { name: "Oudtshoorn", coordinates: { lat: -33.6000, lng: 22.2000 }, province: "Northern Cape" },
            { name: "George", coordinates: { lat: -33.9715, lng: 22.4571 }, province: "Northern Cape" },
            { name: "Mossel Bay", coordinates: { lat: -34.1833, lng: 22.1333 }, province: "Northern Cape" },
            { name: "Knysna", coordinates: { lat: -34.0353, lng: 23.0465 }, province: "Northern Cape" },
            { name: "Plettenberg Bay", coordinates: { lat: -34.0500, lng: 23.3667 }, province: "Northern Cape" }
        ]
    }
];

export const getAllCities = (): SouthAfricanCity[] => {
    return SOUTH_AFRICAN_PROVINCES.flatMap(province => province.cities);
};

export const getCitiesByProvince = (provinceName: string): SouthAfricanCity[] => {
    const province = SOUTH_AFRICAN_PROVINCES.find(p => p.name === provinceName);
    return province ? province.cities : [];
};

export const getCityCoordinates = (cityName: string, provinceName?: string): { lat: number; lng: number; } | null => {
    if (provinceName) {
        const province = SOUTH_AFRICAN_PROVINCES.find(p => p.name === provinceName);
        const city = province?.cities.find(c => c.name === cityName);
        return city ? city.coordinates : null;
    }

    const allCities = getAllCities();
    const city = allCities.find(c => c.name === cityName);
    return city ? city.coordinates : null;
};

export const getProvinceByCity = (cityName: string): string | null => {
    const allCities = getAllCities();
    const city = allCities.find(c => c.name === cityName);
    return city ? city.province : null;
}; 