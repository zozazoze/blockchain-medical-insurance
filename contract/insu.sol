// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MedicalInsurance {
    address public owner;
    mapping(address => uint256) public balances;
    mapping(address => bool) public isInsured;
    mapping(address => uint256) public insuranceAmount;
    
    event InsurancePurchased(address indexed user, uint256 amount);
    event InsuranceClaimed(address indexed user, uint256 amount);
    event InsuranceRefunded(address indexed user, uint256 amount);
    event InsuranceAmountUpdated(address indexed user, uint256 newAmount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function purchaseInsurance() external payable {
        require(!isInsured[msg.sender], "You are already insured");
        require(msg.value > 0, "You need to send some ether to purchase insurance");
        
        balances[msg.sender] += msg.value;
        isInsured[msg.sender] = true;
        insuranceAmount[msg.sender] = msg.value;
        
        emit InsurancePurchased(msg.sender, msg.value);
    }
    
    function claimInsurance(uint256 amount) external {
        require(isInsured[msg.sender], "You are not insured");
        require(amount <= balances[msg.sender], "Insufficient balance to claim");
        
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
        
        emit InsuranceClaimed(msg.sender, amount);
    }
    
    function updateInsuranceAmount(address user, uint256 newAmount) external onlyOwner {
        require(isInsured[user], "User is not insured");
        require(newAmount > 0, "New insurance amount must be greater than zero");
        
        insuranceAmount[user] = newAmount;
        
        emit InsuranceAmountUpdated(user, newAmount);
    }
    
    function refundExcessInsurance(address user) external onlyOwner {
        require(isInsured[user], "User is not insured");
        require(balances[user] > insuranceAmount[user], "User does not have excess insurance balance");
        
        uint256 excessAmount = balances[user] - insuranceAmount[user];
        balances[user] = insuranceAmount[user];
        payable(user).transfer(excessAmount);
        
        emit InsuranceRefunded(user, excessAmount);
    }
    
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        
        payable(owner).transfer(amount);
    }
}