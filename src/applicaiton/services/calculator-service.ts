import {IUser} from "../../domain/models/User";
import Park from "../../domain/models/Park";
import SmallPark from "../../domain/models/SmallPark";
import {IEvent} from "../../domain/models/Event";
import {IServiceSector} from "../../domain/models/ServiceSector";

type FuelEmission = {
    fuelType: string;
    averageEmission: number;
};

type TreeType = {
    treeType: string;
    coConsumption: number;
};

function createDictionary<T extends { [key: string]: number }>(data: T[]): Map<string, number> {
    return data.reduce((dictionary, item) => {
        const key = Object.keys(item)[0];
        // @ts-ignore
        dictionary[key] = item[key];
        return dictionary;
    }, {} as Map<string, number>);
}

function createEmissionDictionary(): Map<string, number> {
    const data: FuelEmission[] = [
        {fuelType: "diesel", averageEmission: 0.1698},
        {fuelType: "gasoline", averageEmission: 0.1639},
        {fuelType: "electric", averageEmission: 0.6588}
    ];
    // @ts-ignore
    return createDictionary(data);
}

function createTreeDictionary(): Map<string, number> {
    const data: TreeType[] = [
        {treeType: "sadzonka", coConsumption: 0.0075},
        {treeType: "drzewoI", coConsumption: 45},
        {treeType: "drzewoL", coConsumption: 25},
        {treeType: "stareDrzewoI", coConsumption: 20},
        {treeType: "stareDrzewoL", coConsumption: 15}
    ];
    // @ts-ignore
    return createDictionary(data);
}

function createEmissionData(
    yourEmission: number,
    park: string,
    sadzonka: number,
    drzewoL: number,
    drzewoI: number,
    stareDrzewoL: number,
    stareDrzewoI: number
) {
    return {
        yourEmission,
        park,
        sadzonka,
        drzewoL,
        drzewoI,
        stareDrzewoL,
        stareDrzewoI
    };
}

function createTransportData(carEmission: number, publicTransportEmission: number, bicycleEmission: number) {
    return {carEmission, publicTransportEmission, bicycleEmission};
}

async function findSuitableParks(emission: number) {
    const parks = await Park.find({consumptionCO: {$lte: emission}}).exec();
    const smallParks = await SmallPark.find({consumptionCO: {$lte: emission}}).exec();
    return parks.length > 0 ? parks[0] : smallParks.length > 0 ? smallParks[0] : null;
}

function generateEmissionResponse(
    emission: number,
    park: string | null,
    trees: Record<string, number>
) {
    return createEmissionData(
        emission,
        park ?? "No park can sustain your CO2 emission",
        Math.ceil(emission / trees["sadzonka"]),
        Math.ceil(emission / trees["drzewoL"]),
        Math.ceil(emission / trees["drzewoI"]),
        Math.ceil(emission / trees["stareDrzewoL"]),
        Math.ceil(emission / trees["stareDrzewoI"])
    );
}

async function calculateEmission(emission: number) {
    const trees = createTreeDictionary();
    const park = await findSuitableParks(emission);
    // @ts-ignore
    return generateEmissionResponse(emission, park?.name || null, trees);
}

export async function calculateUserEmission(user: IUser): Promise<any> {
    const dayMap = new Map<string, number>([
        ["day", 365],
        ["week", 52],
        ["month", 12]
    ]);
    const dietMap = new Map<string, number>([
        ["omnivore", 350],
        ["vegetarian", 225],
        ['vegan', 125]
    ]);
    const data = createEmissionDictionary();
    //@ts-ignore
    const dietEmission = Math.ceil(dietMap.get(user.dietType) / dayMap.get(user.timePeriod));
    //@ts-ignore
    const emission = data[user.fuelType] * user.distance * dayMap.get(user.timePeriod) + dietEmission;
    return calculateEmission(emission);
}

export async function calculateEventEmission(event: IEvent): Promise<any> {
    return calculateEmission(event.emissions);
}

export async function transportCalc(user: IUser): Promise<any> {
    const dayMap = new Map<string, number>([
        ["day", 365],
        ["week", 52],
        ["month", 12]
    ]);

    const data = createEmissionDictionary();
    //@ts-ignore
    const carEmission = data[user.fuelType] * user.distance * dayMap.get(user.timePeriod);
    return createTransportData(carEmission, 0.014 * user.distance, 0.005 * user.distance);
}

export async function calculateServiceSector(service: IServiceSector): Promise<any> {
    const emission = service.eatingOutFrequency * 7 + service.hotelUsageFrequency * 25 + service.shoppingFrequency * 2.5;
    return calculateEmission(emission);
}
