import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { KeyPair, getSecureRandomBytes, keyPairFromSeed, mnemonicToWalletKey } from 'ton-crypto';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;
    let keyPair: KeyPair
    let keyPair2: KeyPair


    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.now = 100;

        const deployer = await blockchain.treasury('deployer');

        const mnemonic = 'put your mnemonic';
        const mnemonicArray = mnemonic.split(' ');
        const mnemonic2 = 'a b c';
        const mnemonicArray2 = mnemonic2.split(' ');
        const seed: Buffer = await getSecureRandomBytes(32); // Seed is always 32 bytes
        const seed2: Buffer = await getSecureRandomBytes(32); // Seed is always 32 bytes
        keyPair = keyPairFromSeed(seed); // Creates keypair from random seed
        keyPair2 = keyPairFromSeed(seed2); // Creates keypair from secret key
        

        task1 = blockchain.openContract(Task1.createFromConfig({address: deployer.address,public_key: keyPair.publicKey}, code));


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

/*    it('should return correct number from get method get_seqno', async () => {
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
            keyPair.secretKey,
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


    it('should correct test signature', async () => {
  
        const res = await task1.sendUpdate(
            BigInt(0),
            keyPair2.secretKey,
            BigInt(0),
            BigInt(124)
        );  // performing an action with contract main and saving result in res

        expect(res.transactions).toHaveTransaction({                             // configure the expected result with expect() function
            exitCode: 120                                                        // set the desirable result using matcher property success
        });
    
        //printTransactionFees(res.transactions); 
        // const caller = await blockchain.treasury('caller');
        // expect(await task1.getExecutionTime()).toEqual(199);
    });
  

    it('should correct test locked for', async () => {
  
        const res = await task1.sendUpdate(
            BigInt(0),
            keyPair.secretKey,
            BigInt(-5),
            BigInt(124)
        );  // performing an action with contract main and saving result in res

        expect(res.transactions).toHaveTransaction({                             // configure the expected result with expect() function
            exitCode: 121                                                        // set the desirable result using matcher property success
        });
    
        //printTransactionFees(res.transactions); 
        // const caller = await blockchain.treasury('caller');
        // expect(await task1.getExecutionTime()).toEqual(199);
    });
  

    // it('should correct test execution time before now', async () => {
  
    //     const res = await task1.sendUpdate(
    //         BigInt(0),
    //         keyPair.secretKey,
    //         BigInt(5),
    //         BigInt(124)
    //     );  // performing an action with contract main and saving result in res

    //     expect(res.transactions).toHaveTransaction({                             // configure the expected result with expect() function
    //         exitCode: 122                                                        // set the desirable result using matcher property success
    //     });
    
    //     //printTransactionFees(res.transactions); 
    //     // const caller = await blockchain.treasury('caller');
    //     // expect(await task1.getExecutionTime()).toEqual(199);
    // });

    it('should correct test execution time > now+locked_for', async () => {
  
        const res = await task1.sendUpdate(
            BigInt(0),
            keyPair.secretKey,
            BigInt(50),
            BigInt(124)
        );  // performing an action with contract main and saving result in res

        expect(res.transactions).toHaveTransaction({                             // configure the expected result with expect() function
            exitCode: 123,                                                        // set the desirable result using matcher property success
        });
    
        //printTransactionFees(res.transactions); 
        // const caller = await blockchain.treasury('caller');
        // expect(await task1.getExecutionTime()).toEqual(199);
    });


    it('should send update', async () => {
  
        const res = await task1.sendUpdate(
            BigInt(0),
            keyPair.secretKey,
            BigInt(100),
            BigInt(124)
        );  // performing an action with contract main and saving result in res

        expect(res.transactions).toHaveTransaction({                             // configure the expected result with expect() function
            exitCode: 0,                                                        // set the desirable result using matcher property success
        });
        
        const caller = await blockchain.treasury('caller');
        expect(await task1.getExecutionTime()).toEqual(200);

      //  const caller = await blockchain.treasury('caller');
        expect(await task1.getSeqno()).toEqual(124);
        
        const res2 = await task1.sendClaim(
            BigInt(0),
        );  // performing an action with contract main and saving result in res
        expect(res2.transactions).toHaveTransaction({                             // configure the expected result with expect() function
            exitCode: 124,                                                        // set the desirable result using matcher property success
        });
 
        blockchain.now = 200;
        const res3 = await task1.sendClaim(
            BigInt(0),
        );  // performing an action with contract main and saving result in res
        expect(res3.transactions).toHaveTransaction({                             // configure the expected result with expect() function
            exitCode: 0,                                                        // set the desirable result using matcher property success
            outMessagesCount: 1,
        });

        //printTransactionFees(res.transactions); 
        // const caller = await blockchain.treasury('caller');
        // expect(await task1.getExecutionTime()).toEqual(199);
    });
  */
    

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
