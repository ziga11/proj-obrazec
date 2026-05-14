export interface Form {
        type: string,
        value: boolean | string,
        label?: string,
        children?: Record<string, Form>
}

export const projectPermission = {
        View: 1,
        Modify: 2,
        All: 3,
}

export interface Project {
        id?: number;
        creator_id?: number;
        title?: string;
        date_created?: string;
        json?: Record<string, Record<string, Form>>;
        permission_id: number;
}

export interface ProjectPreview {
        id?: number;
        creator_id?: number;
        title?: string;
        date_created?: string;
        json?: Record<string, Form>;
        permission_id?: number;
}

export const PageOrigin = {
        View: "view",
        Modify: "modify",
        Create: "create",
} as const;

export type PageOrigin =
        typeof PageOrigin[keyof typeof PageOrigin];

export interface Field {
        baseId?: string,
        headElement: HTMLDivElement,
        label: string,
        textInputCount?: number,
        hasFileInput?: boolean,
        pageOrigin?: PageOrigin
}

export interface Account {
        id: number;
        name: string;
        email: string;
        created_at?: Date;
        img_url?: string;
}

export interface InsertNotification {
        from_acc_id: number;
        to_acc_id?: number;
        to_acc_email?: string;
        metadata?: string;
        type: string;
        content: string;
}

export interface ReceivedNotification {
        id: number;
        from_acc: Account;
        metadata?: string;
        type: string;
        content: string;
        state: string;
        created_at: string;
}

