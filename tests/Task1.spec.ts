import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';


describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const deployer = await blockchain.treasury('deployer');

        task1 = blockchain.openContract(Task1.createFromConfig({address: deployer.address}, code));


        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
    });

    it('should return correct number from get method get_seqno', async () => {
        const caller = await blockchain.treasury('caller');
        expect(await task1.getSeqno()).toEqual(123);
    });

    it('should return correct number from get method get_execution_time', async () => {
        const caller = await blockchain.treasury('caller');
        expect(await task1.getExecutionTime()).toEqual(199);
    });

    it('should correct test seq_no', async () => {
  
        const res = await task1.sendUpdate(
            BigInt(0),
            BigInt(0),
            BigInt(0),
            BigInt(123)
        );  // performing an action with contract main and saving result in res

        expect(res.transactions).toHaveTransaction({                             // configure the expected result with expect() function
            exitCode: 119                                                        // set the desirable result using matcher property success
        });
    
        //printTransactionFees(res.transactions); 
        // const caller = await blockchain.treasury('caller');
        // expect(await task1.getExecutionTime()).toEqual(199);
    });

    



    

    // it('get seq_no', async () => {
    //     blockchain = await Blockchain.create();

    //     task1 = blockchain.openContract(Task1.createFromConfig({}, code));

    //     const deployer = await blockchain.treasury('deployer');

    //     const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

    //     expect(deployResult.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: task1.address,
    //         deploy: true,
    //         success: true,
    //     });
        
    // });

});
