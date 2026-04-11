import { addUserToProject, showAddUserSection, showExistingUsersSection } from "../utils";
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

addUser.sectionBtn.addEventListener("click", () => showAddUserSection());
addUser.finishBtn.addEventListener("click", async () => addUserToProject(projectId, creatorId!));
existingUsers.sectionBtn.addEventListener("click", async () => showExistingUsersSection(projectId, creatorId!));
