import {Seeder, SeederFactoryManager} from "typeorm-extension";
import {DataSource} from "typeorm";
import {Menu} from "../entities/Menu";

export class MenuSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const menuRepository = dataSource.getRepository(Menu);

        const menuData = [
            {
                id:1,
                name:"HOME",
                icon:"fas fa-home",
                link:"includes/home.html",
                order:1,
            },
            {
                id:2,
                name:"GERIR CLIENTE",
                icon:"fas fa-users",
                link:"includes/cliente.html",
                order:2,
            },
            {
                id:3,
                name:"GERIR UTILIZADORES",
                icon:"fas fa-user-circle",
                link:"includes/utilizadores.html",
                order:3,
            },
        ]

        for (const menu of menuData) {
            const menuExists = await menuRepository.findOneBy({
                name: menu.name,
                link: menu.link,
                icon: menu.icon,
                status: 1
            });

            if (!menuExists) {
                const menuCreate = menuRepository.create(menu);
                await menuRepository.save(menuCreate);
            }
        }

    }
}