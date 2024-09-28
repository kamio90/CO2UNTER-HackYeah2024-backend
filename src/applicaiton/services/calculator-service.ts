import {IUser} from "../../domain/models/User";
import Park from "../../domain/models/Park";
import SmalPark from "../../domain/models/SmallPark";

type FuelEmission = {
    fuelType: string;
    averageEmission: number;
};

type TreeType = {
    treeType: string;
    coConsumption: number;
};

function createEmissionDictionary(): Record<string, number> {
    const data: FuelEmission[] = [
        {fuelType: "diesel", averageEmission: 0.1698},
        {fuelType: "gasoline", averageEmission: 0.1639},
        {fuelType: "electric", averageEmission: 0.6588}
    ];

    const dictionary: Record<string, number> = {};

    data.forEach(item => {
        dictionary[item.fuelType] = item.averageEmission;
    });

    return dictionary;
}

function createTreeDictionary(): Record<string, number> {
    const data: TreeType[] = [
        {treeType: "sadzonka", coConsumption: 0.0075},
        {treeType: "drzewoI", coConsumption: 45},
        {treeType: "drzewoL", coConsumption: 25},
        {treeType: "stareDrzewoI", coConsumption: 20},
        {treeType: "stareDrzewoL", coConsumption: 15}
    ];

    const dictionary: Record<string, number> = {};

    data.forEach(item => {
        dictionary[item.treeType] = item.coConsumption;
    });

    return dictionary;
}



function createEmissionData(
    yourEmission: number,
    park: string,
    sadzonka: number,
    drzewoL: number,
    drzewoI: number,
    stareDrzewoL: number,
    stareDrzewoI: number
): {
    yourEmission: number;
    park: string;
    sadzonka: number;
    drzewoL: number;
    drzewoI: number;
    stareDrzewoL: number;
    stareDrzewoI: number;
} {
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

function createTransportData(carEmission: number, publicTransportEmission: number, bicycleEmission: number){
    return {carEmission, publicTransportEmission, bicycleEmission};
}

export async function calculateEmission(user: IUser): Promise<any> {
    const dayMap = new Map<string, number>();
    dayMap.set("day", 365);
    dayMap.set("week", 52);
    dayMap.set("month", 12);
    const data = createEmissionDictionary();
    // @ts-ignore
    let number = data[user.fuelType] * user.distance * dayMap.get(user.timePeriod);
    const parks = await Park.find({consumptionCO: {$lte: number}}).exec();
    const smallParks = await SmalPark.find({consumptionCO: {$lte: number}}).exec();
    const trees = createTreeDictionary();
    if (parks) {
        return createEmissionData(number, parks[0].name, Math.ceil(number / trees["sadzonka"]),
            Math.ceil(number / trees["drzewoL"]), Math.ceil(number / trees["drzewoI"]),
            Math.ceil(number / trees["stareDrzewoL"]), Math.ceil(number / trees["stareDrzewoI"]));
    }
    if (smallParks) {
        return createEmissionData(number, smallParks[0].name, Math.ceil(number / trees["sadzonka"]),
            Math.ceil(number / trees["drzewoL"]), Math.ceil(number / trees["drzewoI"]),
            Math.ceil(number / trees["stareDrzewoL"]), Math.ceil(number / trees["stareDrzewoI"]));
    } else {
        return createEmissionData(number, "No park can sustain your CO2 emission", Math.ceil(number / trees["sadzonka"]),
            Math.ceil(number / trees["drzewoL"]), Math.ceil(number / trees["drzewoI"]),
            Math.ceil(number / trees["stareDrzewoL"]), Math.ceil(number / trees["stareDrzewoI"]));
    }
}

export async function transportCalc(user: IUser) {
    const dayMap = new Map<string, number>();
    dayMap.set("day", 365);
    dayMap.set("week", 52);
    dayMap.set("month", 12);
    const data = createEmissionDictionary();
    // @ts-ignore
    let number = data[user.fuelType] * user.distance * dayMap.get(user.timePeriod);
    return createTransportData(number, 0.014 * user.distance, 0.005 * user.distance)
}
