import { DatabaseState, Asset, MaintenanceLog, BreakdownLog, Expense, PMSchedule, User, QRRegistry, AuditTrail, SparePart } from './types';

export const INITIAL_ASSETS: Asset[] = [
  {
    Asset_ID: 'AST-001',
    Name: 'Main Server Rack Alpha',
    Category: 'IT/Servers',
    Sub_Category: 'Core Compute',
    Location_Name: 'Corporate Headquarters',
    Block: 'Building A',
    Floor: '3rd Floor',
    Zone: 'Data Center Suite 302',
    Latitude: 40.7580,
    Longitude: -73.9855,
    Is_Mobile: false,
    Status: 'Active',
    Purchase_Date: '2024-01-15',
    Purchase_Cost: 45000,
    Current_Value: 36000,
    Depreciation_Method: 'Straight Line (5 yr)',
    Warranty_Expiry: '2027-01-15',
    Manufacturer: 'Dell Enterprise',
    Model: 'PowerEdge R760',
    Serial_No: 'DSG-98231-X',
    Photo_URL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    Drive_Doc_URL: 'https://docs.google.com/document/d/1demo-server-spec/edit',
    Commissioned_Date: '2024-02-01',
    Decommissioned_Date: '',
    Notes: 'Houses primary LDAP, DNS, and internal microservices. Monitored 24/7.',
    Last_Modified_By: 'wasiq.naveed@gmail.com',
    Last_Modified_At: '2026-05-18T10:14:00Z'
  },
  {
    Asset_ID: 'AST-002',
    Name: 'Main Chiller Compressor Unit 1',
    Category: 'HVAC/Mech',
    Sub_Category: 'Cooling Tower Systems',
    Location_Name: 'Corporate Headquarters',
    Block: 'Building A',
    Floor: 'Roof Level',
    Zone: 'North Deck Mech Yard',
    Latitude: 40.7570,
    Longitude: -73.9860,
    Is_Mobile: false,
    Status: 'Under Maintenance',
    Purchase_Date: '2022-04-10',
    Purchase_Cost: 78000,
    Current_Value: 53000,
    Depreciation_Method: 'Straight Line (10 yr)',
    Warranty_Expiry: '2027-04-10',
    Manufacturer: 'Trane Technologies',
    Model: 'CTV-Helical Rotary',
    Serial_No: 'TRN-COMP-9988-B',
    Photo_URL: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80',
    Drive_Doc_URL: 'https://docs.google.com/document/d/1demo-chiller-sop/edit',
    Commissioned_Date: '2022-05-01',
    Decommissioned_Date: '',
    Notes: 'Undergoing routine 6-month compressor oil replacement and sensor check.',
    Last_Modified_By: 'wasiq.naveed@gmail.com',
    Last_Modified_At: '2026-05-22T02:30:00Z'
  },
  {
    Asset_ID: 'AST-003',
    Name: 'Fleet Logistical Delivery Van A',
    Category: 'Vehicles',
    Sub_Category: 'EV Fleet Cargo',
    Location_Name: 'Metro Logistics Hub',
    Block: 'Garage Depot',
    Floor: 'Ground Level',
    Zone: 'EV Charger Bay 4',
    Latitude: 40.7600,
    Longitude: -73.9810,
    Is_Mobile: true,
    Status: 'Active',
    Purchase_Date: '2023-08-20',
    Purchase_Cost: 52000,
    Current_Value: 41000,
    Depreciation_Method: 'Double Declining (7 yr)',
    Warranty_Expiry: '2028-08-20',
    Manufacturer: 'Ford Pro',
    Model: 'E-Transit Cargo',
    Serial_No: 'FRD-EV-77612-G',
    Photo_URL: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    Drive_Doc_URL: 'https://docs.google.com/document/d/1demo-vehicle-log/edit',
    Commissioned_Date: '2023-09-01',
    Decommissioned_Date: '',
    Notes: 'Fully electric zero-emission fleet vehicle. Integrated telematics system active.',
    Last_Modified_By: 'system-sync-agent@assetops.internal',
    Last_Modified_At: '2026-05-22T04:10:00Z'
  },
  {
    Asset_ID: 'AST-004',
    Name: 'Dual-Chamber Transformer DB-7',
    Category: 'Electrical',
    Sub_Category: 'Substation Distribution',
    Location_Name: 'Corporate Headquarters',
    Block: 'Building B',
    Floor: 'Sub-Basement B1',
    Zone: 'Main High-Voltage Switchroom',
    Latitude: 40.7592,
    Longitude: -73.9830,
    Is_Mobile: false,
    Status: 'Active',
    Purchase_Date: '2021-11-05',
    Purchase_Cost: 110000,
    Current_Value: 75000,
    Depreciation_Method: 'Straight Line (15 yr)',
    Warranty_Expiry: '2026-11-05',
    Manufacturer: 'Siemens Energy',
    Model: 'SITRAS-Transformer',
    Serial_No: 'SIE-DB7-88214-W',
    Photo_URL: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    Drive_Doc_URL: 'https://docs.google.com/document/d/1demo-transformer-docs/edit',
    Commissioned_Date: '2021-12-01',
    Decommissioned_Date: '',
    Notes: 'Feeds emergency back-up power circuits across Blocks B and C. Calibrated annually.',
    Last_Modified_By: 'wasiq.naveed@gmail.com',
    Last_Modified_At: '2026-05-10T08:00:00Z'
  },
  {
    Asset_ID: 'AST-005',
    Name: 'Mobile Telecom Command Unit #2',
    Category: 'Vehicles',
    Sub_Category: 'SatCom Mobil Vehicle',
    Location_Name: 'Tri-State Operations Center',
    Block: 'Mobile Command Garage',
    Floor: 'Ground Level',
    Zone: 'Sector 5 Launchpad',
    Latitude: 40.7550,
    Longitude: -73.9890,
    Is_Mobile: true,
    Status: 'Broken',
    Purchase_Date: '2024-03-30',
    Purchase_Cost: 135000,
    Current_Value: 122000,
    Depreciation_Method: 'Straight Line (8 yr)',
    Warranty_Expiry: '2029-03-30',
    Manufacturer: 'Oshkosh Defense',
    Model: 'M-Com Sat-8v',
    Serial_No: 'OSH-SAT-0021-A',
    Photo_URL: 'https://images.unsplash.com/photo-1516576885502-d5334de39bc7?auto=format&fit=crop&w=600&q=80',
    Drive_Doc_URL: 'https://docs.google.com/document/d/1demo-satcom-manual/edit',
    Commissioned_Date: '2024-04-15',
    Decommissioned_Date: '',
    Notes: 'Hydraulic leveling jack seal ruptured. Mobile mast locked in down-state. Awaiting specialized technician repair.',
    Last_Modified_By: 'wasiq.naveed@gmail.com',
    Last_Modified_At: '2026-05-21T18:45:00Z'
  },
  {
    Asset_ID: 'AST-006',
    Name: 'Corporate Backup UPS Battery Bank C',
    Category: 'Electrical',
    Sub_Category: 'Lithium Storage Blocks',
    Location_Name: 'Corporate Headquarters',
    Block: 'Building A',
    Floor: 'Basement Level B2',
    Zone: 'Emergency Power Vault',
    Latitude: 40.7582,
    Longitude: -73.9850,
    Is_Mobile: false,
    Status: 'Active',
    Purchase_Date: '2023-01-20',
    Purchase_Cost: 85000,
    Current_Value: 68000,
    Depreciation_Method: 'Straight Line (10 yr)',
    Warranty_Expiry: '2028-01-20',
    Manufacturer: 'Tesla Energy',
    Model: 'Powerpack 2 Plus',
    Serial_No: 'TSL-PWP-330101-C',
    Photo_URL: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=600&q=80',
    Drive_Doc_URL: 'https://docs.google.com/document/d/1demo-ups-specs/edit',
    Commissioned_Date: '2023-02-15',
    Decommissioned_Date: '',
    Notes: 'Connected directly to Core Compute Server Suite. Weekly load checks scheduled.',
    Last_Modified_By: 'system-sync-agent@assetops.internal',
    Last_Modified_At: '2026-05-22T01:00:00Z'
  }
];

export const INITIAL_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    Log_ID: 'MNT-1001',
    Asset_ID: 'AST-002',
    Date: '2026-05-22',
    Type: 'Preventive',
    Description: 'Regular 6-Month Oil & Filter Overhaul and refrigerant leak integrity check.',
    Technician: 'Sarah Jenkins',
    Vendor: 'Trane Certified NY Services',
    Duration_Hours: 4.5,
    Labor_Cost: 450,
    Parts_Cost: 320,
    Total_Cost: 770,
    Invoice_No: 'INV-2026-00412',
    Status: 'In Progress',
    Downtime_Hours: 4,
    Root_Cause: '',
    Resolution: '',
    Logged_By: 'wasiq.naveed@gmail.com',
    Logged_At: '2026-05-22T02:30:00Z'
  },
  {
    Log_ID: 'MNT-1002',
    Asset_ID: 'AST-001',
    Date: '2026-04-12',
    Type: 'Scheduled',
    Description: 'Replacing backup air filter cartridges in primary rack ventilation cooling bays.',
    Technician: 'Mike Vance',
    Vendor: 'In-House Facilities IT',
    Duration_Hours: 1.5,
    Labor_Cost: 150,
    Parts_Cost: 75,
    Total_Cost: 225,
    Invoice_No: 'INV-IH-2026-002',
    Status: 'Completed',
    Downtime_Hours: 0,
    Root_Cause: 'Predictive Filter Expired',
    Resolution: 'Swapped all primary exhaust filters and reset dust sensors.',
    Logged_By: 'wasiq.naveed@gmail.com',
    Logged_At: '2026-04-12T15:20:00Z'
  },
  {
    Log_ID: 'MNT-1003',
    Asset_ID: 'AST-004',
    Date: '2026-01-10',
    Type: 'Preventive',
    Description: 'Dissolved gas analysis (DGA) thermal profiling and high-voltage contact test.',
    Technician: 'Darius Thorne',
    Vendor: 'GridTech Infrastructure Spc.',
    Duration_Hours: 6.0,
    Labor_Cost: 1100,
    Parts_Cost: 0,
    Total_Cost: 1100,
    Invoice_No: 'INV-GRID-77615',
    Status: 'Completed',
    Downtime_Hours: 6,
    Root_Cause: 'Annual High-Voltage Calibration Standards',
    Resolution: 'Verified dielectric strength of cooling oil is at 45kV. Re-torqued terminal busbars to spec.',
    Logged_By: 'wasiq.naveed@gmail.com',
    Logged_At: '2026-01-10T17:00:00Z'
  }
];

export const INITIAL_BREAKDOWN_LOGS: BreakdownLog[] = [
  {
    Breakdown_ID: 'BRK-5001',
    Asset_ID: 'AST-005',
    Date_Reported: '2026-05-21',
    Date_Resolved: '',
    Reported_By: 'Capt. Marcus Brody',
    Root_Cause: 'Hydraulic seal rupture on main mast piston under negative wind load.',
    Impact: 'Critical',
    Downtime_Hours: 24,
    Repair_Cost: 0,
    Parts_Used: '',
    Resolution_Notes: 'Hydraulic components ordered. Pending vendor arrival scheduled for tomorrow morning.',
    Linked_Log_ID: '',
    Logged_At: '2026-05-21T18:45:00Z'
  },
  {
    Breakdown_ID: 'BRK-5002',
    Asset_ID: 'AST-003',
    Date_Reported: '2026-02-14',
    Date_Resolved: '2026-02-14',
    Reported_By: 'Dennis Miller',
    Root_Cause: 'EV Telematics charging module fails handshake protocol.',
    Impact: 'Medium',
    Downtime_Hours: 5,
    Repair_Cost: 450,
    Parts_Used: 'OEM Telematics Controller board (A-617)',
    Resolution_Notes: 'Swapped module controller with in-stock backup. Re-flashed localized operational software. EV charging validated.',
    Linked_Log_ID: 'MNT-0951',
    Logged_At: '2026-02-14T09:30:00Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    Expense_ID: 'EXP-8001',
    Asset_ID: 'AST-001',
    Date: '2024-01-15',
    Category: 'IT Systems Capital',
    Vendor: 'Dell Enterprise Finance',
    Invoice_No: 'DL-CAP-981',
    Description: 'First installation capital payment for Rack Alpha Dell nodes.',
    Amount: 45000,
    Currency: 'USD',
    Expense_Type: 'Capital',
    Linked_Log_ID: '',
    Receipt_URL: 'https://drive.google.com/file/d/receipt-ast001',
    Approved_By: 'Corporate Procurement Office',
    Logged_By: 'wasiq.naveed@gmail.com',
    Logged_At: '2024-01-15T09:00:00Z'
  },
  {
    Expense_ID: 'EXP-8002',
    Asset_ID: 'AST-002',
    Date: '2026-05-22',
    Category: 'Machinery Maintenance',
    Vendor: 'Trane Certified NY Services',
    Invoice_No: 'INV-2026-00412',
    Description: 'Authorized pre-payment on routine overhaul filter/oil components.',
    Amount: 770,
    Currency: 'USD',
    Expense_Type: 'Maintenance',
    Linked_Log_ID: 'MNT-1001',
    Receipt_URL: 'https://drive.google.com/file/d/receipt-inv2026',
    Approved_By: 'FMD Operations Manager',
    Logged_By: 'wasiq.naveed@gmail.com',
    Logged_At: '2026-05-22T02:35:00Z'
  },
  {
    Expense_ID: 'EXP-8003',
    Asset_ID: 'AST-004',
    Date: '2026-01-10',
    Category: 'Electricity Substation Maintenance',
    Vendor: 'GridTech Infrastructure Spc.',
    Invoice_No: 'INV-GRID-77615',
    Description: 'Annual substation dielectric cooling oil DGA profiling labor.',
    Amount: 1100,
    Currency: 'USD',
    Expense_Type: 'Maintenance',
    Linked_Log_ID: 'MNT-1003',
    Receipt_URL: 'https://drive.google.com/file/d/receipt-gridtech',
    Approved_By: 'Director of Plant Safety',
    Logged_By: 'wasiq.naveed@gmail.com',
    Logged_At: '2026-01-10T17:05:00Z'
  },
  {
    Expense_ID: 'EXP-8004',
    Asset_ID: 'AST-003',
    Date: '2026-02-14',
    Category: 'Fleet Telematics Parts',
    Vendor: 'Ford Pro Parts Supply',
    Invoice_No: 'FPP-9811',
    Description: 'Replacements Telematics module for EV-Cargo logistics van.',
    Amount: 450,
    Currency: 'USD',
    Expense_Type: 'Maintenance',
    Linked_Log_ID: 'MNT-0951',
    Receipt_URL: 'https://drive.google.com/file/d/receipt-tele',
    Approved_By: 'Dennis Miller',
    Logged_By: 'wasiq.naveed@gmail.com',
    Logged_At: '2026-02-14T09:40:00Z'
  }
];

export const INITIAL_PM_SCHEDULES: PMSchedule[] = [
  {
    Schedule_ID: 'SCH-301',
    Asset_ID: 'AST-002',
    Task_Name: '6-Month Compressor Overhaul & Oil Replacement',
    Frequency_Days: 180,
    Last_Done: '2025-11-23',
    Next_Due: '2026-05-22', // Overdue or Due Today
    Assigned_To: 'Sarah Jenkins',
    Priority: 'High',
    Instructions_URL: 'https://docs.google.com/document/d/1demo-chiller-sop/edit',
    Active: true,
    Auto_Alert_Email: 'eafaadmin@gmail.com'
  },
  {
    Schedule_ID: 'SCH-302',
    Asset_ID: 'AST-001',
    Task_Name: 'Weekly Rack Filter Dust Vacuuming',
    Frequency_Days: 7,
    Last_Done: '2026-05-20',
    Next_Due: '2026-05-27',
    Assigned_To: 'Michael Vance',
    Priority: 'Medium',
    Instructions_URL: 'https://docs.google.com/document/d/1demo-server-spec/edit',
    Active: true,
    Auto_Alert_Email: 'eafaadmin@gmail.com'
  },
  {
    Schedule_ID: 'SCH-303',
    Asset_ID: 'AST-004',
    Task_Name: 'Annual Dielectric Oil Lab Assessment',
    Frequency_Days: 365,
    Last_Done: '2026-01-10',
    Next_Due: '2027-01-10',
    Assigned_To: 'Darius Thorne',
    Priority: 'Critical',
    Instructions_URL: 'https://docs.google.com/document/d/1demo-transformer-docs/edit',
    Active: true,
    Auto_Alert_Email: 'eafaadmin@gmail.com'
  },
  {
    Schedule_ID: 'SCH-304',
    Asset_ID: 'AST-006',
    Task_Name: 'UPS Weekly Cell Load Balancing Sweep',
    Frequency_Days: 7,
    // Extremely overdue task for demo alert
    Last_Done: '2026-05-01',
    Next_Due: '2026-05-08',
    Assigned_To: 'Michael Vance',
    Priority: 'High',
    Instructions_URL: 'https://docs.google.com/document/d/1demo-ups-specs/edit',
    Active: true,
    Auto_Alert_Email: 'eafaadmin@gmail.com'
  }
];

export const INITIAL_USERS: User[] = [
  {
    User_ID: 'USR-201',
    Email: 'wasiq.naveed@gmail.com',
    Name: 'Wasiq Naveed (Admin)',
    Role: 'Admin',
    Token: 'EAFA2026ADMIN',
    Token_Expires: '2026-12-31T23:59:59Z',
    Last_Login: '2026-05-22T04:30:00Z',
    Active: true
  },
  {
    User_ID: 'USR-202',
    Email: 'observer@assetops.org',
    Name: 'Global Auditor (Viewer)',
    Role: 'Viewer',
    Token: 'EAFA2026VIEW',
    Token_Expires: '2026-12-31T23:59:59Z',
    Last_Login: '2026-05-21T14:22:00Z',
    Active: true
  }
];

export const INITIAL_QR_REGISTRY: QRRegistry[] = [
  {
    QR_ID: 'QR-401',
    Asset_ID: 'AST-001',
    Token: 'AST_001_QR_TOKEN_882',
    Full_URL: '',
    Generated_Date: '2026-05-20',
    Generated_By: 'wasiq.naveed@gmail.com',
    Active: true,
    Last_Scanned: '2026-05-21T09:12:00Z',
    Scan_Count: 14
  },
  {
    QR_ID: 'QR-402',
    Asset_ID: 'AST-002',
    Token: 'AST_002_QR_TOKEN_991',
    Full_URL: '',
    Generated_Date: '2026-05-20',
    Generated_By: 'wasiq.naveed@gmail.com',
    Active: true,
    Last_Scanned: '2026-05-22T02:00:00Z',
    Scan_Count: 38
  },
  {
    QR_ID: 'QR-403',
    Asset_ID: 'AST-003',
    Token: 'AST_003_QR_TOKEN_201',
    Full_URL: '',
    Generated_Date: '2026-05-20',
    Generated_By: 'wasiq.naveed@gmail.com',
    Active: true,
    Last_Scanned: '2026-05-22T04:15:00Z',
    Scan_Count: 89
  },
  {
    QR_ID: 'QR-404',
    Asset_ID: 'AST-004',
    Token: 'AST_004_QR_TOKEN_115',
    Full_URL: '',
    Generated_Date: '2026-05-20',
    Generated_By: 'wasiq.naveed@gmail.com',
    Active: true,
    Last_Scanned: '2026-05-18T11:00:00Z',
    Scan_Count: 4
  },
  {
    QR_ID: 'QR-405',
    Asset_ID: 'AST-005',
    Token: 'AST_005_QR_TOKEN_007',
    Full_URL: '',
    Generated_Date: '2026-05-21',
    Generated_By: 'wasiq.naveed@gmail.com',
    Active: true,
    Last_Scanned: '2026-05-21T18:40:00Z',
    Scan_Count: 19
  }
];

export const INITIAL_SPARES: SparePart[] = [
  {
    Spare_ID: 'SPR-701',
    Asset_ID: 'AST-002',
    Log_ID: 'MNT-1001',
    Part_Name: 'Helical Synthetic Lubricant Compressor Oil (Grade 32)',
    Part_No: 'OIL-COMP32-GAL',
    Quantity: 5,
    Unit_Cost: 40,
    Total_Cost: 200,
    Supplier: 'Trane Supply Brooklyn',
    Date_Used: '2026-05-22'
  },
  {
    Spare_ID: 'SPR-702',
    Asset_ID: 'AST-001',
    Log_ID: 'MNT-1002',
    Part_Name: 'HEPA Microparticle Dust Filter Grid (Premium Rack Type B)',
    Part_No: 'FLT-HEPA-RB',
    Quantity: 3,
    Unit_Cost: 25,
    Total_Cost: 75,
    Supplier: 'ServerCool Solutions',
    Date_Used: '2026-04-12'
  }
];

export const INITIAL_AUDIT_TRAILS: AuditTrail[] = [
  {
    Audit_ID: 'AUD-9001',
    Timestamp: '2026-05-22T02:30:00Z',
    User_Email: 'wasiq.naveed@gmail.com',
    Action: 'UPDATE',
    Sheet_Tab: 'Assets',
    Asset_ID: 'AST-002',
    Field_Changed: 'Status',
    Old_Value: 'Active',
    New_Value: 'Under Maintenance',
    IP_Note: 'Web Dashboard Agent (192.168.1.15)'
  },
  {
    Audit_ID: 'AUD-9002',
    Timestamp: '2026-05-22T02:35:00Z',
    User_Email: 'wasiq.naveed@gmail.com',
    Action: 'CREATE',
    Sheet_Tab: 'Maintenance_Log',
    Asset_ID: 'AST-002',
    Field_Changed: 'Log_Row',
    Old_Value: '',
    New_Value: 'MNT-1001 (In Progress)',
    IP_Note: 'Web Dashboard Agent (192.168.1.15)'
  }
];

// Google Apps Script source code template for GSheet AssetOps_DB Database API Web App
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script Web App - REST-like API for AssetOps Sheet Database
 * Deploy this script as a "Web App" inside your Google Sheet:
 * 1. Open Google Sheet (Rename workbook to: AssetOps_DB)
 * 2. Click Extensions > Apps Script
 * 3. Replace all default code with this script
 * 4. Create the required tabs: Assets, Maintenance_Log, Breakdown_Log, Expenses, Schedule, Users, QR_Registry, Audit_Trail, Spares
 * 5. Set up exactly matching headers as defined in the AssetOps PRD
 * 6. Click "Deploy" > "New Deployment"
 * 7. Choose select type: "Web App"
 * 8. Set Execute as: "Me", Who has access: "Anyone"
 * 9. Copy the Web App URL and paste it into the AssetOps Dashboard integration panel!
 */

const TOKENS = {
  ADMIN: "EAFA2026ADMIN",
  VIEWER: "EAFA2026VIEW"
};

// CORS and response helpers
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleCors(response) {
  // Apps script automatically handles CORS redirects for Web Apps but let's be robust
  return response;
}

// Global schema definition for self-healing spreadsheet creation
const STANDARD_HEADERS = {
  "Assets": [
    "Asset_ID", "Name", "Category", "Sub_Category", "Location_Name", "Block", "Floor", "Zone", 
    "Latitude", "Longitude", "Is_Mobile", "Status", "Purchase_Date", "Purchase_Cost", "Current_Value", 
    "Depreciation_Method", "Warranty_Expiry", "Manufacturer", "Model", "Serial_No", "Photo_URL", 
    "Drive_Doc_URL", "Commissioned_Date", "Decommissioned_Date", "Notes", "Last_Modified_By", "Last_Modified_At"
  ],
  "Maintenance_Log": [
    "Log_ID", "Asset_ID", "Date", "Type", "Description", "Technician", "Vendor", "Duration_Hours", 
    "Labor_Cost", "Parts_Cost", "Total_Cost", "Invoice_No", "Status", "Downtime_Hours", "Root_Cause", 
    "Resolution", "Attachments_URL", "Logged_By", "Logged_At"
  ],
  "Breakdown_Log": [
    "Breakdown_ID", "Asset_ID", "Date_Reported", "Date_Resolved", "Reported_By", "Root_Cause", 
    "Impact", "Downtime_Hours", "Repair_Cost", "Parts_Used", "Resolution_Notes", "Linked_Log_ID", "Logged_At"
  ],
  "Expenses": [
    "Expense_ID", "Asset_ID", "Date", "Category", "Vendor", "Invoice_No", "Description", "Amount", 
    "Currency", "Expense_Type", "Linked_Log_ID", "Receipt_URL", "Approved_By", "Logged_By", "Logged_At"
  ],
  "Schedule": [
    "Schedule_ID", "Asset_ID", "Task_Name", "Frequency_Days", "Last_Done", "Next_Due", "Assigned_To", 
    "Priority", "Instructions_URL", "Active", "Auto_Alert_Email"
  ],
  "Users": [
    "User_ID", "Email", "Name", "Role", "Token", "Token_Expires", "Last_Login", "Active"
  ],
  "QR_Registry": [
    "QR_ID", "Asset_ID", "Token", "Full_URL", "Generated_Date", "Generated_By", "Active", "Last_Scanned", "Scan_Count"
  ],
  "Audit_Trail": [
    "Audit_ID", "Timestamp", "User_Email", "Action", "Sheet_Tab", "Asset_ID", "Field_Changed", "Old_Value", "New_Value", "IP_Note"
  ],
  "Spares": [
    "Spare_ID", "Asset_ID", "Log_ID", "Part_Name", "Part_No", "Quantity", "Unit_Cost", "Total_Cost", "Supplier", "Date_Used"
  ]
};

// Dynamically creates sheet tabs and initializes default columns if entirely blank
function getOrCreateSheetAndEnsureHeaders(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const firstRow = values[0];
  const stdHeaders = STANDARD_HEADERS[sheetName];
  
  if (stdHeaders) {
    if (values.length === 0 || (values.length === 1 && (!firstRow || firstRow.length === 0 || firstRow[0] === ""))) {
      sheet.getRange(1, 1, 1, stdHeaders.length).setValues([stdHeaders]);
      SpreadsheetApp.flush();
    }
  }
  return sheet;
}

// Smart lookup function to resolve property values securely
function getPayloadValue(payload, cleanHeader) {
  if (!payload) return "";
  
  // 1. Direct match
  if (payload[cleanHeader] !== undefined) return payload[cleanHeader];
  
  // 2. Case-insensitive alias find
  var lowerTarget = cleanHeader.toLowerCase().replace(/_/g, "");
  for (var key in payload) {
    var lowerKey = key.toLowerCase().replace(/_/g, "");
    if (lowerKey === lowerTarget) {
      return payload[key];
    }
  }
  
  // 3. Intelligent fallback aliases to bridge schema differences
  if (lowerTarget === "maintenancetype" && payload.Type !== undefined) return payload.Type;
  if (lowerTarget === "type" && payload.Maintenance_Type !== undefined) return payload.Maintenance_Type;
  if (lowerTarget === "scheduledate" && payload.Date !== undefined) return payload.Date;
  if (lowerTarget === "date" && payload.Schedule_Date !== undefined) return payload.Schedule_Date;
  if (lowerTarget === "durationhours" && payload.Duration !== undefined) return payload.Duration;
  if (lowerTarget === "downtimehours" && payload.Downtime !== undefined) return payload.Downtime;
  if (lowerTarget === "downtimestart" && payload.Date_Reported !== undefined) return payload.Date_Reported;
  if (lowerTarget === "datereported" && payload.Downtime_Start !== undefined) return payload.Downtime_Start;
  if (lowerTarget === "dateresolved" && payload.Downtime_End !== undefined) return payload.Downtime_End;
  if (lowerTarget === "downtimeend" && payload.Date_Resolved !== undefined) return payload.Downtime_Resolved;
  
  return "";
}

// Resilient header normalization to map raw columns (e.g. "Asset ID", "Sub Category", "Name ")
// to React-specific property keys dynamically, preventing spelling/spacing bugs.
function normalizeHeader(h) {
  if (!h) return "";
  var cleanHeader = String(h).trim().replace(/[\s\.\-]+/g, "_");
  var lowerClean = cleanHeader.toLowerCase();
  
  // Assets
  if (lowerClean === "assetid" || lowerClean === "asset_id" || lowerClean === "id" || lowerClean === "asset") return "Asset_ID";
  if (lowerClean === "name" || lowerClean === "asset_name") return "Name";
  if (lowerClean === "category") return "Category";
  if (lowerClean === "subcategory" || lowerClean === "sub_category") return "Sub_Category";
  if (lowerClean === "locationname" || lowerClean === "location_name" || lowerClean === "location") return "Location_Name";
  if (lowerClean === "block") return "Block";
  if (lowerClean === "floor") return "Floor";
  if (lowerClean === "zone") return "Zone";
  if (lowerClean === "latitude" || lowerClean === "lat") return "Latitude";
  if (lowerClean === "longitude" || lowerClean === "lng" || lowerClean === "long") return "Longitude";
  if (lowerClean === "is_mobile" || lowerClean === "ismobile" || lowerClean === "mobile") return "Is_Mobile";
  if (lowerClean === "status" || lowerClean === "asset_status") return "Status";
  if (lowerClean === "purchasedate" || lowerClean === "purchase_date") return "Purchase_Date";
  if (lowerClean === "purchasecost" || lowerClean === "purchase_cost" || lowerClean === "cost") return "Purchase_Cost";
  if (lowerClean === "currentvalue" || lowerClean === "current_value" || lowerClean === "value") return "Current_Value";
  if (lowerClean === "depreciationmethod" || lowerClean === "depreciation_method" || lowerClean === "depreciation") return "Depreciation_Method";
  if (lowerClean === "warrantyexpiry" || lowerClean === "warranty_expiry" || lowerClean === "warranty") return "Warranty_Expiry";
  if (lowerClean === "manufacturer" || lowerClean === "make") return "Manufacturer";
  if (lowerClean === "model") return "Model";
  if (lowerClean === "serialno" || lowerClean === "serial_no" || lowerClean === "serial" || lowerClean === "serialnumber") return "Serial_No";
  if (lowerClean === "photourl" || lowerClean === "photo_url" || lowerClean === "photo") return "Photo_URL";
  if (lowerClean === "drivedocurl" || lowerClean === "drive_doc_url" || lowerClean === "document" || lowerClean === "manual_url" || lowerClean === "manual") return "Drive_Doc_URL";
  if (lowerClean === "commissioneddate" || lowerClean === "commissioned_date" || lowerClean === "commission_date") return "Commissioned_Date";
  if (lowerClean === "decommissioneddate" || lowerClean === "decommissioned_date") return "Decommissioned_Date";
  if (lowerClean === "notes" || lowerClean === "note") return "Notes";
  if (lowerClean === "lastmodifiedby" || lowerClean === "last_modified_by") return "Last_Modified_By";
  if (lowerClean === "lastmodifiedat" || lowerClean === "last_modified_at") return "Last_Modified_At";
  
  // Maintenance Logs
  if (lowerClean === "logid" || lowerClean === "log_id") return "Log_ID";
  if (lowerClean === "scheduledate" || lowerClean === "schedule_date" || lowerClean === "date") return "Date";
  if (lowerClean === "technician" || lowerClean === "technician_name") return "Technician";
  if (lowerClean === "maintenance_type" || lowerClean === "maintenancetype" || lowerClean === "type") return "Type";
  if (lowerClean === "duration_hours" || lowerClean === "durationhours" || lowerClean === "duration") return "Duration_Hours";
  if (lowerClean === "labor_cost" || lowerClean === "laborcost") return "Labor_Cost";
  if (lowerClean === "parts_cost" || lowerClean === "partscost") return "Parts_Cost";
  if (lowerClean === "total_cost" || lowerClean === "totalcost") return "Total_Cost";
  if (lowerClean === "attachments_url" || lowerClean === "attachmentsurl") return "Attachments_URL";
  if (lowerClean === "downtime_hours" || lowerClean === "downtimehours" || lowerClean === "downtime") return "Downtime_Hours";
  if (lowerClean === "loggedby" || lowerClean === "logged_by") return "Logged_By";
  if (lowerClean === "loggedat" || lowerClean === "logged_at") return "Logged_At";
  
  // Breakdown Logs
  if (lowerClean === "breakdownid" || lowerClean === "breakdown_id") return "Breakdown_ID";
  if (lowerClean === "datereported" || lowerClean === "date_reported") return "Date_Reported";
  if (lowerClean === "dateresolved" || lowerClean === "date_resolved") return "Date_Resolved";
  if (lowerClean === "severity") return "Severity";
  if (lowerClean === "reportedby" || lowerClean === "reported_by") return "Reported_By";
  if (lowerClean === "root_cause" || lowerClean === "rootcause") return "Root_Cause";
  if (lowerClean === "impact") return "Impact";
  if (lowerClean === "repair_cost" || lowerClean === "repaircost") return "Repair_Cost";
  if (lowerClean === "parts_used" || lowerClean === "partsused") return "Parts_Used";
  if (lowerClean === "resolution_notes" || lowerClean === "resolutionnotes") return "Resolution_Notes";
  if (lowerClean === "linked_log_id" || lowerClean === "linkedlogid") return "Linked_Log_ID";
  
  // Expenses
  if (lowerClean === "expenseid" || lowerClean === "expense_id") return "Expense_ID";
  if (lowerClean === "amount") return "Amount";
  if (lowerClean === "vendor") return "Vendor";
  if (lowerClean === "invoice_no" || lowerClean === "invoiceno" || lowerClean === "invoice") return "Invoice_No";
  if (lowerClean === "expense_type" || lowerClean === "expensetype") return "Expense_Type";
  if (lowerClean === "receipt_url" || lowerClean === "receipturl") return "Receipt_URL";
  if (lowerClean === "approved_by" || lowerClean === "approvedby") return "Approved_By";
  
  // QR Registries
  if (lowerClean === "qrid" || lowerClean === "qr_id") return "QR_ID";
  if (lowerClean === "generateddate" || lowerClean === "generated_date") return "Generated_Date";
  if (lowerClean === "generatedby" || lowerClean === "generated_by") return "Generated_By";
  if (lowerClean === "active" || lowerClean === "isactive") return "Active";
  if (lowerClean === "scancount" || lowerClean === "scan_count") return "Scan_Count";
  if (lowerClean === "lastscanned" || lowerClean === "last_scanned") return "Last_Scanned";
  if (lowerClean === "fullurl" || lowerClean === "full_url") return "Full_URL";
  
  // Spares
  if (lowerClean === "spareid" || lowerClean === "spare_id") return "Spare_ID";
  if (lowerClean === "partname" || lowerClean === "part_name") return "Part_Name";
  if (lowerClean === "partnumber" || lowerClean === "part_number" || lowerClean === "part_no") return "Part_Number";
  if (lowerClean === "quantity" || lowerClean === "qty") return "Quantity";
  if (lowerClean === "unitcost" || lowerClean === "unit_cost") return "Unit_Cost";
  if (lowerClean === "totalcost" || lowerClean === "total_cost") return "Total_Cost";
  if (lowerClean === "supplier") return "Supplier";
  if (lowerClean === "dateused" || lowerClean === "date_used") return "Date_Used";
  
  var words = cleanHeader.split("_");
  for (var i = 0; i < words.length; i++) {
    if (words[i]) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
  }
  return words.join("_");
}

function doGet(e) {
  try {
    const params = e.parameter;
    const token = params.token;
    const action = params.action;
    
    if (!token) {
      return jsonResponse({ success: false, error: "Access Token is required to authenticate requests." });
    }
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      return jsonResponse({ success: false, error: "Google Sheets connection failed." });
    }
    
    // Check Authorization Role matching Users Sheet or tokens
    const userRole = validateUserToken(spreadsheet, token);
    if (!userRole) {
      // Check if it is a specific single asset token
      const qrAsset = validateQRAssetToken(spreadsheet, token);
      if (qrAsset) {
        // Is scan token: allow fetching single asset info ONLY
        if (action === "fetchSingleAsset") {
          return jsonResponse({ success: true, role: "QR_Scan", asset: fetchAssetDetails(spreadsheet, qrAsset.Asset_ID, token) });
        }
        if (action === "verifyToken") {
          return jsonResponse({ success: true, role: "QR_Scan" });
        }
        return jsonResponse({ success: false, error: "Unauthorized operation for QR asset-specific scanner mode." });
      }
      return jsonResponse({ success: false, error: "Invalid or expired authorization token." });
    }
    
    // Process Actions based on Role permissions
    if (action === "verifyToken") {
      return jsonResponse({ success: true, role: userRole });
    }

    if (action === "fetchAll") {
      const data = fetchAllTabs(spreadsheet);
      return jsonResponse({ success: true, role: userRole, data: data });
    }
    
    if (action === "fetchSingleAsset") {
      const assetId = params.assetId;
      const asset = fetchAssetDetails(spreadsheet, assetId, token);
      return jsonResponse({ success: true, role: userRole, asset: asset });
    }
    
    return jsonResponse({ success: false, error: "Unsupported or unknown API read operation requested." });
    
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const token = postData.token;
    const action = postData.action;
    
    if (!token) {
      return jsonResponse({ success: false, error: "Access Token is required to authorize operations." });
    }
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const userRole = validateUserToken(spreadsheet, token);
    
    if (!userRole) {
      // Check if asset scan reporting breakdown
      const qrAsset = validateQRAssetToken(spreadsheet, token);
      if (qrAsset && action === "reportAssetBreakdown") {
        const result = addBreakdownLog(spreadsheet, qrAsset.Asset_ID, postData.payload, "QR_Scanner_Web");
        logAuditTrail(spreadsheet, "guest-qr-scan@assetops.internal", "CREATE", "Breakdown_Log", qrAsset.Asset_ID, "Breakdown_Row", "", "Reported via QR Scan");
        return jsonResponse({ success: true, message: "Asset breakdown logged successfully.", result: result });
      }
      return jsonResponse({ success: false, error: "Unauthorized mutation request or invalid credentials." });
    }
    
    if (userRole !== "Admin") {
      return jsonResponse({ success: false, error: "Write privileges (CRUD) require Administrator role level access." });
    }
    
    let result;
    const userEmail = postData.userEmail || "dashboard-admin@assetops.org";
    
    switch (action) {
      case "saveAsset":
        result = saveOrUpdateAsset(spreadsheet, postData.payload, userEmail);
        break;
      case "logMaintenance":
        result = addMaintenanceLog(spreadsheet, postData.payload, userEmail);
        break;
      case "logBreakdown":
        result = addBreakdownLog(spreadsheet, postData.payload.Asset_ID, postData.payload, userEmail);
        break;
      case "addExpense":
        result = addExpenseEntry(spreadsheet, postData.payload, userEmail);
        break;
      case "addQRRegistry":
        result = generateQRRegistryRow(spreadsheet, postData.payload, userEmail);
        break;
      case "addSpare":
        result = addSparePartUsage(spreadsheet, postData.payload, userEmail);
        break;
      default:
        return jsonResponse({ success: false, error: "Unknown transactional write mutation method." });
    }
    
    return jsonResponse({ success: true, result: result });
    
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// Security / Authentication validation layers
function validateUserToken(spreadsheet, token) {
  if (token === TOKENS.ADMIN) return "Admin";
  if (token === TOKENS.VIEWER) return "Viewer";
  
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Users");
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return null;
  const headers = rows[0].map(normalizeHeader);
  
  const tokenCol = headers.indexOf("Token");
  const roleCol = headers.indexOf("Role");
  const activeCol = headers.indexOf("Active");
  
  if (tokenCol === -1 || roleCol === -1) return null;
  
  for (let i = 1; i < rows.length; i++) {
    const fileToken = rows[i][tokenCol];
    const role = rows[i][roleCol];
    const active = activeCol !== -1 ? rows[i][activeCol] : true;
    if (fileToken === token && (active === true || active === "TRUE" || active === "true" || activeCol === -1)) {
      return role; // Admin or Viewer
    }
  }
  return null;
}

function validateQRAssetToken(spreadsheet, token) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "QR_Registry");
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return null;
  const headers = rows[0].map(normalizeHeader);
  
  const qrIdCol = headers.indexOf("QR_ID");
  const assetIdCol = headers.indexOf("Asset_ID");
  const tokenCol = headers.indexOf("Token");
  const activeCol = headers.indexOf("Active");
  const lastScannedCol = headers.indexOf("Last_Scanned");
  const scanCountCol = headers.indexOf("Scan_Count");
  
  if (tokenCol === -1 || assetIdCol === -1) return null;
  
  for (let i = 1; i < rows.length; i++) {
    const fileToken = rows[i][tokenCol];
    const active = activeCol !== -1 ? rows[i][activeCol] : true;
    if (fileToken === token && (active === true || active === "TRUE" || active === "true" || activeCol === -1)) {
      // Increment Scanned Count securely
      if (scanCountCol !== -1) {
        const scanCount = parseInt(rows[i][scanCountCol] || 0) + 1;
        sheet.getRange(i + 1, scanCountCol + 1).setValue(scanCount);
      }
      if (lastScannedCol !== -1) {
        sheet.getRange(i + 1, lastScannedCol + 1).setValue(new Date().toISOString());
      }
      return {
        QR_ID: qrIdCol !== -1 ? rows[i][qrIdCol] : "",
        Asset_ID: rows[i][assetIdCol],
        Token: fileToken
      };
    }
  }
  return null;
}

// Fetch database records dynamically and mapped securely to client-side json arrays
function fetchAllTabs(spreadsheet) {
  return {
    assets: getSheetDataAsJson(spreadsheet, "Assets"),
    maintenanceLogs: getSheetDataAsJson(spreadsheet, "Maintenance_Log"),
    breakdownLogs: getSheetDataAsJson(spreadsheet, "Breakdown_Log"),
    expenses: getSheetDataAsJson(spreadsheet, "Expenses"),
    pmSchedules: getSheetDataAsJson(spreadsheet, "Schedule"),
    users: getSheetDataAsJson(spreadsheet, "Users"),
    qrRegistries: getSheetDataAsJson(spreadsheet, "QR_Registry"),
    spares: getSheetDataAsJson(spreadsheet, "Spares"),
    auditTrails: getSheetDataAsJson(spreadsheet, "Audit_Trail")
  };
}

function fetchAssetDetails(spreadsheet, assetId, token) {
  const allAssets = getSheetDataAsJson(spreadsheet, "Assets");
  const asset = allAssets.find(function(a) { return String(a.Asset_ID) === String(assetId) });
  if (!asset) return null;
  
  // Attach latest 5 maintenance records and breakdowns for context
  const mLogs = getSheetDataAsJson(spreadsheet, "Maintenance_Log")
    .filter(function(m) { return String(m.Asset_ID) === String(assetId) })
    .slice(-5);
  
  const bLogs = getSheetDataAsJson(spreadsheet, "Breakdown_Log")
    .filter(function(b) { return String(b.Asset_ID) === String(assetId) })
    .slice(-5);
    
  return {
    details: asset,
    maintenance: mLogs,
    breakdowns: bLogs
  };
}

function getSheetDataAsJson(spreadsheet, sheetName) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];
  
  const headers = values[0];
  const results = [];
  
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const item = {};
    for (let c = 0; c < headers.length; c++) {
      let val = row[c];
      // Convert formats if required
      if (val instanceof Date) {
        val = val.toISOString();
      }
      var cleanHeader = normalizeHeader(headers[c]);
      if (cleanHeader) {
        item[cleanHeader] = val;
      }
    }
    results.push(item);
  }
  return results;
}

// Write mutations to individual slots
function saveOrUpdateAsset(spreadsheet, asset, author) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Assets");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const assetId = asset.Asset_ID;
  
  let rowIndex = -1;
  const assetIdCol = headers.map(normalizeHeader).indexOf("Asset_ID");
  if (assetIdCol !== -1) {
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][assetIdCol]) === String(assetId)) {
        rowIndex = i + 1;
        break;
      }
    }
  }
  
  const timestamp = new Date().toISOString();
  asset.Last_Modified_By = author;
  asset.Last_Modified_At = timestamp;
  
  const newRow = headers.map(function(head) {
    var cleanHeader = normalizeHeader(head);
    return getPayloadValue(asset, cleanHeader);
  });
  
  if (rowIndex !== -1) {
    // Record Audit before writing
    const oldVal = data[rowIndex - 1].join(", ");
    const newVal = newRow.join(", ");
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([newRow]);
    logAuditTrail(spreadsheet, author, "UPDATE", "Assets", assetId, "Row", oldVal, newVal);
  } else {
    sheet.appendRow(newRow);
    logAuditTrail(spreadsheet, author, "CREATE", "Assets", assetId, "Row", "", "Asset Commissioned");
  }
  
  return { id: assetId, success: true };
}

function addMaintenanceLog(spreadsheet, log, author) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Maintenance_Log");
  const headers = sheet.getDataRange().getValues()[0];
  const id = "MNT-" + Math.floor(1000 + Math.random() * 9000);
  log.Log_ID = id;
  log.Logged_By = author;
  log.Logged_At = new Date().toISOString();
  
  const newRow = headers.map(function(h) {
    var cleanHeader = normalizeHeader(h);
    return getPayloadValue(log, cleanHeader);
  });
  sheet.appendRow(newRow);
  
  // Cascade update asset status if requested
  if (log.Status === "In Progress") {
    updateAssetStatusInSheet(spreadsheet, log.Asset_ID, "Under Maintenance", author);
  } else if (log.Status === "Completed" && log.Asset_ID) {
    updateAssetStatusInSheet(spreadsheet, log.Asset_ID, "Active", author);
  }
  
  logAuditTrail(spreadsheet, author, "CREATE", "Maintenance_Log", log.Asset_ID, "Log_ID", "", id);
  return { id: id, success: true };
}

function addBreakdownLog(spreadsheet, assetId, breakdown, author) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Breakdown_Log");
  const headers = sheet.getDataRange().getValues()[0];
  const id = "BRK-" + Math.floor(1000 + Math.random() * 9000);
  breakdown.Breakdown_ID = id;
  breakdown.Logged_At = new Date().toISOString();
  
  const newRow = headers.map(function(h) {
    var cleanHeader = normalizeHeader(h);
    return getPayloadValue(breakdown, cleanHeader);
  });
  sheet.appendRow(newRow);
  
  // Instantly mark asset status as BROKEN
  updateAssetStatusInSheet(spreadsheet, assetId, "Broken", author);
  
  logAuditTrail(spreadsheet, author, "CREATE", "Breakdown_Log", assetId, "Breakdown_ID", "", id);
  return { id: id, success: true };
}

function addExpenseEntry(spreadsheet, expense, author) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Expenses");
  const headers = sheet.getDataRange().getValues()[0];
  const id = "EXP-" + Math.floor(1000 + Math.random() * 9000);
  expense.Expense_ID = id;
  expense.Logged_By = author;
  expense.Logged_At = new Date().toISOString();
  
  const newRow = headers.map(function(h) {
    var cleanHeader = normalizeHeader(h);
    return getPayloadValue(expense, cleanHeader);
  });
  sheet.appendRow(newRow);
  
  logAuditTrail(spreadsheet, author, "CREATE", "Expenses", expense.Asset_ID, "Expense_ID", "", id);
  return { id: id, success: true };
}

function generateQRRegistryRow(spreadsheet, qr, author) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "QR_Registry");
  const headers = sheet.getDataRange().getValues()[0];
  const id = "QR-" + Math.floor(100 + Math.random() * 900);
  qr.QR_ID = id;
  qr.Generated_By = author;
  qr.Generated_Date = new Date().toISOString().split("T")[0];
  qr.Scan_Count = 0;
  qr.Active = true;
  
  const newRow = headers.map(function(h) {
    var cleanHeader = normalizeHeader(h);
    return getPayloadValue(qr, cleanHeader);
  });
  sheet.appendRow(newRow);
  
  logAuditTrail(spreadsheet, author, "CREATE", "QR_Registry", qr.Asset_ID, "QR_ID", "", id);
  return { id: id, success: true };
}

function addSparePartUsage(spreadsheet, spare, author) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Spares");
  const headers = sheet.getDataRange().getValues()[0];
  const id = "SPR-" + Math.floor(100 + Math.random() * 900);
  spare.Spare_ID = id;
  spare.Date_Used = new Date().toISOString().split("T")[0];
  
  const newRow = headers.map(function(h) {
    var cleanHeader = normalizeHeader(h);
    return getPayloadValue(spare, cleanHeader);
  });
  sheet.appendRow(newRow);
  
  logAuditTrail(spreadsheet, author, "CREATE", "Spares", spare.Asset_ID, "Spare_ID", "", id);
  return { id: id, success: true };
}

function updateAssetStatusInSheet(spreadsheet, assetId, status, updater) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Assets");
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(normalizeHeader);
  
  const statusCol = headers.indexOf("Status") + 1;
  const updaterCol = headers.indexOf("Last_Modified_By") + 1;
  const timeCol = headers.indexOf("Last_Modified_At") + 1;
  const assetIdCol = headers.indexOf("Asset_ID") + 1;
  
  if (assetIdCol <= 0) return;
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][assetIdCol - 1]) === String(assetId)) {
      if (statusCol > 0) sheet.getRange(i + 1, statusCol).setValue(status);
      if (updaterCol > 0) sheet.getRange(i + 1, updaterCol).setValue(updater);
      if (timeCol > 0) sheet.getRange(i + 1, timeCol).setValue(new Date().toISOString());
      break;
    }
  }
}

function logAuditTrail(spreadsheet, user, action, tab, assetId, field, oldVal, newVal) {
  const sheet = getOrCreateSheetAndEnsureHeaders(spreadsheet, "Audit_Trail");
  const headers = sheet.getDataRange().getValues()[0];
  const auditId = "AUD-" + Math.floor(1000 + Math.random() * 9000);
  
  const log = {
    Audit_ID: auditId,
    Timestamp: new Date().toISOString(),
    User_Email: user,
    Action: action,
    Sheet_Tab: tab,
    Asset_ID: assetId,
    Field_Changed: field,
    Old_Value: String(oldVal),
    New_Value: String(newVal),
    IP_Note: "AppsScript API Handler"
  };
  
  const newRow = headers.map(function(h) {
    var cleanHeader = normalizeHeader(h);
    return getPayloadValue(log, cleanHeader);
  });
  sheet.appendRow(newRow);
}
`;
