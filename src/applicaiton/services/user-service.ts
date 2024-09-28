import fs from 'fs/promises';
import path from 'path';
import User from "../../domain/models/User";

async function loadUsersData(): Promise<any[]> {
    const dataFolderPath = path.resolve(__dirname, '../../data');
    const filePath = path.join(dataFolderPath, 'users-fake.json');

    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

export async function importUsersData(): Promise<void> {
    const usersData = await loadUsersData();

    const mappedData = usersData.map(item => ({
        averageConsumption: item.averageConsumption,
        distance: item.distance,
        fuelType: item.fuelType,
        passengers: item.passengers,
        vehicleType: item.vehicleType,
    }));

    await User.deleteMany({});
    await User.create(mappedData);
}