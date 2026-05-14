import { PageOrigin, type Field } from "./types";
import { createInput, createTableCell, setVisibilityCheckbox } from "./utils";

export function addRiskRow(pageOrigin: PageOrigin) {
        const tbody = document.getElementById('risk-tbody') as HTMLElement;
        const riskCount = tbody.children.length;

        const isView = pageOrigin === PageOrigin.View;
        const isCreate = pageOrigin === PageOrigin.Create;

        const disabledAttr = isView ? 'disabled' : '';
        const readonlyAttr = isView ? 'readonly' : '';

        const fileControlHtml = isCreate
                ? `<input type="file" id="ocena_tveganja_prilozena_datoteka_ocene${riskCount}" class="form-control form-control-sm">`
                : `<button id="ocena_tveganja_prilozena_datoteka_ocene${riskCount}" class="default-btn" type="button" data-bs-toggle="modal" data-bs-target="#file-preview-modal">Preview</button>`;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td><input id="ocena_tveganja_ime_delovnega_mesta${riskCount}" type="text" class="form-control form-control-sm" ${disabledAttr}></td>
        <td>${fileControlHtml}</td>
        <td><input id="ocena_tveganja_lokacija_zdravstvenega_potrdila${riskCount}" type="text" class="form-control form-control-sm" ${disabledAttr}></td>
        <td class="allergy-cell">
            <input type="checkbox" id="ocena_tveganja_potreben_alergološki_pregled${riskCount}" class="form-check-input allergy-check" ${disabledAttr}>
            <label class="form-check-label">Mandatory allergy check-up</label>
            <div class="toggle-visibility">
                <div class="outlined-input mt-3">
                    <input type="text" id="ocena_tveganja_lokacija_alergolškega_pregleda${riskCount}" class="form-control form-control-sm" ${readonlyAttr}>
                    <label for="ocena_tveganja_lokacija_alergolškega_pregleda${riskCount}">Checkup location</label>
                </div>
            </div>
        </td>
        <td><button type="button" class="default-btn remove-row-btn" ${disabledAttr}>Remove</button></td>
        `;

        if (!isView) {
                const deleteBtn = newRow.querySelector(".remove-row-btn") as HTMLButtonElement;
                if (deleteBtn) {
                        deleteBtn.addEventListener("click", () => newRow.remove());
                }

                const allergyCell = newRow.querySelector(".allergy-cell") as HTMLInputElement;
                setVisibilityCheckbox(allergyCell);
        }

        tbody.appendChild(newRow);
}

export function addReportRow(pageOrigin: PageOrigin) {
        const tbody = document.getElementById("report-tbody") as HTMLElement;
        const tableRowCount = tbody.children.length;
        const tableRow = document.createElement("tr");

        const isView = pageOrigin === PageOrigin.View;
        const isCreate = pageOrigin === PageOrigin.Create;
        const cellTitles = ["ime_porocila", "primer_ali_template_porocila", "razlaga"];

        for (let i = 0; i < cellTitles.length; i++) {
                let td: HTMLTableCellElement;

                if (i === 1 && !isCreate) {
                        td = document.createElement("td");
                        const button = Object.assign(document.createElement("button"), {
                                id: `${cellTitles[i]}${tableRowCount}`,
                                type: "button",
                                className: "default-btn",
                                textContent: "Preview",
                        });
                        button.dataset.bsToggle = "modal";
                        button.dataset.bsTarget = "#file-preview-modal";
                        td.append(button);
                } else {
                        td = createTableCell(
                                "form-control form-control-sm",
                                i === 1 ? "file" : "text",
                                {
                                        id: `${cellTitles[i]}${tableRowCount}`,
                                        attributes: isView ? { disabled: "true" } : {}
                                }
                        );
                }
                tableRow.appendChild(td);
        }

        const removeBtnTd = document.createElement("td");
        const removeBtn = Object.assign(document.createElement("button"), {
                className: "default-btn remove-row-btn",
                type: "button",
                textContent: "Remove",
                disabled: isView
        });

        if (!isView) {
                removeBtn.addEventListener('click', () => tableRow.remove());
        }

        removeBtnTd.appendChild(removeBtn);
        tableRow.append(removeBtnTd);
        tbody.appendChild(tableRow);
}

export function addClientRow(pageOrigin: PageOrigin) {
        const tbody = document.getElementById("client-tbody") as HTMLElement;
        const tableRowCount = tbody.children.length;
        const isView = pageOrigin === PageOrigin.View;

        const tableRow = document.createElement('tr');
        for (const columnName of ["vloga", "ime", "telefon", "mail"]) {
                const td = createTableCell(
                        "form-control form-control-sm",
                        "text",
                        {
                                id: `${columnName}-dodano-${tableRowCount}`,
                                attributes: isView ? { disabled: "true" } : {}
                        }
                )
                tableRow.appendChild(td);
        }


        const removeBtnTd = document.createElement("td") as HTMLTableCellElement;

        const removeBtn = Object.assign(document.createElement("button"), {
                className: "default-btn remove-row-btn",
                type: "button",
                textContent: "Remove",
                disabled: isView
        });
        if (!isView) {
                removeBtn.addEventListener('click', () => tableRow.remove());
        }
        removeBtnTd.appendChild(removeBtn);

        tableRow.appendChild(removeBtnTd);
        tbody.appendChild(tableRow);
}

export function addSalaryRow(pageOrigin: PageOrigin) {
        const tbody = document.getElementById("salary-tbody") as HTMLElement;
        const tableRowCount = tbody.children.length;
        const isView = pageOrigin == PageOrigin.View;

        const tableRow = document.createElement("tr") as HTMLTableRowElement;
        for (const cellTitle of ["delovno_mesto", "bruto", "lokacija"]) {
                const td = createTableCell(
                        "form-control form-control-sm",
                        "text",
                        {
                                id: `${cellTitle}${tableRowCount}`,
                                attributes: isView ? { disabled: "true" } : {}
                        },
                );

                tableRow.appendChild(td);
        }

        const removeBtnTd = document.createElement("td") as HTMLTableCellElement;

        const removeBtn = Object.assign(document.createElement("button"), {
                className: "default-btn remove-row-btn",
                type: "button",
                textContent: "Remove",
                disabled: isView
        });
        if (!isView) {
                removeBtn.addEventListener('click', () => tableRow.remove());
        }
        removeBtnTd.appendChild(removeBtn);

        tableRow.appendChild(removeBtnTd);
        tbody.appendChild(tableRow);
}

export function addExtraFields(field: Field) {
        if (!field.headElement || !field.label || field.label.length == 0) {
                console.log(field)
                return;
        }

        const inputsParentDiv = field.headElement.querySelector(".inputs-parent") as HTMLDivElement;
        const fileParentDiv = inputsParentDiv.querySelector(".file-parent-div") as HTMLDivElement;
        const isView = field.pageOrigin == PageOrigin.View;

        const baseId = `${field.headElement.dataset.group}-${inputsParentDiv.children.length}`;

        const wrapper = Object.assign(document.createElement('div'), {
                className: "form-check mt-2"
        });
        const checkbox = createInput({
                id: `${baseId}-checkbox`,
                className: 'form-check-input',
                type: 'checkbox',
                label: field.label,
                disabled: isView,
        });
        const label = Object.assign(document.createElement('label'), {
                className: "form-check-label",
                textContent: field.label,
        });
        const removeBtn = Object.assign(document.createElement('button'), {
                type: "button",
                className: "remove-row-btn ms-3",
                textContent: "Remove",
                disabled: isView
        });

        const toggleVisibility = createToggleVisibility({
                baseId: baseId,
                textInputCount: field.textInputCount,
                hasFileInput: field.hasFileInput,
                pageOrigin: field.pageOrigin,
        } as Field)

        if (!isView) {
                checkbox.addEventListener("click", () => setVisibilityCheckbox(wrapper));
                removeBtn.addEventListener("click", () => {
                        wrapper.remove();
                });
        }

        wrapper.append(checkbox, label, removeBtn)
        if (toggleVisibility) {
                wrapper.append(toggleVisibility);
        }

        if (fileParentDiv) {
                inputsParentDiv.insertBefore(wrapper, fileParentDiv);
        }
        else {
                inputsParentDiv.appendChild(wrapper);
        }
}

function createToggleVisibility(field: Field): HTMLDivElement | null {
        if (field.textInputCount == 0 && !field.hasFileInput) return null;
        const toggleVisibility = Object.assign(document.createElement('div'), {
                className: `toggle-visibility ${field.pageOrigin == PageOrigin.View ? 'shown' : ''}`
        });

        if (field.textInputCount) {
                const splitDiv = document.createElement('div');

                for (let i = 1; i <= field.textInputCount; i++) {
                        const textInput = createInput({
                                id: `${field.baseId}-text-${i}`,
                                className: 'form-control form-control-sm mb-2',
                                type: 'text'
                        });
                        splitDiv.appendChild(textInput);
                }
                toggleVisibility.appendChild(splitDiv);
        }

        if (field.hasFileInput) {
                const isCreate = field.pageOrigin === PageOrigin.Create;
                const elemType = isCreate ? "input" : "button";

                const fileElem = Object.assign(document.createElement(elemType), {
                        id: `${field.baseId}-file`,
                        className: isCreate ? "form-control form-control-sm" : "default-btn",
                        type: isCreate ? "file" : "button",
                        textContent: "Preview"
                });

                if (!isCreate) {
                        fileElem.dataset.bsToggle = "modal";
                        fileElem.dataset.bsTarget = "#file-preview-modal";
                }

                toggleVisibility.appendChild(fileElem);
        }

        return toggleVisibility
}
