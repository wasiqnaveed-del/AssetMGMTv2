export interface Asset {
  Asset_ID: string;
  Name: string;
  Category: 'Electrical' | 'HVAC/Mech' | 'IT/Servers' | 'Vehicles' | 'Other';
  Sub_Category: string;
  Location_Name: string;
  Block: string;
  Floor: string;
  Zone: string;
  Latitude: number;
  Longitude: number;
  Is_Mobile: boolean; // boolean or "TRUE"/"FALSE"
  Status: 'Active' | 'Under Maintenance' | 'Broken' | 'Decommissioned' | 'In Storage';
  Purchase_Date: string;
  Purchase_Cost: number;
  Current_Value: number;
  Depreciation_Method: string;
  Warranty_Expiry: string;
  Manufacturer: string;
  Model: string;
  Serial_No: string;
  Photo_URL: string;
  Drive_Doc_URL: string;
  Commissioned_Date: string;
  Decommissioned_Date: string;
  Notes: string;
  Last_Modified_By: string;
  Last_Modified_At: string;
}

export interface MaintenanceLog {
  Log_ID: string;
  Asset_ID: string;
  Date: string;
  Type: 'Scheduled' | 'Corrective' | 'Preventive' | 'Upgrade';
  Description: string;
  Technician: string;
  Vendor: string;
  Duration_Hours: number;
  Labor_Cost: number;
  Parts_Cost: number;
  Total_Cost: number;
  Invoice_No: string;
  Status: 'Pending' | 'Completed' | 'In Progress';
  Downtime_Hours: number;
  Root_Cause?: string;
  Resolution?: string;
  Attachments_URL?: string;
  Logged_By: string;
  Logged_At: string;
}

export interface BreakdownLog {
  Breakdown_ID: string;
  Asset_ID: string;
  Date_Reported: string;
  Date_Resolved: string;
  Reported_By: string;
  Root_Cause: string;
  Impact: 'Low' | 'Medium' | 'High' | 'Critical';
  Downtime_Hours: number;
  Repair_Cost: number;
  Parts_Used: string;
  Resolution_Notes: string;
  Linked_Log_ID: string;
  Logged_At: string;
}

export interface Expense {
  Expense_ID: string;
  Asset_ID: string;
  Date: string;
  Category: string;
  Vendor: string;
  Invoice_No: string;
  Description: string;
  Amount: number;
  Currency: string;
  Expense_Type: 'Operational' | 'Capital' | 'Maintenance' | 'Other';
  Linked_Log_ID: string;
  Receipt_URL: string;
  Approved_By: string;
  Logged_By: string;
  Logged_At: string;
}

export interface PMSchedule {
  Schedule_ID: string;
  Asset_ID: string;
  Task_Name: string;
  Frequency_Days: number;
  Last_Done: string;
  Next_Due: string;
  Assigned_To: string;
  Priority: 'Low' | 'Medium' | 'High' | 'Critical';
  Instructions_URL: string;
  Active: boolean;
  Auto_Alert_Email: string;
}

export interface User {
  User_ID: string;
  Email: string;
  Name: string;
  Role: 'Admin' | 'Viewer';
  Token: string;
  Token_Expires: string;
  Last_Login: string;
  Active: boolean;
}

export interface QRRegistry {
  QR_ID: string;
  Asset_ID: string;
  Token: string;
  Full_URL: string;
  Generated_Date: string;
  Generated_By: string;
  Active: boolean;
  Last_Scanned: string;
  Scan_Count: number;
}

export interface AuditTrail {
  Audit_ID: string;
  Timestamp: string;
  User_Email: string;
  Action: string;
  Sheet_Tab: string;
  Asset_ID: string;
  Field_Changed: string;
  Old_Value: string;
  New_Value: string;
  IP_Note: string;
}

export interface SparePart {
  Spare_ID: string;
  Asset_ID: string;
  Log_ID: string;
  Part_Name: string;
  Part_No: string;
  Quantity: number;
  Unit_Cost: number;
  Total_Cost: number;
  Supplier: string;
  Date_Used: string;
}

export interface DatabaseState {
  assets: Asset[];
  maintenanceLogs: MaintenanceLog[];
  breakdownLogs: BreakdownLog[];
  expenses: Expense[];
  pmSchedules: PMSchedule[];
  users: User[];
  qrRegistries: QRRegistry[];
  auditTrails: AuditTrail[];
  spares: SparePart[];
}
