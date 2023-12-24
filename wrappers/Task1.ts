import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, ExternalAddress, Sender, SendMode } from 'ton-core';
import { Maybe } from 'ton-core/dist/utils/maybe';
import { sign } from 'ton-crypto';

export type Task1Config = {
    address: Maybe<Address | ExternalAddress>;
    public_key: Buffer;
};

// public_key: uint256
// execution_time: uint32
// receiver: MsgAddressInt
// seqno: uint32
export function task1ConfigToCell(config: Task1Config): Cell {
    return beginCell()
    .storeBuffer(config.public_key,256/8) //public_key
    .storeInt(199,32) //exec time
    .storeAddress(config.address) //receiver
    .storeInt(123,32) //seqno
    .endCell();
}

export class Task1 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    async getSeqno(provider: ContractProvider) {
        const result = (await provider.get('get_seqno', [])).stack;
        return result.readNumber();
    }

    async getExecutionTime(provider: ContractProvider) {
        const result = (await provider.get('get_execution_time', [])).stack;
        return result.readNumber();
    }


    static createFromAddress(address: Address) {
        return new Task1(address);
    }

    static createFromConfig(config: Task1Config, code: Cell, workchain = 0) {
        const data = task1ConfigToCell(config);
        const init = { code, data };
        return new Task1(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    //update#9df10277 query_id:uint64 signature:bits512 ^[ locked_for:uint32 new_seqno:uint32 ] = ExtInMsgBody
    async sendUpdate(
        provider: ContractProvider, 
        queryId: bigint,
        key: Buffer,
        locked_for: bigint,
        new_seqno: bigint
        ) {

            let message = beginCell().storeInt(locked_for,32).storeUint(new_seqno,32).endCell()
            let signature = sign(message.hash(),key)
        await provider.external(
            beginCell().storeUint(0x9df10277,32).storeUint(queryId,64).storeBuffer(signature,512/8).storeRef(
                message
            ).endCell()
            );
    }

        //claim#bb4be234 query_id:uint64 = ExtInMsgBody
        async sendClaim(
            provider: ContractProvider, 
            queryId: bigint,
            ) {
    
            await provider.external(
                beginCell().storeUint(0xbb4be234,32).storeUint(queryId,64).endCell()
                );
        }
    
}
