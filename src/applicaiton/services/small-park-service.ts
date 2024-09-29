import path from "path";
import fs from "fs/promises";
import SmallParkSchema from "../../domain/models/SmallPark";

async function loadParksData(filename: string): Promise<any[]> {
    const dataFolderPath = path.resolve(__dirname, '../../data');
    const filePath = path.join(dataFolderPath, filename);

    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

export async function importSmallParksData(): Promise<void> {
    const parksData = await loadParksData('small-parks-krakow.json');

    const mappedData = parksData.map(item => ({
        lp: item.Lp,
        type: item.TYP,
        name: item.NAZWA,
        district: item.DZIELNICA,
        districtNumber: item['NR DZIELNICY'],
        status: item.STATUS_TER,
        accessibility: item.DOSTĘPNOSĆ,
        mpzpDane: item.MPZP_DANE,
        areaHa: item.POW_HA,
        consumptionCO: Math.ceil(item.POW_HA * 3000),
    }));

    await SmallParkSchema.deleteMany({});
    await SmallParkSchema.create(mappedData);
}