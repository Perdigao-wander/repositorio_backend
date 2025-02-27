import {AppDataSource} from "../data-source";
import {Domain} from "../entities/Domain";

const domainRepository = AppDataSource.getRepository(Domain);

export default domainRepository;