import {AppDataSource} from "../data-source";
import {UserMenu} from "../entities/User_Menu";

const menuUserRepository = AppDataSource.getRepository(UserMenu);

export default menuUserRepository;