# Add Driver API Integration

This document describes the integration of the new Add Driver API endpoint with the frontend.

## Changes Made

### 1. API Types (`lib/types.ts`)
- Added `AddDriverRequest` interface matching the backend API schema
- Added `AddDriverResponse` interface for the API response

### 2. API Service (`lib/api.ts`) 
- Added `addDriver()` method to `ApiService` class
- Handles POST request to `/admin/add-driver` endpoint
- Includes proper error handling for validation errors and HTTP errors
- Converts frontend display values to backend status values

### 3. Add/Edit Driver Form (`components/dashboard/add-edit-driver-form.tsx`)
- Updated form labels to clarify required vs optional fields
- Employee ID is now marked as required (*)
- Driver name is now marked as optional
- Updated presence status dropdown to show "Not Logged In (Default)"
- Updated button text to be more descriptive

### 4. Dashboard Page (`app/dashboard/page.tsx`)
- Updated `handleSaveDriver()` function to use real API for adding drivers
- Converts form data to match backend API requirements
- Handles API responses and updates local state
- Provides specific error messages for different error types
- Refreshes dashboard data after successful add operation

### 5. Validation Schema (`lib/validations.ts`)
- Made driver name optional in schema to match backend requirements
- Employee ID remains required

## API Integration Details

### Request Format
```json
{
  "employee_id": "DRV004",
  "presence": "not_checked_in",
  "name": "John Smith",
  "passport": "P123456789", 
  "phone": "+971501234567",
  "email": "john@company.com",
  "hire_date": "2024-01-15"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Driver John Smith added successfully",
  "driver_info": {
    "employee_id": "DRV004",
    "name": "John Smith",
    "passport": "P123456789",
    "phone": "+971501234567", 
    "email": "john@company.com",
    "hire_date": "2024-01-15",
    "initial_status": "not_checked_in"
  }
}
```

## Error Handling

The integration handles several types of errors:

1. **Validation Errors (422)**: Shows specific field validation messages
2. **Duplicate Employee ID**: Shows user-friendly message about ID conflict
3. **HTTP Errors**: Shows server error messages
4. **Network Errors**: Shows generic failure message

## Status Mapping

Frontend presence values are automatically converted to backend status values:

- "Not Logged In" → "not_checked_in"
- "Present" → "checked_in" 
- "On Break" → "on_break"
- "Off Duty" → "off_duty"
- "Holiday" → "holiday"
- "Sick Leave" → "sick_leave"
- "Absent" → "absent"
- "Late" → "checked_in" (special case)

## User Experience

1. User clicks "Add Driver" button
2. Form opens with all optional fields except Employee ID
3. User fills required Employee ID and any optional information
4. Form validates input before submission
5. API call is made with proper data formatting
6. Success: Driver appears in table and dashboard updates
7. Error: Specific error message is shown to user

## Testing Notes

- Employee ID must be unique across all drivers
- All fields except employee_id and presence are optional
- Hire date must be in YYYY-MM-DD format if provided
- Email must be valid format if provided
- Phone and passport can be any non-empty string if provided
