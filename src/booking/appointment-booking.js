import { Component } from 'react';
import Form, { GroupItem, SimpleItem, RequiredRule, DateBoxEditor } from 'devextreme-react/form';
import { Navigate } from 'react-router-dom';
import './appointment-booking.css';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingData: {
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        branch: '',
        appointmentDateTime: null,
        reason: ''
      },
      submitting: false,
      submitted: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, field) {
    this.setState(prevState => ({
      bookingData: {
        ...prevState.bookingData,
        [field]: e.value
      }
    }));
  }

  onSubmit() {
    this.setState({ submitting: true });
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8082/booking/api/appointments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(this.state.bookingData)
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then(() => {
        this.setState({ submitting: false, submitted: true });
      })
      .catch(error => {
        console.error('Booking failed:', error);
        alert('Failed to submit booking. Please try again.');
        this.setState({ submitting: false });
      });
  }

  render() {
    if (this.state.submitted) {
      return <Navigate to="/bookings" replace />;
    }

    return (
      <div className="center-form">
        <div className="form-container">
          <h3>Book an Appointment</h3>

          <Form colCount={1}>
            <GroupItem>
              <SimpleItem dataField="Customer Name" isRequired>
                <RequiredRule message="Customer name is required" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter customer name"
                  value={this.state.bookingData.customerName}
                  onChange={(e) => this.handleChange({ value: e.target.value }, 'customerName')}
                />
              </SimpleItem>

              <SimpleItem dataField="Customer Email" isRequired>
                <RequiredRule message="Customer email is required" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter customer email"
                  value={this.state.bookingData.customerEmail}
                  onChange={(e) => this.handleChange({ value: e.target.value }, 'customerEmail')}
                />
              </SimpleItem>

              <SimpleItem dataField="Customer Phone" isRequired>
                <RequiredRule message="Customer phone is required" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter customer phone"
                  value={this.state.bookingData.customerPhone}
                  onChange={(e) => this.handleChange({ value: e.target.value }, 'customerPhone')}
                />
              </SimpleItem>

              <SimpleItem dataField="Branch" isRequired>
                <RequiredRule message="Branch is required" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Branch"
                  value={this.state.bookingData.branch}
                  onChange={(e) => this.handleChange({ value: e.target.value }, 'branch')}
                />
              </SimpleItem>

              <SimpleItem dataField="Appointment Date" editorType="dxDateBox" isRequired>
                <RequiredRule message="Appointment date is required" />
                <input
                  type="datetime-local"
                  className="form-control"
                  value={this.state.bookingData.appointmentDate || ''}
                  onChange={(e) => this.handleChange({ value: e.target.value }, 'appointmentDate')}
                />
              </SimpleItem>

              <SimpleItem dataField="Reason" isRequired>
                <RequiredRule message="Reason is required" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Reason"
                  value={this.state.bookingData.reason}
                  onChange={(e) => this.handleChange({ value: e.target.value }, 'reason')}
                />
              </SimpleItem>
            </GroupItem>

            <GroupItem colCount={1}>
              <SimpleItem
                editorType="dxButton"
                editorOptions={{
                  text: this.state.submitting ? 'Submitting...' : 'Submit Booking',
                  type: 'default',
                  useSubmitBehavior: true,
                  disabled: this.state.submitting,
                  width: '100%',
                  onClick: this.onSubmit
                }}
              />
            </GroupItem>
          </Form>
        </div>
      </div>
    );
  }
}
