export const addTextBoxes = document.getElementsByClassName("show-text-box") as HTMLCollectionOf<HTMLDivElement>;
export const addTextAndNumberBoxes = document.getElementsByClassName("show-text-and-number-box") as HTMLCollectionOf<HTMLDivElement>;
export const fileInputDivs = document.getElementsByClassName('show-file-input') as HTMLCollectionOf<HTMLDivElement>;
export const addTextToSliders = document.getElementsByClassName("show-text-box-slider") as HTMLCollectionOf<HTMLDivElement>;
export const allFileInputs = document.querySelectorAll("input[type='file']") as NodeListOf<HTMLInputElement>;

export const addReportField = document.getElementById("add_report_field") as HTMLButtonElement;
export const addSalaryField = document.getElementById("add_salary_field") as HTMLButtonElement;
export const addClientInfo = document.getElementById("add_client_info") as HTMLButtonElement;
export const addRiskAssesmentField = document.getElementById("add_risk_assesment") as HTMLButtonElement;

export const modal = {
        div: document.getElementById('add-field-modal') as HTMLDivElement,
        titleInput: document.querySelector('.modal-label-input') as HTMLInputElement,
        fileCheck: document.querySelector('.modal-add-file') as HTMLInputElement,
        fieldSelect: document.querySelector('.modal-select') as HTMLSelectElement,
        addFieldPopup: document.getElementById("add-field-btn") as HTMLButtonElement
}

export const deltaFileMap: Map<string, File> = new Map();

export const form: HTMLFormElement = document.querySelector('form') as HTMLFormElement;
