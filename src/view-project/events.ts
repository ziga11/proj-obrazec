import { modal } from "./html";

modal.div.addEventListener("show.bs.modal", (event: any) => {
        const noAttachmentsFileId = "1LKTOgCe4ZUmxXQa8MarDGmoIMyzHMn0W";
        const btn = event.relatedTarget as HTMLInputElement;

        let fileId = btn.dataset.file_url || noAttachmentsFileId;
        modal.div.dataset.file_url = fileId;

        if (fileId == "undefined") {
                fileId = noAttachmentsFileId;
        }

        const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

        modal.iFrame.src = previewUrl;
});

modal.download.addEventListener("click", async (e) => {
        e.preventDefault();

        const fileId = modal.div.dataset.file_url;
        if (!fileId) return;

        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        window.open(downloadUrl, '_blank');
});
