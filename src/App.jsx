import { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class InvoiceApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceNumber: Math.floor(Math.random() * 999) + 1,
      customerName: '',
      date: '',
      items: [{ description: '', quantity: 1, price: 0 }],
      taxRate: 0,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleItemChange = (index, e) => {
    const items = [...this.state.items];
    items[index][e.target.name] = e.target.value;
    this.setState({ items });
  };

  addItem = () => {
    this.setState((prevState) => ({
      items: [...prevState.items, { description: '', quantity: 1, price: 0 }],
    }));
  };

  removeItem = (index) => {
    this.setState((prevState) => ({
      items: prevState.items.filter((_, i) => i !== index),
    }));
  };

  calculateTotal = () => {
    const subtotal = this.state.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
    const tax = subtotal * (this.state.taxRate / 100);
    return (subtotal + tax).toFixed(2);
  };

  printInvoice = () => {
    const input = document.getElementById('invoice');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice_${this.state.invoiceNumber}.pdf`);
    });
  };

  render() {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Invoice Generator</h2>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={this.state.invoiceNumber}
                onChange={this.handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter invoice number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={this.state.customerName}
                onChange={this.handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">Date</label>
              <input
                type="date"
                name="date"
                value={this.state.date}
                onChange={this.handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={this.state.taxRate}
                onChange={this.handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter tax rate"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Items</h3>
            {this.state.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 mt-2">
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => this.handleItemChange(index, e)}
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Description"
                />
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => this.handleItemChange(index, e)}
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Quantity"
                />
                <input
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={(e) => this.handleItemChange(index, e)}
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Price"
                />
                <button
                  onClick={() => this.removeItem(index)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={this.addItem}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>

          {/* Total */}
          <div className="mt-4 text-right">
            <h3 className="text-xl font-semibold text-gray-800">Total: {this.calculateTotal()} ৳</h3>
          </div>

          {/* Save Invoice */}
          <button
            onClick={this.printInvoice}
            className="mt-6 bg-green-500 text-white w-full p-3 rounded-md hover:bg-green-600"
          >
            Save Invoice
          </button>
        </div>

        {/* Hidden Invoice for Printing */}
        <div id="invoice" className="hidden">
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>Invoice #{this.state.invoiceNumber}</h2>
            <h3 style={{ textAlign: 'center' }}>Customer: {this.state.customerName}</h3>
            <h3 style={{ textAlign: 'center' }}>Date: {this.state.date}</h3>
            <h4>Items:</h4>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {this.state.items.map((item, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  {item.description} - {item.quantity} @ ${item.price} each
                </li>
              ))}
            </ul>
            <h3 style={{ textAlign: 'right' }}>Total: {this.calculateTotal()} ৳</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceApp;
