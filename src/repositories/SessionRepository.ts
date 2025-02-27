import {AppDataSource} from '../data-source';
import {UserSession} from '../entities/Session';

const sessionRepository = AppDataSource.getRepository(UserSession);

export default sessionRepository;