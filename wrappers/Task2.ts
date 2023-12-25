import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, DictionaryKeyTypes, ExternalAddress, Sender, SendMode } from 'ton-core';
import { Maybe } from 'ton-core/dist/utils/maybe';
//Storage
//admin_address: MsgAddressInt
//users: (HashmapE 256 uint32)

export type Task2Config = {
    admin_address: Maybe<Address | ExternalAddress>
    users: Dictionary<number,Cell>
};

export function task2ConfigToCell(config: Task2Config): Cell {
    let cell = beginCell()
        .storeAddress(config.admin_address)
        .storeDict(config.users)
        .endCell();
    console.debug(cell);
    return cell;
        
}

export class Task2 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task2(address);
    }

    static createFromConfig(config: Task2Config, code: Cell, workchain = 0) {
        const data = task2ConfigToCell(config);
        const init = { code, data };
        return new Task2(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }


    

    //     //add_user#368ddef3 query_id:uint64 address:MsgAddressInt share:uint32 = InternalMsgBody;
    async sendAddUser(
        provider: ContractProvider, 
            user: Sender, 
            queryId: bigint,
            address: Address,
            share: bigint
            ) {
    
            await provider.internal(user, {
                    value: BigInt(0),
                    body: beginCell().storeUint(0x368ddef3,32).storeUint(queryId,64).storeAddress(address).storeUint(share,32).endCell()
                }
            );
    }

    async getUsers(provider: ContractProvider) {
        const result = (await provider.get('get_users', [])).stack;
        console.debug(result);
        const cell = result.readCell();
        return cell.beginParse().loadDict(Dictionary.Keys.Uint(256),Dictionary.Values.Int(32));        
    }
}
