const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('IBC Tests', function() {
  let IBCMockHandlerAddress;

  beforeEach(async function () {
    const network = hre.network.name;

    if (network === 'axon_test') {
      IBCMockHandlerAddress = await deployIBCHandler(network);
    }

    // todo
  });

  it('your test case', async ()=> {
    if (!IBCMockHandlerAddress) {
      this.skip();
    }

    // todo
  });

  // todo
});





async function deployIBCHandler(network) {
  let ibcPacket, ibcConnection, ibcChannel, ibcClient, ibcMockHandler, mockModule;

  if (network === 'axon_test') {
    console.log('Deploying IBCMockHandler for network: ' + network);
    const IBCMockHandlerFactory = await ethers.getContractFactory('IBCMockHandler');
    const IBCPacketFactory = await ethers.getContractFactory('IBCPacket');
    const IBCConnectionFactory = await ethers.getContractFactory('IBCConnection');
    const IBCChannelFactory = await ethers.getContractFactory('IBCChannelHandshake');
    const IBCClientFactory = await ethers.getContractFactory('IBCClient');
    const MockModuleFactory = await ethers.getContractFactory('MockModule');

    ibcPacket = await IBCPacketFactory.deploy();
    ibcConnection = await IBCConnectionFactory.deploy();
    ibcChannel = await IBCChannelFactory.deploy();
    ibcClient = await IBCClientFactory.deploy();
    ibcMockHandler = await IBCMockHandlerFactory.deploy(
      ibcClient.address,
      ibcConnection.address,
      ibcChannel.address,
      ibcPacket.address
    );

    console.log('IBCMockHandler deployed at address: ' + ibcMockHandler.address);

    // 部署 MockModule
    mockModule = await MockModuleFactory.deploy();
    console.log('MockModule deployed at address: ' + mockModule.address);

    return { ibcMockHandler, ibcPacket, ibcConnection, ibcChannel, ibcClient, mockModule };
  } else {
    console.log('Deploying OwnableIBCHandler for network: ' + network);
    const OwnableIBCHandlerFactory = await ethers.getContractFactory('OwnableIBCHandler');

    ibcPacket = await IBCPacketFactory.deploy();
    ibcConnection = await IBCConnectionFactory.deploy();
    ibcChannel = await IBCChannelFactory.deploy();
    ibcClient = await IBCClientFactory.deploy();
    ibcMockHandler = await OwnableIBCHandlerFactory.deploy(
      ibcClient.address,
      ibcConnection.address,
      ibcChannel.address,
      ibcPacket.address
    );

    console.log('OwnableIBCHandler deployed at address: ' + ibcMockHandler.address);

    // 部署 MockModule
    mockModule = await MockModuleFactory.deploy();
    console.log('MockModule deployed at address: ' + mockModule.address);

    return { ibcMockHandler, ibcPacket, ibcConnection, ibcChannel, ibcClient, mockModule };
  }
}

