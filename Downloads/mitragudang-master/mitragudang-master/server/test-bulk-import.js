const API_URL = 'http://localhost:3002/api';

async function post(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || response.statusText);
    return { data: json };
}

async function get(url) {
    const response = await fetch(url);
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || response.statusText);
    return { data: json };
}

async function del(url) {
    const response = await fetch(url, { method: 'DELETE' });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || response.statusText);
    return { data: json };
}

async function testBulkOperations() {
    console.log('🚀 Starting Bulk Operations Test...');

    // 1. Test Bulk Create (Import Stok Awal)
    console.log('\n📦 Testing Bulk Create Items...');
    const newItems = [
        {
            name: `Test Bulk Item 1 ${Date.now()}`,
            description: 'Bulk created item 1',
            category: 'electronics',
            quantity: 10,
            minQuantity: 5
        },
        {
            name: `Test Bulk Item 2 ${Date.now()}`,
            description: 'Bulk created item 2',
            category: 'office-supplies',
            quantity: 0,
            minQuantity: 10
        }
    ];

    try {
        const createRes = await post(`${API_URL}/items/bulk`, newItems);
        console.log('✅ Bulk create successful!');
        console.log('Response:', createRes.data);

        if (createRes.data.count !== 2) {
            console.error('❌ Expected 2 created items, got', createRes.data.count);
        }

        const createdIds = createRes.data.items.map(i => i.id);
        console.log('Created IDs:', createdIds);

        // 2. Test Bulk Update Stock (Import Stok Akhir)
        console.log('\n📈 Testing Bulk Update Stock...');

        const updates = [
            { id: createdIds[0], quantity: 20 }, // Update by ID
            { name: newItems[1].name, quantity: 15 } // Update by Name
        ];

        const updateRes = await post(`${API_URL}/items/bulk-update-stock`, updates);
        console.log('✅ Bulk update stock successful!');
        console.log('Response:', updateRes.data);

        if (updateRes.data.updatedCount !== 2) {
            console.error('❌ Expected 2 updated items, got', updateRes.data.updatedCount);
        }

        // Verify updates
        const item1 = await get(`${API_URL}/items/${createdIds[0]}`);
        const item2 = updateRes.data.results.find(r => r.name === newItems[1].name);

        console.log('\n🔍 Verifying updates...');
        console.log(`Item 1 (ID: ${createdIds[0]}) New Quantity: ${item1.data.quantity} (Expected: 20)`);
        console.log(`Item 2 (Name: ${newItems[1].name}) New Quantity: ${item2.newQuantity} (Expected: 15)`);

        // Cleanup
        console.log('\n🧹 Cleaning up test items...');
        await del(`${API_URL}/items/${createdIds[0]}`);
        await del(`${API_URL}/items/${item2.id}`);
        console.log('✅ Cleanup complete');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testBulkOperations();
