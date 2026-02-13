import { PageOrigin, type Field } from "../types";
import { addFileToMap, upsertProject } from "../utils";
import { addClientRow, addExtraFields, addReportRow, addRiskRow, addSalaryRow } from "../addFields";
import { addClientInfo, addReportField, addRiskAssesmentField, addSalaryField, deltaFileMap, form, modalAddFields, modalPreview } from "./html";

addRiskAssesmentField.addEventListener("click", () => addRiskRow(PageOrigin.Modify));
addSalaryField.addEventListener("click", () => addSalaryRow(PageOrigin.Modify));
addReportField.addEventListener("click", () => addReportRow(PageOrigin.Modify));
addClientInfo.addEventListener("click", () => addClientRow(PageOrigin.Modify));

modalAddFields.div.addEventListener('show.bs.modal', (event: any) => {
        const btn = event.relatedTarget as HTMLInputElement;
        const heading = btn.closest('[data-group]') as HTMLDivElement;

        modalAddFields.div.dataset.heading = heading.dataset.group;
});

modalAddFields.addField.addEventListener("click", () => {
        const heading = document.querySelector(`[data-group=${modalAddFields.div.dataset.heading}]`) as HTMLDivElement;
        const title = modalAddFields.titleInput.value.trim();
        const textInputs = modalAddFields.fieldSelect.value;
        const fileInput = modalAddFields.fileCheck.checked;

        addExtraFields({
                headElement: heading,
                label: title,
                textInputCount: Number(textInputs),
                hasFileInput: fileInput,
                pageOrigin: PageOrigin.Modify,
        } as Field);

        modalAddFields.titleInput.value = "";
        modalAddFields.fieldSelect.value = "0";
        modalAddFields.fileCheck.checked = false;
});


modalPreview.div.addEventListener("show.bs.modal", (event: any) => {
        const btn = event.relatedTarget as HTMLButtonElement;
        modalPreview.showOrigin = btn;
        const noAttachmentsFileId = "1LKTOgCe4ZUmxXQa8MarDGmoIMyzHMn0W"

        let fileId = btn.dataset.file_url || noAttachmentsFileId;
        modalPreview.div.dataset.file_url = fileId;

        if (fileId == "undefined") {
                fileId = noAttachmentsFileId;
        }

        const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

        modalPreview.iFrame.src = previewUrl;
});

modalPreview.download.addEventListener("click", async (e) => {
        e.preventDefault();

        const fileId = modalPreview.div.dataset.file_url;
        if (!fileId || fileId == "") return;

        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        window.open(downloadUrl, '_blank');
});


modalPreview.fileSelect.addEventListener("change", () => {
        modalPreview.showOrigin!.textContent = `Predogled (spremenjeno)`
        const btn = modalPreview.showOrigin as HTMLButtonElement;

        const file = modalPreview.fileSelect.files![0];

        addFileToMap(deltaFileMap, btn, file);
});

modalPreview.div.addEventListener("hide.bs.modal", () => {
        modalPreview.fileSelect.value = "";
});

form.addEventListener("submit", async (event: Event) => {
        event.preventDefault();
        const projectId = await upsertProject(form, deltaFileMap);

        if (projectId != -1) {
                window.location.href = `/pages/view.html?id=${projectId}`;
        }
});
