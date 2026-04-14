import { upsertProject } from "../utils";
import { addExtraFields, addClientRow, addReportRow, addRiskRow, addSalaryRow } from "../addFields";
import { addClientInfo, addSalaryField, addReportField, addRiskAssesmentField, form, modal, deltaFileMap } from "./html";
import { PageOrigin, type Field } from "../types";

addRiskAssesmentField.addEventListener("click", () => addRiskRow(PageOrigin.Create));
addSalaryField.addEventListener("click", () => addSalaryRow(PageOrigin.Create));
addReportField.addEventListener("click", () => addReportRow(PageOrigin.Create));
addClientInfo.addEventListener("click", () => addClientRow(PageOrigin.Create));

modal.div.addEventListener('show.bs.modal', (event: any) => {
        const btn = event.relatedTarget as HTMLInputElement;
        const heading = btn.closest('[data-group]') as HTMLDivElement;

        modal.div.dataset.heading = heading.dataset.group;
});

modal.addFieldPopup.addEventListener("click", () => {
        const heading = document.querySelector(`[data-group=${modal.div.dataset.heading}]`) as HTMLDivElement;
        const title = modal.titleInput.value.trim();
        const textInputs = modal.fieldSelect.value;
        const hasFileInput = modal.fileCheck.checked;

        addExtraFields({
                headElement: heading,
                label: title,
                textInputCount: Number(textInputs),
                hasFileInput: hasFileInput,
                pageOrigin: PageOrigin.Create
        } as Field);

        modal.titleInput.value = "";
        modal.fieldSelect.value = "0";
        modal.fileCheck.checked = false;
});

form.addEventListener("submit", async (event: Event) => {
        event.preventDefault();

        const projectId = await upsertProject(form, deltaFileMap);

        if (projectId != -1) {
                window.location.href = `/pages/view.html?id=${projectId}`;
        }
});
