import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, Dictionary, toNano } from 'ton-core';
import { Task2 } from '../wrappers/Task2';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    let admin: SandboxContract<TreasuryContract>


    beforeEach(async () => {
        blockchain = await Blockchain.create();

        admin = await blockchain.treasury('admin');


        task2 = blockchain.openContract(Task2.createFromConfig({
                admin_address: admin.address,
                users: Dictionary.empty<number,Cell>()
        }, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should add user correctly', async () => {

        const user = await blockchain.treasury('user');
        
        const res = await task2.sendAddUser(
            admin.getSender(),
            BigInt(0),
            user.getSender().address,
            BigInt(100)
        );  // performing an action with contract main and saving result in res

        expect(res.transactions).toHaveTransaction({
           success: true  
        })

        

    });



});
