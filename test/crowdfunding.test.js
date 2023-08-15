const Crowdfunding = artifacts.require("Crowdfunding");
const Project = artifacts.require("Project");

contract("Crowdfunding", (accounts) => {
  let crowdfunding;

  beforeEach(async () => {
    crowdfunding = await Crowdfunding.new();
  });

  it("should start a new project", async () => {
    const title = "Test Project";
    const description = "This is a test project";
    const durationInDays = 10;
    const amountToRaise = web3.utils.toWei("1", "ether");

    await crowdfunding.startProject(
      title,
      description,
      durationInDays,
      amountToRaise
    );

    const projects = await crowdfunding.returnAllProjects();
    assert.equal(projects.length, 1);
  });

  it("should emit ProjectStarted event", async () => {
    const title = "Test Project";
    const description = "This is a test project";
    const durationInDays = 10;
    const amountToRaise = web3.utils.toWei("1", "ether");

    const receipt = await crowdfunding.startProject(
      title,
      description,
      durationInDays,
      amountToRaise
    );

    assert.equal(receipt.logs[0].event, "ProjectStarted");
  });

  it("should return the correct project balance", async () => {
    const title = "Test Project";
    const description = "This is a test project";
    const durationInDays = 10;
    const amountToRaise = web3.utils.toWei("1", "ether");
    await crowdfunding.startProject(
      title,
      description,
      durationInDays,
      amountToRaise
    );

    const projects = await crowdfunding.returnAllProjects();
    const balance = await crowdfunding.balanceOfProject(projects[0]);
    assert.equal(balance, 0);
  });

  it("should not allow users to contribute to a non-existent project", async () => {
    try {
      await crowdfunding.contribute(accounts[2], {
        from: accounts[1],
        value: web3.utils.toWei("0.1", "ether"),
      });
      assert.fail();
    } catch (error) {
      assert(error.toString().includes("revert"));
    }
  });

  it("should not allow users to check the balance of a non-existent project", async () => {
    try {
      await crowdfunding.balanceOfProject(accounts[2]);
      assert.fail();
    } catch (error) {
      assert(error.toString().includes("revert"));
    }
  });

  it("should correctly update project balance after contribution", async () => {
    const title = "Test Project";
    const description = "This is a test project";
    const durationInDays = 10;
    const amountToRaise = web3.utils.toWei("1", "ether");
    await crowdfunding.startProject(
      title,
      description,
      durationInDays,
      amountToRaise
    );

    const projects = await crowdfunding.returnAllProjects();

    const contributionAmount = web3.utils.toWei("0.5", "ether");
    await crowdfunding.contribute(projects[0], {
      from: accounts[1],
      value: contributionAmount,
    });

    const projectInstance = await Project.at(projects[0]);
    const newBalance = await projectInstance.currentBalance(); // Directly get the balance from the Project contract

    assert.equal(
      newBalance.toString(),
      contributionAmount,
      "Balance did not update correctly after contribution"
    );
  });
});
