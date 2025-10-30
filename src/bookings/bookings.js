import { Component } from 'react';
import {
    DataGrid,
    Column,
    Paging,
    Pager,
    Editing
} from "devextreme-react/data-grid";
import './bookings.css';
import "devextreme/dist/css/dx.light.css";

export default class Bookings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchAppointments();
    }

    fetchAppointments = () => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8082/booking/api/appointments", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then((data) => {
                this.setState({ appointments: data, loading: false });
            })
            .catch((error) => {
                console.error("Failed to load appointments:", error);
                this.setState({ error: "Failed to fetch appointments", loading: false });
            });
    };

    handleRowUpdate = (e) => {
        const token = localStorage.getItem("token");
        const updated = { ...e.oldData, ...e.newData };

        return fetch(`http://localhost:8082/booking/api/appointments/${updated.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(updated)
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then((data) => {
                this.setState((prev) => ({
                    appointments: prev.appointments.map((a) =>
                        a.id === data.id ? data : a
                    )
                }));
            })
            .catch((error) => {
                console.error("Update failed:", error);
                alert("Failed to update appointment.");
            });
    };

    handleRowRemove = (e) => {
        const token = localStorage.getItem("token");

        return fetch(`http://localhost:8082/booking/api/appointments/${e.data.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                this.setState((prev) => ({
                    appointments: prev.appointments.filter(
                        (a) => a.id !== e.data.id
                    )
                }));
            })
            .catch((error) => {
                console.error("Delete failed:", error);
                alert("Failed to delete appointment.");
            });
    };

    render() {
        const { appointments, loading, error } = this.state;

        if (loading) return <div>Loading booked appointments...</div>;
        if (error) return <div style={{ color: "red" }}>{error}</div>;

        return (
            <div style={{ margin: "30px" }}>
                <h2>Booked Appointments</h2>
                <DataGrid
                    dataSource={appointments}
                    keyExpr="id"
                    showBorders={true}
                    columnAutoWidth={true}
                    hoverStateEnabled={true}
                    onRowUpdated={this.handleRowUpdate}
                    onRowRemoved={this.handleRowRemove}
                >
                    <Editing
                        mode="popup"
                        allowUpdating={true}
                        allowDeleting={true}
                        popup={{
                            title: "Edit Appointment",
                            showTitle: true,
                            width: 600,
                            height: 450,
                        }}
                        form={{
                            colCount: 2,
                            items: [
                                "customerName",
                                "customerEmail",
                                "customerPhone",
                                "branch",
                                {
                                    dataField: "appointmentDateTime",
                                    editorType: "dxDateBox",
                                    editorOptions: { type: "datetime" },
                                },
                                "reason"
                            ]
                        }}
                    />

                    <Column dataField="id" caption="ID" width={70} allowEditing={false} />
                    <Column dataField="customerName" caption="Customer" />
                    <Column dataField="customerEmail" caption="Email" />
                    <Column dataField="customerPhone" caption="Phone" />
                    <Column dataField="branch" caption="Branch" />
                    <Column dataField="appointmentDateTime" caption="Date & Time" dataType="datetime" />
                    <Column dataField="reason" caption="Reason" />

                    <Paging defaultPageSize={10} />
                    <Pager
                        showPageSizeSelector={true}
                        allowedPageSizes={[5, 10, 20]}
                        showInfo={true}
                    />
                </DataGrid>
            </div>
        );
    }
}
