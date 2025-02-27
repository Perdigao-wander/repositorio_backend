import {runSeeder, Seeder, SeederFactoryManager} from "typeorm-extension";
import {UserSeeder} from "./UserSeeder";
import {DataSource} from "typeorm";
import {DomainSeeder} from "./DomainSeeder";
import {MenuSeeder} from "./MenuSeeder";
import {CustomerSeeder} from "./CustomerSeeder";

export class MainSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        await runSeeder(dataSource, MenuSeeder);
        await runSeeder(dataSource, DomainSeeder);
        await runSeeder(dataSource, UserSeeder);
        //await runSeeder(dataSource, CustomerSeeder);
    }
}