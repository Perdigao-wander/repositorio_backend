import {AppDataSource} from "../data-source";
import {Document} from "../entities/Document";

const documentRepository = AppDataSource.getRepository(Document);

export default documentRepository;