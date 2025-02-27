import {Seeder, SeederFactoryManager} from "typeorm-extension";
import {DataSource} from "typeorm";
import bcrypt from "bcrypt";
import {User} from "../entities/User";
import {UserMenu} from "../entities/User_Menu";

export class UserSeeder implements Seeder{
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {

        const userRepository = dataSource.getRepository(User);
        const menuRepository = dataSource.getRepository(UserMenu);

        const userData = {
            id:"f1684f47-25fb-4aff-9cc6-d4de8de01cdf",
            name:"System",
            surname:"Default",
            email:"system@default.com",
            username:"system",
            password: await bcrypt.hash('default@[].2053@432', 10),
        }

        const menuData = [
            {
                user_owner_uuid: userData.id,
                menu_uuid: 1,
            },
            {
                user_owner_uuid: userData.id,
                menu_uuid: 2,
            },
            {
                user_owner_uuid: userData.id,
                menu_uuid: 3,
            },
        ]

        const userExists = await userRepository.findOneBy({email: userData.email});

        if (!userExists) {
            const newUser = userRepository.create(userData);

            await userRepository.save(newUser);
        }

        for (const menu of menuData) {
            const menuExists = await menuRepository.findOneBy({
                user_owner_uuid: menu.user_owner_uuid,
                menu_uuid: menu.menu_uuid,
                status: 1
            });

            if (!menuExists) {
                const menuCreate = menuRepository.create(menu);
                await menuRepository.save(menuCreate);
            }
        }
    }

}