import { ProjectService } from "../fetch";
import type { Account } from "../types";
import { showToast } from "../utils";
import { editButton, fileModal, manageUsersModal } from "./html";

const params = new URLSearchParams(window.location.search);
const projectId = Number(params.get("id") as string);
const creatorId = localStorage.getItem("creator_id");

editButton.addEventListener("click", () => {
        window.location.href = `/pages/modify.html?id=${projectId}`
});


fileModal.div.addEventListener("show.bs.modal", (event: any) => {
        const noAttachmentsFileId = "1LKTOgCe4ZUmxXQa8MarDGmoIMyzHMn0W";
        const btn = event.relatedTarget as HTMLInputElement;

        let fileId = btn.dataset.file_url || noAttachmentsFileId;
        fileModal.div.dataset.file_url = fileId;

        if (fileId == "undefined") {
                fileId = noAttachmentsFileId;
        }

        const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

        fileModal.iFrame.src = previewUrl;
});

fileModal.download.addEventListener("click", async (e) => {
        e.preventDefault();

        const fileId = fileModal.div.dataset.file_url;
        if (!fileId) return;

        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        window.open(downloadUrl, '_blank');
});

const addUser = manageUsersModal.addUser;
const existingUsers = manageUsersModal.existing;

addUser.sectionBtn.addEventListener("click", () => {
        addUser.section.style.display = "block";
        addUser.finishBtn.style.display = "block";
        existingUsers.section.style.display = "none";
});

const toastContainer = document.getElementById("toast-container") as HTMLDivElement;

addUser.finishBtn.addEventListener("click", async () => {
        const email = addUser.email.value.trim();
        const permission = addUser.permission.value;


        if ([email, permission].includes("")) return;

        try {
                await ProjectService.addUserToProject(projectId, email, Number(permission));
                showToast(toastContainer, `user (${email}) has been successfully added`);
        }
        catch (err) {
                showToast(toastContainer, `Adding user has failed ${err}`);
        }
});

existingUsers.sectionBtn.addEventListener("click", async () => {
        existingUsers.section.style.display = "grid";
        addUser.finishBtn.style.display = "none";
        addUser.section.style.display = "none";

        const accs = await ProjectService.addedAccountsToProject(projectId);

        existingUsers.section.innerHTML = "";
        for (const acc of accs) {
                const accDiv = accountListing(acc);
                existingUsers.section.appendChild(accDiv);
        }
});


function accountListing(acc: Account): HTMLDivElement {
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
