import fs from 'fs/promises';
import path from 'path';
import Park from "../../domain/models/Park";

async function loadParksData(): Promise<any[]> {
    const dataFolderPath = path.resolve(__dirname, '../../data');
    const filePath = path.join(dataFolderPath, 'town-parks-krakow.json');

    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

export async function importParksData(): Promise<void> {
    const parksData = await loadParksData();

    const mappedData = parksData.map(item => {
        let consumptionCO = Math.ceil(item.Powierzchnia_ha * 3000);
        return ({
            lp: item.Lp,
            type: item.Typ,
            name: item.Nazwa,
            district: item.Dzielnica,
            areaHa: item.Powierzchnia_ha,
            consumptionCO: consumptionCO,
        });
    });

    await Park.deleteMany({});
    await Park.create(mappedData);
}
