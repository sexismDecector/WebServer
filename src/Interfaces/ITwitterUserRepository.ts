
import TwitterUser from "../Models/TwitterUser";

export default interface ITwitterUserRepository {
    PoolSize: number;
    get(id: string): Promise<TwitterUser>;
    getAll(): Promise<TwitterUser[]>;
    create(user: TwitterUser): Promise<void>;
    remove(id: string): Promise<void>;
}