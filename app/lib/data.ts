// import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { customers, invoices, revenue } from './placeholder-data';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Using placeholder data instead of database
    const data = revenue;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    // Using placeholder data instead of database
    const data = invoices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((invoice) => {
        const customer = customers.find(c => c.id === invoice.customer_id);
        // Generate unique ID using customer_id, date, and amount to ensure uniqueness
        const uniqueId = `${invoice.customer_id}-${invoice.date}-${invoice.amount}`;
        return {
          id: uniqueId,
          amount: invoice.amount,
          name: customer?.name || 'Unknown',
          image_url: customer?.image_url || '',
          email: customer?.email || ''
        };
      });

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // Using placeholder data instead of database queries
    const numberOfInvoices = invoices.length;
    const numberOfCustomers = customers.length;
    
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');
    
    const totalPaidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalPendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    
    const totalPaidInvoices = formatCurrency(totalPaidAmount);
    const totalPendingInvoices = formatCurrency(totalPendingAmount);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Using placeholder data instead of database
    let filteredInvoices = invoices;
    
    if (query) {
      filteredInvoices = invoices.filter(invoice => {
        const customer = customers.find(c => c.id === invoice.customer_id);
        const customerName = customer?.name || '';
        const customerEmail = customer?.email || '';
        
        return (
          customerName.toLowerCase().includes(query.toLowerCase()) ||
          customerEmail.toLowerCase().includes(query.toLowerCase()) ||
          invoice.amount.toString().includes(query) ||
          invoice.date.includes(query) ||
          invoice.status.toLowerCase().includes(query.toLowerCase())
        );
      });
    }

    // Sort by date descending and apply pagination
    const sortedInvoices = filteredInvoices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(offset, offset + ITEMS_PER_PAGE);

    // Map to include customer information
    const invoicesWithCustomers = sortedInvoices.map((invoice, index) => {
      const customer = customers.find(c => c.id === invoice.customer_id);
      // Generate unique ID using customer_id, date, and amount to ensure uniqueness
      const uniqueId = `${invoice.customer_id}-${invoice.date}-${invoice.amount}`;
      return {
        id: uniqueId,
        amount: invoice.amount,
        date: invoice.date,
        status: invoice.status,
        name: customer?.name || 'Unknown',
        email: customer?.email || '',
        image_url: customer?.image_url || '',
      };
    });

    return invoicesWithCustomers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    // Using placeholder data instead of database
    let filteredInvoices = invoices;
    
    if (query) {
      filteredInvoices = invoices.filter(invoice => {
        const customer = customers.find(c => c.id === invoice.customer_id);
        const customerName = customer?.name || '';
        const customerEmail = customer?.email || '';
        
        return (
          customerName.toLowerCase().includes(query.toLowerCase()) ||
          customerEmail.toLowerCase().includes(query.toLowerCase()) ||
          invoice.amount.toString().includes(query) ||
          invoice.date.includes(query) ||
          invoice.status.toLowerCase().includes(query.toLowerCase())
        );
      });
    }

    const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    // Parse the unique ID to extract customer_id, date, and amount
    const parts = id.split('-');
    if (parts.length < 3) {
      throw new Error('Invalid invoice ID format');
    }
    
    // Reconstruct the search criteria from the unique ID
    const customerId = parts.slice(0, -2).join('-'); // customer_id might contain hyphens
    const date = parts[parts.length - 2];
    const amount = parseInt(parts[parts.length - 1]);
    
    // Find the invoice using customer_id, date, and amount
    const invoice = invoices.find(inv => 
      inv.customer_id === customerId && 
      inv.date === date && 
      inv.amount === amount
    );
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return {
      id: id,
      customer_id: invoice.customer_id,
      amount: invoice.amount / 100, // Convert from cents to dollars
      status: invoice.status as 'pending' | 'paid',
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    // Using placeholder data instead of database
    const customersData = customers
      .map(customer => ({
        id: customer.id,
        name: customer.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return customersData;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    // Using placeholder data instead of database
    let filteredCustomers = customers;
    
    if (query) {
      filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    const customersData = filteredCustomers.map((customer) => {
      const customerInvoices = invoices.filter(inv => inv.customer_id === customer.id);
      const totalInvoices = customerInvoices.length;
      const totalPending = customerInvoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
      const totalPaid = customerInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices: totalInvoices,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return customersData;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
