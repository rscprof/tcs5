import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
  blockchain.verbosity = {
            blockchainLogs: false,
            vmLogs : 'vm_logs_full',
            debugLogs: true,
            print: true
        }
        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });

     it('should answer', async () => {
            // the check is done inside beforeEach
            // blockchain and task4Basic are ready to use
           // var builder1 = new TupleBuilder();



            // builder1.writeCell(beginCell().storeStringTail("S.").endCell());
            // builder1.writeCell(beginCell().storeStringTail(".E").endCell());

            // var arr = builder1.build();


            var result = await task4.getSolve();//BigInt(2),BigInt(2),{type: 'tuple',items: arr});
            // expect(result).toEqual(
            //     0
            // );
        });

});
