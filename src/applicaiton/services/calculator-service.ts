import {IUser} from "../../domain/models/User";
import Park from "../../domain/models/Park";
import SmallPark from "../../domain/models/SmallPark";
import {IEvent} from "../../domain/models/Event";
import {IServiceSector} from "../../domain/models/ServiceSector";

function createEmissionDictionary(): Map<string, number> {
    const data: { fuelType: string, averageEmission: number }[] = [
        {fuelType: "diesel", averageEmission: 0.1698},
        {fuelType: "gasoline", averageEmission: 0.1639},
        {fuelType: "electric", averageEmission: 0.6588}
    ];

    const emissionMap = new Map<string, number>();

    data.forEach(item => {
        emissionMap.set(item.fuelType, item.averageEmission);
    });

    return emissionMap;
}


function createTreeDictionary(): Map<string, number> {
    const data: { treeType: string, coConsumption: number }[] = [
        {treeType: "sadzonka", coConsumption: 0.0075},
        {treeType: "drzewoI", coConsumption: 45},
        {treeType: "drzewoL", coConsumption: 25},
        {treeType: "stareDrzewoI", coConsumption: 20},
        {treeType: "stareDrzewoL", coConsumption: 15}
    ];

    const treeMap = new Map<string, number>();

    data.forEach(item => {
        treeMap.set(item.treeType, item.coConsumption);
    });

    return treeMap;
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
    console.log(emission)
    const parks = await Park.find({consumptionCO: {$lte: emission}}).exec();
    const smallParks = await SmallPark.find({consumptionCO: {$lte: emission}}).exec();
    return parks.length > 0 ? parks[0] : smallParks.length > 0 ? smallParks[0] : null;
}

function generateEmissionResponse(
    emission: number,
    park: string | null,
    trees: Map<string, number>
) {
    //@ts-ignore
    let sadzonka: number = trees.get("sadzonka");
    //@ts-ignore
    let drzewoL: number = trees.get("drzewoL");
    //@ts-ignore
    let drzewoI: number = trees.get("drzewoI");
    //@ts-ignore
    let stareDrzewoL: number = trees.get("stareDrzewoL");
    //@ts-ignore
    let stareDrzewoI: number = trees.get("stareDrzewoI");
    // @ts-ignore
    return createEmissionData(
        emission,
        park ?? "No park can sustain your CO2 emission",
        Math.ceil(emission / sadzonka),
        Math.ceil(emission / drzewoL),
        Math.ceil(emission / drzewoI),
        Math.ceil(emission / stareDrzewoL),
        Math.ceil(emission / stareDrzewoI)
    );
}

async function calculateEmission(emission: number) {
    const trees = createTreeDictionary();
    const park = await findSuitableParks(emission);
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
    const dietEmission = Math.ceil(dietMap.get(user.dietType) / dayMap.get(user.timePeriod)) || 0;
    //@ts-ignore
    const emission = data.get(user.fuelType) * user.distance * dayMap.get(user.timePeriod) + dietEmission;
    return calculateEmission(emission);
}


export async function showDietEmission(diet: string): Promise<any> {
    const dietMap = new Map<string, number>([
        ["omnivore", 350],
        ["vegetarian", 225],
        ['vegan', 125]
    ]);
    return dietMap.get(diet);
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
