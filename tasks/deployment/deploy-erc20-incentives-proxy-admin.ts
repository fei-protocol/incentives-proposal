import { task } from 'hardhat/config';
import { deployInitializableAdminUpgradeabilityProxy } from '../../helpers/contracts-accessors';

// Mainnet addresses
const INCENTIVES_ADDRESS = process.env.INCENTIVES_ADDRESS;
const ADMIN_ADDRESS = process.env.INCENTIVES_ADMIN;

task('deploy-erc20-incentives-proxy', 'ERC20 proxy implementation deployment').setAction(
  async (_, localBRE) => {
    _;
    await localBRE.run('set-DRE');
      
    const proxy = await deployInitializableAdminUpgradeabilityProxy(true);
    console.log(`- ERC20 Incentives Proxy address ${proxy.address}`);
    await proxy.initialize(INCENTIVES_ADDRESS, ADMIN_ADDRESS, "0x");
    console.log(`- Proxy initialized with Admin=${ADMIN_ADDRESS} and Impl=${INCENTIVES_ADDRESS}`);

    return proxy.address;
  }
);