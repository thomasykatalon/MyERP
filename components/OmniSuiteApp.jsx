"use client";

import React, { useState, useMemo } from 'react';
import Script from 'next/script'; // Import the Next.js Script component

// --- Helper Components (SVG Icons) ---
const OmniLogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5m-5-8h5m-5 4h5"></path>
    </svg>
);

const InventoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
);

const CustomersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197"></path></svg>
);

// --- Main Application Component ---
export default function OmniSuiteApp() {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('inventory'); // 'inventory' or 'customers'
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Data State
    const [inventory, setInventory] = useState([
        { id: 1, name: 'Wireless Mouse', sku: 'WM-1001', category: 'Electronics', quantity: 150, price: 25.99 },
        { id: 2, name: 'Mechanical Keyboard', sku: 'MK-2023', category: 'Electronics', quantity: 8, price: 120.00 },
        { id: 3, name: 'Ergonomic Office Chair', sku: 'OC-500-BLK', category: 'Furniture', quantity: 45, price: 350.50 },
        { id: 4, name: 'USB-C Hub', sku: 'HUB-C-8P', category: 'Accessories', quantity: 200, price: 49.99 },
        { id: 5, name: '27-inch 4K Monitor', sku: 'MON-4K-27', category: 'Electronics', quantity: 0, price: 450.00 },
    ]);

    const [customers, setCustomers] = useState([
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '555-1234', company: 'Innovate Inc.' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-5678', company: 'Solutions Co.' },
        { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-8765', company: 'Tech Forward' },
    ]);

    // Modal State
    const [modal, setModal] = useState({ type: null, data: null }); // e.g., { type: 'edit-item', data: item }

    // --- COMPUTED DATA (MEMOIZED) ---
    const dashboardStats = useMemo(() => {
        const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
        const lowStockCount = inventory.filter(item => item.quantity > 0 && item.quantity < 10).length;
        const outOfStockCount = inventory.filter(item => item.quantity === 0).length;
        return { totalValue, totalItems, lowStockCount, outOfStockCount };
    }, [inventory]);

    // --- DATA HANDLERS ---
    const handleSaveItem = (itemData) => {
        if (itemData.id) { // Update existing item
            setInventory(inventory.map(i => (i.id === itemData.id ? { ...i, ...itemData } : i)));
        } else { // Add new item
            const newId = inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1;
            setInventory([...inventory, { ...itemData, id: newId }]);
        }
        setModal({ type: null, data: null });
    };

    const handleSaveCustomer = (customerData) => {
        if (customerData.id) { // Update existing customer
            setCustomers(customers.map(c => (c.id === customerData.id ? { ...c, ...customerData } : c)));
        } else { // Add new customer
            const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
            setCustomers([...customers, { ...customerData, id: newId }]);
        }
        setModal({ type: null, data: null });
    };
    
    const handleDelete = () => {
        if (!modal.data) return;
        const { type, id } = modal.data;
        if (type === 'item') {
            setInventory(inventory.filter(i => i.id !== id));
        } else if (type === 'customer') {
            setCustomers(customers.filter(c => c.id !== id));
        }
        setModal({ type: null, data: null });
    };
    
    const handleAdjustStock = (itemId, adjustment) => {
        setInventory(inventory.map(item => 
            item.id === itemId ? { ...item, quantity: item.quantity + adjustment } : item
        ));
        setModal({ type: null, data: null });
    };

    // --- UI COMPONENTS ---
    const Sidebar = () => (
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white p-4 space-y-6 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'transform-none' : '-translate-x-full'} md:translate-x-0`}>
             <a href="#" className="flex items-center space-x-2 px-4">
                <OmniLogoIcon />
                <h1 className="text-2xl font-bold">OmniSuite</h1>
            </a>
            <nav>
                <a href="#" id="nav-inventory" onClick={() => setView('inventory')} className={`nav-link flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${view === 'inventory' ? 'bg-gray-700' : ''}`}>
                    <InventoryIcon /> Inventory
                </a>
                <a href="#" id="nav-customers" onClick={() => setView('customers')} className={`nav-link flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${view === 'customers' ? 'bg-gray-700' : ''}`}>
                    <CustomersIcon /> Customers
                </a>
            </nav>
        </div>
    );

    const Header = () => (
        <header className="flex justify-between items-center p-4 bg-white border-b-2 border-gray-200">
            <button id="menu-button" className="text-gray-500 focus:outline-none md:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 id="main-header" className="text-xl font-semibold text-gray-700">{view === 'inventory' ? 'Inventory Dashboard' : 'Customer Management'}</h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, Admin</span>
                <button id="logout-button" className="text-sm text-blue-500 hover:underline">Logout</button>
            </div>
        </header>
    );

    const InventoryView = () => (
        <div id="inventory-view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Inventory Value" value={`$${dashboardStats.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                <StatCard title="Items in Stock" value={dashboardStats.totalItems} />
                <StatCard title="Low Stock Alerts" value={dashboardStats.lowStockCount} color="text-yellow-500" />
                <StatCard title="Out of Stock" value={dashboardStats.outOfStockCount} color="text-red-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Inventory Management</h2>
                    <button id="add-item-button" onClick={() => setModal({ type: 'add-item', data: null })} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Add New Item</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" id="inventory-table">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">SKU</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Quantity</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Price</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length > 0 ? inventory.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-700">{item.id}</td>
                                    <td className="p-3 text-sm text-gray-700 font-medium">{item.name}</td>
                                    <td className="p-3 text-sm text-gray-700">{item.sku}</td>
                                    <td className="p-3 text-sm text-gray-700">{item.quantity}</td>
                                    <td className="p-3 text-sm text-gray-700">${item.price.toFixed(2)}</td>
                                    <td className="p-3 whitespace-nowrap">
                                        <button onClick={() => setModal({ type: 'adjust-stock', data: item })} className="adjust-stock-button text-green-500 hover:text-green-700 mr-2">Adjust</button>
                                        <button onClick={() => setModal({ type: 'edit-item', data: item })} className="edit-item-button text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                                        <button onClick={() => setModal({ type: 'delete', data: { type: 'item', id: item.id, name: item.name } })} className="delete-button text-red-500 hover:text-red-700">Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" id="no-items-message" className="text-center text-gray-500 py-8">No items in inventory.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
    
    const CustomerView = () => (
        <div id="customer-view">
             <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Customer Management</h2>
                    <button id="add-customer-button" onClick={() => setModal({ type: 'add-customer', data: null })} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Add New Customer</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" id="customer-table">
                        <thead>
                            <tr className="bg-gray-50 border-b"><th className="p-3 text-sm font-semibold text-gray-600">ID</th><th className="p-3 text-sm font-semibold text-gray-600">Name</th><th className="p-3 text-sm font-semibold text-gray-600">Email</th><th className="p-3 text-sm font-semibold text-gray-600">Company</th><th className="p-3 text-sm font-semibold text-gray-600">Actions</th></tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 ? customers.map(customer => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-700">{customer.id}</td>
                                    <td className="p-3 text-sm text-gray-700 font-medium">{customer.name}</td>
                                    <td className="p-3 text-sm text-gray-700">{customer.email}</td>
                                    <td className="p-3 text-sm text-gray-700">{customer.company}</td>
                                    <td className="p-3 whitespace-nowrap">
                                        <button onClick={() => setModal({ type: 'edit-customer', data: customer })} className="edit-customer-button text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                                        <button onClick={() => setModal({ type: 'delete', data: { type: 'customer', id: customer.id, name: customer.name } })} className="delete-button text-red-500 hover:text-red-700">Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" id="no-customers-message" className="text-center text-gray-500 py-8">No customers found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const StatCard = ({ title, value, color = 'text-gray-800' }) => (
        <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );

    // --- MODAL COMPONENTS ---
    const ItemModal = ({ item, onSave, onCancel }) => {
        const [formData, setFormData] = useState(item || { name: '', sku: '', category: '', quantity: 0, price: 0.0 });
        
        const handleChange = (e) => {
            const { id, value, type } = e.target;
            setFormData(prev => ({ ...prev, [id]: type === 'number' ? parseFloat(value) || 0 : value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
        };

        return (
            <div id="item-modal" className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
                    <h2 id="modal-title" className="text-2xl font-bold text-gray-800 mb-4">{item ? 'Edit Item' : 'Add New Item'}</h2>
                    <form id="item-form" onSubmit={handleSubmit}>
                        {/* Form fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input type="text" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                             <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                                <input type="text" id="sku" value={formData.sku} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                             <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <input type="text" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input type="number" id="quantity" value={formData.quantity} onChange={handleChange} min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Unit Price</label>
                                <input type="number" id="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">Cancel</button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Save Item</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    
    const CustomerModal = ({ customer, onSave, onCancel }) => {
        const [formData, setFormData] = useState(customer || { name: '', email: '', phone: '', company: '' });

        const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
        };
        
        return (
             <div id="customer-modal" className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                <Script
                    src="https://static.katalon.com/libs/traffic-agent/v1/traffic-agent.min.js"
                    strategy="afterInteractive"
                    client-code="KA-1591642-01"
                />
                <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
                    <h2 id="customer-modal-title" className="text-2xl font-bold text-gray-800 mb-4">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
                    <form id="customer-form" onSubmit={handleSubmit}>
                       <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                             <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                                <input type="text" id="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">Cancel</button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Save Customer</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    
    const AdjustStockModal = ({ item, onSave, onCancel }) => {
        const [adjustment, setAdjustment] = useState('');
        const [error, setError] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            const amount = parseInt(adjustment, 10);
            if (isNaN(amount) || amount === 0) {
                setError('Please enter a valid, non-zero number.');
                return;
            }
            if ((item.quantity + amount) < 0) {
                setError('Adjustment cannot result in negative stock.');
                return;
            }
            onSave(item.id, amount);
        };
        
        return (
            <div id="adjust-stock-modal" className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Adjust Stock</h2>
                    <div className="text-gray-600"><p>Item: <span className="font-semibold">{item.name}</span></p><p>Current Quantity: <span className="font-semibold">{item.quantity}</span></p></div>
                    <form id="adjust-stock-form" onSubmit={handleSubmit} className="mt-4">
                        <div>
                            <label htmlFor="adjustment-quantity-input" className="block text-sm font-medium text-gray-700">Adjustment Amount</label>
                            <input type="number" id="adjustment-quantity-input" value={adjustment} onChange={(e) => { setAdjustment(e.target.value); setError(''); }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            <p className="text-xs text-gray-500 mt-1">Positive to add, negative to remove.</p>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">Cancel</button>
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">Save Adjustment</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    
    const DeleteModal = ({ item, onConfirm, onCancel }) => (
        <div id="delete-modal" className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
                <p className="text-gray-600 my-4">{`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">Delete</button>
                </div>
            </div>
        </div>
    );
    
    // --- MAIN RENDER ---
    return (
        <>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        {view === 'inventory' ? <InventoryView /> : <CustomerView />}
                    </main>
                </div>
            </div>
            
            {/* Modal Renderer */}
            {modal.type === 'add-item1' && <ItemModal onSave={handleSaveItem} onCancel={() => setModal({ type: null, data: null })} />}
            {modal.type === 'edit-item' && <ItemModal item={modal.data} onSave={handleSaveItem} onCancel={() => setModal({ type: null, data: null })} />}
            {modal.type === 'add-customer' && <CustomerModal onSave={handleSaveCustomer} onCancel={() => setModal({ type: null, data: null })} />}
            {modal.type === 'edit-customer' && <CustomerModal customer={modal.data} onSave={handleSaveCustomer} onCancel={() => setModal({ type: null, data: null })} />}
            {modal.type === 'adjust-stock' && <AdjustStockModal item={modal.data} onSave={handleAdjustStock} onCancel={() => setModal({ type: null, data: null })} />}
            {modal.type === 'delete' && <DeleteModal item={modal.data} onConfirm={handleDelete} onCancel={() => setModal({ type: null, data: null })} />}
        </>
    );
}

