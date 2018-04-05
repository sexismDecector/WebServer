import * as assert from "assert";
import * as FileSystem from "fs-extra";
import TwitterDataService from "../src/Services/TwitterDataService";
import TwitterAuthentication from "../src/Authentication/TwitterAuthentication";
import "mocha";
import ITwitterCredentialsRepository from "../src/Interfaces/ITwitterCredentialsRepository";
import ObjectPool from "../src/Infrastructure/ObjectPool";
import container from "../src/Infrastructure/Installer";

describe("TwitterDataServiceTest", () => {

    let repo: ITwitterCredentialsRepository;

    before(() => {
        repo = container.get<ITwitterCredentialsRepository>(ObjectPool.TwitterCredentialRepo);
    });

    it("Get Tweet by ID", async () => {
        const credentials = await repo.get();
        const json = await FileSystem.readJson(__dirname + "/test.ignore.json");
        const twitterData = new TwitterDataService(
            new TwitterAuthentication(credentials.key, credentials.secret
        ));
        const promise = twitterData.getTweet(json["tweetId"]);
        const data = await promise;
        console.log(data);
        assert.notEqual(data, null);
    }).timeout(5000);

});