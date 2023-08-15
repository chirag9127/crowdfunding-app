const Project = artifacts.require("Project");
var BN = web3.utils.BN;

const dateToUNIX = (date) => {
  return Math.round(new Date(date).getTime() / 1000).toString();
};

contract("Project", function (accounts) {
  it("should assert true on project details", async function () {
    projectContract = await Project.deployed();
    d = await projectContract.getDetails();
    assert.equal(
      await d.projectTitle,
      "The next big app",
      "Unexpected project title"
    );
    assert.equal(await d.deadline, 1692556261, "Unexpected deadline");
    assert.equal(await d.goalAmount, 200, "Unexpected goal amount");
  });

  it("should assert false on checkIfFundingCompleteOrExpired", async function () {
    projectContract = await Project.deployed();
    await projectContract.checkIfFundingCompleteOrExpired();
    assert.equal(
      await projectContract.state(),
      Project.State.Fundraising,
      "Unexpected funding status"
    );
  });

  it("test contribute and payOut", async function () {
    projectContract = await Project.deployed();
    receipt = await projectContract.contribute({
      sender: accounts[0],
      value: 10,
    });
    assert.equal(receipt.logs[0].event, "FundingReceived");
    assert.equal(
      await projectContract.state(),
      Project.State.Fundraising,
      "Unexpected funding status"
    );
    receipt = await projectContract.contribute({
      sender: accounts[0],
      value: 190,
    });
    assert.equal(
      await projectContract.state(),
      Project.State.Successful,
      "Unexpected funding status"
    );
    assert.equal(receipt.logs[0].event, "FundingReceived");
    assert.equal(receipt.logs[1].event, "CreatorPaid");
    assert.equal(
      await projectContract.currentBalance(),
      0,
      "Unexpected balance after pay out"
    );
  });
});
