import "./events";
import { ProjectService } from "../fetch";
import { PageOrigin, projectPermission, type Field, type Form } from "../types";
import { addClientRow, addExtraFields, addReportRow, addRiskRow, addSalaryRow } from "../addFields";
import { editButton, manageButton, projectTitle } from "./html";
import { setVisibilityCheckbox } from "../utils";

const params = new URLSearchParams(window.location.search);
const projectId = Number(params.get("id") as string);

const project = await ProjectService.fetch(projectId);

projectTitle.innerText = project.title!;
localStorage.setItem("creator_id", `${project.creator_id}`);
localStorage.setItem("permission_id", `${project.permission_id}`);

if (project.permission_id == projectPermission.View) {
        editButton.disabled = true;
        editButton.style.display = "none";
}

if (project.permission_id != projectPermission.All) {
        manageButton.disabled = true;
        manageButton.style.display = "none";
}

const specificsForm = project.json!.dodatne_specifike_ifr.tinymce;
delete project.json!.dodatne_specifike_ifr;

tinymce.init({
        selector: '#dodatne_specifike',
        plugins: 'advlist autolink lists link charmap preview anchor',
        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        menubar: false,
        content_style: `body { color: white; }`,
        setup: (editor: any) => {
                editor.on('init', () => {
                        if (!specificsForm?.value) return;
                        editor.setContent(specificsForm.value as string);
                });
        }
});

for (const [heading, headRecord] of Object.entries(project.json!)) {
        for (const [id, form] of Object.entries(headRecord)) {
                processForm(heading, id, form)
        }
}

function processForm(heading: string, id: string, form: Form) {
        let htmlElement = document.querySelector(`[data-group='${heading}'] #${id}`) as HTMLInputElement | null;
        if (!htmlElement) {
                if (id.includes("modal") || id.includes(".")) {
                        return;
                }

                createElement(heading, form);
                htmlElement = document.querySelector(`[data-group='${heading}'] #${id}`) as HTMLInputElement;
        }


        if (form.type === "text") {
                htmlElement.value = form.value as string;
                htmlElement.readOnly = true;
        }
        else if (form.type === "file") {
                if (form.value == undefined) return;
                htmlElement.textContent! = "Predogled" as string;
                htmlElement.dataset.file_url = form.value as string;

                const parentDiv = htmlElement.closest("div") as HTMLDivElement;

                const visibilityDiv = parentDiv.querySelector(".toggle-visibility") as HTMLDivElement | undefined;
                if (visibilityDiv) {
                        visibilityDiv.classList.add("shown");
                }
        }
        else if (["checkbox", "radio"].includes(form.type)) {
                const parent = htmlElement.closest("div, td") as HTMLDivElement | HTMLTableCellElement;
                htmlElement.addEventListener("click", () => setVisibilityCheckbox(parent));
                const visibilityDiv = parent.querySelector(".toggle-visibility") as HTMLDivElement | undefined;

                htmlElement.checked = form.value as boolean;
                htmlElement.disabled = true;
                if (visibilityDiv && form.value == true) {
                        visibilityDiv.classList.add("shown");
                }

                if (form.label) {
                        htmlElement.dataset.label = form.label
                }
        }

        if (!form.children)
                return;

        for (const [childId, childForm] of Object.entries(form.children)) {
                processForm(heading, childId, childForm);
        }
}

function createElement(heading: string, form: Form) {
        switch (heading) {
                case "porocilo":
                        addReportRow(PageOrigin.View);
                        break;
                case "placa":
                        addSalaryRow(PageOrigin.View);
                        break;
                case "ocena_tveganja_za_delovno_mesto":
                        addRiskRow(PageOrigin.View);
                        break;
                case "vloge_oseb":
                        addClientRow(PageOrigin.View);
                        break;
                default:
                        const headingElem = document.querySelector(`[data-group='${heading}']`) as HTMLDivElement;
                        if (!form.children) {
                                addExtraFields({
                                        headElement: headingElem,
                                        label: form.label!,
                                        textInputCount: 0,
                                        hasFileInput: false,
                                        pageOrigin: PageOrigin.View
                                } as Field);
                        }
                        else {
                                const keys = Object.keys(form.children);
                                const addFile = form.children[keys[0]].type === "file";

                                addExtraFields({
                                        headElement: headingElem,
                                        label: form.label!,
                                        textInputCount: keys.length - Number(addFile),
                                        hasFileInput: addFile,
                                        pageOrigin: PageOrigin.View
                                } as Field);
                        }
        }

}
