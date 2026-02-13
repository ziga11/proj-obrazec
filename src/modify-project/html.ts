export const projectTitle = document.getElementById("project-title") as HTMLTitleElement;
export const deltaFileMap: Map<string, File> = new Map();

export const tinymce = document.getElementById("tinymce") as HTMLBodyElement;
export const form = document.querySelector("form") as HTMLFormElement;

export const addReportField = document.getElementById("add_report_field") as HTMLButtonElement;
export const addSalaryField = document.getElementById("add_salary_field") as HTMLButtonElement;
export const addClientInfo = document.getElementById("add_client_info") as HTMLButtonElement;
export const addRiskAssesmentField = document.getElementById("add_risk_assesment") as HTMLButtonElement;

export const modalPreview = {
        showOrigin: null as HTMLButtonElement | null,

        div: document.getElementById("file-preview-modal") as HTMLDivElement,
        iFrame: document.getElementById("modal-pdf") as HTMLIFrameElement,
        download: document.getElementById("download") as HTMLAnchorElement,
        fileSelect: document.getElementById("modal-file") as HTMLInputElement,
}

export const modalAddFields = {
        div: document.getElementById('add-field-modal') as HTMLDivElement,
        titleInput: document.querySelector('.modal-label-input') as HTMLInputElement,
        fileCheck: document.querySelector('.modal-add-file') as HTMLInputElement,
        fieldSelect: document.querySelector('.modal-select') as HTMLSelectElement,
        addField: document.getElementById("add-field-btn") as HTMLButtonElement
}
