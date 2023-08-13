var Project = artifacts.require("Project");
module.exports = function(deployer) {
    deployer.deploy(Project, "0xF2fdB3B26C0D1fbeCF91F2bbd3d19723dB425c31", "The next big app", "Description for the next big app", 1692556261, 200);
};