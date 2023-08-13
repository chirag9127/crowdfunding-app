const Project = artifacts.require("Project");
var BN = web3.utils.BN;

const dateToUNIX = (date) => {
  return Math.round(new Date(date).getTime() / 1000).toString()
}

contract("Project", function (accounts) {
    // var projectContract;

    // beforeEach(async function () {
    //    const creator = accounts[0];
    //    const title = "Test";
    //    const desc = "Test Project";
    //    const deadline = dateToUNIX('2024-05-22');
    //    const goalAmount = 10000;
    //    projectContract = await Project.deployed(creator, title, desc, deadline, goalAmount);
    // });

    it("should assert true as deployed", async function () {
        const creator = accounts[0];
        const title = "Test";
        const desc = "Test Project";
        const deadline = dateToUNIX('2024-05-22');
        const goalAmount = 10000;
        projectContract = await Project.deployed(creator, title, desc, deadline, goalAmount);
        d = await projectContract.getDetails();
        assert.equal(await d.projectTitle, "Test");
    });
});