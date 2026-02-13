export interface Form {
        type: string,
        value: boolean | string,
        label?: string,
        children?: Record<string, Form>
}

export interface Project {
        id?: number;
        creator_id?: number;
        title?: string;
        date_created?: string;
        json?: Record<string, Record<string, Form>>;
}

export interface ProjectPreview {
        id?: number;
        creator_id?: number;
        title?: string;
        date_created?: string;
        json?: Record<string, Form>;
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

