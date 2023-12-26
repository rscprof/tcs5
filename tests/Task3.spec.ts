import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, Dictionary, Slice, beginCell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.verbosity = {
            blockchainLogs: false,
            vmLogs : 'vm_logs',
            debugLogs: true,
            print: true
        }

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
         
        const user = await blockchain.treasury('user');


        const sendFirstResult = await task3.sendFirstMessage(user.getSender());

        expect(sendFirstResult.transactions).toHaveTransaction({
            from: user.address,
            to: task3.address,
            success: true,
        })

        const number = await task3.getVersion();

        expect(number).toEqual(1);

    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });


    it('should correct vork with version 2', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
   
        const user = await blockchain.treasury('user');

        const sendResult = await task3.sendVersionMessage(user.getSender(),BigInt(2));

        expect(sendResult.transactions).toHaveTransaction({
            from: user.address,
            to: task3.address,
            success: false,
            exitCode: 200,
        })


    });

    it('should correct vork with version 2 with code', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
   
        const user = await blockchain.treasury('user');

        const sendResult = await task3.sendVersionMessageWithCode(user.getSender(),BigInt(2),Cell.EMPTY);

        expect(sendResult.transactions).toHaveTransaction({
            from: user.address,
            to: task3.address,
            success: false,
            exitCode: 400,
        })


    });

    it('should correct vork with version 2 with code and dict', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
   
        const user = await blockchain.treasury('user');

        const dict = Dictionary.empty<number,Cell>(Dictionary.Keys.Uint(32),Dictionary.Values.Cell());
    
        

        dict.set(1,beginCell().storeUint(2,32).storeMaybeRef(null).endCell());

        const sendResult = await task3.sendVersionMessageWithCodeAndDict(user.getSender(),BigInt(2),Cell.EMPTY,dict);

        expect(sendResult.transactions).toHaveTransaction({
            from: user.address,
            to: task3.address,
            success: true,
        })


        const number = await task3.getVersion();

        expect(number).toEqual(2);
    });



});
