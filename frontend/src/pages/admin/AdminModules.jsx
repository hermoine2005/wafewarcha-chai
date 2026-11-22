import AdminCrud from '../../components/AdminCrud';
import Img from '../../components/Img';
import { inr } from '../../services/api';

const t = (name, label, required = true) => ({ name, label, type: 'text', required });
const date = (d) => new Date(d).toLocaleDateString('en-IN');

export const AdminFranchises = () => (
  <AdminCrud title="Manage Franchise Models" endpoint="/franchises"
    note="Sample/demo data - replace with company-approved details when available."
    fields={[t('name', 'Model Name'), { name: 'description', label: 'Description', type: 'textarea', required: true }, t('spaceRequired', 'Space Requirement'),
      { name: 'features', label: 'Features', type: 'list' }, { name: 'benefits', label: 'Benefits', type: 'list' }, { name: 'eligibility', label: 'Eligibility Requirements', type: 'list' }]}
    columns={[{ key: 'name', label: 'Model' }, { key: 'spaceRequired', label: 'Space' }, { label: 'Features', render: (r) => r.features?.length }]} />
);

export const AdminInvestments = () => (
  <AdminCrud title="Manage Investment Details" endpoint="/investments" note="Figures are illustrative estimates until real values are supplied."
    fields={[t('title', 'Title'), { name: 'category', label: 'Category', type: 'select', options: ['Initial Investment', 'Franchise Fee', 'Interior & Setup', 'Equipment', 'Furniture', 'Other Expenses'] },
      { name: 'amount', label: 'Amount (₹)', type: 'number', required: true }, t('note', 'Note', false), { name: 'order', label: 'Display Order', type: 'number', default: 0 }]}
    columns={[{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { label: 'Amount', render: (r) => inr(r.amount) }, { key: 'note', label: 'Note' }]} />
);

export const AdminCosts = () => (
  <AdminCrud title="Manage Operating Costs" endpoint="/costs"
    fields={[t('item', 'Expense Item'), { name: 'monthlyAmount', label: 'Monthly Amount (₹)', type: 'number', required: true }, t('note', 'Note', false), { name: 'order', label: 'Display Order', type: 'number', default: 0 }]}
    columns={[{ key: 'item', label: 'Expense' }, { label: 'Monthly', render: (r) => inr(r.monthlyAmount) }, { key: 'note', label: 'Note' }]} />
);

export const AdminProducts = () => (
  <AdminCrud title="Manage Products" endpoint="/products"
    fields={[t('name', 'Product Name'), { name: 'category', label: 'Category', type: 'select', options: ['Tea Varieties', 'Special Chai', 'Cold Beverages', 'Snacks', 'Food Items'] },
      { name: 'price', label: 'Price (₹)', type: 'number', required: true }, t('image', 'Image URL', false),
      { name: 'description', label: 'Description', type: 'textarea', required: true }, { name: 'available', label: 'Available', type: 'checkbox', default: true }]}
    columns={[{ label: 'Image', render: (r) => <Img src={r.image} alt={r.name} className="thumb" /> }, { key: 'name', label: 'Name' }, { key: 'category', label: 'Category' }, { label: 'Price', render: (r) => inr(r.price) }, { label: 'Status', render: (r) => (r.available ? 'Available' : 'Out of stock') }]} />
);

export const AdminProcess = () => (
  <AdminCrud title="Manage Franchise Process" endpoint="/process"
    fields={[{ name: 'stepNumber', label: 'Step Number', type: 'number', required: true }, t('title', 'Title'), { name: 'description', label: 'Description', type: 'textarea', required: true }]}
    columns={[{ key: 'stepNumber', label: 'Step' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description' }]} />
);

export const AdminGallery = () => (
  <AdminCrud title="Manage Gallery" endpoint="/gallery"
    fields={[t('title', 'Title'), t('imageUrl', 'Image URL'), { name: 'category', label: 'Category', type: 'select', options: ['Cafe Interiors', 'Tea Preparation', 'Products', 'Franchise'] }]}
    columns={[{ label: 'Image', render: (r) => <Img src={r.imageUrl} alt={r.title} className="thumb" /> }, { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }]} />
);

export const AdminUsers = () => (
  <AdminCrud title="Registered Entrepreneurs" endpoint="/users" hideAdd hideEdit note="Deleting a user also deletes their enquiries."
    columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { label: 'Registered', render: (r) => date(r.createdAt) }]} />
);

export const AdminMessages = () => (
  <AdminCrud title="Contact Messages" endpoint="/contact" hideAdd hideEdit
    columns={[{ label: 'Date', render: (r) => date(r.createdAt) }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'subject', label: 'Subject' }, { key: 'message', label: 'Message' }]} />
);
