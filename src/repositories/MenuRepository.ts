import {AppDataSource} from "../data-source";
import {Menu} from "../entities/Menu";

const menuRepository = AppDataSource.getRepository(Menu)

export default menuRepository;