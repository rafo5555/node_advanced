const Page = require('./helpers/page');

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

describe('When Logged in',  () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('When loged in can see blog creation form',  async () =>{
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('The form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });

    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', "My title");
            await page.type('.content input', "My content");
            await page.click('form button');
        });
        test('Submiting takes user to review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('Submiting then saving adds blog', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('My title');
            expect(content).toEqual('My content');
        });
    });
});

describe('When not Logged in', async () => {
    test('User cannot create blog posts', async () => {
        const result = await page.post('/api/blogs', {
            title: 'test Title',
            content: 'test content'
        });
        expect(result).toEqual({error: 'You must log in!'});
    });  
    
    test('User cannot get a list of posts', async () => {
        const result = await page.get('/api/blogs');
        expect(result).toEqual({error: 'You must log in!'});
    });
    
});