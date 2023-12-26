import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode, Slice, toNano } from 'ton-core';

export type Task3Config = {};

export function task3ConfigToCell(config: Task3Config): Cell {
    return beginCell().endCell();
}

export class Task3 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task3(address);
    }

    static createFromConfig(config: Task3Config, code: Cell, workchain = 0) {
        const data = task3ConfigToCell(config);
        const init = { code, data };
        return new Task3(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    

    async sendFirstMessage(
        provider: ContractProvider, 
            user: Sender, 
            ) {    
            await provider.internal(user, {
                    value: toNano('0.01'),
                    sendMode: SendMode.PAY_GAS_SEPARATELY,
                    body: beginCell().storeUint(0,32).storeMaybeRef(null).endCell()
                }
            );
    }

    async getVersion(provider: ContractProvider) {
        const result = (await provider.get('version', [])).stack;
        return result.readNumber();
    }

    async sendVersionMessage(
        provider: ContractProvider, 
            user: Sender, 
            version: bigint,
            ) {    
            await provider.internal(user, {
                    value: toNano('0.01'),
                    sendMode: SendMode.PAY_GAS_SEPARATELY,
                    body: beginCell().storeUint(version,32).endCell()
                }
            );
    }

    async sendVersionMessageWithCode(
        provider: ContractProvider, 
            user: Sender, 
            version: bigint,
            code: Cell,
            ) {    
            await provider.internal(user, {
                    value: toNano('0.01'),
                    sendMode: SendMode.PAY_GAS_SEPARATELY,
                    body: beginCell().storeUint(version,32).storeMaybeRef(code).endCell()
                }
            );
    }

    async sendVersionMessageWithCodeAndDict(
        provider: ContractProvider, 
            user: Sender, 
            version: bigint,
            code: Cell,
            dict: Dictionary<number,Cell>,
            ) {    
            await provider.internal(user, {
                    value: toNano('0.01'),
                    sendMode: SendMode.PAY_GAS_SEPARATELY,
                    body: beginCell().storeUint(version,32).storeMaybeRef(code).storeDict(dict).storeRef(beginCell().endCell()).endCell()
                }
            );
    }


    
}
