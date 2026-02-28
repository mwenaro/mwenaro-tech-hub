import { getChatContacts } from './src/lib/chat'

async function test() {
    try {
        console.log('Testing getChatContacts...')
        const contacts = await getChatContacts()
        console.log('Contacts:', JSON.stringify(contacts, null, 2))
    } catch (error) {
        console.error('Error in getChatContacts:', error)
    }
}

test()
