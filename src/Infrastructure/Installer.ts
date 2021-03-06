import "reflect-metadata";
import {Container} from "inversify";
import ITwitterCredentialsRepository from "../Interfaces/ITwitterCredentialsRepository";
import SQLTwitterCredentialsRepository from "../Repositories/SQLTwitterCredentialsRepository";
import Component from "./Component";
import IDatabaseDriver from "../Interfaces/IDatabaseDriver";
import PostgreSQLDriver from "../Databases/PostgreSQLDriver";
import ITweetRepository from "../Interfaces/ITweetRepository";
import TweetRepository from "../Repositories/TweetRepository";
import ITwitterDataService from "../Interfaces/ITwitterDataService";
import TwitterDataService from "../Services/TwitterDataService";
import TwitterAuthentication from "../Authentication/TwitterAuthentication";
import TweetCrawlService from "../Services/TweetCrawlService";
import ITweetCrawlService from "../Interfaces/ITweetCrawlService";
import CSVLoaderService from "../Services/CSVLoaderService";
import JSONLoaderService from "../Services/JSONLoaderService";
import ILabeledWordRepository from "../Interfaces/ILabeledWordRepository";
import LabeledWordRepository from "../Repositories/LabeledWordRepository";
import ITwitterUserRepository from "../Interfaces/ITwitterUserRepository";
import TwitterUserRepository from "../Repositories/TwitterUserRepository";

let container = new Container();

async function prepareContainer(container: Container): Promise<Container> {

    console.log("Preparing Components...");

    container
        .bind<ITwitterCredentialsRepository>(Component.TwitterCredentialRepo)
        .to(SQLTwitterCredentialsRepository);

    container
        .bind<IDatabaseDriver>(Component.Database)
        .to(PostgreSQLDriver);

    container
        .bind<ITweetRepository>(Component.TweetRepository)
        .to(TweetRepository);

    container
        .bind<ITwitterUserRepository>(Component.TwitterUserRepository)
        .to(TwitterUserRepository);

    container
        .bind<ILabeledWordRepository>(Component.LabeledWordRepository)
        .to(LabeledWordRepository);

    container
        .bind<ITwitterDataService>(Component.TwitterDataService)
        .to(TwitterDataService);

    const twitterCredentials = await container.get<ITwitterCredentialsRepository>(Component.TwitterCredentialRepo).get();
    const twitterAuth = new TwitterAuthentication(
        twitterCredentials.key,
        twitterCredentials.secret
    );
    console.log(await twitterAuth.getToken());

    container
        .bind<ITweetCrawlService>(Component.TweetCrawlerService)
        .to(TweetCrawlService);

    container.bind<TwitterAuthentication>(Component.TwitterAuth)
        .toConstantValue(twitterAuth);

    container.bind<CSVLoaderService>(Component.CSVLoaderService)
        .to(CSVLoaderService);

    container.bind<JSONLoaderService>(Component.JSONLoaderService)
        .to(JSONLoaderService);

    console.log("Components Prepared!");

    return container;
}

export default prepareContainer(container);
