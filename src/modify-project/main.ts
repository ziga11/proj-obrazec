import "./events"
import { ProjectService } from "../fetch";
import { PageOrigin, type Field, type Form } from "../types";
import { setVisibilityCheckbox } from "../utils";
import { addClientRow, addExtraFields, addReportRow, addRiskRow, addSalaryRow } from "../addFields";

const params = new URLSearchParams(window.location.search);
const projectId = Number(params.get("id") as string);

const project = await ProjectService.fetch(projectId);

const firstDayForm = project.json!.obvescanje_za_1_dan.obvescanje_1_dan;
const firstDayHTML = document.querySelector("#obvescanje_1_dan") as HTMLTextAreaElement;

if (firstDayForm) {
        firstDayHTML.value = firstDayForm.value as string;
}

const specificsForm = project.json!.dodatne_specifike_ifr.tinymce;

tinymce.init({
        selector: '#dodatne_specifike',
        plugins: 'advlist autolink lists link charmap preview anchor',
        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        menubar: false,
        content_style: `body { color: white; }`,
        setup: function(editor: any) {
                editor.on('init', function() {
                        if (specificsForm?.value) {
                                editor.setContent(specificsForm.value as string);
                        }
                });
        }
});


delete project.json!.dodatne_specifike_ifr;

for (const [heading, headRecord] of Object.entries(project.json!)) {
        for (const [id, form] of Object.entries(headRecord)) {
                processForm(heading, id, form)
        }
}

function processForm(heading: string, id: string, form: Form) {
        const selector = `[data-group='${heading}'] #${id}`;
        let htmlElement = document.querySelector(selector) as HTMLInputElement | null;
        if (!htmlElement) {
                if (id.includes("modal") || id.includes(".")) {
                        return;
                }
                createElement(heading, form);

                htmlElement = document.querySelector(selector) as HTMLInputElement;
        }


        if (form.type === "text") {
                htmlElement.value = form.value as string;
        }
        else if (form.type === "file") {
                const parentDiv = htmlElement.closest("div") as HTMLDivElement;
                const visibilityDiv = parentDiv.querySelector(".toggle-visibility") as HTMLDivElement | undefined;

                if (visibilityDiv && form.value != undefined) {
                        visibilityDiv.classList.add("shown");
                }

                htmlElement.textContent! = "Preview" as string;
                htmlElement.dataset.file_url = form.value as string;
        }
        else if (["checkbox", "radio"].includes(form.type)) {
                const parent = htmlElement.closest("div, td") as HTMLDivElement | HTMLTableCellElement;
                htmlElement.addEventListener("click", () => setVisibilityCheckbox(parent));
                const visibilityDiv = parent.querySelector(".toggle-visibility") as HTMLDivElement | undefined;

                htmlElement.checked = form.value as boolean;
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
                        addReportRow(PageOrigin.Modify);
                        break;
                case "placa":
                        addSalaryRow(PageOrigin.Modify);
                        break;
                case "ocena_tveganja_za_delovno_mesto":
                        addRiskRow(PageOrigin.Modify);
                        break;
                case "vloge_oseb":
                        addClientRow(PageOrigin.Modify);
                        break;
                default:
                        const headingElem = document.querySelector(`[data-group='${heading}']`) as HTMLDivElement;
                        if (!form.children) {
                                if (!form.label) {
                                        console.log(form, heading)
                                        return;
                                }
                                addExtraFields({
                                        headElement: headingElem,
                                        label: form.label!,
                                        pageOrigin: PageOrigin.Modify,
                                } as Field);
                        }
                        else {
                                const keys = Object.keys(form.children);

                                const addFile = form.children[keys[0]].type === "file";

                                if (!form.label) {
                                        console.log(form, heading)
                                        return;
                                }
                                addExtraFields({
                                        headElement: headingElem,
                                        label: form.label!,
                                        textInputCount: keys.length - Number(addFile),
                                        hasFileInput: addFile,
                                        pageOrigin: PageOrigin.Modify,
                                } as Field);
                        }
        }

}
