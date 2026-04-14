import { ProjectService } from "./fetch";
import type { Account, Form, Project } from "./types";
import { manageUsersModal, toastContainer } from "./view-project/html";

export function createTableCell(className: string, type: string,
        {
                id,
                value,
                attributes
        }: {
                id?: string,
                value?: string,
                attributes?: Record<string, string>
        }): HTMLTableCellElement {

        const td = document.createElement("td");

        const input = createInput({ className: className, type: type, id: id, value: value })

        if (attributes) {
                for (const [k, v] of Object.entries(attributes)) {
                        input.setAttribute(k, v);
                }
        }

        td.appendChild(input);
        return td;
}

export function createInput({ id, className, type, value, label, readonly = false, disabled = false }: {
        id?: string,
        className?: string,
        type: string,
        value?: string | boolean,
        label?: string,
        readonly?: boolean,
        disabled?: boolean
}) {
        const input = Object.assign(document.createElement('input'), {
                type: type,
                disabled: disabled,
                readonly: readonly,
                ...(id !== undefined && { id }),
                ...(className !== undefined && { className }),
                ...(value !== undefined && { value }),
        });

        if (label) {
                input.dataset.label = label;
        }

        return input;
}

export function setVisibilityCheckbox(parentDiv: HTMLDivElement | HTMLTableCellElement): HTMLDivElement | undefined {
        const checkbox = parentDiv.querySelector('input[type="checkbox"]') as HTMLInputElement;
        const visibilityDiv = parentDiv.querySelector(".toggle-visibility") as HTMLDivElement | undefined;
        if (!visibilityDiv) {
                return;
        }

        checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                        visibilityDiv.classList.add("shown");
                }
                else {
                        visibilityDiv.classList.remove("shown");
                }
        });
}

export function setVisibilityFile(parentDiv: HTMLDivElement) {
        const visibilityDiv = parentDiv.querySelector(".toggle-visibility") as HTMLDivElement;
        const input = parentDiv.querySelector("input[type='file']") as HTMLInputElement;

        input.addEventListener("change", (_) => {
                if (input.files === null || input.files.length === 0) {
                        visibilityDiv.classList.remove("shown");
                }
                else {
                        visibilityDiv.classList.add("shown");
                }
        });
}

export function addFileToMap(deltaFileMap: Map<string, File>, input: HTMLButtonElement | HTMLInputElement, file: File) {
        const key = getFileJsonKey(input);

        deltaFileMap.set(key, file);
}

export function getFileJsonKey(input: HTMLButtonElement | HTMLInputElement): string {
        const heading = input.closest("[data-group]") as HTMLDivElement;
        const pInput = parentInput(input);
        const groupName = heading.dataset.group;

        return pInput
                ? `${groupName}.${pInput.id}.children.${input.id}.value`
                : `${groupName}.${input.id}.value`;
}


export function fileData(deltaFileMap: Map<string, File>): FormData {
        const formData = new FormData();

        deltaFileMap.forEach((file, path) => {
                formData.append(path, file);
        });

        return formData;
}


export function projectToJson(): Record<string, any> {
        const records: Record<string, any> = {}
        const headings = document.querySelectorAll('[data-group]') as NodeListOf<HTMLDivElement>;

        for (const heading of headings) {
                records[heading.dataset.group!] = headingForms(heading);
        }

        const firstDayNotice = document.getElementById("obvescanje_1_dan") as HTMLTextAreaElement;
        records["obvescanje_za_1_dan"] = { obvescanje_1_dan: { type: "text", "value": firstDayNotice.value } as Form };


        const extraInfoIframe = document.getElementById("dodatne_specifike_ifr") as HTMLIFrameElement;
        const tinymce = extraInfoIframe.contentDocument!.querySelector("#tinymce") as HTMLBodyElement;
        records["dodatne_specifike_ifr"] = { tinymce: { type: "html", "value": tinymce.innerHTML } as Form };

        return records;
}

function headingForms(heading: HTMLDivElement): Record<string, any> {
        function processInput(elem: HTMLInputElement | HTMLButtonElement) {
                const pInput = parentInput(elem);
                if (!pInput) {
                        inputRecords[elem.id] = formRecord(elem);
                }
                else if (elem.value.trim().length > 0 || (elem.type == "button")) {
                        const parentRecord = inputRecords[pInput.id] as Record<string, any>;

                        if (parentRecord.children === undefined) {
                                parentRecord.children = {};
                        }


                        parentRecord.children[elem.id] = formRecord(elem);
                }
        }

        const query = "input, button[data-bs-target='#file-preview-modal']";
        const elems = heading.querySelectorAll(query) as NodeListOf<HTMLInputElement | HTMLButtonElement>;

        const inputRecords: Record<string, any> = {};

        for (const input of elems) {
                processInput(input);
        }

        return inputRecords;
}

export function parentInput(input: HTMLInputElement | HTMLButtonElement): HTMLInputElement | null {
        if (!["text", "file", "button"].includes(input.type)) return null;
        const visibilityDiv = input.closest(".toggle-visibility");

        if (!visibilityDiv || !visibilityDiv?.classList.contains("shown")) {
                return null;
        }

        return visibilityDiv.parentElement!.querySelector("input, button[data-file_url]") as HTMLInputElement;
}

function formRecord(elem: HTMLInputElement | HTMLButtonElement): Form {
        let value: string | boolean;
        if (elem.type == "text") {
                value = elem.value;
        }
        else if (elem.type == "file" || elem instanceof HTMLButtonElement) {
                value = elem?.dataset?.file_url ?? "";
        }
        else {
                value = elem.checked! ?? false
        }

        return {
                type: elem.type == "button" ? "file" : elem.type,
                value: value,
                ...(elem.dataset.label && { label: elem.dataset.label })
        };
}


export async function upsertProject(form: HTMLFormElement, deltaFileMap: Map<string, File>): Promise<number> {
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalBtnText = submitBtn.innerText;

        submitBtn.disabled = true;
        submitBtn.innerText = "Shranjevanje podatkov...";

        const params = new URLSearchParams(window.location.search);
        const projectId = Number(params.get("id"));
        const json = projectToJson();
        const title = json.osnovni_podatki.project.value;

        if (title.length == 0) return -1;

        /*TODO: ...*/

        const project: Project = {
                id: projectId,
                title,
                json,
                creator_id: 1
        };

        try {
                const files = fileData(deltaFileMap);
                const projectId = await ProjectService.upsert(project, files);

                if (!projectId) {
                        alert("Error occurred when creating project");
                        return -1;
                }

        } catch (err) {
                console.error(err);
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                alert(`Failed to save project: ${err instanceof Error ? err.message : String(err)}`);

                return -1
        }

        return projectId
}


export async function hydrateApp() {
        let acc: Account | null = null;
        try {
                acc = await ProjectService.isLoggedIn();
                localStorage.setItem('user_profile', JSON.stringify(acc));
        } catch (err) {
                acc = null;
                localStorage.removeItem('user_profile');

                if (window.location.pathname !== '/pages/login') {
                        window.location.href = '/pages/login';
                }
        }
}

export function showToast(toastContainer: HTMLDivElement, message: string) {
        const toast = document.createElement('div');

        const innerHTML = `
        <span>${message}</span>
        <span style="margin-right: 15px; cursor: pointer; opacity: 0.7;" onclick="this.parentElement.remove()">✕</span>`;

        Object.assign(toast, {
                className: "toast",
                innerHTML: innerHTML,
        });

        Object.assign(toast.style, {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
        });

        if (toastContainer) {
                toastContainer.appendChild(toast);
        } else {
                console.error("Toast container missing in boardElements!");
        }

        setTimeout(() => {
                toast.classList.add('toast-exit');
                toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
}

export function showAddUserSection() {
        const addUser = manageUsersModal.addUser;
        const existingUsers = manageUsersModal.existing;

        addUser.section.style.display = "block";
        addUser.finishBtn.style.display = "block";
        existingUsers.section.style.display = "none";
}

export async function addUserToProject(projectId: number, creatorId: string) {
        const addUser = manageUsersModal.addUser;

        const email = addUser.email.value.trim();
        const permission = addUser.permission.value;


        if ([email, permission].includes("")) {
                showToast(toastContainer, "Email or Permission is empty");
        }

        try {
                await ProjectService.addUserToProject(projectId, email, Number(permission));
                showToast(toastContainer, `user (${email}) has been successfully added`);
                showExistingUsersSection(projectId, creatorId);
                addUser.email.value = "";
                addUser.permission.value = "";
        }
        catch (err) {
                showToast(toastContainer, `Adding user has failed ${err}`);
        }
}

export async function showExistingUsersSection(projectId: number, creatorId: string) {
        const addUser = manageUsersModal.addUser;
        const existingUsers = manageUsersModal.existing;

        existingUsers.section.style.display = "grid";
        addUser.finishBtn.style.display = "none";
        addUser.section.style.display = "none";

        const accs = await ProjectService.addedAccountsToProject(projectId);

        const currAcc = JSON.parse(localStorage.getItem('user_profile') || '{}');

        existingUsers.section.innerHTML = "";
        for (const acc of accs) {
                if (acc.id == currAcc.id) { continue }
                const accDiv = accountListing(acc, projectId, creatorId);
                existingUsers.section.appendChild(accDiv);
        }
}

function accountListing(acc: Account, projectId: number, creatorId: string): HTMLDivElement {
        const div = Object.assign(document.createElement("div"), {
                className: "account-listing"
        });
        Object.assign(div.dataset, { "id": acc.id });

        const nameSpan = Object.assign(document.createElement("span"), { className: "acc-name", innerText: `${acc.name}\n` });
        const emailSpan = Object.assign(document.createElement("span"), { className: "acc-email", innerText: `${acc.email}` });
        div.append(nameSpan, emailSpan);

        const deleteBtn = Object.assign(document.createElement("button"), { className: "acc-del remove-row-btn", innerText: `⨯` });
        deleteBtn.addEventListener("click", () => {
                ProjectService.removeUserFromProject(projectId, acc.id);
                div.remove();
        });
        if (acc.id != Number(creatorId)) {
                div.appendChild(deleteBtn);
        }

        return div;
}
