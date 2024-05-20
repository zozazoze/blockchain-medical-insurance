var insu = artifacts.require("MedicalInsurance");

module.exports = function (deployer) {
    deployer.deploy(insu);
};