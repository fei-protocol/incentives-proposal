import {
  deployContract,
  getContractFactory,
  getContract,
  getFirstSigner,
  registerContractInJsonDb,
} from './contracts-helpers';
import { eContractid, tEthereumAddress } from './types';
import { MintableErc20 } from '../types/MintableErc20';
import { SelfdestructTransfer } from '../types/SelfdestructTransfer';
import { IERC20Detailed } from '../types/IERC20Detailed';
import { verifyContract } from './etherscan-verification';
import { ATokenMock } from '../types/ATokenMock';
import {
  InitializableAdminUpgradeabilityProxyFactory,
  StakedTokenIncentivesController,
  StakedTokenIncentivesControllerFactory,
} from '../types';

export const deployAaveIncentivesController = async (
  [aavePsm, emissionManager]: [tEthereumAddress, tEthereumAddress],
  verify?: boolean
) => {
  const id = eContractid.StakedTokenIncentivesController;
  const args: [string, string] = [aavePsm, emissionManager];
  const instance = await new StakedTokenIncentivesControllerFactory(await getFirstSigner()).deploy(
    ...args
  );
  await instance.deployTransaction.wait();
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployInitializableAdminUpgradeabilityProxy = async (verify?: boolean) => {
  const args: string[] = [];
  const instance = await new InitializableAdminUpgradeabilityProxyFactory(
    await getFirstSigner()
  ).deploy();
  await instance.deployTransaction.wait();
  if (verify) {
    await verifyContract(instance.address, args);
  }
  return instance;
};

export const deployMintableErc20 = async ([name, symbol, decimals]: [string, string, number]) =>
  await deployContract<MintableErc20>(eContractid.MintableErc20, [name, symbol, decimals]);

export const deployATokenMock = async (aicAddress: tEthereumAddress, slug: string) => {
  const instance = await deployContract<ATokenMock>(eContractid.ATokenMock, [aicAddress]);
  await registerContractInJsonDb(`${eContractid.ATokenMock}-${slug}`, instance);
};

export const getMintableErc20 = getContractFactory<MintableErc20>(eContractid.MintableErc20);

export const getAaveIncentivesController = getContractFactory<StakedTokenIncentivesController>(
  eContractid.StakedTokenIncentivesController
);

export const getIErc20Detailed = getContractFactory<IERC20Detailed>(eContractid.IERC20Detailed);

export const getATokenMock = getContractFactory<ATokenMock>(eContractid.ATokenMock);

export const getERC20Contract = (address: tEthereumAddress) =>
  getContract<MintableErc20>(eContractid.MintableErc20, address);

export const deploySelfDestruct = async () => {
  const id = eContractid.MockSelfDestruct;
  const instance = await deployContract<SelfdestructTransfer>(id, []);
  await instance.deployTransaction.wait();
  return instance;
};
