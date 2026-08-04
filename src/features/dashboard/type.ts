export interface User {
    id: string;
    name: string;
    emainl: string;
    role: 'admin'|'user';
    status: 'active'|'inactive';
    lastActive: string; 
    totalExpenses: number;
}
export interface DashboardStats{
    totalUsers: number;
    totalProcess: number;
    inActiveUsers: number;
}
export interface AIStatus{
    ocr:number;
    voice: number;
    categoraization: number;
}

export interface UserSummary{
    totalUsers:number;
    totalAdmins:number;
    totalActiveUsers:number;
    newUsersToday:number;
}
