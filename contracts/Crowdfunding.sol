// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./Project.sol";

contract Crowdfunding {
    using SafeMath for uint256;

    // List of existing projects
    Project[] private projects;
    mapping(address => bool) existingProjects;

    // Event that will be emitted whenever a new project is started
    event ProjectStarted(
        address contractAddress,
        address projectStarter,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 goalAmount
    );

    /** @dev Function to start a new project.
      * @param title Title of the project to be created
      * @param description Brief description about the project
      * @param durationInDays Project deadline in days
      * @param amountToRaise Project goal in wei
      */
    function startProject(
        string calldata title,
        string calldata description,
        uint durationInDays,
        uint amountToRaise
    ) external {
        uint raiseUntil = now.add(durationInDays.mul(1 days));
        Project newProject = new Project(msg.sender, title, description, raiseUntil, amountToRaise);
        projects.push(newProject);
        existingProjects[address(newProject)] = true;
        emit ProjectStarted(
            address(newProject),
            msg.sender,
            title,
            description,
            raiseUntil,
            amountToRaise
        );
    }                                                                                                                                   

    /** @dev Function to get all projects' contract addresses.
      * @return A list of all projects' contract addreses
      */
    function returnAllProjects() external view returns(Project[] memory){
        return projects;
    }

    /** @dev Function to get the balance of a project.
      * @return project balance.
      */
    function balanceOfProject(address projectAddress) public view returns (uint256) {
        require(existingProjects[projectAddress] == true);
        return Project(projectAddress).currentBalance();
    }

    /** @dev Function to contribute to a project.
      * @return null.
      */
    function contribute(address projectAddress) public payable {
      require(existingProjects[projectAddress] == true);
      Project(projectAddress).checkState();
      Project(projectAddress).contribute.value(msg.value)();
    }
}
