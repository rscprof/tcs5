import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, Slice, TupleBuilder, TupleItemInt, beginCell, toNano } from 'ton-core';
import { Task4Basic } from '../wrappers/Task4Basic';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4Basic', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4Basic');
    });

    let blockchain: Blockchain;
    let task4Basic: SandboxContract<Task4Basic>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.verbosity = {
            blockchainLogs: false,
            vmLogs : 'vm_logs',
            debugLogs: true,
            print: true
        }

        task4Basic = blockchain.openContract(Task4Basic.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4Basic.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4Basic.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4Basic are ready to use
    });

    it('should answer', async () => {
        // the check is done inside beforeEach
        // blockchain and task4Basic are ready to use
       // var builder1 = new TupleBuilder();
        


        // builder1.writeCell(beginCell().storeStringTail("S.").endCell());
        // builder1.writeCell(beginCell().storeStringTail(".E").endCell());

        // var arr = builder1.build();
        
        
        var result = await task4Basic.getSolve();//BigInt(2),BigInt(2),{type: 'tuple',items: arr});
        // expect(result).toEqual(
        //     0
        // );
    });

});
