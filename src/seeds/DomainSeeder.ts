import {Seeder, SeederFactoryManager} from "typeorm-extension";
import {DataSource} from "typeorm";
import {Domain} from "../entities/Domain";

export class DomainSeeder implements Seeder{
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const domainRepository = dataSource.getRepository(Domain);
        const domainData = [
            {
                domain:"TIPO_PULSEIRA",
                value:"1",
                description:"VIP",
                orderby:1,
            },
            { value: '1', description: 'PASSPORTE', domain: 'TYPE_DOCUMENT',orderby:1 },
            { value: '2', description: 'BILHETE DE IDENTIDADE', domain: 'TYPE_DOCUMENT',orderby:1 },
            { value: '3', description: 'CARTA DE CONDUÇÃO', domain: 'TYPE_DOCUMENT',orderby:2 },
            { value: '1', description: 'SEGURO DE VIAGEM', domain: 'TYPE_INSURANCE',orderby:1 },
            { value: '2', description: 'SEGURO DE AUTOMOVÉL', domain: 'TYPE_INSURANCE',orderby:2 },
        ];

        for (const domain of domainData) {
            const domainExists = await domainRepository.findOneBy({
                domain: domain.domain,
                value: domain.value,
                description: domain.description
            });

            if (!domainExists) {
                const domainCreate = domainRepository.create(domain);
                await domainRepository.save(domainCreate);
            }
        }
    }
}