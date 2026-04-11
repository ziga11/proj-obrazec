export const projectTitle = document.getElementById("project-title") as HTMLTitleElement;

export const editButton = document.getElementById("edit-button") as HTMLButtonElement;

export const manageButton = document.getElementById("manage-users-button") as HTMLButtonElement;

export const tinymce = document.getElementById("tinymce") as HTMLBodyElement;

export const fileModal = {
        div: document.getElementById("file-preview-modal") as HTMLDivElement,
        iFrame: document.getElementById("modal-pdf") as HTMLIFrameElement,
        download: document.getElementById("download") as HTMLAnchorElement,
}
export const toastContainer = document.getElementById("toast-container") as HTMLDivElement;

export const manageUsersModal = {
        modal: document.getElementById("manage-added-users") as HTMLDivElement,

        addUser: {
                sectionBtn: document.getElementById("add-users-section-btn") as HTMLInputElement,
                section: document.getElementById("add-users-section") as HTMLDivElement,
                email: document.getElementById("add-user-email") as HTMLInputElement,
                permission: document.getElementById("add-user-permission") as HTMLSelectElement,
                finishBtn: document.getElementById("finish-adding-user") as HTMLButtonElement,
        },
        existing: {
                sectionBtn: document.getElementById("existing-users-section-btn") as HTMLInputElement,
                section: document.getElementById("existing-users-section") as HTMLDivElement,
        },
}
