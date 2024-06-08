import { initContract } from '@ts-rest/core';
import { AccountContract } from './account.contract';

const c = initContract();

export const RootContract = c.router({
        account: AccountContract,
    }
);
